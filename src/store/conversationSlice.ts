import { ConversationType } from "../utils/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';
import { getConversations } from "../utils/api";

export interface ConversationsState {
  conversations: ConversationType[];
  loading: boolean;
}

const initialState: ConversationsState = {
  conversations: [],
  loading: false,
};

export const fetchConversationsThunk = createAsyncThunk(
  'conversations/fetch',
  async () => {
    return getConversations();
  }
)

export const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    addConversation: (state, action: PayloadAction<ConversationType>) => {
      console.log('addConversation');
      // state.conversations.push(action.payload);
    },
    updateConversation: (state, action: PayloadAction<ConversationType>) => {
      const conversation = action.payload;
      const index = state.conversations.findIndex(
        (c) => c.id === conversation.id
      );
      state.conversations.splice(index, 1);
      state.conversations.unshift(conversation);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversationsThunk.fulfilled, (state, action) => {
        state.conversations = action.payload.data;
        state.loading = false;
      })
  },
});

//Action creators are generated for each case reducer function
export const { addConversation, updateConversation } = conversationsSlice.actions;
export default conversationsSlice.reducer;