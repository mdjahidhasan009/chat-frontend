import {MessageInput, MessagePanelBody, MessagePanelStyle} from "../../utils/styles";
import { MessageContainer } from "./MessageContainer";
import { MessageType } from "../../utils/types";
import React, {FC, useState} from "react";
import MessagePanelHeader from "./MessagePanelHeader";
import {MessageInputField} from "./MessageInputField";
import {useParams} from "react-router-dom";
import {postNewMessage} from "../../utils/api";

type Props = {
  messages: MessageType[];
}

export const MessagePanel: FC<Props> = ({ messages }) => {

  const [ content, setContent ] = useState('');
  const { id } = useParams();
  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(id);
    console.log('Sending Message', content);
    if(!id || !content) return;
    const conversationId = parseInt(id);

    try {
      await postNewMessage({ conversationId, content });
      setContent('');
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <>
      <MessagePanelHeader />
      <MessagePanelStyle>
      <MessagePanelBody>
        <MessageContainer messages={messages} />
        <MessageInputField
          content={content}
          setContent={setContent}
          sendMessage={sendMessage}
        />
      </MessagePanelBody>
    </MessagePanelStyle>
    </>
  )
}