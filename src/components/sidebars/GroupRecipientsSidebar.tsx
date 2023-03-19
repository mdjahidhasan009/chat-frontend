import {
  GroupRecipientSidebarItem,
  GroupRecipientSidebarItemContainer,
  GroupRecipientsSidebarHeader,
  GroupRecipientsSidebarStyle,
  MessageItemAvatar,
} from '../../utils/styles';
import { Crown, PeopleGroup } from 'akar-icons';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store';
import { selectGroupById } from '../../store/groupsSlice';
import { useParams } from 'react-router-dom';
import React, {useContext, useEffect, useState} from "react";
import {User} from "../../utils/types";
import {SocketContext} from "../../utils/context/SocketContext";
import {setContextMenuLocation, setSelectedUser, toggleContextMenu} from "../../store/groupRecipientsSidebarSlice";
import {SelectedParticipantContextMenu} from "../context-menus/SelectedParticipantContextMenu";

export const GroupRecipientsSidebar = () => {
  const { id: groupId } = useParams();

  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const socket = useContext(SocketContext);

  const group = useSelector((state: RootState) =>
    selectGroupById(state, parseInt(groupId!))
  );

  const groupSidebarState = useSelector(
    (state: RootState) => state.groupSidebar
  );

  useEffect(() => {
    const handleClick = () => dispatch(toggleContextMenu(false));
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [groupId]);

  useEffect(() => {
    socket.emit('getOnlineGroupUsers', { groupId });
    const interval = setInterval(() => {
      socket.emit('getOnlineGroupUsers', { groupId });
    }, 5000);
    socket.on('onlineGroupUsersReceived', (payload) => {
      setOnlineUsers(payload.onlineUsers);
    });
    return () => {
      clearInterval(interval);
      socket.off('onlineGroupUsersReceived');
    };
  }, [groupId, groupId]);

  useEffect(() => {
    const handleResize = (e: UIEvent) => dispatch(toggleContextMenu(false));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onUserContextMenu = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    user: User
  ) => {
    e.preventDefault();
    dispatch(toggleContextMenu(true));
    dispatch(setContextMenuLocation({ x: e.pageX, y: e.pageY }));
    dispatch(setSelectedUser(user));
  };

  return (
    <GroupRecipientsSidebarStyle>
      <GroupRecipientsSidebarHeader>
        <span>Participants</span>
        {/*<PeopleGroup />*/}
      </GroupRecipientsSidebarHeader>
      <GroupRecipientSidebarItemContainer>
        <span>Online Users</span>
        {onlineUsers.map((user) => (
          <GroupRecipientSidebarItem
            onContextMenu={(e) => onUserContextMenu(e, user)}
          >
            <div className='left'>
              <MessageItemAvatar />
              <span>{user.firstName}</span>
            </div>
            {user.id === group?.owner.id && <Crown size={20} color='#fff' />}
          </GroupRecipientSidebarItem>
        ))}
        <span>Offline Users</span>
        {group?.users
          .filter(
            (user) =>
              !onlineUsers.find((onlineUser) => onlineUser.id === user.id)
          )
          .map((user) => (
            <GroupRecipientSidebarItem
              onContextMenu={(e) => onUserContextMenu(e, user)}
            >
              <div className='left'>
                <MessageItemAvatar />
                <span>{user.firstName}</span>
              </div>
              {user.id === group?.owner.id && (<Crown color='#ffbf00' />)}
            </GroupRecipientSidebarItem>
          ))}
        {groupSidebarState.showUserContextMenu && (
          <SelectedParticipantContextMenu points={groupSidebarState.points} />
        )}
      </GroupRecipientSidebarItemContainer>
    </GroupRecipientsSidebarStyle>
  );
};