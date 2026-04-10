import { LoadingSpinner } from "./index";

export type ShiftLog = {
  _id: string;
  date: string;
  shiftType: "HOURLY" | "REVENUE";
  startTime?: string;
  endTime?: string;
  breakDuration?: number;
  revenue?: number;
  notes?: string;
  ownPay?: number;
  totalHours?: number;
  imageUrl?: string;
  createdAt: string;
};

export type ShiftLogSummary = {
  totalHours: number;
  totalRevenue?: number;
  totalOwnPay: number;
  count: number;
};

type ShiftLogListProps = {
  logs: ShiftLog[] | undefined;
  summary?: ShiftLogSummary;
  isPending: boolean;
  isError: boolean;
  payType?: "HOURLY" | "REVENUE";
};

export default function ShiftLogList({
  logs,
  summary,
  isPending,
  isError,
  payType,
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
                {payType === "HOURLY" ? (
                  <>
                    <th className="px-4 py-3 font-medium">Shift Time</th>
                    <th className="px-4 py-3 font-medium">Hours</th>
                  </>
                ) : (
                  <th className="px-4 py-3 font-medium">Revenue</th>
                )}
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

                  {payType === "HOURLY" ? (
                    <>
                      <td className="px-4 py-3 text-gray-600">
                        <div>
                          <div className="font-medium text-gray-900">{log.startTime} - {log.endTime}</div>
                          <div className="text-xs text-gray-500">Break: {log.breakDuration}m</div>
                        </div>
                        {log.notes && <div className="mt-1 text-xs italic text-gray-400 truncate max-w-[200px]">{log.notes}</div>}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {log.totalHours?.toFixed(2)} hrs
                      </td>
                    </>
                  ) : (
                    <td className="px-4 py-3 text-gray-600">
                        <div>
                          <div className="font-medium text-gray-900">{log.revenue?.toLocaleString()}</div>
                        </div>
                        {log.notes && <div className="mt-1 text-xs italic text-gray-400 truncate max-w-[200px]">{log.notes}</div>}
                      </td>
                  )}

                  <td className="px-4 py-3 text-gray-600">
                    {log.ownPay || 0}
                  </td>
                  <td className="px-4 py-3">
                    {log.imageUrl ? (
                      <a href={log.imageUrl} target="_blank" rel="noopener noreferrer">
                      <img
                        src={log.imageUrl}
                        alt="Proof"
                          className="w-12 h-12 object-cover rounded shadow-sm border border-gray-200"
                          onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes("/uploads/")) {
                            const fileName = log.imageUrl?.split(/[\\/]/).pop();
                            target.src = `/uploads/${fileName}`;
                          }
                        }}
                        />
                      </a>) : (
                        <span className="text-gray-400 text-xs">No proof</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            {summary && logs && logs.length > 0 && (
              <tfoot className="bg-gray-50 font-semibold text-gray-900 border-t-2 border-gray-200">
                {payType === "HOURLY" ? (
                  <tr>
                    <td className="px-4 py-3">Total</td>
                    <td className="px-4 py-3 text-indigo-600" colSpan={1}></td>
                    <td className="px-4 py-3 text-indigo-600">{summary.totalHours.toFixed(2)} hrs</td>
                    <td className="px-4 py-3 text-red-600">{summary.totalOwnPay || 0}</td>
                    <td className="px-4 py-3"></td>
                  </tr>
                ) : (
                    <tr>
                      <td className="px-4 py-3">Total</td>
                      <td className="px-4 py-3 text-green-600">{summary.totalRevenue?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-red-600">{summary.totalOwnPay || 0}</td>
                      <td className="px-4 py-3"></td>
                    </tr>
                )}
              </tfoot>
            )}
          </table>
        </div>
      )}
    </div>
  );
}
