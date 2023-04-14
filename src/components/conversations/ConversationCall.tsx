import { useEffect, useRef } from "react";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { ConversationCallContainer } from "../../utils/styles";

export const ConversationCall = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { localStream, remoteStream } = useSelector((state: RootState) => state.call);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play();
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play();
    }
  }, [remoteStream]);

  return (
    <ConversationCallContainer>
      <div>
        <div>
          <span>You</span>
        </div>
        <video ref={localVideoRef} width={400} height={400} />
      </div>
      <div>
        <div>
          <span>Recipient</span>
        </div>
        <video ref={remoteVideoRef} width={400} height={400} />
      </div>
    </ConversationCallContainer>
  );
}