import {
  SITE_ADMINS,
  type SiteAdmin,
  type SiteAdminRole,
  type SiteAdminStatus,
} from "@/data/site-admins";

export type AdminSiteGateFlags = {
  userConfigured: boolean;
  passwordConfigured: boolean;
  secretConfigured: boolean;
};

export type AdminSiteControl = {
  id: string;
  label: string;
  hint: string;
  enabled: boolean;
};

export type AdminSiteOperatorRow = {
  id: string;
  displayName: string;
  email: string;
  image: string;
  role: SiteAdminRole;
  status: SiteAdminStatus;
  joinedOn: string;
};

export type AdminSiteStats = {
  operators: number;
  active: number;
  invited: number;
  disabled: number;
  gateReady: boolean;
};

export const ADMIN_SITE_ROLE_LABEL: Record<SiteAdminRole, string> = {
  owner: "Owner",
  operator: "Operator",
  viewer: "Viewer",
};

export const ADMIN_SITE_STATUS_LABEL: Record<SiteAdminStatus, string> = {
  active: "Active",
  invited: "Invited",
  disabled: "Disabled",
};

export const ADMIN_SITE_STATUSES: readonly SiteAdminStatus[] = [
  "active",
  "invited",
  "disabled",
] as const;

/** Env presence only — never return secret values. */
export function getAdminSiteGateFlags(): AdminSiteGateFlags {
  return {
    userConfigured: Boolean(process.env.SITE_GATE_USER?.length),
    passwordConfigured: Boolean(process.env.SITE_GATE_PASSWORD?.length),
    secretConfigured: Boolean(process.env.SITE_GATE_SECRET?.length),
  };
}

export function getAdminSiteControls(): readonly AdminSiteControl[] {
  return [
    {
      id: "maintenance",
      label: "Maintenance mode",
      hint: "Pause public browsing — needs AuthZ",
      enabled: false,
    },
    {
      id: "registrations",
      label: "Open registrations",
      hint: "Learner sign-up — needs AuthZ",
      enabled: false,
    },
    {
      id: "index",
      label: "Search indexing",
      hint: "Admin stays noindex; public SEO later",
      enabled: false,
    },
  ];
}

export function getAdminSiteStats(
  admins: readonly SiteAdmin[] = SITE_ADMINS,
  gate: AdminSiteGateFlags = getAdminSiteGateFlags(),
): AdminSiteStats {
  let active = 0;
  let invited = 0;
  let disabled = 0;

  for (const admin of admins) {
    if (admin.status === "active") active += 1;
    else if (admin.status === "invited") invited += 1;
    else disabled += 1;
  }

  return {
    operators: admins.length,
    active,
    invited,
    disabled,
    gateReady:
      gate.userConfigured && gate.passwordConfigured && gate.secretConfigured,
  };
}

export function getAdminSiteOperatorRows(
  admins: readonly SiteAdmin[] = SITE_ADMINS,
): AdminSiteOperatorRow[] {
  return admins.map((admin) => ({
    id: admin.id,
    displayName: admin.displayName,
    email: admin.email,
    image: admin.image,
    role: admin.role,
    status: admin.status,
    joinedOn: admin.joinedOn,
  }));
}

/** Recent demo operators for Overview activity. */
export function getAdminSiteActivityRows(limit = 3) {
  return [...SITE_ADMINS]
    .sort((a, b) => b.joinedOn.localeCompare(a.joinedOn))
    .slice(0, limit)
    .map((admin) => ({
      id: `site-admin-${admin.id}`,
      label: admin.displayName,
      kind: "Site admin",
      status:
        admin.status === "active"
          ? ("live" as const)
          : admin.status === "invited"
            ? ("soon" as const)
            : ("demo" as const),
      href: "/admin/site",
    }));
}
