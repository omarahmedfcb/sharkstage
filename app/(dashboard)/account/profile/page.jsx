"use client";
import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  uploadProfilePicture,
  removeProfilePicture,
} from "@/lib/features/auth/auththunks";
import { updateUser } from "@/lib/features/auth/authSlice";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Edit2, Save, X } from "lucide-react";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser, loading } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
  });

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

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
    });
  };

  const handleSave = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("First name and last name are required");
      return;
    }

    if (formData.firstName.length < 2 || formData.lastName.length < 2) {
      toast.error("First and last name must be at least 2 characters");
      return;
    }

    try {
      setEditLoading(true);
      const response = await api.patch("/auth/profile", {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      });

      if (response.data.success) {
        dispatch(updateUser(response.data.user));
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setEditLoading(false);
    }
  };

  const handleResetPassword = () => {
    router.push("/account/changepassword");
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
              <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-semibold">
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
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="First Name"
                    disabled={editLoading}
                  />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Last Name"
                    disabled={editLoading}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-semibold">
                    {`${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`}
                  </h1>
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition"
                    title="Edit name"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              )}
              {isEditing && (
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={editLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={16} />
                    {editLoading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={editLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <h1 className="text-xl font-semibold">{currentUser?.email}</h1>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Account Type Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold capitalize">
                {currentUser?.accountType}
              </span>
            </div>

            {/* Reset Password */}
            <div>
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-all hover:underline flex items-center gap-2"
              >
                <span>Reset Password</span>
              </button>
            </div>

            {/* Deactivate Account */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 pt-4 border-t border-gray-200">
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-shadow w-full sm:w-auto"
                onClick={() => toast.error("This feature is not available yet")}
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
