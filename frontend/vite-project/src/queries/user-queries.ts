import { type ApiError } from "../utils/types/";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateShiftTemplate } from "../services/employee.services";
import { toast } from "react-hot-toast";

export function useUpdateShiftTemplate() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (payload: { startTime: string; endTime: string; breakDuration: number }) => 
            updateShiftTemplate(payload),
        onSuccess: () => {
            toast.success("Shift template updated!");
            // Invalidate user profile to get fresh data
            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        },
        onError: (error: ApiError) => {
            const message = error?.response?.data?.message || error?.message || "Failed to update template";
            toast.error(message);
        }
    });
}
