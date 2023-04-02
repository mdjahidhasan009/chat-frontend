import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { Friend, FriendRequest } from '../../utils/types';
import { fetchFriendRequestThunk, fetchFriendsThunk, createFriendRequestThunk, cancelFriendRequestThunk, acceptFriendRequestThunk, rejectFriendRequestThunk } from './friendsThunk';

export interface FriendsState {
  friends: Friend[];
  friendRequests: FriendRequest[];
  onlineFriends: Friend[];
  offlineFriends: Friend[];
}

const initialState: FriendsState = {
  friends: [],
  friendRequests: [],
  onlineFriends: [],
  offlineFriends: [],
};

export const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    addFriendRequest: (state, action: PayloadAction<FriendRequest>) => {
      state.friendRequests.push(action.payload);
    },
    removeFriendRequest: (state, action: PayloadAction<FriendRequest>) => {
      const { id } = action.payload;
      state.friendRequests = state.friendRequests.filter(
        (friendRequest) => friendRequest.id !== id
      );
    },
    setOnlineFriends: (state, action: PayloadAction<Friend[]>) => {
      state.onlineFriends = action.payload;      
    },
    setOfflineFriends: (state) => {
      state.offlineFriends = state.friends.filter((friend) => 
        !state.onlineFriends.find(
          (onlineFriend) => onlineFriend.id === friend.id
        )
      );
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
    })
    .addCase(cancelFriendRequestThunk.fulfilled, (state, action) => {
      const { id } = action.payload.data;
      state.friendRequests = state.friendRequests.filter(
        (friendRequest) => friendRequest.id !== id
      );
    })
    .addCase(acceptFriendRequestThunk.fulfilled, (state, action) => {
      const { friend, friendRequest: { id } } = action.payload.data;
      state.friendRequests = state.friendRequests.filter(
        (friendRequest) => friendRequest.id !== id
      );
    })
    .addCase(rejectFriendRequestThunk.fulfilled, (state, action) => {
      const { id } = action.payload.data;
      state.friendRequests = state.friendRequests.filter(
        friendRequest => friendRequest.id !== id
      );
    })
});

export const { 
  addFriendRequest, 
  removeFriendRequest,
  setOnlineFriends,
  setOfflineFriends, 
} = friendsSlice.actions;

export default friendsSlice.reducer;