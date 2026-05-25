"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = { label: string; iconSrc: string; href: string };

export const SidebarItem = ({ label, iconSrc, href }: Props) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
        active
          ? "bg-[#6B6FD4]/15 text-white border border-[#6B6FD4]/40"
          : "text-[#8B8FA8] hover:bg-white/5 hover:text-white border border-transparent"
      )}
    >
      <Image src={iconSrc} alt={label} height={24} width={24} className="opacity-80" />
      {label}
    </Link>
  );
};
