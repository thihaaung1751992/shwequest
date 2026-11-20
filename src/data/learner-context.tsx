"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  LEARNER,
  LEARNER_STORAGE_KEY,
  parseStoredLearner,
  serializeLearnerEdits,
  type LearnerProfile,
} from "@/data/learner";

type LearnerContextValue = {
  learner: LearnerProfile;
  /** False until localStorage has been read (hydration-safe). */
  ready: boolean;
  updateLearner: (patch: Partial<LearnerProfile>) => void;
  resetLearner: () => void;
};

const LearnerContext = createContext<LearnerContextValue | null>(null);

export function LearnerProvider({ children }: { children: React.ReactNode }) {
  const [learner, setLearner] = useState<LearnerProfile>(LEARNER);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLearner(parseStoredLearner(window.localStorage.getItem(LEARNER_STORAGE_KEY)));
    setReady(true);
  }, []);

  const updateLearner = useCallback((patch: Partial<LearnerProfile>) => {
    setLearner((prev) => {
      const next = { ...prev, ...patch };
      try {
        window.localStorage.setItem(LEARNER_STORAGE_KEY, serializeLearnerEdits(next));
      } catch {
        // Quota / private mode — keep in-memory only.
      }
      return next;
    });
  }, []);

  const resetLearner = useCallback(() => {
    try {
      window.localStorage.removeItem(LEARNER_STORAGE_KEY);
    } catch {
      // ignore
    }
    setLearner(LEARNER);
  }, []);

  const value = useMemo(
    () => ({ learner, ready, updateLearner, resetLearner }),
    [learner, ready, updateLearner, resetLearner],
  );

  return <LearnerContext.Provider value={value}>{children}</LearnerContext.Provider>;
}

export function useLearner(): LearnerContextValue {
  const value = useContext(LearnerContext);
  if (!value) {
    throw new Error("useLearner must be used within LearnerProvider");
  }
  return value;
}
