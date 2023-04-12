import {useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {SocketContext} from "../../utils/context/SocketContext";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store";
import {ConversationChannelPageStyle} from "../../utils/styles";
import {MessagePanel} from "../../components/messages/MessagePanel";
import {editGroupMessage, fetchGroupMessagesThunk} from "../../store/groupMessageSlice";
import {GroupMessageType} from "../../utils/types";
import {GroupRecipientsSidebar} from "../../components/sidebars/group-recipients/GroupRecipientsSidebar";

export const GroupChannelPage = () => {
  const { id } = useParams<{ id: string }>();
  const socket = useContext(SocketContext);
  const dispatch = useDispatch<AppDispatch>();
  const [isRecipientsTyping, setIsRecipientsTyping] = useState(false);

  const showSidebar = useSelector(
    (state: RootState) => state.groupSidebar.showSidebar
  );

  useEffect(() => {
    const groupId = parseInt(id!);
    dispatch(fetchGroupMessagesThunk(groupId));
  }, [id]);

  useEffect(() => {
    const groupId = parseInt(id!);
    socket.emit('onGroupJoin', { groupId });
    socket.on('onGroupMessageUpdate', (message: GroupMessageType) => {
      dispatch(editGroupMessage(message));
    })

    return () => {
      socket.emit('onGroupLeave', { groupId });
      socket.off('onGroupMessageUpdate');
    }
  }, [id]);

  const sendTypingStatus = () => {};

  return (
    <>
      <ConversationChannelPageStyle>
        <MessagePanel
          sendTypingStatus={sendTypingStatus}
          isRecipientTyping={isRecipientsTyping}
        />
      </ConversationChannelPageStyle>
      {showSidebar && <GroupRecipientsSidebar />}
    </>

  );
};