"use client";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { motion } from "framer-motion";

// Dummy data
const statsData = [
  { label: "Projects", value: 12, icon: <ArrowUpRight className="text-green-500" />, color: "blue", progress: 75, trend: "up", trendValue: "15%" },
  { label: "Earnings", value: "$8,450", icon: <ArrowUpRight className="text-green-500" />, color: "green", progress: 60, trend: "up", trendValue: "8%" },
  { label: "Tasks", value: 5, icon: <ArrowDownRight className="text-red-500" />, color: "red", progress: 40, trend: "down", trendValue: "10%" },
];

const barData = [
  { month: "Jan", earnings: 400 },
  { month: "Feb", earnings: 300 },
  { month: "Mar", earnings: 500 },
  { month: "Apr", earnings: 450 },
];

const pieData = [
  { name: "UI/UX", value: 40 },
  { name: "Backend", value: 30 },
  { name: "Frontend", value: 30 },
];

const COLORS = ["#6371dd", "#43d7ad", "#f97316"];

// ====== Color Map for Cards ======
const colorMap = {
  blue: { bg: "bg-blue-100", fill: "#6371dd" },
  green: { bg: "bg-green-100", fill: "#43d7ad" },
  red: { bg: "bg-red-100", fill: "#f97316" },
};

// ====== Stat Card ======
function StatCard({ label, value, icon, color, progress, trend, trendValue }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-br from-white to-gray-50 shadow-xl p-6 rounded-3xl transition-all`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 flex items-center justify-center rounded-full ${colorMap[color].bg}`}>
            {icon}
          </div>
          <span className="text-gray-600 font-medium">{label}</span>
        </div>
        <span className={`text-sm font-semibold ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
          {trend === "up" ? "▲" : "▼"} {trendValue}
        </span>
      </div>
      <div className="text-3xl font-bold mb-3">{value}</div>
      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div
          className="h-2 rounded-full"
          style={{ width: `${progress}%`, backgroundColor: colorMap[color].fill }}
        />
      </div>
    </motion.div>
  );
}

// ====== Overview Page ======
export default function OverviewPage() {
  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-800">Overview Dashboard</h2>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-10">
          {statsData.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Bar Chart */}
          <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Monthly Earnings</h3>
            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="earnings" fill="#6371dd" radius={[10,10,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Task Distribution</h3>
            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} label={({name, percent}) => `${name}: ${(percent*100).toFixed(0)}%`}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
