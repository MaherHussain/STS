export interface User {
    id: string,
    email: string,
    role: 'ADMIN' | 'EMPLOYEE'
}

export interface AuthResponse {
    success: boolean,
    data: User
}
