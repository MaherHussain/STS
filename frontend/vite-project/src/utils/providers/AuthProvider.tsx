import  { type ReactNode } from "react";
import { useGetUser } from "../../queries/auth-queries";
import { authContext } from "../contexts/AuthContext";
import { type User } from "../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  refetchUser: () => void;
}


export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading, isError, refetch } = useGetUser();

  const value: AuthContextType = {
    user: user ?? null,
    isAuthenticated: !!user && !isError,
    loading: isLoading,
    refetchUser: refetch,
  };
  return <authContext.Provider value={value}>{children}</authContext.Provider>
}


