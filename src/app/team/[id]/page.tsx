import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import PageShell from "@/components/page-shell";
import TeamProfile from "@/components/team/team-profile";
import { teamPersonById, teamStaticParams } from "@/data/team";

type MemberParams = Promise<{ id: string }>;

export function generateStaticParams() {
  return teamStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: MemberParams;
}): Promise<Metadata> {
  const { id } = await params;
  const person = teamPersonById(id);
  if (!person) return { title: "Team · Shwequest" };
  return { title: `${person.label} · Shwequest` };
}

async function TeamMemberFromParams({ params }: { params: MemberParams }) {
  const { id } = await params;
  const person = teamPersonById(id);
  if (!person) notFound();
  if (person.kind === "builder" && !person.profile) notFound();
  if (person.comingSoon) notFound();
  return <TeamProfile person={person} />;
}

export default function TeamMemberPage({ params }: { params: MemberParams }) {
  return (
    <PageShell title="Team">
      <Suspense
        fallback={
          <div className="h-96 w-full rounded-[2rem] bg-amber-100/60 dark:bg-white/5" />
        }
      >
        <TeamMemberFromParams params={params} />
      </Suspense>
    </PageShell>
  );
}
