import { useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import {
  setIsCallInProgress,
  setIsReceivingCall,
  setActiveConversationId,
  setLocalStream,
  setRemoteStream,
} from '../../../store/call/callSlice';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import { AcceptedCallPayload } from '../../types';
import Peer from 'simple-peer';

/**
 * This useEffect will only trigger logic for the person who initiated
 * the call. It will start a peer connection with the person who already
 * accepted the call.
 */
export function useVideoCallAccept() {
  console.log('init-useVideoCallAccept');

  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const dispatch = useDispatch<AppDispatch>();

  const callerPeerRef = useRef<Peer.Instance | null>(null);
  const receiverPeerRef = useRef<Peer.Instance | null>(null);

  const { localStream, caller, receiver } = useSelector((state: RootState) => state.call);

  // Local flags to prevent multiple setups
  const connectionInitiatedRef = useRef(false);
  const responderConnectionInitiatedRef = useRef(false);
  const signalingAcceptingFromReceiverRef = useRef(false);
  const tempPeerSignalRef = useRef(false);

  // Ref to store pending signals if localStream is not yet available
  const pendingCallerSignalsRef = useRef<any[]>([]);

  // Define ICE servers
  const iceServers = [
    {
      urls: process.env.REACT_APP_GOOGLE_STUN_SERVER || '',
    },
    {
      urls: process.env.REACT_APP_TURN_SERVER1_NAME || '',
      username: process.env.REACT_APP_TURN_SERVER1_USERNAME || '',
      credential: process.env.REACT_APP_TURN_SERVER1_PASSWORD || '',
    },
    {
      urls: process.env.REACT_APP_TURN_SERVER2_NAME || '',
      username: process.env.REACT_APP_TURN_SERVER2_USERNAME || '',
      credential: process.env.REACT_APP_TURN_SERVER2_PASSWORD || '',
    },
  ];

  // Handle 'onVideoCallAccept' event
  useEffect(() => {
    const handleVideoCallAccept = async (data: AcceptedCallPayload) => {
      // Prevent multiple initializations
      if (connectionInitiatedRef.current) {
        console.warn('Connection already initiated.');
        return;
      }
      connectionInitiatedRef.current = true;

      dispatch(setIsCallInProgress(true));
      dispatch(setIsReceivingCall(false));
      dispatch(setActiveConversationId(data.conversation.id));

      try {
        const constraints = { video: true, audio: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        dispatch(setLocalStream(stream));

        if (user?.id === data.caller.id) {
          // If current user is the caller, set up initiator connection
          setupInitiatorConnection(data, stream);
        } else {
          // If current user is the receiver, handle responder setup
          console.log('Current user is the receiver. Awaiting signals.');
          // The responder will handle signals when they arrive
        }
      } catch (error) {
        console.error('Error accessing media devices.', error);
        connectionInitiatedRef.current = false; // Reset on error
      }
    };

    socket.on('onVideoCallAccept', handleVideoCallAccept);

    return () => {
      socket.off('onVideoCallAccept', handleVideoCallAccept);
    };
  }, [socket, dispatch, user]);

  // Handle 'receivingSignalOfCaller' event
  useEffect(() => {
    const handleReceivingSignalOfCaller = (data: any) => {
      console.log('Received receivingSignalOfCaller:', data);
      if (localStream) {
        setupResponderConnection(data);
      } else {
        console.warn('Local stream not available. Storing the incoming signal.');
        pendingCallerSignalsRef.current.push(data);
      }
    };

    socket.on('receivingSignalOfCaller', handleReceivingSignalOfCaller);

    return () => {
      socket.off('receivingSignalOfCaller', handleReceivingSignalOfCaller);
    };
  }, [socket, localStream]);

  // Process any pending signals once localStream is available
  useEffect(() => {
    if (localStream && pendingCallerSignalsRef.current.length > 0) {
      pendingCallerSignalsRef.current.forEach((signalData) => {
        setupResponderConnection(signalData);
      });
      pendingCallerSignalsRef.current = []; // Clear the pending signals
    }
  }, [localStream]);

  const setupInitiatorConnection = (data: AcceptedCallPayload, stream: MediaStream) => {
    if (!user || user.id !== data.caller.id) {
      console.warn('Current user is not the caller.');
      connectionInitiatedRef.current = false;
      return;
    }

    console.log('Setting up initiator connection with data:', data);

    const callerPeer = new Peer({
      initiator: true,
      trickle: false,
      config: { iceServers },
      stream: stream, // Use the stream obtained directly
    });

    if (!callerPeer) {
      console.error('Failed to create callerPeer.');
      connectionInitiatedRef.current = false;
      return;
    }

    callerPeerRef.current = callerPeer;

    // Emit signal to receiver
    callerPeer.on('signal', (signal) => {
      console.log('callerPeer => sendingSignalOfCallerToReceiver', { signal, data });
      socket.emit('sendingSignalOfCallerToReceiver', { signal, callerId: data.acceptor.id });
    });

    // Receive remote stream
    callerPeer.on('stream', (remoteStream) => {
      console.log('callerPeer => received remote stream:', remoteStream);
      dispatch(setRemoteStream(remoteStream));
    });

    // Handle connection events
    callerPeer.on('connect', () => {
      console.log('Caller Peer Connected');
    });

    callerPeer.on('error', (err) => {
      console.error('Caller Peer Error:', err);
      connectionInitiatedRef.current = false;
    });

    // Handle receiving signal from receiver
    const handleReceivingSignalOfReceiverToCaller = (data: any) => {
      console.log('Received signal from receiver:', data);
      if (callerPeerRef.current) {
        callerPeerRef.current.signal(data.signal);
      }
    };

    socket.on('receivingSignalOfReceiverToCaller', handleReceivingSignalOfReceiverToCaller);

    // Cleanup the receiver signal listener when connection is closed
    callerPeer.on('close', () => {
      console.log('Caller Peer Connection Closed');
      socket.off('receivingSignalOfReceiverToCaller', handleReceivingSignalOfReceiverToCaller);
      connectionInitiatedRef.current = false;
    });

    console.log('done-setupInitiatorConnection');
  };

  const setupResponderConnection = (data: any) => {
    console.log('Setting up responder connection with data:', data);

    if (!user || !receiver) {
      console.warn('User or receiver information is missing.');
      return;
    }

    if (user.id !== receiver.id) {
      console.warn('Current user is not the receiver.');
      return;
    }

    if (responderConnectionInitiatedRef.current) {
      console.warn('Responder connection already initiated.');
      return;
    }

    if (!localStream) {
      console.error('Local stream is not available.');
      return;
    }

    console.log('Setting up responder connection.');

    const receiverPeer = new Peer({
      initiator: false,
      trickle: false,
      config: { iceServers },
      stream: localStream,
    });

    if (!receiverPeer) {
      console.error('Failed to create receiverPeer.');
      return;
    }

    receiverPeerRef.current = receiverPeer;
    responderConnectionInitiatedRef.current = true;

    // Emit signal back to caller
    receiverPeer.on('signal', (signal) => {
      if (tempPeerSignalRef.current) return;

      if (!caller) {
        console.error('Caller information is missing.');
        return;
      }

      socket.emit('returningSignalOfReceiverToCaller', { signal, callerId: caller.id });
      tempPeerSignalRef.current = true;
    });

    // Signal the initial data
    if (!signalingAcceptingFromReceiverRef.current) {
      receiverPeer.signal(data.signal);
      signalingAcceptingFromReceiverRef.current = true;
    }

    // Receive remote stream
    receiverPeer.on('stream', (remoteStream) => {
      dispatch(setRemoteStream(remoteStream));
    });

    // Handle connection events
    receiverPeer.on('connect', () => {
      console.info('Receiver Peer Connected');
    });

    receiverPeer.on('error', (err) => {
      console.error('Receiver Peer Error:', err);
      responderConnectionInitiatedRef.current = false;
    });

    receiverPeer.on('close', () => {
      console.info('Receiver Peer Connection Closed');
      responderConnectionInitiatedRef.current = false;
    });

  };

  // Cleanup Peer instances on unmount
  useEffect(() => {
    return () => {
      if (callerPeerRef.current) {
        callerPeerRef.current.destroy();
      }
      if (receiverPeerRef.current) {
        receiverPeerRef.current.destroy();
      }
    };
  }, []);
}
