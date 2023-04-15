import { useEffect, useRef } from "react";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { ConversationCallContainer, VideoContainer, VideoContainerActionButtons, VideoContainerItem } from "../../utils/styles";
import {
  BiMicrophone,
  BiVideo,
} from 'react-icons/bi';
import { ImPhoneHangUp } from 'react-icons/im';

export const ConversationCall = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { localStream, remoteStream } = useSelector((state: RootState) => state.call);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.muted = true;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      // remoteVideoRef.current.play();
    }
  }, [remoteStream]);

  return (
    <ConversationCallContainer>
      <VideoContainer>
        {localStream && (
          <VideoContainerItem>
            <video ref={localVideoRef} playsInline autoPlay />
          </VideoContainerItem>
        )}
        {remoteStream && (
          <VideoContainerItem>
            <video ref={remoteVideoRef} playsInline autoPlay />
          </VideoContainerItem>
        )}
      </VideoContainer>
      <VideoContainerActionButtons>
        <div>
          <BiVideo />
        </div>
        <div>
          <BiMicrophone />
        </div>
        <div>
          <ImPhoneHangUp />
        </div>
      </VideoContainerActionButtons>
    </ConversationCallContainer>
  );
}