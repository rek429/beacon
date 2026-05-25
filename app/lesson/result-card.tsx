import Image from "next/image";
import { InfinityIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  variant: "points" | "hearts";
  value: number;
};

export const ResultCard = ({ variant, value }: Props) => {
  const imageSrc = variant === "hearts" ? "/heart.svg" : "/points.svg";

  return (
    <div
      className={cn(
        "rounded-2xl border-2 w-full",
        variant === "points" && "bg-orange-400 border-orange-400",
        variant === "hearts" && "bg-rose-400 border-rose-400"
      )}
    >
      <div
        className={cn(
          "p-1.5 text-white rounded-t-xl font-bold text-center uppercase text-xs",
          variant === "points" && "bg-orange-400",
          variant === "hearts" && "bg-rose-400"
        )}
      >
        {variant === "hearts" ? "Hearts left" : "Total XP"}
      </div>
      <div
        className={cn(
          "rounded-2xl bg-white items-center flex justify-center p-6 font-bold text-lg",
          variant === "points" && "text-orange-400",
          variant === "hearts" && "text-rose-400"
        )}
      >
        <Image
          src={imageSrc}
          alt={variant}
          height={30}
          width={30}
          className="mr-1.5"
        />
        {value === Infinity ? <InfinityIcon /> : value}
      </div>
    </div>
  );
};
