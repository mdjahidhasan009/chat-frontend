import {Outlet, useNavigate, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {useContext, useEffect} from "react";
import {updateType} from "../../store/selectedSlice";
import {addGroup, fetchGroupsThunk, removeGroup, updateGroup} from "../../store/groupsSlice";
import {Page} from "../../utils/styles";
import {ConversationSidebar} from "../../components/sidebars/ConversationSidebar";
import {ConversationPanel} from "../../components/conversations/ConversationPanel";
import {SocketContext} from "../../utils/context/SocketContext";
import {
  AddGroupUserMessagePayload,
  Group,
  GroupMessageEventPayload,
  RemoveGroupUserMessagePayload
} from "../../utils/types";
import {addGroupMessage} from "../../store/groupMessageSlice";
import {AuthContext} from "../../utils/context/AuthContext";

export const GroupPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch<AppDispatch>();
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(updateType('group'));
    dispatch(fetchGroupsThunk());
  }, []);

  useEffect(() => {
    socket.on('onGroupMessage', (payload: GroupMessageEventPayload) => {
      const { group, message } = payload;
      dispatch(addGroupMessage(payload));
    });

    socket.on('onGroupCreate', (payload: Group) => {
      dispatch(addGroup(payload));
    });

    socket.on('onGroupUserAdd', (payload: AddGroupUserMessagePayload) => {
      dispatch(addGroup(payload.group));
    });

    socket.on('onGroupReceivedNewUser', (payload: AddGroupUserMessagePayload) => {
        dispatch(updateGroup(payload.group));
      }
    );

    socket.on('onGroupRecipientRemoved', (payload: RemoveGroupUserMessagePayload) => {
        dispatch(updateGroup(payload.group));
      }
    );

    socket.on('onGroupRemoved', (payload: RemoveGroupUserMessagePayload) => {
      dispatch(removeGroup(payload.group));
      if (id && parseInt(id) === payload.group.id) {
        navigate('/groups');
      }
    });

    socket.on('onGroupParticipantLeft', (payload) => {
      dispatch(updateGroup(payload.group));
      if (payload.userId === user?.id) {
        navigate('/groups');
      }
    });

    socket.on('onGroupOwnerUpdate', (payload: Group) => {
      dispatch(updateGroup(payload));
    })

    return () => {
      socket.removeAllListeners();
    };
  }, [id]);

  return (
    <>
      <ConversationSidebar />
      {!id && <ConversationPanel />}
      <Outlet />
    </>
  );
}