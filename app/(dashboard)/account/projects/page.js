"use client";
import { useState, useEffect } from "react";
import { Plus, Trash, Edit, Eye, FileDown } from "lucide-react";

// Original mock projects
const initialProjects = [
  { id: 101, title: "Design Dashboard UI", progress: 15, category: "UI/UX", due: "2025-10-22" },
  { id: 102, title: "API Integration", progress: 55, category: "Backend", due: "2025-11-01" },
  { id: 103, title: "Marketing Landing Page", progress: 90, category: "Frontend", due: "2025-11-15" },
];

// Status color function
const progressColor = (p) =>
  p > 70 ? "bg-green-400" : p > 50 ? "bg-yellow-400" : "bg-red-400";

export default function ProjectsPage() {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("projects");
    return saved ? JSON.parse(saved) : initialProjects;
  });
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (confirm("Are you sure?")) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSave = (project) => {
    if (editing) {
      setProjects((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...p, ...project } : p))
      );
    } else {
      setProjects((prev) => [...prev, { id: Date.now(), ...project }]);
    }
    setShowModal(false);
    setEditing(null);
  };

  const exportCSV = () => {
    const csv = [
      ["Title", "Category", "Progress", "Due"].join(","),
      ...projects.map((p) => [p.title, p.category, p.progress + "%", p.due].join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "my_projects.csv";
    link.click();
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-2 md:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Projects</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setShowModal(true); setEditing(null); }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={18} /> New Project
          </button>
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-2"
          >
            <FileDown size={18} /> Export CSV
          </button>
        </div>
      </header>

      {/* Search */}
      <input
        type="text"
        placeholder="Search projects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* Table */}
      <div className="overflow-x-auto md:overflow-x-visible rounded-lg shadow bg-white">
        <table className="w-full md:table-fixed table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Progress</th>
              <th className="p-3 text-left">Due</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3 break-words">{p.title}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3 w-32">
                  <div className="bg-gray-200 h-2 rounded-full">
                    <div
                      className={`h-2 rounded-full ${progressColor(p.progress)}`}
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </td>
                <td className="p-3">{p.due}</td>
                <td className="p-3 flex flex-wrap gap-2">
                  <button className="text-indigo-600 flex items-center gap-1"><Eye size={16}/> View</button>
                  <button
                    onClick={() => { setEditing(p); setShowModal(true); }}
                    className="text-green-600 flex items-center gap-1"
                  >
                    <Edit size={16}/> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600 flex items-center gap-1"
                  >
                    <Trash size={16}/> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">{editing ? "Edit Project" : "New Project"}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = new FormData(e.target);
                handleSave({
                  title: form.get("title"),
                  category: form.get("category"),
                  progress: parseInt(form.get("progress")),
                  due: form.get("due"),
                });
              }}
              className="space-y-3"
            >
              <input
                name="title"
                placeholder="Title"
                defaultValue={editing?.title}
                className="border p-2 rounded w-full"
                required
              />
              <input
                name="category"
                placeholder="Category"
                defaultValue={editing?.category}
                className="border p-2 rounded w-full"
                required
              />
              <input
                name="progress"
                type="number"
                min="0"
                max="100"
                placeholder="Progress %"
                defaultValue={editing?.progress}
                className="border p-2 rounded w-full"
                required
              />
              <input
                name="due"
                type="date"
                defaultValue={editing?.due}
                className="border p-2 rounded w-full"
                required
              />
              <div className="flex flex-wrap justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditing(null); }}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
