"use client";

import { AtSign, Globe, Link2, Send, Share2 } from "lucide-react";
import {
  socialHref,
  type ProfileDraft,
  type SocialKind,
} from "@/components/profile/profile-draft";
import ProfileField from "@/components/profile/profile-field";
import { useMessages } from "@/i18n/locale-context";

type ProfileSocialSectionProps = {
  formId: string;
  editingKey: keyof ProfileDraft | null;
  values: Pick<ProfileDraft, SocialKind>;
  draftValue: string;
  onDraftValueChange: (next: string) => void;
  onStartEdit: (key: SocialKind) => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function ProfileSocialSection({
  formId,
  editingKey,
  values,
  draftValue,
  onDraftValueChange,
  onStartEdit,
  onSave,
  onCancel,
}: ProfileSocialSectionProps) {
  const copy = useMessages();

  const socials = [
    { key: "telegram" as const, label: copy.profile.telegram, icon: Send },
    { key: "tiktok" as const, label: copy.profile.tiktok, icon: Share2 },
    { key: "facebook" as const, label: copy.profile.facebook, icon: Globe },
    { key: "linkedin" as const, label: copy.profile.linkedin, icon: Link2 },
    { key: "twitter" as const, label: copy.profile.twitter, icon: AtSign },
  ];

  return (
    <section aria-labelledby={`${formId}-social`} className="bento-tile p-3 sm:p-4">
      <h3 id={`${formId}-social`} className="px-2 pt-1 pb-2 text-base font-black tracking-tight">
        {copy.profile.social}
      </h3>
      <dl className="grid gap-1">
        {socials.map((item) => {
          const saved = values[item.key];
          const editing = editingKey === item.key;
          return (
            <ProfileField
              key={item.key}
              id={`${formId}-${item.key}`}
              label={item.label}
              icon={item.icon}
              href={socialHref(saved, item.key)}
              external
              value={editing ? draftValue : saved}
              editing={editing}
              placeholder={copy.profile.handleHint}
              onChange={onDraftValueChange}
              onStartEdit={() => onStartEdit(item.key)}
              onSave={onSave}
              onCancel={onCancel}
            />
          );
        })}
      </dl>
    </section>
  );
}
