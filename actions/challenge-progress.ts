"use server";

import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import db from "@/db/drizzle";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";
import { POINTS_PER_CHALLENGE } from "@/lib/constants";

export const upsertChallengeProgress = async (challengeId: number) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const currentUserProgress = await getUserProgress();
  const subscription = await getUserSubscription();

  if (!currentUserProgress) throw new Error("User progress not found");

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
  });
  if (!challenge) throw new Error("Challenge not found");

  const existingProgress = await db.query.challengeProgress.findFirst({
    where: and(
      eq(challengeProgress.userId, userId),
      eq(challengeProgress.challengeId, challengeId)
    ),
  });

  const isPracticing = !!existingProgress;

  if (
    currentUserProgress.hearts === 0 &&
    !isPracticing &&
    !subscription?.isActive
  ) {
    return { error: "hearts" };
  }

  if (isPracticing) {
    await db
      .update(challengeProgress)
      .set({ completed: true })
      .where(
        and(
          eq(challengeProgress.userId, userId),
          eq(challengeProgress.challengeId, challengeId)
        )
      );

    await db
      .update(userProgress)
      .set({
        hearts: Math.min(currentUserProgress.hearts + 1, 5),
        points: currentUserProgress.points + POINTS_PER_CHALLENGE,
      })
      .where(eq(userProgress.userId, userId));

    revalidatePath("/learn");
    revalidatePath("/lesson");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${challenge.lessonId}`);
    return;
  }

  await db.insert(challengeProgress).values({
    challengeId,
    userId,
    completed: true,
  });

  await db
    .update(userProgress)
    .set({ points: currentUserProgress.points + POINTS_PER_CHALLENGE })
    .where(eq(userProgress.userId, userId));

  revalidatePath("/learn");
  revalidatePath("/lesson");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath(`/lesson/${challenge.lessonId}`);
};
