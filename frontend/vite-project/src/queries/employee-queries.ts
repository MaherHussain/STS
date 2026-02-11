import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addEmployee, getEmployees } from '../services/employee.services'

export function useGetEmployees() {
    return useQuery({
        queryKey: ['employees'],
        queryFn: getEmployees,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        throwOnError: false,  // Prevent uncaught errors
    })
}

export function useAddEmployee () {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:addEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        }
    })
}