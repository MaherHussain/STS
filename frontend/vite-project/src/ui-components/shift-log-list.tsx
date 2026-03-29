import { LoadingSpinner } from "./index";

export type ShiftLog = {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  breakDuration: number;
  ownPay?: number;
  imageUrl?: string;
  createdAt: string;
};

export type ShiftLogSummary = {
  totalHours: number;
  totalOwnPay: number;
  count: number;
};

type ShiftLogListProps = {
  logs: ShiftLog[] | undefined;
  summary?: ShiftLogSummary;
  isPending: boolean;
  isError: boolean;
};

export default function ShiftLogList({
  logs,
  summary,
  isPending,
  isError,
}: ShiftLogListProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {isPending && (
        <div className="text-center py-10">
          <LoadingSpinner size={30} />
        </div>
      )}
      {!isPending && !logs?.length && (
        <div className="text-center py-10 text-gray-500">
          No logs found for this employee.
        </div>
      )}
      {isError && (
        <div className="text-center py-10 text-red-600">
          Failed to load shift logs.
        </div>
      )}
      {!isPending && logs && logs.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Start Time</th>
                <th className="px-4 py-3 font-medium">End Time</th>
                <th className="px-4 py-3 font-medium">Break</th>
                <th className="px-4 py-3 font-medium">Own Pay</th>
                <th className="px-4 py-3 font-medium">Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log: ShiftLog) => (
                <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-900">
                    {new Date(log.date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{log.startTime}</td>
                  <td className="px-4 py-3 text-gray-600">{log.endTime}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {log.breakDuration} mins
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {log.ownPay} 
                  </td>
                  <td className="px-4 py-3">
                    {log.imageUrl ? (
                      <img
                        src={log.imageUrl}
                        alt="Proof"
                        className="w-16 h-16 object-cover rounded shadow-sm border border-gray-200"
                        onError={(e) => {
                          // Fallback for old local files if they still exist in the database
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes("/uploads/")) {
                            const fileName = log.imageUrl?.split(/[\\/]/).pop();
                            target.src = `/uploads/${fileName}`;
                          }
                        }}
                      />) : (
                      <span className="text-gray-400">No proof</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            {summary && logs && logs.length > 0 && (
              <tfoot className="bg-gray-50 font-semibold text-gray-900 border-t-2 border-gray-200">
                <tr>
                  <td className="px-4 py-3" colSpan={3}>Total worked hours</td>
                  
                  <td className="px-4 py-3 text-indigo-600">{summary.totalHours} hrs</td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                </tr>
                <tr>
                  <td className="px-4 py-3" colSpan={3}>Total own pay</td>
                  <td className="px-4 py-3 text-indigo-600">{summary.totalOwnPay}</td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}
    </div>
  );
}
