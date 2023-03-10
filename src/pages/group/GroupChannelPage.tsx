import {useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {SocketContext} from "../../utils/context/SocketContext";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {fetchMessagesThunk} from "../../store/messageSlice";
import {ConversationChannelPageStyle} from "../../utils/styles";
import {MessagePanel} from "../../components/messages/MessagePanel";
import {fetchGroupMessagesThunk} from "../../store/groupMessageSlice";

export const GroupChannelPage = () => {
  const { id } = useParams<{ id: string }>();
  const socket = useContext(SocketContext);
  const dispatch = useDispatch<AppDispatch>();
  const [time, setTimer] = useState<ReturnType<typeof setTimeout>>();
  const [isTyping, setIsTyping] = useState(false);
  const [isRecipientsTyping, setIsRecipientsTyping] = useState(false);

  useEffect(() => {
    const groupId = parseInt(id!);
    dispatch(fetchGroupMessagesThunk(groupId));
  }, [id]);

  useEffect(() => {
    const groupId = parseInt(id!);
    socket.emit('onGroupJoin', { groupId });

    return () => {
      socket.emit('onGroupLeave', { groupId });
    }
  }, [id]);

  const sendTypingStatus = () => {};

  return (
    <ConversationChannelPageStyle>
      <MessagePanel
        sendTypingStatus={sendTypingStatus}
        isRecipientTyping={isRecipientsTyping}
      />
    </ConversationChannelPageStyle>
  );
};