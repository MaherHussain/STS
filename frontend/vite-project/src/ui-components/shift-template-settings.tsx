import React, { useState } from "react";
import { useAuth } from "../utils/hooks/useAuth";
import { useUpdateShiftTemplate } from "../queries/user-queries";

type ShiftTemplateSettingsProps = {
    open: boolean;
    onClose: () => void;
};

export default function ShiftTemplateSettings({ open, onClose }: ShiftTemplateSettingsProps) {
    const { user, refetchUser } = useAuth();
    const { mutate: updateTemplate, isPending } = useUpdateShiftTemplate();

    const [startTime, setStartTime] = useState(user?.shiftTemplate?.startTime || "");
    const [endTime, setEndTime] = useState(user?.shiftTemplate?.endTime || "");
    const [breakDuration, setBreakDuration] = useState(user?.shiftTemplate?.breakDuration || 0);

    if (!open) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateTemplate({ startTime, endTime, breakDuration }, {
            onSuccess: () => {
                refetchUser();
                onClose();
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Shift Template Settings</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                
                <p className="mb-4 text-sm text-gray-500">
                    Set your default shift times here. These will be pre-filled every time you add a new shift log.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Start</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">End</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Default Break (mins)</label>
                        <input
                            type="number"
                            value={breakDuration}
                            onChange={(e) => setBreakDuration(Number(e.target.value))}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isPending ? "Saving..." : "Save Template"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
