import { planDaysRemaining } from "@/data/learner";
import {
  MEMBERS,
  memberById,
  type Member,
  type MemberStatus,
} from "@/data/members";
import { teacherById } from "@/data/teachers";

/** Prerender-safe plan label (no current-time). Relative days → `formatPlanLabelRelative`. */
export function formatPlanLabel(planEndsOn: string | null): string {
  if (!planEndsOn) return "No plan";
  return planEndsOn;
}

/** Relative plan label — pass a client `now` (e.g. from useEffect). */
export function formatPlanLabelRelative(
  planEndsOn: string | null,
  now: Date,
): string {
  if (!planEndsOn) return "No plan";
  const days = planDaysRemaining(planEndsOn, now);
  if (days < 0) return `Ended ${planEndsOn}`;
  if (days === 0) return `Ends today · ${planEndsOn}`;
  return `${days}d left · ${planEndsOn}`;
}

export type AdminMemberRow = {
  id: string;
  displayName: string;
  email: string;
  image: string;
  status: MemberStatus;
  planEndsOn: string | null;
  planLabel: string;
  enrolledCount: number;
  joinedOn: string;
  href: string;
  siteHref: string;
};

export type AdminMemberStats = {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  withPlan: number;
};

export const ADMIN_MEMBER_STATUS_LABEL: Record<MemberStatus, string> = {
  active: "Active",
  pending: "Pending",
  suspended: "Suspended",
};

export const ADMIN_MEMBER_STATUSES: readonly MemberStatus[] = [
  "active",
  "pending",
  "suspended",
] as const;

export function adminMemberHref(id: string): string {
  return `/admin/members/${id}`;
}

/** Public learner profile (single page until per-member routes exist). */
export function adminMemberSiteHref(): string {
  return "/profile";
}

export function getAdminMemberStats(
  members: readonly Member[] = MEMBERS,
): AdminMemberStats {
  let active = 0;
  let pending = 0;
  let suspended = 0;
  let withPlan = 0;

  for (const member of members) {
    if (member.status === "active") active += 1;
    else if (member.status === "pending") pending += 1;
    else suspended += 1;
    if (member.planEndsOn) withPlan += 1;
  }

  return {
    total: members.length,
    active,
    pending,
    suspended,
    withPlan,
  };
}

export function getAdminMemberRows(
  members: readonly Member[] = MEMBERS,
): AdminMemberRow[] {
  return members.map((member) => ({
    id: member.id,
    displayName: member.displayName,
    email: member.email,
    image: member.image,
    status: member.status,
    planEndsOn: member.planEndsOn,
    planLabel: formatPlanLabel(member.planEndsOn),
    enrolledCount: member.enrolledTeacherIds.length,
    joinedOn: member.joinedOn,
    href: adminMemberHref(member.id),
    siteHref: adminMemberSiteHref(),
  }));
}

/** Recent / sample members for Overview activity. */
export function getAdminMembersActivityRows(limit = 5) {
  return [...MEMBERS]
    .sort((a, b) => b.joinedOn.localeCompare(a.joinedOn))
    .slice(0, limit)
    .map((member) => ({
      id: `member-${member.id}`,
      label: member.displayName,
      kind: "Member",
      status:
        member.status === "active"
          ? ("live" as const)
          : member.status === "pending"
            ? ("soon" as const)
            : ("demo" as const),
      href: adminMemberHref(member.id),
    }));
}

export function enrolledTeacherLabels(
  ids: readonly string[],
): { id: string; label: string }[] {
  return ids.map((id) => ({
    id,
    label: teacherById(id)?.label ?? id,
  }));
}

export function getAdminMemberDetail(id: string) {
  const member = memberById(id);
  if (!member) return undefined;

  return {
    member,
    /** Static until the detail client hydrates relative days. */
    planLabel: formatPlanLabel(member.planEndsOn),
    teachers: enrolledTeacherLabels(member.enrolledTeacherIds),
    siteHref: adminMemberSiteHref(),
    listHref: "/admin/members",
  };
}

export { memberStaticParams } from "@/data/members";
