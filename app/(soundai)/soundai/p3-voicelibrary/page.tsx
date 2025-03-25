"use client";

import VoiceLibraryViewer from "@/app/(soundai)/soundai/components/features/p3-voicelibrary/VoiceLibraryViewer";
import AudioPlayer from "@/app/(soundai)/soundai/components/ui/AudioPlayer";

export default function VoiceLibraryPage() {
  return (
    <div className="container mx-auto max-w-full p-4">
      <VoiceLibraryViewer />
      <AudioPlayer />
    </div>
  );
}
