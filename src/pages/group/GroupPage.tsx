import {Outlet, useNavigate, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {useContext, useEffect, useState} from "react";
import {updateType} from "../../store/selectedSlice";
import {addGroup, fetchGroupsThunk, removeGroup, updateGroup} from "../../store/groupSlice";
import {ConversationSidebar} from "../../components/sidebars/ConversationSidebar";
import {ConversationPanel} from "../../components/conversations/ConversationPanel";
import {SocketContext} from "../../utils/context/SocketContext";
import {
  AddGroupUserMessagePayload,
  Group,
  GroupMessageEventPayload,
  GroupParticipantLeftPayload,
  RemoveGroupUserMessagePayload,
  UpdateGroupAction
} from "../../utils/types";
import {addGroupMessage} from "../../store/groupMessageSlice";
import {AuthContext} from "../../utils/context/AuthContext";

export const GroupPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useContext(AuthContext);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 800);
  const dispatch = useDispatch<AppDispatch>();
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(updateType('group'));
    dispatch(fetchGroupsThunk());
  }, []);

  useEffect(() => {
    const handleResize = () => setShowSidebar(window.innerWidth > 800);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    socket.on('onGroupMessage', (payload: GroupMessageEventPayload) => {
      const { group } = payload;
      dispatch(addGroupMessage(payload));
      dispatch(updateGroup({ type: UpdateGroupAction.NEW_MESSAGE, group }));
    });

    socket.on('onGroupCreate', (payload: Group) => {
      dispatch(addGroup(payload));
    });

    socket.on('onGroupUserAdd', (payload: AddGroupUserMessagePayload) => {
      dispatch(addGroup(payload.group));
    });

    socket.on('onGroupReceivedNewUser', ({ group }: AddGroupUserMessagePayload) => {
        dispatch(updateGroup({ group }));
      }
    );

    socket.on('onGroupRecipientRemoved', ({ group }: RemoveGroupUserMessagePayload) => {
        dispatch(updateGroup({ group }));
      }
    );

    socket.on('onGroupRemoved', (payload: RemoveGroupUserMessagePayload) => {
      dispatch(removeGroup(payload.group));
      if (id && parseInt(id) === payload.group.id) {
        navigate('/groups');
      }
    });

    socket.on(
      'onGroupParticipantLeft',
      ({ group, userId }: GroupParticipantLeftPayload) => {
        dispatch(updateGroup({ group }));
        if (userId === user?.id) {
          dispatch(removeGroup(group));
          navigate('/groups');
        }
      }
    );

    socket.on('onGroupOwnerUpdate', (group: Group) => {
      dispatch(updateGroup({ group }));
    });

    return () => {
      socket.off('onGroupMessage');
      socket.off('onGroupCreate');
      socket.off('onGroupUserAdd');
      socket.off('onGroupReceivedNewUser');
      socket.off('onGroupRecipientRemoved');
      socket.off('onGroupRemoved');
      socket.off('onGroupParticipantLeft');
      socket.off('onGroupOwnerUpdate');
    };
  }, [id]);

  return (
    <>
      {showSidebar && <ConversationSidebar />}
      {!id && !showSidebar && <ConversationSidebar />}
      {!id && showSidebar && <ConversationPanel />}
      <Outlet />
    </>
  );
}