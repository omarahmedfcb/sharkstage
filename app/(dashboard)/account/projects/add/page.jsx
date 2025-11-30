"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AlertCircle, Loader2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import Image from "next/image";
import ProjectPaymentForm from "@/app/components/payment/ProjectPaymentForm";
import { getAllProjects } from "@/lib/api/admin.api";
import { getProjects } from "@/lib/features/projects/projectsThunks";

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
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [pendingProjectData, setPendingProjectData] = useState(null);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should be less than 10MB");
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data) => {
    // Validate form first
    setError(null);

    // Save project data temporarily and show payment form
    setPendingProjectData({
      formData: data,
      imageFile: imageFile,
    });
    setShowPaymentForm(true);
  };

  const handleBackToForm = () => {
    setShowPaymentForm(false);
    setPendingProjectData(null);
    setError(null);
  };

  const handlePaymentSuccess = async (paymentData) => {
    if (!pendingProjectData) {
      toast.error("Project data not found");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      const { formData: projectFormData, imageFile: projectImageFile } =
        pendingProjectData;

      // Append form fields
      formData.append("title", projectFormData.title);
      formData.append("shortDesc", projectFormData.shortDesc);
      formData.append("description", projectFormData.description);
      formData.append(
        "category",
        JSON.stringify({ en: projectFormData.category })
      );
      formData.append("status", projectFormData.status);
      formData.append("totalPrice", Number(projectFormData.totalPrice));
      formData.append("expectedROI", Number(projectFormData.expectedROI));
      formData.append("owner", currentUser._id);

      // Add availablePercentage only if provided
      if (projectFormData.availablePercentage) {
        formData.append(
          "availablePercentage",
          Number(projectFormData.availablePercentage)
        );
      }

      // Append image if selected
      if (projectImageFile) {
        formData.append("image", projectImageFile);
      }

      // Create project after payment
      const response = await api.post("/projects/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(getProjects());
      toast.success("Payment processed and project created successfully!");
      reset();
      removeImage();
      setShowPaymentForm(false);
      setPendingProjectData(null);
      router.push(`/projects/${response.data.newProjectId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
      toast.error(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, error, required, children }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-heading dark:text-background">
        {label}{" "}
        {required && <span className="text-red-500 dark:text-red-400">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );

  // Show payment form if needed
  if (showPaymentForm && pendingProjectData) {
    return (
      <ProjectPaymentForm
        onSubmit={handlePaymentSuccess}
        onBack={handleBackToForm}
        loading={loading}
        errors={error ? { general: error } : {}}
        projectData={pendingProjectData.formData}
      />
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-background dark:bg-background-dark">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-heading dark:text-background mb-2">
            Add New Project
          </h1>
          <p className="text-paragraph dark:text-paragraph">
            Fill in the required details to list your project
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg flex items-start gap-3">
            <AlertCircle
              className="text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div className="flex-1">
              <p className="text-red-800 dark:text-red-300 font-medium">
                Error
              </p>
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xl"
            >
              ×
            </button>
          </div>
        )}

        {/* Form */}
        <div className="bg-white dark:bg-background/10 rounded-lg shadow-md dark:shadow-none p-6 border border-gray-200 dark:border-0">
          <div className="space-y-5">
            {/* Image Upload Section */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-heading">
                Project Image
              </label>

              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-background/30 rounded-lg p-8 text-center hover:border-primary dark:hover:border-primary-dark transition cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                    disabled={loading}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-paragraph" />
                    <p className="text-sm text-gray-600 dark:text-paragraph mb-1">
                      Click to upload project image
                    </p>
                    <p className="text-xs text-gray-500 dark:text-paragraph">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border border-gray-300 dark:border-0">
                  <Image
                    src={imagePreview}
                    alt="Project preview"
                    width={800}
                    height={400}
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={loading}
                    className="absolute top-2 right-2 bg-red-500 dark:bg-red-600 text-white p-2 rounded-full hover:bg-red-600 dark:hover:bg-red-700 transition disabled:opacity-50"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>

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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                    placeholder="Enter project title"
                    disabled={loading}
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none resize-none"
                    placeholder="Brief summary of your project"
                    disabled={loading}
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none resize-none"
                    placeholder="Detailed description of your project"
                    disabled={loading}
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none bg-white"
                      disabled={loading}
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none bg-white"
                      disabled={loading}
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                      placeholder="0.00"
                      disabled={loading}
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                      placeholder="0-100"
                      disabled={loading}
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                      placeholder="0-100"
                      disabled={loading}
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
                className="px-6 py-2.5 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background text-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-background/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
                className="px-6 py-2.5 bg-primary dark:bg-primary-dark text-white rounded-lg hover:bg-secondary dark:hover:bg-secondary-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
