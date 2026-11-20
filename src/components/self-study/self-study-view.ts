import {
  SELF_STUDY_PLAYLISTS,
  SELF_STUDY_PLAYLIST_TOPICS,
  type SelfStudyPlaylistTopic,
} from "@/data/self-study-videos";

export type SelfStudyView = "card" | "list";

export const SELF_STUDY_VIEWS: SelfStudyView[] = ["card", "list"];

/** Items per page on `/self-study` and `/self-study/videos` (card grid = 2 rows × 3 on lg). */
export const SELF_STUDY_PAGE_SIZE = 6;

/** Optional filters for `/self-study/videos` (empty = all). */
export type SelfStudyVideosFilters = {
  topic?: string;
  channel?: string;
};

export function selfStudyViewFromParam(value: string | null): SelfStudyView {
  return SELF_STUDY_VIEWS.find((view) => view === value) ?? "card";
}

export function selfStudyPageFromParam(value: string | null): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) return 1;
  return n;
}

export function selfStudyVideosTopicFromParam(value: string | null): string {
  if (!value) return "";
  return SELF_STUDY_PLAYLIST_TOPICS.includes(value as SelfStudyPlaylistTopic)
    ? value
    : "";
}

export function selfStudyVideosChannelFromParam(value: string | null): string {
  if (!value) return "";
  return SELF_STUDY_PLAYLISTS.some((playlist) => playlist.channel === value)
    ? value
    : "";
}

export function selfStudyHref(view: SelfStudyView, page = 1): string {
  const params = new URLSearchParams();
  if (view !== "card") params.set("view", view);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/self-study?${query}` : "/self-study";
}

export function selfStudyVideosHref(
  view: SelfStudyView,
  page = 1,
  filters: SelfStudyVideosFilters = {},
): string {
  const params = new URLSearchParams();
  if (view !== "card") params.set("view", view);
  if (page > 1) params.set("page", String(page));
  if (filters.topic) params.set("topic", filters.topic);
  if (filters.channel) params.set("channel", filters.channel);
  const query = params.toString();
  return query ? `/self-study/videos?${query}` : "/self-study/videos";
}
