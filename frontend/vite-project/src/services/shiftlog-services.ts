import http from "./http";

export interface Payload {
    date?: string; // Optional, defaults to now in backend
    shiftType: 'HOURLY' | 'REVENUE';
    startTime?: string;
    endTime?: string;
    breakDuration?: number;
    revenue?: number;
    ownPay?: number;
    notes?: string;
    file?: File | null;
}

export async function addShiftLog(payload: Payload) {
    const formData = new FormData();
    formData.append("date", payload.date || "");
    formData.append("shiftType", payload.shiftType);

    if (payload.startTime) formData.append("startTime", payload.startTime);
    if (payload.endTime) formData.append("endTime", payload.endTime);
    if (payload.breakDuration !== undefined) {
        formData.append("breakDuration", payload.breakDuration.toString());
    }
    if (payload.revenue !== undefined) {
        formData.append("revenue", payload.revenue.toString());
    }
    if (payload.notes) {
        formData.append("notes", payload.notes);
    }
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

export async function getShiftLogs(userId: string | undefined, startDate?: string, endDate?: string, cursor?: string, limit?: number) {
    let url = `/shift/reports?userId=${userId}`;
    if (startDate) {
        url += `&startDate=${startDate}`;
    }
    if (endDate) {
        url += `&endDate=${endDate}`;
    }
    if (cursor) {
        url += `&cursor=${cursor}`;
    }
    if (limit) {
        url += `&limit=${limit}`;
    }
    const response = await http.get(url);
    return response.data;
}