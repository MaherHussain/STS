import { useState } from "react";
import { HiOutlineUser, HiOutlineLockClosed } from "react-icons/hi";
import { LoadingSpinner } from "../ui-components";
import { useLogin } from "../queries/auth-queries";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { mutateAsync, isPending } = useLogin();

  function onSubmit() {
    const payload = {
      email,
      password,
    };

    mutateAsync(payload, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        const message =
          error?.response?.data?.message || error?.message || "Login failed";

        setError(message);
      },
    });
  }
  return (
    <div className="flex flex-row justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Logo / Title */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-[#1E5BBE]">STS</h1>
          <p className="text-gray-500 mt-1">ShiftTrackSystem</p>
        </div>

        <hr className="mb-6" />

        {/* Email */}
        <div className="mb-4">
          <label className="block text-left text-sm font-medium text-gray-700 mb-1">
            Email
          </label>

          <div className="flex items-center border rounded-lg overflow-hidden">
            <div className="px-3 text-gray-500 border-r">
              <HiOutlineUser size={20} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 focus:outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-left text-gray-700 mb-1">
            Password
          </label>

          <div className="flex items-center border rounded-lg overflow-hidden">
            <div className="px-3 text-gray-500 border-r">
              <HiOutlineLockClosed size={20} />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 focus:outline-none"
            />
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-sm text-red-500 mt-2 max-w-56">{error}</p>}

        {/* Login Button */}
        <button
          disabled={isPending}
          onClick={onSubmit}
          className="w-full  cursor-pointer mt-6 bg-[#1E5BBE] text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          {isPending ? (
            <div className="flex flex-row justify-center items-center">
              <LoadingSpinner />
              <span className="pl-5 text-gray-300">Logging in...</span>
            </div>
          ) : (
            "Login"
          )}
        </button>
      </div>
    </div>
  );
}
