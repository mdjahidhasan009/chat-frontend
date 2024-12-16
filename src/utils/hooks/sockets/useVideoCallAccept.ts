import {useContext, useEffect, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import {
  setIsCallInProgress,
  setIsReceivingCall,
  setConnection,
  setCall,
  setActiveConversationId, setPeer, setLocalStream, setRemoteStream,
} from '../../../store/call/callSlice';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import { AcceptedCallPayload } from '../../types';
import Peer from "simple-peer";

/**
 * This useEffect will only trigger logic for the person who initiated
 * the call. It will start a peer connection with the person who already
 * accepted the call.
 */
export function useVideoCallAccept() {
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const dispatch = useDispatch<AppDispatch>();
  const newPeerRef = useRef(null)
  const { peer, localStream, caller, receiver } = useSelector((state: RootState) => state.call);

  const signalingAcceptingFromReceiver = useRef(false);
  const tempPeerSignalRef = useRef(false);
  // const receiverPeerRef = useRef<any>(null);



  useEffect(() => {
    // Step 9: After server receives the video call accept event from the receiver, server will emit the
    // onVideoCallAccept event to the caller to notify them that the receiver has accepted the call
    socket.on('onVideoCallAccept', async (data: AcceptedCallPayload) => {
      // debugger
      dispatch(setIsCallInProgress(true));
      dispatch(setIsReceivingCall(false));
      dispatch(setActiveConversationId(data.conversation.id));

      // console.log('onVideoCallAccept')
      // console.log(data);

      // if(!localStream) return;

      const constraints = { video: true, audio: true };
      // debugger
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      // incomingCall.answer(stream);
      dispatch(setLocalStream(stream));
      // dispatch(setCall(incomingCall));

      //userJoined
      // socket.on('receivingReturnedSignalOfCaller', (data) => {
      //   console.log('receivingReturnedSignalOfCaller => will send own single to other user', { data })
      //   setupResponderConnection(data);
      // })

      setupInitiatorConnection(data);
    });

    socket.on('receivingSignalOfCaller', async (data) => {
      // console.log('receivingSignalOfCaller')
      // console.log('receivingReturnedSignalOfCallerRef.current', receivingReturnedSignalOfCallerRef.current)
      // console.log('receiverPeerRef.current', receiverPeerRef.current)
      // if(!receiverPeerRef.current) return;
      // if(Object.keys(receiverPeerRef.current).length === 0) return;
      // // if(!receiverPeerRef.current?.signal) return;
      //
      //
      // // if(receivingReturnedSignalOfCallerRef.current) return;
      // console.log('111111111111111111111111111111111111111111111111111111111111111111111111')
      //
      // console.log('receivingSignalOfCaller', { data })
      // //incomingSignal
      // // tempPeer.signal(data.signal as any);
      // receiverPeerRef.current.signal(data.signal as any)!;
      //
      // receivingReturnedSignalOfCallerRef.current = true;

      setupResponderConnection(data);
    });



    return () => {
      socket.off('onVideoCallAccept');
    };
  // }, [localStream, peer]);
  }, [localStream, caller]);

  const setupInitiatorConnection = (data: AcceptedCallPayload) => {
    //get is current user is initiator or not
    if(user?.id !== data.caller.id) return;
    console.log('setupInitiatorConnection')
    console.log('user', user)
    console.log('data', data)

    const callerPeer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
          {
            urls: process.env.REACT_APP_GOOGLE_STUN_SERVER || ""
          },
          {
            urls: process.env.REACT_APP_TURN_SERVER1_NAME  || "",
            username: process.env.REACT_APP_TURN_SERVER1_USERNAME  || "",
            credential: process.env.REACT_APP_TURN_SERVER1_PASSWORD  || ""
          },
          {
            urls: process.env.REACT_APP_TURN_SERVER2_NAME  || "",
            username: process.env.REACT_APP_TURN_SERVER2_USERNAME  || "",
            credential: process.env.REACT_APP_TURN_SERVER2_PASSWORD  || ""
          }
        ]
      },
      stream: localStream //My own stream of video and audio
    });

    //sending signal to second peer and if that receive than other(second) peer also will send an signal to this peer
    callerPeer.on("signal", signal => {
      console.log(user)
      console.log('callerPeer => sendingSignalOfCallerToReceiver => will send own single to other user', { signal, data })
      console.log(data)
      // socket.emit("sendingSignalOfReciver", { userIdToSendSignal: userIdToSendSignal, callerId: mySocketId, signal });
      socket.emit("sendingSignalOfCallerToReceiver", { signal, callerId: data.acceptor.id });
    })

    callerPeer.on("stream", stream => {
      console.log('callerPeer => stream')
      console.log(stream)
      dispatch(setRemoteStream(stream));
    })

    socket.on('receivingSignalOfReceiverToCaller', (data) => {
      console.log('44444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444')
      console.log(data)

      callerPeer.signal(data.signal as any);
    })
  }


  const setupResponderConnection = (data: any) => {

    console.log('setupResponderConnection')
    console.log('receiver', receiver)
    console.log('data', data)
    console.log('user', user)
    if(!user || !receiver) return;

    if(user.id !== receiver.id) return;

    const receiverPeer = new Peer({
      initiator: false,
      trickle: false,
      stream: localStream
    })

    // receiverPeerRef.current = receiverPeer;

    receiverPeer.on("signal", signal => {
      if(tempPeerSignalRef.current) return;

      console.log(data)
      console.log(user)
      console.log('caller')
      console.log(caller)
      if(!caller) return;

      console.log('receiverPeer => returningSignal sending ownsindle', { signal, callerId: caller.id })
      //returningSignal
      socket.emit("returningSignalOfReceiverToCaller", { signal, callerId: caller.id });
      tempPeerSignalRef.current = true;
    });

    if(!signalingAcceptingFromReceiver.current) {
      console.log('22222222222222222222222222222222222222222222222222222222222222222222222222222222')
      receiverPeer.signal(data.signal as any);

      signalingAcceptingFromReceiver.current = true;
    }


    receiverPeer.on("stream", stream => {
      console.log('receiverPeer => stream')
      console.log(stream)
      dispatch(setRemoteStream(stream));
    });

    // socket.on('receivingSignalOfCaller', async (data) => {
    //   console.log('receivingSignalOfCaller')
    //   console.log('receivingSignalOfCallerRef.current', receivingReturnedSignalOfCallerRef.current)
    //   if(receivingReturnedSignalOfCallerRef.current) return;
    //
    //   console.log('receivingSignalOfCaller', { data })
    //   //incomingSignal
    //   receiverPeer.signal(data.signal as any);
    //   receivingReturnedSignalOfCallerRef.current = true;
    // });
  }
}

