import { useContext } from "react";
import { authContext } from "../contexts/AuthContext";

export function useAuth() {
    const ctx = useContext(authContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
