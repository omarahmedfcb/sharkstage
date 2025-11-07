"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash, Edit, Eye, FileDown } from "lucide-react";
import { useDashboardProjects } from "@/lib/hooks/useDashboardProjects";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const formatCurrency = (value) => currency.format(value ?? 0);

const progressTone = (value) => {
  if (value >= 70) return "bg-gradient-to-r from-primary to-secondary";
  if (value >= 40) return "bg-gradient-to-r from-amber-400 to-amber-500";
  return "bg-gradient-to-r from-red-400 to-red-500";
};

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function LoadingState() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="h-28 rounded-3xl border border-primary/10 bg-white/70 shadow-sm animate-pulse" />
      <div className="h-[480px] rounded-3xl border border-primary/10 bg-white/70 shadow-sm animate-pulse" />
    </div>
  );
}

export default function ProjectsPage() {
  const { role, projects: fetchedProjects, loading, error } = useDashboardProjects();
  const [projects, setProjects] = useState(fetchedProjects);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const canManage = role === "owner" || role === "admin";

  useEffect(() => {
    setProjects(fetchedProjects);
  }, [fetchedProjects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const haystack = `${project.title} ${project.category}`.toLowerCase();
      return haystack.includes(search.toLowerCase());
    });
  }, [projects, search]);

  const handleDelete = (id) => {
    if (!canManage) return;
    if (confirm("Are you sure you want to archive this project?")) {
      setProjects((prev) => prev.filter((project) => project.id !== id));
    }
  };

  const handleSave = (formData) => {
    if (!canManage) return;
    if (editing) {
      setProjects((prev) =>
        prev.map((project) => (project.id === editing.id ? { ...project, ...formData } : project))
      );
    } else {
      setProjects((prev) => [...prev, { id: Date.now().toString(), ...formData }]);
    }
    setShowModal(false);
    setEditing(null);
  };

  const exportCSV = () => {
    const csv = [
      ["Title", "Category", "Progress", "Funding goal", "Status", "Updated"].join(","),
      ...projects.map((project) =>
        [
          project.title,
          project.category,
          `${project.progress}%`,
          project.totalPrice ?? 0,
          project.status,
          formatDate(project.updatedAt),
        ].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sharkstage_projects.csv";
    link.click();
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}. Displaying cached portfolio snapshot until the API becomes available.
        </div>
      )}

      <header className="flex flex-col gap-4 rounded-3xl border border-primary/10 bg-white/90 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-heading md:text-3xl">
            {role === "owner" ? "Project workspace" : "Portfolio overview"}
          </h1>
          <p className="mt-1 text-sm text-paragraph">
            {role === "owner"
              ? "Monitor owned projects, track progress, and coordinate with investors."
              : role === "admin"
              ? "Manage every project on SharkStage with instant insight into capital flow."
              : "Review your current investments and follow their momentum across SharkStage."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              if (!canManage) return;
              setShowModal(true);
              setEditing(null);
            }}
            disabled={!canManage}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition ${
              canManage
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Plus size={16} /> New project
          </button>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-primary/20 px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary/40"
          >
            <FileDown size={16} /> Export CSV
          </button>
        </div>
      </header>

      <div className="rounded-3xl border border-primary/10 bg-white/90 p-4 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Search projects by name or category..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-2xl border border-primary/20 bg-white px-4 py-2 text-sm text-heading shadow-sm placeholder:text-paragraph/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 md:max-w-md"
          />
          <div className="flex flex-wrap gap-2 text-xs text-paragraph">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
              Listed ({filteredProjects.length})
            </span>
            <span className="rounded-full bg-soft/70 px-3 py-1 text-heading/70">
              {role === "investor" ? "Committed capital" : "Pending approvals"}
            </span>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-paragraph">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Funding goal</th>
                <th className="px-4 py-3">Progress</th>
                {role === "investor" && <th className="px-4 py-3">My stake</th>}
                {role !== "investor" && <th className="px-4 py-3">Status</th>}
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10 text-sm text-heading">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="transition hover:bg-primary/5">
                  <td className="px-4 py-3">
                    <div className="font-semibold">{project.title}</div>
                    {project.ownerName && (
                      <p className="text-xs text-paragraph">by {project.ownerName}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {project.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-paragraph">
                    {formatCurrency(project.totalPrice ?? 0)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full ${progressTone(project.progress)}`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-paragraph">{project.progress}%</span>
                    </div>
                  </td>
                  {role === "investor" && (
                    <td className="px-4 py-3 text-paragraph">
                      {project.investedPercentage ? `${project.investedPercentage}%` : "—"}
                    </td>
                  )}
                  {role !== "investor" && (
                    <td className="px-4 py-3 text-xs uppercase tracking-wide text-paragraph">
                      {project.status}
                    </td>
                  )}
                  <td className="px-4 py-3 text-paragraph">{formatDate(project.updatedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button className="inline-flex items-center gap-1 rounded-full border border-primary/20 px-3 py-1 text-xs font-semibold text-primary transition hover:border-primary/40">
                        <Eye size={14} /> Details
                      </button>
                      <button
                        onClick={() => {
                          if (!canManage) return;
                          setEditing(project);
                          setShowModal(true);
                        }}
                        disabled={!canManage}
                        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                          canManage
                            ? "border-secondary/20 text-secondary hover:border-secondary/40"
                            : "border-gray-200 text-gray-300 cursor-not-allowed"
                        }`}
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={!canManage}
                        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                          canManage
                            ? "border-red-200 text-red-500 hover:border-red-300"
                            : "border-gray-200 text-gray-300 cursor-not-allowed"
                        }`}
                      >
                        <Trash size={14} /> Archive
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={role === "investor" ? 7 : 7} className="px-4 py-8 text-center text-sm text-paragraph">
                    No projects match your filters yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-primary/10 bg-white/95 p-6 shadow-xl">
            <header className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-heading">
                {editing ? "Edit project" : "Create project"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditing(null);
                }}
                className="rounded-full border border-primary/20 px-2 py-1 text-xs text-primary hover:border-primary/40"
              >
                Close
              </button>
            </header>
            <form
              className="mt-6 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                handleSave({
                  title: formData.get("title"),
                  category: formData.get("category"),
                  progress: Number(formData.get("progress") ?? 0),
                  totalPrice: Number(formData.get("totalPrice") ?? 0),
                  status: editing?.status ?? "active",
                  updatedAt: new Date().toISOString(),
                });
              }}
            >
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-paragraph">
                  Project title
                </label>
                <input
                  name="title"
                  defaultValue={editing?.title ?? ""}
                  required
                  className="w-full rounded-2xl border border-primary/20 bg-white px-4 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-paragraph">
                  Category
                </label>
                <input
                  name="category"
                  defaultValue={editing?.category ?? ""}
                  required
                  className="w-full rounded-2xl border border-primary/20 bg-white px-4 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-paragraph">
                    Progress %
                  </label>
                  <input
                    name="progress"
                    type="number"
                    min={0}
                    max={100}
                    defaultValue={editing?.progress ?? 0}
                    required
                    className="w-full rounded-2xl border border-primary/20 bg-white px-4 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-paragraph">
                    Funding goal (USD)
                  </label>
                  <input
                    name="totalPrice"
                    type="number"
                    min={0}
                    defaultValue={editing?.totalPrice ?? 0}
                    required
                    className="w-full rounded-2xl border border-primary/20 bg-white px-4 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditing(null);
                  }}
                  className="rounded-xl border border-primary/20 px-4 py-2 text-sm font-semibold text-paragraph transition hover:border-primary/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
                >
                  Save project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
