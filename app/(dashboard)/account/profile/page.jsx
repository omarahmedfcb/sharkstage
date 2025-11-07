"use client";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  uploadProfilePicture,
  removeProfilePicture,
} from "@/lib/features/auth/auththunks";
import { toast } from "react-hot-toast"; // or your preferred toast library

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);
  if (currentUser) {
    console.log(currentUser.profilePicUrl);
  }
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      await dispatch(uploadProfilePicture(file));
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      toast.error("Failed to upload profile picture");
    }
  };

  const handleRemove = async () => {
    if (!currentUser?.profilePicUrl) return;

    if (!confirm("Are you sure you want to remove your profile picture?")) {
      return;
    }

    try {
      await dispatch(removeProfilePicture());
      toast.success("Profile picture removed successfully!");
    } catch (error) {
      toast.error("Failed to remove profile picture");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Left card */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 border border-gray-200 flex flex-col items-center justify-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 border border-gray-300 shadow relative">
            {currentUser?.profilePicUrl ? (
              <img
                src={currentUser.profilePicUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-semibold">
                {currentUser?.firstName?.charAt(0)}
                {currentUser?.lastName?.charAt(0)}
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">Profile Picture</p>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={handleUploadClick}
            disabled={loading}
            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>

          {currentUser?.profilePicUrl && (
            <button
              onClick={handleRemove}
              disabled={loading}
              className="w-full py-2 text-red-500 bg-gray-100 rounded-md hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove
            </button>
          )}
        </div>

        {/* Right form */}
        <div className="md:col-span-2 bg-white shadow rounded-lg p-4 sm:p-6 border border-gray-200">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <h1 className="text-xl font-semibold">{`${currentUser?.firstName} ${currentUser?.lastName}`}</h1>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <h1 className="text-xl font-semibold">{currentUser?.email}</h1>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <h1 className="text-xl font-semibold">
                {currentUser?.accountType}
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
