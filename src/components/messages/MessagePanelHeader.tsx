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
import { setActiveConversationId, setCaller, setIsCalling, setLocalStream, setReceiver } from '../../store/call/callSlice';
import { FaVideo } from 'react-icons/fa';

export const MessagePanelHeader = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const type = useSelector(selectType);
  const conversation = useSelector((state: RootState) =>
    selectConversationById(state, parseInt(id!))
  );
  const group = useSelector((state: RootState) =>
    selectGroupById(state, parseInt(id!))
  );

  const socket = useContext(SocketContext);
  const { peer, connection, call } = useSelector(
    (state: RootState) => state.call
  );

  const recipient = getRecipientFromConversation(conversation, user);
  const displayName =
    user?.id === conversation?.creator.id
      ? `${conversation?.recipient.firstName} ${conversation?.recipient.lastName}`
      : `${conversation?.creator.firstName} ${conversation?.creator.lastName}`;
  const groupName = group?.title || 'Group';
  const headerTitle = type === 'group' ? groupName : displayName;

  const callUser = async () => {
    if (!recipient) return;
    if (!user) return;
    socket.emit('onVideoCallInitiate', {
      conversationId: conversation?.id,
      recipientId: recipient.id,
    });
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    dispatch(setLocalStream(stream));
    dispatch(setIsCalling(true));
    dispatch(setActiveConversationId(conversation!.id));
    dispatch(setCaller(user));
    dispatch(setReceiver(recipient));
  };

  return (
    <>
      {showModal && (
        <AddGroupRecipientModal
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
      <MessagePanelHeaderStyle>
        <div>
          <span>{headerTitle}</span>
        </div>
        <GroupHeaderIcons>
          {type === 'private' && (
            <FaVideo size={30} cursor="pointer" onClick={callUser} />
          )}
          {type === 'group' && user?.id === group?.owner?.id && (
            <PersonAdd
              cursor="pointer"
              size={30}
              onClick={() => setShowModal(true)}
            />
          )}
          {type === 'group' && (
            <PeopleGroup
              cursor="pointer"
              size={30}
              onClick={() => dispatch(toggleSidebar())}
            />
          )}
        </GroupHeaderIcons>
      </MessagePanelHeaderStyle>
    </>
  );
};