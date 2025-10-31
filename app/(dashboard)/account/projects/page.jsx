"use client";
import { useState, useEffect, useMemo } from "react";
import { Plus, Eye, FileDown } from "lucide-react";
import Link from "next/link";
import InvestorFilter from "./InvestorFilter";
import { useSelector } from "react-redux";
import OwnerFilter from "./OwnerFilter";
import api from "@/lib/axios";

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
  useEffect(() => {
    if (currentUser) {
      api.get(`/projects/user/${currentUser._id}`).then((res) => {
        setUserProjects(res.data.userProjects);
      });
    }
  }, [currentUser]);

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = [...userProjects];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((project) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    // if (selectedCategory !== "all") {
    //   filtered = filtered.filter(
    //     (project) => project.categoryId === selectedCategory
    //   );
    // }

    // Apply status filter
    if (currentUser?.accountType == "investor") {
      if (selectedStatus == "owned") {
        filtered = filtered.filter((project) => project.progress === 100);
      } else if (selectedStatus == "invested") {
        filtered = filtered.filter((project) => project.progress < 100);
      }
    } else if (currentUser?.accountType == "owner") {
      if (selectedStatus == "sale") {
        filtered = filtered.filter((project) => project.progress == 0);
      } else if (selectedStatus == "invested") {
        filtered = filtered.filter(
          (project) => project.progress < 100 && project.progress > 0
        );
      } else if (selectedStatus == "sold") {
        filtered = filtered.filter((project) => project.progress == 100);
      } else if (selectedStatus == "unlisted") {
        filtered = filtered.filter((project) => project.progress < 0);
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "funding-high":
          return b.fundingGoal - a.fundingGoal;
        case "most-funded":
          return b.currentFunding - a.currentFunding;
        default:
          return 0;
      }
    });

    return filtered;
  }, [userProjects, searchQuery, selectedCategory, selectedStatus, sortBy]);

  const exportCSV = () => {
    const csv = [
      ["Title", "Category", "Progress", "createdAt"].join(","),
      ...userProjects.map((p) =>
        [p.title, p.category, p.progress + "%", p.createdAt].join(",")
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
            <button
              onClick={() => {
                setShowModal(true);
                setEditing(null);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={18} /> New Project
            </button>
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
        {filteredAndSortedProjects.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-xl shadow p-5 flex flex-col justify-between hover:shadow-lg transition"
          >
            {/* Project Title */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {p.title}
              </h3>

              {/* Category + Created Date */}
              <div className="flex justify-between text-sm text-gray-500 mb-3">
                <span>{p.category}</span>
                <span>{new Date(p.createdAt).toISOString().split("T")[0]}</span>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="bg-gray-200 h-2 rounded-full">
                  <div
                    className={`h-2 rounded-full ${progressColor(p.progress)}`}
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {p.progress === 100 ? "Fully Owned" : `${p.progress}% Funded`}
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
