"use client";
import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, FolderKanban, Users, Sparkles, ArrowUpRight, ArrowDownRight, Plus, Search, BarChart3, Settings } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Area, AreaChart } from "recharts";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { getInvestorDashboard, getOwnerDashboard } from "@/lib/api/dashboard.api";
import toast from "react-hot-toast";
import Link from "next/link";

const COLORS = ["#3a5a92", "#6fa8dc", "#f2c94c", "#8b5cf6", "#ec4899", "#10b981"];

// ====== Enhanced Stat Card with Glassmorphism ======
function StatCard({ label, value, icon, color, progress, trend, trendValue }) {
  const gradientMap = {
    blue: "from-blue-500/20 to-blue-600/10",
    green: "from-green-500/20 to-green-600/10",
    purple: "from-purple-500/20 to-purple-600/10",
    yellow: "from-yellow-500/20 to-yellow-600/10",
  };

  const iconBgMap = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    yellow: "from-yellow-500 to-yellow-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-lg shadow-xl border border-white/20"
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientMap[color] || gradientMap.blue} opacity-50`} />
      
      {/* Content */}
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${iconBgMap[color] || iconBgMap.blue} flex items-center justify-center shadow-lg`}>
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span className="text-xs font-semibold">{trendValue}</span>
            </div>
          )}
        </div>
        
        <div className="mb-2">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        </div>
        
        {progress !== undefined && (
          <div className="mt-4">
            <div className="w-full bg-gray-200/50 h-2.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full bg-gradient-to-r ${iconBgMap[color] || iconBgMap.blue} shadow-lg`}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}%</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ====== Hero Section ======
function DashboardHero({ currentUser, accountType }) {
  const greeting = new Date().getHours() < 12 ? "Good Morning" : new Date().getHours() < 18 ? "Good Afternoon" : "Good Evening";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3a5a92] via-[#6fa8dc] to-[#8b5cf6] p-8 mb-8 shadow-2xl"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="text-yellow-300" size={28} />
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            {greeting}, {currentUser?.firstName || "User"}!
          </h1>
        </div>
        <p className="text-white/90 text-lg mb-6">
          {accountType === "investor"
            ? "Track your investments and watch your portfolio grow"
            : "Manage your projects and connect with investors"}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={accountType === "investor" ? "/projects" : "/account/projects/add"}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all shadow-lg hover:shadow-xl"
          >
            {accountType === "investor" ? "Browse Projects" : "Add New Project"}
          </Link>
          <Link
            href="/account/projects"
            className="px-6 py-3 bg-white text-[#3a5a92] rounded-xl font-semibold hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
          >
            View {accountType === "investor" ? "Investments" : "Projects"}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ====== Enhanced Loading Skeleton ======
function LoadingSkeleton() {
  return (
    <div className="p-4 sm:p-6 min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Hero Skeleton */}
        <div className="h-48 rounded-3xl mb-8 animate-shimmer" />
        
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
              <div className="h-20 rounded-xl animate-shimmer" />
            </div>
          ))}
        </div>
        
        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
              <div className="h-72 rounded-xl animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ====== Overview Page ======
export default function OverviewPage() {
  const { currentUser } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let response;
        if (currentUser.accountType === "investor") {
          response = await getInvestorDashboard();
        } else if (currentUser.accountType === "owner") {
          response = await getOwnerDashboard();
        } else {
          setError("Dashboard not available for this account type");
          setLoading(false);
          return;
        }

        if (response.success) {
          setDashboardData(response.data);
        } else {
          setError("Failed to load dashboard data");
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err);
        setError(err.response?.data?.message || "Failed to load dashboard data");
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center shadow-xl">
            <p className="text-red-600 font-semibold text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-4 sm:p-6 min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-8 text-center shadow-xl">
            <p className="text-gray-600 text-lg">No data available</p>
          </div>
        </div>
      </div>
    );
  }

  const { stats, investmentHistory, fundingHistory, categoryDistribution } = dashboardData;

  // Prepare stats cards based on account type
  let statsCards = [];
  if (currentUser?.accountType === "investor") {
    statsCards = [
      {
        label: "Total Invested",
        value: `$${stats.totalInvested.toLocaleString()}`,
        icon: <DollarSign className="text-white" size={28} />,
        color: "green",
        progress: stats.totalInvestments > 0 ? (stats.activeInvestments / stats.totalInvestments) * 100 : 0,
        trend: "up",
        trendValue: `${stats.totalInvestments} investments`,
      },
      {
        label: "Expected Returns",
        value: `$${stats.totalExpectedReturns.toLocaleString()}`,
        icon: <TrendingUp className="text-white" size={28} />,
        color: "blue",
        progress: stats.averageROI,
        trend: "up",
        trendValue: `${stats.averageROI.toFixed(1)}% ROI`,
      },
      {
        label: "Active Investments",
        value: stats.activeInvestments,
        icon: <FolderKanban className="text-white" size={28} />,
        color: "purple",
        progress: stats.totalInvestments > 0 ? (stats.activeInvestments / stats.totalInvestments) * 100 : 0,
        trend: stats.activeInvestments > 0 ? "up" : null,
        trendValue: stats.activeInvestments > 0 ? `${stats.completedInvestments} completed` : null,
      },
    ];
  } else if (currentUser?.accountType === "owner") {
    statsCards = [
      {
        label: "Total Projects",
        value: stats.totalProjects,
        icon: <FolderKanban className="text-white" size={28} />,
        color: "blue",
        progress: stats.totalProjects > 0 ? (stats.activeProjects / stats.totalProjects) * 100 : 0,
        trend: "up",
        trendValue: `${stats.activeProjects} active`,
      },
      {
        label: "Funding Received",
        value: `$${stats.totalFundingReceived.toLocaleString()}`,
        icon: <DollarSign className="text-white" size={28} />,
        color: "green",
        progress: stats.totalFundingGoal > 0 ? (stats.totalFundingReceived / stats.totalFundingGoal) * 100 : 0,
        trend: "up",
        trendValue: `${((stats.totalFundingReceived / stats.totalFundingGoal) * 100).toFixed(1)}% funded`,
      },
      {
        label: "Total Investors",
        value: stats.totalInvestors,
        icon: <Users className="text-white" size={28} />,
        color: "purple",
        progress: stats.totalProjects > 0 ? (stats.totalInvestors / (stats.totalProjects * 5)) * 100 : 0,
        trend: stats.totalInvestors > 0 ? "up" : null,
        trendValue: stats.totalInvestors > 0 ? `${stats.completedProjects} completed` : null,
      },
    ];
  }

  // Prepare chart data
  const chartData = currentUser?.accountType === "investor" ? investmentHistory : fundingHistory;
  const pieData = categoryDistribution || [];

  return (
    <div className="p-4 sm:p-6 min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <DashboardHero currentUser={currentUser} accountType={currentUser?.accountType} />

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {currentUser?.accountType === "owner" ? (
            <>
              <Link
                href="/account/projects/add"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3a5a92] to-[#6fa8dc] p-6 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Plus className="text-white" size={24} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">Add Project</h3>
                  <p className="text-white/80 text-sm">Create new project</p>
                </div>
              </Link>
              <Link
                href="/account/projects"
                className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-lg p-6 shadow-xl hover:shadow-2xl border border-white/20 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#3a5a92]/5 to-[#6fa8dc]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#3a5a92] to-[#6fa8dc] rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <FolderKanban className="text-white" size={24} />
                  </div>
                  <h3 className="text-gray-800 font-bold text-lg mb-1">My Projects</h3>
                  <p className="text-gray-600 text-sm">View all projects</p>
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/projects"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3a5a92] to-[#6fa8dc] p-6 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Search className="text-white" size={24} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">Browse Projects</h3>
                  <p className="text-white/80 text-sm">Find investments</p>
                </div>
              </Link>
              <Link
                href="/account/projects"
                className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-lg p-6 shadow-xl hover:shadow-2xl border border-white/20 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#3a5a92]/5 to-[#6fa8dc]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#3a5a92] to-[#6fa8dc] rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <FolderKanban className="text-white" size={24} />
                  </div>
                  <h3 className="text-gray-800 font-bold text-lg mb-1">My Investments</h3>
                  <p className="text-gray-600 text-sm">View portfolio</p>
                </div>
              </Link>
            </>
          )}
          <Link
            href="/account"
            className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-lg p-6 shadow-xl hover:shadow-2xl border border-white/20 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#3a5a92]/5 to-[#6fa8dc]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3a5a92] to-[#6fa8dc] rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <BarChart3 className="text-white" size={24} />
              </div>
              <h3 className="text-gray-800 font-bold text-lg mb-1">Analytics</h3>
              <p className="text-gray-600 text-sm">View reports</p>
            </div>
          </Link>
          <Link
            href="/account/profile"
            className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-lg p-6 shadow-xl hover:shadow-2xl border border-white/20 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#3a5a92]/5 to-[#6fa8dc]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3a5a92] to-[#6fa8dc] rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Settings className="text-white" size={24} />
              </div>
              <h3 className="text-gray-800 font-bold text-lg mb-1">Settings</h3>
              <p className="text-gray-600 text-sm">Manage account</p>
            </div>
          </Link>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {statsCards.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Enhanced Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20"
          >
            <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <TrendingUp className="text-[#3a5a92]" size={24} />
              {currentUser?.accountType === "investor" ? "Monthly Investments" : "Monthly Funding"}
            </h3>
            <div className="w-full h-72">
              {chartData && chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3a5a92" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#6fa8dc" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      formatter={(value) => `$${value.toLocaleString()}`}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#3a5a92"
                      strokeWidth={3}
                      fill="url(#colorAmount)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <FolderKanban size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No data available</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Enhanced Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20"
          >
            <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <FolderKanban className="text-[#3a5a92]" size={24} />
              Category Distribution
            </h3>
            <div className="w-full h-72">
              {pieData && pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      {pieData.map((entry, index) => (
                        <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.9} />
                          <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.6} />
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                      ))}
                    </Pie>
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => <span className="text-sm font-medium">{value}</span>}
                    />
                    <Tooltip
                      formatter={(value) => `$${value.toLocaleString()}`}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <FolderKanban size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No data available</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
