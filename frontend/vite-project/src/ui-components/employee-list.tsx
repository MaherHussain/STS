import { LoadingSpinner } from "../ui-components/index";

type Employee = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
};

type UsersTableProps = {
  isPending: boolean;
  employees: Employee[] | undefined;
  isError: boolean;
  onViewLogs: (employee: Employee) => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

export default function EmployeeList({
  employees,
  isPending,
  isError,
  onViewLogs,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: UsersTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {isPending && (
        <div className="text-center py-14">
          <LoadingSpinner size={40} />
        </div>
      )}
      {!employees?.length && (
        <div className="text-center py-14">
          <p>No employees have been added yet. click add to start </p>
        </div>
      )}
      {isError && (
        <div className="text-center py-14 text-red-600">
          Failed to load employees. Please try again.
        </div>
      )}
      {employees && employees.length > 0 && (
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Created</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {employees?.map((employee) => (
              <tr key={employee._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {employee.name}
                </td>

                <td className="px-6 py-4 text-gray-600">{employee.email}</td>

                <td className="px-6 py-4 text-gray-500">
                  {new Date(employee.createdAt).toLocaleDateString("en-GB")}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onViewLogs(employee)}
                    className=" cursor-pointer text-indigo-600 hover:text-indigo-900 font-medium transition-colors"
                  >
                    View Logs
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {hasNextPage && (
        <div className="p-4 border-t border-gray-100 flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 cursor-pointer py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 disabled:text-gray-400 transition-colors"
          >
            {isFetchingNextPage ? "Loading more..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
