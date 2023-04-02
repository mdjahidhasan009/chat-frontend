import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchFriends as fetchFriendsAPI,
  fetchFriendRequests as fetchFriendRequestsAPI,
  createFriendRequest as createFriendRequestAPI,
  cancelFriendRequest as cancelFriendRequestAPI,
  acceptFriendRequest as acceptFriendRequestAPI,
  rejectFriendRequest as rejectFriendRequestAPI,
  removeFriend as removeFriendAPI,
 } from '../../utils/api';

export const fetchFriendsThunk = createAsyncThunk('friends/fetch', () =>
  fetchFriendsAPI()
);

export const fetchFriendRequestThunk = createAsyncThunk(
  'friends/requests/fetch',
  () => fetchFriendRequestsAPI()
);

export const createFriendRequestThunk = createAsyncThunk(
  'friends/requests/create',
  (email: string) => createFriendRequestAPI(email)
);

export const cancelFriendRequestThunk = createAsyncThunk(
  'friends/request/cancel',
  (id: number) => cancelFriendRequestAPI(id)
);

export const acceptFriendRequestThunk = createAsyncThunk(
  'friends/request/accept',
  (id: number) => acceptFriendRequestAPI(id)
);

export const rejectFriendRequestThunk = createAsyncThunk(
  'friends/request/reject',
  (id: number) => rejectFriendRequestAPI(id)
);

export const removeFriendThunk = createAsyncThunk(
  'friends/remove',
  (id: number) => removeFriendAPI(id)
);
