import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser ,login} from '../services/auth-services'

export function useGetUser () {
    return useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    })
}

export function useInvalidateUser() {
    const queryClient = useQueryClient();
    return () => {
        queryClient.invalidateQueries({ queryKey: ['user'] });
    };
} 

export function useLogin () {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: login,
        onSuccess: () => {
            // Invalidate and refetch user data after successful login
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    })
}