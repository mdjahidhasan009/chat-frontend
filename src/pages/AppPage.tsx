import { LayoutPage, Page } from "../utils/styles";
import { Outlet, useNavigate } from "react-router-dom";
import { UserSidebar} from "../components/sidebars/UserSidebar";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../utils/context/SocketContext";
import { AppDispatch, RootState } from "../store";
import { AcceptFriendRequestResponse, AcceptedVideoCallPayload, FriendRequest, SelectableTheme, VideoCallPayload } from "../utils/types";
import { addFriendRequest, removeFriendRequest } from "../store/friends/friendsSlice";
import { useToast } from "../utils/hooks/useToast";
import { IoMdPersonAdd } from 'react-icons/io';
import { BsFillPersonCheckFill } from 'react-icons/bs';
import { fetchFriendRequestThunk } from "../store/friends/friendsThunk";
import { ThemeProvider } from "styled-components";
import { DarkTheme, LightTheme } from "../utils/themes";
import { AuthContext } from "../utils/context/AuthContext";
import Peer from "peerjs";
import { setCall, setCaller, setConnection, setIsCallInProgress, setIsReceivingCall, setLocalStream, setPeer, setRemoteStream } from "../store/call/callSlice";
import { CallReceiveDialog } from "../components/conversations/CallReceiveDialog";
import { useVideoCallRejected } from "../utils/hooks/useVideoCallRejected";

export const AppPage = () => {
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { peer, call, isReceivingCall, caller, connection } = useSelector((state: RootState) => state.call);
  const { info } = useToast({ theme: 'dark' });
  const storageTheme = localStorage.getItem('theme') as SelectableTheme;
  const { theme } = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    dispatch(fetchFriendRequestThunk());
  }, []);

  useEffect(() => {
    if(!user) return;
    const newPeer = new Peer(user.peer.id);
    dispatch(setPeer(newPeer));
  }, []);

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

    socket.on('onVideoCall', (data: VideoCallPayload) => {
      if(isReceivingCall) return;
      dispatch(setCaller(data.caller));
      dispatch(setIsReceivingCall(true));
    })

    return () => {
      socket.off('onFriendRequestCancelled');
      socket.off('onFriendRequestRejected');
      socket.off('onFriendRequestReceived');
      socket.off('onFriendRequestAccepted');
      socket.off('onVideoCall');
    };
  }, [socket, isReceivingCall]);

    /**
   * This useEffect hook is for the user who is receiving the call.
   * So we must dispatch the appropriate actions to set the state
   * for the user receiving the call.
   *
   * The user who is calling will have its own instance of MediaConnection/Call
   */
  useEffect(() => {
    if(!peer) return;

    peer.on('call', (incomingCall) => {
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        incomingCall.answer(stream);
        dispatch(setLocalStream(stream));
        dispatch(setCall(incomingCall));
      })
      .catch((err) => {
        console.error(err);
      });
    });
  }, [peer, call, dispatch]);

  useEffect(() => {
    if (!call) return;
    call.on('stream', (remoteStream) => {
      dispatch(setRemoteStream(remoteStream));
    })
  }, [call]);

  /**
  * This useEffect will only trigger logic for the person who initiated
  * the call. It will start a peer connection with the person who already
  * accepted the call.
  */
  useEffect(() => {
    socket.on('onVideoCallAccept', (data: AcceptedVideoCallPayload) => {
      dispatch(setIsCallInProgress(true));
      dispatch(setIsReceivingCall(false));
      if(!peer) return;
      if(data.caller.id === user!.id) {
        const connection = peer.connect(data.acceptor.peer.id);
        dispatch(setConnection(connection));
        navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          const newCall = peer.call(data.acceptor.peer.id, stream);
          dispatch(setCall(newCall));
        })
        .catch((err) => {
          console.error(err);
        });
      }
    });

    return () => {
      socket.off('onVideoCallAccept');
    }
  }, [peer]);

  useVideoCallRejected();

  useEffect(() => {
    if(connection) {
      connection.on('open', () => {
        console.log('connection opened');
      });
      connection.on('error', () => {
        console.log('connection error');
      });
      connection.on('data', (data) => {
        console.log('data received', data);
      })
    };
    return () => {
      connection?.off('open');
      connection?.off('error');
      connection?.off('data');
    };
  }, [connection]);

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