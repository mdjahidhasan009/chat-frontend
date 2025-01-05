import { LayoutPage } from "../utils/styles";
import { Outlet, useNavigate } from "react-router-dom";
import { UserSidebar} from "../components/sidebars/UserSidebar";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../utils/context/SocketContext";
import { AppDispatch, RootState } from "../store";
import { AcceptFriendRequestResponse, FriendRequest, SelectableTheme } from "../utils/types";
import { removeFriendRequest } from "../store/friends/friendsSlice";
import { useToast } from "../utils/hooks/useToast";
import { BsFillPersonCheckFill } from 'react-icons/bs';
import { fetchFriendRequestThunk } from "../store/friends/friendsThunk";
import { ThemeProvider } from "styled-components";
import { DarkTheme, LightTheme } from "../utils/themes";
import { useVideoCallRejected } from "../utils/hooks/sockets/useVideoCallRejected";
import { useVideoCallHangUp } from "../utils/hooks/sockets/useVideoCallHangUp";
import { useVideoCallAccept } from "../utils/hooks/sockets/useVideoCallAccept";
import { useFriendRequestReceived } from "../utils/hooks/sockets/friend-requests/useFriendRequestReceived";
import { useVideoCall } from "../utils/hooks/sockets/call/useVideoCall";
import { useVoiceCall } from "../utils/hooks/sockets/call/useVoiceCall";
import { useVoiceCallAccepted } from "../utils/hooks/sockets/call/useVoiceCallAccepted";
import { useVoiceCallHangUp } from "../utils/hooks/sockets/call/useVoiceCallHangUp";
import { useVoiceCallRejected } from "../utils/hooks/sockets/call/useVoiceCallRejected";
import { CallReceiveDialog } from "../components/calls/CallReceiveDialog";

export const AppPage = () => {
  const socket = useContext(SocketContext);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isReceivingCall, caller } = useSelector(
    (state: RootState) => state.call
  );
  const { info } = useToast({ theme: 'dark' });
  const { theme } = useSelector((state: RootState) => state.settings);
  const storageTheme = localStorage.getItem('theme') as SelectableTheme;

  useEffect(() => {
    dispatch(fetchFriendRequestThunk());
  }, [dispatch]);

  useFriendRequestReceived();
  useVideoCall();

  useEffect(() => {
    socket.on('onFriendRequestCancelled', (payload: FriendRequest) => {
      dispatch(removeFriendRequest(payload));
    });

    socket.on('onFriendRequestAccepted', (payload: AcceptFriendRequestResponse) => {
      dispatch(removeFriendRequest(payload.friendRequest));
      socket.emit('getOnlineFriends');
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
      socket.off('onFriendRequestCancelled');
      socket.off('onFriendRequestRejected');
      socket.off('onFriendRequestReceived');
      socket.off('onFriendRequestAccepted');
    };
  }, [socket, isReceivingCall]);

  useVideoCallAccept();
  useVideoCallRejected();
  useVideoCallHangUp();
  useVoiceCall();
  useVoiceCallAccepted();
  useVoiceCallHangUp();
  useVoiceCallRejected();

  return (
    <ThemeProvider
      theme={
        storageTheme
          ? storageTheme === 'dark'
            ? DarkTheme
            : LightTheme
          : theme === 'dark'
          ? DarkTheme
          : LightTheme
      }
    >
    {isReceivingCall && caller && <CallReceiveDialog />}
    <LayoutPage>
      <UserSidebar />
      <Outlet />
    </LayoutPage>
  </ThemeProvider>
  )
}