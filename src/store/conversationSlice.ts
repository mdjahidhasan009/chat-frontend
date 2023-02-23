import { ConversationType } from "../utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ConversationsState {
  conversations: ConversationType[];
}

const initialState: ConversationsState = {
  conversations: [],
};

export const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    addConversation: (state, action: PayloadAction<ConversationType>) => {
      console.log('addConversation');
      state.conversations.push(action.payload);
    },
  },
});

//Action creators are generated for each case reducer function
export const { addConversation } = conversationsSlice.actions;
export default conversationsSlice.reducer;