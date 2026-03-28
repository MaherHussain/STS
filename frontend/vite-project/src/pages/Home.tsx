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
  const { data: shiftLogs, isPending, isError, fetchNextPage,
    hasNextPage,
    isFetchingNextPage } = useGetShiftLogs(
    user?.id,
    appliedStartDate || undefined,
    appliedEndDate || undefined
  );

  if (loading) return <div className="flex items-center justify-center h-screen"><LoadingSpinner size={100} /></div>
  
  const allLogs = shiftLogs?.pages.flatMap((page) => page.data.logs) || [];
  const summary = shiftLogs?.pages[0]?.data.summary;
  return (
    <div className="flex flex-col">
      <div className="py-3 self-end">
        <Button onClick={() => setIsAddShiftOpen(true)} label="Add Shift">
          <span className="text-lg">+</span>
        </Button>
      </div>

      <div className="flex-1 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Recent Shifts</h2>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label htmlFor="filterStartDate" className="text-sm font-medium text-gray-700 min-w-[45px]">From:</label>
              <input
                type="date"
                id="filterStartDate"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="flex-1 sm:flex-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1.5 border"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label htmlFor="filterEndDate" className="text-sm font-medium text-gray-700 min-w-[45px]">To:</label>
              <input
                type="date"
                id="filterEndDate"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                min={filterStartDate}
                className="flex-1 sm:flex-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1.5 border"
              />
            </div>
            {(filterStartDate || filterEndDate) && (
              <div className="flex items-center gap-2 ml-0 sm:ml-2">
                <button
                  onClick={() => {
                    setAppliedStartDate(filterStartDate);
                    setAppliedEndDate(filterEndDate);
                  }}
                  className="flex-1 sm:flex-none rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
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
                  className="flex-1 sm:flex-none text-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="overflow-y-auto flex-1 pr-1 max-h-[60vh]">
          <ShiftLogList
            logs={allLogs}
            summary={summary}
            isPending={isPending}
            isError={isError}
          />
          {hasNextPage && (
            <div className="mt-4 flex justify-center pb-2">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
              >
                {isFetchingNextPage ? "Loading more..." : "Load More"}
              </button>
            </div>
          )}
        </div>
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