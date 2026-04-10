import http from "./http";
import { type EmployeeResponse, type EmployeesResponse } from '../utils/types'

type Payload = {
    email: string,
    password: string,
    name: string,
    payType: 'HOURLY' | 'REVENUE'
}

export async function getEmployees(search?: string, cursor?: string, limit: number = 10): Promise<EmployeesResponse> {
    const response = await http.get('/user/users', { params: { search, cursor, limit } })
    return response.data
}

export async function addEmployee( payload : Payload): Promise<EmployeeResponse> {
    const response = await http.post('/user/add', payload)
    return response.data
}

export async function updateShiftTemplate(payload: { startTime: string; endTime: string; breakDuration: number }) {
    const response = await http.put('/user/template', payload);
    return response.data;
}