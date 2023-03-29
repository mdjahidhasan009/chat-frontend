import { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { ConversationPanel } from '../../components/conversations/ConversationPanel';
import { ConversationSidebar } from '../../components/sidebars/ConversationSidebar';
import { AppDispatch, RootState } from '../../store';
import {addConversation, fetchConversationsThunk, updateConversation} from '../../store/conversationSlice';
import { Page } from '../../utils/styles';
import {Conversation, MessageEventPayload} from '../../utils/types';
import {addMessage, deleteMessage} from "../../store/messages/messageSlice";
import {SocketContext} from "../../utils/context/SocketContext";
import { fetchGroupsThunk } from '../../store/groupsSlice';
import {updateType} from "../../store/selectedSlice";

export const ConversationPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const socket = useContext(SocketContext);

  useEffect(() => {
    dispatch(updateType('private'));
    dispatch(fetchConversationsThunk());
  }, []);

  useEffect(() => {
    socket.on('onMessage', (payload: MessageEventPayload) => {
      const { conversation, message } = payload;
      dispatch(addMessage(payload));
      dispatch(updateConversation(conversation));
      socket.on('onConversation', (payload: Conversation) => {
        dispatch(addConversation(payload));
      });
      socket.on('onMessageDelete', (payload) => {
        dispatch(deleteMessage(payload));
      })
    });
    return () => {
      socket.off('connected');
      socket.off('onMessage');
      socket.off('onConversation');
      socket.off('onMessageDelete');
    };
  }, [id]);

  return (
    <>
      <ConversationSidebar />
      {!id && <ConversationPanel />}
      <Outlet />
    </>
  );
};