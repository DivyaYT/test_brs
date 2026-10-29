"use client";
import { useEffect, useState, useMemo } from "react";
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
const normalizeStatus = (s) => (s || "").trim().toUpperCase();

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
  const rowsPerPage = 50;

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    setMatchedPage(1);
    setUnmatchedPage(1);
  }, [search, statusFilter]);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/report");
      setData(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const getKey = (row) =>
    row.bs_id ?? row.ap_id ?? row.gl_id ?? row.check_receipt_number;

  const handleVendorChange = (key, value) =>
    setEditedNames((prev) => ({ ...prev, [key]: value }));

  const handleRemarksChange = (key, value) =>
    setEditedRemarks((prev) => ({ ...prev, [key]: value }));

  const handleVendorUpdate = async (key, bs_id, name) => {
    if (!name) return;
    setUpdatingKey(key);
    try {
      await axios.put("/api/brs/update-vendor", { id: bs_id, name });
      setData((prev) =>
        prev.map((row) =>
          row.bs_id === bs_id ? { ...row, new_name: name } : row,
        ),
      );
      setEditedNames((prev) => {
        const u = { ...prev };
        delete u[key];
        return u;
      });
      alert("Vendor name updated successfully!");
    } catch {
      alert("Failed to update vendor name.");
    } finally {
      setUpdatingKey(null);
    }
  };

  const handleRemarksUpdate = async (key, bs_id, remarks) => {
    setUpdatingKey(key);
    try {
      await axios.put("/api/brs/update-remarks", {
        id: bs_id,
        remarks: remarks,
      });
      setData((prev) =>
        prev.map((row) =>
          row.bs_id === bs_id ? { ...row, remarks: remarks || "" } : row,
        ),
      );
      setEditedRemarks((prev) => {
        const u = { ...prev };
        delete u[key];
        return u;
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
    if (!rows.length) return alert("No data to download");
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
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BRS Report");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "BRS_Report.xlsx";
    a.click();
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
    };
    if (MATCHED_STATUSES.includes(normalizeStatus(row.status))) {
      setMatchedSelected((prev) =>
        prev?.invoiceKey === invoiceKey ? null : item,
      );
    } else if (UNMATCHED_STATUSES.includes(normalizeStatus(row.status))) {
      setUnmatchedSelected((prev) =>
        prev?.invoiceKey === invoiceKey ? null : item,
      );
    }
  };

  const handleReconcile = async () => {
    if (!matchedSelected || !unmatchedSelected)
      return alert("Select one matched and one unmatched record to reconcile!");
    try {
      await axios.put("/api/brs/reconcile", {
        matched: matchedSelected,
        unmatched: unmatchedSelected,
      });
      alert("Records reconciled successfully!");
      setData((prev) =>
        prev.map((row) => {
          const inv = row.invoice_number || row.check_receipt_number;
          if (
            inv === matchedSelected.invoiceKey ||
            inv === unmatchedSelected.invoiceKey
          )
            return { ...row, status: "RECONCILED" };
          return row;
        }),
      );
      setMatchedSelected(null);
      setUnmatchedSelected(null);
    } catch {
      alert("Error reconciling records");
    }
  };

  const applySearchFilter = (rows) => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => {
      const invoice = (row.invoice_number || "").toLowerCase();
      const vendor = (row.vendor_name || row.transfer_name || "").toLowerCase();
      return invoice.includes(q) || vendor.includes(q);
    });
  };

  const applyFilters = (rows) => {
    let f = rows;
    if (statusFilter !== "ALL")
      f = f.filter((r) => normalizeStatus(r.status) === statusFilter);
    return applySearchFilter(f);
  };

  const buildTableData = (statusGroup) => {
    let rows = data.filter((r) =>
      statusGroup.includes(normalizeStatus(r.status)),
    );
    if (statusFilter !== "ALL") {
      if (statusGroup.includes(statusFilter))
        rows = rows.filter((r) => normalizeStatus(r.status) === statusFilter);
      else rows = [];
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

  const paginate = (arr, page) =>
    arr.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const matchedData = paginate(matched, matchedPage);
  const unmatchedData = paginate(unmatched, unmatchedPage);
  const matchedTotal = Math.ceil(matched.length / rowsPerPage);
  const unmatchedTotal = Math.ceil(unmatched.length / rowsPerPage);

  const dashboardCounts = useMemo(() => {
    const counts = {
      TOTAL: data.length,
      "FULLY MATCHED": 0,
      "PARTIALLY MATCHED": 0,
      "AP & GL MATCHED": 0,
      "AP & BANK MATCHED": 0,
      "GL & BANK MATCHED": 0,
      "AP ONLY": 0,
      "GL ONLY": 0,
      "BANK ONLY": 0,
      RECONCILED: 0,
      MISMATCHED: 0,
    };
    data.forEach((x) => {
      const s = normalizeStatus(x.status);
      if (counts[s] !== undefined) counts[s]++;
    });
    return counts;
  }, [data]);

  const cardMeta = {
    TOTAL: {
      label: "Total Records",
      color: "border-gray-400",
      bg: "bg-gray-50",
      text: "text-gray-700",
      dot: "bg-gray-500",
    },
    "FULLY MATCHED": {
      label: "Fully Matched",
      color: "border-green-500",
      bg: "bg-green-50",
      text: "text-green-700",
      dot: "bg-green-500",
    },
    "PARTIALLY MATCHED": {
      label: "Partially Matched",
      color: "border-yellow-400",
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      dot: "bg-yellow-400",
    },
    "AP & GL MATCHED": {
      label: "AP & GL Matched",
      color: "border-purple-600",
      bg: "bg-purple-50",
      text: "text-purple-700",
      dot: "bg-purple-600",
    },
    "AP & BANK MATCHED": {
      label: "AP & BANK Matched",
      color: "border-cyan-600",
      bg: "bg-cyan-50",
      text: "text-cyan-700",
      dot: "bg-cyan-600",
    },
    "GL & BANK MATCHED": {
      label: "GL & BANK Matched",
      color: "border-indigo-600",
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      dot: "bg-indigo-600",
    },
    "AP ONLY": {
      label: "AP Only",
      color: "border-green-600",
      bg: "bg-green-50",
      text: "text-green-700",
      dot: "bg-green-600",
    },
    "GL ONLY": {
      label: "GL Only",
      color: "border-blue-600",
      bg: "bg-blue-50",
      text: "text-blue-700",
      dot: "bg-blue-600",
    },
    "BANK ONLY": {
      label: "BANK Only",
      color: "border-orange-600",
      bg: "bg-orange-50",
      text: "text-orange-700",
      dot: "bg-orange-600",
    },
    RECONCILED: {
      label: "Reconciled",
      color: "border-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-700",
      dot: "bg-blue-500",
    },
    MISMATCHED: {
      label: "Mismatched",
      color: "border-red-500",
      bg: "bg-red-50",
      text: "text-red-700",
      dot: "bg-red-500",
    },
  };

  const isReconcileEnabled = !!matchedSelected && !!unmatchedSelected;

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen overflow-x-hidden">
      <h1 className="text-2xl font-bold mb-5 text-gray-800">
        BRS Reconciliation Report
      </h1>

      {/* DASHBOARD */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        {Object.entries(dashboardCounts).map(([status, count]) => {
          const meta = cardMeta[status];
          const isActive = statusFilter === status;
          const clickable = status !== "TOTAL";
          return (
            <div
              key={status}
              onClick={() =>
                clickable &&
                setStatusFilter((prev) => (prev === status ? "ALL" : status))
              }
              className={[
                "rounded-lg border-l-4 p-4 shadow-sm transition-all",
                meta.bg,
                meta.color,
                clickable ? "cursor-pointer hover:shadow-md" : "cursor-default",
                isActive ? "ring-2 ring-offset-1 ring-blue-400" : "",
              ].join(" ")}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                <span
                  className={`text-xs font-semibold uppercase tracking-wide ${meta.text}`}
                >
                  {meta.label}
                </span>
              </div>
              <div className={`text-3xl font-bold ${meta.text}`}>{count}</div>
              {clickable && (
                <div className="text-xs text-gray-400 mt-1">
                  {isActive ? "Click to clear" : "Click to filter"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-lg border shadow-sm p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by Invoice No or Vendor / Transfer..."
              className="border rounded px-3 py-2 pl-8 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-base"
              >
                ✕
              </button>
            )}
          </div>
          <select
            className="border rounded px-3 py-2 text-sm min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="FULLY MATCHED">Fully Matched</option>
            <option value="PARTIALLY MATCHED">Partially Matched</option>
            <option value="AP & GL MATCHED">AP & GL Matched</option>
            <option value="AP & BANK MATCHED">AP & BANK Matched</option>
            <option value="GL & BANK MATCHED">GL & BANK Matched</option>
            <option value="AP ONLY">AP Only</option>
            <option value="GL ONLY">GL Only</option>
            <option value="BANK ONLY">BANK Only</option>
            <option value="RECONCILED">Reconciled</option>
            <option value="MISMATCHED">Mismatched</option>
          </select>
          {statusFilter !== "ALL" && (
            <button
              onClick={() => setStatusFilter("ALL")}
              className="px-3 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200 border whitespace-nowrap"
            >
              ✕ Clear Filter
            </button>
          )}
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 whitespace-nowrap ml-auto"
          >
            ⬇ Download Excel
          </button>
        </div>

        {(search || statusFilter !== "ALL") && (
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
            {search && (
              <span className="bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded-full">
                Search: "{search}"
              </span>
            )}
            {statusFilter !== "ALL" && (
              <span className="bg-purple-50 border border-purple-200 text-purple-700 px-2 py-0.5 rounded-full">
                Status: {statusFilter}
              </span>
            )}
            <span className="text-gray-400">
              — {matched.length + unmatched.length} record(s) shown
            </span>
          </div>
        )}
      </div>

      {/* SELECTION SUMMARY + RECONCILE */}
      {(matchedSelected || unmatchedSelected) && (
        <div className="mb-4 flex flex-wrap gap-3 items-center bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <div className="flex flex-wrap gap-4 flex-1 text-sm">
            {matchedSelected && (
              <span className="text-blue-800">
                <span className="font-semibold">Matched Invoice:</span>{" "}
                <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded">
                  {matchedSelected.invoiceKey}
                </span>
              </span>
            )}
            {unmatchedSelected && (
              <span className="text-red-800">
                <span className="font-semibold">Unmatched Invoice:</span>{" "}
                <span className="font-mono bg-red-100 px-1.5 py-0.5 rounded">
                  {unmatchedSelected.invoiceKey}
                </span>
              </span>
            )}
          </div>
          {isReconcileEnabled && (
            <button
              onClick={handleReconcile}
              className="px-5 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow text-sm whitespace-nowrap"
            >
              ⚡ Reconcile Selected
            </button>
          )}
        </div>
      )}

      {/* MATCHED TABLE */}
      <Table
        title={`Matched Records${statusFilter !== "ALL" && MATCHED_STATUSES.includes(statusFilter) ? ` — ${statusFilter}` : ""}`}
        data={matchedData}
        totalCount={matched.length}
        selectedInvoiceKey={matchedSelected?.invoiceKey ?? null}
        handleSelect={handleSelect}
        showCheckboxStatus="PARTIALLY MATCHED"
        getKey={getKey}
        editable={false}
        editedRemarks={editedRemarks}
        handleRemarksChange={handleRemarksChange}
        handleRemarksUpdate={handleRemarksUpdate}
        updatingKey={updatingKey}
      />
      <Pagination
        page={matchedPage}
        totalPages={matchedTotal}
        totalRows={matched.length}
        setPage={setMatchedPage}
      />

      {/* UNMATCHED TABLE */}
      <Table
        title={`Unmatched Records${statusFilter === "MISMATCHED" ? " — MISMATCHED" : ""}`}
        data={unmatchedData}
        totalCount={unmatched.length}
        selectedInvoiceKey={unmatchedSelected?.invoiceKey ?? null}
        handleSelect={handleSelect}
        getKey={getKey}
        editable={true}
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
        totalPages={unmatchedTotal}
        totalRows={unmatched.length}
        setPage={setUnmatchedPage}
      />
    </div>
  );
}

// ─── FROZEN COLUMN CONFIG ─────────────────────────────────────────────────────
const FROZEN_WIDTHS = [44, 140, 200];
const frozenLeftOffset = (i) =>
  FROZEN_WIDTHS.slice(0, i).reduce((s, w) => s + w, 0);
const frozenStyle = (i, bg = "#ffffff") => ({
  position: "sticky",
  left: frozenLeftOffset(i),
  zIndex: 10,
  width: FROZEN_WIDTHS[i],
  minWidth: FROZEN_WIDTHS[i],
  maxWidth: FROZEN_WIDTHS[i],
  backgroundColor: bg,
  ...(i === 2 ? { boxShadow: "3px 0 6px -2px rgba(0,0,0,0.12)" } : {}),
});
const frozenHeaderStyle = (i) => ({ ...frozenStyle(i, "#f3f4f6"), zIndex: 20 });

// ─── TABLE ────────────────────────────────────────────────────────────────────
function Table({
  title,
  data,
  totalCount,
  selectedInvoiceKey,
  handleSelect,
  showCheckboxStatus,
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
  const scrollingHeaders = [
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
    "AP_GL_DIFF",
    "Transfer Date",
    "Deposits",
    "Withdrawals",
    "Bank Diff",
    "GL_BK_DIFF",
    "Status",
    "Remarks",
  ];

  return (
    <div className="mb-2 border rounded-lg shadow-sm bg-white overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b bg-gray-50">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
          {title}
        </h2>
        <span className="text-xs font-medium text-gray-500 bg-white border rounded-full px-2.5 py-0.5">
          {totalCount} record{totalCount !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table body — no horizontal scroll */}
      <div className="overflow-y-auto max-h-[420px] overflow-x-hidden">
        <div style={{ display: "contents" }}>
          <table
            className="border-collapse text-sm w-full"
            style={{ tableLayout: "fixed" }}
          >
            <colgroup>
              <col style={{ width: FROZEN_WIDTHS[0] }} />
              <col style={{ width: FROZEN_WIDTHS[1] }} />
              <col style={{ width: FROZEN_WIDTHS[2] }} />
              {scrollingHeaders.map((h) => (
                <col key={h} style={{ width: 130 }} />
              ))}
            </colgroup>

            <thead style={{ position: "sticky", top: 0, zIndex: 20 }}>
              <tr>
                <th
                  className="border px-2 py-2 text-left text-xs font-semibold"
                  style={frozenHeaderStyle(0)}
                >
                  Select
                </th>
                <th
                  className="border px-3 py-2 text-left whitespace-nowrap text-xs font-semibold"
                  style={frozenHeaderStyle(1)}
                >
                  Invoice No
                </th>
                <th
                  className="border px-3 py-2 text-left whitespace-nowrap text-xs font-semibold"
                  style={frozenHeaderStyle(2)}
                >
                  Vendor / Transfer
                </th>
                {scrollingHeaders.map((h) => (
                  <th
                    key={h}
                    className="border px-3 py-2 text-left whitespace-nowrap text-xs font-semibold bg-gray-100"
                    style={{ minWidth: 130 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={3 + scrollingHeaders.length}
                    className="text-center py-8 text-gray-400 text-sm"
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
                const showCheckbox =
                  !showCheckboxStatus ||
                  (row.status || "").trim() === showCheckboxStatus;
                const rowName = row.vendor_name || row.transfer_name;
                const displayName = editable
                  ? (editedNames[key] ?? rowName)
                  : rowName;
                const isDirty =
                  editable &&
                  editedNames[key] !== undefined &&
                  editedNames[key] !== rowName;
                const isUpdating = updatingKey === key;
                const cellBg = isSelected ? "#dbeafe" : "#ffffff";

                const savedRemarks = row.remarks || "";
                const displayRemarks = editedRemarks[key] ?? savedRemarks;
                const isRemarksDirty =
                  editedRemarks[key] !== undefined &&
                  editedRemarks[key] !== savedRemarks;

                return (
                  <tr
                    key={key}
                    className={isSelected ? "bg-blue-50" : "hover:bg-gray-50"}
                  >
                    <td
                      className="border px-2 py-1 text-center"
                      style={frozenStyle(0, cellBg)}
                    >
                      {showCheckbox && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelect(row)}
                        />
                      )}
                    </td>
                    <td
                      className="border px-3 py-1 whitespace-nowrap text-xs font-mono text-gray-700"
                      style={frozenStyle(1, cellBg)}
                    >
                      {row.invoice_number || "—"}
                    </td>
                    <td
                      className="border px-3 py-1 text-xs"
                      style={frozenStyle(2, cellBg)}
                    >
                      {editable ? (
                        <div className="flex items-center gap-1">
                          <input
                            value={displayName || ""}
                            onChange={(e) =>
                              handleVendorChange(key, e.target.value)
                            }
                            className="border px-1 py-0.5 text-xs flex-1 min-w-0 rounded"
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
                              {isUpdating ? "..." : "Save"}
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="block truncate" title={displayName}>
                          {displayName}
                        </span>
                      )}
                    </td>
                    <td className="border px-3 py-1 text-purple-700 font-medium whitespace-nowrap text-xs">
                      {row.new_name || "—"}
                    </td>
                    <td className="border px-3 py-1 whitespace-nowrap text-xs text-gray-600">
                      {row.cmc_no || "—"}
                    </td>
                    <td className="border px-3 py-1 whitespace-nowrap text-xs">
                      {row.ap_gl_date || "—"}
                    </td>
                    <td className="border px-3 py-1 text-green-700 whitespace-nowrap text-xs font-medium">
                      {row.receipts ?? "—"}
                    </td>
                    <td className="border px-3 py-1 text-red-600 whitespace-nowrap text-xs font-medium">
                      {row.payments ?? "—"}
                    </td>
                    <td className="border px-3 py-1 whitespace-nowrap text-xs font-semibold">
                      {row.ap_diff ?? "—"}
                    </td>
                    <td className="border px-3 py-1 whitespace-nowrap text-xs">
                      {row.gl_date || "—"}
                    </td>
                    <td className="border px-3 py-1 text-green-700 whitespace-nowrap text-xs">
                      {row.gl_debit ?? "—"}
                    </td>
                    <td className="border px-3 py-1 text-red-600 whitespace-nowrap text-xs">
                      {row.gl_credit ?? "—"}
                    </td>
                    <td className="border px-3 py-1 whitespace-nowrap text-xs font-semibold">
                      {row.gl_diff ?? "—"}
                    </td>
                    <td className="border px-3 py-1 whitespace-nowrap text-xs font-semibold">
                      {row.ap_gl_diff ?? "—"}
                    </td>
                    <td className="border px-3 py-1 whitespace-nowrap text-xs">
                      {row.transfer_date || "—"}
                    </td>
                    <td className="border px-3 py-1 text-green-700 whitespace-nowrap text-xs">
                      {row.deposits ?? "—"}
                    </td>
                    <td className="border px-3 py-1 text-red-600 whitespace-nowrap text-xs">
                      {row.withdrawals ?? "—"}
                    </td>
                    <td className="border px-3 py-1 whitespace-nowrap text-xs font-semibold">
                      {row.bk_diff ?? "—"}
                    </td>
                    <td className="border px-3 py-1 whitespace-nowrap text-xs font-semibold">
                      {row.gl_bk_diff ?? "—"}
                    </td>
                    <td className="border px-3 py-1 whitespace-nowrap">
                      <StatusBadge status={normalizeStatus(row.status)} />
                    </td>
                    <td className="border px-3 py-1">
                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          value={displayRemarks}
                          onChange={(e) =>
                            handleRemarksChange(key, e.target.value)
                          }
                          placeholder="Add remarks"
                          className="border px-1 py-0.5 text-xs flex-1 min-w-0 rounded border-gray-200 bg-white"
                        />
                        {isRemarksDirty && (
                          <button
                            onClick={() =>
                              handleRemarksUpdate(
                                key,
                                row.bs_id,
                                editedRemarks[key],
                              )
                            }
                            disabled={isUpdating}
                            className="px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded disabled:opacity-50 whitespace-nowrap shrink-0"
                          >
                            {isUpdating ? "..." : "Save"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── PAGINATION ───────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, totalRows, setPage }) {
  if (totalPages <= 0) return null;
  const start = (page - 1) * 50 + 1;
  const end = Math.min(page * 50, totalRows);
  return (
    <div className="flex justify-between items-center gap-4 mb-5 px-1">
      <span className="text-xs text-gray-500">
        Showing {start}–{end} of {totalRows} records
      </span>
      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 text-sm bg-white border rounded disabled:opacity-40 hover:bg-gray-50"
        >
          ← Prev
        </button>
        <span className="text-sm font-semibold text-gray-700">
          {page} / {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 text-sm bg-white border rounded disabled:opacity-40 hover:bg-gray-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    "FULLY MATCHED": "bg-green-600",
    RECONCILED: "bg-blue-600",
    "PARTIALLY MATCHED": "bg-orange-500",
    "AP & GL MATCHED": "bg-purple-600",
    "AP & BANK MATCHED": "bg-cyan-600",
    "GL & BANK MATCHED": "bg-indigo-600",
    "AP ONLY": "bg-pink-600",
    "GL ONLY": "bg-teal-600",
    "BANK ONLY": "bg-amber-600",
    MISMATCHED: "bg-red-600",
  };
  return (
    <span
      className={`${map[status] ?? "bg-gray-400"} text-white px-2 py-0.5 rounded text-xs font-medium`}
    >
      {status || "—"}
    </span>
  );
}
