"use client";
import { useSelector } from "react-redux";

export default function ProfilePage() {
  const { currentUser } = useSelector((state) => state.auth);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Left card */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 border border-gray-200 flex flex-col items-center justify-center ">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 border border-gray-300 shadow">
            <img
              src="/avatar-placeholder.jpg"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm text-gray-600 mb-2">Profile Picture</p>
          <button className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition mb-2">
            Upload
          </button>
          <button className="w-full py-2 text-red-500 bg-gray-100 rounded-md hover:bg-gray-200 transition">
            Remove
          </button>
        </div>

        {/* Right form */}
        <div className="md:col-span-2 bg-white shadow rounded-lg p-4 sm:p-6 border border-gray-200">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <h1 className="text-xl font-semibold">{`${currentUser.firstName} ${currentUser.lastName}`}</h1>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <h1 className="text-xl font-semibold">{currentUser.email}</h1>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <h1 className="text-xl font-semibold">
                {currentUser.accountType}
              </h1>
            </div>

            <h1 className="cursor-pointer text-primary transition-all hover:text-shadow-xs">
              Reset Password
            </h1>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <button
                type="button"
                className="px-4 py-2 bg-primary text-white rounded-md hover:shadow-lg transition-shadow w-full sm:w-auto"
              >
                Deactivate Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
