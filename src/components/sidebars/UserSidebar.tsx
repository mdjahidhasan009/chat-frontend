import { UserSidebarFooter, UserSidebarHeader, UserSidebarScrollableContainer } from '../../utils/styles';
import avatar from '../../__assets__/avatar_1.png';
import styles from './index.module.scss';
import {ArrowCycle, ChatDots, Person,} from 'akar-icons';
import {CreateConversationModal} from "../modals/CreateConversationModal";
import {FC, useContext, useState} from "react";
import { UserSidebarItemStyle, UserSidebarStyle } from '../../utils/styles';
import { UserSidebarItemType, UserSidebarRouteType } from '../../utils/types';
import { useLocation, useNavigate } from 'react-router-dom';
import { CDN_URL, userSidebarItems } from '../../utils/constants';
import { UserSidebarItem } from './items/UserSidebarItem';
import { AuthContext } from '../../utils/context/AuthContext';
import { UpdatePresenceStatusModal } from '../modals/UpdatePresenceStatusModal';
import { RiLogoutCircleLine } from 'react-icons/ri';
import { UserAvatar } from '../users/UserAvatar';
import { logoutUser as logoutUserAPI } from '../../utils/api';

export const UserSidebar = () => {
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutUser = () => {
    logoutUserAPI().finally(() => navigate('/login', { replace: true }));
  };

  return (
    <>
      {showModal && <UpdatePresenceStatusModal setShowModal={setShowModal} />}
      <UserSidebarStyle>
      <UserSidebarHeader>
          <UserAvatar user={user!} onClick={() => setShowModal(true)} />
        </UserSidebarHeader>
        <UserSidebarScrollableContainer>
          {userSidebarItems.map((item) => (
            <UserSidebarItem item={item} />
          ))}
        </UserSidebarScrollableContainer>

        <UserSidebarFooter>
        <RiLogoutCircleLine size={30} onClick={() => logoutUser()} />
        </UserSidebarFooter>
      </UserSidebarStyle>
    </>
  )
}