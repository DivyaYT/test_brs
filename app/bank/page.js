// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { FiEdit, FiTrash2 } from "react-icons/fi";

// export default function BankStatementPage() {
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [rowsUploaded, setRowsUploaded] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [data, setData] = useState([]);
//   const [editingId, setEditingId] = useState(null);

//   const [form, setForm] = useState({
//     TRANSFER_DATE: "",
//     INVOICE_NUMBER: "",
//     TRANSFER_NAME: "",
//     WITHDRAWALS: "",
//     DEPOSITS: "",
//     BALANCE: "",
//   });

//   const displayColumns = [
//     "TRANSFER_DATE",
//     "INVOICE_NUMBER",
//     "TRANSFER_NAME",
//     "WITHDRAWALS",
//     "DEPOSITS",
//     "BALANCE",
//   ];

//   // Fetch all bank records
//   const fetchData = async () => {
//     try {
//       const res = await axios.get("/api/bank");
//       setData(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Handle Excel file upload
//   const handleFileUpload = async (e) => {
//     const selectedFile = e.target.files[0];
//     if (!selectedFile) return;

//     setFile(selectedFile);
//     setUploading(true);
//     setRowsUploaded(null);
//     setErrorMessage("");

//     try {
//       const arrayBuffer = await selectedFile.arrayBuffer();
//       const response = await axios.patch("/api/bank", arrayBuffer, {
//         headers: { "Content-Type": "application/octet-stream" },
//       });

//       const uploadedRows = response.data?.rowsUploaded || 0;
//       setRowsUploaded(uploadedRows);
//       fetchData();
//     } catch (error) {
//       console.error(error);
//       setErrorMessage(error.response?.data?.error || "Upload failed.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Handle edit button click
//   const handleEdit = (row) => {
//     const newForm = {};
//     displayColumns.forEach((key) => {
//       newForm[key] = row[key] || row[key.toLowerCase()] || "";
//     });
//     setForm(newForm);
//     setEditingId(row.BS_ID || row.bs_id);
//   };

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   // Handle update record
//   const handleUpdate = async (id) => {
//     try {
//       await axios.put("/api/bank", { ...form, id });
//       setEditingId(null);
//       setForm({
//         TRANSFER_DATE: "",
//         INVOICE_NUMBER: "",
//         TRANSFER_NAME: "",
//         WITHDRAWALS: "",
//         DEPOSITS: "",
//         BALANCE: "",
//       });
//       fetchData();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Handle delete record
//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this record?")) return;

//     try {
//       await axios.delete(`/api/bank?id=${id}`);
//       fetchData();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Calculate totals for dashboard
//   const totalWithdrawals = data.reduce(
//     (acc, row) => acc + Number(row.WITHDRAWALS || row.withdrawals || 0),
//     0,
//   );
//   const totalDeposits = data.reduce(
//     (acc, row) => acc + Number(row.DEPOSITS || row.deposits || 0),
//     0,
//   );

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold mb-4 sm:mb-0">
//           Bank Statement Dashboard
//         </h1>

//         <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded shadow">
//           {uploading ? "Uploading..." : "Upload Excel"}
//           <input
//             type="file"
//             accept=".xlsx,.xls,.csv"
//             onChange={handleFileUpload}
//             className="hidden"
//           />
//         </label>
//       </div>

//       {/* Notifications */}
//       {rowsUploaded !== null && (
//         <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
//           ✅ Uploaded {rowsUploaded} row{rowsUploaded > 1 ? "s" : ""}
//         </div>
//       )}
//       {errorMessage && (
//         <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
//           ❌ {errorMessage}
//         </div>
//       )}

//       {/* Dashboard */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//         <div className="bg-white p-4 rounded shadow text-center">
//           <p className="text-gray-500">Total Records</p>
//           <h2 className="text-2xl font-bold">{data.length}</h2>
//         </div>
//         <div className="bg-white p-4 rounded shadow text-center">
//           <p className="text-gray-500">Total Withdrawals</p>
//           <h2 className="text-2xl font-bold">{totalWithdrawals}</h2>
//         </div>
//         <div className="bg-white p-4 rounded shadow text-center">
//           <p className="text-gray-500">Total Deposits</p>
//           <h2 className="text-2xl font-bold">{totalDeposits}</h2>
//         </div>
//       </div>

//       {/* Table */}
//       {data.length > 0 && (
//         <div className="overflow-x-auto">
//           <table className="min-w-full border shadow rounded-lg">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2 border">ID</th>
//                 {displayColumns.map((col) => (
//                   <th key={col} className="p-2 border">
//                     {col}
//                   </th>
//                 ))}
//                 <th className="p-2 border">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((row) => {
//                 const rowId = row.BS_ID || row.bs_id;
//                 return (
//                   <tr key={rowId} className="hover:bg-gray-50">
//                     <td className="p-2 border">{rowId}</td>
//                     {displayColumns.map((col) => (
//                       <td key={col} className="p-2 border">
//                         {editingId === rowId ? (
//                           <input
//                             name={col}
//                             value={form[col] || ""}
//                             onChange={handleChange}
//                             className="border p-1 w-full"
//                           />
//                         ) : (
//                           row[col] || row[col.toLowerCase()] || ""
//                         )}
//                       </td>
//                     ))}
//                     <td className="p-2 border flex gap-2">
//                       {editingId === rowId ? (
//                         <button
//                           onClick={() => handleUpdate(rowId)}
//                           className="text-green-600"
//                         >
//                           Save
//                         </button>
//                       ) : (
//                         <FiEdit
//                           className="cursor-pointer text-blue-500"
//                           onClick={() => handleEdit(row)}
//                         />
//                       )}
//                       <FiTrash2
//                         className="cursor-pointer text-red-500"
//                         onClick={() => handleDelete(rowId)}
//                       />
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

import UploadButton from "../excelhooks/UploadButton";
import Notification from "../excelhooks/Notification";
import DashboardCard from "../excelhooks/DashboardCard";
import PreviewTable from "../excelhooks/PreviewTable";
import MainTable from "../excelhooks/MainTable";
import Pagination from "../excelhooks/Pagination";
import { REQUIRED_HEADERS } from "../excelhooks/RequiredHeaders";

export default function BankStatementPage() {
  const TYPE = "BRS";
  const headersConfig = REQUIRED_HEADERS(TYPE);

  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [notification, setNotification] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const rowsPerPage = 30;

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const res = await axios.get("/api/bank");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= FILE PREVIEW =================
  const handleFileUpload = async (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setFile(f);

    const buffer = await f.arrayBuffer();
    const wb = XLSX.read(buffer);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(ws, { defval: "" });

    const headers = Object.keys(json[0]).map((h) => h.toUpperCase());

    const missing = headersConfig.filter((h) => !headers.includes(h));
    if (missing.length) {
      alert("Missing: " + missing.join(", "));
      return;
    }

    setPreviewData(json.slice(0, 10));
  };

  // ================= UPLOAD =================
  const uploadToServer = async () => {
    try {
      const arrayBuffer = await file.arrayBuffer();

      const res = await axios.patch("/api/bank", arrayBuffer, {
        headers: { "Content-Type": "application/octet-stream" },
      });

      setNotification({
        type: "success",
        message: `Uploaded ${res.data.rowsUploaded}`,
      });

      setPreviewData([]);
      fetchData();
    } catch (err) {
      console.error(err);
      setNotification({
        type: "error",
        message: "Upload failed",
      });
    }
  };

  // ================= TEMPLATE =================
  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      headersConfig.reduce((a, c) => ({ ...a, [c]: "" }), {}),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Template.xlsx");
  };

  // ================= EDIT =================
  const handleEdit = (row) => {
    setEditingId(row.BS_ID || row.bs_id);
    setForm(row);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put("/api/bank", { ...form, id });

      setEditingId(null);
      setNotification({
        type: "success",
        message: "Updated successfully",
      });

      fetchData();
    } catch (err) {
      console.error(err);
      setNotification({
        type: "error",
        message: "Update failed",
      });
    }
  };

  // ================= DELETE (FINAL FIX) =================
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    setDeletingId(id);

    try {
      await axios.delete("/api/bank", {
        params: { id }, // ✅ FIXED
      });

      setNotification({
        type: "success",
        message: "Deleted successfully",
      });

      fetchData();
    } catch (err) {
      console.error(err);
      setNotification({
        type: "error",
        message: "Delete failed",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= PAGINATION =================
  const currentData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bank Statement Upload</h1>

      <UploadButton
        onFileChange={handleFileUpload}
        onDownload={downloadTemplate}
      />

      <Notification notification={notification} />

      <DashboardCard title="Total Records" value={data.length} />

      <PreviewTable
        previewData={previewData}
        headers={headersConfig}
        onUpload={uploadToServer}
      />

      <MainTable
        data={currentData}
        headers={headersConfig}
        editingId={editingId}
        form={form}
        deletingId={deletingId} // ✅ pass this
        onEdit={handleEdit}
        onDelete={handleDelete}
        onChange={handleChange}
        onUpdate={handleUpdate}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => setCurrentPage((p) => p - 1)}
        onNext={() => setCurrentPage((p) => p + 1)}
      />
    </div>
  );
}
