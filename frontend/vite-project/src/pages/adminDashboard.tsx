import { useState } from "react";
import { Button, AddEmployeeForm } from "../ui-components";
function AdminDashboard() {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  return (
    <div className="flex flex-row justify-end">
      <div className="">
        <Button onClick={() => setIsAddFormOpen(true)} label="Add employee">
          <span className="text-lg">+</span>
        </Button>
      </div>
      <hr />
      {isAddFormOpen && (
        <AddEmployeeForm
          onClose={() => setIsAddFormOpen(false)}
          open={isAddFormOpen}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
