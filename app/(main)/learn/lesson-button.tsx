"use client";

import Link from "next/link";
import { Check, Crown, Star, Lock } from "lucide-react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { cn } from "@/lib/utils";

type Props = {
  id: number;
  index: number;
  totalCount: number;
  locked?: boolean;
  current?: boolean;
  percentage: number;
};

export const LessonButton = ({ id, index, totalCount, locked, current, percentage }: Props) => {
  const cycleLength = 8;
  const cycleIndex = index % cycleLength;

  let indentationLevel;
  if (cycleIndex <= 2) indentationLevel = cycleIndex;
  else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
  else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
  else indentationLevel = cycleIndex - 8;

  const rightPosition = indentationLevel * 40;
  const isLast = index === totalCount;
  const isCompleted = !current && !locked;
  const Icon = isCompleted ? Check : isLast ? Crown : Star;
  const href = isCompleted ? `/lesson/${id}` : "/lesson";

  return (
    <Link
      href={locked ? "/lesson" : href}
      aria-disabled={locked}
      style={{ pointerEvents: locked ? "none" : "auto" }}
    >
      <div
        className="relative"
        style={{
          right: `${rightPosition}px`,
          marginTop: index === 0 && !isCompleted ? 60 : 24,
        }}
      >
        {current ? (
          <div className="h-[102px] w-[102px] relative">
            <div className="absolute -top-6 left-2.5 px-3 py-1.5 border-2 border-[#6B6FD4] font-bold uppercase text-[#6B6FD4] bg-white rounded-xl animate-bounce tracking-wide z-10 text-sm shadow-md">
              Start
              <div className="absolute left-1/2 -bottom-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-[#6B6FD4] -translate-x-1/2" />
            </div>
            <CircularProgressbarWithChildren
              value={Number.isNaN(percentage) ? 0 : percentage}
              styles={{
                path: { stroke: "#6B6FD4" },
                trail: { stroke: "#e5e7eb" },
              }}
            >
              <div className="w-[70px] h-[70px] rounded-full bg-[#6B6FD4] flex items-center justify-center shadow-lg">
                <Icon className="h-9 w-9 text-white fill-white" />
              </div>
            </CircularProgressbarWithChildren>
          </div>
        ) : (
          <div
            className={cn(
              "w-[70px] h-[70px] rounded-full flex items-center justify-center shadow-md transition-all",
              locked ? "bg-gray-200" : "bg-[#6B6FD4] hover:bg-[#5558C8]"
            )}
          >
            {locked ? (
              <Lock className="h-8 w-8 text-gray-400" />
            ) : (
              <Icon
                className={cn(
                  "h-9 w-9",
                  isCompleted ? "text-white stroke-white stroke-[3] fill-none" : "text-white fill-white"
                )}
              />
            )}
          </div>
        )}
      </div>
    </Link>
  );
};