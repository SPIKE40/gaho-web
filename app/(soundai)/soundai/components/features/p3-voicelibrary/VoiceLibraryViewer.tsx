"use client";

import VoiceGridList from "@/app/(soundai)/soundai/components/ui/VoiceGridList";
import VoiceTabs from "@/app/(soundai)/soundai/components/ui/VoiceTabs";
import { useEffect } from "react";

export default function VoiceLibraryViewer() {
  // 스타일 수정을 위한 useEffect
  useEffect(() => {
    // Ant Design 탭 컨텐츠 영역의 overflow 속성 조정
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      .ant-tabs-content {
        height: 100%;
        overflow: hidden !important;
      }
      .ant-tabs-tabpane {
        height: 100%;
        overflow: hidden !important;
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <div className="h-[calc(100vh-280px)]">
      <div className="rounded-lg shadow-lg bg-[#262626] h-full p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            음성 라이브러리
          </h1>
          <p className="text-gray-400">
            다양한 음성을 탐색하고 선택할 수 있습니다.
          </p>
        </div>
        <div className="bg-[#1f1f1f] rounded-lg p-4 shadow-inner h-[calc(100%-120px)] overflow-hidden">
          <VoiceTabs
            className="h-full"
            ktTabContent={
              <VoiceGridList
                columns={4}
                filterContainerBgClass="bg-[#2a2a2a]"
                gridScrollClassName="h-[calc(100vh-450px)]"
              />
            }
          />
        </div>
      </div>
    </div>
  );
}
