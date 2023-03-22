import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchFriends as fetchFriendsAPI,
  fetchFriendRequests as fetchFriendRequestsAPI,
  createFriendRequest as createFriendRequestAPI,
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