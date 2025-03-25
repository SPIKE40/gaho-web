// 다양한 음성을 선택할 수 있는 컴포넌트
"use client";

import { useState, useEffect, useCallback } from "react";
import VoiceGridList from "@/app/(soundai)/soundai/components/ui/VoiceGridList";
import VoiceTabs from "@/app/(soundai)/soundai/components/ui/VoiceTabs";
import {
  Voice,
  useSelectedVoice,
} from "@/app/(soundai)/soundai/components/stores/voiceStore";
import { useTabStore } from "@/app/(soundai)/soundai/components/stores/tabStore";

interface VoiceSelectorProps {
  isFullHeight?: boolean;
}

export default function VoiceSelector({
  isFullHeight = false,
}: VoiceSelectorProps) {
  const [isStoryMakerActive, setIsStoryMakerActive] = useState(false);
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
  const [activeLineNumber, setActiveLineNumber] = useState<number | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isVoiceSelectorDisabled, setIsVoiceSelectorDisabled] = useState(false);

  /**
   * 성능 최적화: 필요한 상태만 구독
   *
   * @description
   * 이전에는 useInputText를 통해 text와 activeTab을 모두 구독했으나,
   * 이 컴포넌트는 activeTab만 필요하므로 useTabStore에서 직접 구독함.
   * 이를 통해 불필요한 리렌더링을 방지함:
   * - 텍스트 입력 시 이 컴포넌트는 리렌더링되지 않음
   * - 탭 변경 시에만 리렌더링됨
   */
  const { activeTab } = useTabStore();
  const { setSelectedVoice } = useSelectedVoice();

  // 목소리가 선택되었을 때 호출되는 함수 (useCallback으로 메모이제이션)
  const handleVoiceSelected = useCallback(
    (voice: Voice) => {
      // 1. 비동기 처리를 위해 Promise로 감싸고 requestAnimationFrame 사용
      // requestAnimationFrame은 렌더링 사이클과 동기화되어 더 효율적인 업데이트 제공
      Promise.resolve().then(() => {
        requestAnimationFrame(() => {
          // 2. Zustand 스토어 업데이트 (다른 작업과 분리)
          setSelectedVoice(voice);
        });

        // 3. Story Maker 모드 처리는 다음 프레임에서 비동기적으로 처리
        if (isStoryMakerActive && activeLineId) {
          requestAnimationFrame(() => {
            // 상태 업데이트는 배치 처리
            const resetStates = () => {
              setIsOverlayVisible(false);
              setIsStoryMakerActive(false);
              setActiveLineId(null);
              setActiveLineNumber(null);
            };

            // 커스텀 이벤트 발생
            const customEvent = new CustomEvent("storyMakerVoiceSelected", {
              detail: {
                lineId: activeLineId,
                voice: voice,
              },
            });
            window.dispatchEvent(customEvent);

            // 상태 초기화를 비동기로 처리하여 UI 응답성 유지
            setTimeout(resetStates, 0);
          });
        }

        // 4. 선택 완료 이벤트도 마이크로태스크 큐로 이동
        setTimeout(() => {
          const voiceSelectedEvent = new CustomEvent("voiceSelected", {
            detail: { voice },
          });
          window.dispatchEvent(voiceSelectedEvent);
        }, 0);
      });
    },
    [isStoryMakerActive, activeLineId, setSelectedVoice]
  );

  // Story Maker의 음성 선택 모드 감지
  useEffect(() => {
    const handleStoryMakerSelection = (event: CustomEvent) => {
      // 상태 업데이트를 배치로 처리하여 리렌더링 최소화
      const updateStates = () => {
        setIsStoryMakerActive(event.detail.active);
        setActiveLineId(event.detail.lineId);
        setActiveLineNumber(event.detail.lineNumber || null);
        setIsOverlayVisible(event.detail.active);
      };

      // 비동기적으로 상태 업데이트 수행
      requestAnimationFrame(updateStates);
    };

    window.addEventListener(
      "storyMakerVoiceSelectionActive",
      handleStoryMakerSelection as EventListener
    );

    return () => {
      window.removeEventListener(
        "storyMakerVoiceSelectionActive",
        handleStoryMakerSelection as EventListener
      );
    };
  }, []);

  /**
   * 탭 변경에 따른 비활성화 상태 관리
   *
   * @description
   * 스토리 메이커 모드(activeTab이 "story")일 때와 음성 선택 중이 아닐 때
   * 음성 선택기를 비활성화함.
   *
   * @performance
   * 분리된 상태 관리 덕분에, 텍스트 입력 시에는 이 Effect가 실행되지 않음.
   */
  useEffect(() => {
    // 비동기적으로 처리하여 다른 UI 업데이트와 충돌 방지
    requestAnimationFrame(() => {
      setIsVoiceSelectorDisabled(activeTab === "story" && !isStoryMakerActive);
    });
  }, [activeTab, isStoryMakerActive]);

  // 오버레이 닫기 핸들러 (메모이제이션)
  const handleCloseOverlay = useCallback(() => {
    setIsOverlayVisible(false);

    // Story Maker에 선택 취소를 알림
    if (isStoryMakerActive) {
      const customEvent = new CustomEvent("storyMakerVoiceSelectionCancelled", {
        detail: { lineId: activeLineId },
      });
      window.dispatchEvent(customEvent);
    }

    // 모드 초기화 (비동기 처리)
    requestAnimationFrame(() => {
      setIsStoryMakerActive(false);
      setActiveLineId(null);
      setActiveLineNumber(null);
    });
  }, [isStoryMakerActive, activeLineId]);

  // 오버레이 버튼 클릭 핸들러 (메모이제이션)
  const handleOverlayButtonClick = useCallback(() => {
    setIsOverlayVisible(false);
  }, []);

  // 높이 클래스 계산
  const heightClass = isFullHeight
    ? "h-[calc(100vh-280px)]" // Control Panel 높이(100px)와 마진(4px)을 포함한 전체 높이
    : "h-[calc(100vh-280px-100px)]"; // 기존 높이 (Control Panel 제외)

  return (
    <div
      className={`${heightClass} overflow-auto [&::-webkit-scrollbar]:hidden relative`}
    >
      <div className="rounded-lg shadow-lg bg-[#262626] h-full p-4">
        {isStoryMakerActive && (
          <div className="mb-4 py-2 px-4 bg-blue-500 bg-opacity-20 border border-blue-400 rounded-lg">
            <p className="text-sm text-blue-300">
              <span className="font-medium">
                대화 라인 {activeLineNumber}번
              </span>
              을 위한 목소리를 선택해주세요
            </p>
          </div>
        )}

        {/* 비활성화 오버레이 */}
        {isVoiceSelectorDisabled && (
          <div className="absolute inset-1 bg-black bg-opacity-80 flex items-center justify-center z-10 rounded-lg">
            <div className="text-center p-6">
              <p className="text-gray-300 mb-3">
                대화 라인의
                <br />
                <strong className="text-blue-400">음성 선택</strong> 버튼을
                클릭하여
                <br />
                음성을 지정할 수 있습니다.
              </p>
            </div>
          </div>
        )}

        <VoiceTabs
          ktTabContent={
            <VoiceGridList
              columns={2}
              filterContainerBgClass="bg-transparent"
              selectionStyle="border"
              onVoiceSelect={handleVoiceSelected}
              enableCustomSelection={true}
            />
          }
        />
      </div>

      {/* 스토리 메이커 가이드 오버레이 */}
      {isOverlayVisible && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-auto text-center shadow-xl border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">음성 선택</h3>
            <p className="text-gray-300 mb-4">
              대화 라인 {activeLineNumber}번에 목소리를 지정하려면 아래 버튼을
              클릭한 후 목소리를 선택해주세요.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleOverlayButtonClick}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
              >
                목소리 선택하기
              </button>
              <button
                onClick={handleCloseOverlay}
                className="bg-transparent hover:bg-gray-700 text-gray-400 py-2 px-4 rounded border border-gray-600 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
