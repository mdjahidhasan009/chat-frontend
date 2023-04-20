import { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { resetState } from '../../../../store/call/callSlice';
import { WebsocketEvents } from '../../../constants';
import { SocketContext } from '../../../context/SocketContext';

export function useVoiceCallHangUp() {
  const socket = useContext(SocketContext);
  const dispatch = useDispatch<AppDispatch>();
  const { call, connection, localStream, remoteStream } = useSelector(
    (state: RootState) => state.call
  );
  useEffect(() => {
    socket.on(WebsocketEvents.VOICE_CALL_HANG_UP, () => {
      localStream &&
        localStream.getTracks().forEach((track) => {
          track.stop();
        });
      console.log(remoteStream);
      remoteStream &&
        remoteStream.getTracks().forEach((track) => {
          track.stop();
        });
      call && call.close();
      connection && connection.close();
      dispatch(resetState());
    });

    return () => {
      socket.off(WebsocketEvents.VOICE_CALL_HANG_UP);
    };
  }, [call, remoteStream, localStream]);
}