import { Group } from "../utils/types";
import {createAsyncThunk, createSelector, createSlice} from "@reduxjs/toolkit";
import {
  fetchGroups as fetchGroupsAPI,
  createGroup as createGroupAPI,
} from '../utils/api';
import {RootState} from "./index";

export interface GroupState {
  groups: Group[];
}

const initialState: GroupState = {
  groups: [],
};

export const fetchGroupsThunk = createAsyncThunk('groups/fetch', () => {
  return fetchGroupsAPI();
});

export const createGroupThunk = createAsyncThunk(
  'groups/create',
  (users: string[]) => createGroupAPI(users)
);

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

const selectGroups = (state: RootState) => state.groups.groups;
const selectGroupId = (state: RootState, id: number) => id;

export const selectGroupById = createSelector(
  [selectGroups, selectGroupId],
  (groups, groupId) => groups.find((group) => group.id === groupId)
)

export const { } = groupSlice.actions;

export default groupSlice.reducer;