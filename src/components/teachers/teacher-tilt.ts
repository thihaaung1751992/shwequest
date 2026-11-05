import type { PointerEvent } from "react";

const MAX_TILT_DEG = 6;
const TILT_VARS = ["--tilt-x", "--tilt-y", "--glare-x", "--glare-y"] as const;

/** Feeds pointer position to teacher-card-3d. CSS ignores it when motion is reduced. */
export function tiltCard(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;
  const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
  const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
  card.style.setProperty("--tilt-x", `${((0.5 - y) * 2 * MAX_TILT_DEG).toFixed(2)}deg`);
  card.style.setProperty("--tilt-y", `${((x - 0.5) * 2 * MAX_TILT_DEG).toFixed(2)}deg`);
  card.style.setProperty("--glare-x", `${(x * 100).toFixed(1)}%`);
  card.style.setProperty("--glare-y", `${(y * 100).toFixed(1)}%`);
}

export function resetTilt(event: PointerEvent<HTMLElement>) {
  for (const name of TILT_VARS) event.currentTarget.style.removeProperty(name);
}
