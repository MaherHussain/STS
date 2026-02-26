import { useState } from "react";
import { useAuth } from "../utils/hooks/useAuth"
import { LoadingSpinner, Button, AddShiftLogModal } from "../ui-components";


function Home() {
  const { loading} = useAuth();
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);

  if(loading) return <LoadingSpinner size={100} />
  
  return (
    <div className="flex flex-col h-screen">
      <div className="py-3 self-end">
        <Button onClick={() => setIsAddShiftOpen(true)} label="Add Shift">
          <span className="text-lg">+</span>
        </Button>
      </div>
      
      <AddShiftLogModal 
        open={isAddShiftOpen} 
        onClose={() => setIsAddShiftOpen(false)} 
      />
    </div>
  )
}

export default Home