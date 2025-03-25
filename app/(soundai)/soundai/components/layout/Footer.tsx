import { Layout, Typography } from "antd";

const { Link, Text } = Typography;

// 앱의 푸터 컴포넌트
export default function SoundAIFooter() {
  return (
    <Layout.Footer
      className="flex justify-between items-center p-4"
      style={{
        background: "#000000",
      }}
    >
      <Text className="text-sm" style={{ color: "#ffffff" }}>
        © Copyright 2024, HierTTS(Text To Speech) KT. Version 1.0.0
      </Text>
      <div className="flex items-center space-x-4">
        <Link href="#" style={{ color: "#ffffff" }}>
          Guide
        </Link>
        <Link href="#" style={{ color: "#ffffff" }}>
          Privacy Policy
        </Link>
        <Text className="cursor-default" style={{ color: "#ffffff" }}>
          Contact
        </Text>
      </div>
    </Layout.Footer>
  );
}
