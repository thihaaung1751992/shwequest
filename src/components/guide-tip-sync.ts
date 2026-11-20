/** Coordinates guide tips: girl waits until boy has spoken (or been dismissed). */

type Listener = () => void;

let spoken = false;
const listeners = new Set<Listener>();

/** Call on boy tip mount so a remount can speak again. */
export function resetGuideBoySpoken() {
  spoken = false;
}

export function notifyGuideBoySpoken() {
  if (spoken) return;
  spoken = true;
  for (const listener of listeners) listener();
}

/** Invokes immediately if boy already spoke (handles effect-order race). */
export function subscribeGuideBoySpoken(listener: Listener): () => void {
  if (spoken) {
    listener();
    return () => {};
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
