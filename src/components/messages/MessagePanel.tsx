import React, { FC, useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store';
import { selectConversationById } from '../../store/conversationSlice';
import {postGroupMessage, createMessage} from '../../utils/api';
import { AuthContext } from '../../utils/context/AuthContext';
import { getRecipientFromConversation } from '../../utils/helpers';
import {
  MessagePanelBody, MessagePanelFooter,
  MessagePanelStyle,
  MessageTypingStatus,
} from '../../utils/styles';
import { MessageContainer } from './MessageContainer';
import { MessageInputField } from './MessageInputField';
import { MessagePanelHeader } from './MessagePanelHeader';
import {selectGroupById} from "../../store/groupsSlice";
import { createMessageThunk } from '../../store/messages/messageThunk';
import { useToast } from '../../utils/hooks/useToast';
import { AxiosError } from 'axios';
import { MessageAttachmentContainer } from './attachments/MessageAttachmentContainer';

type Props = {
  sendTypingStatus: () => void;
  isRecipientTyping: boolean;
};
export const MessagePanel: FC<Props> = ({
  sendTypingStatus,
  isRecipientTyping,
}) => {
  const toastId = 'rateLimitToast';
  const [content, setContent] = useState('');
  const { id: routeId } = useParams();
  const { user } = useContext(AuthContext);
  const { error } = useToast({ theme: 'dark' });
  const { attachments } = useSelector((state: RootState) => state.messagePanel);
  const dispatch = useDispatch<AppDispatch>();

  const conversation = useSelector((state: RootState) =>
    selectConversationById(state, parseInt(routeId!))
  );

  const group = useSelector((state: RootState) =>
    selectGroupById(state, parseInt(routeId!))
  );

  const selectedType = useSelector(
    (state: RootState) => state.selectedConversationType.type
  );

  const recipient = getRecipientFromConversation(conversation, user);

  const sendMessage = async () => {
    const trimmedContent = content.trim();
    if (!routeId || !trimmedContent) return;
    const id = parseInt(routeId);
    const params = { id, content: trimmedContent };

    try {
      selectedType === 'private'
        ? await createMessage(params)
        : await postGroupMessage(params); // selectedType = group
      setContent('');
    } catch (err) {
      (err as AxiosError).response?.status === 429 && error('Rate limit exceeded', { toastId }); // toastId is used to prevent multiple toasts from being created
    }
  };

  return (
    <>
      <MessagePanelStyle>
        <MessagePanelHeader />
        <MessagePanelBody>
          <MessageContainer />
        </MessagePanelBody>
        <MessagePanelFooter>
          {attachments.length > 0 && <MessageAttachmentContainer />}
          <MessageInputField
            content={content}
            setContent={setContent}
            sendMessage={sendMessage}
            sendTypingStatus={sendTypingStatus}
            placeholderName={
              selectedType === 'group'
                ? group?.title || 'Group'
                : recipient?.firstName || 'user'
            }
          />
          <MessageTypingStatus>
            {isRecipientTyping ? `${recipient?.firstName} is typing...` : ''}
          </MessageTypingStatus>
        </MessagePanelFooter>
      </MessagePanelStyle>
    </>
  );
};