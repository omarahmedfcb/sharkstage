import Link from "next/link";
import { getCategoryById } from "@/data/categories";
import { TrendingUp, Users, Clock } from "lucide-react";

export default function ProjectCard({ project }) {
  const category = getCategoryById(project.categoryId);
  const fundingPercentage = (project.currentFunding / project.fundingGoal) * 100;
  const daysLeft = Math.ceil(
    (new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100 h-full flex flex-col">
        {/* Project Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.images[0]}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          {project.featured && (
            <div className="absolute top-3 left-3 bg-buttons text-primary px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </div>
          )}
          {category && (
            <div
              className={`absolute top-3 right-3 ${category.bg} text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}
            >
              <category.icon className="w-3 h-3" />
              {category.title}
            </div>
          )}
        </div>

        {/* Project Content */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Title and Description */}
          <h3 className="text-xl font-bold text-heading mb-2 line-clamp-2">
            {project.title}
          </h3>
          <p className="text-paragraph text-sm mb-4 line-clamp-2 flex-grow">
            {project.shortDesc}
          </p>

          {/* Funding Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-heading">
                ${(project.currentFunding / 1000000).toFixed(2)}M raised
              </span>
              <span className="text-sm text-paragraph">
                ${(project.fundingGoal / 1000000).toFixed(1)}M goal
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="mt-1 text-xs text-paragraph">
              {fundingPercentage.toFixed(0)}% funded
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1 text-paragraph text-sm">
              <TrendingUp className="w-4 h-4 text-buttons" />
              <span className="font-semibold text-heading">{project.roi}</span>
              <span className="text-xs">ROI</span>
            </div>
            <div className="flex items-center gap-1 text-paragraph text-sm">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-semibold text-heading">{daysLeft}</span>
              <span className="text-xs">days left</span>
            </div>
            <div
              className={`px-2 py-1 rounded text-xs font-semibold ${
                project.status === "active"
                  ? "bg-green-100 text-green-700"
                  : project.status === "funded"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

