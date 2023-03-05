import { ConversationType } from "../utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SelectedTypeState {
  type: ConversationType;
}

const initialState: SelectedTypeState = {
  type: 'private',
};


export const selectedTypeSlice = createSlice({
  name: 'selectedType',
  initialState,
  reducers: {
    updateType: (state, action: PayloadAction<ConversationType>) => {
      state.type = action.payload;
    },
  },
});

export const { updateType } = selectedTypeSlice.actions;

export default selectedTypeSlice.reducer;