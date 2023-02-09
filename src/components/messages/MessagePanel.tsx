import {MessageInput, MessagePanelBody, MessagePanelStyle} from "../../utils/styles";
import { MessageContainer } from "./MessageContainer";
import { MessageType } from "../../utils/types";
import {FC} from "react";
import MessagePanelHeader from "./MessagePanelHeader";

type Props = {
  messages: MessageType[];
}

export const MessagePanel: FC<Props> = ({ messages }) => {
  return (
    <MessagePanelStyle>
      <MessagePanelHeader />
      <MessagePanelBody>
        <MessageContainer messages={messages} />
        <MessageInput />
      </MessagePanelBody>
    </MessagePanelStyle>
  )
}