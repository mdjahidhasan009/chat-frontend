import {
    ConversationSidebarContainer,
    ConversationSidebarHeader,
    ConversationSidebarItemStyle,
    ConversationSidebarStyle,
} from '../../utils/styles';
import { TbEdit } from 'react-icons/tb';
import { FC, useContext, useState } from 'react';
import { Conversation } from '../../utils/types';
import styles from './index.module.scss';
import { useNavigate } from 'react-router-dom';
import { CreateConversationModal } from '../modals/CreateConversationModal';
import { AuthContext } from '../../utils/context/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { ConversationSelected } from './ConversationSelected';
import { ConversationSidebarItem } from './ConversationSidebarItem';
import { GroupSidebarItem } from '../groups/GroupSidebarItem';

export const ConversationSidebar: FC = () => {
  const [showModal, setShowModal] = useState(false);

  const conversations = useSelector(
    (state: RootState) => state.conversation.conversations
  );

  const groups = useSelector((state: RootState) => state.groups.groups);

  const selectedConversationType = useSelector(
    (state: RootState) => state.selectedConversationType.type
  );

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
            <ConversationSelected />
            <section>
              {selectedConversationType === 'private'
                ? conversations.map((conversation) => (
                  <ConversationSidebarItem
                    key={conversation.id}
                    conversation={conversation}
                  />
                  ))
                : groups.map((group) => (
                  <GroupSidebarItem key={group.id} group={group} />
                ))
              }
            </section>
          </ConversationSidebarContainer>
        </ConversationSidebarStyle>
    </>
  );
};