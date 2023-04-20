import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../../utils/context/SocketContext";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { ConversationCallContainer, MediaContainer, VideoContainerActionButtons, VideoContainerItem } from "../../utils/styles";
import { BiMicrophone, BiMicrophoneOff, BiVideo, BiVideoOff } from "react-icons/bi";
import { ImPhoneHangUp } from "react-icons/im";

export const ConversationVideoCall = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socket = useContext(SocketContext);
  const [ microphoneEnabled, setMicrophoneEnabled ] = useState(true);
  const [ videoEnabled, setVideoEnabled ] = useState(true);
  const { localStream, remoteStream, caller, receiver } = useSelector((state: RootState) => state.call);

  useEffect(() => {
    if (localVideoRef.current && localStream) {;
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.muted = true;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const toggleMicrophone = () =>
    localStream &&
    setMicrophoneEnabled((prev) => {
      localStream.getAudioTracks()[0].enabled = !prev;
      return !prev;
    });

  const toggleVideo = () =>
    localStream &&
    setVideoEnabled((prev) => {
      localStream.getVideoTracks()[0].enabled = !prev;
      return !prev;
    });

  const closeCall = () => {
    socket.emit('videoCallHangUp', { caller, receiver });
  };

  return (
    <ConversationCallContainer>
      <MediaContainer>
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
      </MediaContainer>
      <VideoContainerActionButtons>
        <div>
          {videoEnabled ? (
            <BiVideo onClick={toggleVideo} />
          ) : (
            <BiVideoOff onClick={toggleVideo} />
          )}
        </div>
        <div>
          {microphoneEnabled ? (
            <BiMicrophone onClick={toggleMicrophone} />
          ) : (
            <BiMicrophoneOff onClick={toggleMicrophone} />
          )}
        </div>
        <div>
          <ImPhoneHangUp onClick={closeCall} />
        </div>
      </VideoContainerActionButtons>
    </ConversationCallContainer>
  );
}