"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Check } from "lucide-react";
import { toast } from "sonner";

import { tracks } from "@/db/schema";
import { cn } from "@/lib/utils";
import { upsertUserProgress } from "@/actions/user-progress";
import { Button } from "@/components/ui/button";

type Props = {
  tracks: (typeof tracks.$inferSelect)[];
  activeTrackId?: number | null;
};

export const TrackList = ({ tracks, activeTrackId }: Props) => {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const onClick = (id: number) => {
    if (pending) return;
    if (id === activeTrackId) {
      router.push("/learn");
      return;
    }
    startTransition(() => {
      upsertUserProgress(id).catch(() =>
        toast.error("Something went wrong. Please try again.")
      );
    });
  };

  return (
    <div className="pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
      {tracks.map((track) => {
        const isActive = track.id === activeTrackId;
        return (
          <div
            key={track.id}
            onClick={() => onClick(track.id)}
            className={cn(
              "h-full border-2 rounded-xl border-b-4 hover:bg-black/5 cursor-pointer active:border-b-2 flex flex-col items-center justify-between p-3 pb-6 min-h-[217px] min-w-[140px] gap-3",
              isActive && "border-[#6B6FD4]"
            )}
          >
            <div className="min-[24px] w-full flex items-center justify-end">
              {isActive && (
                <div className="rounded-md bg-[#6B6FD4] flex items-center justify-center p-1.5">
                  <Check className="text-white stroke-[4] h-4 w-4" />
                </div>
              )}
            </div>
            <Image
              src={track.imageSrc}
              alt={track.title}
              height={70}
              width={93.33}
              className="rounded-lg drop-shadow-md object-cover"
            />
            <div className="text-center">
              <p className="text-neutral-700 text-center font-bold mt-3">
                {track.title}
              </p>
              <p className="text-neutral-500 text-sm text-center mt-1">
                Ages: {track.ageGroup === "ALL" ? "All ages" : track.ageGroup === "KIDS" ? "6–12" : track.ageGroup === "TEENS" ? "13–17" : "18+"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
