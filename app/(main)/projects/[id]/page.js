"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProjectById } from "@/data/projects";
import { getCategoryById } from "@/data/categories";
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
} from "lucide-react";

export default function ProjectDetailsPage() {
  const params = useParams();
  const project = getProjectById(params.id);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-heading mb-4">
            Project Not Found
          </h2>
          <p className="text-paragraph mb-6">
            The project you're looking for doesn't exist.
          </p>
          <Link
            href="/projects"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const category = getCategoryById(project.categoryId);
  const fundingPercentage = (project.currentFunding / project.fundingGoal) * 100;
  const daysLeft = Math.ceil(
    (new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "timeline", label: "Timeline", icon: Calendar },
    { id: "milestones", label: "Milestones", icon: Target },
    { id: "team", label: "Team", icon: Users },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "risks", label: "Risks & Returns", icon: AlertTriangle },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-paragraph hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Projects
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Image and Info */}
            <div className="lg:col-span-2">
              {/* Image Slider */}
              <div className="relative h-96 rounded-xl overflow-hidden mb-6 bg-gray-100">
                <img
                  src={project.images[currentImageIndex]}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                {project.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {project.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                {project.featured && (
                  <div className="absolute top-4 left-4 bg-buttons text-primary px-4 py-2 rounded-full text-sm font-semibold">
                    Featured Project
                  </div>
                )}
              </div>

              {/* Title and Category */}
              <div className="mb-4">
                {category && (
                  <div
                    className={`inline-flex items-center gap-2 ${category.bg} text-white px-4 py-2 rounded-full text-sm font-semibold mb-3`}
                  >
                    <category.icon className="w-4 h-4" />
                    {category.title}
                  </div>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-heading mb-2">
                  {project.title}
                </h1>
                <p className="text-lg text-paragraph">{project.shortDesc}</p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-soft rounded-lg p-4">
                  <div className="flex items-center gap-2 text-paragraph text-sm mb-1">
                    <TrendingUp className="w-4 h-4" />
                    ROI
                  </div>
                  <p className="text-2xl font-bold text-heading">
                    {project.roi}
                  </p>
                </div>
                <div className="bg-soft rounded-lg p-4">
                  <div className="flex items-center gap-2 text-paragraph text-sm mb-1">
                    <Clock className="w-4 h-4" />
                    Days Left
                  </div>
                  <p className="text-2xl font-bold text-heading">{daysLeft}</p>
                </div>
                <div className="bg-soft rounded-lg p-4">
                  <div className="flex items-center gap-2 text-paragraph text-sm mb-1">
                    <Users className="w-4 h-4" />
                    Status
                  </div>
                  <p className="text-lg font-bold text-heading capitalize">
                    {project.status}
                  </p>
                </div>
                <div className="bg-soft rounded-lg p-4">
                  <div className="flex items-center gap-2 text-paragraph text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    Start Date
                  </div>
                  <p className="text-lg font-bold text-heading">
                    {new Date(project.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Investment Card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-xl p-6 sticky top-4">
                <h3 className="text-xl font-bold mb-6">Investment Details</h3>

                {/* Funding Progress */}
                <div className="mb-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-3xl font-bold">
                      ${(project.currentFunding / 1000000).toFixed(2)}M
                    </span>
                    <span className="text-background/80 text-sm">
                      raised of ${(project.fundingGoal / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                    <div
                      className="bg-buttons h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-background/90">
                    {fundingPercentage.toFixed(1)}% funded
                  </p>
                </div>

                {/* Investment Button */}
                <button className="w-full bg-buttons text-primary font-bold py-4 rounded-lg hover:bg-buttons/90 transition-colors mb-4">
                  Invest Now
                </button>

                {/* Quick Stats */}
                <div className="space-y-3 pt-4 border-t border-white/20">
                  <div className="flex justify-between">
                    <span className="text-background/80">Expected ROI</span>
                    <span className="font-semibold">{project.roi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-background/80">Duration</span>
                    <span className="font-semibold">
                      {Math.ceil(
                        (new Date(project.endDate) -
                          new Date(project.startDate)) /
                          (1000 * 60 * 60 * 24 * 30)
                      )}{" "}
                      months
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-background/80">Minimum Investment</span>
                    <span className="font-semibold">$1,000</span>
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
                  ? "bg-primary text-white"
                  : "bg-white text-paragraph hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              <h2 className="text-2xl font-bold text-heading mb-4">
                Project Overview
              </h2>
              <p className="text-paragraph text-lg leading-relaxed mb-6">
                {project.description}
              </p>
              
              {project.benefits && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-heading mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    Key Benefits
                  </h3>
                  <ul className="space-y-2">
                    {project.benefits.map((benefit, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-paragraph"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <div>
              <h2 className="text-2xl font-bold text-heading mb-6">
                Project Timeline
              </h2>
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
                        <div className="w-0.5 h-16 bg-gray-200 my-2"></div>
                      )}
                    </div>
                    <div className="flex-grow pb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-heading">
                          {phase.phase}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            phase.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : phase.status === "in-progress"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {phase.status.replace("-", " ")}
                        </span>
                      </div>
                      <p className="text-paragraph font-semibold mb-1">
                        {phase.title}
                      </p>
                      <p className="text-sm text-paragraph">{phase.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Milestones Tab */}
          {activeTab === "milestones" && (
            <div>
              <h2 className="text-2xl font-bold text-heading mb-6">
                Project Milestones
              </h2>
              <div className="space-y-6">
                {project.milestones.map((milestone, index) => (
                  <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-heading">
                        {milestone.title}
                      </h3>
                      <span className="text-2xl font-bold text-primary">
                        {milestone.completion}%
                      </span>
                    </div>
                    <p className="text-paragraph mb-3">{milestone.description}</p>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-300"
                        style={{ width: `${milestone.completion}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === "team" && (
            <div>
              <h2 className="text-2xl font-bold text-heading mb-6">
                Meet the Team
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.team.map((member, index) => (
                  <div
                    key={index}
                    className="bg-soft rounded-xl p-6 text-center"
                  >
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 bg-gray-200">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-heading mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary font-semibold text-sm mb-2">
                      {member.role}
                    </p>
                    <p className="text-paragraph text-sm">{member.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div>
              <h2 className="text-2xl font-bold text-heading mb-6">
                Project Documents
              </h2>
              <div className="space-y-3">
                {project.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-soft rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-primary" />
                      <div>
                        <h3 className="font-semibold text-heading">
                          {doc.title}
                        </h3>
                        <p className="text-sm text-paragraph">
                          {doc.type} • {doc.size}
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risks & Returns Tab */}
          {activeTab === "risks" && (
            <div>
              <h2 className="text-2xl font-bold text-heading mb-6">
                Risks & Returns Analysis
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Risks */}
                <div>
                  <h3 className="text-xl font-bold text-heading mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-orange-500" />
                    Potential Risks
                  </h3>
                  <ul className="space-y-3">
                    {project.risks.map((risk, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg"
                      >
                        <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-paragraph">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Returns */}
                <div>
                  <h3 className="text-xl font-bold text-heading mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                    Expected Returns
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-paragraph mb-1">ROI Target</p>
                      <p className="text-3xl font-bold text-green-600">
                        {project.roi}
                      </p>
                    </div>
                    <div className="p-4 bg-soft rounded-lg">
                      <p className="text-sm text-paragraph mb-1">
                        Investment Period
                      </p>
                      <p className="text-xl font-bold text-heading">
                        {Math.ceil(
                          (new Date(project.endDate) -
                            new Date(project.startDate)) /
                            (1000 * 60 * 60 * 24 * 365)
                        )}{" "}
                        years
                      </p>
                    </div>
                    <div className="p-4 bg-soft rounded-lg">
                      <p className="text-sm text-paragraph mb-1">Funding Goal</p>
                      <p className="text-xl font-bold text-heading">
                        ${(project.fundingGoal / 1000000).toFixed(1)}M
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

