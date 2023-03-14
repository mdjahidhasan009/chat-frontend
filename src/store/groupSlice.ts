import {CreateGroupParams, Group} from "../utils/types";
import {createAsyncThunk, createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
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
  (params: CreateGroupParams) => createGroupAPI(params)
);

export const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    addGroup: (state, action: PayloadAction<Group>) => {
      state.groups.unshift(action.payload);
    },
  },
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

export const { addGroup } = groupSlice.actions;

export default groupSlice.reducer;