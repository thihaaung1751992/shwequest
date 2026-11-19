export type SelfStudyView = "card" | "list";

export const SELF_STUDY_VIEWS: SelfStudyView[] = ["card", "list"];

/** Lessons per page on `/self-study` (card grid = 2 rows × 3 on lg). */
export const SELF_STUDY_PAGE_SIZE = 6;

export function selfStudyViewFromParam(value: string | null): SelfStudyView {
  return SELF_STUDY_VIEWS.find((view) => view === value) ?? "card";
}

export function selfStudyPageFromParam(value: string | null): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) return 1;
  return n;
}

export function selfStudyHref(view: SelfStudyView, page = 1): string {
  const params = new URLSearchParams();
  if (view !== "card") params.set("view", view);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/self-study?${query}` : "/self-study";
}

export function selfStudyVideosHref(view: SelfStudyView): string {
  return view === "card" ? "/self-study/videos" : `/self-study/videos?view=${view}`;
}
