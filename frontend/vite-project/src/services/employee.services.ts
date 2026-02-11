import http from "./http";
import {type EmployeeResponse} from '../utils/types'

type Payload = {
    email:string,
    password:string,
    name:string
}

export async function addEmployee( payload : Payload): Promise<EmployeeResponse> {
    const response = http.post('/user/add', payload)
    return (await response).data
}