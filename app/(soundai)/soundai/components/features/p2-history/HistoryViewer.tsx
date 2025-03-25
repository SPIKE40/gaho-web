"use client";

import { Empty } from "antd";
import HistoryCard from "../../ui/HistoryCard";
import { useHistoryStore, HistoryItem } from "../../stores/historyStore";

export default function HistoryViewer() {
  const { history, removeHistoryItem } = useHistoryStore();

  const handlePlay = (item: HistoryItem) => {
    window.dispatchEvent(
      new CustomEvent("showAudioPlayer", {
        detail: {
          audioUrl: item.audioUrl,
          voiceName: item.voiceName,
          text: item.text,
          speed: item.speed,
          avatarUrl: item.avatarUrl,
        },
      })
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm("이 음성 파일을 삭제하시겠습니까?")) {
      removeHistoryItem(id);
    }
  };

  return (
    <div className="h-[calc(100vh-280px)] overflow-auto [&::-webkit-scrollbar]:hidden">
      <div className="rounded-lg shadow-lg bg-[#262626] h-full p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">히스토리</h1>
          <p className="text-gray-400">
            생성된 음성 파일들의 기록을 확인하고 관리할 수 있습니다.
          </p>
        </div>

        <div className="space-y-4">
          {history.length > 0 ? (
            history.map((item) => (
              <div key={item.id} className="mx-auto w-[60%]">
                <HistoryCard
                  key={item.id}
                  item={item}
                  onPlay={handlePlay}
                  onDelete={handleDelete}
                />
              </div>
            ))
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-gray-400">
                  아직 생성된 음성 파일이 없습니다.
                </span>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
