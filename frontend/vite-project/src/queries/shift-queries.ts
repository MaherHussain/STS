import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type Payload, addShiftLog, getShiftLogs } from "../services/shiftlog-services";

export function useAddShiftLog(userId: string | undefined) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: Payload) => addShiftLog(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shift-logs", userId] });
        },
    });
}

export function useGetShiftLogs(userId: string | undefined) {
    return useQuery({
        queryKey: ["shift-logs", userId],
        queryFn: () => getShiftLogs(userId),
        retry: 2,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });
}