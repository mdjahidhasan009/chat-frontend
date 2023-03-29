import { UpdateRateLimitPayload } from './../../utils/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RateLimitState {
  isGroupMessageRateLimited: boolean;
  isPrivateMessageRateLimited: boolean;
};

const initialState: RateLimitState = {
  isGroupMessageRateLimited: false,
  isPrivateMessageRateLimited: false,
};

export const RateLimitSlice = createSlice({
  name: 'rateLimit',
  initialState,
  reducers: {
    updateRateLimitStatus: (state, action: PayloadAction<UpdateRateLimitPayload>) => {
      switch(action.payload.type) {
        case 'group':
          state.isGroupMessageRateLimited = action.payload.status;
          return;
        case 'private':
          state.isPrivateMessageRateLimited = action.payload.status;
          return;
      }
    }
  }
});

export const { updateRateLimitStatus } = RateLimitSlice.actions;
export default RateLimitSlice.reducer;