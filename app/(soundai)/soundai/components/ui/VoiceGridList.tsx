"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Button, Input, Select, ConfigProvider, theme } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import VoiceCard from "@/app/(soundai)/soundai/components/ui/VoiceCard";
import {
  Voice,
  useSelectedVoice,
} from "@/app/(soundai)/soundai/components/stores/voiceStore";
import { darkThemeConfig } from "@/app/(soundai)/soundai/components/styles/theme";

// 경로 설정
const PATHS = {
  speakerData: "/speakerdata/speaker_data.json",
};

interface VoiceGridListProps {
  columns?: 2 | 3 | 4; // 표시할 열 수
  containerClassName?: string; // 추가 클래스명
  searchContainerClassName?: string; // 검색 컨테이너 클래스명
  gridContainerClassName?: string; // 그리드 컨테이너 클래스명
  gridScrollClassName?: string; // 그리드 스크롤 영역 클래스명 (높이 제어용)
  selectionStyle?: "background" | "border"; // 선택 스타일
  onVoiceSelect?: (voice: Voice) => void; // 음성 선택 핸들러 (선택 사항)
  enableCustomSelection?: boolean; // 커스텀 선택 핸들러 사용 여부
  filterContainerBgClass?: string; // 필터 컨테이너 배경 클래스
}

export default function VoiceGridList({
  columns = 4,
  containerClassName = "",
  searchContainerClassName = "",
  gridContainerClassName = "",
  gridScrollClassName = "h-[calc(100vh-450px)]", // 기본 스크롤 영역 높이
  selectionStyle = "border",
  onVoiceSelect,
  enableCustomSelection = false,
  filterContainerBgClass = "bg-[#2a2a2a]",
}: VoiceGridListProps) {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [filteredVoices, setFilteredVoices] = useState<Voice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    gender: "all",
    age: "all",
    style: "all",
  });
  const { selectedVoice, setSelectedVoice } = useSelectedVoice();

  // 선택 처리 중 상태 추가
  const isSelectingRef = useRef(false);

  // getUniqueOptions 함수를 useCallback으로 메모이제이션
  const getUniqueOptions = useCallback(
    (field: keyof Voice) => {
      const options = voices
        .map((voice) => voice[field])
        .flat() // style 필드가 배열일 수 있으므로 flat 사용
        .filter((value, index, self) => self.indexOf(value) === index)
        .filter(Boolean); // null/undefined 제거

      return [
        { value: "all", label: field },
        ...options.map((option) => ({
          value: option,
          label: option,
        })),
      ];
    },
    [voices]
  );

  // 음성 데이터 로딩 최적화
  useEffect(() => {
    // 캐시 시스템 활용 (세션 스토리지)
    const cachedData = sessionStorage.getItem("voiceData");

    if (cachedData) {
      try {
        const data = JSON.parse(cachedData);
        setVoices(data);
        setFilteredVoices(data);
      } catch (error) {
        console.error("Failed to parse cached speaker data:", error);
        fetchSpeakerData();
      }
    } else {
      fetchSpeakerData();
    }

    function fetchSpeakerData() {
      fetch(PATHS.speakerData)
        .then((res) => res.json())
        .then((data) => {
          setVoices(data);
          setFilteredVoices(data);
          // 데이터 캐싱
          try {
            sessionStorage.setItem("voiceData", JSON.stringify(data));
          } catch (error) {
            console.warn("Failed to cache speaker data:", error);
          }
        })
        .catch((error) => {
          console.error("Failed to load speaker data:", error);
        });
    }
  }, []);

  // 필터 옵션들을 동적으로 생성
  const genderOptions = useMemo(
    () => getUniqueOptions("gender"),
    [getUniqueOptions]
  );
  const ageOptions = useMemo(
    () => getUniqueOptions("age_group"),
    [getUniqueOptions]
  );
  const styleOptions = useMemo(
    () => getUniqueOptions("style"),
    [getUniqueOptions]
  );

  // 검색 및 필터링 로직 (디바운싱 적용)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      let result = voices;

      // 검색어 필터링
      if (searchQuery) {
        result = result.filter(
          (voice) =>
            voice.speaker_name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            voice.speaker_group
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        );
      }

      // 필터 적용
      if (filters.gender !== "all") {
        result = result.filter((voice) => voice.gender === filters.gender);
      }
      if (filters.age !== "all") {
        result = result.filter((voice) => voice.age_group === filters.age);
      }
      if (filters.style !== "all") {
        result = result.filter((voice) => voice.style.includes(filters.style));
      }

      // 필터링된 결과를 상태로 설정
      setFilteredVoices(result);
    }, 100); // 100ms 디바운스

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery, filters, voices]);

  // 음성 선택 핸들러 최적화
  const handleVoiceSelect = useCallback(
    (voice: Voice) => {
      // 중복 선택 방지
      if (isSelectingRef.current) return;
      isSelectingRef.current = true;

      // UI 반응성을 유지하기 위해 시각적 피드백을 즉시 제공
      const targetVoiceElement = document.querySelector(
        `[data-voice-code="${voice.speaker_code}"]`
      );
      if (targetVoiceElement) {
        targetVoiceElement.classList.add("selecting-animation");
      }

      if (enableCustomSelection && onVoiceSelect) {
        // 실제 선택 로직은 다음 프레임에서 비동기적으로 처리
        requestAnimationFrame(() => {
          onVoiceSelect(voice);
          // 처리 완료 후 플래그 초기화 (약간의 지연을 두어 중복 클릭 방지)
          setTimeout(() => {
            isSelectingRef.current = false;
            if (targetVoiceElement) {
              targetVoiceElement.classList.remove("selecting-animation");
            }
          }, 100);
        });
      } else {
        // 일반적인 선택 로직
        requestAnimationFrame(() => {
          setSelectedVoice(voice);
          setTimeout(() => {
            isSelectingRef.current = false;
            if (targetVoiceElement) {
              targetVoiceElement.classList.remove("selecting-animation");
            }
          }, 100);
        });
      }
    },
    [enableCustomSelection, onVoiceSelect, setSelectedVoice]
  );

  // 컬럼 수에 따른 클래스 계산
  const getColumnClass = useCallback(() => {
    switch (columns) {
      case 2:
        return "grid-cols-1 sm:grid-cols-2";
      case 3:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      case 4:
      default:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    }
  }, [columns]);

  // 필터 초기화 핸들러
  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setFilters({ gender: "all", age: "all", style: "all" });
  }, []);

  return (
    <div className={`p-2 flex flex-col ${containerClassName}`}>
      {/* 검색 및 필터 섹션 */}
      <div
        className={`${filterContainerBgClass} rounded-lg p-2 mb-6 shadow-md ${searchContainerClassName}`}
      >
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            ...darkThemeConfig,
          }}
        >
          <div className="flex flex-wrap items-center gap-4 w-full">
            <Input.Search
              placeholder="음성 검색..."
              className="flex-1 min-w-[250px]"
              allowClear
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select
              value={filters.gender}
              className="w-28"
              options={genderOptions}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, gender: value }))
              }
            />
            <Select
              value={filters.age}
              className="w-28"
              options={ageOptions}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, age: value }))
              }
            />
            <Select
              value={filters.style}
              className="w-28"
              options={styleOptions}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, style: value }))
              }
            />
            <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>
              초기화
            </Button>
          </div>
        </ConfigProvider>
      </div>

      {/* 음성 카드 그리드 스크롤 컨테이너 */}
      <div className={`${gridScrollClassName} overflow-hidden`}>
        <div className="h-full overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden">
          {/* 음성 카드 그리드 */}
          <div
            className={`grid ${getColumnClass()} gap-5 auto-rows-max ${gridContainerClassName}`}
          >
            {filteredVoices.length > 0 ? (
              filteredVoices.map((voice) => (
                <div
                  className="w-full"
                  key={voice.speaker_code}
                  data-voice-code={voice.speaker_code} // 요소 참조용 속성 추가
                >
                  <VoiceCard
                    name={voice.speaker_name}
                    speaker_code={voice.speaker_code.toString()}
                    styles={
                      Array.isArray(voice.style) ? voice.style : [voice.style]
                    }
                    age={voice.age_group}
                    gender={`${voice.gender}성`}
                    description={`${voice.age_group} | ${
                      Array.isArray(voice.style)
                        ? voice.style.join(", ")
                        : voice.style
                    }`}
                    isSelected={
                      selectedVoice?.speaker_code === voice.speaker_code
                    }
                    selectionStyle={selectionStyle}
                    onClick={() => handleVoiceSelect(voice)}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-4 py-10 text-center text-gray-400">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 선택 애니메이션 스타일 */}
      <style jsx global>{`
        .selecting-animation {
          transform: scale(0.98);
          transition: transform 0.1s ease;
        }
      `}</style>
    </div>
  );
}
