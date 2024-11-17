import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { friendsNavbarItems } from '../../utils/constants';
import {
  FriendsNavbar,
  FriendsNavbarItem,
  FriendsPageStyle,
} from '../../utils/styles/friends';
import { FriendsPage } from './FriendsPage';
import { Button } from '../../utils/styles/button';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { FriendPageNavbar } from '../../components/navbar/FriendsPageNavbar';

export const FriendsLayoutPage = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <FriendsPageStyle>
    <FriendPageNavbar />
    {pathname === '/friends' && <FriendsPage />}
    <Outlet />
  </FriendsPageStyle>
  );
};