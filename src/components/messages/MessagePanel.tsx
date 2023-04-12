import React, { FC, useContext, useEffect, useState } from 'react';
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
import { useToast } from '../../utils/hooks/useToast';
import { AxiosError } from 'axios';
import { MessageAttachmentContainer } from './attachments/MessageAttachmentContainer';
import { removeAllAttachments } from '../../store/message-panel/messagePanelSlice';
import { addSystemMessage, clearAllMessages } from '../../store/system-messages/systemMessagesSlice';

type Props = {
  sendTypingStatus: () => void;
  isRecipientTyping: boolean;
};
export const MessagePanel: FC<Props> = ({ sendTypingStatus, isRecipientTyping }) => {
  const toastId = 'rateLimitToast';
  const { messageCounter } = useSelector((state: RootState) => state.systemMessages);
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
  useEffect(() => {
    return () => {
      dispatch(clearAllMessages());
    };
  }, []);

  const sendMessage = async () => {
    const trimmedContent = content.trim();
    if (!routeId) return;
    if (!trimmedContent && !attachments.length) return;
    if (!routeId || !trimmedContent) return;
    const id = parseInt(routeId);
    const params = { id, content: trimmedContent };
    const formData = new FormData();

    formData.append('id', routeId);
    trimmedContent && formData.append('content', trimmedContent);
    attachments.forEach((attachment) =>
      formData.append('attachments', attachment.file)
    );

    try {
      await createMessage(routeId, selectedType, formData);
      setContent('');
      dispatch(removeAllAttachments());
      dispatch(clearAllMessages());
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 429) {
        error('You are rate limited', { toastId });
        dispatch(
          addSystemMessage({
            id: messageCounter,
            level: 'error',
            content: 'You are being rate limited. Slow down.',
          })
        );
      } else if (axiosError.response?.status === 404) {
        dispatch(
          addSystemMessage({
            id: messageCounter,
            level: 'error',
            content: 'The recipient is not in your friends list or they may have blocked you.',
          })
        );
      }
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