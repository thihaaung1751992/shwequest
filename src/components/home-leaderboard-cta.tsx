import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

const STEPS = [
  {
    place: "2",
    height: "h-24 sm:h-28",
    tone: "bg-amber-400",
    delay: "0s",
  },
  {
    place: "1",
    height: "h-36 sm:h-44",
    tone: "bg-sky-600",
    delay: "2s",
  },
  {
    place: "3",
    height: "h-16 sm:h-20",
    tone: "bg-orange-500",
    delay: "4s",
  },
] as const;

export default function HomeLeaderboardCta() {
  return (
    <section aria-labelledby="home-leaderboard-title" className="bg-cream dark:bg-slate-950">
      <div className="mx-auto grid w-full max-w-page items-center gap-10 px-4 pt-16 pb-10 sm:gap-12 sm:pt-20 sm:pb-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-center" aria-hidden>
          <div className="relative flex w-full max-w-xs flex-col items-center sm:max-w-sm">
            <div className="flex w-full max-w-[14.5rem] items-end justify-center pt-20 sm:max-w-[17rem] sm:pt-24">
              {STEPS.map((step) => (
                <div
                  key={step.place}
                  className="relative flex w-1/3 flex-col items-center justify-end"
                >
                  {step.place === "1" ? (
                    <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-0.5 -translate-x-1/2">
                      <span
                        className="grid size-16 place-items-center motion-safe:animate-podium-star sm:size-[4.5rem]"
                        style={{ animationDelay: step.delay }}
                      >
                        <svg viewBox="0 0 64 64" className="size-full drop-shadow-sm" aria-hidden>
                          <path
                            d="M16.5 18.2c-6.2.7-9.2 4.8-8.1 9 .9 3.6 4.6 5.4 8.6 4.4l-.2-3.4c-2.4.5-4.4-.4-4.9-2.2-.6-2.2 1-4.2 4.4-4.6l.2-3.2Z"
                            fill="#f6c445"
                            stroke="#b45309"
                            strokeWidth="1.4"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M47.5 18.2c6.2.7 9.2 4.8 8.1 9-.9 3.6-4.6 5.4-8.6 4.4l.2-3.4c2.4.5 4.4-.4 4.9-2.2.6-2.2-1-4.2-4.4-4.6l-.2-3.2Z"
                            fill="#f6c445"
                            stroke="#b45309"
                            strokeWidth="1.4"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M18.2 12.4h27.6c.7 0 1.2.6 1.1 1.3l-2.2 14.2c-1.2 7.6-7.6 12.4-12.7 13.4-5.1-1-11.5-5.8-12.7-13.4L17.1 13.7c-.1-.7.4-1.3 1.1-1.3Z"
                            fill="#f6c445"
                            stroke="#b45309"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M20.4 14.6h23.2c.5 0 .8.5.7 1l-.5 2.4H20.2l-.5-2.4c-.1-.5.2-1 .7-1Z"
                            fill="#ffe08a"
                          />
                          <path
                            d="M24.2 20.2c.4 6.2 2 11.4 3.6 14.6-2.4-.8-6.4-4-7.6-9.4l-1-5.2h5Z"
                            fill="#ffe7a3"
                          />
                          <path
                            d="M30.2 41.2h3.6c.4 0 .8.3.8.8v4.2h-5.2v-4.2c0-.5.4-.8.8-.8Z"
                            fill="#f6c445"
                            stroke="#b45309"
                            strokeWidth="1.3"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M22.4 46.2h19.2c1.1 0 1.9 1 1.6 2.1l-.7 2.4c-.3.8-1 1.3-1.8 1.3H23.3c-.8 0-1.5-.5-1.8-1.3l-.7-2.4c-.3-1.1.5-2.1 1.6-2.1Z"
                            fill="#f6c445"
                            stroke="#b45309"
                            strokeWidth="1.3"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M18.6 52.4h26.8c1 0 1.8.8 1.8 1.8v1.5c0 1-.8 1.8-1.8 1.8H18.6c-1 0-1.8-.8-1.8-1.8v-1.5c0-1 .8-1.8 1.8-1.8Z"
                            fill="#ea580c"
                            stroke="#b45309"
                            strokeWidth="1.3"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </span>
                  ) : null}
                  <div
                    className={`flex w-full origin-bottom flex-col items-center justify-end rounded-t-xl motion-safe:animate-podium-press ${step.height} ${step.tone}`}
                    style={{ animationDelay: step.delay }}
                  >
                    <span className="mb-3 grid size-9 place-items-center rounded-md bg-white text-base font-extrabold text-zinc-800 shadow-sm sm:size-10 sm:text-lg">
                      {step.place}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-3 w-full max-w-[14.5rem] rounded-md bg-slate-800 sm:h-3.5 sm:max-w-[17rem]" />

            <p className="mt-5 text-center text-xl font-extrabold tracking-tight text-zinc-900 sm:text-2xl dark:text-white">
              Leaderboard
            </p>
          </div>
        </div>

        <div className="max-w-md lg:justify-self-start">
          <p className="inline-flex -rotate-2 rounded-full bg-amber-400 px-3 py-1 text-sm font-semibold text-amber-950 motion-reduce:rotate-none">
            Ranks
          </p>
          <h2
            id="home-leaderboard-title"
            className="mt-5 text-3xl leading-tight font-extrabold tracking-tight text-zinc-950 sm:text-4xl dark:text-white"
          >
            See who is climbing
          </h2>
          <p className="mt-4 text-base leading-relaxed font-medium text-zinc-600 sm:text-lg dark:text-zinc-300">
            Check the board, compare XP, and keep pace with other learners on the path.
          </p>
          <Link
            href="/leaderboard"
            className={`mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-sky-700 px-6 text-sm font-bold text-white transition-transform motion-safe:hover:-translate-y-0.5 ${FOCUS}`}
          >
            Open leaderboard
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
      <div aria-hidden className="mx-auto w-full max-w-page px-4 pb-10 sm:pb-12">
        <div className="h-0.5 w-full bg-zinc-300 [clip-path:ellipse(50%_50%_at_50%_50%)] dark:bg-white/25" />
      </div>
    </section>
  );
}
