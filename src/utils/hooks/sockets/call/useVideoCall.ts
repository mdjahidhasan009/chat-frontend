import { useContext, useEffect } from "react";
import { SocketContext } from "../../../context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { AuthContext } from "../../../context/AuthContext";
import { CallPayload } from "../../../types";
import { setCallType, setCaller, setIsReceivingCall, setReceiver } from "../../../../store/call/callSlice";

export function useVideoCall() {
  const socket = useContext(SocketContext);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useContext(AuthContext);
  const { isReceivingCall } = useSelector((state: RootState) => state.call);

  useEffect(() => {
    // Step 5: Listen for the onVideoCall event from the server after initiating a video call from caller server send
    // this event to the receiver to notify them about the video call
    socket.on('onVideoCall', (data: CallPayload) => {
      if (isReceivingCall) return;

      dispatch(setCaller(data.caller));
      dispatch(setReceiver(user!));
      dispatch(setIsReceivingCall(true));
      dispatch(setCallType('video'));
    });

    return () => {
      socket.off('onVideoCall');
    }
  }, [isReceivingCall]);
}