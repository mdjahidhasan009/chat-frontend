import {Outlet, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {useContext, useEffect} from "react";
import {updateType} from "../../store/selectedSlice";
import {fetchGroupsThunk} from "../../store/groupSlice";
import {Page} from "../../utils/styles";
import {ConversationSidebar} from "../../components/conversations/ConversationSidebar";
import {ConversationPanel} from "../../components/conversations/ConversationPanel";
import {SocketContext} from "../../utils/context/SocketContext";
import {GroupMessageEventPayload} from "../../utils/types";
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

    return () => {
      socket.off('onGroupMessage');
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