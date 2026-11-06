"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const MATCHED_STATUSES = [
  "FULLY MATCHED",
  "RECONCILED",
  "AP & GL MATCHED",
  "AP & BANK MATCHED",
  "GL & BANK MATCHED",
  "AP ONLY",
  "GL ONLY",
  "BANK ONLY",
];

const UNMATCHED_STATUSES = ["MISMATCHED"];

const normalizeStatus = (status) => (status || "").trim().toUpperCase();

const STATUS_OPTIONS = [
  "FULLY MATCHED",
  "PARTIALLY MATCHED",
  "AP & GL MATCHED",
  "AP & BANK MATCHED",
  "GL & BANK MATCHED",
  "AP ONLY",
  "GL ONLY",
  "BANK ONLY",
  "RECONCILED",
  "MISMATCHED",
];

const CARD_META = {
  TOTAL: {
    label: "Total Records",
    icon: "📄",
    border: "border-slate-300",
    bg: "bg-white",
    text: "text-slate-900",
    dot: "bg-slate-500",
  },
  "FULLY MATCHED": {
    label: "Fully Matched",
    icon: "✅",
    border: "border-emerald-300",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  "PARTIALLY MATCHED": {
    label: "Partially Matched",
    icon: "🟡",
    border: "border-amber-300",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  "AP & GL MATCHED": {
    label: "AP & GL Matched",
    icon: "🔗",
    border: "border-purple-300",
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-600",
  },
  "AP & BANK MATCHED": {
    label: "AP & Bank Matched",
    icon: "🏦",
    border: "border-cyan-300",
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    dot: "bg-cyan-600",
  },
  "GL & BANK MATCHED": {
    label: "GL & Bank Matched",
    icon: "📚",
    border: "border-indigo-300",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    dot: "bg-indigo-600",
  },
  "AP ONLY": {
    label: "AP Only",
    icon: "🧾",
    border: "border-teal-300",
    bg: "bg-teal-50",
    text: "text-teal-700",
    dot: "bg-teal-600",
  },
  "GL ONLY": {
    label: "GL Only",
    icon: "📘",
    border: "border-blue-300",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-600",
  },
  "BANK ONLY": {
    label: "Bank Only",
    icon: "💳",
    border: "border-orange-300",
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-600",
  },
  RECONCILED: {
    label: "Reconciled",
    icon: "⚡",
    border: "border-blue-300",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  MISMATCHED: {
    label: "Mismatched",
    icon: "⚠️",
    border: "border-red-300",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
};

const ROWS_PER_PAGE = 50;

export default function BRSPage() {
  const [data, setData] = useState([]);
  const [matchedSelected, setMatchedSelected] = useState(null);
  const [unmatchedSelected, setUnmatchedSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editedNames, setEditedNames] = useState({});
  const [editedRemarks, setEditedRemarks] = useState({});
  const [updatingKey, setUpdatingKey] = useState(null);
  const [matchedPage, setMatchedPage] = useState(1);
  const [unmatchedPage, setUnmatchedPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reconciling, setReconciling] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setMatchedPage(1);
    setUnmatchedPage(1);
  }, [search, statusFilter]);

  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await axios.get("/api/report");
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getKey = (row) =>
    row.bs_id ?? row.ap_id ?? row.gl_id ?? row.check_receipt_number;

  const handleVendorChange = (key, value) =>
    setEditedNames((previous) => ({
      ...previous,
      [key]: value,
    }));

  const handleRemarksChange = (key, value) =>
    setEditedRemarks((previous) => ({
      ...previous,
      [key]: value,
    }));

  const handleVendorUpdate = async (key, bsId, name) => {
    if (!name) return;

    setUpdatingKey(key);

    try {
      await axios.put("/api/brs/update-vendor", {
        id: bsId,
        name,
      });

      setData((previous) =>
        previous.map((row) =>
          row.bs_id === bsId
            ? {
                ...row,
                new_name: name,
              }
            : row,
        ),
      );

      setEditedNames((previous) => {
        const next = { ...previous };
        delete next[key];
        return next;
      });

      alert("Vendor name updated successfully!");
    } catch {
      alert("Failed to update vendor name.");
    } finally {
      setUpdatingKey(null);
    }
  };

  const handleRemarksUpdate = async (key, bsId, remarks) => {
    setUpdatingKey(key);

    try {
      await axios.put("/api/brs/update-remarks", {
        id: bsId,
        remarks: remarks || "",
      });

      setData((previous) =>
        previous.map((row) =>
          row.bs_id === bsId
            ? {
                ...row,
                remarks: remarks || "",
              }
            : row,
        ),
      );

      setEditedRemarks((previous) => {
        const next = { ...previous };
        delete next[key];
        return next;
      });

      alert("Remarks updated successfully!");
    } catch {
      alert("Failed to update remarks.");
    } finally {
      setUpdatingKey(null);
    }
  };

  const handleDownload = () => {
    const rows = applyFilters(data);

    if (!rows.length) {
      alert("No data to download");
      return;
    }

    const excelData = rows.map((row) => ({
      "Invoice No": row.invoice_number,
      "Vendor / Transfer": row.vendor_name || row.transfer_name,
      "Changed Name": row.new_name,
      "CMC No": row.cmc_no,
      "AP Date": row.ap_gl_date,
      "AP Receipt": row.receipts,
      "AP Payment": row.payments,
      "AP Diff": row.ap_diff,
      "GL Date": row.gl_date,
      "GL Debit": row.gl_debit,
      "GL Credit": row.gl_credit,
      "GL Diff": row.gl_diff,
      "Transfer Date": row.transfer_date,
      "Bank Deposits": row.deposits,
      "Bank Withdrawals": row.withdrawals,
      "Bank Diff": row.bk_diff,
      "GL BK Diff": row.gl_bk_diff,
      Status: row.status,
      Remarks: row.remarks,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "BRS Report");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "BRS_Report.xlsx";
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleSelect = (row) => {
    const invoiceKey =
      row.invoice_number || row.check_receipt_number || String(getKey(row));

    const item = {
      invoiceKey,
      name: row.vendor_name || row.transfer_name,
      new_name: row.new_name || null,
      check_receipt_number: row.invoice_number || null,
      status: row.status || null,
      ap_gl_date: row.ap_gl_date || null,
      transfer_date: row.transfer_date || null,
      ap_diff: row.ap_diff || null,
      gl_diff: row.gl_diff || null,
      bk_diff: row.bk_diff || null,
      bs_id: row.bs_id || null,
      receipts: row.receipts ?? null,
      payments: row.payments ?? null,
      deposits: row.deposits ?? null,
      withdrawals: row.withdrawals ?? null,
    };

    const status = normalizeStatus(row.status);

    if (MATCHED_STATUSES.includes(status)) {
      setMatchedSelected((previous) =>
        previous?.invoiceKey === invoiceKey ? null : item,
      );
    } else if (UNMATCHED_STATUSES.includes(status)) {
      setUnmatchedSelected((previous) =>
        previous?.invoiceKey === invoiceKey ? null : item,
      );
    }
  };

  const handleReconcile = async () => {
    if (!matchedSelected || !unmatchedSelected) {
      alert("Select one matched and one unmatched record to reconcile!");
      return;
    }

    setReconciling(true);

    try {
      await axios.put("/api/brs/reconcile", {
        matched: matchedSelected,
        unmatched: unmatchedSelected,
      });

      alert("Records reconciled successfully!");

      setData((previous) =>
        previous.map((row) => {
          const invoice = row.invoice_number || row.check_receipt_number;

          if (
            invoice === matchedSelected.invoiceKey ||
            invoice === unmatchedSelected.invoiceKey
          ) {
            return {
              ...row,
              status: "RECONCILED",
            };
          }

          return row;
        }),
      );

      setMatchedSelected(null);
      setUnmatchedSelected(null);
    } catch {
      alert("Error reconciling records");
    } finally {
      setReconciling(false);
    }
  };

  const applySearchFilter = (rows) => {
    const query = search.trim().toLowerCase();

    if (!query) return rows;

    return rows.filter((row) => {
      const invoice = (row.invoice_number || "").toLowerCase();
      const vendor = (row.vendor_name || row.transfer_name || "").toLowerCase();

      return invoice.includes(query) || vendor.includes(query);
    });
  };

  const applyFilters = (rows) => {
    let filtered = rows;

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(
        (row) => normalizeStatus(row.status) === statusFilter,
      );
    }

    return applySearchFilter(filtered);
  };

  const buildTableData = (statusGroup) => {
    let rows = data.filter((row) =>
      statusGroup.includes(normalizeStatus(row.status)),
    );

    if (statusFilter !== "ALL") {
      rows = statusGroup.includes(statusFilter)
        ? rows.filter((row) => normalizeStatus(row.status) === statusFilter)
        : [];
    }

    return applySearchFilter(rows);
  };

  const matched = useMemo(
    () => buildTableData(MATCHED_STATUSES),
    [data, search, statusFilter],
  );

  const unmatched = useMemo(
    () => buildTableData(UNMATCHED_STATUSES),
    [data, search, statusFilter],
  );

  const matchedData = useMemo(
    () =>
      matched.slice(
        (matchedPage - 1) * ROWS_PER_PAGE,
        matchedPage * ROWS_PER_PAGE,
      ),
    [matched, matchedPage],
  );

  const unmatchedData = useMemo(
    () =>
      unmatched.slice(
        (unmatchedPage - 1) * ROWS_PER_PAGE,
        unmatchedPage * ROWS_PER_PAGE,
      ),
    [unmatched, unmatchedPage],
  );

  const matchedTotalPages = Math.max(
    1,
    Math.ceil(matched.length / ROWS_PER_PAGE),
  );

  const unmatchedTotalPages = Math.max(
    1,
    Math.ceil(unmatched.length / ROWS_PER_PAGE),
  );

  const dashboardCounts = useMemo(() => {
    const counts = {
      TOTAL: data.length,
    };

    STATUS_OPTIONS.forEach((status) => {
      counts[status] = 0;
    });

    data.forEach((row) => {
      const status = normalizeStatus(row.status);

      if (counts[status] !== undefined) {
        counts[status] += 1;
      }
    });

    return counts;
  }, [data]);

  const isReconcileEnabled =
    !!matchedSelected && !!unmatchedSelected && !reconciling;

  return (
    <div className="min-h-dvh bg-slate-50">
      <div className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Bank Reconciliation
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              BRS Reconciliation Report
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review matched and unmatched records, update details, and
              reconcile exceptions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
            >
              <span className={loading ? "animate-spin" : ""}>⟳</span>
              Refresh
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              ⬇ Download Excel
            </button>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {Object.entries(dashboardCounts).map(([status, count]) => {
            const meta = CARD_META[status] ?? CARD_META.TOTAL;
            const isActive = statusFilter === status;
            const clickable = status !== "TOTAL";

            return (
              <button
                key={status}
                type="button"
                onClick={() =>
                  clickable &&
                  setStatusFilter((previous) =>
                    previous === status ? "ALL" : status,
                  )
                }
                disabled={!clickable}
                className={`rounded-2xl border p-4 text-left shadow-sm transition ${
                  meta.bg
                } ${meta.border} ${
                  clickable
                    ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md"
                    : "cursor-default"
                } ${isActive ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`truncate text-xs font-semibold uppercase tracking-wide ${meta.text}`}
                  >
                    {meta.label}
                  </span>

                  <span className="text-base">{meta.icon}</span>
                </div>

                <p
                  className={`mt-2 text-2xl font-bold sm:text-3xl ${meta.text}`}
                >
                  {count.toLocaleString()}
                </p>

                {clickable && (
                  <p className="mt-1 text-[11px] text-slate-500">
                    {isActive ? "Click to clear" : "Click to filter"}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by invoice number or vendor / transfer name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-9 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 lg:w-64"
            >
              <option value="ALL">All Statuses</option>

              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {CARD_META[status]?.label ?? status}
                </option>
              ))}
            </select>

            {statusFilter !== "ALL" && (
              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Clear filter
              </button>
            )}
          </div>

          {(search || statusFilter !== "ALL") && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              {search && (
                <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 font-medium text-blue-700">
                  Search: “{search}”
                </span>
              )}

              {statusFilter !== "ALL" && (
                <span className="rounded-full border border-purple-200 bg-purple-50 px-2.5 py-1 font-medium text-purple-700">
                  Status: {CARD_META[statusFilter]?.label ?? statusFilter}
                </span>
              )}

              <span className="text-slate-500">
                {matched.length + unmatched.length} record(s) shown
              </span>
            </div>
          )}
        </section>

        {(matchedSelected || unmatchedSelected) && (
          <section className="mt-4 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="grid gap-3 sm:grid-cols-2">
                <SelectionChip
                  label="Matched record"
                  item={matchedSelected}
                  tone="blue"
                />

                <SelectionChip
                  label="Unmatched record"
                  item={unmatchedSelected}
                  tone="red"
                />
              </div>

              <button
                type="button"
                onClick={handleReconcile}
                disabled={!isReconcileEnabled}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {reconciling ? "Reconciling..." : "⚡ Reconcile Selected"}
              </button>
            </div>
          </section>
        )}

        <div className="mt-6 space-y-6">
          <ReportTable
            title="Matched Records"
            subtitle="Records currently identified as matched or reconciled"
            data={matchedData}
            totalCount={matched.length}
            selectedInvoiceKey={matchedSelected?.invoiceKey ?? null}
            handleSelect={handleSelect}
            getKey={getKey}
            editable={false}
            editedRemarks={editedRemarks}
            handleRemarksChange={handleRemarksChange}
            handleRemarksUpdate={handleRemarksUpdate}
            updatingKey={updatingKey}
          />

          <Pagination
            page={matchedPage}
            totalPages={matchedTotalPages}
            totalRows={matched.length}
            setPage={setMatchedPage}
          />

          <ReportTable
            title="Unmatched Records"
            subtitle="Mismatched records available for reconciliation"
            data={unmatchedData}
            totalCount={unmatched.length}
            selectedInvoiceKey={unmatchedSelected?.invoiceKey ?? null}
            handleSelect={handleSelect}
            getKey={getKey}
            editable
            editedNames={editedNames}
            handleVendorChange={handleVendorChange}
            handleVendorUpdate={handleVendorUpdate}
            editedRemarks={editedRemarks}
            handleRemarksChange={handleRemarksChange}
            handleRemarksUpdate={handleRemarksUpdate}
            updatingKey={updatingKey}
          />

          <Pagination
            page={unmatchedPage}
            totalPages={unmatchedTotalPages}
            totalRows={unmatched.length}
            setPage={setUnmatchedPage}
          />
        </div>
      </div>
    </div>
  );
}

function SelectionChip({ label, item, tone }) {
  if (!item) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <p className="mt-1 text-sm text-slate-400">No record selected</p>
      </div>
    );
  }

  const toneClasses =
    tone === "blue"
      ? "border-blue-200 bg-white text-blue-800"
      : "border-red-200 bg-white text-red-800";

  return (
    <div className={`rounded-xl border px-4 py-3 shadow-sm ${toneClasses}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
        {label}
      </p>

      <p className="mt-1 truncate font-mono text-sm font-semibold">
        {item.invoiceKey}
      </p>

      <p className="truncate text-xs opacity-80">
        {item.name || "No vendor name"}
      </p>
    </div>
  );
}

function ReportTable({
  title,
  subtitle,
  data,
  totalCount,
  selectedInvoiceKey,
  handleSelect,
  getKey,
  editable,
  editedNames = {},
  handleVendorChange,
  handleVendorUpdate,
  editedRemarks = {},
  handleRemarksChange,
  handleRemarksUpdate,
  updatingKey,
}) {
  const columns = [
    "Changed Name",
    "CMC No",
    "AP Date",
    "AP Receipt",
    "AP Payment",
    "AP Bal",
    "GL Date",
    "GL Debit",
    "GL Credit",
    "GL Bal",
    "AP-GL Diff",
    "Transfer Date",
    "Deposits",
    "Withdrawals",
    "Bank Diff",
    "GL-Bank Diff",
    "Status",
    "Remarks",
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
            {title}
          </h2>

          <p className="mt-0.5 truncate text-xs text-slate-500 sm:text-sm">
            {subtitle}
          </p>
        </div>

        <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
          {totalCount.toLocaleString()} record
          {totalCount === 1 ? "" : "s"}
        </span>
      </div>

      <div className="max-h-[560px] overflow-auto">
        <table className="w-full min-w-[2400px] border-collapse text-xs">
          <thead className="sticky top-0 z-30 bg-slate-100">
            <tr>
              <Th
                className="sticky left-0 z-40 w-16 bg-slate-100 text-center"
                minWidth={64}
              >
                Select
              </Th>

              <Th className="sticky left-16 z-40 bg-slate-100" minWidth={150}>
                Invoice No
              </Th>

              <Th
                className="sticky left-[214px] z-40 bg-slate-100"
                minWidth={220}
              >
                Vendor / Transfer
              </Th>

              {columns.map((column) => (
                <Th key={column} minWidth={140}>
                  {column}
                </Th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 3}
                  className="px-4 py-14 text-center text-sm text-slate-400"
                >
                  No records found
                </td>
              </tr>
            )}

            {data.map((row) => {
              const key = getKey(row);

              const invoiceKey =
                row.invoice_number || row.check_receipt_number || String(key);

              const isSelected = selectedInvoiceKey === invoiceKey;

              const rowName = row.vendor_name || row.transfer_name;

              const displayName = editable
                ? (editedNames[key] ?? rowName)
                : rowName;

              const isVendorDirty =
                editable &&
                editedNames[key] !== undefined &&
                editedNames[key] !== rowName;

              const savedRemarks = row.remarks || "";
              const displayRemarks = editedRemarks[key] ?? savedRemarks;

              const isRemarksDirty =
                editedRemarks[key] !== undefined &&
                editedRemarks[key] !== savedRemarks;

              const isUpdating = updatingKey === key;

              return (
                <tr
                  key={String(key)}
                  className={`transition ${
                    isSelected ? "bg-blue-50" : "bg-white hover:bg-slate-50"
                  }`}
                >
                  <Td
                    className={`sticky left-0 z-20 text-center ${
                      isSelected ? "bg-blue-50" : "bg-white"
                    }`}
                    minWidth={64}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelect(row)}
                      className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-blue-600"
                    />
                  </Td>

                  <Td
                    className={`sticky left-16 z-20 whitespace-nowrap font-mono ${
                      isSelected ? "bg-blue-50" : "bg-white"
                    }`}
                    minWidth={150}
                  >
                    {row.invoice_number || "—"}
                  </Td>

                  <Td
                    className={`sticky left-[214px] z-20 ${
                      isSelected ? "bg-blue-50" : "bg-white"
                    }`}
                    minWidth={220}
                  >
                    {editable ? (
                      <div className="flex min-w-0 items-center gap-1">
                        <input
                          value={displayName || ""}
                          onChange={(event) =>
                            handleVendorChange(key, event.target.value)
                          }
                          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2 py-1 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />

                        {isVendorDirty && (
                          <button
                            type="button"
                            onClick={() =>
                              handleVendorUpdate(
                                key,
                                row.bs_id,
                                editedNames[key],
                              )
                            }
                            disabled={isUpdating}
                            className="shrink-0 rounded-lg bg-blue-600 px-2 py-1 text-[11px] font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                          >
                            {isUpdating ? "..." : "Save"}
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="block truncate" title={displayName}>
                        {displayName || "—"}
                      </span>
                    )}
                  </Td>

                  <Td className="text-purple-700">{row.new_name || "—"}</Td>

                  <Td>{row.cmc_no || "—"}</Td>

                  <Td>{row.ap_gl_date || "—"}</Td>

                  <Td className="text-right font-medium text-emerald-700">
                    {row.receipts ?? "—"}
                  </Td>

                  <Td className="text-right font-medium text-red-600">
                    {row.payments ?? "—"}
                  </Td>

                  <Td className="text-right font-semibold">
                    {row.ap_diff ?? "—"}
                  </Td>

                  <Td>{row.gl_date || "—"}</Td>

                  <Td className="text-right text-emerald-700">
                    {row.gl_debit ?? "—"}
                  </Td>

                  <Td className="text-right text-red-600">
                    {row.gl_credit ?? "—"}
                  </Td>

                  <Td className="text-right font-semibold">
                    {row.gl_diff ?? "—"}
                  </Td>

                  <Td className="text-right font-semibold">
                    {row.ap_gl_diff ?? "—"}
                  </Td>

                  <Td>{row.transfer_date || "—"}</Td>

                  <Td className="text-right text-emerald-700">
                    {row.deposits ?? "—"}
                  </Td>

                  <Td className="text-right text-red-600">
                    {row.withdrawals ?? "—"}
                  </Td>

                  <Td className="text-right font-semibold">
                    {row.bk_diff ?? "—"}
                  </Td>

                  <Td className="text-right font-semibold">
                    {row.gl_bk_diff ?? "—"}
                  </Td>

                  <Td>
                    <StatusBadge status={normalizeStatus(row.status)} />
                  </Td>

                  <Td minWidth={240}>
                    <div className="flex min-w-0 items-center gap-1">
                      <input
                        value={displayRemarks}
                        onChange={(event) =>
                          handleRemarksChange(key, event.target.value)
                        }
                        placeholder="Add remarks"
                        className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2 py-1 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />

                      {isRemarksDirty && (
                        <button
                          type="button"
                          onClick={() =>
                            handleRemarksUpdate(
                              key,
                              row.bs_id,
                              editedRemarks[key],
                            )
                          }
                          disabled={isUpdating}
                          className="shrink-0 rounded-lg bg-blue-600 px-2 py-1 text-[11px] font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                          {isUpdating ? "..." : "Save"}
                        </button>
                      )}
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Th({ children, className = "", minWidth }) {
  return (
    <th
      scope="col"
      style={{ minWidth }}
      className={`whitespace-nowrap border-b border-slate-200 px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600 ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = "", minWidth }) {
  return (
    <td
      style={minWidth ? { minWidth } : undefined}
      className={`border-b border-slate-100 px-3 py-2 text-slate-700 ${className}`}
    >
      {children}
    </td>
  );
}

function Pagination({ page, totalPages, totalRows, setPage }) {
  if (totalRows === 0) return null;

  const start = (page - 1) * ROWS_PER_PAGE + 1;
  const end = Math.min(page * ROWS_PER_PAGE, totalRows);

  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row">
      <p className="text-xs text-slate-500 sm:text-sm">
        Showing{" "}
        <span className="font-semibold text-slate-700">
          {start}–{end}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-700">
          {totalRows.toLocaleString()}
        </span>{" "}
        records
      </p>

      <div className="flex items-center gap-2">
        <PageButton
          label="« First"
          onClick={() => setPage(1)}
          disabled={page === 1}
        />

        <PageButton
          label="‹ Prev"
          onClick={() => setPage((previous) => previous - 1)}
          disabled={page === 1}
        />

        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
          {page} / {totalPages}
        </span>

        <PageButton
          label="Next ›"
          onClick={() => setPage((previous) => previous + 1)}
          disabled={page === totalPages}
        />

        <PageButton
          label="Last »"
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
        />
      </div>
    </div>
  );
}

function PageButton({ label, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {label}
    </button>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "FULLY MATCHED": "bg-emerald-100 text-emerald-700",
    RECONCILED: "bg-blue-100 text-blue-700",
    "PARTIALLY MATCHED": "bg-amber-100 text-amber-700",
    "AP & GL MATCHED": "bg-purple-100 text-purple-700",
    "AP & BANK MATCHED": "bg-cyan-100 text-cyan-700",
    "GL & BANK MATCHED": "bg-indigo-100 text-indigo-700",
    "AP ONLY": "bg-teal-100 text-teal-700",
    "GL ONLY": "bg-blue-100 text-blue-700",
    "BANK ONLY": "bg-orange-100 text-orange-700",
    MISMATCHED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        styles[status] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {status || "—"}
    </span>
  );
}
