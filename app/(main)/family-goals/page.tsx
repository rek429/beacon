import Image from "next/image";
import { redirect } from "next/navigation";
import { Target } from "lucide-react";

import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Progress } from "@/components/ui/progress";

import { getUserProgress, getUserSubscription, getFamilyGoals } from "@/db/queries";

const FamilyGoalsPage = async () => {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();
  const familyGoalsData = getFamilyGoals();

  const [userProgress, userSubscription, goals] = await Promise.all([
    userProgressData,
    userSubscriptionData,
    familyGoalsData,
  ]);

  if (!userProgress || !userProgress.activeTrackId) redirect("/tracks");

  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeTrack={userProgress.activeTrack!}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
        />
      </StickyWrapper>

      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <Target className="h-20 w-20 text-[#6B6FD4]" />
          <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
            Family Goals
          </h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            Track your family&apos;s shared financial goals together.
          </p>

          {goals.length === 0 ? (
            <div className="text-center text-neutral-500 mt-10">
              <p className="text-lg font-medium">No family goals yet.</p>
              <p className="text-sm mt-2">
                Set up your family in Settings to start tracking shared goals.
              </p>
            </div>
          ) : (
            <ul className="w-full space-y-4">
              {goals.map((goal) => {
                const pct = Math.round(
                  (goal.currentAmount / goal.targetAmount) * 100
                );
                const currentFormatted = (goal.currentAmount / 100).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                });
                const targetFormatted = (goal.targetAmount / 100).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                });

                return (
                  <div
                    key={goal.id}
                    className="border-2 rounded-xl p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold text-neutral-800 text-lg">
                        {goal.title}
                      </h2>
                      <span className="text-sm text-neutral-500">
                        {pct}%
                      </span>
                    </div>
                    {goal.description && (
                      <p className="text-sm text-neutral-500">{goal.description}</p>
                    )}
                    <Progress value={pct} className="h-3" />
                    <div className="flex justify-between text-sm text-neutral-600">
                      <span>{currentFormatted} saved</span>
                      <span>Goal: {targetFormatted}</span>
                    </div>
                  </div>
                );
              })}
            </ul>
          )}
        </div>
      </FeedWrapper>
    </div>
  );
};

export default FamilyGoalsPage;
