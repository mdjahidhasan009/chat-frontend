import { useEffect, useRef, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  AudioContainerItem,
  ConversationCallContainer,
  MediaContainer,
  VideoContainerActionButtons,
} from '../../utils/styles';
import { SocketContext } from '../../utils/context/SocketContext';
import { BiMicrophone, BiMicrophoneOff, BiVideo, BiVideoOff } from 'react-icons/bi';
import { ImPhoneHangUp } from 'react-icons/im';
import { WebsocketEvents } from '../../utils/constants';

export const ConversationAudioCall = () => {
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const socket = useContext(SocketContext);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const { localStream, remoteStream, caller, receiver } = useSelector(
    (state: RootState) => state.call
  );
  useEffect(() => {
    if (localAudioRef.current && localStream) {
      localAudioRef.current.srcObject = localStream;
      localAudioRef.current.muted = true;
    }
  }, [localStream]);
  useEffect(() => {
    if (remoteAudioRef.current && remoteStream) {
      remoteAudioRef.current.srcObject = remoteStream;
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
    socket.emit(WebsocketEvents.VOICE_CALL_HANG_UP, { caller, receiver });
  };

  return (
    <ConversationCallContainer>
      <div className="invisible"></div>
      <MediaContainer>
        {localStream && (
          <AudioContainerItem>
            <audio ref={localAudioRef} controls autoPlay />
          </AudioContainerItem>
        )}
        {remoteStream && (
          <AudioContainerItem>
            <audio ref={remoteAudioRef} controls autoPlay />
          </AudioContainerItem>
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
};