import {
  GroupRecipientSidebarItem,
  GroupRecipientSidebarItemContainer,
  GroupRecipientsSidebarHeader,
  GroupRecipientsSidebarStyle,
  MessageItemAvatar,
} from '../../utils/styles';
import { PeopleGroup } from 'akar-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { selectGroupById } from '../../store/groupSlice';
import { useParams } from 'react-router-dom';
import {useContext, useEffect, useState} from "react";
import {User} from "../../utils/types";
import {SocketContext} from "../../utils/context/SocketContext";

export const GroupRecipientsSidebar = () => {
  const { id: groupId } = useParams();
  const group = useSelector((state: RootState) =>
    selectGroupById(state, parseInt(groupId!))
  );

  const socket = useContext(SocketContext);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [offlineUsers, setOfflineUsers] = useState<User[]>([]);

  useEffect(() => {
    socket.emit('getOnlineGroupUsers', { groupId });
    const interval = setInterval(() => {
      socket.emit('getOnlineGroupUsers', { groupId });
    }, 10000);
    socket.on('onlineGroupUsersReceived', (payload) => {
      setOnlineUsers(payload.onlineUsers);
      setOfflineUsers(payload.offlineUsers);
    });
    return () => {
      clearInterval(interval);
      socket.off('onlineGroupUsersReceived');
    };
  }, [groupId]);

  return (
    <GroupRecipientsSidebarStyle>
      <GroupRecipientsSidebarHeader>
        <span>Participants</span>
        <PeopleGroup />
      </GroupRecipientsSidebarHeader>
      <GroupRecipientSidebarItemContainer>
        <span>Online Users</span>
        {onlineUsers.map((user) => (
          <GroupRecipientSidebarItem>
            <MessageItemAvatar />
            <span>{user.firstName}</span>
          </GroupRecipientSidebarItem>
        ))}
        <span>Offline Users</span>
        {offlineUsers.map((user) => (
          <GroupRecipientSidebarItem>
            <MessageItemAvatar />
            <span>{user.firstName}</span>
          </GroupRecipientSidebarItem>
        ))}
      </GroupRecipientSidebarItemContainer>
    </GroupRecipientsSidebarStyle>
  );
};