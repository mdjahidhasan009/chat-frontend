"use client";

import { io } from 'socket.io-client';
import { createContext } from "react";

export const socket = io(process.env.REACT_APP_WEBSOCKET_URL!, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});
export const SocketContext = createContext(socket);