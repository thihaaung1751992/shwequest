"use client";

import { useState } from "react";
import StreamPlayer from "@/components/stream-player";

export default function TestVideoPage() {
  const [messageId, setMessageId] = useState("3");
  const [src, setSrc] = useState<string | null>(null);
  const trimmed = messageId.trim();
  const idReady = /^[1-9]\d*$/.test(trimmed);

  return (
    <main className="mx-auto flex w-full max-w-page flex-col gap-6 bg-cream px-4 py-10">
      <h1 className="text-2xl font-bold text-zinc-950">Test video</h1>
      <form
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          if (!idReady) return;
          setSrc(`/api/video/${trimmed}`);
        }}
      >
        <label className="flex flex-col gap-1 text-sm font-semibold text-zinc-800">
          Message ID
          <input
            value={messageId}
            onChange={(event) => setMessageId(event.target.value)}
            inputMode="numeric"
            autoComplete="off"
            className="w-40 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
          />
        </label>
        <button
          type="submit"
          disabled={!idReady}
          className="cursor-pointer rounded-full bg-zinc-950 px-5 py-2 text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Load Video
        </button>
      </form>
      <StreamPlayer key={src ?? "empty"} src={src} />
      <p className="max-w-3xl text-sm text-zinc-600">
        This streams directly from the Telegram private channel via GramJS chunks. The
        server does not download the whole file first.
      </p>
    </main>
  );
}
