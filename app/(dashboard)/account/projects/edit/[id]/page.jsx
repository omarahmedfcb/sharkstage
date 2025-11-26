"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { AlertCircle, Loader2, Upload, X } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import Image from "next/image";

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

export default function EditProjectPage() {
  const { currentUser } = useSelector((state) => state.auth);
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;

  const [loading, setLoading] = useState(false);
  const [fetchingProject, setFetchingProject] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [investedPercentage, setInvestedPercentage] = useState(0);
  const [maxAvailablePercentage, setMaxAvailablePercentage] = useState(100);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
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

  // In the useEffect after setting form values, add:
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setFetchingProject(true);
        const response = await api.get(`/projects/${projectId}`);
        const project = response.data.project;
        console.log();

        // Check if user is the owner
        if (
          project.owner !== currentUser._id &&
          currentUser.accountType !== "admin"
        ) {
          toast.error("You don't have permission to edit this project");
          router.push(`/projects/${projectId}`);
          return;
        }

        // Calculate invested percentage
        const totalInvested =
          project.investors?.reduce((sum, inv) => sum + inv.percentage, 0) || 0;
        const maxAvailable = 100 - totalInvested;

        // Store for validation message
        setInvestedPercentage(totalInvested);
        setMaxAvailablePercentage(maxAvailable);

        // Set form values
        setValue("title", project.title);
        setValue("shortDesc", project.shortDesc);
        setValue("description", project.description);
        setValue("category", project.category.en);
        setValue("status", project.status);
        setValue("totalPrice", project.totalPrice);
        setValue("availablePercentage", project.availablePercentage || "");
        setValue("expectedROI", project.expectedROI);

        // Set existing image
        if (project.image) {
          setExistingImage(project.image);
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        toast.error("Failed to load project");
        router.push("/projects");
      } finally {
        setFetchingProject(false);
      }
    };

    if (projectId && currentUser) {
      fetchProject();
    }
  }, [projectId, currentUser, router, setValue]);

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

      // Clear existing image when new one is selected
      setExistingImage(null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const removeExistingImage = () => {
    setExistingImage(null);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      // Append form fields
      formData.append("title", data.title);
      formData.append("shortDesc", data.shortDesc);
      formData.append("description", data.description);
      formData.append("category", JSON.stringify({ en: data.category }));
      formData.append("status", data.status);
      formData.append("totalPrice", Number(data.totalPrice));
      formData.append("expectedROI", Number(data.expectedROI));

      // Add availablePercentage only if provided
      if (data.availablePercentage) {
        formData.append(
          "availablePercentage",
          Number(data.availablePercentage)
        );
      }

      // Append new image if selected
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await api.put(`/projects/edit/${projectId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Project updated successfully!");
      router.push(`/projects/${projectId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update project");
      toast.error(err.response?.data?.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, error, required, children }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-heading dark:text-background">
        {label} {required && <span className="text-red-500 dark:text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );

  if (fetchingProject) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-paragraph dark:text-paragraph">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-background dark:bg-background-dark">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-heading dark:text-background mb-2">
            Edit Project
          </h1>
          <p className="text-paragraph dark:text-paragraph">Update your project details</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg flex items-start gap-3">
            <AlertCircle
              className="text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div className="flex-1">
              <p className="text-red-800 dark:text-red-300 font-medium">Error</p>
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
            {/* Image Upload/Update Section */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-heading">
                Project Image
              </label>

              {/* Show existing image if no new image selected */}
              {existingImage && !imagePreview && (
                <div className="relative rounded-lg overflow-hidden border border-gray-300 dark:border-0">
                  <Image
                    src={existingImage}
                    alt="Current project image"
                    width={800}
                    height={400}
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeExistingImage}
                    disabled={loading}
                    className="absolute top-2 right-2 bg-red-500 dark:bg-red-600 text-white p-2 rounded-full hover:bg-red-600 dark:hover:bg-red-700 transition disabled:opacity-50"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}

              {/* Show new image preview */}
              {imagePreview && (
                <div className="relative rounded-lg overflow-hidden border border-gray-300 dark:border-0">
                  <Image
                    src={imagePreview}
                    alt="New project preview"
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

              {/* Upload new image section */}
              {!existingImage && !imagePreview && (
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
                      Click to upload new project image
                    </p>
                    <p className="text-xs text-gray-500 dark:text-paragraph">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </label>
                </div>
              )}

              {/* Change image button when image exists */}
              {(existingImage || imagePreview) && (
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="change-image-upload"
                    disabled={loading}
                  />
                  <label
                    htmlFor="change-image-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-background/20 dark:text-background text-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-background/30 transition cursor-pointer text-sm"
                  >
                    <Upload size={16} />
                    Change Image
                  </label>
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
                  max: {
                    value: maxAvailablePercentage,
                    message: `Maximum ${maxAvailablePercentage.toFixed(
                      2
                    )}% available (${investedPercentage.toFixed(
                      2
                    )}% already invested)`,
                  },
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
                      max={maxAvailablePercentage}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                      placeholder={`0-${maxAvailablePercentage.toFixed(2)}`}
                      disabled={loading}
                    />
                    {investedPercentage > 0 && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        {investedPercentage.toFixed(2)}% already invested. Max
                        available: {maxAvailablePercentage.toFixed(2)}%
                      </p>
                    )}
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
                {loading ? "Updating..." : "Update Project"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
