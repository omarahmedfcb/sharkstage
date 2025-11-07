"use client";

import { useMemo } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { useDashboardProjects } from "@/lib/hooks/useDashboardProjects";

const toneStyles = {
  primary: {
    badge: "bg-primary/15 text-primary",
    progress: "bg-gradient-to-r from-primary to-secondary",
  },
  secondary: {
    badge: "bg-secondary/15 text-secondary",
    progress: "bg-gradient-to-r from-secondary to-primary",
  },
  warning: {
    badge: "bg-amber-100 text-amber-600",
    progress: "bg-gradient-to-r from-amber-400 to-amber-500",
  },
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatCurrency(value) {
  if (!value || Number.isNaN(value)) return "$0";
  return currency.format(value);
}

function formatPercent(value) {
  if (!value || Number.isNaN(value)) return "0%";
  return `${Math.round(value)}%`;
}

function StatCard({ label, value, icon: Icon, tone, progress, trend }) {
  return (
    <motion.div
      whileHover={{ translateY: -4 }}
      className="group rounded-3xl border border-primary/10 bg-white/90 p-6 shadow-sm transition hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-paragraph">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-heading">{value}</p>
        </div>
        <span className={`grid h-12 w-12 place-items-center rounded-2xl ${toneStyles[tone].badge}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-6 space-y-3">
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div className={`h-full ${toneStyles[tone].progress}`} style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-paragraph">
          <span className={`font-semibold ${trend.direction === "up" ? "text-primary" : "text-red-500"}`}>
            {trend.direction === "up" ? "▲" : "▼"} {trend.value}
          </span>{" "}
          vs last period
        </p>
      </div>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="h-36 rounded-3xl border border-primary/10 bg-white/70 shadow-sm animate-pulse" />
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="h-96 rounded-3xl border border-primary/10 bg-white/70 shadow-sm animate-pulse" />
        <div className="h-96 rounded-3xl border border-primary/10 bg-white/70 shadow-sm animate-pulse" />
      </section>
    </div>
  );
}

export default function OverviewPage() {
  const { role, projects, portfolio, loading, error } = useDashboardProjects();

  const stats = useMemo(() => {
    if (role === "admin") {
      return [
        {
          label: "Platform projects",
          value: portfolio.totalProjects,
          icon: ArrowUpRight,
          tone: "primary",
          progress: 100,
          trend: { direction: "up", value: "Live" },
        },
        {
          label: "Capital under review",
          value: formatCurrency(portfolio.totalCapital),
          icon: ArrowUpRight,
          tone: "secondary",
          progress: 68,
          trend: { direction: "up", value: "5%" },
        },
        {
          label: "Average ROI potential",
          value: formatPercent(portfolio.averageROI),
          icon: ArrowUpRight,
          tone: "warning",
          progress: Math.min(portfolio.averageROI, 100),
          trend: { direction: "up", value: "Stable" },
        },
      ];
    }

    if (role === "owner") {
      return [
        {
          label: "Active projects",
          value: portfolio.totalProjects,
          icon: ArrowUpRight,
          tone: "primary",
          progress: 100,
          trend: { direction: "up", value: "3 new" },
        },
        {
          label: "Capital sought",
          value: formatCurrency(portfolio.totalCapital),
          icon: ArrowUpRight,
          tone: "secondary",
          progress: 60,
          trend: { direction: "up", value: "12%" },
        },
        {
          label: "Average progress",
          value: formatPercent(portfolio.averageProgress),
          icon: ArrowUpRight,
          tone: "warning",
          progress: portfolio.averageProgress,
          trend: { direction: "up", value: "4%" },
        },
      ];
    }

    return [
      {
        label: "Invested capital",
        value: formatCurrency(portfolio.investedCapital),
        icon: ArrowUpRight,
        tone: "primary",
        progress: 65,
        trend: { direction: "up", value: "8%" },
      },
      {
        label: "Portfolio projects",
        value: portfolio.totalProjects,
        icon: ArrowUpRight,
        tone: "secondary",
        progress: 100,
        trend: { direction: "up", value: "1 new" },
      },
      {
        label: "Avg. ROI",
        value: formatPercent(portfolio.averageROI),
        icon: portfolio.averageROI >= 0 ? ArrowUpRight : ArrowDownRight,
        tone: "warning",
        progress: Math.min(portfolio.averageROI, 100),
        trend: {
          direction: portfolio.averageROI >= 0 ? "up" : "down",
          value: portfolio.averageROI >= 0 ? "Healthy" : "Review",
        },
      },
    ];
  }, [portfolio, role]);

  const earningsData = useMemo(() => {
    if (!projects.length) return [];
    const grouped = projects.reduce((acc, project) => {
      const date = new Date(project.updatedAt);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const amount =
        role === "investor" && project.investedPercentage
          ? ((project.totalPrice ?? 0) * project.investedPercentage) / 100
          : project.currentFunding || project.totalPrice || 0;

      acc[key] = (acc[key] ?? 0) + amount;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([key, value]) => {
        const [year, month] = key.split("-").map(Number);
        const date = new Date(year, month - 1);
        return {
          month: date.toLocaleDateString("en", { month: "short" }),
          earnings: value,
          timestamp: date.getTime(),
        };
      })
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [projects, role]);

  const allocationData = useMemo(() => {
    if (!projects.length) return [];
    const grouped = projects.reduce((acc, project) => {
      const category = project.category ?? "General";
      acc[category] = (acc[category] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [projects]);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}. Showing curated sample data until the connection is restored.
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <motion.div
          whileHover={{ translateY: -2 }}
          className="rounded-3xl border border-primary/10 bg-white/90 p-6 shadow-sm"
        >
          <header className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-heading">Monthly performance</h3>
              <p className="text-sm text-paragraph">
                Track the momentum of your SharkStage portfolio over time.
              </p>
            </div>
            <button className="rounded-full border border-primary/20 px-3 py-1 text-xs font-semibold text-primary transition hover:border-primary/60">
              Download report
            </button>
          </header>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData}>
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="earnings" fill="#3a5a92" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ translateY: -2 }}
          className="rounded-3xl border border-primary/10 bg-white/90 p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-heading">Capital allocation</h3>
          <p className="text-sm text-paragraph">
            Diversify across sectors to balance risk and compound returns.
          </p>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={6}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={entry.name} fill={["#3a5a92", "#6fa8dc", "#f2c94c", "#ffa94d"][index % 4]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={32} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
