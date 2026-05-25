import Image from "next/image";
import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import {
  getUserProgress,
  getUserSubscription,
  getTopFamilyMembers,
} from "@/db/queries";

const LeaderboardPage = async () => {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();
  const topMembersData = getTopFamilyMembers();

  const [userProgress, userSubscription, topMembers] = await Promise.all([
    userProgressData,
    userSubscriptionData,
    topMembersData,
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
          <Image
            src="/leaderboard.svg"
            alt="Leaderboard"
            height={90}
            width={90}
          />
          <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
            Family Leaderboard
          </h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            See how your family members stack up this week.
          </p>
          <Separator className="mb-4 h-0.5 rounded-full" />

          <div className="w-full space-y-1">
            {topMembers.map((member, index) => (
              <div
                key={member.userId}
                className="flex items-center w-full p-2 px-4 rounded-xl hover:bg-gray-50/50"
              >
                <p className="font-bold text-lime-700 mr-4">{index + 1}</p>
                <Avatar className="border bg-green-50 h-12 w-12 ml-3 mr-6">
                  <AvatarImage src={member.userImageSrc} className="object-cover" />
                </Avatar>
                <div className="flex-1">
                  <p className="font-bold text-neutral-800">{member.userName}</p>
                  <p className="text-sm text-neutral-500 capitalize">
                    {member.familyRole.toLowerCase()} · {member.streakDays}-day streak 🔥
                  </p>
                </div>
                <p className="text-muted-foreground font-bold">
                  {member.points} XP
                </p>
              </div>
            ))}
          </div>
        </div>
      </FeedWrapper>
    </div>
  );
};

export default LeaderboardPage;
