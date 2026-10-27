"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const ROWS_PER_PAGE = 50;
const normalizeStatus = (status) =>
  String(status ?? "")
    .trim()
    .toUpperCase();

const COLUMNS = [
  { key: "invoice_number", label: "Invoice No", sticky: 0 },
  { key: "vendor_transfer", label: "Vendor / Transfer", sticky: 1 },
  { key: "cmc_no", label: "CMC No" },
  { key: "ap_gl_date", label: "AP Date" },
  { key: "receipts", label: "AP Receipt", amount: true },
  { key: "payments", label: "AP Payment", amount: true },
  { key: "ap_diff", label: "AP Bal", amount: true },
  { key: "gl_date", label: "GL Date" },
  { key: "gl_debit", label: "GL Debit", amount: true },
  { key: "gl_credit", label: "GL Credit", amount: true },
  { key: "gl_diff", label: "GL Bal", amount: true },
  { key: "ap_gl_diff", label: "AP_GL_DIFF", amount: true },
  { key: "transfer_date", label: "Transfer Date" },
  { key: "deposits", label: "Deposits", amount: true },
  { key: "withdrawals", label: "Withdrawals", amount: true },
  { key: "bk_diff", label: "Bank Diff", amount: true },
  { key: "gl_bk_diff", label: "GL_BK_DIFF", amount: true },
  { key: "status", label: "Status" },
];

const money = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  const number = Number(value);
  return Number.isFinite(number)
    ? number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : String(value);
};

const displayDate = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  return String(value).slice(0, 10);
};

const normalizeRow = (row) => ({
  ...row,
  invoice_number: row.invoice_number || row.check_receipt_number || "",
  vendor_transfer: row.vendor_name || row.transfer_name || "",
});

function StickyCell({ children, column, header = false }) {
  const left = column.sticky === 0 ? 0 : 150;
  const style =
    column.sticky !== undefined
      ? {
          position: "sticky",
          left,
          zIndex: header ? 30 : 10,
          minWidth: column.sticky === 0 ? 150 : 210,
          width: column.sticky === 0 ? 150 : 210,
          backgroundColor: header ? "#f1f5f9" : "#ffffff",
          boxShadow: column.sticky === 1 ? "3px 0 5px -3px #94a3b8" : "none",
        }
      : undefined;

  const cls = `border-b border-r border-slate-200 px-3 py-2 whitespace-nowrap ${
    header ? "font-semibold text-slate-700" : "text-slate-700"
  } ${column.amount ? "text-right" : "text-left"}`;

  return header ? (
    <th style={style} className={cls}>
      {children}
    </th>
  ) : (
    <td style={style} className={cls}>
      {children}
    </td>
  );
}

export default function MismatchedReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("/api/report");
      if (!Array.isArray(response.data)) {
        throw new Error("The report API must return an array.");
      }
      setData(response.data.map(normalizeRow));
    } catch (err) {
      console.error("Error fetching mismatched report:", err);
      setError(
        err.response?.data?.message || err.message || "Unable to load report",
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const mismatchedRows = useMemo(
    () => data.filter((row) => normalizeStatus(row.status) === "MISMATCHED"),
    [data],
  );

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return mismatchedRows;
    return mismatchedRows.filter((row) =>
      [
        row.invoice_number,
        row.vendor_transfer,
        row.cmc_no,
        row.transfer_name,
        row.gl_name,
        row.reconcile_id,
      ].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [mismatchedRows, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / ROWS_PER_PAGE),
  );
  const safePage = Math.min(page, totalPages);
  const pageRows = filteredRows.slice(
    (safePage - 1) * ROWS_PER_PAGE,
    safePage * ROWS_PER_PAGE,
  );

  const exportExcel = () => {
    if (filteredRows.length === 0) {
      alert("No mismatched records to download.");
      return;
    }
    const exportRows = filteredRows.map((row) =>
      Object.fromEntries(
        COLUMNS.map((column) => [
          column.label,
          column.key === "status"
            ? normalizeStatus(row.status)
            : (row[column.key] ?? ""),
        ]),
      ),
    );
    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    worksheet["!cols"] = COLUMNS.map((col) => ({
      wch: Math.max(col.label.length + 3, col.sticky === 1 ? 28 : 17),
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mismatched Report");
    XLSX.writeFile(workbook, "BRS_Mismatched_Report.xlsx");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Mismatched Report
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            AP • GL • Bank Statement
          </p>
        </div>
        <button
          type="button"
          onClick={fetchData}
          disabled={loading}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm hover:bg-slate-100 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Exactly two dashboard cards */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border-l-4 border-slate-500 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Total Records
          </div>
          <div className="mt-2 text-3xl font-bold text-slate-800">
            {data.length}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            All records from the report API
          </div>
        </div>
        <div className="rounded-xl border-l-4 border-red-600 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Mismatched
          </div>
          <div className="mt-2 text-3xl font-bold text-red-700">
            {mismatchedRows.length}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Transactions with MISMATCHED status
          </div>
        </div>
      </div>

      {/* Report toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border bg-white p-4 shadow-sm">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search invoice, vendor, transfer, CMC..."
          className="min-w-[220px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
        />
        <span className="rounded-full bg-red-100 px-3 py-2 text-xs font-semibold text-red-700">
          MISMATCHED ONLY
        </span>
        <button
          type="button"
          onClick={exportExcel}
          disabled={loading || filteredRows.length === 0}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          Download Excel
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b bg-slate-50 px-4 py-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">
            Mismatched Transactions
          </h2>
          <span className="text-xs text-slate-500">
            {filteredRows.length} records
          </span>
        </div>
        <div className="max-h-[65vh] overflow-auto">
          <table className="w-full min-w-max border-collapse text-xs">
            <thead className="sticky top-0 z-20 bg-slate-100">
              <tr>
                {COLUMNS.map((column) => (
                  <StickyCell key={column.key} column={column} header>
                    {column.label}
                  </StickyCell>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="p-10 text-center text-slate-500"
                  >
                    Loading report...
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="p-10 text-center text-slate-500"
                  >
                    No mismatched records found
                  </td>
                </tr>
              ) : (
                pageRows.map((row, index) => (
                  <tr
                    key={`${row.reconcile_id ?? "r"}-${row.invoice_number}-${row.ap_id ?? "a"}-${row.gl_id ?? "g"}-${row.bs_id ?? "b"}-${index}`}
                    className="hover:bg-slate-50"
                  >
                    {COLUMNS.map((column) => (
                      <StickyCell key={column.key} column={column}>
                        {column.key === "status" ? (
                          <span className="rounded bg-red-600 px-2 py-1 font-semibold text-white">
                            MISMATCHED
                          </span>
                        ) : column.amount ? (
                          money(row[column.key])
                        ) : ["ap_gl_date", "gl_date", "transfer_date"].includes(
                            column.key,
                          ) ? (
                          displayDate(row[column.key])
                        ) : (
                          (row[column.key] ?? "—")
                        )}
                      </StickyCell>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm">
          <span className="text-slate-500">
            {filteredRows.length === 0
              ? "Showing 0 records"
              : `Showing ${(safePage - 1) * ROWS_PER_PAGE + 1}–${Math.min(safePage * ROWS_PER_PAGE, filteredRows.length)} of ${filteredRows.length}`}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage(safePage - 1)}
              className="rounded border bg-white px-3 py-1 disabled:opacity-40"
            >
              Previous
            </button>
            <span>
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage(safePage + 1)}
              className="rounded border bg-white px-3 py-1 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
