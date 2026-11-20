import {
  BUILDERS,
  type TeamPerson,
} from "@/data/team";
import type { BuilderProfile } from "@/data/builder-profiles";
import type { TeacherAccent } from "@/data/teachers";

export type AdminTeamStatus = "live" | "soon";

export type AdminTeamRow = {
  id: string;
  label: string;
  accent: TeacherAccent;
  status: AdminTeamStatus;
  headline: string | null;
  location: string | null;
  skillGroups: number;
  roles: number;
  projectLinks: number;
  href: string;
  siteHref: string;
};

export type AdminTeamStats = {
  total: number;
  live: number;
  soon: number;
  roles: number;
  projectLinks: number;
};

export type AdminTeamProfileSummary = {
  headline: string;
  location: string;
  email: string;
  github: string;
  yearsExperience: string;
  skillGroups: number;
  skillItems: number;
  roles: number;
  projectLinks: number;
  education: number;
  languages: number;
};

export function adminTeamHref(id: string): string {
  return `/admin/team/${id}`;
}

/** Public Team profile path when the builder has a live CV. */
export function adminTeamSiteHref(id: string): string {
  return `/team/${id}`;
}

/** Live = has a BuilderProfile (matches public teamStaticParams for builders). */
export function adminTeamStatus(person: TeamPerson): AdminTeamStatus {
  return person.profile ? "live" : "soon";
}

export function builderById(id: string): TeamPerson | undefined {
  return BUILDERS.find((person) => person.id === id);
}

export function builderStaticParams(): { id: string }[] {
  return BUILDERS.map((person) => ({ id: person.id }));
}

function profileCounts(profile: BuilderProfile) {
  const projectLinks = profile.projects.reduce(
    (sum, group) => sum + group.links.length,
    0,
  );
  const skillItems = profile.skills.reduce(
    (sum, group) => sum + group.items.length,
    0,
  );
  return {
    skillGroups: profile.skills.length,
    skillItems,
    roles: profile.experience.length,
    projectLinks,
    education: profile.education.length,
    languages: profile.languages.length,
  };
}

export function getAdminTeamStats(
  builders: readonly TeamPerson[] = BUILDERS,
): AdminTeamStats {
  let live = 0;
  let roles = 0;
  let projectLinks = 0;
  for (const person of builders) {
    if (person.profile) {
      live += 1;
      const counts = profileCounts(person.profile);
      roles += counts.roles;
      projectLinks += counts.projectLinks;
    }
  }
  return {
    total: builders.length,
    live,
    soon: builders.length - live,
    roles,
    projectLinks,
  };
}

export function getAdminTeamRows(
  builders: readonly TeamPerson[] = BUILDERS,
): AdminTeamRow[] {
  return builders.map((person) => {
    const profile = person.profile;
    const counts = profile
      ? profileCounts(profile)
      : { skillGroups: 0, roles: 0, projectLinks: 0 };
    return {
      id: person.id,
      label: person.label,
      accent: person.accent,
      status: adminTeamStatus(person),
      headline: profile?.headline ?? null,
      location: profile?.location ?? null,
      skillGroups: counts.skillGroups,
      roles: counts.roles,
      projectLinks: counts.projectLinks,
      href: adminTeamHref(person.id),
      siteHref: adminTeamSiteHref(person.id),
    };
  });
}

export function getAdminTeamDetail(id: string) {
  const person = builderById(id);
  if (!person || person.kind !== "builder") return undefined;

  const status = adminTeamStatus(person);
  const profile = person.profile;
  const summary: AdminTeamProfileSummary | null = profile
    ? {
        headline: profile.headline,
        location: profile.location,
        email: profile.email,
        github: profile.github,
        yearsExperience: profile.yearsExperience,
        ...profileCounts(profile),
      }
    : null;

  return {
    person,
    status,
    summary,
    siteHref: adminTeamSiteHref(person.id),
    listHref: "/admin/team",
  };
}
