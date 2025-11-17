"use client";
import { useState, useEffect, useMemo } from "react";
import { Plus, Eye, FileDown, Trash, Pen, FolderKanban } from "lucide-react";
import Link from "next/link";
import InvestorFilter from "./InvestorFilter";
import { useDispatch, useSelector } from "react-redux";
import OwnerFilter from "./OwnerFilter";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { getProjects } from "@/lib/features/projects/projectsThunks";
const lang = "en";
// Original mock projects

// Status color function
const progressColor = (p) =>
  p == 100
    ? "bg-primary"
    : p > 70
    ? "bg-green-400"
    : p > 50
    ? "bg-yellow-400"
    : "bg-red-400";

export default function ProjectsPage() {
  // const { projects, projectsLoading } = useSelector((state) => state.projects);

  const { currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // filteration
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const handleFilterChange = (callback) => {
    callback();
  };
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProjects = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/projects/user/${currentUser._id}`);
      setUserProjects(res.data.userProjects || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load projects");
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProjects();
  }, [currentUser]);

  const handleDelete = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }
    try {
      await api.delete(`/projects/delete/${projectId}`);
      toast.success("Project deleted successfully");
      fetchUserProjects();
      dispatch(getProjects());
    } catch (err) {
      console.error("Failed to delete:", err);
      toast.error("Failed to delete project");
    }
  };

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = [...userProjects];

    // Apply search filter (works for all account types)
    if (searchQuery) {
      filtered = filtered.filter((item) => {
        const project =
          currentUser?.accountType === "investor" ? item.project : item;
        return project.title.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Apply category filter
    // if (selectedCategory !== "all") {
    //   filtered = filtered.filter((item) => {
    //     const project = currentUser?.accountType === "investor" ? item.project : item;
    //     return project.categoryId === selectedCategory;
    //   });
    // }

    // Apply status filter based on account type
    if (currentUser?.accountType === "investor") {
      if (selectedStatus === "owned") {
        filtered = filtered.filter((item) => item.percentage === 100);
      } else if (selectedStatus === "invested") {
        filtered = filtered.filter((item) => item.percentage < 100);
      }
    } else if (currentUser?.accountType === "owner") {
      if (selectedStatus === "sale") {
        filtered = filtered.filter((item) => item.progress === 0);
      } else if (selectedStatus === "invested") {
        filtered = filtered.filter(
          (item) => item.progress < 100 && item.progress > 0
        );
      } else if (selectedStatus === "sold") {
        filtered = filtered.filter((item) => item.progress === 100);
      } else if (selectedStatus === "unlisted") {
        filtered = filtered.filter((item) => item.status == "closed");
      }
    }
    // else if (currentUser?.accountType === "admin") {
    //   // Admin filtering logic here
    // }

    // Apply sorting
    filtered.sort((a, b) => {
      const projectA = currentUser?.accountType === "investor" ? a.project : a;
      const projectB = currentUser?.accountType === "investor" ? b.project : b;

      switch (sortBy) {
        case "newest":
          return new Date(projectB.createdAt) - new Date(projectA.createdAt);
        case "funding-high":
          return projectB.fundingGoal - projectA.fundingGoal;
        case "most-funded":
          return projectB.currentFunding - projectA.currentFunding;
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    userProjects,
    searchQuery,
    selectedCategory,
    selectedStatus,
    sortBy,
    currentUser,
  ]);
  const exportCSV = () => {
    const csv = [
      ["Title", "Category", currentUser?.accountType === "investor" ? "Percentage" : "Progress", "Created At"].join(","),
      ...userProjects.map((p) => {
        const project = currentUser?.accountType === "investor" ? p.project : p;
        const progress = currentUser?.accountType === "investor" ? p.percentage : project.progress;
        return [
          project?.title || "N/A",
          project?.category?.[lang] || "N/A",
          `${progress}%`,
          project?.createdAt ? new Date(project.createdAt).toISOString().split("T")[0] : "N/A"
        ].join(",");
      }),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = currentUser?.accountType === "investor" ? "my_investments.csv" : "my_projects.csv";
    link.click();
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 ">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-2 md:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {currentUser?.accountType === "investor" ? "My Investments" : "My Projects"}
        </h1>
        <div className="flex flex-wrap gap-2">
          {currentUser?.accountType == "owner" ? (
            <Link
              href={"/account/projects/add"}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={18} /> New Project
            </Link>
          ) : null}
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-2"
          >
            <FileDown size={18} /> Export CSV
          </button>
        </div>
      </header>
      {currentUser?.accountType == "investor" ? (
        <InvestorFilter
          searchQuery={searchQuery}
          onSearchChange={(value) =>
            handleFilterChange(() => setSearchQuery(value))
          }
          selectedCategory={selectedCategory}
          onCategoryChange={(value) =>
            handleFilterChange(() => setSelectedCategory(value))
          }
          selectedStatus={selectedStatus}
          onStatusChange={(value) =>
            handleFilterChange(() => setSelectedStatus(value))
          }
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      ) : (
        <OwnerFilter
          searchQuery={searchQuery}
          onSearchChange={(value) =>
            handleFilterChange(() => setSearchQuery(value))
          }
          selectedCategory={selectedCategory}
          onCategoryChange={(value) =>
            handleFilterChange(() => setSelectedCategory(value))
          }
          selectedStatus={selectedStatus}
          onStatusChange={(value) =>
            handleFilterChange(() => setSelectedStatus(value))
          }
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow p-5 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="h-2 bg-gray-200 rounded mb-3"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button
            onClick={fetchUserProjects}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredAndSortedProjects.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <FolderKanban className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 font-semibold mb-2">
            {userProjects.length === 0
              ? currentUser?.accountType === "investor"
                ? "No investments found"
                : "No projects found"
              : "No projects match your filters"}
          </p>
          {userProjects.length === 0 && currentUser?.accountType === "owner" && (
            <Link
              href="/account/projects/add"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Plus size={18} className="inline mr-2" />
              Create Your First Project
            </Link>
          )}
          {userProjects.length === 0 && currentUser?.accountType === "investor" && (
            <Link
              href="/projects"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Browse Projects
            </Link>
          )}
        </div>
      )}

      {/* Projects Grid */}
      {!loading && !error && filteredAndSortedProjects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedProjects.map((item, index) => {
          const project =
            currentUser?.accountType === "investor" ? item.project : item;
          const percentage =
            currentUser?.accountType === "investor"
              ? item.percentage
              : item.progress; // Owner sees overall progress
          const text1 =
            currentUser?.accountType === "investor"
              ? "Fully owned"
              : currentUser?.accountType === "admin"
              ? "Fully Funded"
              : "Sold";
          const text2 =
            currentUser?.accountType === "investor" ? "Invested" : "Funded";
          return (
            <div
              key={project._id}
              className="bg-white rounded-xl shadow p-5 flex flex-col justify-between hover:shadow-lg transition"
            >
              {/* Project Title */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {project.title}
                </h3>

                {/* Category + Created Date */}
                <div className="flex justify-between text-sm text-gray-500 mb-3">
                  <span>{project.category[lang]}</span>
                  <span>
                    {new Date(project.createdAt).toISOString().split("T")[0]}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="bg-gray-200 h-2 rounded-full">
                    <div
                      className={`h-2 rounded-full ${progressColor(
                        percentage
                      )}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {percentage === 100 ? text1 : `${percentage}% ${text2}`}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-3">
                <Link
                  href={`/projects/${project._id}`}
                  className="text-indigo-600 flex items-center gap-1 hover:underline"
                >
                  <Eye size={16} /> View
                </Link>
                {currentUser?.accountType != "investor" && percentage == 0 && (
                  <button
                    onClick={() => {
                      handleDelete(project._id);
                    }}
                    className="text-red-600 flex items-center gap-1 hover:underline"
                  >
                    <Trash size={16} /> Delete
                  </button>
                )}
                {currentUser?.accountType != "investor" && (
                  <Link
                    href={`/account/projects/edit/${project._id}`}
                    className="text-green-600 flex items-center gap-1 hover:underline"
                  >
                    <Pen size={16} /> Edit
                  </Link>
                )}
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}
