import { useState } from "react";
import { Button, AddEmployeeForm, EmployeeList } from "../ui-components";
import { useGetEmployees } from "../queries/employee-queries";
import { useAuth } from "../utils/hooks/useAuth";
function AdminDashboard() {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const { user } = useAuth();

  const { data: employeeList, isPending, isError } = useGetEmployees(user?.id);
  return (
    <div className="flex flex-col">
      <div className="py-3 self-end">
        <Button onClick={() => setIsAddFormOpen(true)} label="Add employee">
          <span className="text-lg">+</span>
        </Button>
      </div>

      <EmployeeList
        employees={employeeList?.data}
        isPending={isPending}
        isError={isError}
      />

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
