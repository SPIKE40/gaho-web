// Header.tsx
"use client";
import { Layout } from "antd";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function SoundAIHeader() {
  // 탭 정보: id, 표시할 label, 이동할 경로(path)
  const tabs = [
    { id: "vocalize", label: "Vocalize", path: "/soundai/p1-vocalize" },
    { id: "history", label: "History", path: "/soundai/p2-history" },
    {
      id: "voicelibrary",
      label: "Voice Library",
      path: "/soundai/p3-voicelibrary",
    },
  ];

  const pathname = usePathname();

  return (
    <Layout.Header
      className="flex items-center"
      style={{
        background: "#000000",
        paddingTop: "40px",
        paddingBottom: "40px",
      }}
    >
      <div className="relative h-8 w-8 mr-1">
        <Image
          src="/speechicon.png"
          alt="Speech Icon"
          fill
          sizes="32px"
          className="object-contain"
        />
      </div>
      <h1 className="text-lg font-semibold w-40 text-white">
        Text To Speech KT
      </h1>
      <div className="flex-1 flex justify-left pl-10">
        <div className="rounded-full bg-[#262626] px-8 py-2 flex space-x-4 ">
          {tabs.map((tab) => {
            // 현재 URL에 tab.id 가 포함되어 있으면 active로 판단
            const active = pathname?.toLowerCase().includes(tab.id);

            return (
              <Link
                key={tab.id}
                href={tab.path}
                className={`w-30 items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  active
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </Layout.Header>
  );
}
