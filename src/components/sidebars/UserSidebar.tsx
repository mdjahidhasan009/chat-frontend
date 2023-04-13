import { UserAvatar } from '../../utils/styles';
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

export const UserSidebar = () => {
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);

  return (
    <>
      {showModal && <UpdatePresenceStatusModal setShowModal={setShowModal} />}
      <UserSidebarStyle>
      <UserAvatar
          src={
            user?.profile?.avatar
              ? CDN_URL.BASE.concat(user?.profile.avatar)
              : avatar
          }
          alt="avatar"
          width="55px"
          onClick={() => setShowModal(true)}
        />
        <hr className={styles.hr} />
        {userSidebarItems.map((item) => (
          <UserSidebarItem item={item} />
        ))}
      </UserSidebarStyle>
    </>
  )
}