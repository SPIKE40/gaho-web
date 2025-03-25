"use client";
//import Navigation from "@/components/navigation";
import { Layout, ConfigProvider, Flex } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "antd";
import midmStyle from "../../styles/midm.module.css";
import { formatDateTimeYYMMDDHHMMSS } from "@/components/midm/dateText";
import HistoryDrawer from "@/components/midm/historyDrawer";
import ToggleButtonGroup from "@/components/midm/toggleButton";
import { fetchMidmChat } from "@/services/chatAPI";
import uuid from "react-uuid";
import { MessageType } from "@/types/midmType";
import { TaskType, ChatResponseType } from "@/types/midmType";
import {
  failErrMessage,
  //emptyErrMessage,
  privacyErrMessage,
  USER,
  ASSISTANT,
} from "../contants";
import { RESULTCODE_OK } from "../contants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UploadComponent from "@/components/midm/upload";
import PlaygroundChat from "@/components/midm/playgroundChat";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const { Content, Footer } = Layout;

const queryClient = new QueryClient();

const themeConfig = {
  token: {
    colorBgContainer: "white",
    borderRadiusLG: 10,
  },
};

const Tasks: TaskType[] = [
  {
    key: "email",
    title: "이메일 작성",
    example: "제품보증서가 잘못 전달된 것에 대해 사과하는 메일써줘.",
    disabled: false,
  },
  {
    key: "script",
    title: "대본생성",
    example: "30대 남자와 아이가 놀이동산에 있는 대본 써줘.",
    disabled: false,
  },
  {
    key: "summation",
    title: "요약",
    example: "",
    disabled: true,
  },
  {
    key: "rag",
    title: "RAG",
    example: "",
    disabled: true,
  },
];

const MidmPage = () => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [messageHistories, setMessageHistories] = useState<
    Record<number, MessageType[]>
  >({});
  const [selectedValue, setSelectedValue] = useState<TaskType | null>(null);
  const [isComposing, setIsComposing] = useState<boolean>(false); // 한글 입력 중인지 여부
  const [models, setModels] = useState<string[]>([]);
  const [singleChat, setSingleChat] = useState<boolean | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const existingValue = localStorage.getItem("singlechat");
      if (!existingValue) {
        localStorage.setItem("singlechat", "true");
      }
      setSingleChat(existingValue ? JSON.parse(existingValue) : true);
    }
  }, []);

  useEffect(() => {
    const queryModels = searchParams.getAll("models");
    if (queryModels.length > 0) {
      setModels(queryModels);
      if (queryModels.length === 1) {
        setSingleChat(true);
        localStorage.setItem("singlechat", "true");
      }
    } else {
      setModels(["Midm-base"]);
    }
  }, [searchParams]);

  useEffect(() => {
    if (models.length === 0) return;

    const newQuery = new URLSearchParams();
    models.forEach((model) => newQuery.append("models", model));

    router.replace(`${pathname}?${newQuery.toString()}`);
  }, [models, pathname, router]);

  const updateMessageHistory = (index: number, newMessages: MessageType[]) => {
    setMessageHistories((prev) => ({
      ...prev,
      [index]: newMessages,
    }));
  };

  const addChat = (model: string) => {
    setSingleChat(false);
    localStorage.setItem("singlechat", "false");
    setModels((prevModels) => {
      const updatedModels = [...prevModels, model];
      //updateURL(updatedModels);
      return updatedModels;
    });
  };

  // 특정 index 제거 후, 나머지 index를 재정렬하는 함수
  const removeIndexAndShift = (indexToRemove: number) => {
    setMessageHistories((prev) => {
      const newState: Record<number, MessageType[]> = {};

      Object.entries(prev)
        .map(([key, messages]) => ({ key: Number(key), messages }))
        .filter(({ key }) => key !== indexToRemove) // 삭제할 index 제외
        .forEach(({ key, messages }) => {
          const newKey = key > indexToRemove ? key - 1 : key; // 이후 index를 한 칸씩 당김
          newState[newKey] = messages;
        });

      return newState;
    });
  };

  const removeChat = (index: number) => {
    const newModels = models.filter((_, i) => i !== index); // 선택된 채팅 삭제
    removeIndexAndShift(index);
    const newQuery = new URLSearchParams();
    newModels.forEach((model) => newQuery.append("models", model));

    router.replace(`${pathname}?${newQuery.toString()}`, { scroll: false });
    setModels(newModels);
  };

  // compositionstart 이벤트에서 한글 입력 시작 감지
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  // compositionend 이벤트에서 한글 입력 끝난 것 감지
  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  useEffect(() => {
    const header = document.querySelector(".ant-layout-header");
    const footer = document.querySelector(".ant-layout-footer");
    if (header) {
      const computedHeaderHeight = window.getComputedStyle(header).height;
      document.documentElement.style.setProperty(
        "--header-height",
        computedHeaderHeight
      );
    }
    if (footer) {
      const computedFooterHeight = window.getComputedStyle(footer).height;
      document.documentElement.style.setProperty(
        "--footer-height",
        computedFooterHeight
      );
    }
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "20px";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [inputMessage, textAreaRef]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value); // 텍스트 상태를 업데이트
  };

  const sendMessage = async (index: number) => {
    let chatId = uuid();
    const newMessages = messageHistories[index]
      ? [...messageHistories[index]]
      : [];
    newMessages.push({
      message: {
        role: USER,
        content: inputMessage,
      },
      transactionId: chatId,
      date: formatDateTimeYYMMDDHHMMSS(new Date()),
      resultCode: "xss_script",
      errorContent: "보안정책을 위반한 요청입니다.",
    });

    updateMessageHistory(index, newMessages);

    setInputMessage("");

    const response = await fetchMidmChat(
      selectedValue ? selectedValue.key : "chat",
      chatId,
      newMessages,
      models
    );

    const handleOk = (responseJson: ChatResponseType) => {
      const resMessages = [...newMessages];
      chatId = responseJson.transactionId;

      const newMessage = {
        message: {
          role: ASSISTANT,
          content: responseJson.response,
        },
        transactionId: chatId,
        date: formatDateTimeYYMMDDHHMMSS(new Date()),
        //transactionId: responseJson.transactionId,
        resultCode: RESULTCODE_OK,
        cot: responseJson.cot,
      };
      resMessages.push(newMessage);
      //console.log(resMessages);
      //resultMessages=resMessages
      updateMessageHistory(index, resMessages);
      //setMessageHistories(resMessages);
    };

    const handleError = (responseJson: ChatResponseType, errorText: string) => {
      const errorHandledMessages = newMessages.map((messageHistory) => {
        // console.log(messageHistory.transactionId)
        if (messageHistory.transactionId == responseJson.transactionId) {
          messageHistory.resultCode = responseJson.resultCode;
          messageHistory.errorContent = errorText;
        }
        return messageHistory;
      });
      updateMessageHistory(index, errorHandledMessages);
    };

    const handleResponse = (responseJson: ChatResponseType) => {
      if (responseJson?.response.length) {
        // 개인정보가 검출된 메세지 응답일 경우
        if (
          responseJson?.resultCode &&
          Number(responseJson?.resultCode) === 4222
        ) {
          const lastMessage = [...newMessages].pop();

          if (lastMessage?.message.role === "assistant") newMessages.pop();

          newMessages[newMessages?.length - 1] = {
            ...newMessages[newMessages?.length - 1],
            resultCode: responseJson?.resultCode,
            transactionId: responseJson.transactionId,
          };
          const resMessages = [...newMessages];
          updateMessageHistory(index, resMessages);

          handleError(responseJson, privacyErrMessage);
        } else if (
          responseJson?.resultCode &&
          String(responseJson?.resultCode) !== "0000"
        ) {
          const lastMessage = [...newMessages].pop();

          if (lastMessage?.message.role === "assistant") newMessages.pop();

          newMessages[newMessages?.length - 1] = {
            ...newMessages[newMessages?.length - 1],
            resultCode: responseJson?.resultCode,
            transactionId: responseJson.transactionId,
          };
          const resMessages = [...newMessages];
          updateMessageHistory(index, resMessages);

          handleError(responseJson, failErrMessage);
        } else {
          handleOk(responseJson);
        }
      }
    };

    handleResponse(response?.[index]);
  };

  const handleSend = async () => {
    await Promise.all(models.map((model, index) => sendMessage(index)));
  };

  const handleEnter: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    const keyboardEvent = e.nativeEvent as KeyboardEvent;
    if (keyboardEvent.key === "Enter" && keyboardEvent.shiftKey) {
      // Shift + Enter가 눌리면 줄바꿈을 수행
      return; // 아무 작업도 하지 않고 기본 동작을 허용 (줄바꿈)
    }

    if (keyboardEvent.key === "Enter" && !isComposing) {
      keyboardEvent.preventDefault(); // 기본 엔터키 동작 방지
      if (inputMessage) {
        handleSend();
      }
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={themeConfig}>
        {/* 대화창 */}
        <Content
          style={{
            margin: "24px 16px",
          }}
        >
          <div
            className={midmStyle.playground}
            style={{
              padding: 24,
              minHeight: 360,
              background: themeConfig.token.colorBgContainer,
              borderRadius: themeConfig.token.borderRadiusLG,
              height: "100%",
            }}
          >
            {/* 대화 출력창 */}
            <div className="flex flex-col gap-2 h-3/4 " id="opwindow">
              <div className="flex flex-row gap-2 justify-between">
                <div className="font-sans font-bold text-xl">
                  {selectedValue ? selectedValue.title : "대화"}
                </div>
                <div className="flex flex-row gap-2">
                  {models.length > 3 ? (
                    ""
                  ) : (
                    <Button type="primary" onClick={() => addChat("Midm-base")}>
                      + Compare
                    </Button>
                  )}
                  <HistoryDrawer />
                </div>
              </div>

              <div
                key={searchParams.toString()}
                className="flex flex-row h-full w-full overflow-auto"
              >
                {models.map((model, index) =>
                  index > 0 ? (
                    <PlaygroundChat
                      key={`${model}-${index}`}
                      messageHistories={messageHistories[index]}
                      model={model}
                      style={"border-l"}
                      index={index}
                      singleChat={singleChat}
                      removeChat={removeChat}
                    />
                  ) : (
                    <PlaygroundChat
                      key={`${model}-${index}`}
                      messageHistories={messageHistories[0]}
                      model={model}
                      index={index}
                      singleChat={singleChat}
                      removeChat={removeChat}
                    />
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col justify-center h-1/4">
              {/* task 선택 */}
              <div className="flex items-center my-2 h-1/4 justify-center">
                <Flex gap="small" wrap style={{ justifyContent: "center" }}>
                  <ToggleButtonGroup
                    tasks={Tasks}
                    onChange={setSelectedValue}
                    messageChange={setInputMessage}
                  />
                </Flex>
              </div>
              {/* 메세지 입력 창 */}
              <div className="m-auto w-full md:w-5/6 my-5 h-3/4">
                <div className="flex w-full h-full flex-col-reverse">
                  <div className={midmStyle.customContainer}>
                    <div
                      className="flex flex-col h-full w-full justify-between"
                      onClick={() => textAreaRef.current?.focus()}
                    >
                      <textarea
                        placeholder={
                          selectedValue
                            ? selectedValue.example
                            : "Enter your message.."
                        }
                        className={midmStyle.customTextarea}
                        rows={1}
                        style={{
                          resize: "none",
                          maxHeight: "150px",
                          overflow: "hidden",
                          height: "20px",
                          bottom: "20px",
                        }}
                        value={inputMessage}
                        onChange={handleChange}
                        contentEditable={true}
                        suppressContentEditableWarning
                        ref={textAreaRef}
                        onKeyDown={handleEnter}
                        onCompositionStart={handleCompositionStart} // 한글 입력 시작
                        onCompositionEnd={handleCompositionEnd} // 한글 입력 끝
                      ></textarea>
                      <div className="flex w-full items-center gap-2 py-2 overflow-auto justify-end " />
                      <div className="flex w-full justify-between">
                        <UploadComponent />
                        <Button
                          className="bg-gray-300 py-1 px-2 rounded-md text-sm"
                          onClick={() => handleSend()}
                          disabled={inputMessage ? false : true}
                        >
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Mi:dm can make mistakes. Please verify information.
        </Footer>
        {/* </Layout> */}
        {/* </Layout> */}
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default MidmPage;
