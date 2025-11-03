"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import OffersCards from "./OffersCards";
const lang = "en";

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
  const [userOffers, setUserOffers] = useState([]);
  const fetchUserOffers = async () => {
    if (!currentUser) return;
    try {
      if (currentUser.accountType == "investor") {
        const res = await api.get(`/offers/sent`);
        setUserOffers(res.data.offers);
      }
      if (currentUser.accountType == "owner") {
        const res = await api.get(`/offers/received`);
        setUserOffers(res.data.offers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserOffers();
  }, [currentUser]);

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = [...userOffers];

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
    userOffers,
    searchQuery,
    selectedCategory,
    selectedStatus,
    sortBy,
    currentUser,
  ]);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 ">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-2 md:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          My Offers
        </h1>
      </header>

      {/* Table */}

      <OffersCards
        userOffers={userOffers}
        currentUser={currentUser}
        fetchUserOffers={fetchUserOffers}
      />
    </div>
  );
}
