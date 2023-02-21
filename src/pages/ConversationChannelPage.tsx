import { ConversationChannelPageStyle } from "../utils/styles";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../utils/context/AuthContext";
import { SocketContext } from "../utils/context/SocketContext";
import { useParams } from "react-router-dom";
import { getConversationMessages } from "../utils/api";
import { MessageEventPayload, MessageType } from "../utils/types";
import { MessagePanel } from "../components/messages/MessagePanel";

export const ConversationChannelPage = () => {
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [ messages, setMessages ] = useState<MessageType[]>([]);
    const { id } = useParams();

    useEffect(() => {
        const conversationId = id!;
        getConversationMessages(parseInt(conversationId))
          .then(({ data }) => {
              console.log(data);
              setMessages(data);
          })
          .catch((err) => console.log(err));
    }, [ id ]);

    useEffect(() => {
      socket.on('connected', () => console.log('socket connected'));
      socket.on('onMessage', (payload: MessageEventPayload) => {
        console.log('Message Received');
        const { conversation, ...message } = payload;
        setMessages((prev) => [message, ...prev]);
      });
      return () => {
        socket.off('connected');
        socket.off('onMessage');
      }
    }, []);

    return (
      <ConversationChannelPageStyle>
          <MessagePanel messages={messages} />
      </ConversationChannelPageStyle>
    );
};
