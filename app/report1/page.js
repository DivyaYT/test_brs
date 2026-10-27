"use client";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const normalizeStatus = (s) => (s || "").trim().toUpperCase();
const ROWS_PER_PAGE = 50;

export default function BRSPage() {
  const [data, setData] = useState([]);
  const [bankData, setBankData] = useState([]);
  const [apSelected, setApSelected] = useState(null);
  const [bkSelected, setBkSelected] = useState(null);
  const [apSearch, setApSearch] = useState("");
  const [bkSearch, setBkSearch] = useState("");
  const [updatingKey, setUpdatingKey] = useState(null);
  const [editedNames, setEditedNames] = useState({});
  const [reconciling, setReconciling] = useState(false);
  const [apPage, setApPage] = useState(1);
  const [bkPage, setBkPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    setApPage(1);
  }, [apSearch]);
  useEffect(() => {
    setBkPage(1);
  }, [bkSearch]);

  // PARTIALLY MATCHED
  // MISMATCHED

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/report");
      const all = res.data;

      setData(
        all.filter(
          (r) =>
            [
              "AP & GL MATCHED",
              // "AP & BANK MATCHED",
              // "GL & BANK MATCHED",
              "AP ONLY",
              "BANK ONLY",
              "GL ONLY",
            ].includes(normalizeStatus(r.status)?.trim()) &&
            (r.ap_id != null || r.gl_id != null),
        ),
      );
      setBankData(
        all.filter((r) => r.bs_id && normalizeStatus(r.status) === "BANK ONLY"),
      );
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // ── FILTERED ──────────────────────────────────────────────────────────────
  const filteredAP = useMemo(() => {
    const q = apSearch.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (r) =>
        (r.invoice_number || "").toLowerCase().includes(q) ||
        (r.vendor_name || "").toLowerCase().includes(q),
    );
  }, [data, apSearch]);

  const filteredBK = useMemo(() => {
    const q = bkSearch.trim().toLowerCase();
    if (!q) return bankData;
    return bankData.filter(
      (r) =>
        (r.invoice_number || "").toLowerCase().includes(q) ||
        (r.transfer_name || r.vendor_name || "").toLowerCase().includes(q),
    );
  }, [bankData, bkSearch]);

  // ── PAGINATED ─────────────────────────────────────────────────────────────
  const apTotalPages = Math.max(
    1,
    Math.ceil(filteredAP.length / ROWS_PER_PAGE),
  );
  const bkTotalPages = Math.max(
    1,
    Math.ceil(filteredBK.length / ROWS_PER_PAGE),
  );

  const pagedAP = useMemo(
    () =>
      filteredAP.slice((apPage - 1) * ROWS_PER_PAGE, apPage * ROWS_PER_PAGE),
    [filteredAP, apPage],
  );
  const pagedBK = useMemo(
    () =>
      filteredBK.slice((bkPage - 1) * ROWS_PER_PAGE, bkPage * ROWS_PER_PAGE),
    [filteredBK, bkPage],
  );

  // ── VENDOR EDIT ───────────────────────────────────────────────────────────
  const handleVendorChange = (key, value) =>
    setEditedNames((prev) => ({ ...prev, [key]: value }));

  const handleVendorUpdate = async (key, bs_id, name) => {
    if (!name) return;
    setUpdatingKey(key);
    try {
      await axios.put("/api/brs/update-vendor", { id: bs_id, name });
      setData((prev) =>
        prev.map((r) => (r.bs_id === bs_id ? { ...r, new_name: name } : r)),
      );
      setBankData((prev) =>
        prev.map((r) => (r.bs_id === bs_id ? { ...r, new_name: name } : r)),
      );
      setEditedNames((prev) => {
        const u = { ...prev };
        delete u[key];
        return u;
      });
      alert("Vendor name updated!");
    } catch {
      alert("Failed to update vendor name.");
    } finally {
      setUpdatingKey(null);
    }
  };

  // ── RECONCILE ─────────────────────────────────────────────────────────────
  const handleReconcile = async () => {
    if (!apSelected || !bkSelected) return;
    setReconciling(true);
    try {
      await axios.put("/api/brs/reconcile", {
        matched: apSelected,
        unmatched: bkSelected,
      });
      alert("Reconciled successfully!");
      await fetchData();
      setApSelected(null);
      setBkSelected(null);
    } catch {
      alert("Error reconciling.");
    } finally {
      setReconciling(false);
    }
  };

  // ── DOWNLOAD ──────────────────────────────────────────────────────────────
  const handleDownload = () => {
    if (!filteredAP.length) return alert("No data to download");
    const ws = XLSX.utils.json_to_sheet(
      filteredAP.map((row) => ({
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
        "AP GL Diff": row.ap_gl_diff,
        "Transfer Date": row.transfer_date,
        "Bank Deposits": row.deposits,
        "Bank Withdrawals": row.withdrawals,
        "Bank Diff": row.bk_diff,
        "GL BK Diff": row.gl_bk_diff,
        Status: row.status,
      })),
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Mismatched");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Mismatched.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── HELPERS ───────────────────────────────────────────────────────────────
  const getKey = (row) =>
    row.bs_id ?? row.ap_id ?? row.gl_id ?? row.check_receipt_number;

  const makeItem = (row) => {
    const key = getKey(row);
    const invoiceKey =
      row.invoice_number || row.check_receipt_number || String(key);
    return {
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
    };
  };

  // Single-select toggle: clicking the already-selected row deselects it
  const toggleAP = (row) => {
    const item = makeItem(row);
    setApSelected((prev) =>
      prev?.invoiceKey === item.invoiceKey ? null : item,
    );
  };

  const toggleBK = (row) => {
    const item = makeItem(row);
    setBkSelected((prev) =>
      prev?.invoiceKey === item.invoiceKey ? null : item,
    );
  };

  const canReconcile = !!apSelected && !!bkSelected;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-5">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            BRS Reconciliation
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Select one row from each panel then click Reconcile
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 font-medium shadow-sm"
        >
          ⬇ Export Excel
        </button>
      </div>

      {/* SELECTION BANNER */}
      {(apSelected || bkSelected) && (
        <div className="mb-4 flex flex-wrap items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
          <div className="flex flex-wrap gap-4 flex-1 text-sm">
            {apSelected && (
              <span className="text-blue-800">
                <span className="font-semibold">AP/GL:</span>{" "}
                <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs font-mono">
                  {apSelected.invoiceKey}
                </code>
              </span>
            )}

            {bkSelected && (
              <span className="text-emerald-800">
                <span className="font-semibold">Bank:</span>{" "}
                <code className="bg-emerald-100 px-1.5 py-0.5 rounded text-xs font-mono">
                  {bkSelected.invoiceKey}
                </code>
              </span>
            )}
          </div>
          {/* <button
            onClick={handleReconcile}
            disabled={!canReconcile || reconciling}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-sm font-bold rounded-lg shadow transition-all"
          >
            {reconciling ? "Reconciling…" : "⚡ Reconcile Selected"}
          </button> */}
        </div>
      )}

      {/* TWO PANEL LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* ═══ LEFT: MISMATCHED AP/GL ═══ */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b bg-red-50">
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
            <h2 className="text-xs font-bold text-red-700 uppercase tracking-widest">
              Partially Matched Records
            </h2>
            <span className="text-xs bg-white border border-red-200 text-red-600 rounded-full px-2 py-0.5 font-semibold ml-1">
              {filteredAP.length}
            </span>
          </div>

          <div className="px-3 py-2 border-b bg-gray-50">
            <SearchInput value={apSearch} onChange={setApSearch} accent="red" />
          </div>

          <div className="overflow-auto" style={{ maxHeight: 460 }}>
            <table
              className="w-full text-xs border-collapse"
              style={{ minWidth: 560 }}
            >
              <thead className="sticky top-0 z-10 bg-gray-100 text-gray-600">
                <tr>
                  <th className="border border-gray-200 w-9 py-2 text-center bg-yellow-100 text-yellow-800 font-semibold">
                    ✓
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left whitespace-nowrap font-semibold">
                    Invoice No
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left whitespace-nowrap font-semibold">
                    AP Date
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left font-semibold">
                    Vendor
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-right whitespace-nowrap font-semibold">
                    AP Receipt
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-right whitespace-nowrap font-semibold">
                    AP Payment
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-right whitespace-nowrap font-semibold">
                    AP Bal
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left whitespace-nowrap font-semibold">
                    GL Date
                  </th>

                  <th className="border border-gray-200 px-3 py-2 text-left font-semibold">
                    Debit
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-right whitespace-nowrap font-semibold">
                    Credit
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-right whitespace-nowrap font-semibold">
                    GL Bal
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-right whitespace-nowrap font-semibold">
                    AP&GL Diff
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-right whitespace-nowrap font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedAP.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-12 text-gray-400 text-sm"
                    >
                      No mismatched records found
                    </td>
                  </tr>
                )}
                {pagedAP.map((row) => {
                  const key = getKey(row);
                  const invoiceKey =
                    row.invoice_number ||
                    row.check_receipt_number ||
                    String(key);
                  const isSelected = apSelected?.invoiceKey === invoiceKey;
                  const rowName = row.vendor_name || row.transfer_name;
                  const displayName = editedNames[key] ?? rowName;
                  const isDirty =
                    editedNames[key] !== undefined &&
                    editedNames[key] !== rowName;
                  const isUpdating = updatingKey === key;

                  return (
                    <tr
                      key={String(key)}
                      onClick={() => toggleAP(row)}
                      className={`cursor-pointer transition-colors border-b border-gray-100 ${
                        isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <td
                        className={`border border-gray-200 py-1.5 text-center ${
                          isSelected ? "bg-yellow-200" : "bg-yellow-50"
                        }`}
                      >
                        {/* onChange drives the check; onClick stops row-toggle double-fire */}
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleAP(row)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-3.5 h-3.5 accent-blue-600 cursor-pointer"
                        />
                      </td>
                      <td className="border border-gray-200 px-3 py-1.5 font-mono text-gray-700 whitespace-nowrap">
                        {row.invoice_number || "—"}
                      </td>
                      <td className="border border-gray-200 px-3 py-1.5 whitespace-nowrap">
                        {row.ap_gl_date || "—"}
                      </td>
                      <td className="border border-gray-200 px-3 py-1.5">
                        <div
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            value={displayName || ""}
                            onChange={(e) =>
                              handleVendorChange(key, e.target.value)
                            }
                            className="border px-1 py-0.5 text-xs flex-1 min-w-0 rounded border-gray-200 bg-white"
                          />
                          {isDirty && (
                            <button
                              onClick={() =>
                                handleVendorUpdate(
                                  key,
                                  row.bs_id,
                                  editedNames[key],
                                )
                              }
                              disabled={isUpdating}
                              className="px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded disabled:opacity-50 whitespace-nowrap shrink-0"
                            >
                              {isUpdating ? "…" : "Save"}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-200 px-3 py-1.5 text-right text-green-700 font-medium whitespace-nowrap">
                        {row.receipts ?? "—"}
                      </td>
                      <td className="border border-gray-200 px-3 py-1.5 text-right text-red-600 font-medium whitespace-nowrap">
                        {row.payments ?? "—"}
                      </td>
                      <td className="border border-gray-200 px-3 py-1.5 text-right font-bold whitespace-nowrap">
                        {row.ap_diff ?? "—"}
                      </td>
                      <td className="border border-gray-200 px-3 py-1.5 whitespace-nowrap">
                        {row.gl_date || "—"}
                      </td>
                      <td className="border border-gray-200 px-3 py-1.5 text-right text-red-600 font-medium whitespace-nowrap">
                        {row.gl_debit ?? "—"}
                      </td>
                      <td className="border border-gray-200 px-3 py-1.5 text-right text-green-700 font-medium whitespace-nowrap">
                        {row.gl_credit ?? "—"}
                      </td>

                      <td className="border border-gray-200 px-3 py-1.5 text-right font-bold whitespace-nowrap">
                        {row.gl_diff ?? "—"}
                      </td>
                      <td className="border border-gray-200 px-3 py-1.5 text-right font-bold whitespace-nowrap">
                        {row.ap_gl_diff ?? "—"}
                      </td>
                      <td className="border border-gray-200 px-3 py-1.5 text-right font-bold whitespace-nowrap">
                        {row.status ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <PaginationBar
            page={apPage}
            totalPages={apTotalPages}
            totalRows={filteredAP.length}
            setPage={setApPage}
          />
        </div>

        {/* ═══ RIGHT: BANK STATEMENT ═══ */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-emerald-50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                Bank Statement
              </h2>
              <span className="text-xs bg-white border border-emerald-200 text-emerald-600 rounded-full px-2 py-0.5 font-semibold ml-1">
                {filteredBK.length}
              </span>
            </div>
            <button
              onClick={handleReconcile}
              disabled={!canReconcile || reconciling}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg shadow transition-all"
            >
              {reconciling ? "…" : "⚡ Reconcile"}
            </button>
          </div>

          <div className="px-3 py-2 border-b bg-gray-50">
            <SearchInput
              value={bkSearch}
              onChange={setBkSearch}
              accent="emerald"
            />
          </div>

          <div className="overflow-auto" style={{ maxHeight: 460 }}>
            <table
              className="w-full text-xs border-collapse"
              style={{ minWidth: 460 }}
            >
              <thead className="sticky top-0 z-10 bg-gray-100 text-gray-600">
                <tr>
                  <th className="border border-gray-200 w-9 py-2 text-center bg-yellow-100 text-yellow-800 font-semibold">
                    ✓
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left whitespace-nowrap font-semibold">
                    Transfer Date
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left whitespace-nowrap font-semibold">
                    Invoice No
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left font-semibold">
                    Vendor / Transfer
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-right whitespace-nowrap font-semibold">
                    Withdrawals
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-right whitespace-nowrap font-semibold">
                    Deposits
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-right whitespace-nowrap font-semibold">
                    Bank Diff
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedBK.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-12 text-gray-400 text-sm"
                    >
                      No bank records found
                    </td>
                  </tr>
                )}
                {pagedBK.map((row) => {
                  const key = row.bs_id ?? row.check_receipt_number;
                  const invoiceKey =
                    row.invoice_number ||
                    row.check_receipt_number ||
                    String(key);
                  const isSelected = bkSelected?.invoiceKey === invoiceKey;
                  const rowName = row.transfer_name || row.vendor_name;

                  return (
                    <tr
                      key={String(key)}
                      onClick={() => toggleBK(row)}
                      className={`cursor-pointer transition-colors border-b border-gray-100 ${
                        isSelected ? "bg-emerald-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <td
                        className={`border border-gray-200 py-1.5 text-center ${
                          isSelected ? "bg-yellow-200" : "bg-yellow-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleBK(row)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-3.5 h-3.5 accent-emerald-600 cursor-pointer"
                        />
                      </td>
                      <td className="border border-gray-200 px-3 py-1.5 whitespace-nowrap">
                        {row.transfer_date || "—"}
                      </td>
                      <td className="border border-gray-200 px-3 py-1.5 font-mono text-gray-700 whitespace-nowrap">
                        {row.invoice_number || "—"}
                      </td>
                      <td
                        className="border border-gray-200 px-3 py-1.5 truncate max-w-[160px]"
                        title={rowName}
                      >
                        {rowName || "—"}
                      </td>
                      <td className="border border-gray-200 px-3 py-1.5 text-right text-red-600 font-medium whitespace-nowrap">
                        {row.withdrawals ?? "—"}
                      </td>
                      <td className="border border-gray-200 px-3 py-1.5 text-right text-green-700 font-medium whitespace-nowrap">
                        {row.deposits ?? "—"}
                      </td>

                      <td className="border border-gray-200 px-3 py-1.5 text-right font-bold whitespace-nowrap">
                        {row.bk_diff ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <PaginationBar
            page={bkPage}
            totalPages={bkTotalPages}
            totalRows={filteredBK.length}
            setPage={setBkPage}
          />
        </div>
      </div>
    </div>
  );
}

// ─── PAGINATION BAR ───────────────────────────────────────────────────────────
function PaginationBar({ page, totalPages, totalRows, setPage }) {
  const start = totalRows === 0 ? 0 : (page - 1) * ROWS_PER_PAGE + 1;
  const end = Math.min(page * ROWS_PER_PAGE, totalRows);
  return (
    <div className="px-4 py-2 border-t bg-gray-50 flex items-center justify-between gap-2 flex-wrap">
      <span className="text-xs text-gray-400">
        {totalRows === 0
          ? "No records"
          : `${start}–${end} of ${totalRows} records`}
      </span>
      <div className="flex items-center gap-1">
        <PBtn onClick={() => setPage(1)} disabled={page === 1} label="««" />
        <PBtn
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
          label="‹ Prev"
        />
        <span className="text-xs font-semibold text-gray-700 px-2">
          {page} / {totalPages}
        </span>
        <PBtn
          onClick={() => setPage((p) => p + 1)}
          disabled={page === totalPages}
          label="Next ›"
        />
        <PBtn
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
          label="»»"
        />
      </div>
    </div>
  );
}

function PBtn({ onClick, disabled, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-2.5 py-1 text-xs bg-white border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-35 disabled:cursor-not-allowed font-medium text-gray-600 transition-colors"
    >
      {label}
    </button>
  );
}

// ─── SEARCH INPUT ─────────────────────────────────────────────────────────────
function SearchInput({ value, onChange, accent }) {
  const ring =
    accent === "red" ? "focus:ring-red-300" : "focus:ring-emerald-300";
  return (
    <div className="relative">
      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs select-none">
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search Invoice No / Vendor..."
        className={`w-full pl-7 pr-7 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 ${ring} bg-white`}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
        >
          ✕
        </button>
      )}
    </div>
  );
}
