"use client";

import { useEffect, useId, useState } from "react";
import ProfileContactSection from "@/components/profile/profile-contact-section";
import ProfileCoursesSection from "@/components/profile/profile-courses-section";
import {
  toProfileDraft,
  type ProfileDraft,
} from "@/components/profile/profile-draft";
import ProfileHeroCard from "@/components/profile/profile-hero-card";
import ProfileSkeleton from "@/components/profile/profile-skeleton";
import ProfileSocialSection from "@/components/profile/profile-social-section";
import ProfileStatTiles from "@/components/profile/profile-stat-tiles";
import { useLearner } from "@/data/learner-context";
import { planDaysRemaining } from "@/data/learner";
import { LEADERBOARD } from "@/data/leaderboard";
import { earnedXpTotal, teacherById, teacherProgress } from "@/data/teachers";
import { useMessages } from "@/i18n/locale-context";

export default function LearnerProfileView() {
  const copy = useMessages();
  const { learner, ready, updateLearner } = useLearner();
  const [editingKey, setEditingKey] = useState<keyof ProfileDraft | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [planLabel, setPlanLabel] = useState<string | null>(null);
  const formId = useId();

  useEffect(() => {
    if (!learner.planEndsOn) {
      setPlanLabel(null);
      return;
    }
    const days = planDaysRemaining(learner.planEndsOn);
    setPlanLabel(days >= 0 ? copy.daysFull(days) : copy.profile.planEnded);
  }, [learner.planEndsOn, copy]);

  if (!ready) {
    return <ProfileSkeleton />;
  }

  const myXp = earnedXpTotal();
  const ahead = LEADERBOARD.filter((entry) => entry.score > myXp);
  const myRank = ahead.length + 1;
  const nextUp = ahead.reduce<(typeof ahead)[number] | null>(
    (closest, entry) => (!closest || entry.score < closest.score ? entry : closest),
    null,
  );
  const rival = nextUp ? { name: nextUp.displayName, gap: nextUp.score - myXp + 1 } : null;
  const lessons = learner.enrolledTeacherIds.reduce(
    (sum, id) => {
      const teacher = teacherById(id);
      if (!teacher) return sum;
      const { done, total } = teacherProgress(teacher);
      return { done: sum.done + done, total: sum.total + total };
    },
    { done: 0, total: 0 },
  );

  function startEdit(key: keyof ProfileDraft) {
    const draft = toProfileDraft(learner);
    setDraftValue(draft[key]);
    setPhotoError(null);
    setEditingKey(key);
  }

  function cancelEdit() {
    setDraftValue("");
    setPhotoError(null);
    setEditingKey(null);
  }

  function saveEdit() {
    if (!editingKey) return;
    const next = draftValue.trim();
    if (editingKey === "displayName" && !next) return;
    if (editingKey === "image") {
      updateLearner({ image: draftValue });
    } else {
      updateLearner({ [editingKey]: next });
    }
    setEditingKey(null);
    setDraftValue("");
    setPhotoError(null);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1800);
  }

  return (
    <article className="mb-16 flex flex-col gap-4 sm:mb-24 sm:gap-5">
      <ProfileHeroCard
        editingKey={editingKey}
        draftValue={draftValue}
        displayName={learner.displayName}
        bio={learner.bio}
        image={learner.image}
        photoError={photoError}
        savedFlash={savedFlash}
        onDraftValueChange={setDraftValue}
        onPhotoError={setPhotoError}
        onStartEdit={startEdit}
        onSaveEdit={saveEdit}
        onCancelEdit={cancelEdit}
      />

      <ProfileStatTiles
        myXp={myXp}
        myRank={myRank}
        rival={rival}
        lessonsDone={lessons.done}
        lessonsTotal={lessons.total}
        planLabel={planLabel}
      />

      <div className="grid items-start gap-4 sm:gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ProfileCoursesSection
            formId={formId}
            enrolledTeacherIds={learner.enrolledTeacherIds}
          />
        </div>

        <aside className="flex flex-col gap-4 sm:gap-5 lg:col-span-4">
          <ProfileContactSection
            formId={formId}
            editingKey={editingKey}
            email={learner.email}
            phone={learner.phone}
            address={learner.address}
            draftValue={draftValue}
            onDraftValueChange={setDraftValue}
            onStartEdit={startEdit}
            onSave={saveEdit}
            onCancel={cancelEdit}
          />

          <ProfileSocialSection
            formId={formId}
            editingKey={editingKey}
            values={{
              telegram: learner.telegram,
              tiktok: learner.tiktok,
              facebook: learner.facebook,
              linkedin: learner.linkedin,
              twitter: learner.twitter,
            }}
            draftValue={draftValue}
            onDraftValueChange={setDraftValue}
            onStartEdit={startEdit}
            onSave={saveEdit}
            onCancel={cancelEdit}
          />
        </aside>
      </div>
    </article>
  );
}
