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
  const { data: shiftLogs, isPending, isError } = useGetShiftLogs(employee?._id);

  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b pb-3">
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
