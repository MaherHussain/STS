import { Activity, useState } from "react";
import { Button, AddEmployeeForm, EmployeeList, EmployeeLogsModal } from "../ui-components";
import { useGetEmployees } from "../queries/employee-queries";
import { useAuth } from "../utils/hooks/useAuth";
function AdminDashboard() {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<{ _id: string; name: string } | null>(null);
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
        onViewLogs={(emp) => setSelectedEmployee(emp)}
      />

      <Activity mode={isAddFormOpen ? "visible" : "hidden"}>
        <AddEmployeeForm
          onClose={() => setIsAddFormOpen(false)}
          open={isAddFormOpen}
        />
      </Activity>

      <Activity mode={selectedEmployee ? "visible" : "hidden"}>
        <EmployeeLogsModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      </Activity>
    </div>
  );
}

export default AdminDashboard;
