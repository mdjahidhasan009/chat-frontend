import { useContext, useEffect } from "react";
import { SocketContext } from "../../../context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../store";
import { AuthContext } from "../../../context/AuthContext";
import { RootState } from "../../../../store";
import { CallPayload } from "../../../types";
import { setCallType, setCaller, setIsReceivingCall, setReceiver } from "../../../../store/call/callSlice";
import { ReceiverEvents } from "../../../constants";

export function useVoiceCall() {
  const socket = useContext(SocketContext);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useContext(AuthContext);
  const { isReceivingCall } = useSelector((state: RootState) => state.call);
  
  useEffect(() => {
    socket.on(ReceiverEvents.VOICE_CALL, (data: CallPayload) => {
      if (isReceivingCall) return;
      dispatch(setCaller(data.caller));
      dispatch(setReceiver(user!));
      dispatch(setIsReceivingCall(true));
      dispatch(setCallType('audio'));
    });

    return () => {
      socket.off(ReceiverEvents.VOICE_CALL);
    };
  }, [isReceivingCall]);
}