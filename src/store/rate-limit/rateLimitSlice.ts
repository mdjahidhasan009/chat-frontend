import { UpdateRateLimitPayload } from './../../utils/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RateLimitState {
  groupRateLimited: boolean;
  privateRateLimited: boolean;
};

const initialState: RateLimitState = {
  groupRateLimited: false,
  privateRateLimited: false,
};

export const rateLimitSlice = createSlice({
  name: 'rateLimit',
  initialState,
  reducers: {
    setRateLimitStatus: (state, action: PayloadAction<UpdateRateLimitPayload>) => {
      switch(action.payload.type) {
        case 'group':
          state.groupRateLimited = action.payload.status;
          return;
        case 'private':
          state.privateRateLimited = action.payload.status;
          return;
      }
    }
  }
});

export const { setRateLimitStatus: updateRateLimitStatus } = rateLimitSlice.actions;
export default rateLimitSlice.reducer;