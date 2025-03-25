"use client";

import { useState, useEffect } from "react";
import InputContainer from "@/app/(soundai)/soundai/components/features/p1-vocalize/InputContainer";
import VoiceSelector from "@/app/(soundai)/soundai/components/features/p1-vocalize/VoiceSelector";
import ControlPanel from "@/app/(soundai)/soundai/components/features/p1-vocalize/ControlPanel";
import SuccessNotification from "@/app/(soundai)/soundai/components/ui/SuccessNotification";
import AudioPlayer from "@/app/(soundai)/soundai/components/ui/AudioPlayer";
import { useTabStore } from "@/app/(soundai)/soundai/components/stores/tabStore";

export default function VocalizePage() {
  const { activeTab } = useTabStore();
  const [isStoryMakerMode, setIsStoryMakerMode] = useState(false);

  // activeTab 변경 감지하여 StoryMaker 모드 여부 업데이트
  useEffect(() => {
    setIsStoryMakerMode(activeTab === "story");
  }, [activeTab]);

  return (
    <>
      <div className="flex justify-between gap-4 p-4">
        <InputContainer />
        <div className="flex w-1/2 flex-col">
          <VoiceSelector isFullHeight={isStoryMakerMode} />
          {!isStoryMakerMode && <ControlPanel />}
        </div>
      </div>
      <SuccessNotification />
      <AudioPlayer />
    </>
  );
}
