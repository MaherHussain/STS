import http from "./http";

export interface Payload {
    date?: string; // Optional, defaults to now in backend
    startTime: string;
    endTime: string;
    breakDuration: number ;
    ownPay?: number;
    file?: File | null;
    
}

export async function addShiftLog(payload: Payload) {
    const formData = new FormData();
    formData.append("date", payload.date || "");
    formData.append("startTime", payload.startTime);
    formData.append("endTime", payload.endTime);
    formData.append("breakDuration", payload.breakDuration.toString());
    if (payload.ownPay) {
        formData.append("ownPay", payload.ownPay.toString());
    }
    if (payload.file) {
        formData.append("image", payload.file);
    }

    const response = await http.post("/shift", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}