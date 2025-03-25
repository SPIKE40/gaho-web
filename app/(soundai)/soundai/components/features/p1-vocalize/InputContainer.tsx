// 사용자 인풋을 받기 위한 컨테이너 컴포넌트
"use client";

import { useState, useEffect } from "react";
import { useTextStore } from "../../stores/textStore";
import { useTabStore } from "../../stores/tabStore";
import { useSelectedVoice } from "../../stores/voiceStore";
import StoryMakerTabContent from "./StoryMakerTabContent";

// 아이콘 컴포넌트 분리
const Icons = {
  Edit: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  ),
  Document: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  Book: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  ),
  Spinner: () => (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  ),
};

// 탭 버튼 컴포넌트
interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  isPro?: boolean;
}

const TabButton = ({
  isActive,
  onClick,
  icon,
  label,
  isPro,
}: TabButtonProps) => (
  <button
    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium min-w-[140px] whitespace-nowrap ${
      isActive
        ? "text-blue-500 border-b-2 border-blue-500"
        : "text-gray-400 hover:text-gray-300"
    }`}
    onClick={onClick}
  >
    {icon}
    {label}
    {isPro && (
      <span className="ml-1 px-2 py-0.5 rounded text-xs font-bold bg-gray-700 text-gray-300">
        PRO
      </span>
    )}
  </button>
);

// 기본 탭 컨텐츠 컴포넌트
interface BasicTabContentProps {
  text: string;
  handleTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleGenerateScript: () => void;
  isGenerating: boolean;
  maxLength: number;
  onSubmit: () => void;
}

const BasicTabContent = ({
  text,
  handleTextChange,
  handleGenerateScript,
  isGenerating,
  maxLength,
  onSubmit,
}: BasicTabContentProps) => {
  const { selectedVoice } = useSelectedVoice();

  return (
    <div className="relative flex flex-col h-full">
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={handleGenerateScript}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-gray-700 hover:bg-gray-600 text-white ${
            isGenerating ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Icons.Spinner />
              생성 중...
            </>
          ) : (
            <>
              <Icons.Document />
              스크립트 자동 생성
            </>
          )}
        </button>
        {selectedVoice && (
          <div className="px-4 py-2 bg-gray-700 rounded-md">
            <span className="text-sm text-gray-300">
              선택된 음성: {selectedVoice.speaker_name}
            </span>
          </div>
        )}
      </div>
      <div className="relative flex-1">
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="음성으로 변환하고 싶은 텍스트를 입력하세요."
          maxLength={maxLength}
          className="w-full h-full bg-transparent text-gray-200 focus:outline-none resize-none overflow-auto pb-8 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500"
        />
        <div className="absolute bottom-2 right-4">
          <span className="text-sm text-gray-400">
            {text.length}/{maxLength}
          </span>
        </div>
      </div>
    </div>
  );
};

// 개발 중인 탭 컴포넌트
const ComingSoonTab = ({ message }: { message: string }) => (
  <div className="h-[800px] flex items-center justify-center">
    <span className="text-gray-400">{message}</span>
  </div>
);

export default function InputContainer() {
  // 분리된 스토어에서 필요한 상태와 함수만 구독
  const { text: globalText, setText } = useTextStore();
  const { activeTab, setActiveTab } = useTabStore();

  /**
   * 성능 최적화: 로컬 상태로 텍스트 관리
   *
   * @description
   * 로컬 상태를 사용하여 텍스트 입력의 반응성을 개선함.
   * (기존에는 매 입력마다 전역 상태를 업데이트했으나, 이는 불필요한 리렌더링을 발생시켰음.)
   * 로컬 상태로 관리하면 다음과 같은 이점이 있음:
   * 1. 입력 지연 없는 즉각적인 반응성
   * 2. 전역 상태 구독 컴포넌트의 불필요한 리렌더링 방지
   * 3. 필요한 시점(음성 생성 시)에만 전역 상태 업데이트
   */
  const [localText, setLocalText] = useState(globalText);
  const maxLength = 1000;
  const [isGenerating, setIsGenerating] = useState(false);

  // activeTab 변경 감지
  useEffect(() => {
    console.log("현재 활성 탭:", activeTab);
  }, [activeTab]);

  /**
   * 텍스트 입력 핸들러
   *
   * @performance
   * 로컬 상태만 업데이트하여 빈번한 입력 이벤트의 성능을 최적화함.
   * 전역 상태 업데이트는 발생하지 않으므로 다른 컴포넌트는 리렌더링되지 않음.
   */
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= maxLength) {
      setLocalText(newText);
    }
  };

  /**
   * 전역 상태 업데이트 핸들러
   *
   * @description
   * 중요한 이벤트(음성 생성 버튼 클릭)에서만 전역 상태를 업데이트함.
   * 이를 통해 불필요한 리렌더링을 최소화하면서도 필요한 시점에 다른 컴포넌트와 상태를 공유할 수 있음.
   */
  const handleSubmitText = () => {
    setText(localText);
  };

  const sampleScript = `세상은 날 이상하다 했어. 남들과 다른 길을 간다고 손가락질했지. 하지만 난 괜찮아. 똑같은 길을 걷는 건 내게 어울리지 않거든. 난 하늘을 새로 그리고, 별을 다시 놓고 싶어. 세상이 '그건 안 돼'라고 말할 때, 난 '왜 안 될까?'라고 되묻는 사람이야. 꿈을 꾸는 건 내 힘이고, 혼란 속에서도 길을 만드는 게 나야. 힘들다고? 당연하지. 그래도 난 멈추지 않아. 넘어질 때마다 더 크게 일어설 거야. 내 안에 타오르는 불꽃이 있으니까. 세상을 바꾸는 건 조용히 따르는 사람들이 아니야. 다르게 생각하고, 끝까지 밀어붙이는 사람들만이 해낼 수 있어. 난 그 길을 갈 거야. 나만의 방식으로. 그리고 언젠가, 세상이 내 발자취를 따라올 거야.`;

  const typeText = (fullText: string) => {
    let currentIndex = 0;
    setIsGenerating(true);

    const typing = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setLocalText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typing);
        setIsGenerating(false);
        // 타이핑 완료 후 전역 상태 업데이트
        setText(fullText);
      }
    }, 25); // 타이핑 속도 (ms)

    // 컴포넌트가 언마운트되면 타이핑을 중지
    return () => clearInterval(typing);
  };

  /**
   * 자동 스크립트 생성 핸들러
   *
   * @flow
   * 1. 로컬 텍스트 초기화
   * 2. 타이핑 효과로 샘플 스크립트 표시
   * 3. 타이핑 완료 후 전역 상태 업데이트 (setText 호출)
   */
  const handleGenerateScript = () => {
    if (!isGenerating) {
      setLocalText(""); // 로컬 텍스트 초기화
      typeText(sampleScript);
    }
  };

  return (
    <div className="w-1/2 h-[calc(100vh-280px)]">
      <div className="rounded-lg shadow-lg bg-[#262626] h-full flex flex-col">
        {/* 탭 헤더 */}
        <div className="flex border-b border-gray-700 px-4 pt-3">
          <TabButton
            isActive={activeTab === "basic"}
            onClick={() => setActiveTab("basic")}
            icon={<Icons.Edit />}
            label="Input Text"
          />
          <TabButton
            isActive={activeTab === "pro"}
            onClick={() => setActiveTab("pro")}
            icon={<Icons.Document />}
            label="Input Text"
            isPro
          />
          <TabButton
            isActive={activeTab === "story"}
            onClick={() => setActiveTab("story")}
            icon={<Icons.Book />}
            label="Story Maker"
          />
        </div>

        {/* 탭 컨텐츠 */}
        <div className="p-4 flex-1 overflow-hidden flex flex-col">
          {activeTab === "basic" && (
            <BasicTabContent
              text={localText}
              handleTextChange={handleTextChange}
              handleGenerateScript={handleGenerateScript}
              isGenerating={isGenerating}
              maxLength={maxLength}
              onSubmit={handleSubmitText}
            />
          )}

          {activeTab === "pro" && (
            <ComingSoonTab message="Pro features coming soon..." />
          )}

          {activeTab === "story" && <StoryMakerTabContent />}
        </div>
      </div>
    </div>
  );
}
