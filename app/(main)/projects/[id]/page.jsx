"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCategoryBg } from "@/app/components/projects/ProjectCard";
import api from "@/lib/axios";

import {
  ArrowLeft,
  TrendingUp,
  Calendar,
  Target,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  PenBox,
  Inbox,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import DialogWindow from "@/app/components/DialogWindow";
import { Controller, useForm } from "react-hook-form";
import InputField from "@/app/components/InputField";
import toast from "react-hot-toast";
import MessageForm from "./MessageForm";
import DeleteAlert from "@/app/components/DeleteAlert";
import { getProjects } from "@/lib/features/projects/projectsThunks";

const lang = "en";

// Empty State Component
const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 bg-gray-100 dark:bg-background/20 rounded-full flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-gray-400 dark:text-paragraph" />
    </div>
    <h3 className="text-lg font-semibold text-heading dark:text-background mb-2">
      {title}
    </h3>
    <p className="text-paragraph dark:text-paragraph max-w-md">{description}</p>
  </div>
);

export default function ProjectDetailsPage() {
  const params = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser, isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [offerLoading, setOfferLoading] = useState(false);
  const [error, setError] = useState(null);
  const [projectDeleteLoading, setProjectDeleteLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      amount: "",
      percentage: "",
      proposal: "",
    },
  });

  const [open, setOpen] = useState(false);

  const onSubmitLogic = async (data) => {
    setOfferLoading(true);
    setError(null);
    try {
      const cleanedData = {
        amount: Number(data.amount),
        percentage: Number(data.percentage),
        proposalLetter: data.proposal || "",
        offeredTo: project.owner,
        offeredBy: currentUser._id,
        project: project._id,
      };
      await api.post("/offers/send", cleanedData);
      reset();
      handleClose();
      toast.success("Offer sent successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send offer");
    } finally {
      setOfferLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const handleInvestClick = () => {
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      setProjectDeleteLoading(true);
      await api.delete(`/projects/delete/${project._id}`);
      toast.success("Project deleted Successfully");
      dispatch(getProjects());
      router.push("/projects");
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setProjectDeleteLoading(false);
    }
  };

  useEffect(() => {
    if (!params.id) return;
    api
      .get(`/projects/${params.id}`)
      .then((res) => setProject(res.data.project))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [params.id]);

  const [activeTab, setActiveTab] = useState("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (loading)
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );

  if (!project) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-heading dark:text-background mb-4">
            Project Not Found
          </h2>
          <p className="text-paragraph dark:text-paragraph mb-6">
            The project you're looking for doesn't exist.
          </p>
          <Link
            href="/projects"
            className="bg-primary dark:bg-primary-dark text-white px-6 py-3 rounded-lg hover:bg-primary/90 dark:hover:bg-primary-dark/80 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const category = project?.category[lang];
  const fundingPercentage =
    (project.currentFunding / project.fundingGoal) * 100;
  const daysLeft = Math.ceil(
    (new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "timeline", label: "Timeline", icon: Calendar },
    { id: "investors", label: "Investors", icon: Users },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "risks", label: "Risks & Returns", icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-background pt-18 dark:bg-background-dark">
      {/* Back Button */}
      <div>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-paragraph dark:text-paragraph hover:text-primary dark:hover:text-primary-dark transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Projects
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-background dark:bg-background-dark border-b border-gray-100 dark:border-0">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Image and Info */}
            <div className="lg:col-span-2">
              {/* Image */}
              <div className="relative h-96 rounded-xl overflow-hidden mb-6 bg-gray-100 dark:bg-background/10">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title and Category */}
              <div className="mb-4">
                {category && (
                  <div
                    className={`inline-flex items-center gap-2 ${getCategoryBg(
                      category
                    )} text-white px-4 py-2 rounded-full text-sm font-semibold mb-3`}
                  >
                    {category}
                  </div>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-heading dark:text-background mb-2">
                  {project.title}
                </h1>
                <p className="text-lg text-paragraph dark:text-paragraph">
                  {project.shortDesc}
                </p>
              </div>

              {/* Owner Info */}
              <div className="flex items-center gap-4 mt-4 mb-8 p-4 bg-gray-50 dark:bg-background/10 rounded-2xl shadow-sm border border-gray-100 dark:border-0">
                {project.owner?.profilePicUrl ? (
                  <img
                    src={project.owner.profilePicUrl}
                    alt={`${project.owner.firstName} ${project.owner.lastName}`}
                    className="w-14 h-14 rounded-full object-cover shadow-sm"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary dark:to-heading flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                    {project.owner?.firstName?.charAt(0)}
                    {project.owner?.lastName?.charAt(0)}
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500 dark:text-paragraph font-medium mb-1">
                    Project Owner
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-background">
                    {project.owner?.firstName} {project.owner?.lastName}
                  </p>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-soft dark:bg-background/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-paragraph dark:text-paragraph text-sm mb-1">
                    <TrendingUp className="w-4 h-4" />
                    ROI
                  </div>
                  <p className="text-2xl font-bold text-heading dark:text-background">
                    {project.expectedROI}%
                  </p>
                </div>
                <div className="bg-soft dark:bg-background/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-paragraph dark:text-paragraph text-sm mb-1">
                    <Users className="w-4 h-4" />
                    Status
                  </div>
                  <p className="text-lg font-bold text-heading dark:text-background capitalize">
                    {project.status}
                  </p>
                </div>
                <div className="bg-soft dark:bg-background/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-paragraph dark:text-paragraph text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    Start Date
                  </div>
                  <p className="text-lg font-bold text-heading dark:text-background">
                    {new Date(project.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="bg-soft dark:bg-background/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-paragraph dark:text-paragraph text-sm mb-1">
                    <Users className="w-4 h-4" />
                    Investors
                  </div>
                  <p className="text-2xl font-bold text-heading dark:text-background">
                    {project.investors?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Investment Card */}
            <div className="lg:col-span-1">
              <div className="flex flex-col bg-gradient-to-br from-primary to-secondary dark:to-heading text-white rounded-xl p-6 sticky top-4">
                {isLoggedIn &&
                  (currentUser?.accountType == "admin" ||
                    currentUser?._id == project.owner?._id) && (
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Link
                        href={`/account/projects/edit/${project._id}`}
                        className="text-white rounded-lg hover:bg-black/10 p-2 transition-colors"
                      >
                        <PenBox />
                      </Link>
                      <DeleteAlert
                        handleDelete={handleDelete}
                        deleteLoading={projectDeleteLoading}
                        title={"Delete this Project?"}
                        className={"text-white"}
                      />
                    </div>
                  )}
                <h3 className="text-xl font-bold mb-6">Investment Details</h3>

                {/* Funding Progress */}
                <div className="mb-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-3xl font-bold">
                      $
                      {project.totalPrice > 999999
                        ? `${(project.totalPrice / 1000000).toFixed(1)}M`
                        : `${(project.totalPrice / 1000).toFixed(0)}K`}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                    <div
                      className="bg-buttons h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(project.progress, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-background/90">
                    {project.progress.toFixed(1)}% invested
                  </p>
                </div>

                {/* Investment Button */}
                {currentUser?.accountType == "investor" && (
                  <>
                    <button
                      onClick={handleInvestClick}
                      className="w-full bg-buttons text-primary font-bold py-4 rounded-lg hover:bg-buttons/90 transition-colors mb-4"
                    >
                      Invest Now
                    </button>
                    <DialogWindow
                      handleClickOpen={handleClickOpen}
                      handleClose={handleClose}
                      onSubmitLogic={onSubmitLogic}
                      handleSubmit={handleSubmit}
                      offerLoading={offerLoading}
                      open={open}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <Controller
                          name="amount"
                          control={control}
                          rules={{
                            required: "Amount is required",
                            min: { value: 0, message: "Must be positive" },
                          }}
                          render={({ field }) => (
                            <InputField
                              label="Amount Offered"
                              error={errors.amount?.message}
                              required
                            >
                              <input
                                {...field}
                                type="number"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                                placeholder="0.00"
                              />
                            </InputField>
                          )}
                        />

                        <Controller
                          name="percentage"
                          control={control}
                          rules={{
                            required: "Percentage is required",
                            min: { value: 0, message: "Must be 0-100" },
                            max: {
                              value: project.availablePercentage,
                              message: `Must be 0-${project.availablePercentage}`,
                            },
                          }}
                          render={({ field }) => (
                            <InputField
                              required
                              label="Percentage to be invested"
                              error={errors.percentage?.message}
                            >
                              <input
                                {...field}
                                type="number"
                                step="0.1"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                                placeholder="0-100"
                              />
                            </InputField>
                          )}
                        />
                      </div>

                      <Controller
                        name="proposal"
                        control={control}
                        render={({ field }) => (
                          <InputField
                            label="Proposal Letter (Optional)"
                            error={errors.proposal?.message}
                          >
                            <textarea
                              {...field}
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none resize-none"
                              placeholder="Explain why you want to invest in this project..."
                            />
                          </InputField>
                        )}
                      />
                    </DialogWindow>
                  </>
                )}
                {currentUser && currentUser?._id != project.owner ? (
                  <MessageForm owner={project.owner} />
                ) : null}

                {/* Quick Stats */}
                <div className="space-y-3 pt-4 border-t border-white/20">
                  <div className="flex justify-between">
                    <span className="text-background/80">Expected ROI</span>
                    <span className="font-semibold">
                      {project.expectedROI}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-background/80">
                      Available for Investment
                    </span>
                    <span className="font-semibold">
                      {project.availablePercentage}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-background/80">Total Value</span>
                    <span className="font-semibold">
                      $
                      {project.totalPrice > 999999
                        ? `${(project.totalPrice / 1000000).toFixed(1)}M`
                        : `${(project.totalPrice / 1000).toFixed(0)}K`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs and Content */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-primary dark:bg-primary-dark text-white"
                  : "bg-white dark:bg-background/10 text-paragraph dark:text-background hover:bg-gray-50 dark:hover:bg-background/20 border border-gray-200 dark:border-0"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-background/10 dark:border-0 rounded-xl p-8 shadow-sm border border-gray-100">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              <h2 className="text-2xl font-bold text-heading dark:text-background mb-4">
                Project Overview
              </h2>
              <p className="text-paragraph dark:text-paragraph text-lg leading-relaxed mb-6 whitespace-pre-line">
                {project.description}
              </p>

              {project.keyBenefits && project.keyBenefits.length > 0 ? (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-heading dark:text-background mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-500 dark:text-green-400" />
                    Key Benefits
                  </h3>
                  <ul className="space-y-2">
                    {project.keyBenefits.map((benefit, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-paragraph dark:text-paragraph"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <EmptyState
                  icon={CheckCircle2}
                  title="No Benefits Listed"
                  description="The project owner hasn't added key benefits yet."
                />
              )}
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <div>
              <h2 className="text-2xl font-bold text-heading dark:text-background mb-6">
                Project Timeline
              </h2>
              {project.timeline && project.timeline.length > 0 ? (
                <div className="space-y-6">
                  {project.timeline.map((phase, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            phase.status === "completed"
                              ? "bg-green-500"
                              : phase.status === "in-progress"
                              ? "bg-yellow-500"
                              : "bg-gray-300"
                          }`}
                        >
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        {index < project.timeline.length - 1 && (
                          <div className="w-0.5 h-16 bg-gray-200 dark:bg-background/30 my-2"></div>
                        )}
                      </div>
                      <div className="flex-grow pb-8">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-heading dark:text-background">
                            {phase.phase}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              phase.status === "completed"
                                ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                                : phase.status === "in-progress"
                                ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300"
                                : "bg-gray-100 dark:bg-background/20 text-gray-700 dark:text-paragraph"
                            }`}
                          >
                            {phase.status.replace("-", " ")}
                          </span>
                        </div>
                        <p className="text-paragraph dark:text-paragraph font-semibold mb-1">
                          {phase.title}
                        </p>
                        <p className="text-sm text-paragraph dark:text-paragraph">
                          {phase.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Calendar}
                  title="No Timeline Available"
                  description="The project owner hasn't created a timeline yet."
                />
              )}
            </div>
          )}

          {/* Investors Tab */}
          {activeTab === "investors" && (
            <div>
              <h2 className="text-2xl font-bold text-heading dark:text-background mb-6">
                Meet the Investors
              </h2>
              {project.investors && project.investors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.investors.map((member, index) => (
                    <div
                      key={index}
                      className="bg-soft dark:bg-background/10 rounded-xl p-6 text-center"
                    >
                      <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 bg-gray-200 dark:bg-background/20">
                        {member.user.profilePicUrl ? (
                          <img
                            src={member.user.profilePicUrl}
                            alt={member.user.firstName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white font-bold text-2xl">
                            {member.user.firstName?.charAt(0)}
                            {member.user.lastName?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-heading dark:text-background mb-1">
                        {member.user.firstName} {member.user.lastName}
                      </h3>
                      <p className="text-paragraph dark:text-paragraph text-sm">
                        {member.percentage}% invested
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Users}
                  title="No Investors Yet"
                  description="Be the first to invest in this project!"
                />
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div>
              <h2 className="text-2xl font-bold text-heading dark:text-background mb-6">
                Project Documents
              </h2>
              {project.documents && project.documents.length > 0 ? (
                <div className="space-y-3">
                  {project.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-soft dark:bg-background/10 rounded-lg hover:bg-gray-100 dark:hover:bg-background/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary dark:text-primary-dark" />
                        <div>
                          <h3 className="font-semibold text-heading dark:text-background">
                            {doc.title}
                          </h3>
                          <p className="text-sm text-paragraph dark:text-paragraph">
                            PDF Document •{" "}
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-primary dark:bg-primary-dark text-white rounded-lg hover:bg-primary/90 dark:hover:bg-primary-dark/80 transition-colors"
                      >
                        View
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={FileText}
                  title="No Documents Available"
                  description="The project owner hasn't uploaded any documents yet."
                />
              )}
            </div>
          )}

          {/* Risks & Returns Tab */}
          {activeTab === "risks" && (
            <div>
              <h2 className="text-2xl font-bold text-heading dark:text-background mb-6">
                Risks & Returns Analysis
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Risks */}
                <div>
                  <h3 className="text-xl font-bold text-heading dark:text-background mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-orange-500 dark:text-orange-400" />
                    Potential Risks
                  </h3>
                  {project.potentialRisks &&
                  project.potentialRisks.length > 0 ? (
                    <ul className="space-y-3">
                      {project.potentialRisks.map((risk, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800/30"
                        >
                          <AlertTriangle className="w-5 h-5 text-orange-500 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                          <span className="text-paragraph dark:text-paragraph">
                            {risk}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 bg-gray-50 dark:bg-background/20 rounded-lg text-center">
                      <Inbox className="w-12 h-12 text-gray-400 dark:text-paragraph mx-auto mb-2" />
                      <p className="text-paragraph dark:text-paragraph text-sm">
                        No risks listed yet
                      </p>
                    </div>
                  )}
                </div>

                {/* Returns */}
                <div>
                  <h3 className="text-xl font-bold text-heading dark:text-background mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-green-500 dark:text-green-400" />
                    Expected Returns
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/30">
                      <p className="text-sm text-paragraph dark:text-paragraph mb-1">
                        ROI Target
                      </p>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {project.expectedROI}%
                      </p>
                    </div>
                    <div className="p-4 bg-soft dark:bg-background/10 rounded-lg">
                      <p className="text-sm text-paragraph dark:text-paragraph mb-1">
                        Total Project Value
                      </p>
                      <p className="text-xl font-bold text-heading dark:text-background">
                        $
                        {project.totalPrice > 999999
                          ? `${(project.totalPrice / 1000000).toFixed(1)}M`
                          : `${(project.totalPrice / 1000).toFixed(0)}K`}
                      </p>
                    </div>
                    <div className="p-4 bg-soft dark:bg-background/10 rounded-lg">
                      <p className="text-sm text-paragraph dark:text-paragraph mb-1">
                        Current Progress
                      </p>
                      <p className="text-xl font-bold text-heading dark:text-background">
                        {project.progress.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
