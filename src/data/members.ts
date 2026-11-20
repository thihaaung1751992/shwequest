/**
 * Demo registered learners for admin Members.
 * Swap for a real accounts feed when sign-up exists.
 */
export type MemberStatus = "active" | "pending" | "suspended";

export type Member = {
  id: string;
  displayName: string;
  image: string;
  email: string;
  phone: string;
  address: string;
  /** Plan end day (YYYY-MM-DD). Null = no plan. */
  planEndsOn: string | null;
  enrolledTeacherIds: readonly string[];
  status: MemberStatus;
  bio: string;
  /** Join / register day (YYYY-MM-DD). */
  joinedOn: string;
};

export const MEMBERS: readonly Member[] = [
  {
    id: "learner-1",
    displayName: "Learner 1",
    image: "/learner/placeholder.svg",
    email: "learner1@example.com",
    phone: "+95 9 000 000 000",
    address: "Yangon, Myanmar",
    planEndsOn: "2027-02-28",
    enrolledTeacherIds: ["teacher-1"],
    status: "active",
    bio: "Learning English one path at a time.",
    joinedOn: "2025-11-01",
  },
  {
    id: "aye-chan",
    displayName: "Aye Chan",
    image: "/learner/placeholder.svg",
    email: "aye.chan@example.com",
    phone: "+95 9 111 222 333",
    address: "Mandalay, Myanmar",
    planEndsOn: "2026-12-15",
    enrolledTeacherIds: ["teacher-1"],
    status: "active",
    bio: "Focusing on spoken patterns after work.",
    joinedOn: "2025-10-12",
  },
  {
    id: "min-khant",
    displayName: "Min Khant",
    image: "/learner/placeholder.svg",
    email: "min.khant@example.com",
    phone: "+95 9 222 333 444",
    address: "Yangon, Myanmar",
    planEndsOn: "2026-08-01",
    enrolledTeacherIds: ["teacher-1", "teacher-2"],
    status: "active",
    bio: "Map path + free lessons every week.",
    joinedOn: "2025-09-20",
  },
  {
    id: "su-myat",
    displayName: "Su Myat",
    image: "/learner/placeholder.svg",
    email: "su.myat@example.com",
    phone: "+95 9 333 444 555",
    address: "Naypyidaw, Myanmar",
    planEndsOn: null,
    enrolledTeacherIds: [],
    status: "pending",
    bio: "Just registered — waiting for plan pick.",
    joinedOn: "2026-11-18",
  },
  {
    id: "zaw-lin",
    displayName: "Zaw Lin",
    image: "/learner/placeholder.svg",
    email: "zaw.lin@example.com",
    phone: "+95 9 444 555 666",
    address: "Yangon, Myanmar",
    planEndsOn: "2026-06-30",
    enrolledTeacherIds: ["teacher-2"],
    status: "active",
    bio: "TV-series playlists for listening.",
    joinedOn: "2025-12-05",
  },
  {
    id: "hnin-ei",
    displayName: "Hnin Ei",
    image: "/learner/placeholder.svg",
    email: "hnin.ei@example.com",
    phone: "+95 9 555 666 777",
    address: "Bago, Myanmar",
    planEndsOn: null,
    enrolledTeacherIds: [],
    status: "pending",
    bio: "Email verified — profile incomplete.",
    joinedOn: "2026-11-19",
  },
  {
    id: "ko-htet",
    displayName: "Ko Htet",
    image: "/learner/placeholder.svg",
    email: "ko.htet@example.com",
    phone: "+95 9 666 777 888",
    address: "Yangon, Myanmar",
    planEndsOn: "2025-10-01",
    enrolledTeacherIds: ["teacher-1"],
    status: "suspended",
    bio: "Plan expired; access paused pending renewal.",
    joinedOn: "2025-03-14",
  },
  {
    id: "thinzar",
    displayName: "Thinzar",
    image: "/learner/placeholder.svg",
    email: "thinzar@example.com",
    phone: "+95 9 777 888 999",
    address: "Taunggyi, Myanmar",
    planEndsOn: "2027-01-10",
    enrolledTeacherIds: ["teacher-1"],
    status: "active",
    bio: "Morning study streak on free-16.",
    joinedOn: "2026-01-08",
  },
  {
    id: "aung-soe",
    displayName: "Aung Soe",
    image: "/learner/placeholder.svg",
    email: "aung.soe@example.com",
    phone: "+95 9 888 999 000",
    address: "Mawlamyine, Myanmar",
    planEndsOn: "2026-04-20",
    enrolledTeacherIds: ["teacher-3"],
    status: "suspended",
    bio: "Flagged for review — payments mismatch.",
    joinedOn: "2025-07-22",
  },
  {
    id: "may-phyu",
    displayName: "May Phyu",
    image: "/learner/placeholder.svg",
    email: "may.phyu@example.com",
    phone: "+95 9 999 000 111",
    address: "Yangon, Myanmar",
    planEndsOn: "2026-11-30",
    enrolledTeacherIds: ["teacher-1", "teacher-2"],
    status: "active",
    bio: "Teachers path + leaderboard practice.",
    joinedOn: "2026-02-14",
  },
];

export function memberById(id: string): Member | undefined {
  return MEMBERS.find((member) => member.id === id);
}

export function memberStaticParams(): { id: string }[] {
  return MEMBERS.map((member) => ({ id: member.id }));
}
