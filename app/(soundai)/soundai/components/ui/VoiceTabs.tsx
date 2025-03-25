"use client";

import { ConfigProvider, Tabs, theme } from "antd";
import { SoundOutlined, UserOutlined, StarOutlined } from "@ant-design/icons";
import { ReactNode } from "react";
import Image from "next/image";
import { darkThemeConfig } from "@/app/(soundai)/soundai/components/styles/theme";

// 경로 설정
const PATHS = {
  ktLogo: "/KT_Logo.svg",
} as const;

interface VoiceTabsProps {
  ktTabContent: ReactNode;
  systemTabContent?: ReactNode;
  myTabContent?: ReactNode;
  favoritesTabContent?: ReactNode;
  defaultActiveKey?: string;
  className?: string;
  onTabChange?: (key: string) => void;
}

export default function VoiceTabs({
  ktTabContent,
  systemTabContent,
  myTabContent,
  favoritesTabContent,
  defaultActiveKey = "kt",
  className = "",
  onTabChange,
}: VoiceTabsProps) {
  // 기본 시스템/내 음성/즐겨찾기 탭 내용
  const defaultSystemContent = (
    <div className="h-[500px] flex items-center justify-center text-gray-400">
      System voices coming soon...
    </div>
  );

  const defaultMyContent = (
    <div className="h-[500px] flex items-center justify-center text-gray-400">
      My voices coming soon...
    </div>
  );

  const defaultFavoritesContent = (
    <div className="h-[500px] flex items-center justify-center text-gray-400">
      Favorite voices coming soon...
    </div>
  );

  const tabItems = [
    {
      key: "kt",
      label: (
        <span className="flex items-center gap-2 text-gray-300">
          <div className="relative w-4 h-4">
            <Image
              src={PATHS.ktLogo}
              alt="KT"
              fill
              sizes="16px"
              className="object-contain"
            />
          </div>
          KT Voices
        </span>
      ),
      children: ktTabContent,
    },
    {
      key: "system",
      label: (
        <span className="flex items-center gap-2 text-gray-300">
          <SoundOutlined />
          System Voices
        </span>
      ),
      children: systemTabContent || defaultSystemContent,
    },
    {
      key: "my",
      label: (
        <span className="flex items-center gap-2 text-gray-300">
          <UserOutlined />
          My Voices
        </span>
      ),
      children: myTabContent || defaultMyContent,
    },
    {
      key: "favorites",
      label: (
        <span className="flex items-center gap-2 text-gray-300">
          <StarOutlined />
          Favorite Voices
        </span>
      ),
      children: favoritesTabContent || defaultFavoritesContent,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        ...darkThemeConfig,
      }}
    >
      <Tabs
        defaultActiveKey={defaultActiveKey}
        items={tabItems}
        className={`voice-tabs ${className}`}
        onChange={onTabChange}
      />
    </ConfigProvider>
  );
}
