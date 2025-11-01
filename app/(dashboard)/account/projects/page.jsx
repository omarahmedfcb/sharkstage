"use client";
import { useState, useEffect, useMemo } from "react";
import { Plus, Eye, FileDown, Trash } from "lucide-react";
import Link from "next/link";
import InvestorFilter from "./InvestorFilter";
import { useSelector } from "react-redux";
import OwnerFilter from "./OwnerFilter";
import api from "@/lib/axios";
import toast from "react-hot-toast";
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

  // filteration
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const handleFilterChange = (callback) => {
    callback();
  };
  const [userProjects, setUserProjects] = useState([]);
  const fetchUserProjects = async () => {
    if (!currentUser) return;
    try {
      const res = await api.get(`/projects/user/${currentUser._id}`);
      setUserProjects(res.data.userProjects);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserProjects();
  }, [currentUser]);

  const handleDelete = async (projectId) => {
    try {
      await api.delete(`/projects/delete/${projectId}`);
      toast.success("Project deleted Successfully");
      fetchUserProjects();
    } catch (err) {
      console.error("Failed to delete:", err);
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
        filtered = filtered.filter((item) => item.progress < 0);
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
      ["Title", "Category", "Progress", "createdAt"].join(","),
      ...userProjects.map((p) =>
        [p.title, p.category[lang], p.progress + "%", p.createdAt].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "my_projects.csv";
    link.click();
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 ">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-2 md:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          My Projects
        </h1>
        <div className="flex flex-wrap gap-2">
          {currentUser?.accountType == "owner" ? (
            <Link
              href={"/account/projects/add"}
              onClick={() => {
                setShowModal(true);
                setEditing(null);
              }}
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

      {/* Table */}
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
                  href="#"
                  className="text-indigo-600 flex items-center gap-1 hover:underline"
                >
                  <Eye size={16} /> View
                </Link>
                {currentUser?.accountType != "investor" && (
                  <button
                    onClick={() => {
                      handleDelete(project._id);
                    }}
                    className="text-red-600 flex items-center gap-1 hover:underline"
                  >
                    <Trash size={16} /> Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
