import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store";
import { ContextMenu, ContextMenuItem } from "../../utils/styles";
import { MdOutlineTextsms, MdPersonRemove } from "react-icons/md";
import { SocketContext } from "../../utils/context/SocketContext";
import { useContext } from "react";
import { toggleContextMenu } from "../../store/groupSlice";
import { removeFriendThunk } from "../../store/friends/friendsThunk";
import { AuthContext } from "../../utils/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { checkConversationOrCreate } from "../../utils/api";

export const FriendContextMenu = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { points, selectedFriendContextMenu } = useSelector((state: RootState) => state.friends);
  const socket = useContext(SocketContext);

  const getUserFriendInstance = () =>
  user?.id === selectedFriendContextMenu?.sender.id
    ? selectedFriendContextMenu?.receiver
    : selectedFriendContextMenu?.sender;

  const removeFriend = () => {
    if(!selectedFriendContextMenu) return;

    dispatch(toggleContextMenu(false));
    dispatch(removeFriendThunk(selectedFriendContextMenu.id)).then(() => {
      socket.emit('getOnlineFriends');
    });
  }

  const sendMessage = () => {
    const recipient = getUserFriendInstance();
    recipient &&
      checkConversationOrCreate(recipient.id)
        .then(({ data }) => {
          console.log(data);
          navigate(`/conversations/${data.id}`);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  return (
    <ContextMenu top={points.y} left={points.x}>
      <ContextMenuItem onClick={removeFriend}>
        <MdPersonRemove size={20} color="#ff0000" />
        <span style={{ color: '#ff0000' }}>Remove Friend</span>
      </ContextMenuItem>
      <ContextMenuItem onClick={sendMessage}>
        <MdOutlineTextsms size={20} color="#fff" />
        <span style={{ color: "#fff" }}>Message</span>
      </ContextMenuItem>
    </ContextMenu>
  )
}