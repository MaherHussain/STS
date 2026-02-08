import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../utils/hooks/useAuth";

interface AppHeaderProps {
  title?: string;
  isPending: boolean;
  onLogout?: () => void;
}

export default function Header({
  title = "STS",
  isPending,
  onLogout,
}: AppHeaderProps) {
  const { user } = useAuth();
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between space-x-4">
      {/* Left */}
      <div className="">
        <h1 className="text-2xl font-semibold  text-[#1E5BBE]">{title}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {user?.email && (
          <span className=" sm:block text-sm text-gray-600">{user.email}</span>
        )}

        <button
          onClick={onLogout}
          disabled={isPending}
          className={`flex items-center gap-2 px-4 py-2 cursor-pointer text-sm font-medium
           ${isPending ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-50"}`}
        >
          <FiLogOut className="text-base" />
          Logout
        </button>
      </div>
    </header>
  );
}
