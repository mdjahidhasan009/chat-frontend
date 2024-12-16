import {useDispatch, useSelector} from 'react-redux';
import { RootState } from '../../store';
import { CallReceiveDialogContainer } from '../../utils/styles';
import { UserAvatar } from '../users/UserAvatar';
import { MdCall, MdCallEnd } from 'react-icons/md';
import { HandleCallType } from '../../utils/types';
import { useContext } from 'react';
import { SocketContext } from '../../utils/context/SocketContext';
import { SenderEvents, WebsocketEvents } from '../../utils/constants';
import {setCall, setLocalStream} from "../../store/call/callSlice";

export const CallReceiveDialog = () => {
  const { caller, callType } = useSelector((state: RootState) => state.call);
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();

  //Step 6: Handle video call accepted by the receiver
  const handleCall = async (type: HandleCallType) => {

      console.log('caller', caller)

    const payload = { caller };
    switch (type) {
      case 'accept':
        return callType === 'video'
        ? socket.emit(SenderEvents.VIDEO_CALL_ACCEPT, payload)
        : socket.emit(SenderEvents.VOICE_CALL_ACCEPT, payload);
      case 'reject':
        return callType === 'video'
        ? socket.emit(WebsocketEvents.VIDEO_CALL_REJECTED, payload)
        : socket.emit(WebsocketEvents.VOICE_CALL_REJECTED, payload);
    }
  };
  return (
    <CallReceiveDialogContainer>
      <UserAvatar user={caller!} />
      <div className="content">
      <span>
          {caller!.username} wants to {callType === 'audio' ? 'voice' : 'video'}{' '}
          call you
        </span>
      </div>
      <div className="icons">
        <div className="accept" onClick={() => handleCall('accept')}>
          <MdCall />
        </div>
        <div className="reject" onClick={() => handleCall('reject')}>
          <MdCallEnd />
        </div>
      </div>
    </CallReceiveDialogContainer>
  );
};