import {MessageType} from "../types";
import {createContext, Dispatch, SetStateAction} from "react";

type MessageMenuContextType = {
  message: MessageType | null;
  setMessage: Dispatch<SetStateAction<MessageType | null>>;
};

export const MessageMenuContext = createContext<MessageMenuContextType>({
  message: null,
  setMessage: () => {},
});