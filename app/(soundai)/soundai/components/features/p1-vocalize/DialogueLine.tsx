"use client";

import { useState, useRef, useEffect } from "react";
import { Button, Tooltip } from "antd";
import { DeleteOutlined, SoundOutlined } from "@ant-design/icons";
import { DialogueLine as DialogueLineType } from "../../stores/storyStore";
import { Voice } from "../../stores/voiceStore";

interface DialogueLineProps {
  line: DialogueLineType;
  lineNumber: number;
  onTextChange: (id: string, text: string) => void;
  onVoiceSelect: (id: string, voice: Voice) => void;
  onDelete: (id: string) => void;
  onVoiceSelectClick: (id: string) => void;
  isVoiceSelectionActive: boolean;
  isLastLine: boolean;
  highlightLine?: boolean;
}

export default function DialogueLine({
  line,
  lineNumber,
  onTextChange,
  onDelete,
  onVoiceSelectClick,
  isVoiceSelectionActive,
  isLastLine,
  highlightLine = false,
}: DialogueLineProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isVoiceUpdated, setIsVoiceUpdated] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevVoiceRef = useRef<Voice | null>(line.voice);

  // 텍스트 변경 핸들러
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(line.id, e.target.value);
  };

  // 삭제 버튼 클릭 핸들러
  const handleDelete = () => {
    onDelete(line.id);
  };

  // 목소리 선택 버튼 클릭 핸들러
  const handleVoiceSelectClick = () => {
    onVoiceSelectClick(line.id);
  };

  // 음성이 변경되었을 때 효과 적용
  useEffect(() => {
    if (prevVoiceRef.current?.speaker_code !== line.voice?.speaker_code) {
      // 음성이 변경되었을 때
      if (line.voice) {
        setIsVoiceUpdated(true);
        // 잠시 후 효과 제거
        const timer = setTimeout(() => {
          setIsVoiceUpdated(false);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }

    // 현재 음성 정보 업데이트
    prevVoiceRef.current = line.voice;
  }, [line.voice]);

  // textarea 높이 자동 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [line.text]);

  return (
    <div
      className={`mb-4 p-4 rounded-lg transition-all ${
        isFocused
          ? "bg-[#2a2a40]"
          : highlightLine
          ? "bg-[#2a3a30]"
          : "bg-[#1e1e2e]"
      } ${isVoiceSelectionActive && !isFocused ? "opacity-50" : "opacity-100"}`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span className="text-sm font-semibold text-gray-400 mr-2">
            Line {lineNumber}
          </span>
          {line.voice && (
            <div
              className={`rounded-full px-3 py-1 text-xs flex items-center ${
                isVoiceUpdated ? "bg-green-600 animate-pulse" : "bg-[#3a3a50]"
              }`}
            >
              <SoundOutlined
                className={`mr-1 ${
                  isVoiceUpdated ? "text-white" : "text-indigo-400"
                }`}
              />
              <span
                className={`${
                  isVoiceUpdated ? "text-white font-medium" : "text-gray-300"
                }`}
              >
                Voice: {line.voice.speaker_name}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            type={line.voice ? "default" : "primary"}
            size="small"
            icon={<SoundOutlined />}
            onClick={handleVoiceSelectClick}
            className={`${
              isVoiceSelectionActive && !isFocused
                ? "opacity-50"
                : "opacity-100"
            }`}
            disabled={isVoiceSelectionActive && !isFocused}
          >
            {line.voice ? "음성 변경" : "음성 선택"}
          </Button>
          {!isLastLine && (
            <Tooltip title="Delete Line">
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={handleDelete}
                disabled={isVoiceSelectionActive && !isFocused}
              />
            </Tooltip>
          )}
        </div>
      </div>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={line.text}
          onChange={handleTextChange}
          placeholder="이곳에 대화 내용을 입력하세요..."
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-transparent border border-gray-700 rounded-md p-3 text-gray-200 focus:outline-none focus:border-indigo-500 resize-none min-h-[80px] transition-all"
          disabled={isVoiceSelectionActive && !isFocused}
        />
      </div>
    </div>
  );
}
