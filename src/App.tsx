import React from 'react';
import { Outlet, Route, Routes } from'react-router-dom';
import {RegisterPage} from "./pages/RegisterPage";

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<RegisterPage />}></Route>
      <Route
        path="conversations"
        element={
          <div>
            <div className="">Conversations</div>
            <Outlet />
          </div>
        }
      >
        <Route path=":id" element={<div>Conversation ID Page</div>} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
