import React from 'react';
import { Outlet, Route, Routes } from'react-router-dom';
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import {ConversationPage} from "./pages/ConversationPage";

function App() {
  return (
    <>
    <Routes>
      <Route path="/register" element={<RegisterPage />}></Route>
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/conversations" element={<ConversationPage />}>
        <Route path=":id" element={<div>Conversation ID Page</div>} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
