import { configureStore } from '@reduxjs/toolkit';
import conversationReducer from './conversationSlice';
import messageReducer from './messages/messageSlice';
import selectedTypeReducer from './selectedSlice';
import groupsReducer from './groupsSlice';
import groupMessagesReducer from './groupMessageSlice';
import groupContainerReducer from './messageContainerSlice';
import groupSidebarReducer from './groupRecipientsSidebarSlice';
import friendsReducer from './friends/friendsSlice';
import rateLimitReducer from './rate-limit/rateLimitSlice';
import messagePanelReducer from './message-panel/messagePanelSlice';
import systemMessageReducer from './system-messages/systemMessagesSlice';
import settingsReducer from './settings/settingsSlice';

export const store = configureStore({
  reducer: {
    conversation: conversationReducer,
    messages: messageReducer,
    selectedConversationType: selectedTypeReducer,
    groups: groupsReducer,
    groupMessages: groupMessagesReducer,
    messageContainer: groupContainerReducer,
    groupSidebar: groupSidebarReducer,
    friends: friendsReducer,
    rateLimit: rateLimitReducer,
    messagePanel: messagePanelReducer,
    systemMessages: systemMessageReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
    devTools: true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;