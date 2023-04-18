import { useContext, useEffect } from "react";
import { SocketContext } from "../../../context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { AuthContext } from "../../../context/AuthContext";
import { VideoCallPayload } from "../../../types";
import { setCaller, setIsReceivingCall, setReceiver } from "../../../../store/call/callSlice";

export function useVideoCall() {
  const socket = useContext(SocketContext);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useContext(AuthContext);
  const { isReceivingCall } = useSelector((state: RootState) => state.call);

  useEffect(() => {
    socket.on('onVideoCall', (data: VideoCallPayload) => {
      if (isReceivingCall) return;

      dispatch(setCaller(data.caller));
      dispatch(setReceiver(user!));
      dispatch(setIsReceivingCall(true));
    });

    return () => {
      socket.off('onVideoCall');
    }
  }, [isReceivingCall]);
}