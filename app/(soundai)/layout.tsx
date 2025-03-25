"use client";
import SoundAIHeader from "@/app/(soundai)/soundai/components/layout/Header";
import SoundAIFooter from "@/app/(soundai)/soundai/components/layout/Footer";

export default function SoundAILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-black min-h-screen">
      <SoundAIHeader />
      <main>{children}</main>
      <SoundAIFooter />
    </div>
  );
}
