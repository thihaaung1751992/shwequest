import {
  SELF_STUDY_PLAYLISTS,
  SELF_STUDY_PLAYLIST_TOPICS,
  type SelfStudyPlaylist,
  type SelfStudyPlaylistTopic,
} from "@/data/self-study-videos";

export type AdminVideoRow = {
  id: string;
  title: string;
  channel: string;
  topic: SelfStudyPlaylistTopic;
  listId: string;
  href: string;
  siteHref: string;
  watchUrl: string;
};

export type AdminVideoStats = {
  total: number;
  channels: number;
  grammar: number;
  speaking: number;
  vocabulary: number;
};

export function adminVideoHref(id: string): string {
  return `/admin/videos/${id}`;
}

export function selfStudyPlaylistById(
  id: string,
): SelfStudyPlaylist | undefined {
  return SELF_STUDY_PLAYLISTS.find((playlist) => playlist.id === id);
}

export function selfStudyPlaylistStaticParams(): { id: string }[] {
  return SELF_STUDY_PLAYLISTS.map((playlist) => ({ id: playlist.id }));
}

export function getAdminVideoStats(
  playlists: readonly SelfStudyPlaylist[] = SELF_STUDY_PLAYLISTS,
): AdminVideoStats {
  const channels = new Set<string>();
  let grammar = 0;
  let speaking = 0;
  let vocabulary = 0;

  for (const playlist of playlists) {
    channels.add(playlist.channel);
    if (playlist.topic === "grammar") grammar += 1;
    else if (playlist.topic === "speaking") speaking += 1;
    else vocabulary += 1;
  }

  return {
    total: playlists.length,
    channels: channels.size,
    grammar,
    speaking,
    vocabulary,
  };
}

export function getAdminVideoRows(
  playlists: readonly SelfStudyPlaylist[] = SELF_STUDY_PLAYLISTS,
): AdminVideoRow[] {
  return playlists.map((playlist) => ({
    id: playlist.id,
    title: playlist.title,
    channel: playlist.channel,
    topic: playlist.topic,
    listId: playlist.listId,
    href: adminVideoHref(playlist.id),
    siteHref: "/self-study/videos",
    watchUrl: playlist.watchUrl,
  }));
}

export function getAdminVideoDetail(id: string) {
  const playlist = selfStudyPlaylistById(id);
  if (!playlist) return undefined;
  return {
    playlist,
    siteHref: "/self-study/videos",
    listHref: "/admin/videos",
  };
}

/** Topic labels for admin UI (English; catalog is EN-only). */
export const ADMIN_VIDEO_TOPIC_LABEL: Record<SelfStudyPlaylistTopic, string> = {
  grammar: "Grammar",
  speaking: "Speaking",
  vocabulary: "Vocabulary",
};

export { SELF_STUDY_PLAYLIST_TOPICS };
