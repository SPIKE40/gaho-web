import React from "react";
import { Select, Space } from "antd";
import { fetchModelList } from "@/services/chatAPI";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

type Props = {
  model: string;
  index: number;
};

const SelectModel: React.FC<Props> = ({ model, index }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const models = searchParams.getAll("models");

  const updateModelInURL = (index: number, newModel: string) => {
    const newModels = [...models]; // 기존 모델 리스트 복사
    newModels[index] = newModel; // 해당 인덱스의 모델 변경

    const newQuery = new URLSearchParams();
    newModels.forEach((model) => newQuery.append("models", model));

    router.replace(`${pathname}?${newQuery.toString()}`, { scroll: false });
  };
  const { data } = useQuery({
    queryKey: ["modelList"], // 쿼리 키
    queryFn: fetchModelList, // 쿼리 함수
  });
  return (
    <Space wrap>
      <Select
        defaultValue={model}
        style={{ width: 120, paddingLeft: "2px" }}
        onChange={(e) => updateModelInURL(index, e)}
        options={data?.map((model) => ({
          value: model.name, // 선택된 값으로 사용할 값
          label: model.name, // 화면에 표시될 라벨
        }))}
      />
    </Space>
  );
};

export default SelectModel;
