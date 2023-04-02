import { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FriendList } from '../../components/friends/FriendList';
import { AppDispatch } from '../../store';
import { fetchFriendsThunk } from '../../store/friends/friendsThunk';
import { SocketContext } from '../../utils/context/SocketContext';
import { Friend } from '../../utils/types';
import { setOfflineFriends, setOnlineFriends } from '../../store/friends/friendsSlice';

export const FriendsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const socket = useContext(SocketContext);

  useEffect(() => {
    dispatch(fetchFriendsThunk());
  }, [dispatch]);

  useEffect(() => {
    socket.emit('getOnlineFriends');
    const interval = setInterval(() => {
      socket.emit('getOnlineFriends');
    }, 10000);

    return () => {
      clearInterval(interval);
      socket.off('getOnlineFriends');
    };
  }, []);

  useEffect(() => {
    socket.on('getOnlineFriends', (friends: Friend[]) => {
      dispatch(setOnlineFriends(friends));
      dispatch(setOfflineFriends());
    });
  }, []);

  return <FriendList />;
};