import bigInt from "big-integer";
import { Api, TelegramClient } from "telegram";
import { Logger, LogLevel } from "telegram/extensions/Logger";
import { StringSession } from "telegram/sessions";

const LIST_CAP = 200;
const LIST_BATCH = 100;
const EMPTY_GAP = 80;
const SCAN_CAP = 5000;
const LIST_TTL_MS = 3 * 60 * 1000;
const TITLE_MAX = 120;

export type VideoFile = {
  media: Api.TypeMessageMedia;
  mime: string;
  size: number;
};

export type ChannelVideo = {
  id: number;
  title: string;
  durationSec: number | null;
  size: number;
  mime: string;
};

export type ChannelVideoList = {
  videos: ChannelVideo[];
  truncated: boolean;
};

type ListEntry = {
  at: number;
  result: ChannelVideoList;
};

const globalForTelegram = globalThis as typeof globalThis & {
  __shwequestTelegram?: Promise<TelegramClient>;
  __shwequestVideoList?: Map<string, ListEntry>;
  __shwequestVideoListInflight?: Map<string, Promise<ChannelVideoList>>;
};

export function telegramClient(): Promise<TelegramClient> {
  if (!globalForTelegram.__shwequestTelegram) {
    const apiId = Number(process.env.TELEGRAM_API_ID);
    const apiHash = process.env.TELEGRAM_API_HASH;
    const botAuthToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!Number.isInteger(apiId) || apiId <= 0 || !apiHash || !botAuthToken) {
      return Promise.reject(new Error("Telegram credentials are not configured"));
    }
    const client = new TelegramClient(new StringSession(""), apiId, apiHash, {
      connectionRetries: 5,
      baseLogger: new Logger(LogLevel.NONE),
    });
    globalForTelegram.__shwequestTelegram = client
      .start({ botAuthToken })
      .then(() => client)
      .catch((error: unknown) => {
        globalForTelegram.__shwequestTelegram = undefined;
        throw error;
      });
  }
  return globalForTelegram.__shwequestTelegram;
}

function fileSize(size: bigInt.BigInteger): number | null {
  if (!size.greaterOrEquals(0) || size.greater(Number.MAX_SAFE_INTEGER)) return null;
  return size.toJSNumber();
}

export function videoFile(message: Api.Message): VideoFile | null {
  const media = message.media;
  if (!(media instanceof Api.MessageMediaDocument)) return null;
  const document = media.document;
  if (!(document instanceof Api.Document)) return null;
  const mime = document.mimeType || "video/mp4";
  const isVideo = document.attributes.some(
    (attribute) => attribute instanceof Api.DocumentAttributeVideo,
  );
  if (!isVideo && !mime.startsWith("video/")) return null;
  const size = fileSize(document.size);
  if (size === null) return null;
  return { media, mime, size };
}

function videoTitle(text: string | undefined): string {
  if (!text) return "";
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > TITLE_MAX ? flat.slice(0, TITLE_MAX) : flat;
}

function videoDuration(message: Api.Message): number | null {
  const media = message.media;
  if (!(media instanceof Api.MessageMediaDocument)) return null;
  const document = media.document;
  if (!(document instanceof Api.Document)) return null;
  for (const attribute of document.attributes) {
    if (!(attribute instanceof Api.DocumentAttributeVideo)) continue;
    const duration = attribute.duration;
    if (typeof duration !== "number" || !Number.isFinite(duration) || duration < 0) return null;
    return Math.round(duration);
  }
  return null;
}

function videoLists(): Map<string, ListEntry> {
  if (!globalForTelegram.__shwequestVideoList) {
    globalForTelegram.__shwequestVideoList = new Map();
  }
  return globalForTelegram.__shwequestVideoList;
}

function listInflight(): Map<string, Promise<ChannelVideoList>> {
  if (!globalForTelegram.__shwequestVideoListInflight) {
    globalForTelegram.__shwequestVideoListInflight = new Map();
  }
  return globalForTelegram.__shwequestVideoListInflight;
}

async function loadChannelVideos(channel: string): Promise<ChannelVideoList> {
  // Bots cannot call messages.GetHistory or messages.Search. Walk ids instead.
  const client = await telegramClient();
  const videos: ChannelVideo[] = [];
  let found = 0;
  let nextId = 1;
  let emptyRun = 0;
  let hitScanCap = false;

  while (nextId <= SCAN_CAP && emptyRun < EMPTY_GAP) {
    const batchEnd = Math.min(SCAN_CAP, nextId + LIST_BATCH - 1);
    const ids: number[] = [];
    for (let id = nextId; id <= batchEnd; id += 1) ids.push(id);
    const messages = await client.getMessages(channel, { ids });
    const byId = new Map<number, Api.Message>();
    for (const message of messages) {
      if (message instanceof Api.Message && Number.isSafeInteger(message.id) && message.id > 0) {
        byId.set(message.id, message);
      }
    }
    for (const id of ids) {
      const message = byId.get(id);
      if (!message) {
        emptyRun += 1;
        if (emptyRun >= EMPTY_GAP) break;
        continue;
      }
      emptyRun = 0;
      const video = videoFile(message);
      if (!video) continue;
      found += 1;
      videos.push({
        id: message.id,
        title: videoTitle(message.message),
        durationSec: videoDuration(message),
        size: video.size,
        mime: video.mime,
      });
      if (videos.length > LIST_CAP) videos.shift();
    }
    nextId = batchEnd + 1;
    if (nextId > SCAN_CAP && emptyRun < EMPTY_GAP) hitScanCap = true;
  }

  videos.reverse();
  return { videos, truncated: found > LIST_CAP || hitScanCap };
}

export function listChannelVideos(channel: string): Promise<ChannelVideoList> {
  const cached = videoLists().get(channel);
  if (cached && Date.now() - cached.at < LIST_TTL_MS) return Promise.resolve(cached.result);
  const pending = listInflight().get(channel);
  if (pending) return pending;
  const promise = loadChannelVideos(channel)
    .then((result) => {
      videoLists().set(channel, { at: Date.now(), result });
      return result;
    })
    .finally(() => {
      listInflight().delete(channel);
    });
  listInflight().set(channel, promise);
  return promise;
}
