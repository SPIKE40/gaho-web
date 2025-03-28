import { Space, Typography } from "antd";
import { PlayCircleOutlined, StarOutlined } from "@ant-design/icons";
import Image from "next/image";
import { memo, useMemo, useCallback } from "react";

const { Text } = Typography;

// 개별 음성 정보를 카드 형태로 보여주는 컴포넌트
interface VoiceCardProps {
  name: string;
  speaker_code?: string; // speakerCode에서 speaker_code로 변경
  description?: string;
  styles?: string[]; // 스타일 목록 추가
  age?: string; // 나이 정보 분리
  gender?: string; // 성별 정보 분리
  ageGender?: string; // 기존 호환성 유지
  profileImage?: string; // 프로필 이미지 URL 추가
  isSelected: boolean;
  selectionStyle?: "background" | "border";
  onClick: () => void;
}

// React.memo를 사용하여 불필요한 리렌더링 방지
const VoiceCard = memo(
  function VoiceCard({
    name,
    speaker_code,
    styles = [],
    age,
    gender,
    ageGender,
    profileImage,
    isSelected,
    selectionStyle = "background",
    onClick,
  }: VoiceCardProps) {
    // 선택 스타일에 따라 다른 클래스 적용 (메모이제이션)
    const selectedClass = useMemo(
      () =>
        selectionStyle === "border"
          ? "border-2 border-blue-500" // 테두리만 변경
          : "bg-blue-500 bg-opacity-20", // 기존 배경색 변경
      [selectionStyle]
    );

    // 나이와 성별 정보 처리 (독립 필드 또는 통합 필드 사용)
    const ageInfo = useMemo(
      () => age || ageGender?.split(" ")?.[0] || "",
      [age, ageGender]
    );
    const genderInfo = useMemo(
      () => gender || ageGender?.split(" ")?.[1] || "",
      [gender, ageGender]
    );

    // 4가지 기본 프로필 이미지 선택 로직 (메모이제이션)
    const profileImageUrl = useMemo(() => {
      if (profileImage) return profileImage; // 직접 지정된 이미지가 있으면 그것을 사용

      const isChild =
        ageInfo?.toLowerCase().includes("child") ||
        ageInfo?.includes("어린이") ||
        ageInfo?.includes("아동") ||
        parseInt(ageInfo) < 18;

      const isMale =
        genderInfo?.toLowerCase().includes("male") ||
        genderInfo?.includes("남성") ||
        genderInfo?.includes("남자");

      if (isChild) {
        return isMale
          ? "/speakerdata/profiles/boy.png"
          : "/speakerdata/profiles/girl.png";
      } else {
        return isMale
          ? "/speakerdata/profiles/man.png"
          : "/speakerdata/profiles/woman.png";
      }
    }, [profileImage, ageInfo, genderInfo]);

    // 이벤트 핸들러 최적화
    const handleSamplePlay = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      // 샘플 재생 로직
    }, []);

    const handleFavorite = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      // 즐겨찾기 로직
    }, []);

    // 선택 상태 클래스 계산 (메모이제이션)
    const cardClass = useMemo(
      () => `
    p-4 rounded-lg cursor-pointer box-border relative
    ${isSelected ? selectedClass : "border-2 border-gray-700"} 
    hover:border-blue-400 bg-gray-800
    transform transition-all duration-150 hover:scale-[1.01]
  `,
      [isSelected, selectedClass]
    );

    return (
      <div className={cardClass} onClick={onClick}>
        <Space direction="vertical" size="small" className="w-full">
          {/* 프로필 이미지를 오버레이로 표시 */}
          <div className="absolute w-10 h-10 rounded-full overflow-hidden bg-gray-700 relative">
            <Image
              src={profileImageUrl}
              alt={`${name} 프로필`}
              fill
              sizes="40px"
              className="object-cover"
              loading="lazy" // 지연 로딩 추가
            />
          </div>
          {/* 이름과 스피커코드 */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-base">{name}</span>
            <span className="text-gray-400 text-xs">
              {speaker_code !== undefined ? speaker_code : "코드 없음"}
            </span>
          </div>

          {/* 스타일 목록 */}
          {styles.length > 0 && (
            <Text className="text-sm text-gray-300">{styles.join(", ")}</Text>
          )}

          {/* 나이 및 성별 배지 */}
          <div className="flex gap-2 mt-1">
            {ageInfo && (
              <span className="text-xs px-2 py-1 bg-gray-700 rounded-full">
                {ageInfo}
              </span>
            )}
            {genderInfo && (
              <span className="text-xs px-2 py-1 bg-gray-700 rounded-full">
                {genderInfo}
              </span>
            )}
          </div>

          {/* 버튼 영역 */}
          <div className="flex items-center justify-between mt-2">
            <span
              onClick={handleSamplePlay}
              className="text-[#1677ff] hover:text-[#4096ff] cursor-pointer flex items-center gap-1"
            >
              <PlayCircleOutlined />
              Sample
            </span>
            <span
              onClick={handleFavorite}
              className="text-gray-400 hover:text-gray-300 cursor-pointer flex items-center gap-1"
            >
              <StarOutlined />
              Favorite
            </span>
          </div>
        </Space>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // 커스텀 비교 로직으로 불필요한 리렌더링 방지
    return (
      prevProps.name === nextProps.name &&
      prevProps.speaker_code === nextProps.speaker_code &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.selectionStyle === nextProps.selectionStyle
    );
  }
);

export default VoiceCard;
