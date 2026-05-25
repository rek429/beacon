import { MobileSidebar } from "./mobile-sidebar";

export const MobileHeader = () => {
  return (
    <nav className="lg:hidden px-6 h-[50px] flex items-center bg-[#0E1129] border-b border-[#1A2040] fixed top-0 w-full z-50">
      <MobileSidebar />
      <div className="flex items-center gap-x-2 ml-3">
        <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
          <circle cx="14" cy="14" r="13" stroke="#6B6FD4" strokeWidth="1" strokeOpacity="0.3"/>
          <circle cx="14" cy="14" r="8"  stroke="#6B6FD4" strokeWidth="1" strokeOpacity="0.5"/>
          <circle cx="14" cy="14" r="4"  stroke="#6B6FD4" strokeWidth="1.5" strokeOpacity="0.8"/>
          <circle cx="14" cy="14" r="2"  fill="#6B6FD4"/>
          <circle cx="13" cy="13" r="0.8" fill="white" fillOpacity="0.6"/>
        </svg>
        <span className="text-white font-bold text-lg tracking-wide">beacon</span>
      </div>
    </nav>
  );
};
