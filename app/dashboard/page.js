// "use client";

// import { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import {
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";

// const colors = {
//   "FULLY MATCHED": "#16a34a",
//   "PARTIALLY MATCHED": "#f59e0b",
//   RECONCILED: "#3b82f6",
//   MISMATCHED: "#ef4444",
//   "AP & GL MATCHED": "#7026b6",
//   "AP & BANK MATCHED": "#30ce81",
//   "GL & BANK MATCHED": "#aaa42a",
//   "AP ONLY": "#2ebfc4",
//   "GL ONLY": "#9241cf",
//   "BANK ONLY": "#d60db4",
// };

// const getColor = (name) => colors[name] || "#64748b";

// export default function Dashboard() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const controller = new AbortController();

//     async function fetchData() {
//       try {
//         const res = await axios.get("/api/report", {
//           signal: controller.signal,
//         });

//         const records = Array.isArray(res.data) ? res.data : res.data?.data;

//         if (!Array.isArray(records)) {
//           throw new Error("Invalid API response");
//         }

//         setData(records);
//       } catch (err) {
//         if (controller.signal.aborted) return;
//         console.error(err);
//         setError("Unable to load dashboard");
//       } finally {
//         if (!controller.signal.aborted) {
//           setLoading(false);
//         }
//       }
//     }

//     fetchData();
//     return () => controller.abort();
//   }, []);

//   // 1. Status-wise counts
//   const statusData = useMemo(() => {
//     const counts = {};

//     data.forEach((item) => {
//       const status = String(item.status ?? item.STATUS ?? "UNKNOWN")
//         .trim()
//         .toUpperCase();

//       counts[status] = (counts[status] || 0) + 1;
//     });

//     return Object.entries(counts).map(([name, value]) => ({
//       name,
//       value,
//     }));
//   }, [data]);

//   // 2. Monthly reconciliation trend
//   const monthlyData = useMemo(() => {
//     const months = {};

//     data.forEach((item) => {
//       const dateValue =
//         item.transfer_date ??
//         item.TRANSFER_DATE ??
//         item.ap_gl_date ??
//         item.AP_GL_DATE ??
//         item.gl_trx_date ??
//         item.GL_TRX_DATE;

//       if (!dateValue) return;

//       const date = new Date(dateValue);
//       if (Number.isNaN(date.getTime())) return;

//       const month = `${date.getFullYear()}-${String(
//         date.getMonth() + 1,
//       ).padStart(2, "0")}`;

//       const status = String(item.status ?? item.STATUS ?? "")
//         .trim()
//         .toUpperCase();

//       if (!months[month]) {
//         months[month] = {
//           month,
//           total: 0,
//           matched: 0,
//           mismatched: 0,
//         };
//       }

//       months[month].total++;

//       if (status === "FULLY MATCHED" || status === "RECONCILED") {
//         months[month].matched++;
//       }

//       if (status === "MISMATCHED") {
//         months[month].mismatched++;
//       }
//     });

//     return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
//   }, [data]);

//   const total = data.length;

//   const matched = statusData
//     .filter((s) => ["FULLY MATCHED", "RECONCILED"].includes(s.name))
//     .reduce((sum, s) => sum + s.value, 0);

//   const mismatched =
//     statusData.find((s) => s.name === "MISMATCHED")?.value || 0;

//   const matchRate = total ? ((matched / total) * 100).toFixed(1) : "0.0";

//   const cardStyle = {
//     background: "#ffffff",
//     padding: 20,
//     borderRadius: 12,
//     border: "1px solid #e5e7eb",
//     minWidth: 0,
//   };

//   const gridStyle = {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
//     gap: 20,
//     marginTop: 20,
//   };

//   if (loading) return <p>Loading Dashboard...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div
//       style={{
//         padding: 24,
//         background: "#f3f4f6",
//         minHeight: "100vh",
//         color: "#111827",
//       }}
//     >
//       <h1>BRS Reconciliation Dashboard</h1>

//       {/* KPI Cards */}
//       <div style={gridStyle}>
//         {[
//           ["Total Records", total],
//           ["Matched Records", matched],
//           ["Mismatched Records", mismatched],
//           ["Match Rate", `${matchRate}%`],
//         ].map(([label, value]) => (
//           <div key={label} style={cardStyle}>
//             <p>{label}</p>
//             <h2>{value}</h2>
//           </div>
//         ))}
//       </div>

//       <div style={gridStyle}>
//         {/* Chart 1 - Donut */}
//         <div style={cardStyle}>
//           <h3>Status Donut Chart</h3>
//           <div style={{ height: 320 }}>
//             <ResponsiveContainer>
//               <PieChart>
//                 <Pie
//                   data={statusData}
//                   dataKey="value"
//                   nameKey="name"
//                   innerRadius={50}
//                   outerRadius={100}
//                 >
//                   {statusData.map((item) => (
//                     <Cell key={item.name} fill={getColor(item.name)} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Chart 2 - Pie */}
//         <div style={cardStyle}>
//           <h3>Status Pie Chart</h3>
//           <div style={{ height: 320 }}>
//             <ResponsiveContainer>
//               <PieChart>
//                 <Pie
//                   data={statusData}
//                   dataKey="value"
//                   nameKey="name"
//                   outerRadius={110}
//                   label
//                 >
//                   {statusData.map((item) => (
//                     <Cell key={item.name} fill={getColor(item.name)} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Chart 3 - Bar */}
//         <div style={cardStyle}>
//           <h3>Status Bar Chart</h3>
//           <div style={{ height: 350 }}>
//             <ResponsiveContainer>
//               <BarChart data={statusData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" tick={false} height={15} />
//                 <YAxis allowDecimals={false} />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="value" name="Records">
//                   {statusData.map((item) => (
//                     <Cell key={item.name} fill={getColor(item.name)} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Chart 4 - Horizontal Bar */}
//         <div style={cardStyle}>
//           <h3>Status Horizontal Bar</h3>
//           <div style={{ height: 350 }}>
//             <ResponsiveContainer>
//               <BarChart
//                 data={statusData}
//                 layout="vertical"
//                 margin={{ left: 25, right: 20 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis type="number" allowDecimals={false} />
//                 <YAxis
//                   type="category"
//                   dataKey="name"
//                   width={130}
//                   tick={{ fontSize: 10 }}
//                 />
//                 <Tooltip />
//                 <Bar dataKey="value">
//                   {statusData.map((item) => (
//                     <Cell key={item.name} fill={getColor(item.name)} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Chart 5 - Line */}
//         <div style={cardStyle}>
//           <h3>Monthly Reconciliation Trend</h3>
//           <div style={{ height: 320 }}>
//             <ResponsiveContainer>
//               <LineChart data={monthlyData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis allowDecimals={false} />
//                 <Tooltip />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="matched"
//                   stroke="#16a34a"
//                   strokeWidth={3}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="mismatched"
//                   stroke="#ef4444"
//                   strokeWidth={3}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Chart 6 - Area */}
//         <div style={cardStyle}>
//           <h3>Monthly Total Records</h3>
//           <div style={{ height: 320 }}>
//             <ResponsiveContainer>
//               <AreaChart data={monthlyData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis allowDecimals={false} />
//                 <Tooltip />
//                 <Area
//                   type="monotone"
//                   dataKey="total"
//                   stroke="#3b82f6"
//                   fill="#93c5fd"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";

const STATUS_COLORS = {
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

const CHART_PALETTE = [
  "#3b82f6",
  "#16a34a",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
  "#f97316",
  "#64748b",
];

const getColor = (name, index = 0) =>
  STATUS_COLORS[name] || CHART_PALETTE[index % CHART_PALETTE.length];

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return 0;

  const parsed = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isNaN(parsed) ? 0 : parsed;
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(toNumber(value));

const formatCompact = (value) =>
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ChartCard = ({ title, subtitle, children, className = "" }) => (
  <section
    className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 ${className}`}
  >
    <div className="mb-4">
      <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
        {title}
      </h3>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">{subtitle}</p>
      )}
    </div>

    {children}
  </section>
);

const KpiCard = ({ label, value, helper, icon, accent }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          {value}
        </p>

        {helper && (
          <p className="mt-1 truncate text-xs text-slate-500">{helper}</p>
        )}
      </div>

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${accent}`}
      >
        {icon}
      </div>
    </div>
  </div>
);

const EmptyChart = ({ message }) => (
  <div className="flex h-full min-h-[240px] items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
    {message}
  </div>
);

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);

    try {
      const res = await axios.get("/api/report");
      const records = Array.isArray(res.data) ? res.data : res.data?.data;

      if (!Array.isArray(records)) {
        throw new Error("Invalid API response");
      }

      setData(records);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const normalizedData = useMemo(
    () =>
      data.map((item, index) => {
        const status = String(item.status ?? item.STATUS ?? "UNKNOWN")
          .trim()
          .toUpperCase();

        const dateValue =
          item.transfer_date ??
          item.TRANSFER_DATE ??
          item.ap_gl_date ??
          item.AP_GL_DATE ??
          item.gl_trx_date ??
          item.GL_TRX_DATE;

        const parsedDate = dateValue ? new Date(dateValue) : null;

        return {
          ...item,
          _index: index,
          normalizedStatus: status,
          normalizedDate:
            parsedDate && !Number.isNaN(parsedDate.getTime())
              ? parsedDate
              : null,
          receipts: toNumber(item.receipts ?? item.RECEIPTS),
          payments: toNumber(item.payments ?? item.PAYMENTS),
          deposits: toNumber(item.deposits ?? item.DEPOSITS),
          withdrawals: toNumber(item.withdrawals ?? item.WITHDRAWALS),
          glDebit: toNumber(item.gl_debit ?? item.GL_DEBIT),
          glCredit: toNumber(item.gl_credit ?? item.GL_CREDIT),
        };
      }),
    [data],
  );

  const statusData = useMemo(() => {
    const counts = {};

    normalizedData.forEach((item) => {
      counts[item.normalizedStatus] = (counts[item.normalizedStatus] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [normalizedData]);

  const monthlyData = useMemo(() => {
    const months = {};

    normalizedData.forEach((item) => {
      if (!item.normalizedDate) return;

      const month = `${item.normalizedDate.getFullYear()}-${String(
        item.normalizedDate.getMonth() + 1,
      ).padStart(2, "0")}`;

      if (!months[month]) {
        months[month] = {
          month,
          total: 0,
          matched: 0,
          mismatched: 0,
          pending: 0,
          receipts: 0,
          payments: 0,
          deposits: 0,
          withdrawals: 0,
        };
      }

      const current = months[month];
      current.total += 1;

      if (["FULLY MATCHED", "RECONCILED"].includes(item.normalizedStatus)) {
        current.matched += 1;
      } else if (item.normalizedStatus === "MISMATCHED") {
        current.mismatched += 1;
      } else {
        current.pending += 1;
      }

      current.receipts += item.receipts;
      current.payments += item.payments;
      current.deposits += item.deposits;
      current.withdrawals += item.withdrawals;
    });

    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
  }, [normalizedData]);

  const vendorData = useMemo(() => {
    const vendors = {};

    normalizedData.forEach((item) => {
      const name =
        item.vendor_name ??
        item.VENDOR_NAME ??
        item.transfer_name ??
        item.TRANSFER_NAME ??
        "Unknown";

      if (!vendors[name]) {
        vendors[name] = {
          name,
          records: 0,
          matched: 0,
          mismatched: 0,
          amount: 0,
        };
      }

      vendors[name].records += 1;

      if (["FULLY MATCHED", "RECONCILED"].includes(item.normalizedStatus)) {
        vendors[name].matched += 1;
      }

      if (item.normalizedStatus === "MISMATCHED") {
        vendors[name].mismatched += 1;
      }

      vendors[name].amount +=
        item.deposits + item.withdrawals + item.receipts + item.payments;
    });

    return Object.values(vendors)
      .sort((a, b) => b.records - a.records)
      .slice(0, 8);
  }, [normalizedData]);

  const amountSummary = useMemo(() => {
    const receipts = normalizedData.reduce(
      (sum, item) => sum + item.receipts,
      0,
    );

    const payments = normalizedData.reduce(
      (sum, item) => sum + item.payments,
      0,
    );

    const deposits = normalizedData.reduce(
      (sum, item) => sum + item.deposits,
      0,
    );

    const withdrawals = normalizedData.reduce(
      (sum, item) => sum + item.withdrawals,
      0,
    );

    return {
      receipts,
      payments,
      deposits,
      withdrawals,
      netBank: deposits - withdrawals,
      netAP: receipts - payments,
    };
  }, [normalizedData]);

  const total = normalizedData.length;

  const matched = statusData
    .filter((item) => ["FULLY MATCHED", "RECONCILED"].includes(item.name))
    .reduce((sum, item) => sum + item.value, 0);

  const mismatched =
    statusData.find((item) => item.name === "MISMATCHED")?.value || 0;

  const pending = total - matched - mismatched;

  const matchRate = total ? (matched / total) * 100 : 0;

  const mismatchRate = total ? (mismatched / total) * 100 : 0;

  const healthData = [
    {
      name: "Match Rate",
      value: Number(matchRate.toFixed(1)),
      fill: "#16a34a",
    },
  ];

  const recentRecords = useMemo(
    () =>
      [...normalizedData]
        .filter((item) => item.normalizedDate)
        .sort((a, b) => b.normalizedDate - a.normalizedDate)
        .slice(0, 8),
    [normalizedData],
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-sm font-medium text-slate-600">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-2xl">
            ⚠️
          </div>

          <h2 className="text-lg font-semibold text-slate-900">
            Dashboard unavailable
          </h2>

          <p className="mt-2 text-sm text-slate-600">{error}</p>

          <button
            onClick={() => fetchData(true)}
            className="mt-5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              BRS Analytics
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Reconciliation Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Monitor matching performance, reconciliation trends, and
              outstanding exceptions.
            </p>
          </div>

          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
          >
            <span className={refreshing ? "animate-spin" : ""}>⟳</span>
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Total Records"
            value={formatCompact(total)}
            helper="All reconciliation records"
            icon="📄"
            accent="bg-blue-50 text-blue-600"
          />

          <KpiCard
            label="Matched Records"
            value={formatCompact(matched)}
            helper={`${matchRate.toFixed(1)}% match rate`}
            icon="✅"
            accent="bg-emerald-50 text-emerald-600"
          />

          <KpiCard
            label="Mismatched Records"
            value={formatCompact(mismatched)}
            helper={`${mismatchRate.toFixed(1)}% requires review`}
            icon="⚠️"
            accent="bg-red-50 text-red-600"
          />

          <KpiCard
            label="Pending Review"
            value={formatCompact(pending)}
            helper="Not fully matched or reconciled"
            icon="⏳"
            accent="bg-amber-50 text-amber-600"
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="AP Receipts"
            value={formatCurrency(amountSummary.receipts)}
            helper="Credit side"
            icon="📥"
            accent="bg-emerald-50 text-emerald-600"
          />

          <KpiCard
            label="AP Payments"
            value={formatCurrency(amountSummary.payments)}
            helper="Debit side"
            icon="📤"
            accent="bg-red-50 text-red-600"
          />

          <KpiCard
            label="Bank Deposits"
            value={formatCurrency(amountSummary.deposits)}
            helper="Credit side"
            icon="🏦"
            accent="bg-blue-50 text-blue-600"
          />

          <KpiCard
            label="Bank Withdrawals"
            value={formatCurrency(amountSummary.withdrawals)}
            helper="Debit side"
            icon="💸"
            accent="bg-violet-50 text-violet-600"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-12">
          <ChartCard
            title="Reconciliation Health"
            subtitle="Overall matched percentage"
            className="xl:col-span-4"
          >
            <div className="h-[260px]">
              {total ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    data={healthData}
                    innerRadius="70%"
                    outerRadius="100%"
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar dataKey="value" cornerRadius={20} background />

                    <Tooltip
                      formatter={(value) => [`${value}%`, "Match rate"]}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="No records available" />
              )}
            </div>

            <div className="-mt-16 text-center">
              <p className="text-3xl font-bold text-emerald-600">
                {matchRate.toFixed(1)}%
              </p>
              <p className="text-xs text-slate-500">Records matched</p>
            </div>
          </ChartCard>

          <ChartCard
            title="Status Distribution"
            subtitle="Records grouped by reconciliation status"
            className="xl:col-span-8"
          >
            <div className="h-[320px]">
              {statusData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={statusData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />

                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      interval={0}
                      angle={-35}
                      textAnchor="end"
                      height={70}
                    />

                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />

                    <Tooltip />

                    <Bar
                      dataKey="value"
                      name="Records"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={48}
                    >
                      {statusData.map((item, index) => (
                        <Cell
                          key={item.name}
                          fill={getColor(item.name, index)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="No status data available" />
              )}
            </div>
          </ChartCard>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-12">
          <ChartCard
            title="Monthly Reconciliation Trend"
            subtitle="Matched, mismatched, and pending records"
            className="xl:col-span-8"
          >
            <div className="h-[340px]">
              {monthlyData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={monthlyData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />

                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />

                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />

                    <Tooltip />

                    <Legend />

                    <Bar
                      dataKey="matched"
                      name="Matched"
                      fill="#16a34a"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={32}
                    />

                    <Bar
                      dataKey="mismatched"
                      name="Mismatched"
                      fill="#ef4444"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={32}
                    />

                    <Line
                      type="monotone"
                      dataKey="total"
                      name="Total"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 3 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="No monthly trend available" />
              )}
            </div>
          </ChartCard>

          <ChartCard
            title="Status Share"
            subtitle="Proportion of each reconciliation status"
            className="xl:col-span-4"
          >
            <div className="h-[340px]">
              {statusData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="52%"
                      outerRadius="78%"
                      paddingAngle={2}
                    >
                      {statusData.map((item, index) => (
                        <Cell
                          key={item.name}
                          fill={getColor(item.name, index)}
                        />
                      ))}
                    </Pie>

                    <Tooltip />

                    <Legend
                      verticalAlign="bottom"
                      height={60}
                      wrapperStyle={{
                        fontSize: "11px",
                        lineHeight: "18px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="No status data available" />
              )}
            </div>
          </ChartCard>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-12">
          <ChartCard
            title="Monthly Transaction Values"
            subtitle="AP receipts versus bank deposits"
            className="xl:col-span-6"
          >
            <div className="h-[320px]">
              {monthlyData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="receiptGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#16a34a"
                          stopOpacity={0.7}
                        />

                        <stop
                          offset="95%"
                          stopColor="#16a34a"
                          stopOpacity={0.05}
                        />
                      </linearGradient>

                      <linearGradient
                        id="depositGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.7}
                        />

                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />

                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />

                    <YAxis
                      tickFormatter={formatCompact}
                      tick={{ fontSize: 12 }}
                    />

                    <Tooltip formatter={(value) => formatCurrency(value)} />

                    <Legend />

                    <Area
                      type="monotone"
                      dataKey="receipts"
                      name="AP Receipts"
                      stroke="#16a34a"
                      fill="url(#receiptGradient)"
                      strokeWidth={2}
                    />

                    <Area
                      type="monotone"
                      dataKey="deposits"
                      name="Bank Deposits"
                      stroke="#3b82f6"
                      fill="url(#depositGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="No transaction values available" />
              )}
            </div>
          </ChartCard>

          <ChartCard
            title="Top Vendors"
            subtitle="Highest record volume"
            className="xl:col-span-6"
          >
            <div className="h-[320px]">
              {vendorData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={vendorData}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 20,
                      left: 5,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="#e2e8f0"
                    />

                    <XAxis
                      type="number"
                      allowDecimals={false}
                      tick={{ fontSize: 12 }}
                    />

                    <YAxis
                      type="category"
                      dataKey="name"
                      width={130}
                      tick={{ fontSize: 11 }}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="records"
                      name="Records"
                      fill="#6366f1"
                      radius={[0, 6, 6, 0]}
                      maxBarSize={22}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="No vendor data available" />
              )}
            </div>
          </ChartCard>
        </div>

        <ChartCard
          title="Recent Records"
          subtitle="Latest reconciliation activity"
          className="mt-4 sm:mt-5"
        >
          <div className="-mx-4 overflow-x-auto sm:-mx-5">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    {[
                      "Invoice",
                      "Vendor / Transfer",
                      "Date",
                      "Receipts",
                      "Payments",
                      "Deposits",
                      "Withdrawals",
                      "Status",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white">
                  {recentRecords.length ? (
                    recentRecords.map((item) => (
                      <tr
                        key={item._index}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-700">
                          {item.invoice_number || "—"}
                        </td>

                        <td className="max-w-[220px] truncate px-4 py-3 text-sm text-slate-700">
                          {item.vendor_name || item.transfer_name || "—"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                          {formatDate(item.normalizedDate)}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-emerald-600">
                          {formatCurrency(item.receipts)}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-red-600">
                          {formatCurrency(item.payments)}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-emerald-600">
                          {formatCurrency(item.deposits)}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-red-600">
                          {formatCurrency(item.withdrawals)}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              ["FULLY MATCHED", "RECONCILED"].includes(
                                item.normalizedStatus,
                              )
                                ? "bg-emerald-50 text-emerald-700"
                                : item.normalizedStatus === "MISMATCHED"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {item.normalizedStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-10 text-center text-sm text-slate-500"
                      >
                        No recent records available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
