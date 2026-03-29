import { useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { addEmployee, getEmployees } from '../services/employee.services'
import { type EmployeesResponse } from '../utils/types'

export function useGetEmployees(adminId: string | undefined, search?: string) {
    return useInfiniteQuery<EmployeesResponse>({
        queryKey: ['employees', adminId, search],
        queryFn: ({ pageParam }) => getEmployees(search, pageParam as string | undefined, 10),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.data.pagination?.nextCursor,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        throwOnError: false,  // Prevent uncaught errors
        enabled: !!adminId,
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