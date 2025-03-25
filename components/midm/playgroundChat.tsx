import { HiChatBubbleLeftEllipsis } from "react-icons/hi2";
import { IoEllipse } from "react-icons/io5";
import { formatDateMMDDHH } from "./dateText";
import { MessageText } from "./messageText";
import { Button, Collapse } from "antd";
import EmailProcessSteps from "./cotStep";
import cn from "@/utils/cn";
import { MessageType } from "@/types/midmType";
import { useState } from "react";
import { USER, ASSISTANT } from "@/app/contants";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import midmStyle from "../../styles/midm.module.css";
import SelectModel from "./selectModel";
import { AiOutlineClose } from "react-icons/ai";

type Props = {
  messageHistories: MessageType[];
  model: string;
  style?: string;
  index: number;
  singleChat: boolean | null;
  removeChat: (index: number) => void;
};

const PlaygroundChat: React.FC<Props> = ({
  messageHistories,
  model,
  style,
  index,
  singleChat,
  removeChat,
}) => {
  const [processCompleted, setProcessCompleted] = useState(false);
  return (
    <div
      className={cn("h-full w-full flex flex-col gap-1", style ? style : "")}
    >
      <div className="border w-full" />
      <div className="flex flex-row justify-between ">
        <SelectModel model={model} index={index} />
        {singleChat ? (
          <></>
        ) : (
          <Button
            shape="circle"
            type="text"
            icon={<AiOutlineClose />}
            onClick={() => removeChat(index)}
          />
        )}
      </div>
      <div className="flex h-full overflow-auto gap-4 justify-center">
        <div className="flex flex-col w-full md:w-5/6 gap-4">
          {!messageHistories && (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <div className="relative flex h-[56px] w-[56px] scale-125 items-center justify-center">
                <IoEllipse
                  className="absolute left-0 top-[10px] h-[56px] w-[56px]"
                  style={{ color: "#F6F7FB" }}
                />
                <HiChatBubbleLeftEllipsis className="absolute left-[16px] top-[26px] h-[24px] w-[24px]" />
              </div>
              <div className="h-6" />
              <div className="text-sm leading-7 select-none text-[#313B49] hidden-chat-icon">
                {"Chat Playground"}
              </div>
            </div>
          )}
          {messageHistories &&
            messageHistories.map((messageHistory, index) => (
              <div key={index}>
                <div className="flex flex-row">
                  {messageHistory.message.role === USER && (
                    <div className="mx-2 mt-auto ml-auto text-xs text-gray-400 min-w-max">
                      {formatDateMMDDHH(new Date(messageHistory.date))}
                    </div>
                  )}
                  <MessageText
                    className={cn(
                      "border rounded-2xl w-fit py-2 px-7 max-w-[80%]",
                      messageHistory.message.role === ASSISTANT
                        ? midmStyle.assistanttext
                        : "",
                      messageHistory.message.role === USER
                        ? midmStyle.usertext
                        : ""
                    )}
                  >
                    <div className="flex flex-row items-center">
                      <div className="flex-grow" />
                    </div>
                    {messageHistory.cot ? (
                      processCompleted ? (
                        <div className="flex flex-col">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {messageHistory.message.content as string}
                          </ReactMarkdown>
                          <Collapse
                            style={{ marginTop: "10px" }}
                            size="small"
                            items={[
                              {
                                key: "1",
                                label: "사고 과정 보기",
                                children: messageHistory.cot.map((item, i) => (
                                  <li key={i.toString()}>
                                    <strong>
                                      {item.index}. {item.title}
                                    </strong>
                                    <p>{item.description}</p>
                                  </li>
                                )),
                              },
                            ]}
                          ></Collapse>
                        </div>
                      ) : (
                        <EmailProcessSteps
                          stepsData={messageHistory.cot}
                          setProcessCompleted={setProcessCompleted}
                        />
                      )
                    ) : (
                      <div>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {messageHistory.message.content as string}
                        </ReactMarkdown>
                      </div>
                    )}
                  </MessageText>
                  {messageHistory.message.role === "assistant" && (
                    <div className="mx-2 mt-auto mr-0 text-xs text-gray-400 min-w-max">
                      {formatDateMMDDHH(new Date(messageHistory.date))}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="border w-full" />
    </div>
  );
};

export default PlaygroundChat;
