import {LayoutPage, Page} from "../utils/styles";
import {Outlet} from "react-router-dom";
import {UserSidebar} from "../components/sidebars/UserSidebar";
import { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { SocketContext } from "../utils/context/SocketContext";
import { AppDispatch } from "../store";
import { FriendRequest } from "../utils/types";
import { addFriendRequest } from "../store/friends/friendsSlice";

export const AppPage = () => {
  const socket = useContext(SocketContext);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    socket.on('onFriendRequestReceived', (payload: FriendRequest) => {
      console.log('onFriendRequestReceived');
      console.log(payload);
      dispatch(addFriendRequest(payload));
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