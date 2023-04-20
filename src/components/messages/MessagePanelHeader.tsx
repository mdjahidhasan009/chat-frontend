import {GroupHeaderIcons, MessagePanelHeaderStyle} from '../../utils/styles';
import {useContext, useState} from "react";
import {AuthContext} from "../../utils/context/AuthContext";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {selectConversationById} from "../../store/conversationSlice";
import {AppDispatch, RootState} from "../../store";
import {selectType} from "../../store/selectedSlice";
import {selectGroupById} from "../../store/groupsSlice";
import {PeopleGroup, PersonAdd} from 'akar-icons';
import {AddGroupRecipientModal} from "../modals/AddGroupRecipientModal";
import {toggleSidebar} from "../../store/groupRecipientsSidebarSlice";
import { SocketContext } from '../../utils/context/SocketContext';
import { getRecipientFromConversation } from '../../utils/helpers';
import { initiateCallState, setActiveConversationId, setCaller, setIsCalling, setLocalStream, setReceiver } from '../../store/call/callSlice';
import { FaPhoneAlt, FaVideo } from 'react-icons/fa';
import { SenderEvents } from '../../utils/constants';
import { CallInitiatePayload } from '../../utils/types';
import { MessagePanelConversationHeader } from './headers/MessagePanelConversationHeader';
import { MessagePanelGroupHeader } from './headers/MessagePanelGroupHeader';
import { ConversationVideoCall } from '../conversations/ConversationVideoCall';
import { ConversationAudioCall } from '../conversations/ConversationAudioCall';

export const MessagePanelHeader = () => {
  const { id: routeId } = useParams();
  const { isCalling, isCallInProgress, activeConversationId, callType } =
    useSelector((state: RootState) => state.call);

  const type = useSelector(selectType);
  const showCallPanel = isCalling || isCallInProgress;
  const isRouteActive = activeConversationId === parseInt(routeId!);
  if (!showCallPanel)
    return type === 'private' ? (
      <MessagePanelConversationHeader />
    ) : (
      <MessagePanelGroupHeader />
    );

  return isRouteActive && callType === 'video' ? (
    <ConversationVideoCall />
  ) : (
    <ConversationAudioCall />
  );
}