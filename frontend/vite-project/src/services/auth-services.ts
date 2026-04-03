import http from "./http";
import { type AuthResponse, type User } from "../utils/types";

export interface LoginResponse extends AuthResponse {
    message: string,
}

interface Payload {
    email: string,
    password: string
}

export async function getUser (): Promise<User> {
    const response = await http.get<AuthResponse>("/auth/profile");
    if (!response.data?.data) {
        throw new Error("Unauthenticated");
    }
    return response.data.data;
};

export async function login(payload: Payload): Promise<LoginResponse>{
    const response = await http.post('/auth/login', payload)

    // Store token locally for mobile browser support (cookie fallback)
    if (response.data?.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
    }

    return response.data
}

export async function logout() {
    const response = await http.post('/auth/logout')
    localStorage.removeItem("accessToken");
    return response.data
}