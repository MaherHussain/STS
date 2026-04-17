import { FiLogOut, FiSettings } from "react-icons/fi";
import { useAuth } from "../utils/hooks/useAuth";
import { useState } from "react";
import ShiftTemplateSettings from "./shift-template-settings";

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between space-x-4">
      {/* Settings Modal */}
      <ShiftTemplateSettings
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Left */}
      <div className="">
        <h1 className="text-2xl font-semibold  text-[#1E5BBE]">{title}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {user?.email && (
          <span className="truncate max-w-[80px] md:max-w-none md:overflow-visible md:whitespace-normal text-sm text-gray-600">{user.email}</span>
        )}

        {user?.role !== "ADMIN" && user?.payType === "HOURLY" && (
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            title="Shift Template Settings"
          >
            <FiSettings className="text-lg" />
            <span className="hidden sm:inline">Settings</span>
          </button>
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
