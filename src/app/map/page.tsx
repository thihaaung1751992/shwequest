import type { Metadata } from "next";
import { Suspense } from "react";
import RoadmapView from "@/components/roadmap/RoadmapView";
import { teacherById } from "@/data/teachers";

export const metadata: Metadata = {
  title: "Path · Shwequest",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function firstParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

async function MapFromUrl({ searchParams }: { searchParams: SearchParams }) {
  const teacherId = firstParam((await searchParams).teacher);
  const teacher = teacherId ? teacherById(teacherId) : undefined;
  return <RoadmapView key={teacher?.id ?? "none"} teacher={teacher} />;
}

export default function MapPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<RoadmapView />}>
      <MapFromUrl searchParams={searchParams} />
    </Suspense>
  );
}
