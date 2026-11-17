"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
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

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      setUser(response.data.user);
    } catch {
      router.push("/login");
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchDashboardData = async (showRefreshing = false) => {
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
    fetchProfile();
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

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

        const receipts = toNumber(item.receipts ?? item.RECEIPTS);
        const payments = toNumber(item.payments ?? item.PAYMENTS);
        const deposits = toNumber(item.deposits ?? item.DEPOSITS);
        const withdrawals = toNumber(item.withdrawals ?? item.WITHDRAWALS);
        const glDebit = toNumber(item.gl_debit ?? item.GL_DEBIT);
        const glCredit = toNumber(item.gl_credit ?? item.GL_CREDIT);

        return {
          ...item,
          _index: index,
          normalizedStatus: status,
          normalizedDate:
            parsedDate && !Number.isNaN(parsedDate.getTime())
              ? parsedDate
              : null,
          receipts,
          payments,
          deposits,
          withdrawals,
          glDebit,
          glCredit,
          apDiff: receipts - payments,
          bankDiff: deposits - withdrawals,
          glDiff: glCredit - glDebit,
          apDiffAbsolute: Math.abs(receipts - payments),
          bankDiffAbsolute: Math.abs(deposits - withdrawals),
          glDiffAbsolute: Math.abs(glCredit - glDebit),
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

    const glDebit = normalizedData.reduce((sum, item) => sum + item.glDebit, 0);

    const glCredit = normalizedData.reduce(
      (sum, item) => sum + item.glCredit,
      0,
    );

    const reconciledAmount = normalizedData
      .filter((item) =>
        ["FULLY MATCHED", "RECONCILED"].includes(item.normalizedStatus),
      )
      .reduce((sum, item) => sum + item.receipts + item.deposits, 0);

    const apDiff = receipts - payments;
    const bankDiff = deposits - withdrawals;
    const glDiff = glCredit - glDebit;

    return {
      receipts,
      payments,
      deposits,
      withdrawals,
      glDebit,
      glCredit,
      reconciledAmount,
      apDiff,
      bankDiff,
      glDiff,
      apDiffAbsolute: Math.abs(apDiff),
      bankDiffAbsolute: Math.abs(bankDiff),
      glDiffAbsolute: Math.abs(glDiff),
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

  const differenceData = [
    {
      name: "AP Difference",
      value: amountSummary.apDiffAbsolute,
      actual: amountSummary.apDiff,
      fill: "#f59e0b",
    },
    {
      name: "Bank Difference",
      value: amountSummary.bankDiffAbsolute,
      actual: amountSummary.bankDiff,
      fill: "#3b82f6",
    },
    {
      name: "GL Difference",
      value: amountSummary.glDiffAbsolute,
      actual: amountSummary.glDiff,
      fill: "#8b5cf6",
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

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-sm text-gray-500">Checking authentication...</p>
      </div>
    );
  }

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
            onClick={() => fetchDashboardData(true)}
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
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              BRS Reconciliation Dashboard
            </h1>

            <p className="text-xs text-slate-500">
              Welcome back, {user?.name || "User"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              {user?.role || "USER"}
            </span>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Dashboard title */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              BRS Analytics
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Reconciliation Dashboard
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Monitor matching performance, reconciliation trends, and
              outstanding exceptions.
            </p>
          </div>

          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
          >
            <span className={refreshing ? "animate-spin" : ""}>⟳</span>
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Record KPI cards */}
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

        {/* AP and Bank KPI cards */}
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

        {/* GL KPI cards */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Total GL Credit"
            value={formatCurrency(amountSummary.glCredit)}
            helper="Sum of all GL credit amounts"
            icon="🟢"
            accent="bg-emerald-50 text-emerald-600"
          />

          <KpiCard
            label="Total GL Debit"
            value={formatCurrency(amountSummary.glDebit)}
            helper="Sum of all GL debit amounts"
            icon="🔴"
            accent="bg-red-50 text-red-600"
          />

          <KpiCard
            label="Reconciled Amount"
            value={formatCurrency(amountSummary.reconciledAmount)}
            helper="Receipts + deposits for matched records"
            icon="✔️"
            accent="bg-blue-50 text-blue-600"
          />

          <KpiCard
            label="Total Differences"
            value={formatCurrency(
              amountSummary.apDiffAbsolute +
                amountSummary.bankDiffAbsolute +
                amountSummary.glDiffAbsolute,
            )}
            helper="AP + Bank + GL absolute differences"
            icon="🧮"
            accent="bg-slate-100 text-slate-700"
          />
        </div>

        {/* Difference KPI cards */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <KpiCard
            label="AP Difference"
            value={formatCurrency(amountSummary.apDiff)}
            helper="AP receipts minus AP payments"
            icon="📊"
            accent="bg-amber-50 text-amber-600"
          />

          <KpiCard
            label="Bank Difference"
            value={formatCurrency(amountSummary.bankDiff)}
            helper="Bank deposits minus bank withdrawals"
            icon="🏦"
            accent="bg-blue-50 text-blue-600"
          />

          <KpiCard
            label="GL Difference"
            value={formatCurrency(amountSummary.glDiff)}
            helper="GL credit minus GL debit"
            icon="📚"
            accent="bg-violet-50 text-violet-600"
          />
        </div>

        {/* Charts */}
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
            title="AP, Bank & GL Differences"
            subtitle="Absolute difference between credit and debit amounts"
            className="xl:col-span-7"
          >
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={differenceData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />

                  <YAxis
                    tickFormatter={formatCompact}
                    tick={{ fontSize: 12 }}
                  />

                  <Tooltip
                    formatter={(value, name, item) => [
                      formatCurrency(value),
                      `${item?.payload?.name} (Absolute)`,
                    ]}
                  />

                  <Bar
                    dataKey="value"
                    name="Difference Amount"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={70}
                  >
                    {differenceData.map((item) => (
                      <Cell key={item.name} fill={item.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Status Share"
            subtitle="Proportion of each reconciliation status"
            className="xl:col-span-5"
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

          <ChartCard
            title="Reconciliation Amount Summary"
            subtitle="Reconciled, GL credit, and GL debit totals"
            className="xl:col-span-6"
          >
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      name: "Reconciled Amount",
                      value: amountSummary.reconciledAmount,
                    },
                    {
                      name: "GL Credit",
                      value: amountSummary.glCredit,
                    },
                    {
                      name: "GL Debit",
                      value: amountSummary.glDebit,
                    },
                  ]}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />

                  <YAxis
                    tickFormatter={formatCompact}
                    tick={{ fontSize: 12 }}
                  />

                  <Tooltip formatter={(value) => formatCurrency(value)} />

                  <Bar dataKey="value" name="Amount" maxBarSize={60}>
                    <Cell fill="#3b82f6" />
                    <Cell fill="#16a34a" />
                    <Cell fill="#ef4444" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Recent records */}
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
                      "GL Credit",
                      "GL Debit",
                      "AP Diff",
                      "Bank Diff",
                      "GL Diff",
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

                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-emerald-600">
                          {formatCurrency(item.glCredit)}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-red-600">
                          {formatCurrency(item.glDebit)}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-amber-600">
                          {formatCurrency(item.apDiff)}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-blue-600">
                          {formatCurrency(item.bankDiff)}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-violet-600">
                          {formatCurrency(item.glDiff)}
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
                        colSpan={13}
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
