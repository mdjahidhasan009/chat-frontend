import { Group } from "../utils/types";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { fetchGroups as fetchGroupsAPI } from '../utils/api';

export interface GroupState {
  groups: Group[];
}

const initialState: GroupState = {
  groups: [],
};

export const fetchGroupsThunk = createAsyncThunk('groups/fetch', () => {
  return fetchGroupsAPI();
});

export const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGroupsThunk.fulfilled, (state, action) => {
      state.groups = action.payload.data;
    });
  },
});

export const { } = groupSlice.actions;

export default groupSlice.reducer;