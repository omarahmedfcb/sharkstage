"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  fetchAllProjects,
  fetchProjectsForUser,
  fetchProjectById,
} from "@/lib/api/projects";

const FALLBACK_PROJECTS = [
  {
    id: "fallback-101",
    title: "Smart City Infrastructure – Dubai",
    totalPrice: 5000000,
    currentFunding: 3750000,
    progress: 65,
    expectedROI: 22,
    status: "active",
    category: { en: "Technology" },
    owner: { firstName: "Ahmed", lastName: "Hassan" },
    updatedAt: "2025-06-20T00:00:00.000Z",
  },
  {
    id: "fallback-102",
    title: "Solar Energy Farms Network – Egypt",
    totalPrice: 8000000,
    currentFunding: 6400000,
    progress: 52,
    expectedROI: 18,
    status: "active",
    category: { en: "Green Energy" },
    owner: { firstName: "Mohamed", lastName: "Saleh" },
    updatedAt: "2025-05-14T00:00:00.000Z",
  },
  {
    id: "fallback-103",
    title: "AI Diagnostics Platform",
    totalPrice: 3000000,
    currentFunding: 2100000,
    progress: 48,
    expectedROI: 28,
    status: "active",
    category: { en: "AI & Automation" },
    owner: { firstName: "Lisa", lastName: "Chen" },
    updatedAt: "2025-04-08T00:00:00.000Z",
  },
];

function normalizeProject(entry, role) {
  const project = entry?.project ?? entry;
  if (!project) return null;
  const id = project._id || project.id || entry.id;
  const category =
    typeof project.category === "string"
      ? project.category
      : project.category?.en || project.category?.id || "General";
  const ownerName =
    typeof project.owner === "object"
      ? `${project.owner?.firstName ?? ""} ${project.owner?.lastName ?? ""}`.trim()
      : "";

  return {
    id,
    raw: project,
    title: project.title ?? "Untitled project",
    totalPrice: project.totalPrice ?? 0,
    currentFunding: project.currentFunding ?? 0,
    progress: project.progress ?? 0,
    expectedROI:
      project.expectedROI ??
      (typeof project.roi === "string" ? parseInt(project.roi, 10) : project.roi ?? 0),
    status: project.status ?? "active",
    category,
    ownerName,
    updatedAt: project.updatedAt ?? project.createdAt ?? new Date().toISOString(),
    investedPercentage: role === "investor" ? entry?.percentage ?? 0 : undefined,
  };
}

export function useDashboardProjects({ eager = true } = {}) {
  const { currentUser } = useSelector((state) => state.auth);
  const [projects, setProjects] = useState(FALLBACK_PROJECTS.map((p) => normalizeProject(p, "admin")));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const role = currentUser?.accountType ?? "investor";
  const userId = currentUser?._id;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!eager || !userId) return;
      setLoading(true);
      setError(null);
      try {
        let fetched = [];
        if (role === "admin") {
          fetched = await fetchAllProjects();
        } else if (role === "owner") {
          fetched = await fetchProjectsForUser(userId);
        } else if (role === "investor") {
          const invested = await fetchProjectsForUser(userId);
          const withDetails = await Promise.all(
            invested.map(async (item) => {
              if (item?.project?._id) return item;
              try {
                const project = await fetchProjectById(item?.project);
                return { ...item, project };
              } catch (projectError) {
                console.error(projectError);
                return null;
              }
            })
          );
          fetched = withDetails.filter(Boolean);
        }

        if (cancelled) return;
        const normalized = fetched
          .map((entry) => normalizeProject(entry, role))
          .filter(Boolean);

        setProjects(normalized.length ? normalized : FALLBACK_PROJECTS.map((p) => normalizeProject(p, "admin")));
      } catch (fetchError) {
        console.error(fetchError);
        if (!cancelled) {
          setError(fetchError.message || "Unable to load projects");
          setProjects(FALLBACK_PROJECTS.map((p) => normalizeProject(p, "admin")));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [eager, role, userId]);

  const portfolio = useMemo(() => {
    if (!projects.length) {
      return {
        totalProjects: 0,
        totalCapital: 0,
        averageProgress: 0,
        averageROI: 0,
        investedCapital: 0,
      };
    }

    const totalProjects = projects.length;
    const totals = projects.reduce(
      (acc, project) => {
        acc.capital += project.totalPrice ?? 0;
        acc.progress += project.progress ?? 0;
        acc.roi += project.expectedROI ?? 0;
        if (role === "investor" && project.investedPercentage) {
          acc.invested += ((project.totalPrice ?? 0) * project.investedPercentage) / 100;
        }
        return acc;
      },
      { capital: 0, progress: 0, roi: 0, invested: 0 }
    );

    return {
      totalProjects,
      totalCapital: totals.capital,
      averageProgress: totals.progress / totalProjects,
      averageROI: totals.roi / totalProjects,
      investedCapital: totals.invested,
    };
  }, [projects, role]);

  return {
    role,
    projects,
    portfolio,
    loading,
    error,
  };
}

