import { createContext } from "react";
import { type User } from "../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  refetchUser: () => void;
}

export const authContext = createContext<AuthContextType | null>(null);