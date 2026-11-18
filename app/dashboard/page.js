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

const getMonthKey = (date) => {
  if (!date) return null;

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const getMonthLabel = (monthKey) => {
  if (!monthKey) return "Unknown";

  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);

  return date.toLocaleDateString("en-GB", {
    month: "long",
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

const KpiCard = ({
  label,
  debitLabel,
  debitValue,
  creditLabel,
  creditValue,
  differenceLabel,
  differenceValue,
  icon,
  accent,
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-500">
              {debitLabel}
            </span>

            <span className="text-sm font-semibold text-red-600">
              {debitValue}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-500">
              {creditLabel}
            </span>

            <span className="text-sm font-semibold text-emerald-600">
              {creditValue}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2">
            <span className="text-xs font-medium text-slate-500">
              {differenceLabel}
            </span>

            <span className="text-sm font-bold text-amber-600">
              {differenceValue}
            </span>
          </div>
        </div>
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

  const [selectedMonth, setSelectedMonth] = useState("ALL");

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
        const validDate =
          parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : null;

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
          normalizedDate: validDate,
          monthKey: getMonthKey(validDate),
          receipts,
          payments,
          deposits,
          withdrawals,
          glDebit,
          glCredit,
          apDiff: Math.abs(payments - receipts),
          bankDiff: Math.abs(deposits - withdrawals),
          glDiff: Math.abs(glDebit - glCredit),
          totalAmount: receipts + payments + deposits + withdrawals,
        };
      }),
    [data],
  );

  const availableMonths = useMemo(() => {
    const months = normalizedData.map((item) => item.monthKey).filter(Boolean);

    const uniqueMonths = [...new Set(months)];

    return uniqueMonths.sort((a, b) => {
      if (a === b) return 0;
      return a < b ? 1 : -1;
    });
  }, [normalizedData]);

  const filteredData = useMemo(() => {
    return normalizedData.filter((item) => {
      const monthMatch =
        selectedMonth === "ALL" || item.monthKey === selectedMonth;

      return monthMatch;
    });
  }, [normalizedData, selectedMonth]);

  const statusData = useMemo(() => {
    const counts = {};

    filteredData.forEach((item) => {
      counts[item.normalizedStatus] = (counts[item.normalizedStatus] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredData]);

  const vendorData = useMemo(() => {
    const vendors = {};

    filteredData.forEach((item) => {
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

      vendors[name].amount += item.totalAmount;
    });

    return Object.values(vendors)
      .sort((a, b) => b.records - a.records)
      .slice(0, 8);
  }, [filteredData]);

  const exceptionVendorData = useMemo(() => {
    const vendors = {};

    filteredData
      .filter((item) => item.normalizedStatus === "MISMATCHED")
      .forEach((item) => {
        const name =
          item.vendor_name ??
          item.VENDOR_NAME ??
          item.transfer_name ??
          item.TRANSFER_NAME ??
          "Unknown";

        if (!vendors[name]) {
          vendors[name] = {
            name,
            mismatched: 0,
            apDiff: 0,
            bankDiff: 0,
            glDiff: 0,
          };
        }

        vendors[name].mismatched += 1;
        vendors[name].apDiff += item.apDiff;
        vendors[name].bankDiff += item.bankDiff;
        vendors[name].glDiff += item.glDiff;
      });

    return Object.values(vendors)
      .sort((a, b) => b.mismatched - a.mismatched)
      .slice(0, 8);
  }, [filteredData]);

  const amountSummary = useMemo(() => {
    const receipts = filteredData.reduce((sum, item) => sum + item.receipts, 0);

    const payments = filteredData.reduce((sum, item) => sum + item.payments, 0);

    const deposits = filteredData.reduce((sum, item) => sum + item.deposits, 0);

    const withdrawals = filteredData.reduce(
      (sum, item) => sum + item.withdrawals,
      0,
    );

    const glDebit = filteredData.reduce((sum, item) => sum + item.glDebit, 0);

    const glCredit = filteredData.reduce((sum, item) => sum + item.glCredit, 0);

    const reconciledAmount = filteredData
      .filter((item) =>
        ["FULLY MATCHED", "RECONCILED"].includes(item.normalizedStatus),
      )
      .reduce((sum, item) => sum + item.receipts + item.deposits, 0);

    const apDiff = Math.abs(payments - receipts);
    const bankDiff = Math.abs(deposits - withdrawals);
    const glDiff = Math.abs(glDebit - glCredit);

    const apGlDiff = Math.abs(apDiff - glDiff);
    const apBankDiff = Math.abs(apDiff - bankDiff);
    const glBankDiff = Math.abs(glDiff - bankDiff);

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
      apGlDiff,
      apBankDiff,
      glBankDiff,
    };
  }, [filteredData]);

  const total = filteredData.length;

  const matched = statusData
    .filter((item) => ["FULLY MATCHED", "RECONCILED"].includes(item.name))
    .reduce((sum, item) => sum + item.value, 0);

  const mismatched =
    statusData.find((item) => item.name === "MISMATCHED")?.value || 0;

  const pending = total - matched - mismatched;

  const matchRate = total ? (matched / total) * 100 : 0;
  const mismatchRate = total ? (mismatched / total) * 100 : 0;
  const pendingRate = total ? (pending / total) * 100 : 0;

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
      value: amountSummary.apDiff,
      fill: "#f59e0b",
    },
    {
      name: "Bank Difference",
      value: amountSummary.bankDiff,
      fill: "#3b82f6",
    },
    {
      name: "GL Difference",
      value: amountSummary.glDiff,
      fill: "#8b5cf6",
    },
  ];

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
      <header className="border-b border-slate-200 bg-white">
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
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
            >
              <span className={refreshing ? "animate-spin" : ""}>⟳</span>
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
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
        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4 sm:p-5">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Select Month
            </label>

            <select
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="ALL">All Months</option>

              {availableMonths.map((month) => (
                <option key={month} value={month}>
                  {getMonthLabel(month)}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl bg-blue-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              Selected Month
            </p>

            <p className="mt-1 text-sm font-bold text-blue-900">
              {selectedMonth === "ALL"
                ? "All Months"
                : getMonthLabel(selectedMonth)}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Filtered Records
            </p>

            <p className="mt-1 text-sm font-bold text-slate-900">
              {formatCompact(total)} of {formatCompact(normalizedData.length)}
            </p>
          </div>
        </div>

        {/* Record KPI cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-500">
                  Total Records
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                  {formatCompact(total)}
                </p>

                <p className="mt-1 truncate text-xs text-slate-500">
                  All reconciliation records
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
                📄
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-500">
                  Matched Records
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                  {formatCompact(matched)}
                </p>

                <p className="mt-1 truncate text-xs text-slate-500">
                  {matchRate.toFixed(1)}% match rate
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600">
                ✅
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-500">
                  Mismatched Records
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                  {formatCompact(mismatched)}
                </p>

                <p className="mt-1 truncate text-xs text-slate-500">
                  {mismatchRate.toFixed(1)}% requires review
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-lg text-red-600">
                ⚠️
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-500">
                  Pending Review
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                  {formatCompact(pending)}
                </p>

                <p className="mt-1 truncate text-xs text-slate-500">
                  {pendingRate.toFixed(1)}% not fully matched or reconciled
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-lg text-amber-600">
                ⏳
              </div>
            </div>
          </div>
        </div>

        {/* AP, GL, and Bank KPI cards */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <KpiCard
            label="AP Summary"
            debitLabel="AP Debit / Payments"
            debitValue={formatCurrency(amountSummary.payments)}
            creditLabel="AP Credit / Receipts"
            creditValue={formatCurrency(amountSummary.receipts)}
            differenceLabel="AP Difference"
            differenceValue={formatCurrency(amountSummary.apDiff)}
            icon="📤"
            accent="bg-amber-50 text-amber-600"
          />

          <KpiCard
            label="GL Summary"
            debitLabel="GL Debit"
            debitValue={formatCurrency(amountSummary.glDebit)}
            creditLabel="GL Credit"
            creditValue={formatCurrency(amountSummary.glCredit)}
            differenceLabel="GL Difference"
            differenceValue={formatCurrency(amountSummary.glDiff)}
            icon="📚"
            accent="bg-violet-50 text-violet-600"
          />

          <KpiCard
            label="Bank Summary"
            debitLabel="Bank Debit / Withdrawals"
            debitValue={formatCurrency(amountSummary.withdrawals)}
            creditLabel="Bank Credit / Deposits"
            creditValue={formatCurrency(amountSummary.deposits)}
            differenceLabel="Bank Difference"
            differenceValue={formatCurrency(amountSummary.bankDiff)}
            icon="🏦"
            accent="bg-blue-50 text-blue-600"
          />
        </div>

        {/* Additional summary cards */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
            <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-500">
              AP Diff - GL Diff
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              {formatCurrency(amountSummary.apGlDiff)}
            </p>

            <p className="mt-1 truncate text-xs text-slate-500">
              AP difference - GL difference
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
            <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-500">
              AP Diff - Bank Diff
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              {formatCurrency(amountSummary.apBankDiff)}
            </p>

            <p className="mt-1 truncate text-xs text-slate-500">
              AP difference - Bank difference
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
            <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-500">
              GL Diff - Bank Diff
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              {formatCurrency(amountSummary.glBankDiff)}
            </p>

            <p className="mt-1 truncate text-xs text-slate-500">
              GL difference - Bank difference
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-12">
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

                  <Tooltip formatter={(value) => formatCurrency(value)} />

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

        {/* Top exception vendors */}
        <ChartCard
          title="Top Exception Vendors"
          subtitle="Vendors with the highest number of mismatched records"
          className="mt-4 sm:mt-5"
        >
          <div className="h-[320px]">
            {exceptionVendorData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={exceptionVendorData}
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
                    width={140}
                    tick={{ fontSize: 11 }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="mismatched"
                    name="Mismatched Records"
                    fill="#ef4444"
                    radius={[0, 6, 6, 0]}
                    maxBarSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="No mismatched records available" />
            )}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
