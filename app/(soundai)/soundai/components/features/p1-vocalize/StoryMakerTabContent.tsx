"use client";

import { useState, useEffect } from "react";
import { Button, ConfigProvider, theme, message } from "antd";
import { PlusOutlined, PlayCircleOutlined } from "@ant-design/icons";
import DialogueLine from "./DialogueLine";
import { useStoryStore } from "../../stores/storyStore";
import { useSelectedVoice, Voice } from "../../stores/voiceStore";
import { darkThemeConfig } from "../../styles/theme";

export default function StoryMakerTabContent() {
  const { dialogueLines, addLine, updateLine, updateVoice, removeLine } =
    useStoryStore();
  const { selectedVoice, setSelectedVoice } = useSelectedVoice();
  const [activeVoiceSelectionLineId, setActiveVoiceSelectionLineId] = useState<
    string | null
  >(null);
  const [showVoiceGuide, setShowVoiceGuide] = useState(false);
  const [recentlySelectedLineId, setRecentlySelectedLineId] = useState<
    string | null
  >(null);
  const [messageApi, contextHolder] = message.useMessage();

  // 음성 생성 버튼 활성화 여부 (최소 2개 대사 & 각 대사에 음성 선택)
  const isCreateSpeechEnabled =
    dialogueLines.length >= 2 &&
    dialogueLines.every(
      (line) => line.voice !== null && line.text.trim() !== ""
    );

  // 컴포넌트 언마운트 시 대사 초기화를 위한 별도 useEffect
  useEffect(() => {
    return () => {
      console.log("StoryMakerTabContent 컴포넌트 언마운트됨, 대사 초기화");
      useStoryStore.getState().clearLines();
    };
  }, []);

  // 음성 선택 완료 이벤트 감지
  useEffect(() => {
    const handleVoiceSelected = (event: CustomEvent) => {
      // 선택된 목소리를 현재 활성화된 라인에 적용
      if (activeVoiceSelectionLineId) {
        const voiceData = event.detail.voice;

        if (voiceData) {
          // 즉시 상태 업데이트
          updateVoice(activeVoiceSelectionLineId, voiceData);
          setRecentlySelectedLineId(activeVoiceSelectionLineId);
          setActiveVoiceSelectionLineId(null);

          // 음성 선택 가이드 표시
          setShowVoiceGuide(true);

          // 성공 메시지 표시
          messageApi.success({
            content:
              "목소리 선택이 완료되었습니다. 이제 다른 대사를 추가하고 목소리를 지정해보세요.",
            duration: 3,
          });
        }
      }
    };

    // storyMakerVoiceSelected 이벤트에서 직접 음성 객체를 받아 즉시 처리
    const handleDirectVoiceSelected = (event: CustomEvent) => {
      if (event.detail.lineId && event.detail.voice) {
        // 선택된 라인의 음성을 즉시 업데이트
        updateVoice(event.detail.lineId, event.detail.voice);
        setRecentlySelectedLineId(event.detail.lineId);
        setActiveVoiceSelectionLineId(null);

        // 선택 가이드 표시
        setShowVoiceGuide(true);
      }
    };

    const handleVoiceSelectionCancelled = (event: CustomEvent) => {
      if (event.detail.lineId) {
        setActiveVoiceSelectionLineId(null);
      }
    };

    window.addEventListener(
      "voiceSelected",
      handleVoiceSelected as EventListener
    );
    window.addEventListener(
      "storyMakerVoiceSelected",
      handleDirectVoiceSelected as EventListener
    );
    window.addEventListener(
      "storyMakerVoiceSelectionCancelled",
      handleVoiceSelectionCancelled as EventListener
    );

    return () => {
      window.removeEventListener(
        "voiceSelected",
        handleVoiceSelected as EventListener
      );
      window.removeEventListener(
        "storyMakerVoiceSelected",
        handleDirectVoiceSelected as EventListener
      );
      window.removeEventListener(
        "storyMakerVoiceSelectionCancelled",
        handleVoiceSelectionCancelled as EventListener
      );
    };
  }, [activeVoiceSelectionLineId, updateVoice, messageApi]);

  // selectedVoice가 변경되면 현재 활성화된 라인에 적용
  useEffect(() => {
    if (activeVoiceSelectionLineId && selectedVoice) {
      updateVoice(activeVoiceSelectionLineId, selectedVoice);
      setActiveVoiceSelectionLineId(null);
    }
  }, [selectedVoice, activeVoiceSelectionLineId, updateVoice]);

  // 첫 번째 대사 추가 핸들러
  const handleStartStory = () => {
    //console.log("스토리 시작하기 버튼 클릭됨");
    addLine();
    //console.log("새 라인 ID:", newLineId);
    //console.log("현재 대사 라인 수:", dialogueLines.length);

    // 첫 대사 추가 후 상단에 안내 메시지 표시
    setTimeout(() => {
      // console.log("타임아웃 실행됨, 대사 라인 수:", dialogueLines.length);
      messageApi.info({
        content:
          "대사를 입력한 후 '음성 선택' 버튼을 클릭하여 목소리를 지정해주세요.",
        duration: 5,
      });
    }, 500);
  };

  // 대사 추가 핸들러
  const handleAddLine = () => {
    // 가이드 메시지 숨기기
    setShowVoiceGuide(false);
    addLine();
    //console.log("새 대사 라인 추가됨, ID:", newLineId);
  };

  // 대사 텍스트 변경 핸들러
  const handleTextChange = (id: string, text: string) => {
    updateLine(id, text);
  };

  // 목소리 선택 클릭 핸들러
  const handleVoiceSelectClick = (id: string) => {
    // 이미 활성화된 라인이 있으면 중복 요청 방지
    if (activeVoiceSelectionLineId) return;

    // 가이드 메시지 숨기기
    setShowVoiceGuide(false);
    setActiveVoiceSelectionLineId(id);

    // 대화 라인 번호 찾기
    const lineIndex = dialogueLines.findIndex((line) => line.id === id);
    const lineNumber = lineIndex !== -1 ? lineIndex + 1 : null; // 1부터 시작하는 라인 번호

    // 기존 음성을 선택 상태로 설정 (이미 선택된 음성이 있는 경우)
    const line = dialogueLines.find((line) => line.id === id);
    if (line && line.voice) {
      setSelectedVoice(line.voice);
    } else {
      setSelectedVoice(null);
    }

    // 컨테이너에 음성 선택 중임을 알리는 커스텀 이벤트 발생
    const customEvent = new CustomEvent("storyMakerVoiceSelectionActive", {
      detail: {
        active: true,
        lineId: id,
        lineNumber: lineNumber,
      },
    });
    window.dispatchEvent(customEvent);
  };

  // 대사 삭제 핸들러
  const handleDeleteLine = (id: string) => {
    // 현재 활성화된 음성 선택 중이면 취소
    if (activeVoiceSelectionLineId) {
      const cancelEvent = new CustomEvent("storyMakerVoiceSelectionCancelled", {
        detail: { lineId: activeVoiceSelectionLineId },
      });
      window.dispatchEvent(cancelEvent);
      setActiveVoiceSelectionLineId(null);
    }

    removeLine(id);
  };

  // 음성 생성 핸들러
  const handleCreateSpeech = () => {
    // 각 대화 라인을 구조화된 데이터로 변환
    const dialogueItems = dialogueLines.map((line) => ({
      text: line.text,
      speakerName: line.voice?.speaker_name || "Unknown",
      avatarUrl: getAvatarUrl(line.voice),
    }));

    // AudioPlayer 이벤트 발생 (임시 오디오 URL 사용)
    const customEvent = new CustomEvent("showAudioPlayer", {
      detail: {
        audioUrl: "/audiodata/sample.wav",
        voiceName: "Story Dialogue",
        text: dialogueLines.map((line) => line.text).join(" "), // 기존 호환성 유지
        avatarUrl: "/speakerdata/profiles/man.png",
        dialogueItems: dialogueItems,
        isDialogueMode: true,
      },
    });
    window.dispatchEvent(customEvent);

    // 성공 메시지 표시
    messageApi.success({
      content: "음성이 생성되었습니다!",
      duration: 3,
    });
  };

  // 프로필 이미지 경로를 동적으로 생성하는 함수
  const getAvatarUrl = (voice: Voice | null) => {
    if (!voice) return "/speakerdata/profiles/man.png";

    // 1. 직접 avatar_url이 있으면 사용
    if (voice.avatar_url) return voice.avatar_url;

    // 2. gender 속성을 기반으로 이미지 경로 생성
    const gender = voice.gender?.toLowerCase();

    // 성별에 따른 이미지 선택
    if (gender === "female") return "/speakerdata/profiles/woman.png";
    if (gender === "male") return "/speakerdata/profiles/man.png";
    if (gender === "girl") return "/speakerdata/profiles/girl.png";
    if (gender === "boy") return "/speakerdata/profiles/boy.png";

    // 기본 이미지
    return "/speakerdata/profiles/man.png";
  };

  // 초기 상태 (대사 없음)
  if (dialogueLines.length === 0) {
    //console.log("대사 라인이 없음, 초기 상태 렌더링");
    return (
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          ...darkThemeConfig,
        }}
      >
        {contextHolder}
        <div className="h-full flex flex-col items-center justify-center">
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleStartStory}
            className="mb-4"
          >
            스토리 시작하기
          </Button>
          <p className="text-gray-400 text-sm max-w-md text-center">
            대사를 추가하고 각 캐릭터에 다양한 목소리를 선택하여 멀티보이스
            대화를 만들어보세요.
          </p>
        </div>
      </ConfigProvider>
    );
  }

  // console.log(
  //   "대사 라인이 있음, 대화 인터페이스 렌더링, 라인 수:",
  //   dialogueLines.length
  // );
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        ...darkThemeConfig,
      }}
    >
      {contextHolder}
      <div className="h-full flex flex-col">
        {/* 목소리 선택 가이드 */}
        {showVoiceGuide && recentlySelectedLineId && (
          <div className="mb-4 p-3 bg-green-500 bg-opacity-20 border border-green-400 rounded-lg animate-fadeIn">
            <p className="text-sm text-green-300">
              <span className="font-medium">목소리 선택 완료!</span> &quot;음성
              변경&quot; 버튼을 클릭하여 목소리를 변경할 수 있습니다.
            </p>
          </div>
        )}

        <div className="flex-1 overflow-auto [&::-webkit-scrollbar]:hidden">
          {dialogueLines.map((line, index) => (
            <DialogueLine
              key={line.id}
              line={line}
              lineNumber={index + 1}
              onTextChange={handleTextChange}
              onVoiceSelect={updateVoice}
              onDelete={handleDeleteLine}
              onVoiceSelectClick={handleVoiceSelectClick}
              isVoiceSelectionActive={activeVoiceSelectionLineId !== null}
              isLastLine={index === dialogueLines.length - 1}
              highlightLine={recentlySelectedLineId === line.id}
            />
          ))}
          <div className="mb-4">
            <Button
              icon={<PlusOutlined />}
              onClick={handleAddLine}
              disabled={activeVoiceSelectionLineId !== null}
              className="border-dashed border-gray-600 text-gray-400 hover:text-gray-300 hover:border-gray-500"
            >
              대사 추가하기
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <Button
            type="primary"
            size="large"
            icon={<PlayCircleOutlined />}
            onClick={handleCreateSpeech}
            disabled={!isCreateSpeechEnabled}
            className="w-full"
          >
            음성 생성하기
          </Button>
          {!isCreateSpeechEnabled && dialogueLines.length > 0 && (
            <p className="text-gray-500 text-xs mt-2 text-center">
              {dialogueLines.length < 2
                ? "최소 2개의 대사와 각 대사에 목소리를 선택해주세요"
                : "각 대사에 목소리를 선택해주세요"}
            </p>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
}
