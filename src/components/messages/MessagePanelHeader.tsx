import {useParams} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState} from "../../store";
import {selectType} from "../../store/selectedSlice";
import { MessagePanelConversationHeader } from './headers/MessagePanelConversationHeader';
import { MessagePanelGroupHeader } from './headers/MessagePanelGroupHeader';
import { ConversationVideoCall } from '../conversations/ConversationVideoCall';
import { ConversationAudioCall } from '../conversations/ConversationAudioCall';
// import {useVideoCallAccept} from "../../utils/hooks/sockets/useVideoCallAccept";

export const MessagePanelHeader = () => {
  const { id: routeId } = useParams();
  const { isCalling, isCallInProgress, activeConversationId, callType } =
    useSelector((state: RootState) => state.call);

  // useVideoCallAccept();

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