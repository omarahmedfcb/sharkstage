"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FileText, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import AdminBlogsTable from "@/app/components/admin/AdminBlogsTable";
import toast from "react-hot-toast";

export default function AdminBlogsPage() {
  const { currentUser } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
      return;
    }
    if (currentUser.accountType !== "admin") {
      toast.error("Access denied. Admin only.");
      router.push("/account");
      return;
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.accountType !== "admin") {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#0f172a] via-[#1a1a2e] to-[#16213e]">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-6 sm:p-8 mb-8 shadow-2xl border border-[#0f3460]/50"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0f3460]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#16213e]/30 rounded-full blur-3xl" />

          <div className="relative z-10 flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-[#0f3460] to-[#16213e] rounded-2xl shadow-xl border border-[#0f3460]/50">
              <FileText className="text-red-400" size={40} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-yellow-400" size={24} />
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  Blogs Management
                </h1>
              </div>
              <p className="text-gray-300 text-lg">
                Manage all blog posts, view content, and delete posts
              </p>
            </div>
          </div>
        </motion.div>

        {/* Blogs Table */}
        <AdminBlogsTable />
      </div>
    </div>
  );
}
