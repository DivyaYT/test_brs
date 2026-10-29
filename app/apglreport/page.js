"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const PAGE_SIZE = 50;

const getStatus = (row) => {
  const apExists = row.ap_id != null;
  const glExists = row.gl_id != null;

  if (apExists && !glExists) return "AP ONLY";
  if (!apExists && glExists) return "GL ONLY";

  // if (!apExists && !glExists) return "UNKNOWN";

  const receipts = Number(row.receipts || 0);
  const payments = Number(row.payments || 0);
  const debit = Number(row.gl_debit || 0);
  const credit = Number(row.gl_credit || 0);

  return Math.abs(receipts - debit) < 0.01 && Math.abs(payments - credit) < 0.01
    ? "AP & GL MATCHED"
    : "MISMATCHED";
};

const getReportRow = (row) => {
  const apBalance = Number(row.receipts || 0) - Number(row.payments || 0);

  const glBalance = Number(row.gl_debit || 0) - Number(row.gl_credit || 0);

  return {
    ...row,
    invoice: row.invoice_number || row.check_receipt_number || "",
    vendor: row.vendor_name || row.gl_name || "",
    apBalance,
    glBalance,
    difference: apBalance - glBalance,
    reportStatus: getStatus(row),
  };
};

export default function APGLReport() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        const res = await axios.get("/api/apglreport");
        setData(res.data.map(getReportRow));
      } catch (err) {
        console.error(err);
        setError("Unable to load AP & GL report.");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  const counts = useMemo(
    () => ({
      TOTAL: data.length,
      "AP & GL MATCHED": data.filter(
        (r) => r.reportStatus === "AP & GL MATCHED",
      ).length,
      MISMATCHED: data.filter((r) => r.reportStatus === "MISMATCHED").length,
      "AP ONLY": data.filter((r) => r.reportStatus === "AP ONLY").length,
      "GL ONLY": data.filter((r) => r.reportStatus === "GL ONLY").length,
    }),
    [data],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return data.filter((row) => {
      const matchesSearch =
        String(row.invoice).toLowerCase().includes(q) ||
        String(row.vendor).toLowerCase().includes(q) ||
        String(row.cmc_no || "")
          .toLowerCase()
          .includes(q);

      const matchesStatus = status === "ALL" || row.reportStatus === status;

      return matchesSearch && matchesStatus;
    });
  }, [data, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const downloadExcel = () => {
    const excelRows = filtered.map((row) => ({
      "Invoice No": row.invoice,
      "Vendor Name": row.vendor,
      "CMC No": row.cmc_no,
      "AP Date": row.ap_gl_date,
      "AP Receipts": row.receipts,
      "AP Payments": row.payments,
      "AP Balance": row.apBalance,
      "GL Date": row.gl_date,
      "GL Debit": row.gl_debit,
      "GL Credit": row.gl_credit,
      "GL Balance": row.glBalance,
      "AP GL Difference": row.difference,
      Status: row.reportStatus,
    }));

    const sheet = XLSX.utils.json_to_sheet(excelRows);
    const book = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(book, sheet, "AP GL Report");

    XLSX.writeFile(book, "AP_GL_Comparison_Report.xlsx");
  };

  const statusStyle = {
    "AP & GL MATCHED": "bg-green-100 text-green-800",
    MISMATCHED: "bg-red-100 text-red-800",
    "AP ONLY": "bg-orange-100 text-orange-800",
    "GL ONLY": "bg-blue-100 text-blue-800",
    UNKNOWN: "bg-gray-100 text-gray-700",
  };

  const cards = [
    ["TOTAL", "Total Records"],
    ["AP & GL MATCHED", "Matched"],
    ["MISMATCHED", "Mismatched"],
    ["AP ONLY", "AP Only"],
    ["GL ONLY", "GL Only"],
  ];

  const headers = [
    "Invoice No",
    "Vendor Name",
    "CMC No",
    "AP Date",
    "AP Receipts",
    "AP Payments",
    "AP Balance",
    "GL Date",
    "GL Debit",
    "GL Credit",
    "GL Balance",
    "AP GL Difference",
    "Status",
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <h1 className="text-2xl font-bold text-gray-800 mb-5">
        AP & GL Comparison Report
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        {cards.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setStatus(key === "TOTAL" ? "ALL" : key)}
            className={`bg-white rounded-lg shadow-sm border
              p-4 text-left hover:border-blue-400
              ${status === key ? "border-blue-500" : ""}`}
          >
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-2xl font-bold mt-2">{counts[key]}</p>
          </button>
        ))}
      </div>

      <div
        className="bg-white rounded-lg border p-4 mb-4
                      flex flex-wrap gap-3"
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Invoice, Vendor, CMC..."
          className="border rounded px-3 py-2 text-sm flex-1"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="ALL">All Statuses</option>
          <option value="AP & GL MATCHED">Matched</option>
          <option value="MISMATCHED">Mismatched</option>
          <option value="AP ONLY">AP Only</option>
          <option value="GL ONLY">GL Only</option>
        </select>

        <button
          onClick={downloadExcel}
          className="bg-green-600 text-white px-4 py-2
                     rounded text-sm hover:bg-green-700"
        >
          Download Excel
        </button>
      </div>

      <div className="bg-white border rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-max w-full text-xs border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="border px-3 py-3 text-left whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={headers.length} className="text-center p-8">
                    Loading report...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="text-center p-8 text-red-600"
                  >
                    {error}
                  </td>
                </tr>
              ) : pageData.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="text-center p-8">
                    No records found
                  </td>
                </tr>
              ) : (
                pageData.map((row, index) => (
                  <tr
                    key={`${row.ap_id ?? "a"}-${row.gl_id ?? "g"}-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="border px-3 py-2">{row.invoice}</td>
                    <td className="border px-3 py-2">{row.vendor}</td>
                    <td className="border px-3 py-2">{row.cmc_no || "-"}</td>
                    <td className="border px-3 py-2">
                      {row.ap_gl_date || "-"}
                    </td>
                    <td className="border px-3 py-2 text-right">
                      {formatAmount(row.receipts)}
                    </td>
                    <td className="border px-3 py-2 text-right">
                      {formatAmount(row.payments)}
                    </td>
                    <td className="border px-3 py-2 text-right font-semibold">
                      {formatAmount(row.apBalance)}
                    </td>
                    <td className="border px-3 py-2">{row.gl_date || "-"}</td>
                    <td className="border px-3 py-2 text-right">
                      {formatAmount(row.gl_debit)}
                    </td>
                    <td className="border px-3 py-2 text-right">
                      {formatAmount(row.gl_credit)}
                    </td>
                    <td className="border px-3 py-2 text-right font-semibold">
                      {formatAmount(row.glBalance)}
                    </td>
                    <td className="border px-3 py-2 text-right font-semibold">
                      {formatAmount(row.difference)}
                    </td>
                    <td className="border px-3 py-2">
                      <span
                        className={`px-2 py-1 rounded whitespace-nowrap
                        ${statusStyle[row.reportStatus]}`}
                      >
                        {row.reportStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center p-4">
          <span className="text-xs text-gray-500">
            {filtered.length} records
          </span>

          <div className="flex items-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="border rounded px-3 py-1 disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-sm">
              {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="border rounded px-3 py-1 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
