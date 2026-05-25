import { cache } from "react";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";

import db from "@/db/drizzle";
import {
  tracks,
  units,
  lessons,
  challenges,
  challengeOptions,
  challengeProgress,
  userProgress,
  userSubscription,
  familyGoals,
} from "@/db/schema";

export const getTracks = cache(async () => {
  return await db.query.tracks.findMany({ orderBy: (t, { asc }) => [asc(t.order)] });
});

export const getTrackById = cache(async (trackId: number) => {
  return await db.query.tracks.findFirst({ where: eq(tracks.id, trackId) });
});

export const getTrackUnits = cache(async () => {
  const { userId } = await auth();
  if (!userId) return [];

  const data = await db.query.units.findMany({
    orderBy: (u, { asc }) => [asc(u.order)],
    with: {
      lessons: {
        orderBy: (l, { asc }) => [asc(l.order)],
        with: {
          challenges: {
            orderBy: (c, { asc }) => [asc(c.order)],
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  });

  const normalizedData = data.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
      if (lesson.challenges.length === 0) {
        return { ...lesson, completed: false };
      }
      const allCompleted = lesson.challenges.every((challenge) =>
        challenge.challengeProgress?.some((p) => p.completed)
      );
      return { ...lesson, completed: allCompleted };
    });
    return { ...unit, lessons: lessonsWithCompletedStatus };
  });

  return normalizedData;
});

export const getUserProgress = cache(async () => {
  const { userId } = await auth();
  if (!userId) return null;

  return await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: { activeTrack: true },
  });
});

export const getLesson = cache(async (id?: number) => {
  const { userId } = await auth();
  if (!userId) return null;

  const progress = await getUserProgress();
  if (!progress) return null;

  // If no specific lesson id, find the first uncompleted lesson in the active track
  const units = await getTrackUnits();
  let lessonId = id;

  if (!lessonId) {
    for (const unit of units) {
      for (const lesson of unit.lessons) {
        if (!lesson.completed) {
          lessonId = lesson.id;
          break;
        }
      }
      if (lessonId) break;
    }
  }

  if (!lessonId) return null;

  const lesson = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      challenges: {
        orderBy: (c, { asc }) => [asc(c.order)],
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: eq(challengeProgress.userId, userId),
          },
        },
      },
    },
  });

  if (!lesson) return null;

  const normalizedChallenges = lesson.challenges.map((c) => ({
    ...c,
    completed: c.challengeProgress?.some((p) => p.completed) ?? false,
  }));

  return { ...lesson, challenges: normalizedChallenges };
});

export const getLessonPercentage = cache(async () => {
  const progress = await getUserProgress();
  if (!progress?.activeTrackId) return 0;

  const lesson = await getLesson();
  if (!lesson) return 0;

  const completedChallenges = lesson.challenges.filter((c) => c.completed);
  return Math.round((completedChallenges.length / lesson.challenges.length) * 100);
});

export const getUserSubscription = cache(async () => {
  const { userId } = await auth();
  if (!userId) return null;

  const sub = await db.query.userSubscription.findFirst({
    where: eq(userSubscription.userId, userId),
  });
  if (!sub) return null;

  const isActive =
    sub.stripePriceId &&
    sub.stripeCurrentPeriodEnd?.getTime()! + 86_400_000 > Date.now();

  return { ...sub, isActive: !!isActive };
});

export const getFamilyGoals = cache(async () => {
  const { userId } = await auth();
  if (!userId) return [];

  const progress = await getUserProgress();
  if (!progress?.familyId) return [];

  return await db.query.familyGoals.findMany({
    where: eq(familyGoals.familyId, progress.familyId),
  });
});

export const getTopFamilyMembers = cache(async () => {
  const { userId } = await auth();
  if (!userId) return [];

  const progress = await getUserProgress();
  if (!progress?.familyId) return [];

  return await db.query.userProgress.findMany({
    where: eq(userProgress.familyId, progress.familyId),
    orderBy: (u, { desc }) => [desc(u.points)],
  });
});
