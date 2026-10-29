"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const PAGE_SIZE = 50;

function getGLBankStatus(row) {
  const glExists = row.gl_id != null;
  const bankExists = row.bs_id != null;

  if (glExists && !bankExists) return "GL ONLY";
  if (!glExists && bankExists) return "BANK ONLY";
  if (!glExists && !bankExists) return "UNKNOWN";

  const debit = Number(row.gl_debit || 0);
  const credit = Number(row.gl_credit || 0);
  const deposits = Number(row.deposits || 0);
  const withdrawals = Number(row.withdrawals || 0);

  return Math.abs(debit - deposits) < 0.01 &&
    Math.abs(credit - withdrawals) < 0.01
    ? "GL & BANK MATCHED"
    : "MISMATCHED";
}

export default function GLBankReport() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/api/glbankreport")
      .then((res) => {
        setData(
          res.data.map((r) => {
            const glBalance =
              Number(r.gl_debit || 0) - Number(r.gl_credit || 0);

            const bankBalance =
              Number(r.deposits || 0) - Number(r.withdrawals || 0);

            return {
              ...r,
              glBalance,
              bankBalance,
              difference:
                r.gl_id != null && r.bs_id != null
                  ? glBalance - bankBalance
                  : null,
              reportStatus: getGLBankStatus(r),
            };
          }),
        );
      })
      .catch(() => setError("Failed to load report"))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => {
    const result = {
      TOTAL: data.length,
      "GL & BANK MATCHED": 0,
      MISMATCHED: 0,
      "GL ONLY": 0,
      "BANK ONLY": 0,
    };

    data.forEach((r) => {
      if (result[r.reportStatus] !== undefined) {
        result[r.reportStatus]++;
      }
    });

    return result;
  }, [data]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return data.filter((r) => {
      const searchText = [
        r.invoice_number,
        r.cmc_no,
        r.gl_name,
        r.transfer_name,
      ]
        .join(" ")
        .toLowerCase();

      return (
        searchText.includes(q) &&
        (status === "ALL" || r.reportStatus === status)
      );
    });
  }, [data, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const money = (v) =>
    v == null
      ? "-"
      : Number(v).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  const exportExcel = () => {
    if (!filtered.length) return;

    const excelRows = filtered.map((r) => ({
      "Invoice No": r.invoice_number,
      "CMC No": r.cmc_no,
      "GL Name": r.gl_name,
      "GL Date": r.gl_date,
      "GL Debit": r.gl_debit,
      "GL Credit": r.gl_credit,
      "GL Balance": r.gl_id != null ? r.glBalance : null,
      "Transfer Date": r.transfer_date,
      "Transfer Name": r.transfer_name,
      "Bank Deposits": r.deposits,
      "Bank Withdrawals": r.withdrawals,
      "Bank Balance": r.bs_id != null ? r.bankBalance : null,
      Difference: r.difference,
      Status: r.reportStatus,
    }));

    const ws = XLSX.utils.json_to_sheet(excelRows);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "GL Bank Report");

    XLSX.writeFile(wb, "GL_Bank_Report.xlsx");
  };

  const cards = [
    ["TOTAL", "Total Records"],
    ["GL & BANK MATCHED", "Matched"],
    ["MISMATCHED", "Mismatched"],
    ["GL ONLY", "GL Only"],
    ["BANK ONLY", "Bank Only"],
  ];

  const columns = [
    ["Invoice No", "invoice_number"],
    ["CMC No", "cmc_no"],
    ["GL Name", "gl_name"],
    ["GL Date", "gl_date"],
    ["GL Debit", "gl_debit"],
    ["GL Credit", "gl_credit"],
    ["GL Balance", "glBalance"],
    ["Transfer Date", "transfer_date"],
    ["Transfer Name", "transfer_name"],
    ["Bank Deposits", "deposits"],
    ["Bank Withdrawals", "withdrawals"],
    ["Bank Balance", "bankBalance"],
    ["Difference", "difference"],
    ["Status", "reportStatus"],
  ];

  const numericColumns = new Set([
    "gl_debit",
    "gl_credit",
    "glBalance",
    "deposits",
    "withdrawals",
    "bankBalance",
    "difference",
  ]);

  const colors = {
    "GL & BANK MATCHED": "bg-green-100 text-green-700",
    MISMATCHED: "bg-red-100 text-red-700",
    "GL ONLY": "bg-blue-100 text-blue-700",
    "BANK ONLY": "bg-orange-100 text-orange-700",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <h1 className="text-2xl font-bold mb-5">GL & Bank Comparison Report</h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        {cards.map(([key, label]) => (
          <button
            key={key}
            onClick={() => {
              setStatus(key === "TOTAL" ? "ALL" : key);
              setPage(1);
            }}
            className="bg-white border rounded-lg p-4 text-left
                       shadow-sm hover:border-blue-500"
          >
            <div className="text-xs text-gray-500">{label}</div>
            <div className="text-2xl font-bold mt-2">{counts[key]}</div>
          </button>
        ))}
      </div>

      <div
        className="bg-white border rounded-lg p-4 mb-4
                      flex flex-wrap gap-3"
      >
        <input
          placeholder="Search Invoice, CMC, GL, Bank..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border rounded px-3 py-2 flex-1 text-sm"
        />

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="ALL">All Status</option>
          <option value="GL & BANK MATCHED">Matched</option>
          <option value="MISMATCHED">Mismatched</option>
          <option value="GL ONLY">GL Only</option>
          <option value="BANK ONLY">Bank Only</option>
        </select>

        <button
          onClick={exportExcel}
          className="bg-green-600 text-white px-4 py-2
                     rounded text-sm"
        >
          Download Excel
        </button>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-max w-full text-xs border-collapse">
            <thead className="bg-gray-100">
              <tr>
                {columns.map(([label]) => (
                  <th
                    key={label}
                    className="border px-3 py-3 text-left
                               whitespace-nowrap"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading || error || !rows.length ? (
                <tr>
                  <td colSpan={columns.length} className="text-center p-8">
                    {loading ? "Loading..." : error || "No records found"}
                  </td>
                </tr>
              ) : (
                rows.map((r, index) => (
                  <tr
                    key={`${r.gl_id ?? "g"}-${r.bs_id ?? "b"}-${index}`}
                    className="hover:bg-gray-50"
                  >
                    {columns.map(([label, key]) => {
                      const value =
                        (key === "glBalance" && r.gl_id == null) ||
                        (key === "bankBalance" && r.bs_id == null)
                          ? null
                          : r[key];

                      return (
                        <td
                          key={key}
                          className="border px-3 py-2 whitespace-nowrap"
                        >
                          {key === "reportStatus" ? (
                            <span
                              className={`rounded px-2 py-1
                              ${colors[value] || "bg-gray-100"}`}
                            >
                              {value}
                            </span>
                          ) : numericColumns.has(key) ? (
                            money(value)
                          ) : (
                            (value ?? "-")
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between p-4 items-center">
          <span className="text-xs text-gray-500">
            {filtered.length} records
          </span>

          <div className="flex items-center gap-3">
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
