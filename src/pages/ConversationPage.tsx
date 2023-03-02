import { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { ConversationPanel } from '../components/conversations/ConversationPanel';
import { ConversationSidebar } from '../components/conversations/ConversationSidebar';
import { AppDispatch, RootState } from '../store';
import {fetchConversationsThunk, updateConversation} from '../store/conversationSlice';
import { Page } from '../utils/styles';
import {ConversationType, MessageEventPayload} from '../utils/types';
import {addMessage} from "../store/messageSlice";
import {SocketContext} from "../utils/context/SocketContext";

export const ConversationPage = () => {
  const { id } = useParams();
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const socket = useContext(SocketContext);

  const conversationsState = useSelector(
    (state: RootState) => state.conversation.conversations
  );

  useEffect(() => {
    console.log('Fetching Conversations in ConversationPage');
    console.log(conversationsState.find((c) => c.id === 15));
    dispatch(fetchConversationsThunk());
  }, []);

  useEffect(() => {
    socket.emit('onClientConnect', {
      conversationId: parseInt(id!),
    });
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
  }, [id]);

  return (
    <Page>
      <ConversationSidebar conversations={conversations} />
      {!id && <ConversationPanel />}
      <Outlet />
    </Page>
  );
};