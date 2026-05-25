import Link from "next/link";
import { ClerkLoading, ClerkLoaded, UserButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarItem } from "./sidebar-item";

type Props = { className?: string };

export const Sidebar = ({ className }: Props) => {
  return (
    <div className={cn(
      "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r flex-col bg-[#0E1129] border-[#1A2040]",
      className
    )}>
      <Link href="/learn">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          {/* Beacon radar logo mark */}
          <div className="w-9 h-9 relative flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
              <circle cx="18" cy="18" r="17" stroke="#6B6FD4" strokeWidth="1" strokeOpacity="0.3"/>
              <circle cx="18" cy="18" r="11" stroke="#6B6FD4" strokeWidth="1" strokeOpacity="0.5"/>
              <circle cx="18" cy="18" r="6"  stroke="#6B6FD4" strokeWidth="1.5" strokeOpacity="0.8"/>
              <circle cx="18" cy="18" r="3"  fill="#6B6FD4"/>
              <circle cx="17" cy="17" r="1"  fill="white" fillOpacity="0.6"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            beacon
          </h1>
        </div>
      </Link>

      <div className="flex flex-col gap-y-1 flex-1">
        <SidebarItem label="Learn"        href="/learn"        iconSrc="/learn.svg" />
        <SidebarItem label="Tracks"       href="/tracks"       iconSrc="/tracks.svg" />
        <SidebarItem label="Family Goals" href="/family-goals" iconSrc="/goals.svg" />
        <SidebarItem label="Leaderboard"  href="/leaderboard"  iconSrc="/leaderboard.svg" />
        <SidebarItem label="Quests"       href="/quests"       iconSrc="/quests.svg" />
        <SidebarItem label="Shop"         href="/shop"         iconSrc="/shop.svg" />
        <SidebarItem label="Settings"     href="/settings"     iconSrc="/goals.svg" />
      </div>

      <div className="p-4">
        <ClerkLoading>
          <Loader className="h-5 w-5 text-[#6B6FD4] animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton afterSignOutUrl="/" />
        </ClerkLoaded>
      </div>
    </div>
  );
};
