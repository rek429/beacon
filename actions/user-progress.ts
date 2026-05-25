"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";

import db from "@/db/drizzle";
import { getCourseById, getUserProgress, getUserSubscription } from "@/db/queries";
import { tracks, userProgress } from "@/db/schema";
import { MAX_HEARTS } from "@/lib/constants";

export const upsertUserProgress = async (trackId: number) => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) throw new Error("Unauthorized");

  const track = await db.query.tracks.findFirst({
    where: eq(tracks.id, trackId),
  });
  if (!track) throw new Error("Track not found");

  const existingProgress = await getUserProgress();

  if (existingProgress) {
    await db.update(userProgress).set({
      activeTrackId: trackId,
      userName: user.firstName || "User",
      userImageSrc: user.imageUrl || "/mascot.svg",
    }).where(eq(userProgress.userId, userId));
    revalidatePath("/tracks");
    revalidatePath("/learn");
    redirect("/learn");
  }

  await db.insert(userProgress).values({
    userId,
    activeTrackId: trackId,
    userName: user.firstName || "User",
    userImageSrc: user.imageUrl || "/mascot.svg",
  });

  revalidatePath("/tracks");
  revalidatePath("/learn");
  redirect("/learn");
};

export const reduceHearts = async (challengeId: number) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const currentUserProgress = await getUserProgress();
  const subscription = await getUserSubscription();

  if (!currentUserProgress) throw new Error("User progress not found");
  if (subscription?.isActive) return { error: null }; // unlimited hearts on pro

  if (currentUserProgress.hearts === 0) return { error: "hearts" };

  await db.update(userProgress).set({
    hearts: Math.max(currentUserProgress.hearts - 1, 0),
  }).where(eq(userProgress.userId, userId));

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
};

export const refillHearts = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const currentUserProgress = await getUserProgress();
  if (!currentUserProgress) throw new Error("User progress not found");

  if (currentUserProgress.hearts === MAX_HEARTS)
    throw new Error("Hearts are already full");
  if (currentUserProgress.points < 10)
    throw new Error("Not enough points");

  await db.update(userProgress).set({
    hearts: MAX_HEARTS,
    points: currentUserProgress.points - 10,
  }).where(eq(userProgress.userId, userId));

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
};
