import Link from "next/link";

type Props = { title: string; description: string };

export const UnitBanner = ({ title, description }: Props) => {
  return (
    <div className="w-full rounded-2xl bg-[#6B6FD4] p-5 text-white flex items-center justify-between mb-4 shadow-md">
      <div className="space-y-1">
        <p className="text-lg font-bold">{title}</p>
        <p className="text-white/70 text-sm">{description}</p>
      </div>
      <Link
        href="/lesson"
        className="hidden xl:flex items-center gap-2 bg-white text-[#6B6FD4] font-bold text-sm px-4 py-2 rounded-xl hover:bg-white/90 transition-all"
      >
        Continue →
      </Link>
    </div>
  );
};