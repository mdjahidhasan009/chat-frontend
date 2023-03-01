import { ConversationType, CreateConversationParams } from "../utils/types";
import {createAsyncThunk, createSelector, createSlice} from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';
import { getConversations, postNewConversation } from "../utils/api";
import { RootState } from '.';
import conversations from "../__mocks__/conversations";

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

export const createConversationThunk = createAsyncThunk(
  'conversations/create',
  async (data: CreateConversationParams) => {
    return postNewConversation(data);
  }
);

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
      .addCase(createConversationThunk.fulfilled, (state, action) => {
        console.log('Fulfilled');
        console.log(action.payload.data);
        state.conversations.unshift(action.payload.data);
      });
  },
});

const selectConversations =(state: RootState) => state.conversation.conversations;
const selectConversationId = (state: RootState, id: number) => id;

export const selectConversationById = createSelector(
  [selectConversations, selectConversationId],
  (conversations, conversationId) =>
    conversations.find((c) => c.id === conversationId)
);

//Action creators are generated for each case reducer function
export const { addConversation, updateConversation } = conversationsSlice.actions;
export default conversationsSlice.reducer;