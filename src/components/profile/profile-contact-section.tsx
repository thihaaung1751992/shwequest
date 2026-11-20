"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import type { ProfileDraft } from "@/components/profile/profile-draft";
import ProfileField from "@/components/profile/profile-field";
import { useMessages } from "@/i18n/locale-context";

type ContactKey = "email" | "phone" | "address";

type ProfileContactSectionProps = {
  formId: string;
  editingKey: keyof ProfileDraft | null;
  email: string;
  phone: string;
  address: string;
  draftValue: string;
  onDraftValueChange: (next: string) => void;
  onStartEdit: (key: ContactKey) => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function ProfileContactSection({
  formId,
  editingKey,
  email,
  phone,
  address,
  draftValue,
  onDraftValueChange,
  onStartEdit,
  onSave,
  onCancel,
}: ProfileContactSectionProps) {
  const copy = useMessages();

  function fieldValue(key: ContactKey, saved: string) {
    return editingKey === key ? draftValue : saved;
  }

  return (
    <section aria-labelledby={`${formId}-contact`} className="bento-tile p-3 sm:p-4">
      <h3 id={`${formId}-contact`} className="px-2 pt-1 pb-2 text-base font-black tracking-tight">
        {copy.profile.contact}
      </h3>
      <dl className="grid gap-1">
        <ProfileField
          id={`${formId}-email`}
          label={copy.profile.email}
          icon={Mail}
          href={email.trim() ? `mailto:${email.trim()}` : null}
          value={fieldValue("email", email)}
          editing={editingKey === "email"}
          type="email"
          autoComplete="email"
          onChange={onDraftValueChange}
          onStartEdit={() => onStartEdit("email")}
          onSave={onSave}
          onCancel={onCancel}
        />
        <ProfileField
          id={`${formId}-phone`}
          label={copy.profile.phone}
          icon={Phone}
          href={phone.trim() ? `tel:${phone.replace(/\s+/g, "")}` : null}
          value={fieldValue("phone", phone)}
          editing={editingKey === "phone"}
          type="tel"
          autoComplete="tel"
          onChange={onDraftValueChange}
          onStartEdit={() => onStartEdit("phone")}
          onSave={onSave}
          onCancel={onCancel}
        />
        <ProfileField
          id={`${formId}-address`}
          label={copy.profile.address}
          icon={MapPin}
          value={fieldValue("address", address)}
          editing={editingKey === "address"}
          autoComplete="street-address"
          onChange={onDraftValueChange}
          onStartEdit={() => onStartEdit("address")}
          onSave={onSave}
          onCancel={onCancel}
        />
      </dl>
    </section>
  );
}
