"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

import UploadButton from "../excelhooks/UploadButton";
import Notification from "../excelhooks/Notification";
import DashboardCard from "../excelhooks/DashboardCard";
import PreviewTable from "../excelhooks/PreviewTable";
import { REQUIRED_HEADERS } from "../excelhooks/RequiredHeaders";

export default function GLUploadPage() {
  const TYPE = "GL";

  const headersConfig = REQUIRED_HEADERS(TYPE);

  const requiredHeaders = headersConfig?.headers || [];

  const [data, setData] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [excelPreviewHeaders, setExcelPreviewHeaders] = useState([]);
  const [notification, setNotification] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

  const API_BASE = "/api/gl";

  /* =========================
     FETCH DATA
  ========================= */
  const fetchData = async () => {
    try {
      const res = await axios.get(API_BASE);

      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch error:", err);

      setNotification({
        type: "error",
        message: "Failed to fetch records",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* =========================
     FILE UPLOAD PREVIEW
  ========================= */
  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    try {
      const buffer = await selectedFile.arrayBuffer();

      const workbook = XLSX.read(buffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const json = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
      });

      if (!json.length) {
        alert("No records found in Excel file");
        return;
      }

      const originalHeaders = Object.keys(json[0]);

      const excelHeaders = originalHeaders.map((header) =>
        String(header).trim().toUpperCase(),
      );

      const missing = requiredHeaders.filter(
        (header) => !excelHeaders.includes(header),
      );

      if (missing.length) {
        alert("Missing columns: " + missing.join(", "));
        return;
      }

      setExcelPreviewHeaders(originalHeaders);
      setPreviewData(json);
    } catch (error) {
      console.error("Excel parsing error:", error);
      alert("Unable to read the Excel file.");
    }
  };

  /* =========================
     CANCEL PREVIEW
  ========================= */
  const handleCancel = () => {
    setPreviewData([]);
    setExcelPreviewHeaders([]);
  };

  /* =========================
     UPLOAD ONLY VALID ROWS
  ========================= */
  const uploadToServer = async (validRows) => {
    if (!validRows?.length) return;

    try {
      setUploading(true);

      const res = await axios.patch(
        API_BASE,
        {
          type: TYPE,
          rows: validRows,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const count = Number(res.data?.rowsUploaded ?? 0);

      setUploadedCount(count);

      setNotification({
        type: "success",
        message: `${count} valid rows uploaded successfully`,
      });

      setPreviewData([]);
      setExcelPreviewHeaders([]);

      fetchData();
    } catch (err) {
      console.error("Upload error:", err);

      setNotification({
        type: "error",
        message:
          err.response?.data?.error ||
          err.response?.data?.details ||
          "Upload failed",
      });
    } finally {
      setUploading(false);
    }
  };

  /* =========================
     DOWNLOAD TEMPLATE
  ========================= */
  const downloadTemplate = () => {
    const templateRow = requiredHeaders.reduce(
      (acc, header) => ({
        ...acc,
        [header]: "",
      }),
      {},
    );

    const worksheet = XLSX.utils.json_to_sheet([templateRow]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "GL_Template.xlsx");
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">GL Upload</h1>

      <UploadButton
        onFileChange={handleFileUpload}
        onDownload={downloadTemplate}
      />

      <Notification notification={notification} />

      {/* DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <DashboardCard title="Total Records" value={data.length} />

        <DashboardCard title="Current Upload Rows" value={uploadedCount} />
      </div>

      {/* EXCEL PREVIEW */}
      <PreviewTable
        previewData={previewData}
        headers={excelPreviewHeaders}
        type={TYPE}
        onUpload={uploadToServer}
        onCancel={handleCancel}
        uploading={uploading}
      />
    </div>
  );
}
