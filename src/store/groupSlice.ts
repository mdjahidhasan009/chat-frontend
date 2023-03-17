import {CreateGroupParams, Group, RemoveGroupRecipientParams} from "../utils/types";
import {createAsyncThunk, createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
  fetchGroups as fetchGroupsAPI,
  createGroup as createGroupAPI,
  removeGroupRecipient as removeGroupRecipientAPI,
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

export const removeGroupRecipientThunk = createAsyncThunk(
  'groups/recipients/delete',
  (params: RemoveGroupRecipientParams) => removeGroupRecipientAPI(params)
);

export const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    addGroup: (state, action: PayloadAction<Group>) => {
      state.groups.unshift(action.payload);
    },
    updateGroup: (state, action: PayloadAction<Group>) => {
      const updatedGroup = action.payload;
      const existingGroup = state.groups.find((g) => g.id === updatedGroup.id);
      const index = state.groups.findIndex((g) => g.id === updatedGroup.id);
      if (existingGroup) {
        state.groups[index] = updatedGroup;
      }
    },
    removeGroup: (state, action: PayloadAction<Group>) => {
      const group = state.groups.find((g) => g.id === action.payload.id);
      const index = state.groups.findIndex((g) => g.id === action.payload.id);
      if (!group) return;
      state.groups.splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupsThunk.fulfilled, (state, action) => {
        state.groups = action.payload.data;
      })
      .addCase(removeGroupRecipientThunk.fulfilled, (state, action) => {
        const { data: updatedGroup } = action.payload;
        const existingGroup = state.groups.find(
          (g) => g.id === updatedGroup.id
        );
        const index = state.groups.findIndex((g) => g.id === updatedGroup.id);
        if (existingGroup) {
          state.groups[index] = updatedGroup;
        }
      })
    ;
  },
});

const selectGroups = (state: RootState) => state.groups.groups;
const selectGroupId = (state: RootState, id: number) => id;

export const selectGroupById = createSelector(
  [selectGroups, selectGroupId],
  (groups, groupId) => groups.find((group) => group.id === groupId)
)

export const { addGroup, updateGroup, removeGroup } = groupSlice.actions;

export default groupSlice.reducer;