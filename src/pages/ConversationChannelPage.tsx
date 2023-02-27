import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MessagePanel } from '../components/messages/MessagePanel';
import { getConversationMessages } from '../utils/api';
import { AuthContext } from '../utils/context/AuthContext';
import { SocketContext } from '../utils/context/SocketContext';
import { ConversationChannelPageStyle } from '../utils/styles';
import { MessageEventPayload, MessageType } from '../utils/types';
import { AppDispatch, RootState } from '../store';
import { addMessage, fetchMessagesThunk } from '../store/messageSlice';
import { updateConversation } from '../store/conversationSlice';

export const ConversationChannelPage = () => {
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const { id } = useParams();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const conversationId = parseInt(id!);
    dispatch(fetchMessagesThunk(conversationId));
  }, [id]);

  useEffect(() => {
    socket.on('connected', () => console.log('Connected'));
    socket.on('onMessage', (payload: MessageEventPayload) => {
      console.log('Message Received');
      const { conversation, message } = payload;
      dispatch(addMessage(payload));
      dispatch(updateConversation(conversation));
    });
    return () => {
      socket.off('connected');
      socket.off('onMessage');
    };
  }, []);

  return (
    <ConversationChannelPageStyle>
      <MessagePanel></MessagePanel>
    </ConversationChannelPageStyle>
  );
};