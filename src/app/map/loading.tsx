import RoadmapSkeleton from "@/components/roadmap/roadmap-skeleton";

/** Instant route fallback while `/map` streams. */
export default function MapLoading() {
  return <RoadmapSkeleton />;
}
