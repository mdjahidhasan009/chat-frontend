import styles from './index.module.scss';
import { Conversation } from "../../utils/types";
import {AuthContext} from "../../utils/context/AuthContext";
import React, {useContext} from "react";
import {useNavigate} from "react-router-dom";
import {getRecipientFromConversation} from "../../utils/helpers";
import {ConversationSidebarItemStyle} from "../../utils/styles";

type Props = {
  conversation: Conversation;
};

export const ConversationSidebarItem: React.FC<Props> = ({ conversation }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const recipient = getRecipientFromConversation(conversation, user);
  return (
    <ConversationSidebarItemStyle
      onClick={() => navigate(`/conversations/${conversation.id}`)}
    >
      <div className={styles.conversationAvatar}></div>
      <div>
        <span className={styles.conversationName}>
          {`${recipient?.firstName} ${recipient?.lastName}`}
        </span>
        <span className={styles.conversationLastMessage}>
          {conversation.lastMessageSent?.content}
        </span>
      </div>
    </ConversationSidebarItemStyle>
  )
}