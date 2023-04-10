import styles from './index.module.scss';
import { Conversation } from "../../utils/types";
import {AuthContext} from "../../utils/context/AuthContext";
import React, {useContext} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {getRecipientFromConversation} from "../../utils/helpers";
import {ConversationSidebarItemStyle} from "../../utils/styles";
import { CDN_URL } from '../../utils/constants';
import defaultAvatar from '../../ __assets__/default_avatar.jpg'

type Props = {
  conversation: Conversation;
};

export const ConversationSidebarItem: React.FC<Props> = ({ conversation }) => {
  const MESSAGE_LENGTH_MAX = 50;
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const recipient = getRecipientFromConversation(conversation, user);
  
  const lastMessaegeContent = () => {
    const { lastMessageSent } = conversation;
    if (lastMessageSent && lastMessageSent.content)
      return lastMessageSent.content?.length >= MESSAGE_LENGTH_MAX
        ? lastMessageSent.content?.slice(0, MESSAGE_LENGTH_MAX).concat('...')
        : lastMessageSent.content;
    
    return null;
  }

  const hasProfilePicture = () => recipient?.profile?.avatar;

  return (
    <>
      <ConversationSidebarItemStyle
        onClick={() => navigate(`/conversations/${conversation.id}`)}
        selected={parseInt(id!) === conversation.id}
      >
      <img
          src={
            hasProfilePicture()
              ? CDN_URL.BASE.concat(recipient?.profile?.avatar!)
              : defaultAvatar
          }
          alt="avatar"
          className={styles.conversationAvatar}
        />
        <div className={styles.contentContainer}>
          <span className={styles.conversationName}>
            {`${recipient?.firstName} ${recipient?.lastName}`}
          </span>
          <span className={styles.conversationLastMessage}>
            {conversation.lastMessageSent?.content}
          </span>
        </div>
      </ConversationSidebarItemStyle>
      
    </>
  )
}