import React, { FC, PropsWithChildren, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { AuthenticatedRoute } from './components/AuthenticatedRoute';
import { ConversationChannelPage } from './pages/ConversationChannelPage';
import { ConversationPage } from './pages/ConversationPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AuthContext } from './utils/context/AuthContext';
import { socket, SocketContext } from './utils/context/SocketContext';
import { User } from './utils/types';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';
import { enableMapSet } from 'immer';

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
        <Route
          path="conversations"
          element={
            <AuthenticatedRoute>
              <ConversationPage />
            </AuthenticatedRoute>
          }
        >
          <Route path=":id" element={<ConversationChannelPage />} />
        </Route>
        <Route
          path='groups'
          element={
            <AuthenticatedRoute>
              <ConversationPage />
            </AuthenticatedRoute>
          }
        >
          <Route path=":id" element={<ConversationChannelPage />} />
        </Route>
      </Routes>
    </AppWithProviders>
  );
}

export default App;