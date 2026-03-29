export interface User {
    id: string,
    email: string,
    role: 'ADMIN' | 'EMPLOYEE'
}
export interface Employee extends User {
    isActive: boolean;
    createdBy: string;
    name: string | null | undefined;
}
export interface EmployeeResponse {
    success: boolean,
    message: string,
    data: Employee
}
export interface EmployeesResponse {
    success: boolean
    data: {
        employees: {
            _id: string;
            name: string;
            email: string;
            createdAt: string;
        }[];
        pagination: {
            nextCursor: string | null;
            hasNextPage: boolean;
        }
    }
}
export interface AuthResponse {
    success: boolean,
    data: User
}
export interface ApiErrorResponse {
    success: boolean;
    message: string;
    statusCode?: number;
}

/**
 * Axios error structure with API response
 */
export interface ApiError {
    response?: {
        status: number;
        data: ApiErrorResponse;
    };
    message: string;
}