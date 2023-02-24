import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { ConversationPanel } from '../components/conversations/ConversationPanel';
import { ConversationSidebar } from '../components/conversations/ConversationSidebar';
import { getAuthUser, getConversations } from '../utils/api';
import { Page } from '../utils/styles';
import { ConversationType } from '../utils/types';
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { fetchConversationsThunk } from '../store/conversationSlice';

export const ConversationPage = () => {
    const { id } = useParams();
    const [conversations, setConversations] = useState<ConversationType[]>([]);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
      dispatch(fetchConversationsThunk());
    }, []);

    return (
      <Page>
          <ConversationSidebar conversations={conversations} />
          {!id && <ConversationPanel />}
          <Outlet />
      </Page>
    );
};