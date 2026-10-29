"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const colors = {
  "FULLY MATCHED": "#16a34a",
  "PARTIALLY MATCHED": "#f59e0b",
  RECONCILED: "#3b82f6",
  MISMATCHED: "#ef4444",
  "AP & GL MATCHED": "#7026b6",
  "AP & BANK MATCHED": "#30ce81",
  "GL & BANK MATCHED": "#aaa42a",
  "AP ONLY": "#2ebfc4",
  "GL ONLY": "#9241cf",
  "BANK ONLY": "#d60db4",
};

const getColor = (name) => colors[name] || "#64748b";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        const res = await axios.get("/api/report", {
          signal: controller.signal,
        });

        const records = Array.isArray(res.data) ? res.data : res.data?.data;

        if (!Array.isArray(records)) {
          throw new Error("Invalid API response");
        }

        setData(records);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error(err);
        setError("Unable to load dashboard");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => controller.abort();
  }, []);

  // 1. Status-wise counts
  const statusData = useMemo(() => {
    const counts = {};

    data.forEach((item) => {
      const status = String(item.status ?? item.STATUS ?? "UNKNOWN")
        .trim()
        .toUpperCase();

      counts[status] = (counts[status] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [data]);

  // 2. Monthly reconciliation trend
  const monthlyData = useMemo(() => {
    const months = {};

    data.forEach((item) => {
      const dateValue =
        item.transfer_date ??
        item.TRANSFER_DATE ??
        item.ap_gl_date ??
        item.AP_GL_DATE ??
        item.gl_trx_date ??
        item.GL_TRX_DATE;

      if (!dateValue) return;

      const date = new Date(dateValue);
      if (Number.isNaN(date.getTime())) return;

      const month = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, "0")}`;

      const status = String(item.status ?? item.STATUS ?? "")
        .trim()
        .toUpperCase();

      if (!months[month]) {
        months[month] = {
          month,
          total: 0,
          matched: 0,
          mismatched: 0,
        };
      }

      months[month].total++;

      if (status === "FULLY MATCHED" || status === "RECONCILED") {
        months[month].matched++;
      }

      if (status === "MISMATCHED") {
        months[month].mismatched++;
      }
    });

    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
  }, [data]);

  const total = data.length;

  const matched = statusData
    .filter((s) => ["FULLY MATCHED", "RECONCILED"].includes(s.name))
    .reduce((sum, s) => sum + s.value, 0);

  const mismatched =
    statusData.find((s) => s.name === "MISMATCHED")?.value || 0;

  const matchRate = total ? ((matched / total) * 100).toFixed(1) : "0.0";

  const cardStyle = {
    background: "#ffffff",
    padding: 20,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    minWidth: 0,
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
    gap: 20,
    marginTop: 20,
  };

  if (loading) return <p>Loading Dashboard...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      style={{
        padding: 24,
        background: "#f3f4f6",
        minHeight: "100vh",
        color: "#111827",
      }}
    >
      <h1>BRS Reconciliation Dashboard</h1>

      {/* KPI Cards */}
      <div style={gridStyle}>
        {[
          ["Total Records", total],
          ["Matched Records", matched],
          ["Mismatched Records", mismatched],
          ["Match Rate", `${matchRate}%`],
        ].map(([label, value]) => (
          <div key={label} style={cardStyle}>
            <p>{label}</p>
            <h2>{value}</h2>
          </div>
        ))}
      </div>

      <div style={gridStyle}>
        {/* Chart 1 - Donut */}
        <div style={cardStyle}>
          <h3>Status Donut Chart</h3>
          <div style={{ height: 320 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={100}
                >
                  {statusData.map((item) => (
                    <Cell key={item.name} fill={getColor(item.name)} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2 - Pie */}
        <div style={cardStyle}>
          <h3>Status Pie Chart</h3>
          <div style={{ height: 320 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                >
                  {statusData.map((item) => (
                    <Cell key={item.name} fill={getColor(item.name)} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3 - Bar */}
        <div style={cardStyle}>
          <h3>Status Bar Chart</h3>
          <div style={{ height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={false} height={15} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Records">
                  {statusData.map((item) => (
                    <Cell key={item.name} fill={getColor(item.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4 - Horizontal Bar */}
        <div style={cardStyle}>
          <h3>Status Horizontal Bar</h3>
          <div style={{ height: 350 }}>
            <ResponsiveContainer>
              <BarChart
                data={statusData}
                layout="vertical"
                margin={{ left: 25, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={130}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip />
                <Bar dataKey="value">
                  {statusData.map((item) => (
                    <Cell key={item.name} fill={getColor(item.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5 - Line */}
        <div style={cardStyle}>
          <h3>Monthly Reconciliation Trend</h3>
          <div style={{ height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="matched"
                  stroke="#16a34a"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="mismatched"
                  stroke="#ef4444"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6 - Area */}
        <div style={cardStyle}>
          <h3>Monthly Total Records</h3>
          <div style={{ height: 320 }}>
            <ResponsiveContainer>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#3b82f6"
                  fill="#93c5fd"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
