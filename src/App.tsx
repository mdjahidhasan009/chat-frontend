import React, { FC, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { AuthenticatedRoute } from './components/AuthenticatedRoute';
import { ConversationChannelPage } from './pages/conversations/ConversationChannelPage';
import { ConversationPage } from './pages/conversations/ConversationPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AuthContext } from './utils/context/AuthContext';
import { socket, SocketContext } from './utils/context/SocketContext';
import { FriendRequest, User } from './utils/types';
import { Provider as ReduxProvider, useDispatch } from 'react-redux';
import { AppDispatch, store } from './store';
import { enableMapSet } from 'immer';
import {GroupPage} from "./pages/group/GroupPage";
import {GroupChannelPage} from "./pages/group/GroupChannelPage";
import {AppPage} from "./pages/AppPage";
import {ConversationPageGuard} from "./guards/ConversationPageGuard";
import {GroupPageGuard} from "./guards/GroupPageGuard";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { FriendsPage } from './pages/friends/FriendsPage';
import { FriendsLayoutPage } from './pages/friends/FriendsLayoutPage';
import { FriendRequestPage } from './pages/friends/FriendRequestPage';
import { addFriendRequest } from './store/friends/friendsSlice';

enableMapSet();

type Props = {
  user?: User;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  socket: Socket;
};

function AppWithProviders({ children, user, setUser }: PropsWithChildren & Props) {
  return (
    <ReduxProvider store={store}>
      <AuthContext.Provider value={{ user, updateAuthUser: setUser }}>
        <SocketContext.Provider value={socket}>
          {children}
        </SocketContext.Provider>
      </AuthContext.Provider>
    </ReduxProvider>
  );
}

function App() {
  const [user, setUser] = useState<User>();

  return (
    <AppWithProviders user={user} setUser={setUser} socket={socket}>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AuthenticatedRoute children={<AppPage />} />}>
          <Route path="conversations" element={<ConversationPage /> }>
            <Route path=":id" element={<ConversationPageGuard children={<ConversationChannelPage />} />} />
          </Route>
          <Route path="groups" element={<GroupPage />}>
            <Route path=":id" element={<GroupPageGuard children={<GroupChannelPage />} />} />
          </Route>
          <Route path="friends" element={<FriendsLayoutPage />}>
            <Route path="requests" element={<FriendRequestPage/>} />
            <Route path="blocked" element={<div>Blocked</div>} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer theme="dark" />
    </AppWithProviders>
  );
}

export default App;