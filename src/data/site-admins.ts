/**
 * Demo site operators for Admin → Site.
 * Swap for a real accounts feed when admin AuthZ exists.
 */
export type SiteAdminRole = "owner" | "operator" | "viewer";

export type SiteAdminStatus = "active" | "invited" | "disabled";

export type SiteAdmin = {
  id: string;
  displayName: string;
  email: string;
  image: string;
  role: SiteAdminRole;
  status: SiteAdminStatus;
  /** Join / invite day (YYYY-MM-DD). */
  joinedOn: string;
};

export const SITE_ADMINS: readonly SiteAdmin[] = [
  {
    id: "ops-1",
    displayName: "Site Owner",
    email: "owner@shwequest.local",
    image: "/learner/placeholder.svg",
    role: "owner",
    status: "active",
    joinedOn: "2025-09-01",
  },
  {
    id: "ops-2",
    displayName: "Ops Lead",
    email: "ops@shwequest.local",
    image: "/learner/placeholder.svg",
    role: "operator",
    status: "active",
    joinedOn: "2025-10-15",
  },
  {
    id: "ops-3",
    displayName: "Content Viewer",
    email: "viewer@shwequest.local",
    image: "/learner/placeholder.svg",
    role: "viewer",
    status: "invited",
    joinedOn: "2026-11-01",
  },
];

export function siteAdminById(id: string): SiteAdmin | undefined {
  return SITE_ADMINS.find((admin) => admin.id === id);
}
