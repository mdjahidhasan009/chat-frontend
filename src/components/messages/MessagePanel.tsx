import {MessageInput, MessagePanelBody, MessagePanelStyle} from "../../utils/styles";
import { MessageContainer } from "./MessageContainer";
import { MessageType } from "../../utils/types";
import {FC} from "react";
import MessagePanelHeader from "./MessagePanelHeader";
import {MessageInputField} from "./MessageInputField";

type Props = {
  messages: MessageType[];
}

export const MessagePanel: FC<Props> = ({ messages }) => {
  return (
    <>
      <MessagePanelHeader />
      <MessagePanelStyle>
      <MessagePanelBody>
        <MessageContainer messages={messages} />
        <MessageInputField />
      </MessagePanelBody>
    </MessagePanelStyle>
    </>
  )
}