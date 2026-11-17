// "use client";

// import { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import * as XLSX from "xlsx";

// const normalizeStatus = (s) => (s || "").trim().toUpperCase();

// const ROWS_PER_PAGE = 500;
// const AMOUNT_TOLERANCE = 0.01;

// const toNumber = (value) => {
//   if (value === null || value === undefined || value === "") return 0;

//   const cleaned = String(value).replace(/[^0-9.-]/g, "");
//   const parsed = Number(cleaned);

//   return Number.isNaN(parsed) ? 0 : parsed;
// };

// const toCents = (value) => Math.round(toNumber(value) * 100);

// const formatAmount = (cents) =>
//   (cents / 100).toLocaleString("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

// export default function BRSPage() {
//   const [data, setData] = useState([]);
//   const [bankData, setBankData] = useState([]);

//   const [apSelectedRow, setApSelectedRow] = useState(null);
//   const [bkSelected, setBkSelected] = useState([]);

//   const [apSearch, setApSearch] = useState("");
//   const [bkSearch, setBkSearch] = useState("");

//   const [updatingKey, setUpdatingKey] = useState(null);
//   const [editedNames, setEditedNames] = useState({});
//   const [reconciling, setReconciling] = useState(false);

//   const [apPage, setApPage] = useState(1);
//   const [bkPage, setBkPage] = useState(1);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     setApPage(1);
//   }, [apSearch]);

//   useEffect(() => {
//     setBkPage(1);
//   }, [bkSearch]);

//   const fetchData = async () => {
//     try {
//       const res = await axios.get("/api/report");
//       const all = res.data;

//       setData(
//         all.filter(
//           (r) =>
//             ["AP & GL MATCHED", "AP ONLY", "BANK ONLY", "GL ONLY"].includes(
//               normalizeStatus(r.status)?.trim(),
//             ) &&
//             (r.ap_id != null || r.gl_id != null),
//         ),
//       );

//       setBankData(
//         all.filter((r) => r.bs_id && normalizeStatus(r.status) === "BANK ONLY"),
//       );
//     } catch (err) {
//       console.error("Error fetching data:", err);
//     }
//   };

//   const filteredAP = useMemo(() => {
//     const q = apSearch.trim().toLowerCase();

//     if (!q) return data;

//     return data.filter(
//       (r) =>
//         (r.invoice_number || "").toLowerCase().includes(q) ||
//         (r.vendor_name || "").toLowerCase().includes(q),
//     );
//   }, [data, apSearch]);

//   const filteredBK = useMemo(() => {
//     const q = bkSearch.trim().toLowerCase();

//     if (!q) return bankData;

//     return bankData.filter(
//       (r) =>
//         (r.invoice_number || "").toLowerCase().includes(q) ||
//         (r.transfer_name || r.vendor_name || "").toLowerCase().includes(q),
//     );
//   }, [bankData, bkSearch]);

//   const apTotalPages = Math.max(
//     1,
//     Math.ceil(filteredAP.length / ROWS_PER_PAGE),
//   );

//   const bkTotalPages = Math.max(
//     1,
//     Math.ceil(filteredBK.length / ROWS_PER_PAGE),
//   );

//   const pagedAP = useMemo(
//     () =>
//       filteredAP.slice((apPage - 1) * ROWS_PER_PAGE, apPage * ROWS_PER_PAGE),
//     [filteredAP, apPage],
//   );

//   const pagedBK = useMemo(
//     () =>
//       filteredBK.slice((bkPage - 1) * ROWS_PER_PAGE, bkPage * ROWS_PER_PAGE),
//     [filteredBK, bkPage],
//   );

//   const getAPSelectionKey = (row) => {
//     if (row.ap_id == null && row.gl_id == null) {
//       return `ap:${row.invoice_number || row.check_receipt_number || "unknown"}`;
//     }

//     return `ap:${row.ap_id ?? "none"}:${row.gl_id ?? "none"}`;
//   };

//   const getBankSelectionKey = (row) => {
//     if (row.bs_id == null) {
//       return `bank:${row.invoice_number || row.check_receipt_number || "unknown"}`;
//     }

//     return `bank:${row.bs_id}`;
//   };

//   const bkSelectedKeys = useMemo(
//     () => new Set(bkSelected.map((row) => row.selectionKey)),
//     [bkSelected],
//   );

//   const dashboardTotals = useMemo(() => {
//     const apReceipt = data.reduce((sum, row) => sum + toCents(row.receipts), 0);

//     const apPayment = data.reduce((sum, row) => sum + toCents(row.payments), 0);

//     const glDebit = data.reduce((sum, row) => sum + toCents(row.gl_debit), 0);

//     const glCredit = data.reduce((sum, row) => sum + toCents(row.gl_credit), 0);

//     const bankDeposits = bankData.reduce(
//       (sum, row) => sum + toCents(row.deposits),
//       0,
//     );

//     const bankWithdrawals = bankData.reduce(
//       (sum, row) => sum + toCents(row.withdrawals),
//       0,
//     );

//     return {
//       apTotal: apReceipt + apPayment,
//       glTotal: glDebit + glCredit,
//       bankTotal: bankDeposits + bankWithdrawals,
//       apReceipt,
//       apPayment,
//       glDebit,
//       glCredit,
//       bankDeposits,
//       bankWithdrawals,
//     };
//   }, [data, bankData]);

//   const selectedApTotals = useMemo(() => {
//     if (!apSelectedRow) {
//       return {
//         payment: 0,
//         receipt: 0,
//       };
//     }

//     return {
//       payment: toCents(apSelectedRow.ap_payment),
//       receipt: toCents(apSelectedRow.ap_receipt),
//     };
//   }, [apSelectedRow]);

//   const selectedGlTotals = useMemo(() => {
//     if (!apSelectedRow) {
//       return {
//         debit: 0,
//         credit: 0,
//       };
//     }

//     return {
//       debit: toCents(apSelectedRow.gl_debit),
//       credit: toCents(apSelectedRow.gl_credit),
//     };
//   }, [apSelectedRow]);

//   const selectedBankTotals = useMemo(
//     () =>
//       bkSelected.reduce(
//         (totals, row) => ({
//           withdrawals: totals.withdrawals + toCents(row.withdrawals),
//           deposits: totals.deposits + toCents(row.deposits),
//         }),
//         { withdrawals: 0, deposits: 0 },
//       ),
//     [bkSelected],
//   );

//   const selectedApTotal = selectedApTotals.payment + selectedApTotals.receipt;

//   const selectedGlTotal = selectedGlTotals.debit + selectedGlTotals.credit;

//   const selectedBankTotal =
//     selectedBankTotals.withdrawals + selectedBankTotals.deposits;

//   const hasBothSelections = Boolean(apSelectedRow) && bkSelected.length > 0;

//   const apMatchesBank =
//     hasBothSelections && selectedApTotal === selectedBankTotal;

//   const glMatchesBank =
//     hasBothSelections && selectedGlTotal === selectedBankTotal;

//   const amountsMatch = apMatchesBank || glMatchesBank;

//   const canReconcile = amountsMatch && !reconciling;

//   const handleVendorChange = (key, value) =>
//     setEditedNames((prev) => ({
//       ...prev,
//       [key]: value,
//     }));

//   const handleVendorUpdate = async (key, bs_id, name) => {
//     if (!name) return;

//     setUpdatingKey(key);

//     try {
//       await axios.put("/api/brs/update-vendor", {
//         id: bs_id,
//         name,
//       });

//       setData((prev) =>
//         prev.map((r) => (r.bs_id === bs_id ? { ...r, new_name: name } : r)),
//       );

//       setBankData((prev) =>
//         prev.map((r) => (r.bs_id === bs_id ? { ...r, new_name: name } : r)),
//       );

//       setEditedNames((prev) => {
//         const updated = { ...prev };
//         delete updated[key];
//         return updated;
//       });

//       alert("Vendor name updated!");
//     } catch {
//       alert("Failed to update vendor name.");
//     } finally {
//       setUpdatingKey(null);
//     }
//   };

//   const toggleAP = (row) => {
//     if (reconciling) return;

//     const selectionKey = getAPSelectionKey(row);

//     if (apSelectedRow?.selectionKey === selectionKey) {
//       setApSelectedRow(null);
//       return;
//     }

//     setApSelectedRow({
//       ...row,
//       selectionKey,
//       ap_receipt: row.receipts ?? 0,
//       ap_payment: row.payments ?? 0,
//     });
//   };

//   const toggleBK = (row) => {
//     if (reconciling) return;

//     const selectionKey = getBankSelectionKey(row);

//     setBkSelected((prev) =>
//       prev.some((item) => item.selectionKey === selectionKey)
//         ? prev.filter((item) => item.selectionKey !== selectionKey)
//         : [
//             ...prev,
//             {
//               ...row,
//               selectionKey,
//               withdrawals: row.withdrawals ?? 0,
//               deposits: row.deposits ?? 0,
//             },
//           ],
//     );
//   };

//   const clearAPSelection = () => {
//     setApSelectedRow(null);
//   };

//   const clearBKSelection = () => {
//     setBkSelected([]);
//   };

//   const clearSelections = () => {
//     setApSelectedRow(null);
//     setBkSelected([]);
//   };

//   const toggleBKPage = () => {
//     if (reconciling) return;

//     const pageKeys = new Set(pagedBK.map((row) => getBankSelectionKey(row)));

//     const isBKPageFullySelected = pagedBK.every((row) =>
//       bkSelectedKeys.has(getBankSelectionKey(row)),
//     );

//     if (isBKPageFullySelected) {
//       setBkSelected((prev) =>
//         prev.filter((item) => !pageKeys.has(item.selectionKey)),
//       );
//     } else {
//       setBkSelected((prev) => {
//         const existingKeys = new Set(prev.map((item) => item.selectionKey));

//         const newRows = pagedBK
//           .filter((row) => !existingKeys.has(getBankSelectionKey(row)))
//           .map((row) => ({
//             ...row,
//             selectionKey: getBankSelectionKey(row),
//             withdrawals: row.withdrawals ?? 0,
//             deposits: row.deposits ?? 0,
//           }));

//         return [...prev, ...newRows];
//       });
//     }
//   };

//   const handleReconcile = async () => {
//     if (reconciling || !hasBothSelections) return;

//     if (!amountsMatch) {
//       alert(
//         "Amount mismatch. Cannot reconcile.\n\n" +
//           `AP Total: ${formatAmount(selectedApTotal)}\n` +
//           `GL Total: ${formatAmount(selectedGlTotal)}\n` +
//           `Bank Total: ${formatAmount(selectedBankTotal)}\n\n` +
//           "Reconciliation requires either AP Total = Bank Total or GL Total = Bank Total.",
//       );
//       return;
//     }

//     setReconciling(true);

//     try {
//       await axios.put("/api/brs/reconcile", {
//         matched: [apSelectedRow],
//         unmatched: bkSelected,
//       });

//       clearSelections();

//       await fetchData();

//       alert("Selected records reconciled successfully!");
//     } catch (error) {
//       alert(
//         error.response?.data?.message || "Error reconciling selected records.",
//       );
//     } finally {
//       setReconciling(false);
//     }
//   };

//   const handleDownload = () => {
//     if (!filteredAP.length) {
//       alert("No data to download");
//       return;
//     }

//     const ws = XLSX.utils.json_to_sheet(
//       filteredAP.map((row) => ({
//         "Invoice No": row.invoice_number,
//         "Vendor / Transfer": row.vendor_name || row.transfer_name,
//         "Changed Name": row.new_name,
//         "CMC No": row.cmc_no,
//         "AP Date": row.ap_gl_date,
//         "AP Receipt": row.receipts,
//         "AP Payment": row.payments,
//         "AP Diff": row.ap_diff,
//         "GL Date": row.gl_date,
//         "GL Debit": row.gl_debit,
//         "GL Credit": row.gl_credit,
//         "GL Diff": row.gl_diff,
//         "AP GL Diff": row.ap_gl_diff,
//         "Transfer Date": row.transfer_date,
//         "Bank Deposits": row.deposits,
//         "Bank Withdrawals": row.withdrawals,
//         "Bank Diff": row.bk_diff,
//         "GL BK Diff": row.gl_bk_diff,
//         Status: row.status,
//       })),
//     );

//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Mismatched");

//     const buf = XLSX.write(wb, {
//       bookType: "xlsx",
//       type: "array",
//     });

//     const blob = new Blob([buf], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });

//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");

//     a.href = url;
//     a.download = "Mismatched.xlsx";
//     a.click();

//     URL.revokeObjectURL(url);
//   };

//   const getKey = (row) =>
//     row.bs_id ?? row.ap_id ?? row.gl_id ?? row.check_receipt_number;

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-5">
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h1 className="text-xl font-bold text-gray-800">
//             BRS Reconciliation
//           </h1>

//           <p className="text-xs text-gray-500 mt-0.5">
//             Select one AP/GL record and multiple bank records. Reconcile is
//             enabled when AP Total equals Bank Total or GL Total equals Bank
//             Total.
//           </p>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             type="button"
//             onClick={clearSelections}
//             disabled={
//               reconciling || (!apSelectedRow && bkSelected.length === 0)
//             }
//             className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 font-medium shadow-sm disabled:opacity-50"
//           >
//             Clear All
//           </button>

//           <button
//             onClick={handleDownload}
//             className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 font-medium shadow-sm"
//           >
//             ⬇ Export Excel
//           </button>
//         </div>
//       </div>

//       {(apSelectedRow || bkSelected.length > 0) && (
//         <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
//           <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
//             <p className="text-sm font-semibold text-gray-800">
//               AP/GL selected: {apSelectedRow ? 1 : 0}
//               {" | "}
//               Bank selected: {bkSelected.length}
//             </p>

//             <div className="flex items-center gap-2">
//               <button
//                 type="button"
//                 onClick={clearAPSelection}
//                 disabled={reconciling || !apSelectedRow}
//                 className="rounded-lg border border-red-300 bg-white px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
//               >
//                 Clear AP/GL
//               </button>

//               <button
//                 type="button"
//                 onClick={clearBKSelection}
//                 disabled={reconciling || bkSelected.length === 0}
//                 className="rounded-lg border border-emerald-300 bg-white px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
//               >
//                 Clear Bank
//               </button>

//               <button
//                 type="button"
//                 onClick={clearSelections}
//                 disabled={reconciling}
//                 className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Clear selections
//               </button>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="text-left text-gray-600">
//                   <th className="px-2 py-1">Report</th>
//                   <th className="px-2 py-1 text-right">Selected Total</th>
//                   <th className="px-2 py-1 text-right">Bank Total</th>
//                   <th className="px-2 py-1 text-right">Difference</th>
//                   <th className="px-2 py-1 text-center">Match</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 <tr>
//                   <td className="px-2 py-1 font-semibold">AP Total</td>

//                   <td className="px-2 py-1 text-right font-semibold">
//                     {formatAmount(selectedApTotal)}
//                   </td>

//                   <td className="px-2 py-1 text-right font-semibold">
//                     {formatAmount(selectedBankTotal)}
//                   </td>

//                   <td className="px-2 py-1 text-right font-semibold">
//                     {formatAmount(selectedApTotal - selectedBankTotal)}
//                   </td>

//                   <td className="px-2 py-1 text-center">
//                     {apMatchesBank ? (
//                       <span className="text-green-700 font-bold">✔</span>
//                     ) : (
//                       <span className="text-red-600 font-bold">✘</span>
//                     )}
//                   </td>
//                 </tr>

//                 <tr>
//                   <td className="px-2 py-1 font-semibold">GL Total</td>

//                   <td className="px-2 py-1 text-right font-semibold">
//                     {formatAmount(selectedGlTotal)}
//                   </td>

//                   <td className="px-2 py-1 text-right font-semibold">
//                     {formatAmount(selectedBankTotal)}
//                   </td>

//                   <td className="px-2 py-1 text-right font-semibold">
//                     {formatAmount(selectedGlTotal - selectedBankTotal)}
//                   </td>

//                   <td className="px-2 py-1 text-center">
//                     {glMatchesBank ? (
//                       <span className="text-green-700 font-bold">✔</span>
//                     ) : (
//                       <span className="text-red-600 font-bold">✘</span>
//                     )}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           {hasBothSelections && (
//             <p
//               className={`mt-3 text-xs font-semibold ${
//                 amountsMatch ? "text-green-700" : "text-red-600"
//               }`}
//             >
//               {amountsMatch
//                 ? apMatchesBank
//                   ? "AP Total matches Bank Total — ready to reconcile."
//                   : "GL Total matches Bank Total — ready to reconcile."
//                 : "Neither AP Total nor GL Total matches Bank Total — reconciliation disabled."}
//             </p>
//           )}

//           <p className="mt-2 text-xs text-gray-500">
//             AP/GL selection allows only one record. Bank selection supports
//             multiple records, including selections on other pages or rows hidden
//             by search.
//           </p>
//         </div>
//       )}

//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
//         <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
//           <div className="flex items-center gap-2 px-4 py-3 border-b bg-red-50">
//             <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />

//             <h2 className="text-xs font-bold text-red-700 uppercase tracking-widest">
//               Partially Matched Records
//             </h2>

//             <span className="text-xs bg-white border border-red-200 text-red-600 rounded-full px-2 py-0.5 font-semibold ml-1">
//               {filteredAP.length}
//             </span>

//             <span className="text-xs bg-blue-100 border border-blue-200 text-blue-700 rounded-full px-2 py-0.5 font-semibold ml-auto">
//               Selected: {apSelectedRow ? 1 : 0}
//             </span>

//             <button
//               type="button"
//               onClick={clearAPSelection}
//               disabled={reconciling || !apSelectedRow}
//               className="px-3 py-1 text-xs font-semibold rounded-lg border border-red-300 bg-white text-red-700 hover:bg-red-50 disabled:opacity-50"
//             >
//               Clear
//             </button>
//           </div>

//           <div className="px-3 py-2 border-b bg-gray-50">
//             <SearchInput value={apSearch} onChange={setApSearch} accent="red" />
//           </div>

//           <div className="overflow-auto" style={{ maxHeight: 460 }}>
//             <table
//               className="w-full text-xs border-collapse"
//               style={{ minWidth: 560 }}
//             >
//               <thead className="sticky top-0 z-10 bg-gray-100 text-gray-600">
//                 <tr>
//                   <th className="border border-gray-200 w-9 py-2 text-center bg-yellow-100 text-yellow-800 font-semibold">
//                     Select
//                   </th>

//                   <th className="border border-gray-200 px-3 py-2 text-left whitespace-nowrap font-semibold">
//                     Invoice No
//                   </th>

//                   <th className="border border-gray-200 px-3 py-2 text-left whitespace-nowrap font-semibold">
//                     AP Date
//                   </th>

//                   <th className="border border-gray-200 px-3 py-2 text-left font-semibold">
//                     Vendor
//                   </th>

//                   <th className="border border-gray-200 px-3 py-2 text-right whitespace-nowrap font-semibold">
//                     AP Receipt
//                   </th>

//                   <th className="border border-gray-200 px-3 py-2 text-right whitespace-nowrap font-semibold">
//                     AP Payment
//                   </th>

//                   <th className="border border-gray-200 px-3 py-2 text-right whitespace-nowrap font-semibold">
//                     AP Bal
//                   </th>

//                   <th className="border border-gray-200 px-3 py-2 text-left whitespace-nowrap font-semibold">
//                     GL Date
//                   </th>

//                   <th className="border border-gray-200 px-3 py-2 text-left font-semibold">
//                     Debit
//                   </th>

//                   <th className="border border-gray-200 px-3 py-2 text-right whitespace-nowrap font-semibold">
//                     Credit
//                   </th>

//                   <th className="border border-gray-200 px-3 py-2 text-right whitespace-nowrap font-semibold">
//                     GL Bal
//                   </th>

//                   <th className="border border-gray-200 px-3 py-2 text-right whitespace-nowrap font-semibold">
//                     AP&GL Diff
//                   </th>

//                   <th className="border border-gray-200 px-3 py-2 text-right whitespace-nowrap font-semibold">
//                     Status
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {pagedAP.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan={13}
//                       className="text-center py-12 text-gray-400 text-sm"
//                     >
//                       No mismatched records found
//                     </td>
//                   </tr>
//                 )}

//                 {pagedAP.map((row) => {
//                   const key = getKey(row);
//                   const selectionKey = getAPSelectionKey(row);

//                   const isSelected =
//                     apSelectedRow?.selectionKey === selectionKey;

//                   const rowName = row.vendor_name || row.transfer_name;
//                   const displayName = editedNames[key] ?? rowName;

//                   const isDirty =
//                     editedNames[key] !== undefined &&
//                     editedNames[key] !== rowName;

//                   const isUpdating = updatingKey === key;

//                   return (
//                     <tr
//                       key={selectionKey}
//                       onClick={() => toggleAP(row)}
//                       className={`cursor-pointer transition-colors border-b border-gray-100 ${
//                         isSelected ? "bg-blue-50" : "hover:bg-gray-50"
//                       }`}
//                     >
//                       <td
//                         className={`border border-gray-200 py-1.5 text-center ${
//                           isSelected ? "bg-yellow-200" : "bg-yellow-50"
//                         }`}
//                       >
//                         <input
//                           type="radio"
//                           name="ap-selection"
//                           checked={isSelected}
//                           disabled={reconciling}
//                           onChange={() => toggleAP(row)}
//                           onClick={(event) => event.stopPropagation()}
//                           className="w-3.5 h-3.5 accent-blue-600 cursor-pointer"
//                         />
//                       </td>

//                       <td className="border border-gray-200 px-3 py-1.5 font-mono text-gray-700 whitespace-nowrap">
//                         {row.invoice_number || "—"}
//                       </td>

//                       <td className="border border-gray-200 px-3 py-1.5 whitespace-nowrap">
//                         {row.ap_gl_date || "—"}
//                       </td>

//                       <td className="border border-gray-200 px-3 py-1.5">
//                         <div
//                           className="flex items-center gap-1"
//                           onClick={(event) => event.stopPropagation()}
//                         >
//                           <input
//                             value={displayName || ""}
//                             onChange={(event) =>
//                               handleVendorChange(key, event.target.value)
//                             }
//                             className="border px-1 py-0.5 text-xs flex-1 min-w-0 rounded border-gray-200 bg-white"
//                           />

//                           {isDirty && (
//                             <button
//                               onClick={() =>
//                                 handleVendorUpdate(
//                                   key,
//                                   row.bs_id,
//                                   editedNames[key],
//                                 )
//                               }
//                               disabled={isUpdating}
//                               className="px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded disabled:opacity-50 whitespace-nowrap shrink-0"
//                             >
//                               {isUpdating ? "…" : "Save"}
//                             </button>
//                           )}
//                         </div>
//                       </td>

//                       <td className="border border-gray-200 px-3 py-1.5 text-right text-green-700 font-medium whitespace-nowrap">
//                         {row.receipts ?? "—"}
//                       </td>

//                       <td className="border border-gray-200 px-3 py-1.5 text-right text-red-600 font-medium whitespace-nowrap">
//                         {row.payments ?? "—"}
//                       </td>

//                       <td className="border border-gray-200 px-3 py-1.5 text-right font-bold whitespace-nowrap">
//                         {row.ap_diff ?? "—"}
//                       </td>

//                       <td className="border border-gray-200 px-3 py-1.5 whitespace-nowrap">
//                         {row.gl_date || "—"}
//                       </td>

//                       <td className="border border-gray-200 px-3 py-1.5 text-right text-red-600 font-medium whitespace-nowrap">
//                         {row.gl_debit ?? "—"}
//                       </td>

//                       <td className="border border-gray-200 px-3 py-1.5 text-right text-green-700 font-medium whitespace-nowrap">
//                         {row.gl_credit ?? "—"}
//                       </td>

//                       <td className="border border-gray-200 px-3 py-1.5 text-right font-bold whitespace-nowrap">
//                         {row.gl_diff ?? "—"}
//                       </td>

//                       <td className="border border-gray-200 px-3 py-1.5 text-right font-bold whitespace-nowrap">
//                         {row.ap_gl_diff ?? "—"}
//                       </td>

//                       <td className="border border-gray-200 px-3 py-1.5 text-right font-bold whitespace-nowrap">
//                         {row.status ?? "—"}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           <PaginationBar
//             page={apPage}
//             totalPages={apTotalPages}
//             totalRows={filteredAP.length}
//             setPage={setApPage}
//           />
//         </div>

//         <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
//           <div className="flex items-center justify-between px-4 py-3 border-b bg-emerald-50">
//             <div className="flex items-center gap-2">
//               <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />

//               <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
//                 Bank Statement
//               </h2>

//               <span className="text-xs bg-white border border-emerald-200 text-emerald-600 rounded-full px-2 py-0.5 font-semibold ml-1">
//                 {filteredBK.length}
//               </span>
//             </div>

//             <div className="flex items-center gap-2">
//               <span className="text-xs bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-full px-2 py-0.5 font-semibold">
//                 Selected: {bkSelected.length}
//               </span>

//               <button
//                 type="button"
//                 onClick={clearBKSelection}
//                 disabled={reconciling || bkSelected.length === 0}
//                 className="px-3 py-1 text-xs font-semibold rounded-lg border border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
//               >
//                 Clear
//               </button>

//               <button
//                 onClick={handleReconcile}
//                 disabled={!canReconcile || reconciling}
//                 className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg shadow transition-all"
//               >
//                 {reconciling ? "Reconciling…" : "⚡ Reconcile"}
//               </button>
//             </div>
//           </div>

//           <div className="px-3 py-2 border-b bg-gray-50">
//             <SearchInput
//               value={bkSearch}
//               onChange={setBkSearch}
//               accent="emerald"
//             />
//           </div>

//           <div className="overflow-auto" style={{ maxHeight: 460 }}>
//             <table
//               className="w-full text-xs border-collapse"
//               style={{ minWidth: 460 }}
//             >
//               <thead className="sticky top-0 z-10 bg-gray-100 text-gray-600">
//                 <tr>
//                   <th className="border border-gray-200 w-9 py-2 text-center bg-yellow-100 text-yellow-800 font-semibold">
//                     <input
//                       type="checkbox"
//                       checked={
//                         pagedBK.length > 0 &&
//                         pagedBK.every((row) =>
//                           bkSelectedKeys.has(getBankSelectionKey(row)),
//                         )
//                       }
//                       disabled={reconciling || pagedBK.length === 0}
//                       onChange={toggleBKPage}
//                       onClick={(event) => event.stopPropagation()}
//                       className="w-3.5 h-3.5 accent-emerald-600 cursor-pointer"
//                     />
//                   </th>

//                   <th className="border border-gray-200 px-3 py-2 text-left whitespace-nowrap font-semibold">
//                     Transfer Date
//                   </th>

//                   <th className="border border-gray-200 px-3 py-2 text-left whitespace-nowrap font-semibold">
//                     Invoice No
//                   </th>

//                   <th className="border border-gray-200 px-3 py-2 text-left font-semibold">
//                     Vendor / Transfer
//                   </th>

//                   <th className="border border-gray-200 px-3 py-2 text-right whitespace-nowrap font-semibold">
//                     Withdrawals
//                   </th>

//                   <th className="border border-gray-200 px-3 py-2 text-right whitespace-nowrap font-semibold">
//                     Deposits
//                   </th>

//                   <th className="border border-gray-200 px-3 py-2 text-right whitespace-nowrap font-semibold">
//                     Bank Diff
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {pagedBK.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan={7}
//                       className="text-center py-12 text-gray-400 text-sm"
//                     >
//                       No bank records found
//                     </td>
//                   </tr>
//                 )}

//                 {pagedBK.map((row) => {
//                   const selectionKey = getBankSelectionKey(row);
//                   const isSelected = bkSelectedKeys.has(selectionKey);

//                   const rowName = row.transfer_name || row.vendor_name;

//                   return (
//                     <tr
//                       key={selectionKey}
//                       onClick={() => toggleBK(row)}
//                       className={`cursor-pointer transition-colors border-b border-gray-100 ${
//                         isSelected ? "bg-emerald-50" : "hover:bg-gray-50"
//                       }`}
//                     >
//                       <td
//                         className={`border border-gray-200 py-1.5 text-center ${
//                           isSelected ? "bg-yellow-200" : "bg-yellow-50"
//                         }`}
//                       >
//                         <input
//                           type="checkbox"
//                           checked={isSelected}
//                           disabled={reconciling}
//                           onChange={() => toggleBK(row)}
//                           onClick={(event) => event.stopPropagation()}
//                           className="w-3.5 h-3.5 accent-emerald-600 cursor-pointer"
//                         />
//                       </td>

//                       <td className="border border-gray-200 px-3 py-1.5 whitespace-nowrap">
//                         {row.transfer_date || "—"}
//                       </td>

//                       <td className="border border-gray-200 px-3 py-1.5 font-mono text-gray-700 whitespace-nowrap">
//                         {row.invoice_number || "—"}
//                       </td>

//                       <td
//                         className="border border-gray-200 px-3 py-1.5 truncate max-w-[160px]"
//                         title={rowName}
//                       >
//                         {rowName || "—"}
//                       </td>

//                       <td className="border border-gray-200 px-3 py-1.5 text-right text-red-600 font-medium whitespace-nowrap">
//                         {row.withdrawals ?? "—"}
//                       </td>

//                       <td className="border border-gray-200 px-3 py-1.5 text-right text-green-700 font-medium whitespace-nowrap">
//                         {row.deposits ?? "—"}
//                       </td>

//                       <td className="border border-gray-200 px-3 py-1.5 text-right font-bold whitespace-nowrap">
//                         {row.bk_diff ?? "—"}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           <PaginationBar
//             page={bkPage}
//             totalPages={bkTotalPages}
//             totalRows={filteredBK.length}
//             setPage={setBkPage}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// function PaginationBar({ page, totalPages, totalRows, setPage }) {
//   const start = totalRows === 0 ? 0 : (page - 1) * ROWS_PER_PAGE + 1;

//   const end = Math.min(page * ROWS_PER_PAGE, totalRows);

//   return (
//     <div className="px-4 py-2 border-t bg-gray-50 flex items-center justify-between gap-2 flex-wrap">
//       <span className="text-xs text-gray-400">
//         {totalRows === 0
//           ? "No records"
//           : `${start}–${end} of ${totalRows} records`}
//       </span>

//       <div className="flex items-center gap-1">
//         <PBtn onClick={() => setPage(1)} disabled={page === 1} label="««" />

//         <PBtn
//           onClick={() => setPage((p) => p - 1)}
//           disabled={page === 1}
//           label="‹ Prev"
//         />

//         <span className="text-xs font-semibold text-gray-700 px-2">
//           {page} / {totalPages}
//         </span>

//         <PBtn
//           onClick={() => setPage((p) => p + 1)}
//           disabled={page === totalPages}
//           label="Next ›"
//         />

//         <PBtn
//           onClick={() => setPage(totalPages)}
//           disabled={page === totalPages}
//           label="»»"
//         />
//       </div>
//     </div>
//   );
// }

// function PBtn({ onClick, disabled, label }) {
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className="px-2.5 py-1 text-xs bg-white border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-35 disabled:cursor-not-allowed font-medium text-gray-600 transition-colors"
//     >
//       {label}
//     </button>
//   );
// }

// function SearchInput({ value, onChange, accent }) {
//   const ring =
//     accent === "red" ? "focus:ring-red-300" : "focus:ring-emerald-300";

//   return (
//     <div className="relative">
//       <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs select-none">
//         🔍
//       </span>

//       <input
//         type="text"
//         value={value}
//         onChange={(event) => onChange(event.target.value)}
//         placeholder="Search Invoice No / Vendor..."
//         className={`w-full pl-7 pr-7 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 ${ring} bg-white`}
//       />

//       {value && (
//         <button
//           onClick={() => onChange("")}
//           className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
//         >
//           ✕
//         </button>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const normalizeStatus = (s) => (s || "").trim().toUpperCase();

const ROWS_PER_PAGE = 500;
const AMOUNT_TOLERANCE = 0.01;

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return 0;

  const cleaned = String(value).replace(/[^0-9.-]/g, "");
  const parsed = Number(cleaned);

  return Number.isNaN(parsed) ? 0 : parsed;
};

const toCents = (value) => Math.round(toNumber(value) * 100);

const formatAmount = (cents) =>
  (cents / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function BRSPage() {
  const [data, setData] = useState([]);
  const [bankData, setBankData] = useState([]);

  const [apSelected, setApSelected] = useState([]);
  const [bkSelected, setBkSelected] = useState([]);

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

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/report");
      const all = res.data;

      setData(
        all.filter(
          (r) =>
            ["AP & GL MATCHED", "AP ONLY", "BANK ONLY", "GL ONLY"].includes(
              normalizeStatus(r.status)?.trim(),
            ) &&
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

  const getAPSelectionKey = (row) => {
    if (row.ap_id == null && row.gl_id == null) {
      return `ap:${
        row.invoice_number || row.check_receipt_number || "unknown"
      }`;
    }

    return `ap:${row.ap_id ?? "none"}:${row.gl_id ?? "none"}`;
  };

  const getBankSelectionKey = (row) => {
    if (row.bs_id == null) {
      return `bank:${
        row.invoice_number || row.check_receipt_number || "unknown"
      }`;
    }

    return `bank:${row.bs_id}`;
  };

  const apSelectedKeys = useMemo(
    () => new Set(apSelected.map((row) => row.selectionKey)),
    [apSelected],
  );

  const bkSelectedKeys = useMemo(
    () => new Set(bkSelected.map((row) => row.selectionKey)),
    [bkSelected],
  );

  const dashboardTotals = useMemo(() => {
    const apReceipt = data.reduce((sum, row) => sum + toCents(row.receipts), 0);

    const apPayment = data.reduce((sum, row) => sum + toCents(row.payments), 0);

    const glDebit = data.reduce((sum, row) => sum + toCents(row.gl_debit), 0);

    const glCredit = data.reduce((sum, row) => sum + toCents(row.gl_credit), 0);

    const bankDeposits = bankData.reduce(
      (sum, row) => sum + toCents(row.deposits),
      0,
    );

    const bankWithdrawals = bankData.reduce(
      (sum, row) => sum + toCents(row.withdrawals),
      0,
    );

    return {
      apTotal: apReceipt + apPayment,
      glTotal: glDebit + glCredit,
      bankTotal: bankDeposits + bankWithdrawals,
      apReceipt,
      apPayment,
      glDebit,
      glCredit,
      bankDeposits,
      bankWithdrawals,
    };
  }, [data, bankData]);

  const selectedApTotals = useMemo(
    () =>
      apSelected.reduce(
        (totals, row) => ({
          payment: totals.payment + toCents(row.ap_payment),
          receipt: totals.receipt + toCents(row.ap_receipt),
        }),
        { payment: 0, receipt: 0 },
      ),
    [apSelected],
  );

  const selectedGlTotals = useMemo(
    () =>
      apSelected.reduce(
        (totals, row) => ({
          debit: totals.debit + toCents(row.gl_debit),
          credit: totals.credit + toCents(row.gl_credit),
        }),
        { debit: 0, credit: 0 },
      ),
    [apSelected],
  );

  const selectedBankTotals = useMemo(
    () =>
      bkSelected.reduce(
        (totals, row) => ({
          withdrawals: totals.withdrawals + toCents(row.withdrawals),
          deposits: totals.deposits + toCents(row.deposits),
        }),
        { withdrawals: 0, deposits: 0 },
      ),
    [bkSelected],
  );

  const selectedApTotal = selectedApTotals.payment + selectedApTotals.receipt;

  const selectedGlTotal = selectedGlTotals.debit + selectedGlTotals.credit;

  const selectedBankTotal =
    selectedBankTotals.withdrawals + selectedBankTotals.deposits;

  const hasBothSelections = apSelected.length > 0 && bkSelected.length > 0;

  const apMatchesBank =
    hasBothSelections && selectedApTotal === selectedBankTotal;

  const glMatchesBank =
    hasBothSelections && selectedGlTotal === selectedBankTotal;

  const amountsMatch = apMatchesBank || glMatchesBank;

  const canReconcile = amountsMatch && !reconciling;

  const handleVendorChange = (key, value) =>
    setEditedNames((prev) => ({
      ...prev,
      [key]: value,
    }));

  const handleVendorUpdate = async (key, bs_id, name) => {
    if (!name) return;

    setUpdatingKey(key);

    try {
      await axios.put("/api/brs/update-vendor", {
        id: bs_id,
        name,
      });

      setData((prev) =>
        prev.map((r) => (r.bs_id === bs_id ? { ...r, new_name: name } : r)),
      );

      setBankData((prev) =>
        prev.map((r) => (r.bs_id === bs_id ? { ...r, new_name: name } : r)),
      );

      setEditedNames((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });

      alert("Vendor name updated!");
    } catch {
      alert("Failed to update vendor name.");
    } finally {
      setUpdatingKey(null);
    }
  };

  const toggleAP = (row) => {
    if (reconciling) return;

    const selectionKey = getAPSelectionKey(row);

    setApSelected((prev) =>
      prev.some((item) => item.selectionKey === selectionKey)
        ? prev.filter((item) => item.selectionKey !== selectionKey)
        : [
            ...prev,
            {
              ...row,
              selectionKey,
              ap_receipt: row.receipts ?? 0,
              ap_payment: row.payments ?? 0,
            },
          ],
    );
  };

  const toggleBK = (row) => {
    if (reconciling) return;

    const selectionKey = getBankSelectionKey(row);

    setBkSelected((prev) =>
      prev.some((item) => item.selectionKey === selectionKey)
        ? prev.filter((item) => item.selectionKey !== selectionKey)
        : [
            ...prev,
            {
              ...row,
              selectionKey,
              withdrawals: row.withdrawals ?? 0,
              deposits: row.deposits ?? 0,
            },
          ],
    );
  };

  const clearAPSelection = () => {
    setApSelected([]);
  };

  const clearBKSelection = () => {
    setBkSelected([]);
  };

  const clearSelections = () => {
    setApSelected([]);
    setBkSelected([]);
  };

  const toggleAPPage = () => {
    if (reconciling) return;

    const pageKeys = new Set(pagedAP.map((row) => getAPSelectionKey(row)));

    const isAPPageFullySelected = pagedAP.every((row) =>
      apSelectedKeys.has(getAPSelectionKey(row)),
    );

    if (isAPPageFullySelected) {
      setApSelected((prev) =>
        prev.filter((item) => !pageKeys.has(item.selectionKey)),
      );
    } else {
      setApSelected((prev) => {
        const existingKeys = new Set(prev.map((item) => item.selectionKey));

        const newRows = pagedAP
          .filter((row) => !existingKeys.has(getAPSelectionKey(row)))
          .map((row) => ({
            ...row,
            selectionKey: getAPSelectionKey(row),
            ap_receipt: row.receipts ?? 0,
            ap_payment: row.payments ?? 0,
          }));

        return [...prev, ...newRows];
      });
    }
  };

  const toggleBKPage = () => {
    if (reconciling) return;

    const pageKeys = new Set(pagedBK.map((row) => getBankSelectionKey(row)));

    const isBKPageFullySelected = pagedBK.every((row) =>
      bkSelectedKeys.has(getBankSelectionKey(row)),
    );

    if (isBKPageFullySelected) {
      setBkSelected((prev) =>
        prev.filter((item) => !pageKeys.has(item.selectionKey)),
      );
    } else {
      setBkSelected((prev) => {
        const existingKeys = new Set(prev.map((item) => item.selectionKey));

        const newRows = pagedBK
          .filter((row) => !existingKeys.has(getBankSelectionKey(row)))
          .map((row) => ({
            ...row,
            selectionKey: getBankSelectionKey(row),
            withdrawals: row.withdrawals ?? 0,
            deposits: row.deposits ?? 0,
          }));

        return [...prev, ...newRows];
      });
    }
  };

  const handleReconcile = async () => {
    if (reconciling || !hasBothSelections) return;

    if (!amountsMatch) {
      alert(
        "Amount mismatch. Cannot reconcile.\n\n" +
          `AP Total: ${formatAmount(selectedApTotal)}\n` +
          `GL Total: ${formatAmount(selectedGlTotal)}\n` +
          `Bank Total: ${formatAmount(selectedBankTotal)}\n\n` +
          "Reconciliation requires either AP Total = Bank Total or GL Total = Bank Total.",
      );
      return;
    }

    setReconciling(true);

    try {
      await axios.put("/api/brs/reconcile", {
        matched: apSelected,
        unmatched: bkSelected,
      });

      clearSelections();

      await fetchData();

      alert("Selected records reconciled successfully!");
    } catch (error) {
      alert(
        error.response?.data?.message || "Error reconciling selected records.",
      );
    } finally {
      setReconciling(false);
    }
  };

  const handleDownload = () => {
    if (!filteredAP.length) {
      alert("No data to download");
      return;
    }

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

    const buf = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

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

  const getKey = (row) =>
    row.bs_id ?? row.ap_id ?? row.gl_id ?? row.check_receipt_number;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            BRS Reconciliation
          </h1>

          <p className="text-xs text-gray-500 mt-0.5">
            Select multiple AP/GL records and multiple bank records. Reconcile
            is enabled when AP Total equals Bank Total or GL Total equals Bank
            Total.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearSelections}
            disabled={
              reconciling ||
              (apSelected.length === 0 && bkSelected.length === 0)
            }
            className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 font-medium shadow-sm disabled:opacity-50"
          >
            Clear All
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 font-medium shadow-sm"
          >
            ⬇ Export Excel
          </button>
        </div>
      </div>

      {(apSelected.length > 0 || bkSelected.length > 0) && (
        <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-gray-800">
              AP/GL selected: {apSelected.length}
              {" | "}
              Bank selected: {bkSelected.length}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearAPSelection}
                disabled={reconciling || apSelected.length === 0}
                className="rounded-lg border border-red-300 bg-white px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                Clear AP/GL
              </button>

              <button
                type="button"
                onClick={clearBKSelection}
                disabled={reconciling || bkSelected.length === 0}
                className="rounded-lg border border-emerald-300 bg-white px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
              >
                Clear Bank
              </button>

              <button
                type="button"
                onClick={clearSelections}
                disabled={reconciling}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Clear selections
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="px-2 py-1">Report</th>
                  <th className="px-2 py-1 text-right">Selected Total</th>
                  <th className="px-2 py-1 text-right">Bank Total</th>
                  <th className="px-2 py-1 text-right">Difference</th>
                  <th className="px-2 py-1 text-center">Match</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="px-2 py-1 font-semibold">AP Total</td>

                  <td className="px-2 py-1 text-right font-semibold">
                    {formatAmount(selectedApTotal)}
                  </td>

                  <td className="px-2 py-1 text-right font-semibold">
                    {formatAmount(selectedBankTotal)}
                  </td>

                  <td className="px-2 py-1 text-right font-semibold">
                    {formatAmount(selectedApTotal - selectedBankTotal)}
                  </td>

                  <td className="px-2 py-1 text-center">
                    {apMatchesBank ? (
                      <span className="text-green-700 font-bold">✔</span>
                    ) : (
                      <span className="text-red-600 font-bold">✘</span>
                    )}
                  </td>
                </tr>

                <tr>
                  <td className="px-2 py-1 font-semibold">GL Total</td>

                  <td className="px-2 py-1 text-right font-semibold">
                    {formatAmount(selectedGlTotal)}
                  </td>

                  <td className="px-2 py-1 text-right font-semibold">
                    {formatAmount(selectedBankTotal)}
                  </td>

                  <td className="px-2 py-1 text-right font-semibold">
                    {formatAmount(selectedGlTotal - selectedBankTotal)}
                  </td>

                  <td className="px-2 py-1 text-center">
                    {glMatchesBank ? (
                      <span className="text-green-700 font-bold">✔</span>
                    ) : (
                      <span className="text-red-600 font-bold">✘</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {hasBothSelections && (
            <p
              className={`mt-3 text-xs font-semibold ${
                amountsMatch ? "text-green-700" : "text-red-600"
              }`}
            >
              {amountsMatch
                ? apMatchesBank
                  ? "AP Total matches Bank Total — ready to reconcile."
                  : "GL Total matches Bank Total — ready to reconcile."
                : "Neither AP Total nor GL Total matches Bank Total — reconciliation disabled."}
            </p>
          )}

          <p className="mt-2 text-xs text-gray-500">
            AP/GL selection supports multiple records. Bank selection also
            supports multiple records, including selections on other pages or
            rows hidden by search.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b bg-red-50">
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />

            <h2 className="text-xs font-bold text-red-700 uppercase tracking-widest">
              Partially Matched Records
            </h2>

            <span className="text-xs bg-white border border-red-200 text-red-600 rounded-full px-2 py-0.5 font-semibold ml-1">
              {filteredAP.length}
            </span>

            <span className="text-xs bg-blue-100 border border-blue-200 text-blue-700 rounded-full px-2 py-0.5 font-semibold ml-auto">
              Selected: {apSelected.length}
            </span>

            <button
              type="button"
              onClick={clearAPSelection}
              disabled={reconciling || apSelected.length === 0}
              className="px-3 py-1 text-xs font-semibold rounded-lg border border-red-300 bg-white text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              Clear
            </button>
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
                    <input
                      type="checkbox"
                      checked={
                        pagedAP.length > 0 &&
                        pagedAP.every((row) =>
                          apSelectedKeys.has(getAPSelectionKey(row)),
                        )
                      }
                      disabled={reconciling || pagedAP.length === 0}
                      onChange={toggleAPPage}
                      onClick={(event) => event.stopPropagation()}
                      className="w-3.5 h-3.5 accent-blue-600 cursor-pointer"
                    />
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
                      colSpan={13}
                      className="text-center py-12 text-gray-400 text-sm"
                    >
                      No mismatched records found
                    </td>
                  </tr>
                )}

                {pagedAP.map((row) => {
                  const key = getKey(row);
                  const selectionKey = getAPSelectionKey(row);

                  const isSelected = apSelectedKeys.has(selectionKey);

                  const rowName = row.vendor_name || row.transfer_name;
                  const displayName = editedNames[key] ?? rowName;

                  const isDirty =
                    editedNames[key] !== undefined &&
                    editedNames[key] !== rowName;

                  const isUpdating = updatingKey === key;

                  return (
                    <tr
                      key={selectionKey}
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
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={reconciling}
                          onChange={() => toggleAP(row)}
                          onClick={(event) => event.stopPropagation()}
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
                          onClick={(event) => event.stopPropagation()}
                        >
                          <input
                            value={displayName || ""}
                            onChange={(event) =>
                              handleVendorChange(key, event.target.value)
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

            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-full px-2 py-0.5 font-semibold">
                Selected: {bkSelected.length}
              </span>

              <button
                type="button"
                onClick={clearBKSelection}
                disabled={reconciling || bkSelected.length === 0}
                className="px-3 py-1 text-xs font-semibold rounded-lg border border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
              >
                Clear
              </button>

              <button
                onClick={handleReconcile}
                disabled={!canReconcile || reconciling}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg shadow transition-all"
              >
                {reconciling ? "Reconciling…" : "⚡ Reconcile"}
              </button>
            </div>
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
                    <input
                      type="checkbox"
                      checked={
                        pagedBK.length > 0 &&
                        pagedBK.every((row) =>
                          bkSelectedKeys.has(getBankSelectionKey(row)),
                        )
                      }
                      disabled={reconciling || pagedBK.length === 0}
                      onChange={toggleBKPage}
                      onClick={(event) => event.stopPropagation()}
                      className="w-3.5 h-3.5 accent-emerald-600 cursor-pointer"
                    />
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
                  const selectionKey = getBankSelectionKey(row);
                  const isSelected = bkSelectedKeys.has(selectionKey);

                  const rowName = row.transfer_name || row.vendor_name;

                  return (
                    <tr
                      key={selectionKey}
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
                          disabled={reconciling}
                          onChange={() => toggleBK(row)}
                          onClick={(event) => event.stopPropagation()}
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
        onChange={(event) => onChange(event.target.value)}
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
