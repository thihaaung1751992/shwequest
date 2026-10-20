import Image from "next/image";

const FRAME = {
  card: "size-32 rounded-[1.4rem]",
  tile: "size-20 rounded-2xl sm:size-24",
  list: "size-14 rounded-xl",
} as const;

export default function TeacherPortrait({
  src,
  size,
}: {
  src: string;
  size: keyof typeof FRAME;
}) {
  return (
    <span
      className={`relative block shrink-0 overflow-hidden bg-stone-100 shadow-md ring-4 ring-white dark:bg-stone-800 dark:ring-slate-900 ${FRAME[size]}`}
    >
      <Image src={src} alt="" fill sizes="128px" className="object-cover" />
    </span>
  );
}
