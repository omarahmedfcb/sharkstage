"use client";
import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, FolderKanban, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { getInvestorDashboard, getOwnerDashboard } from "@/lib/api/dashboard.api";
import toast from "react-hot-toast";

const COLORS = ["#6371dd", "#43d7ad", "#f97316", "#f59e0b", "#8b5cf6", "#ec4899"];

// ====== Color Map for Cards ======
const colorMap = {
  blue: { bg: "bg-blue-100", fill: "#6371dd" },
  green: { bg: "bg-green-100", fill: "#43d7ad" },
  red: { bg: "bg-red-100", fill: "#f97316" },
  purple: { bg: "bg-purple-100", fill: "#8b5cf6" },
};

// ====== Stat Card ======
function StatCard({ label, value, icon, color, progress }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-br from-white to-gray-50 shadow-xl p-6 rounded-3xl transition-all`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 flex items-center justify-center rounded-full ${colorMap[color]?.bg || colorMap.blue.bg}`}>
            {icon}
          </div>
          <span className="text-gray-600 font-medium">{label}</span>
        </div>
      </div>
      <div className="text-3xl font-bold mb-3">{value}</div>
      {progress !== undefined && (
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: colorMap[color]?.fill || colorMap.blue.fill }}
          />
        </div>
      )}
    </motion.div>
  );
}

// ====== Loading Skeleton ======
function LoadingSkeleton() {
  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto">
        <div className="h-8 bg-gray-200 rounded w-64 mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white shadow-xl p-6 rounded-3xl">
              <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
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
      <div className="p-4 sm:p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
      <div className="p-4 sm:p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <p className="text-gray-600">No data available</p>
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
        icon: <DollarSign className="text-green-500" size={24} />,
        color: "green",
        progress: stats.totalInvestments > 0 ? (stats.activeInvestments / stats.totalInvestments) * 100 : 0,
      },
      {
        label: "Expected Returns",
        value: `$${stats.totalExpectedReturns.toLocaleString()}`,
        icon: <TrendingUp className="text-blue-500" size={24} />,
        color: "blue",
        progress: stats.averageROI,
      },
      {
        label: "Active Investments",
        value: stats.activeInvestments,
        icon: <FolderKanban className="text-purple-500" size={24} />,
        color: "purple",
        progress: stats.totalInvestments > 0 ? (stats.activeInvestments / stats.totalInvestments) * 100 : 0,
      },
    ];
  } else if (currentUser?.accountType === "owner") {
    statsCards = [
      {
        label: "Total Projects",
        value: stats.totalProjects,
        icon: <FolderKanban className="text-blue-500" size={24} />,
        color: "blue",
        progress: stats.totalProjects > 0 ? (stats.activeProjects / stats.totalProjects) * 100 : 0,
      },
      {
        label: "Funding Received",
        value: `$${stats.totalFundingReceived.toLocaleString()}`,
        icon: <DollarSign className="text-green-500" size={24} />,
        color: "green",
        progress: stats.totalFundingGoal > 0 ? (stats.totalFundingReceived / stats.totalFundingGoal) * 100 : 0,
      },
      {
        label: "Total Investors",
        value: stats.totalInvestors,
        icon: <Users className="text-purple-500" size={24} />,
        color: "purple",
        progress: stats.totalProjects > 0 ? (stats.totalInvestors / (stats.totalProjects * 5)) * 100 : 0, // Assuming max 5 investors per project
      },
    ];
  }

  // Prepare chart data
  const chartData = currentUser?.accountType === "investor" ? investmentHistory : fundingHistory;
  const pieData = categoryDistribution || [];

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-800">
          {currentUser?.accountType === "investor" ? "Investor Dashboard" : "Owner Dashboard"}
        </h2>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-10">
          {statsCards.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              {currentUser?.accountType === "investor" ? "Monthly Investments" : "Monthly Funding"}
            </h3>
            <div className="w-full h-64 sm:h-72">
              {chartData && chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      formatter={(value) => `$${value.toLocaleString()}`}
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                    />
                    <Bar dataKey="amount" fill="#6371dd" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No data available
                </div>
              )}
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Category Distribution</h3>
            <div className="w-full h-64 sm:h-72">
              {pieData && pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={80}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No data available
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
