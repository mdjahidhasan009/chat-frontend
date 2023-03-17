import {Outlet, useNavigate, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {useContext, useEffect} from "react";
import {updateType} from "../../store/selectedSlice";
import {addGroup, fetchGroupsThunk, removeGroup, updateGroup} from "../../store/groupSlice";
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
      navigate('/groups');
      dispatch(removeGroup(payload.group));
    });

    return () => {
      socket.removeAllListeners();
      // socket.off('onGroupMessage');
      // socket.off('onGroupCreate');
      // socket.off('onGroupUserAdd');
      // socket.off('onGroupReceivedNewUser');
      // socket.off('onGroupRemovedUser');
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