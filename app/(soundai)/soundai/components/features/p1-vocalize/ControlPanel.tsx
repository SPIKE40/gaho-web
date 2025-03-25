"use client";

import { Button, Space } from "antd";
import { PlayCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Voice, useSelectedVoice } from "../../stores/voiceStore";
import { useTextStore } from "../../stores/textStore";
import { useTabStore } from "../../stores/tabStore";
import { useHistoryStore } from "../../stores/historyStore";

export default function ControlPanel() {
  const { selectedVoice } = useSelectedVoice();
  const { text } = useTextStore();
  const { activeTab } = useTabStore();
  const { addHistoryItem } = useHistoryStore();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateSpeech = () => {
    if (!selectedVoice) {
      alert("음성을 선택해주세요.");
      return;
    }

    if (!text.trim()) {
      alert("텍스트를 입력해주세요.");
      return;
    }

    // 음성 생성 시작
    setIsCreating(true);

    // API 호출 시뮬레이션 (3초 딜레이)
    setTimeout(() => {
      // 음성 생성 완료
      setIsCreating(false);

      // 성공 알림 표시와 오디오 플레이어 표시를 순차적으로 실행
      window.dispatchEvent(new CustomEvent("showSuccessNotification"));

      // ==========================================================
      // MARK: 🔊 오디오 플레이어 표시 이벤트 전송
      // ==========================================================
      // - TTS 처리가 완료된 후, 생성된 오디오 파일을 재생하기 위해
      //   `showAudioPlayer` 이벤트를 브라우저 전역에 디스패치함.
      // - 이벤트 디테일에는 오디오 파일 URL, 선택한 음성, 텍스트 정보를 포함함.

      // 프로필 이미지 경로를 동적으로 생성하는 함수
      const getAvatarUrl = (voice: Voice) => {
        // 1. 직접 avatar_url이 있으면 사용
        if (voice.avatar_url) return voice.avatar_url;

        // 2. speaker_code를 기반으로 이미지 경로 생성
        const gender = voice.gender?.toLowerCase();

        // 성별에 따른 이미지 선택
        if (gender === "female") return "/speakerdata/profiles/woman.png";
        if (gender === "male") return "/speakerdata/profiles/man.png";
        if (gender === "girl") return "/speakerdata/profiles/girl.png";
        if (gender === "boy") return "/speakerdata/profiles/boy.png";

        // 기본 이미지
        return "/speakerdata/profiles/man.png";
      };

      // TODO: 백엔드 API 연동 시 실제 생성된 .wav 파일 URL을 사용해야 함
      // 현재는 테스트를 위한 더미 URL을 사용합니다.
      const dummyAudioUrl = "/audiodata/sample.wav";
      const avatarUrl = getAvatarUrl(selectedVoice);

      // 히스토리에 추가
      addHistoryItem({
        text,
        audioUrl: dummyAudioUrl,
        voiceName: selectedVoice.speaker_name,
        avatarUrl,
      });

      // 오디오 플레이어 표시
      window.dispatchEvent(
        new CustomEvent("showAudioPlayer", {
          detail: {
            audioUrl: dummyAudioUrl,
            voiceName: selectedVoice.speaker_name,
            text: text,
            avatarUrl,
          },
        })
      );

      console.log("음성 생성 완료:", {
        text,
        voice: selectedVoice,
      });
    }, 3000);
  };

  return (
    <div className="h-[100px] mt-4">
      <div className="rounded-lg shadow-lg bg-[#262626] p-4">
        <Button
          type="primary"
          size="large"
          icon={isCreating ? <LoadingOutlined /> : <PlayCircleOutlined />}
          onClick={handleCreateSpeech}
          disabled={isCreating}
          className="w-full bg-[#00C288] hover:bg-[#00B077]"
        >
          음성 생성하기
        </Button>
      </div>
    </div>
  );
}
