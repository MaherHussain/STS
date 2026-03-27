import { useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
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

export function useGetShiftLogs(userId: string | undefined, startDate?: string, endDate?: string) {
    return useInfiniteQuery({
        queryKey: ["shift-logs", userId, startDate, endDate],
        queryFn: ({ pageParam }) => getShiftLogs(userId, startDate, endDate, pageParam as string | undefined, 10),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.data.pagination?.nextCursor,
        retry: 2,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        enabled: !!userId,
    });
}