import { useState } from "react";
import { useGetShiftLogs } from "../queries/shift-queries";
import ShiftLogList from "./shift-log-list";

type EmployeeLogsModalProps = {
  employee: {
    _id: string;
    name: string;
  } | null;
  onClose: () => void;
};

export default function EmployeeLogsModal({
  employee,
  onClose,
}: EmployeeLogsModalProps) {
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");
  const [appliedStartDate, setAppliedStartDate] = useState<string>("");
  const [appliedEndDate, setAppliedEndDate] = useState<string>("");
  const { data: shiftLogs, isPending, isError } = useGetShiftLogs(
    employee?._id,
    appliedStartDate || undefined,
    appliedEndDate || undefined
  );

  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 border-b pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Shift Logs: <span className="text-indigo-600">{employee.name}</span>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 cursor-pointer hover:text-gray-600 p-1"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="filterStartDate" className="text-sm font-medium text-gray-700">From:</label>
              <input
                type="date"
                id="filterStartDate"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1.5 border"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="filterEndDate" className="text-sm font-medium text-gray-700">To:</label>
              <input
                type="date"
                id="filterEndDate"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                min={filterStartDate}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1.5 border"
              />
            </div>
            {(filterStartDate || filterEndDate) && (
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() => {
                    setAppliedStartDate(filterStartDate);
                    setAppliedEndDate(filterEndDate);
                  }}
                  className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
                >
                  Apply
                </button>
                <button
                  onClick={() => {
                    setFilterStartDate("");
                    setFilterEndDate("");
                    setAppliedStartDate("");
                    setAppliedEndDate("");
                  }}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  Clear Filter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 pr-1">
            <ShiftLogList 
                logs={shiftLogs?.data.logs} 
                summary={shiftLogs?.data.summary}
                isPending={isPending} 
                isError={isError} 
            />
        </div>

        {/* Actions */}
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className=" cursor-pointer rounded-lg px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
