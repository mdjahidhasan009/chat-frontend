import { useContext } from "react"
import { AuthContext } from "../../../utils/context/AuthContext"
import { useParams } from "react-router-dom";
import { SocketContext } from "../../../utils/context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { selectConversationById } from "../../../store/conversationSlice";
import { getRecipientFromConversation } from "../../../utils/helpers";
import { CallInitiatePayload, CallType } from "../../../utils/types";
import { initiateCallState } from "../../../store/call/callSlice";
import { SenderEvents } from "../../../utils/constants";
import { MessagePanelHeaderIcons, MessagePanelHeaderStyle } from "../../../utils/styles";
import { FaPhoneAlt, FaVideo } from "react-icons/fa";

export const MessagePanelConversationHeader = () => {
  const user = useContext(AuthContext).user!;
  const { id } = useParams();
  const socket = useContext(SocketContext);

  const dispatch = useDispatch<AppDispatch>();
  const conversation = useSelector((state: RootState) => selectConversationById(state, parseInt(id!)));

  const recipient = getRecipientFromConversation(conversation, user);
  const buildCallPayloadParams = (
    stream: MediaStream,
    type: CallType
  ): CallInitiatePayload | undefined => 
    conversation && {
      localStream: stream,
      caller: user,
      receiver: recipient!,
      isCalling: true,
      activeConversationId: conversation.id,
      callType: type
    };

  const videoCallUser = async() => {
    if (!recipient) return;
    socket.emit('onVideoCallInitiate', {
      conversationId: conversation!.id,
      recipient: recipient.id,
    });
    const constraints = { video: true, audio: true };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const payload = buildCallPayloadParams(stream, 'video');
    if(!payload) throw new Error('Video call payload is undefined');
    dispatch(initiateCallState(payload));
  }

  const voiceCallUser = async() => {
    if (!recipient) return;
    socket.emit(SenderEvents.VOICE_CALL_INITIATE, {
      conversationId: conversation!.id,
      recipient: recipient.id,
    });
    const constraints = { video: false, audio: true };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const payload = buildCallPayloadParams(stream, 'audio');
    if(!payload) throw new Error('Voice call payload is undefined');
    dispatch(initiateCallState(payload));
  }

  return (
    <MessagePanelHeaderStyle>
      <div>
        <span>{recipient?.username || 'User'}</span>
      </div>
      <MessagePanelHeaderIcons>
        <FaPhoneAlt size={24} cursor='pointer' onClick={voiceCallUser} />
        <FaVideo size={30} cursor='pointer' onClick={videoCallUser} />
      </MessagePanelHeaderIcons>
    </MessagePanelHeaderStyle>
  )
}