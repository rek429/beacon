import { redirect } from "next/navigation";
import Link from "next/link";
import { InfinityIcon, Flame, Zap, Trophy } from "lucide-react";
import { Unit } from "./unit";
import {
  getTrackUnits,
  getUserProgress,
  getLessonPercentage,
  getUserSubscription,
} from "@/db/queries";
import { QUESTS } from "@/lib/constants";

const LearnPage = async () => {
  const userProgressData = getUserProgress();
  const unitsData = getTrackUnits();
  const lessonPercentageData = getLessonPercentage();
  const userSubscriptionData = getUserSubscription();

  const [userProgress, units, lessonPercentage, userSubscription] =
    await Promise.all([
      userProgressData,
      unitsData,
      lessonPercentageData,
      userSubscriptionData,
    ]);

  if (!userProgress || !userProgress.activeTrackId) redirect("/tracks");

  const isPro = !!userSubscription?.isActive;
  const streakDays = userProgress.streakDays ?? 0;
  const points = userProgress.points ?? 0;
  const hearts = userProgress.hearts ?? 5;

  return (
    <div className="flex gap-6 px-4 pb-10">
      {/* Feed */}
      <div className="flex-1 min-w-0">
        {/* Stats strip */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-1">
            <div className="text-2xl">🔥</div>
            <div className="text-2xl font-bold text-gray-800">{streakDays}</div>
            <div className="text-xs text-gray-400 font-medium">Day streak</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-1">
            <div className="text-2xl">⚡</div>
            <div className="text-2xl font-bold text-gray-800">{points.toLocaleString()}</div>
            <div className="text-xs text-gray-400 font-medium">Total XP</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-1">
            <div className="text-2xl">💎</div>
            <div className="text-2xl font-bold text-gray-800">
              {isPro ? <InfinityIcon className="h-6 w-6 text-[#6B6FD4]" /> : hearts}
            </div>
            <div className="text-xs text-gray-400 font-medium">Hearts left</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-1">
            <div className="text-2xl">🏅</div>
            <div className="text-2xl font-bold text-gray-800">#1</div>
            <div className="text-xs text-gray-400 font-medium">Family rank</div>
          </div>
        </div>

        {/* Track title */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">
            {userProgress.activeTrack?.title ?? "Financial Literacy"}
          </h1>
          <Link href="/tracks" className="text-sm text-[#6B6FD4] font-medium hover:underline">
            Change track →
          </Link>
        </div>

        {/* Units */}
        {units.map((unit) => (
          <div key={unit.id} className="mb-8">
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              lessons={unit.lessons}
              activeLesson={undefined}
              activeLessonPercentage={lessonPercentage}
            />
          </div>
        ))}
      </div>

      {/* Right panel */}
      <div className="hidden lg:flex flex-col gap-4 w-[220px] flex-shrink-0 sticky top-6 self-start">
        {/* Streak */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-semibold text-gray-700">Streak</span>
          </div>
          <div className="p-4 flex flex-col items-center gap-2">
            <div className="text-5xl font-bold text-orange-400">{streakDays}</div>
            <div className="text-xs text-gray-400">days in a row</div>
            <div className="flex gap-1 mt-1">
              {["M","T","W","T","F","S","S"].map((d, i) => (
                <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${
                  i < (streakDays % 7) ? "bg-orange-400 text-white"
                  : i === (streakDays % 7) ? "bg-[#0E1129] text-white border-2 border-orange-400"
                  : "bg-gray-100 text-gray-400"
                }`}>{d}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Quests */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-[#6B6FD4]" />
            <span className="text-sm font-semibold text-gray-700">Quests</span>
          </div>
          <div className="p-3 flex flex-col divide-y divide-gray-50">
            {QUESTS.slice(0, 3).map((quest) => {
              const pct = Math.min((points / quest.value) * 100, 100);
              return (
                <div key={quest.title} className="flex items-center gap-2 py-2">
                  <div className="text-base">{pct >= 100 ? "✅" : "⭐"}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-700 truncate">{quest.title}</div>
                    <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-[#6B6FD4] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-400">{pct >= 100 ? "✓" : `${Math.round(pct)}%`}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* XP */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#6B6FD4]" />
            <span className="text-sm font-semibold text-gray-700">Your XP</span>
          </div>
          <div className="p-4 flex flex-col items-center">
            <div className="text-3xl font-bold text-[#6B6FD4]">{points.toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">total points earned</div>
            <Link href="/leaderboard" className="mt-3 text-xs text-[#6B6FD4] font-medium hover:underline">
              View leaderboard →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;