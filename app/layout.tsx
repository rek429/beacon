import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

import "./globals.css";
import { ExitModal }     from "@/components/modals/exit-modal";
import { HeartsModal }   from "@/components/modals/hearts-modal";
import { PracticeModal } from "@/components/modals/practice-modal";

const font = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "beacon — financial literacy for the whole family",
  description: "beacon helps every member of your family build confident money habits through bite-sized, gamified lessons.",
  icons: { icon: "/app-icon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={font.className}>
          <Toaster />
          <ExitModal />
          <HeartsModal />
          <PracticeModal />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
