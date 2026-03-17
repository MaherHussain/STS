import { Activity, useState } from "react";
import { useAuth } from "../utils/hooks/useAuth"
import { LoadingSpinner, Button, AddShiftLogModal, ShiftLogList } from "../ui-components";
import { useGetShiftLogs } from "../queries/shift-queries";


function Home() {
  const { user, loading } = useAuth();
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");
  const [appliedStartDate, setAppliedStartDate] = useState<string>("");
  const [appliedEndDate, setAppliedEndDate] = useState<string>("");
  const { data: shiftLogs, isPending, isError } = useGetShiftLogs(
    user?.id,
    appliedStartDate || undefined,
    appliedEndDate || undefined
  );

  if(loading) return <LoadingSpinner size={100} />
  
  return (
    <div className="flex flex-col space-y-6">
      <div className="py-3 self-end">
        <Button onClick={() => setIsAddShiftOpen(true)} label="Add Shift">
          <span className="text-lg">+</span>
        </Button>
      </div>

      <div className="flex-1 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Recent Shifts</h2>

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
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
        <ShiftLogList
          logs={shiftLogs?.data.logs}
          summary={shiftLogs?.data.summary}
          isPending={isPending}
          isError={isError}
        />
      </div>
      
      <Activity mode={isAddShiftOpen ? "visible" : "hidden"}>
        <AddShiftLogModal
          open={isAddShiftOpen}
          onClose={() => setIsAddShiftOpen(false)}
        />
      </Activity>
    </div>
  )
}

export default Home