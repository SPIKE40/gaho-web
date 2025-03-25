import {
  DeleteOutlined,
  PlayCircleOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Button, Card } from "antd";
import Image from "next/image";
import { HistoryItem } from "../stores/historyStore";

interface HistoryCardProps {
  item: HistoryItem;
  onPlay: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

export default function HistoryCard({
  item,
  onPlay,
  onDelete,
}: HistoryCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Card
      className="border-[#4a4a60]/30 hover:border-[#4a4a60]/50 transition-all relative overflow-hidden"
      styles={{ body: { padding: "1.5rem", background: "transparent" } }}
    >
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 bg-[#262626]/80 backdrop-blur-sm" />

      {/* 헤더 장식 효과 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-80" />
        <div className="absolute -left-20 top-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        <div className="absolute -right-20 top-20 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute left-40 bottom-0 w-40 h-40 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
      </div>

      {/* 컨텐츠 */}
      <div className="relative z-10 flex flex-col gap-4">
        {/* HEADER */}
        <div className="flex items-center gap-4">
          {/* 헤더 스피커 프로필 썸네일 이미지 */}
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-tr from-purple-600 to-blue-400 p-0.5 shadow-lg flex-shrink-0">
            <div className="w-full h-full bg-[#1a1a2e] rounded-lg overflow-hidden flex items-center justify-center">
              <Image
                src={item.avatarUrl}
                width={52}
                height={52}
                alt={item.voiceName}
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          {/* 헤더 텍스트: 스피커 이름, 생성시간*/}
          <div>
            <h3 className="text-white font-medium text-lg flex items-center gap-2">
              {item.voiceName}
            </h3>
            <p className="text-xs text-gray-400">
              {formatDate(item.createdAt)}
            </p>
          </div>

          {/* Spacer 역할을 하는 div */}
          <div className="flex-1"></div>

          {/* 삭제 버튼 */}
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => onDelete(item.id)}
          />
        </div>

        {/* BODY */}
        <div className="space-y-3">
          {/* 텍스트 */}
          <div className="bg-[#1a1a2e]/60 p-3 rounded-lg text-sm text-gray-300">
            <span className="text-indigo-400 text-xl opacity-50">&quot;</span>
            {item.text}
            <span className="text-indigo-400 text-xl opacity-50">&quot;</span>
          </div>

          {/* arrow down */}
          <div className="flex justify-center items-center h-8 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 relative flex flex-col items-center justify-center">
                <DownOutlined
                  style={{ color: "white" }}
                  className="text-lg animate-bounce"
                />
                <DownOutlined
                  style={{ color: "white" }}
                  className="text-lg animate-bounce"
                />
              </div>
            </div>
          </div>

          {/* 재생 버튼 */}
          <div className="flex justify-center items-center">
            <button
              onClick={() => onPlay(item)}
              className="w-[100px] h-[100px] relative group overflow-hidden rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              {/* 버튼 배경 그라데이션 */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-90"></div>

              {/* 내부 원형 효과 */}
              <div className="absolute inset-2 rounded-full bg-[#2a2a3e] flex items-center justify-center overflow-hidden">
                {/* 파동 효과 */}
                <div className="absolute inset-0 bg-indigo-500/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700"></div>
                <div className="absolute inset-0 bg-indigo-500/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-1000 delay-100"></div>

                {/* 아이콘 */}
                <PlayCircleOutlined
                  style={{ color: "#d3d3d3" }}
                  className="text-5xl z-10 group-hover:text-white transition-all duration-300 transform group-hover:scale-110"
                />
              </div>

              {/* 외부 빛나는 효과 */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur opacity-10 group-hover:opacity-30 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
