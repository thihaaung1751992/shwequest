"use client";

import Image from "next/image";
import { X } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useMessages } from "@/i18n/locale-context";

/** Clickable portrait that opens a full-size photo dialog. */
export default function PortraitLightbox({
  src,
  label,
  children,
  className = "",
}: {
  src: string;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const copy = useMessages();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function openLightbox(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={openLightbox}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={copy.team.viewPhoto(label)}
        className={`rounded-[1.4rem] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-700 ${className}`}
      >
        {children}
      </button>

      {mounted && open
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <button
                type="button"
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]"
                aria-label={copy.team.closePhoto}
                onClick={() => setOpen(false)}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="relative z-10 flex max-h-[min(90vh,56rem)] w-full max-w-md flex-col overflow-hidden rounded-[1.75rem] border-2 border-white/20 bg-slate-950 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.65)]"
              >
                <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                  <p
                    id={titleId}
                    className="truncate text-sm font-bold text-white"
                  >
                    {label}
                  </p>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label={copy.team.closePhoto}
                    className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
                  >
                    <X aria-hidden className="size-5" />
                  </button>
                </div>
                <div className="bg-stone-900">
                  <Image
                    src={src}
                    alt={label}
                    width={800}
                    height={866}
                    sizes="(max-width: 448px) 100vw, 448px"
                    className="mx-auto h-auto max-h-[min(75vh,48rem)] w-full object-contain"
                    priority
                  />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
