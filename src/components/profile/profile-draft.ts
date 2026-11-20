import type { LearnerProfile } from "@/data/learner";

export const PHOTO_MAX_BYTES = 800_000;

export type ProfileDraft = Pick<
  LearnerProfile,
  | "displayName"
  | "email"
  | "phone"
  | "address"
  | "telegram"
  | "tiktok"
  | "facebook"
  | "linkedin"
  | "twitter"
  | "bio"
  | "image"
>;

export type SocialKind = "telegram" | "tiktok" | "facebook" | "linkedin" | "twitter";

export function toProfileDraft(profile: LearnerProfile): ProfileDraft {
  return {
    displayName: profile.displayName,
    email: profile.email,
    phone: profile.phone,
    address: profile.address,
    telegram: profile.telegram,
    tiktok: profile.tiktok,
    facebook: profile.facebook,
    linkedin: profile.linkedin,
    twitter: profile.twitter,
    bio: profile.bio,
    image: profile.image,
  };
}

export function formatXp(xp: number): string {
  return xp.toLocaleString("en-US");
}

export function socialHref(value: string, kind: SocialKind): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const handle = trimmed.replace(/^@/, "");
  switch (kind) {
    case "telegram":
      return `https://t.me/${handle}`;
    case "tiktok":
      return `https://www.tiktok.com/@${handle}`;
    case "facebook":
      return `https://www.facebook.com/${handle}`;
    case "linkedin":
      return `https://www.linkedin.com/in/${handle}`;
    case "twitter":
      return `https://x.com/${handle}`;
  }
}
