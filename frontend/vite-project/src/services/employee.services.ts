import http from "./http";
import { type EmployeeResponse, type EmployeesResponse } from '../utils/types'

type Payload = {
    email:string,
    password:string,
    name:string
}

export async function getEmployees(): Promise<EmployeesResponse> {
    const response = await http.get('/user/users')
    return response.data
}

export async function addEmployee( payload : Payload): Promise<EmployeeResponse> {
    const response = await http.post('/user/add', payload)
    return response.data
}