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

export default function APUploadPage() {
  const TYPE = "AP";
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
      const res = await axios.get("/api/ap");
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

      const res = await axios.patch("/api/ap", arrayBuffer, {
        headers: {
          "Content-Type": "application/octet-stream",
        },
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
    setEditingId(row.AP_ID || row.ap_id);
    setForm(row);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put("/api/ap", {
        ...form,
        id,
      });

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

  // ================= DELETE (FIXED) =================
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    setDeletingId(id);

    try {
      await axios.delete("/api/ap", {
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
      <h1 className="text-2xl font-bold mb-4">AP Upload</h1>

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
        deletingId={deletingId} // ✅ important
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
