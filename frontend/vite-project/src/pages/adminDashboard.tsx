import { Activity, useState, useEffect } from "react";
import { Button, AddEmployeeForm, EmployeeList, EmployeeLogsModal } from "../ui-components";
import { useGetEmployees } from "../queries/employee-queries";
import { useAuth } from "../utils/hooks/useAuth";

// custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
function AdminDashboard() {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<{ _id: string; name: string; payType: 'HOURLY' | 'REVENUE' } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { user } = useAuth();

  const { data: employeeListData, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetEmployees(user?.id, debouncedSearchTerm);

  const employees = employeeListData?.pages.flatMap(page => page.data.employees) || [];

  return (
    <div className="flex flex-col">
      <div className="py-3 flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <Button onClick={() => setIsAddFormOpen(true)} label="Add employee">
          <span className="text-lg">+</span>
        </Button>
      </div>

      <EmployeeList
        employees={employees}
        isPending={isPending}
        isError={isError}
        onViewLogs={(emp) => setSelectedEmployee(emp)}
        fetchNextPage={fetchNextPage}
        hasNextPage={!!hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
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
