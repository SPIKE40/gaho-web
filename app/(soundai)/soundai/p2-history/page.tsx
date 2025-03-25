"use client";

import HistoryViewer from "@/app/(soundai)/soundai/components/features/p2-history/HistoryViewer";
import AudioPlayer from "@/app/(soundai)/soundai/components/ui/AudioPlayer";

export default function HistoryPage() {
  return (
    <div className="container mx-auto max-w-full p-4">
      <HistoryViewer />
      <AudioPlayer />
    </div>
  );
}
