import type { Metadata } from "next";
import RoadmapView from "@/components/roadmap/RoadmapView";

export const metadata: Metadata = {
  title: "Path · Shwequest",
};

export default function MapPage() {
  return <RoadmapView />;
}
