"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const PAGE_SIZE = 50;

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toUpperCase();

const toNumber = (value) => Number(value || 0);

function prepareRow(row) {
  const apExists = row.ap_id != null;
  const bankExists = row.bs_id != null;

  const receipts = toNumber(row.receipts);
  const payments = toNumber(row.payments);
  const deposits = toNumber(row.deposits);
  const withdrawals = toNumber(row.withdrawals);

  const apBalance = receipts - payments;
  const bankBalance = deposits - withdrawals;

  let status = "UNKNOWN";

  if (apExists && !bankExists) {
    status = "AP ONLY";
  } else if (!apExists && bankExists) {
    status = "BANK ONLY";
  } else if (apExists && bankExists) {
    const amountsMatch =
      Math.abs(receipts - deposits) < 0.01 &&
      Math.abs(payments - withdrawals) < 0.01;

    status = amountsMatch ? "AP & BANK MATCHED" : "MISMATCHED";
  }

  return {
    ...row,
    invoice: row.invoice_number || row.check_receipt_number || "",
    vendor: row.vendor_name || "",
    transferName: row.transfer_name || "",
    apBalance,
    bankBalance,
    difference: apBalance - bankBalance,
    reportStatus: status,
  };
}

const STATUS_STYLES = {
  "AP & BANK MATCHED": "bg-green-100 text-green-800",
  MISMATCHED: "bg-red-100 text-red-800",
  "AP ONLY": "bg-orange-100 text-orange-800",
  "BANK ONLY": "bg-blue-100 text-blue-800",
  UNKNOWN: "bg-gray-100 text-gray-700",
};

export default function APBankReport() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReport() {
      try {
        setLoading(true);

        // Must return AP + Bank rows only.
        const res = await axios.get("/api/apbankreport");

        setData((res.data || []).map(prepareRow));
      } catch (err) {
        console.error("AP Bank report error:", err);
        setError("Unable to load AP & Bank report");
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const counts = useMemo(() => {
    const result = {
      TOTAL: data.length,
      "AP & BANK MATCHED": 0,
      MISMATCHED: 0,
      "AP ONLY": 0,
      "BANK ONLY": 0,
    };

    data.forEach((row) => {
      if (result[row.reportStatus] !== undefined) {
        result[row.reportStatus]++;
      }
    });

    return result;
  }, [data]);

  const filtered = useMemo(() => {
    const q = normalize(search);

    return data.filter((row) => {
      const matchesSearch = [
        row.invoice,
        row.vendor,
        row.transferName,
        row.cmc_no,
      ].some((value) => normalize(value).includes(q));

      const matchesStatus =
        statusFilter === "ALL" || row.reportStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const downloadExcel = () => {
    if (!filtered.length) {
      alert("No records available");
      return;
    }

    const excelData = filtered.map((row) => ({
      "Invoice / Check No": row.invoice,
      "Vendor Name": row.vendor,
      "CMC No": row.cmc_no,
      "AP Date": row.ap_gl_date,
      "AP Receipts": row.receipts,
      "AP Payments": row.payments,
      "AP Balance": row.apBalance,
      "Transfer Date": row.transfer_date,
      "Transfer Name": row.transferName,
      "Bank Deposits": row.deposits,
      "Bank Withdrawals": row.withdrawals,
      "Bank Balance": row.bankBalance,
      "AP Bank Difference": row.difference,
      Status: row.reportStatus,
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "AP Bank Report");

    XLSX.writeFile(wb, "AP_Bank_Comparison_Report.xlsx");
  };

  const cards = [
    ["TOTAL", "Total Records"],
    ["AP & BANK MATCHED", "Matched"],
    ["MISMATCHED", "Mismatched"],
    ["AP ONLY", "AP Only"],
    ["BANK ONLY", "Bank Only"],
  ];

  const headers = [
    "Invoice / Check No",
    "Vendor Name",
    "CMC No",
    "AP Date",
    "AP Receipts",
    "AP Payments",
    "AP Balance",
    "Transfer Date",
    "Transfer Name",
    "Bank Deposits",
    "Bank Withdrawals",
    "Bank Balance",
    "AP Bank Difference",
    "Status",
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <h1 className="text-2xl font-bold mb-5 text-gray-800">
        AP & Bank Comparison Report
      </h1>

      {/* Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        {cards.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key === "TOTAL" ? "ALL" : key)}
            className="bg-white border rounded-lg shadow-sm
                       p-4 text-left hover:border-blue-500"
          >
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-2xl font-bold mt-2">{counts[key]}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div
        className="bg-white border rounded-lg p-4 mb-4
                      flex flex-wrap gap-3"
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Invoice, Vendor, Transfer..."
          className="border rounded px-3 py-2 text-sm flex-1"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="ALL">All Statuses</option>
          <option value="AP & BANK MATCHED">AP & Bank Matched</option>
          <option value="MISMATCHED">Mismatched</option>
          <option value="AP ONLY">AP Only</option>
          <option value="BANK ONLY">Bank Only</option>
        </select>

        <button
          onClick={downloadExcel}
          className="bg-green-600 text-white px-4 py-2
                     rounded text-sm hover:bg-green-700"
        >
          Download Excel
        </button>
      </div>

      {/* Report Table */}
      <div className="bg-white border rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-max w-full text-xs border-collapse">
            <thead className="bg-gray-100">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="border px-3 py-3 text-left
                               whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading || error || !pageData.length ? (
                <tr>
                  <td colSpan={headers.length} className="p-8 text-center">
                    {loading
                      ? "Loading report..."
                      : error || "No records found"}
                  </td>
                </tr>
              ) : (
                pageData.map((row, index) => (
                  <tr
                    key={`${row.ap_id ?? "a"}-${row.bs_id ?? "b"}-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="border px-3 py-2">{row.invoice || "-"}</td>
                    <td className="border px-3 py-2">{row.vendor || "-"}</td>
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
                    <td className="border px-3 py-2">
                      {row.transfer_date || "-"}
                    </td>
                    <td className="border px-3 py-2">
                      {row.transferName || "-"}
                    </td>
                    <td className="border px-3 py-2 text-right">
                      {formatAmount(row.deposits)}
                    </td>
                    <td className="border px-3 py-2 text-right">
                      {formatAmount(row.withdrawals)}
                    </td>
                    <td className="border px-3 py-2 text-right font-semibold">
                      {formatAmount(row.bankBalance)}
                    </td>
                    <td className="border px-3 py-2 text-right font-semibold">
                      {formatAmount(row.difference)}
                    </td>
                    <td className="border px-3 py-2">
                      <span
                        className={`px-2 py-1 rounded whitespace-nowrap
                          ${STATUS_STYLES[row.reportStatus]}`}
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

        {/* Pagination */}
        <div className="flex justify-between items-center p-4">
          <span className="text-xs text-gray-500">
            {filtered.length} records
          </span>

          <div className="flex gap-3 items-center">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="border px-3 py-1 rounded
                         disabled:opacity-40"
            >
              Prev
            </button>

            <span className="text-sm">
              {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="border px-3 py-1 rounded
                         disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
