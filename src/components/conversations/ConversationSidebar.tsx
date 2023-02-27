import {
    ConversationSidebarContainer,
    ConversationSidebarHeader,
    ConversationSidebarItem,
    ConversationSidebarStyle,
} from '../../utils/styles';
import { TbEdit } from 'react-icons/tb';
import { FC, useContext, useState } from 'react';
import { ConversationType } from '../../utils/types';
import styles from './index.module.scss';
import { useNavigate } from 'react-router-dom';
import { CreateConversationModal } from '../modals/CreateConversationModal';
import { AuthContext } from '../../utils/context/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';

type Props = {
    conversations: ConversationType[];
};

export const ConversationSidebar: FC<Props> = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const conversations = useSelector(
    (state: RootState) => state.conversation.conversations
  );

  const getDisplayUser = (conversation: ConversationType) => {
    return conversation.creator.id === user?.id
      ? conversation.recipient
      : conversation.creator;
  };
  return (
    <>
      {showModal && <CreateConversationModal setShowModal={setShowModal} />}
        <ConversationSidebarStyle>
          <ConversationSidebarHeader>
            <h1>Conversations</h1>
            <div onClick={() => setShowModal(!showModal)}>
                <TbEdit size={40} />
            </div>
          </ConversationSidebarHeader>
          <ConversationSidebarContainer>
            {/*{Array.from(conversation, ([ _, conversation]) => conversation).map(*/}
            {/*  (conversation) => (*/}
            {/*    <ConversationSidebarItem*/}
            {/*      key={conversation.id}*/}
            {/*      onClick={() => navigate(`/conversations/${conversation.id}`)}*/}
            {/*    >*/}
            {/*      <div className={styles.conversationAvatar}></div>*/}
            {/*      <div>*/}
            {/*      <span className={styles.conversationName}>*/}
            {/*        {`${getDisplayUser(conversation).firstName} ${getDisplayUser(conversation).lastName}`}*/}
            {/*      </span>*/}
            {/*        <span className={styles.conversationLastMessage}>Sample Text</span>*/}
            {/*      </div>*/}
            {/*    </ConversationSidebarItem>*/}
            {/*  )*/}
            {/*)}*/}
            {conversations.map((conversation) => (
                <ConversationSidebarItem
                  key={conversation.id}
                  onClick={() => navigate(`/conversations/${conversation.id}`)}
                >
                  <div className={styles.conversationAvatar}></div>
                  <div>
                  <span className={styles.conversationName}>
                    {`${getDisplayUser(conversation).firstName} ${getDisplayUser(conversation).lastName}`}
                  </span>
                    <span className={styles.conversationLastMessage}>
                      {conversation.lastMessageSent?.content}
                    </span>
                  </div>
                </ConversationSidebarItem>
              )
            )}
          </ConversationSidebarContainer>
        </ConversationSidebarStyle>
    </>
  );
};