

"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import Notification from "../excelhooks/Notification";
import DashboardCard from "../excelhooks/DashboardCard";
import MainTable from "../excelhooks/MainTable";
import Pagination from "../excelhooks/Pagination";
import { REQUIRED_HEADERS } from "../excelhooks/RequiredHeaders";

const ROWS_PER_PAGE = 50;

const getRowId = (row) => {
  const id = row?.GL_ID ?? row?.gl_id ?? row?.id ?? row?.ID;

  return id === undefined || id === null ? "" : String(id);
};

export default function GLRecords() {
  const TYPE = "GL";

  const headersConfig = REQUIRED_HEADERS(TYPE);

  // FIX: MainTable needs an array, not the full config object
  const tableHeaders = headersConfig?.headers || [];

  const [data, setData] = useState([]);
  const [notification, setNotification] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [originalRow, setOriginalRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  /* =========================
     FETCH DATA
  ========================= */
  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get("/api/gl");

      const rows = Array.isArray(res.data) ? res.data : [];

      setData(rows);

      setSelectedIds((prev) =>
        prev.filter((id) => rows.some((row) => getRowId(row) === id)),
      );

      setCurrentPage((prev) =>
        Math.min(prev, Math.max(1, Math.ceil(rows.length / ROWS_PER_PAGE))),
      );
    } catch (err) {
      console.error("Fetch Error:", err);

      setNotification({
        type: "error",
        message: "Failed to fetch records",
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* =========================
     PAGINATION
  ========================= */
  const totalPages = Math.max(1, Math.ceil(data.length / ROWS_PER_PAGE));

  const currentData = data.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE,
  );

  /* =========================
     SELECTION
  ========================= */
  const allIds = data.map(getRowId).filter(Boolean);

  const allSelected = allIds.length > 0 && selectedIds.length === allIds.length;

  const handleSelectRow = (id, checked) => {
    const recordId = String(id);

    if (!recordId || recordId === "undefined") return;

    setSelectedIds((prev) => {
      if (checked) {
        return [...new Set([...prev, recordId])];
      }

      return prev.filter((item) => item !== recordId);
    });
  };

  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? allIds : []);
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  /* =========================
     EDIT / UPDATE
  ========================= */
  const handleEdit = (row) => {
    const rowId = getRowId(row);

    setEditingId(rowId);
    setForm({ ...row });
    setOriginalRow({ ...row });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (id) => {
    try {
      const changedFields = {};

      Object.keys(form).forEach((key) => {
        if (
          key === "id" ||
          key === "GL_ID" ||
          key === "gl_id" ||
          key === "ID"
        ) {
          return;
        }

        const newValue = form[key];
        const oldValue = originalRow?.[key];

        if (newValue !== oldValue) {
          changedFields[key] = newValue;
        }
      });

      if (Object.keys(changedFields).length === 0) {
        setNotification({
          type: "info",
          message: "No changes to update",
        });

        setEditingId(null);
        setForm({});
        setOriginalRow(null);

        return;
      }

      await axios.put("/api/gl", {
        ...changedFields,
        id,
      });

      setEditingId(null);
      setForm({});
      setOriginalRow(null);

      setNotification({
        type: "success",
        message: "Updated successfully",
      });

      await fetchData();
    } catch (err) {
      console.error("Update Error:", err);

      setNotification({
        type: "error",
        message:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Update failed",
      });
    }
  };

  /* =========================
     DELETE
  ========================= */
  const handleDelete = async (id) => {
    if (deletingId !== null) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this record?",
    );

    if (!confirmed) return;

    const recordId = String(id);

    try {
      setDeletingId(recordId);

      await axios.delete("/api/gl", {
        data: {
          id: recordId,
        },
      });

      setSelectedIds((prev) => prev.filter((item) => item !== recordId));

      setNotification({
        type: "success",
        message: "Deleted successfully",
      });

      await fetchData();
    } catch (err) {
      console.error("Delete Error:", err);

      setNotification({
        type: "error",
        message:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Delete failed",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0 || deletingId !== null) {
      return;
    }

    const idsToDelete = [...selectedIds];

    const confirmed = window.confirm(
      `Are you sure you want to delete ${idsToDelete.length} selected records?`,
    );

    if (!confirmed) return;

    try {
      setDeletingId("bulk");

      await axios.delete("/api/gl", {
        data: {
          ids: idsToDelete,
        },
      });

      setSelectedIds([]);
      setEditingId(null);
      setForm({});
      setOriginalRow(null);

      setNotification({
        type: "success",
        message: `${idsToDelete.length} records deleted successfully`,
      });

      await fetchData();
    } catch (err) {
      console.error("Bulk Delete Error:", err);

      setNotification({
        type: "error",
        message:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Bulk delete failed",
      });
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">GL Records</h1>

      <Notification notification={notification} />

      {/* DASHBOARD */}
      <DashboardCard title="Total Records" value={data.length} />

      {/* SELECTION INFORMATION */}
      <div className="flex justify-between items-center mt-6 mb-3">
        <p className="text-sm text-gray-600">
          Selected Records:{" "}
          <span className="font-bold text-blue-600">{selectedIds.length}</span>
          {" / "}
          {data.length}
        </p>

        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={handleClearSelection}
            disabled={deletingId !== null}
            className="text-sm text-red-600 hover:underline disabled:opacity-50"
          >
            Clear Selection
          </button>
        )}
      </div>

      {/* BULK DELETE */}
      {selectedIds.length > 0 && (
        <div className="flex justify-end mb-3">
          <button
            type="button"
            onClick={handleBulkDelete}
            disabled={deletingId !== null}
            className="bg-red-600 hover:bg-red-700 text-white
                       px-5 py-2 rounded-lg font-semibold shadow
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deletingId === "bulk"
              ? "Deleting..."
              : `Delete Selected (${selectedIds.length})`}
          </button>
        </div>
      )}

      {/* MAIN TABLE */}
      <MainTable
        data={currentData}
        headers={tableHeaders}
        editingId={editingId}
        form={form}
        deletingId={deletingId}
        selectedIds={selectedIds}
        allSelected={allSelected}
        onSelectRow={handleSelectRow}
        onSelectAll={handleSelectAll}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onChange={handleChange}
        onUpdate={handleUpdate}
      />

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
      />
    </div>
  );
}
