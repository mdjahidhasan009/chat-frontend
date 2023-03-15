import {Outlet, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {useContext, useEffect} from "react";
import {updateType} from "../../store/selectedSlice";
import {addGroup, fetchGroupsThunk, updateGroup} from "../../store/groupSlice";
import {Page} from "../../utils/styles";
import {ConversationSidebar} from "../../components/sidebars/ConversationSidebar";
import {ConversationPanel} from "../../components/conversations/ConversationPanel";
import {SocketContext} from "../../utils/context/SocketContext";
import {AddGroupUserMessagePayload, Group, GroupMessageEventPayload} from "../../utils/types";
import {addGroupMessage} from "../../store/groupMessageSlice";

export const GroupPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const socket = useContext(SocketContext);

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

    return () => {
      socket.off('onGroupMessage');
      socket.off('onGroupCreate');
      socket.off('onGroupUserAdd');
      socket.off('onGroupReceivedNewUser');
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