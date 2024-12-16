import { LayoutPage, Page } from "../utils/styles";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { UserSidebar} from "../components/sidebars/UserSidebar";
import { useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../utils/context/SocketContext";
import { AppDispatch, RootState } from "../store";
import { AcceptFriendRequestResponse, AcceptedCallPayload, FriendRequest, SelectableTheme, CallPayload } from "../utils/types";
import { addFriendRequest, removeFriendRequest } from "../store/friends/friendsSlice";
import { useToast } from "../utils/hooks/useToast";
import { IoMdPersonAdd } from 'react-icons/io';
import { BsFillPersonCheckFill } from 'react-icons/bs';
import { fetchFriendRequestThunk } from "../store/friends/friendsThunk";
import { ThemeProvider } from "styled-components";
import { DarkTheme, LightTheme } from "../utils/themes";
import { AuthContext } from "../utils/context/AuthContext";
import Peer from "peerjs";
import { setActiveConversationId, setCall, setCaller, setConnection, setIsCallInProgress, setIsReceivingCall, setLocalStream, setPeer, setReceiver, setRemoteStream } from "../store/call/callSlice";
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
  const { user } = useContext(AuthContext);
  const { pathname } = useLocation();
  const socket = useContext(SocketContext);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { peer, call, isReceivingCall, caller, connection, callType } = useSelector(
    (state: RootState) => state.call
  );
  const { info } = useToast({ theme: 'dark' });
  const { theme } = useSelector((state: RootState) => state.settings);
  const storageTheme = localStorage.getItem('theme') as SelectableTheme;

  useEffect(() => {
    dispatch(fetchFriendRequestThunk());
  }, [dispatch]);

  // useEffect(() => {
  //   if(!user) return;
  //   const newPeer = new Peer(user.peer.id, {
  //     config: {
  //       iceServers: [
  //         {
  //           url: 'stun:stun.l.google.com:19302',
  //         },
  //         {
  //           url: 'stun:stun1.l.google.com:19302',
  //         },
  //       ],
  //     },
  //   });
  //
  //   peer?.on('error', (err) => {
  //     console.error('PeerJS Error:', err);
  //   });
  //
  //   peer?.on('disconnected', () => {
  //     console.warn('Peer disconnected. Attempting reconnect...');
  //     peer.reconnect(); // Attempt to reconnect
  //   });
  //
  //   peer?.on('open', (id) => {
  //     console.log('Peer connection established with ID:', id);
  //   });
  //   // debugger
  //   dispatch(setPeer(newPeer));
  // }, []);

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

    /**
   * This useEffect hook is for the user who is receiving the call.
   * So we must dispatch the appropriate actions to set the state
   * for the user receiving the call.
   *
   * The user who is calling will have its own instance of MediaConnection/Call
   */
  // useEffect(() => {
  //   if(!peer) return;
  //   console.log('peer')
  //   // debugger
  //   debugger
  //
  //   peer.on('call', async (incomingCall) => {
  //     const constraints = { video: callType === 'video', audio: true };
  //     // debugger
  //     debugger
  //     const stream = await navigator.mediaDevices.getUserMedia(constraints);
  //     incomingCall.answer(stream);
  //     dispatch(setLocalStream(stream));
  //     dispatch(setCall(incomingCall));
  //   });
  //   return () => {
  //     peer.off('call');
  //   };
  // }, [peer, callType, dispatch]);

  // useEffect(() => {
  //   if (!call) return;
  //   call.on('stream', (remoteStream) =>
  //     dispatch(setRemoteStream(remoteStream))
  //   );
  //   call.on('close', () => console.log('call was closed'));
  //   return () => {
  //     call.off('stream');
  //     call.off('close');
  //   };
  // }, [call]);

  console.log('AppPage.tsx')
  useVideoCallAccept();
  useVideoCallRejected();
  useVideoCallHangUp();
  useVoiceCall();
  useVoiceCallAccepted();
  useVoiceCallHangUp();
  useVoiceCallRejected();

  // useEffect(() => {
  //   if(connection) {
  //     connection.on('open', () => {
  //       console.log('connection opened');
  //     });
  //     connection.on('error', () => {
  //       console.log('connection error');
  //     });
  //     connection.on('data', (data) => {
  //       console.log('data received', data);
  //     })
  //     connection.on('close', () => {
  //       console.log('connection closed');
  //     });
  //   };
  //   return () => {
  //     connection?.off('open');
  //     connection?.off('error');
  //     connection?.off('data');
  //   };
  // }, [connection]);

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