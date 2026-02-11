import { useMutation } from "@tanstack/react-query";
import {addEmployee} from '../services/employee.services'

export function useAddEmployee () {
    /* const queryClient = useQueryClient(); */
    return useMutation({
        mutationFn:addEmployee,
        onSuccess: () => {
            console.log("temporary until adding list query")
        }
    })
}