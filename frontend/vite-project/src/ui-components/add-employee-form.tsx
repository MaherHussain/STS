import React, { useState } from "react";
import { useAddEmployee } from "../queries/employee-queries";
import { type ApiError } from "../utils/types/";
import { useAuth } from "../utils/hooks/useAuth";

type AddEmployeeModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddEmployeeModal({
  open,
  onClose,
}: AddEmployeeModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [payType, setPayType] = useState<"HOURLY" | "REVENUE">("HOURLY");

  const [error, setError] = useState("");

  const { user } = useAuth();
  const { mutateAsync: addEmployee, isPending } = useAddEmployee(user?.id);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      email,
      password,
      name,
      payType,
    };

    addEmployee(payload, {
      onSuccess: () => {
        setError("");
        onClose();
        setName("");
        setEmail("");
        setPassword("");
        setPayType("HOURLY");
      },
      onError: (error: ApiError) => {
        const message =
          error?.response?.data?.message || error?.message || "Adding failed";
        setError(message);
      },
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Add Employee</h2>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Temporary Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Payment System
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => setPayType("HOURLY")}
                className={`
                  py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                  ${payType === "HOURLY" 
                    ? "bg-indigo-600 text-white shadow-md" 
                    : "text-gray-600 hover:bg-gray-200"}
                `}
              >
                Hourly
              </button>
              <button
                type="button"
                onClick={() => setPayType("REVENUE")}
                className={`
                  py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                  ${payType === "REVENUE" 
                    ? "bg-indigo-600 text-white shadow-md" 
                    : "text-gray-600 hover:bg-gray-200"}
                `}
              >
                Revenue
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              disabled={isPending}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg cursor-pointer bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
