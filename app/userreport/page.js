"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";

const ROLE_STYLES = {
  ADMIN: "bg-purple-100 text-purple-700",
  MANAGER: "bg-blue-100 text-blue-700",
  USER: "bg-emerald-100 text-emerald-700",
};

const getStatusStyle = (isActive) =>
  isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700";

export default function UserReportPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [editUser, setEditUser] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const [deleteUser, setDeleteUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [actionMessage, setActionMessage] = useState("");

  const fetchUsers = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);

    try {
      const response = await axios.get("/api/user");

      const records = Array.isArray(response.data)
        ? response.data
        : response.data?.data;

      if (!Array.isArray(records)) {
        throw new Error("Invalid user API response");
      }

      setUsers(records);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load user report");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return users.filter((user) => {
      const name = String(user.name || "").toLowerCase();
      const email = String(user.email || "").toLowerCase();
      const phone = String(user.phone || "").toLowerCase();
      const role = String(user.role || "USER").toUpperCase();

      const matchesSearch =
        !searchText ||
        name.includes(searchText) ||
        email.includes(searchText) ||
        phone.includes(searchText);

      const matchesRole =
        roleFilter === "ALL" || role === roleFilter.toUpperCase();

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && user.is_active) ||
        (statusFilter === "INACTIVE" && !user.is_active);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.is_active).length;
  const inactiveUsers = totalUsers - activeUsers;

  const adminUsers = users.filter(
    (user) => String(user.role || "").toUpperCase() === "ADMIN",
  ).length;

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const openEditModal = (user) => {
    setEditError("");
    setEditUser({
      id: user.id,
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "USER",
      is_active: Boolean(user.is_active),
    });
  };

  const closeEditModal = () => {
    setEditUser(null);
    setEditError("");
  };

  const handleEditChange = (event) => {
    const { name, value, type, checked } = event.target;

    setEditUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateUser = async (event) => {
    event.preventDefault();
    setEditLoading(true);
    setEditError("");

    try {
      await axios.patch(`/api/user/${editUser.id}`, {
        name: editUser.name,
        phone: editUser.phone,
        role: editUser.role,
        is_active: editUser.is_active,
      });

      setActionMessage("User updated successfully.");
      closeEditModal();
      await fetchUsers(true);
    } catch (err) {
      console.error(err);

      setEditError(
        err.response?.data?.error || "Unable to update user. Please try again.",
      );
    } finally {
      setEditLoading(false);
    }
  };

  const openDeleteModal = (user) => {
    setDeleteError("");
    setDeleteUser(user);
  };

  const closeDeleteModal = () => {
    setDeleteUser(null);
    setDeleteError("");
  };

  const deleteUserRecord = async () => {
    if (!deleteUser) return;

    setDeleteLoading(true);
    setDeleteError("");

    try {
      await axios.delete(`/api/user/${deleteUser.id}`);

      setActionMessage("User deleted successfully.");
      closeDeleteModal();
      await fetchUsers(true);
    } catch (err) {
      console.error(err);

      setDeleteError(
        err.response?.data?.error || "Unable to delete user. Please try again.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-sm font-medium text-slate-600">
            Loading user report...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-2xl">
            ⚠️
          </div>

          <h2 className="text-lg font-semibold text-slate-900">
            User report unavailable
          </h2>

          <p className="mt-2 text-sm text-slate-600">{error}</p>

          <button
            onClick={() => fetchUsers(true)}
            className="mt-5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success message */}
      {actionMessage && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-sm font-medium text-emerald-700">
            {actionMessage}
          </p>

          <button
            onClick={() => setActionMessage("")}
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-900"
          >
            Close
          </button>
        </div>
      )}

      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
            User Management
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            User Report
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View, search, edit, and manage all system users.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchUsers(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
          >
            <span className={refreshing ? "animate-spin" : ""}>⟳</span>
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          <Link
            href="/usercreation"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            + Add User
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total Users
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalUsers}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
              👥
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Active Users
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {activeUsers}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
              ✅
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Inactive Users
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {inactiveUsers}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl">
              🚫
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Admin Users
              </p>

              <p className="mt-2 text-3xl font-bold text-purple-600">
                {adminUsers}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl">
              🛡️
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, or phone"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Role
            </label>

            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="USER">User</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              User List
            </h2>

            <p className="text-xs text-slate-500">
              Showing {filteredUsers.length} of {totalUsers} users
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Latest first
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "User",
                  "Email",
                  "Phone",
                  "Role",
                  "Status",
                  "Created",
                  "Updated",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredUsers.length ? (
                filteredUsers.map((user) => {
                  const role = String(user.role || "USER").toUpperCase();

                  return (
                    <tr key={user.id} className="transition hover:bg-slate-50">
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                            {getInitials(user.name)}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {user.name || "—"}
                            </p>

                            <p className="text-xs text-slate-500">
                              ID: {user.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-700">
                        {user.email || "—"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-700">
                        {user.phone || "—"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            ROLE_STYLES[role] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {role}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            user.is_active,
                          )}`}
                        >
                          {user.is_active ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        {formatDate(user.created_at)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        {formatDate(user.updated_at)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            ✏️ Edit
                          </button>

                          <button
                            onClick={() => openDeleteModal(user)}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No users found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit user modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Edit User
              </h3>

              <button
                onClick={closeEditModal}
                className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={updateUser} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={editUser.name}
                  onChange={handleEditChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email
                </label>

                <input
                  type="email"
                  value={editUser.email}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={editUser.phone}
                  onChange={handleEditChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Role
                </label>

                <select
                  name="role"
                  value={editUser.role}
                  onChange={handleEditChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="USER">User</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={editUser.is_active}
                  onChange={handleEditChange}
                  className="h-4 w-4 rounded border-slate-300"
                />

                <span className="text-sm text-slate-700">Active user</span>
              </label>

              {editError && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {editError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={editLoading}
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {editLoading ? "Updating..." : "Update User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-xl">
                ⚠️
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Delete User
                </h3>

                <p className="text-xs text-slate-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900">
                {deleteUser.name}
              </span>
              ?
            </p>

            {deleteError && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {deleteError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={deleteUserRecord}
                disabled={deleteLoading}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleteLoading ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
