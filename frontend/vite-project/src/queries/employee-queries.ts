import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addEmployee, getEmployees } from '../services/employee.services'

export function useGetEmployees(adminId: string | undefined) {
    return useQuery({
        queryKey: ['employees', adminId],
        queryFn: getEmployees,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        throwOnError: false,  // Prevent uncaught errors
    })
}

export function useAddEmployee(adminId: string | undefined) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:addEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees', adminId] });
        }
    })
}