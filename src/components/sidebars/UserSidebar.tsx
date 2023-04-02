import { UserAvatar } from '../../utils/styles';
import avatar from '../../ __assets__/avatar_1.png';
import styles from './index.module.scss';
import {ArrowCycle, ChatDots, Person,} from 'akar-icons';
import {CreateConversationModal} from "../modals/CreateConversationModal";
import {FC, useState} from "react";
import { UserSidebarItemStyle, UserSidebarStyle } from '../../utils/styles';
import { UserSidebarItemType, UserSidebarRouteType } from '../../utils/types';
import { useLocation, useNavigate } from 'react-router-dom';
import { userSidebarItems } from '../../utils/constants';
import { UserSidebarItem } from './UserSidebarItem';

export const UserSidebar = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && <CreateConversationModal setShowModal={setShowModal} />}
      <UserSidebarStyle>
        <UserAvatar src={avatar} alt="avatar" width="55px" />
        <hr className={styles.hr} />
        {userSidebarItems.map((item) => (
          <UserSidebarItem item={item} />
        ))}
      </UserSidebarStyle>
    </>
  )
}