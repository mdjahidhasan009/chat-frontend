import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MessagePanel } from '../../components/messages/MessagePanel';
import { getConversationMessages } from '../../utils/api';
import { AuthContext } from '../../utils/context/AuthContext';
import { SocketContext } from '../../utils/context/SocketContext';
import { ConversationChannelPageStyle } from '../../utils/styles';
import { MessageEventPayload, MessageType } from '../../utils/types';
import { AppDispatch, RootState } from '../../store';
import {addMessage, editMessage} from '../../store/messages/messageSlice';
import { updateConversation } from '../../store/conversationSlice';
import { fetchMessagesThunk } from '../../store/messages/messageThunk';

export const ConversationChannelPage = () => {
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const { id } = useParams();
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>();
  const [isTyping, setIsTyping] = useState(false);
  const [isRecipientTyping, setIsRecipientTyping] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const conversationId = parseInt(id!);
    dispatch(fetchMessagesThunk(conversationId));
  }, [id]);

  useEffect(() => {
    const conversationId = parseInt(id!);
    socket.emit('onConversation', { conversationId });
    socket.on('userJoin', () => {
      console.log('User joined');
    });
    socket.on('userLeave', () => {
      console.log('userLeave');
    });

    socket.on('onTypingStart', () => {
      console.log('onTypingStart: User has started typing...');
      setIsRecipientTyping(true);
    });

    socket.on('onTypingStop', () => {
      console.log('onTypingStop: User has stopped typing...');
      setIsRecipientTyping(false);
    });

    socket.on('onMessageUpdate', (message) => {
      dispatch(editMessage(message));
    })

    return () => {
      socket.emit('onConversationLeave', { conversationId });
      socket.off('userJoin');
      socket.off('userLeave');
      socket.off('onTypingStart');
      socket.off('onTypingStop');
      socket.off('onMessageUpdate');
    };
  }, []);


  const sendTypingStatus = () => {
    if(isTyping) {
      clearTimeout(timer!);
      setTimer(
        setTimeout(() => {
          setIsTyping(false);
          socket.emit('onTypingStop');
        }, 2000)
      );
    } else {
      setIsTyping(true);
      socket.emit('onTypingStart', { conversationId: parseInt(id!) });
    }
  };

  return (
    <ConversationChannelPageStyle>
      <MessagePanel
        sendTypingStatus={sendTypingStatus}
        isRecipientTyping={isRecipientTyping}
      ></MessagePanel>
    </ConversationChannelPageStyle>
  );
};