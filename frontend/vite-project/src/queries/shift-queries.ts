import { useMutation } from "@tanstack/react-query";
import { type Payload, addShiftLog  } from "../services/shiftlog-services";

export function useAddShiftLog() {
    return useMutation({
        mutationFn: (payload: Payload) => addShiftLog(payload),
        onSuccess: () => {
            console.log("Shift added successfully");
        },
    });
}