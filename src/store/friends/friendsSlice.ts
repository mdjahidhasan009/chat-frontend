import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { Friend, FriendRequest } from '../../utils/types';
import { fetchFriendRequestThunk, fetchFriendsThunk, createFriendRequestThunk } from './friendsThunk';

export interface FriendsState {
  friends: Friend[];
  friendRequests: FriendRequest[];
}

const initialState: FriendsState = {
  friends: [],
  friendRequests: [],
};

export const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    addFriendRequest: (state, action: PayloadAction<FriendRequest>) => {
      state.friendRequests.push(action.payload);
    },
  },
  extraReducers: (builder) =>
    builder
    .addCase(fetchFriendsThunk.fulfilled, (state, action) => {
      state.friends = action.payload.data;
    })
    .addCase(fetchFriendRequestThunk.fulfilled, (state, action) => {
      state.friendRequests = action.payload.data;
    })
    .addCase(createFriendRequestThunk.fulfilled, (state, action) => {
      state.friendRequests.push(action.payload.data);
    }),
});

export const { addFriendRequest } = friendsSlice.actions;

export default friendsSlice.reducer;