import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { SidebarContainerStyle } from '../../utils/styles';
import avatar from '../../__assets__/avatar_1.png';
import { ConversationSidebarItem } from '../conversations/ConversationSidebarItem';
import { ConversationTab } from '../conversations/ConversationTab';
import { GroupSidebarItem } from '../groups/GroupSidebarItem';
import {
  ConversationSearchbar,
  ConversationSidebarHeader,
  ConversationSidebarStyle,
  ConversationsScrollableContainer
} from "../../utils/styles/sidebars";

export const ConversationSidebar = () => {
  const conversations = useSelector(
    (state: RootState) => state.conversation.conversations
  );
  const groups = useSelector((state: RootState) => state.groups.groups);
  const selectedConversationType = useSelector(
    (state: RootState) => state.selectedConversationType.type
  );
  return (
    <ConversationSidebarStyle>
      <ConversationSidebarHeader>
        <ConversationSearchbar placeholder="Search for Conversations..." />
      </ConversationSidebarHeader>
      <ConversationTab />
      <ConversationsScrollableContainer>
        <SidebarContainerStyle>
          {selectedConversationType === 'private'
            ? conversations.map((conversation) => (
              <ConversationSidebarItem
                key={conversation.id}
                conversation={conversation}
              />
            ))
            : groups.map((group) => (
              <GroupSidebarItem key={group.id} group={group} />
            ))}
        </SidebarContainerStyle>
      </ConversationsScrollableContainer>
      <footer></footer>
    </ConversationSidebarStyle>
  );
};