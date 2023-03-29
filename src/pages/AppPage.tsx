import { LayoutPage, Page } from "../utils/styles";
import { Outlet, useNavigate } from "react-router-dom";
import { UserSidebar} from "../components/sidebars/UserSidebar";
import { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { SocketContext } from "../utils/context/SocketContext";
import { AppDispatch } from "../store";
import { AcceptFriendRequestResponse, FriendRequest } from "../utils/types";
import { addFriendRequest, removeFriendRequest } from "../store/friends/friendsSlice";
import { useToast } from "../utils/hooks/useToast";
import { IoMdPersonAdd } from 'react-icons/io';
import { BsFillPersonCheckFill } from 'react-icons/bs';

export const AppPage = () => {
  const socket = useContext(SocketContext);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { info } = useToast({ theme: 'dark' });

  useEffect(() => {
    socket.on('onFriendRequestReceived', (payload: FriendRequest) => {
      dispatch(addFriendRequest(payload));
      info(`Incoming Friend Request from ${payload.sender.firstName}`, {
        position: 'bottom-left',
        icon: IoMdPersonAdd,
        onClick: () => navigate('/friends/requests'),
      });
    });

    socket.on('onFriendRequestCancelled', (payload: FriendRequest) => {
      dispatch(removeFriendRequest(payload));
    });

    socket.on('onFriendRequestAccepted', (payload: AcceptFriendRequestResponse) => {
      dispatch(removeFriendRequest(payload.friendRequest));
      info(`${payload.friendRequest.receiver.firstName} accepted your friend request`, {
          position: 'bottom-left',
          icon: BsFillPersonCheckFill,
          onClick: () => navigate('/friends'),
        }
      );
    });

    socket.on('onFriendRequestRejected', (payload: FriendRequest) => {
      dispatch(removeFriendRequest(payload));
    });

    return () => {
      socket.removeAllListeners();
    };
  }, []);

  return (
    <LayoutPage>
      <UserSidebar />
      <Outlet />
    </LayoutPage>
  )
}