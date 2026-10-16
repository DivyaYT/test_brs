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

export default function GLUploadPage() {
  const TYPE = "GL";
  const headersConfig = REQUIRED_HEADERS(TYPE);

  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [notification, setNotification] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 30;
  const API_BASE = "/api/gl"; // base API URL

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      const res = await axios.get(API_BASE);
      setData(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= FILE UPLOAD PREVIEW =================
  const handleFileUpload = async (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setFile(f);

    const buffer = await f.arrayBuffer();
    const wb = XLSX.read(buffer);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(ws, { defval: "" });

    // Check required headers
    const headers = Object.keys(json[0] || {}).map((h) => h.toUpperCase());
    const missing = headersConfig.filter((h) => !headers.includes(h));
    if (missing.length) {
      alert("Missing columns: " + missing.join(", "));
      return;
    }

    setPreviewData(json.slice(0, 10));
  };

  // ================= UPLOAD TO SERVER =================
  const uploadToServer = async () => {
    if (!file) return;

    const buffer = await file.arrayBuffer();

    try {
      const res = await axios.patch(API_BASE, buffer, {
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });

      setNotification({
        type: "success",
        message: `Uploaded ${res.data.rowsUploaded} rows successfully`,
      });
      setPreviewData([]);
      fetchData();
    } catch (err) {
      console.error("Upload error:", err);
      setNotification({
        type: "error",
        message: err.response?.data?.error || "Upload failed",
      });
    }
  };

  // ================= DOWNLOAD TEMPLATE =================
  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      headersConfig.reduce((a, c) => ({ ...a, [c]: "" }), {}),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "GL_Template.xlsx");
  };

  // ================= EDIT / UPDATE =================
  const handleEdit = (row) => {
    setEditingId(row.gl_id); // match server id
    setForm(row);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(API_BASE, { ...form, id });
      setEditingId(null);
      fetchData();
      setNotification({ type: "success", message: "Updated successfully" });
    } catch (err) {
      console.error("Update error:", err);
      setNotification({
        type: "error",
        message: err.response?.data?.error || "Update failed",
      });
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}?id=${id}`);
      fetchData();
      setNotification({ type: "success", message: "Deleted successfully" });
    } catch (err) {
      console.error("Delete error:", err);
      setNotification({
        type: "error",
        message: err.response?.data?.error || "Delete failed",
      });
    }
  };

  // ================= FORM CHANGE =================
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
      <h1 className="text-2xl font-bold mb-4">GL Upload</h1>

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
        onEdit={handleEdit}
        onDelete={handleDelete}
        onChange={handleChange}
        onUpdate={handleUpdate}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
      />
    </div>
  );
}
