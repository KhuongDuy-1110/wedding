import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { UAParser } from "ua-parser-js";

const COLORS = [
  "#fd848e",
  "#f3425f",
  "#4f46e5",
  "#10b981",
  "#f59e0b",
  "#3b82f6",
];

const AccessCharts = ({ logs }) => {
  const trendsData = useMemo(() => {
    const daily = {};
    // Sort logs by date to ensure chart flows correctly
    const sortedLogs = [...logs].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at),
    );

    sortedLogs.forEach((log) => {
      const date = new Date(log.created_at).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
      if (!daily[date]) daily[date] = { date, visits: 0, total_views: 0 };
      daily[date].visits += 1;
      daily[date].total_views += log.visit_count || 1;
    });
    return Object.values(daily).slice(-10); // Show last 10 days
  }, [logs]);

  const osData = useMemo(() => {
    const counts = {};
    logs.forEach((log) => {
      try {
        const parser = new UAParser(log.user_agent);
        const res = parser.getResult();
        const os = res.os.name || "Unknown";
        counts[os] = (counts[os] || 0) + 1;
      } catch (e) {
        counts["Other"] = (counts["Other"] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [logs]);

  const pathData = useMemo(() => {
    const counts = { "Nhà Trai": 0, "Nhà Gái": 0, Chung: 0 };
    logs.forEach((log) => {
      if (log.path?.includes("/r") || log.path?.includes("/groom"))
        counts["Nhà Trai"]++;
      else if (log.path?.includes("/d") || log.path?.includes("/bride"))
        counts["Nhà Gái"]++;
      else counts["Chung"]++;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [logs]);

  return (
    <div className="flex flex-col gap-6 mb-6">
      {/* Area Chart - Full Width */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 text-sm mb-6 uppercase tracking-wider">
          Xu hướng truy cập (Unique visits)
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendsData}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f3425f" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#f3425f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#9ca3af" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#9ca3af" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "15px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  padding: "12px",
                }}
                itemStyle={{ fontSize: "12px", fontWeight: "bold" }}
              />
              <Area
                type="monotone"
                dataKey="visits"
                name="Khách mới"
                stroke="#f3425f"
                fillOpacity={1}
                fill="url(#colorVisits)"
                strokeWidth={3}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 text-sm mb-6 uppercase tracking-wider">
            Phân bổ nguồn thiệp
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pathData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="value" name="Số khách" radius={[8, 8, 0, 0]}>
                  {pathData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 text-sm mb-6 uppercase tracking-wider">
            Hệ điều hành khách dùng
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={osData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {osData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessCharts;
