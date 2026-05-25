import Image from "next/image";
import Link from "next/link";
import { Loader } from "lucide-react";
import {
  ClerkLoaded, ClerkLoading,
  SignInButton, SignUpButton,
  SignedIn, SignedOut,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-12">

      {/* Logo / illustration column */}
      <div className="flex flex-col items-center gap-6">
        {/* Animated radar beacon logo */}
        <div className="relative w-[200px] h-[200px] lg:w-[280px] lg:h-[280px] flex items-center justify-center">
          <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="140" cy="140" r="130" stroke="#6B6FD4" strokeWidth="1" strokeOpacity="0.15"/>
            <circle cx="140" cy="140" r="100" stroke="#6B6FD4" strokeWidth="1" strokeOpacity="0.25"/>
            <circle cx="140" cy="140" r="70"  stroke="#6B6FD4" strokeWidth="1.5" strokeOpacity="0.4"/>
            <circle cx="140" cy="140" r="42"  stroke="#6B6FD4" strokeWidth="2" strokeOpacity="0.6"/>
            <circle cx="140" cy="140" r="18"  fill="#6B6FD4" fillOpacity="0.2" stroke="#6B6FD4" strokeWidth="2"/>
            <circle cx="140" cy="140" r="9"   fill="#6B6FD4"/>
            <circle cx="136" cy="136" r="3.5" fill="white" fillOpacity="0.7"/>
          </svg>
        </div>

        {/* wordmark */}
        <div className="flex items-center gap-x-2">
          <span className="text-4xl font-bold text-[#0E1129] tracking-widest lowercase">beacon</span>
        </div>
      </div>

      {/* CTA column */}
      <div className="flex flex-col items-center gap-y-6 max-w-[420px]">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0E1129] text-center leading-snug">
          Build confident money habits — for the whole family.
        </h1>
        <p className="text-neutral-500 text-center">
          Bite-sized lessons on budgeting, saving, investing, and credit.
          Every family member gets an age-appropriate track. Learn together, grow together.
        </p>

        <div className="flex flex-col items-center gap-y-3 w-full">
          <ClerkLoading>
            <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
          </ClerkLoading>
          <ClerkLoaded>
            <SignedOut>
              <SignUpButton mode="modal" afterSignInUrl="/learn" afterSignUpUrl="/learn">
                <Button size="lg" className="w-full bg-[#6B6FD4] hover:bg-[#5558C8] text-white font-bold border-0">
                  Get Started — it&apos;s free
                </Button>
              </SignUpButton>
              <SignInButton mode="modal" afterSignInUrl="/learn" afterSignUpUrl="/learn">
                <Button size="lg" variant="outline" className="w-full border-[#6B6FD4] text-[#6B6FD4] hover:bg-[#6B6FD4]/5">
                  I already have an account
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button size="lg" className="w-full bg-[#6B6FD4] hover:bg-[#5558C8] text-white font-bold border-0" asChild>
                <Link href="/learn">Continue Learning</Link>
              </Button>
            </SignedIn>
          </ClerkLoaded>
        </div>

        <div className="flex flex-wrap justify-center gap-3 text-sm text-neutral-400 pt-2">
          <span>📡 Gamified XP &amp; streaks</span>
          <span>👨‍👩‍👧‍👦 Family leaderboard</span>
          <span>🎯 Age-appropriate tracks</span>
        </div>
      </div>
    </div>
  );
}
