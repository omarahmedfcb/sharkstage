"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";

const PROJECT_CATEGORIES = [
  "Technology",
  "E-Commerce",
  "Food",
  "Health",
  "Education",
  "Real Estate",
  "Industrial",
  "Other",
];

export default function AddProjectPage() {
  const { currentUser } = useSelector((state) => state.auth);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      shortDesc: "",
      description: "",
      category: "",
      status: "active",
      totalPrice: "",
      availablePercentage: "",
      expectedROI: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const cleanedData = {
        title: data.title,
        shortDesc: data.shortDesc,
        description: data.description,
        category: { en: data.category },
        status: data.status,
        totalPrice: Number(data.totalPrice),
        expectedROI: Number(data.expectedROI),
        owner: currentUser._id,
      };

      // Add availablePercentage only if provided
      if (data.availablePercentage) {
        cleanedData.availablePercentage = Number(data.availablePercentage);
      }

      const createdProject = await api.post("/projects/add", cleanedData);
      toast.success("Project added successfully!");
      reset();
      router.push(`/projects/${createdProject.data.newProjectId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add project");
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, error, required, children }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-heading">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen  p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-heading mb-2">
            Add New Project
          </h1>
          <p className="text-paragraph">
            Fill in the required details to list your project
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle
              className="text-red-500 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 text-xl"
            >
              ×
            </button>
          </div>
        )}
        {/* 
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle
              className="text-green-500 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div className="flex-1">
              <p className="text-green-800 font-medium">Success</p>
              <p className="text-green-700 text-sm">
                Project added successfully! Redirecting...
              </p>
            </div>
          </div>
        )} */}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-5">
            <Controller
              name="title"
              control={control}
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <InputField
                  label="Project Title"
                  error={errors.title?.message}
                  required
                >
                  <input
                    {...field}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="Enter project title"
                  />
                </InputField>
              )}
            />

            <Controller
              name="shortDesc"
              control={control}
              rules={{ required: "Short description is required" }}
              render={({ field }) => (
                <InputField
                  label="Short Description"
                  error={errors.shortDesc?.message}
                  required
                >
                  <textarea
                    {...field}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                    placeholder="Brief summary of your project"
                  />
                </InputField>
              )}
            />

            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <InputField
                  label="Full Description"
                  error={errors.description?.message}
                  required
                >
                  <textarea
                    {...field}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                    placeholder="Detailed description of your project"
                  />
                </InputField>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <InputField
                    label="Category"
                    error={errors.category?.message}
                    required
                  >
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
                    >
                      <option value="">Select category</option>
                      {PROJECT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </InputField>
                )}
              />

              <Controller
                name="status"
                control={control}
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <InputField
                    label="Status"
                    error={errors.status?.message}
                    required
                  >
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
                    >
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                    </select>
                  </InputField>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Controller
                name="totalPrice"
                control={control}
                rules={{
                  required: "Total price is required",
                  min: { value: 0, message: "Must be positive" },
                }}
                render={({ field }) => (
                  <InputField
                    label="Total Price"
                    error={errors.totalPrice?.message}
                    required
                  >
                    <input
                      {...field}
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="0.00"
                    />
                  </InputField>
                )}
              />

              <Controller
                name="availablePercentage"
                control={control}
                rules={{
                  min: { value: 0, message: "Must be 0-100" },
                  max: { value: 100, message: "Must be 0-100" },
                }}
                render={({ field }) => (
                  <InputField
                    label="Available %"
                    error={errors.availablePercentage?.message}
                  >
                    <input
                      {...field}
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="0-100"
                    />
                  </InputField>
                )}
              />

              <Controller
                name="expectedROI"
                control={control}
                rules={{
                  required: "Expected ROI is required",
                  min: { value: 0, message: "Must be positive" },
                  max: { value: 100, message: "Must be 0-100" },
                }}
                render={({ field }) => (
                  <InputField
                    label="Expected ROI %"
                    error={errors.expectedROI?.message}
                    required
                  >
                    <input
                      {...field}
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="0-100"
                    />
                  </InputField>
                )}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? "Adding..." : "Add Project"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
