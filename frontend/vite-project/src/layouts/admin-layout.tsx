
import { Outlet } from "react-router-dom";
import {Header} from "../ui-components/";
import { useLogout } from "../queries/auth-queries";

function AdminLayout() {
const {mutateAsync: logout, isPending} = useLogout()
    async function handleLogout() {
        await logout()
    }
  return (
    <div className="bg-gray-50">
      <Header isPending={isPending}  onLogout={handleLogout} />

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout
