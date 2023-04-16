import { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { resetState } from '../../../store/call/callSlice';
import { SocketContext } from '../../context/SocketContext';

export function useVideoCallHangUp() {
  const socket = useContext(SocketContext);
  const dispatch = useDispatch<AppDispatch>();
  const { call, connection, localStream, remoteStream } = useSelector(
    (state: RootState) => state.call
  );
  useEffect(() => {
    socket.on('onVideoCallHangUp', () => {
      localStream &&
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
    
      remoteStream &&
      remoteStream.getTracks().forEach((track) => {
        track.stop();
      });
      call && call.close();
      connection && connection.close();
      dispatch(resetState());
    });

    return () => {
      socket.off('onVideoCallHangUp');
    };
  }, [call, remoteStream, localStream]);
}