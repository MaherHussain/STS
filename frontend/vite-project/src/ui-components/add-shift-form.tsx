import React, { useState } from "react";
import { useAddShiftLog } from "../queries/shift-queries";
import { type ApiError } from "../utils/types";
import { useAuth } from "../utils/hooks/useAuth";

type AddShiftLogModalProps = {
  open: boolean;
  onClose: () => void;
};

import { toast } from "react-hot-toast";

export default function AddShiftLogModal({
  open,
  onClose,
}: AddShiftLogModalProps) {

  const { user } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [breakDuration, setBreakDuration] = useState<number>(0);
  const [revenue, setRevenue] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState("");

  const [ownPay, setOwnPay] = useState<number | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const applyTemplate = () => {
    if (user?.shiftTemplate) {
      setStartTime(user.shiftTemplate.startTime);
      setEndTime(user.shiftTemplate.endTime);
      setBreakDuration(user.shiftTemplate.breakDuration);
      toast.success("Template applied!");
    } else {
      toast.error("No template found. Set one in Settings first.");
    }
  };

  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const galleryInputRef = React.useRef<HTMLInputElement>(null);

  const { mutate: addShiftLog, isPending } = useAddShiftLog(user?.id);

  if (!open) return null;

  const isHourly = user?.payType === 'HOURLY';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
        date: date || undefined,
      shiftType: user?.payType || 'HOURLY',
      startTime: isHourly ? startTime : undefined,
      endTime: isHourly ? endTime : undefined,
      breakDuration: isHourly ? breakDuration : undefined,
      revenue: !isHourly ? revenue : undefined,
      notes: notes || undefined,
        ownPay,
        file
    };

    addShiftLog(payload, {
      onSuccess: () => {
        toast.success("Shift log added successfully!");
        setError("");
        // Reset form
        setDate(new Date().toISOString().split("T")[0]);
        setStartTime("");
        setEndTime("");
        setBreakDuration(0);
        setRevenue(undefined);
        setNotes("");
        setOwnPay(undefined);
        setFile(null);
        onClose();
      },
      onError: (error: ApiError) => {
        const message =
          error?.response?.data?.message || error?.message || "Submission failed";
        toast.error(message);
        setError(message);
      },
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white mx-2 p-6 shadow-lg overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Add Shift Log</h2>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {user?.shiftTemplate && (
            <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between border border-blue-100">
              <span className="text-sm font-medium text-blue-700">Apply saved template?</span>
              <button
                type="button"
                onClick={applyTemplate}
                className="text-xs bg-white text-blue-600 px-3 py-1.5 rounded-md border border-blue-200 hover:bg-blue-600 hover:text-white transition-all font-semibold"
              >
                Apply Template
              </button>
            </div>
          )}
            
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={date}
              readOnly
              disabled
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {user?.payType === 'HOURLY' ? (
            <>
              <div className="flex flex-row gap-4">
                <div className="flex-1/2">
                  <label className="mb-1  block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required={isHourly}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex-1/2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required={isHourly}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Break Duration (minutes)
                </label>
                <input
                  type="number"
                  value={breakDuration}
                  onChange={(e) => setBreakDuration(Number(e.target.value))}
                  min={0}
                  required={isHourly}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Total Revenue
                </label>
                <input
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                  required={!isHourly}
                  min={0}
                  placeholder="e.g. 500"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any details about this shift..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              rows={2}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Own Pay (optional)
            </label>
            <input
              type="number"
              value={ownPay}
              onChange={(e) => setOwnPay(Number(e.target.value))}
              placeholder="Extra expenses or adjustments"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Proof Image (optional)
            </label>
            <div className="flex gap-2 items-center">
                 <button type="button" onClick={() => cameraInputRef.current?.click()} className="cursor-pointer rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 flex items-center gap-2">
                    <span>📷 Take Photo</span>
                </button>
                    <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    />
                
                 <button type="button" onClick={() => galleryInputRef.current?.click()} className="cursor-pointer rounded-lg bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <span>select image</span>
                </button>
                    <input
                        ref={galleryInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    />
                
            </div>
             {file && <div className="mt-2 text-sm text-gray-600">Selected: {file.name}</div>}
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              disabled={isPending}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg cursor-pointer bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {isPending ? "Submitting..." : "Add Shift"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
