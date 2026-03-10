import { Activity, useState } from "react";
import { useAuth } from "../utils/hooks/useAuth"
import { LoadingSpinner, Button, AddShiftLogModal, ShiftLogList } from "../ui-components";
import { useGetShiftLogs } from "../queries/shift-queries";


function Home() {
  const { user, loading } = useAuth();
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);
  const { data: shiftLogs, isPending, isError } = useGetShiftLogs(user?.id);

  if(loading) return <LoadingSpinner size={100} />
  
  return (
    <div className="flex flex-col space-y-6">
      <div className="py-3 self-end">
        <Button onClick={() => setIsAddShiftOpen(true)} label="Add Shift">
          <span className="text-lg">+</span>
        </Button>
      </div>

      <div className="flex-1">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Recent Shifts</h2>
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