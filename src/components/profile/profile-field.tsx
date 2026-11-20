import { Check, Pencil, X, type LucideIcon } from "lucide-react";
import { PROFILE_FOCUS } from "@/components/profile/profile-focus";
import { useMessages } from "@/i18n/locale-context";

export default function ProfileField({
  id,
  label,
  value,
  editing,
  icon: Icon,
  href,
  external = false,
  onChange,
  onStartEdit,
  onSave,
  onCancel,
  type = "text",
  autoComplete,
  placeholder,
  saveDisabled = false,
}: {
  id: string;
  label: string;
  value: string;
  editing: boolean;
  icon: LucideIcon;
  /** Shown value becomes a link when set. */
  href?: string | null;
  external?: boolean;
  onChange: (next: string) => void;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  type?: "text" | "email" | "tel" | "url";
  autoComplete?: string;
  placeholder?: string;
  saveDisabled?: boolean;
}) {
  const copy = useMessages();
  const shown = value.trim();

  const badge = (
    <span
      aria-hidden
      className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
        editing
          ? "bg-amber-400 text-amber-950"
          : "bg-amber-100 text-amber-800 group-hover/field:bg-amber-200 dark:bg-white/10 dark:text-amber-200"
      }`}
    >
      <Icon className="size-4.5" />
    </span>
  );

  if (!editing) {
    return (
      <div className="group/field flex min-w-0 items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-amber-50/80 dark:hover:bg-white/5">
        {badge}
        <div className="min-w-0 flex-1">
          <dt className="text-[0.6875rem] font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
            {label}
          </dt>
          <dd className="truncate text-sm font-bold text-zinc-900 dark:text-zinc-50">
            {shown && href ? (
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`underline-offset-2 hover:text-sky-800 hover:underline dark:hover:text-sky-300 ${PROFILE_FOCUS}`}
              >
                {shown}
                {external ? <span className="sr-only"> ({copy.profile.opensNewTab})</span> : null}
              </a>
            ) : (
              <span className={shown ? "" : "text-zinc-400 dark:text-zinc-500"}>{shown || "—"}</span>
            )}
          </dd>
        </div>
        <button
          type="button"
          onClick={onStartEdit}
          aria-label={`${copy.profile.edit}: ${label}`}
          className={`inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-amber-800 hover:bg-amber-100 dark:text-amber-200 dark:hover:bg-white/10 ${PROFILE_FOCUS}`}
        >
          <Pencil className="size-3.5" aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 gap-3 rounded-2xl bg-amber-50 p-2 ring-2 ring-amber-300 dark:bg-white/5 dark:ring-amber-400/40">
      {badge}
      <div className="min-w-0 flex-1">
        <label
          htmlFor={id}
          className="text-[0.6875rem] font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400"
        >
          {label}
        </label>
        <input
          id={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`mt-1 w-full min-w-0 rounded-xl border-2 border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 outline-hidden dark:border-white/15 dark:bg-slate-950 dark:text-zinc-50 ${PROFILE_FOCUS}`}
        />
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={onSave}
            disabled={saveDisabled}
            className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-emerald-600 px-3 text-xs font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-500 ${PROFILE_FOCUS}`}
          >
            <Check className="size-3.5" aria-hidden />
            {copy.profile.save}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl border-2 border-amber-200 bg-white px-3 text-xs font-extrabold text-amber-950 dark:border-white/15 dark:bg-white/5 dark:text-amber-50 ${PROFILE_FOCUS}`}
          >
            <X className="size-3.5" aria-hidden />
            {copy.profile.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}
