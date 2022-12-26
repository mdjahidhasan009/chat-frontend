import { User } from "../types";
import { createContext } from "react";

type AuthContext = {
  user?: User;
  updateAuthUser: (data: User) => void;
}
export const AuthContext = createContext<AuthContext>({
  updateAuthUser: () => {},
});