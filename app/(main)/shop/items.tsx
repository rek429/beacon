"use client";

import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";
import { Heart, Zap } from "lucide-react";

import { refillHearts } from "@/actions/user-progress";
import { createStripeUrl } from "@/actions/user-subscription";
import { Button } from "@/components/ui/button";
import { POINTS_TO_REFILL, MAX_HEARTS } from "@/lib/constants";

type Props = {
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
};

export const Items = ({ hearts, points, hasActiveSubscription }: Props) => {
  const [pending, startTransition] = useTransition();

  const onRefillHearts = () => {
    if (pending || hearts === MAX_HEARTS || points < POINTS_TO_REFILL) return;
    startTransition(() => {
      refillHearts().catch(() => toast.error("Something went wrong."));
    });
  };

  const onUpgrade = () => {
    if (pending) return;
    startTransition(() => {
      createStripeUrl()
        .then((res) => {
          if (res.data) window.location.href = res.data;
        })
        .catch(() => toast.error("Something went wrong."));
    });
  };

  return (
    <ul className="w-full">
      {/* Refill hearts */}
      <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
        <Image src="/heart.svg" alt="Heart" height={60} width={60} />
        <div className="flex-1 space-y-1">
          <p className="text-neutral-700 text-base font-bold">Refill hearts</p>
          <p className="text-muted-foreground text-sm">Top up to 5 hearts</p>
        </div>
        <Button
          onClick={onRefillHearts}
          disabled={pending || hearts === MAX_HEARTS || points < POINTS_TO_REFILL}
          variant="secondary"
          className="font-bold"
        >
          {hearts === MAX_HEARTS ? "Full!" : (
            <div className="flex items-center">
              <Image src="/points.svg" alt="Points" height={20} width={20} />
              <p>{POINTS_TO_REFILL}</p>
            </div>
          )}
        </Button>
      </div>

      {/* Beacon Pro */}
      <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
        <Image src="/unlimited.svg" alt="Unlimited" height={60} width={60} />
        <div className="flex-1 space-y-1">
          <p className="text-neutral-700 text-base font-bold">Beacon Pro</p>
          <p className="text-muted-foreground text-sm">
            Unlimited hearts, all family tracks unlocked
          </p>
        </div>
        <Button
          onClick={onUpgrade}
          disabled={pending || hasActiveSubscription}
          variant="secondary"
          className="font-bold"
        >
          {hasActiveSubscription ? "Active ✓" : "Upgrade"}
        </Button>
      </div>
    </ul>
  );
};
