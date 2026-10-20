import Image from "next/image";
import Link from "next/link";

export default function SiteLogo() {
  return (
    <Link
      href="/"
      aria-label="Shwequest"
      className="group inline-flex shrink-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
    >
      <Image
        src="/shwequest-logo.jpg"
        alt=""
        width={560}
        height={486}
        preload
        className="h-16 w-auto rounded-xl shadow-md ring-2 ring-amber-200 transition-transform motion-safe:group-hover:scale-105 motion-safe:group-hover:-rotate-3 motion-safe:group-hover:ring-amber-400 sm:h-20"
      />
    </Link>
  );
}
