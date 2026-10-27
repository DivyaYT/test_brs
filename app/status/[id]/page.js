"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function StatusEdit() {
  const { id } = useParams();
  const router = useRouter();

  const [det, setDet] = useState({
    statusId: "",
    statusCode: "",
    statusName: "",
    description: "",
    purpose: "",
    notes: "",
    color: "",
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/status/${id}`);
        const data = await res.json();
        setDet({
          statusId: data.status_id,
          statusCode: data.status_code,
          statusName: data.status_name,
          description: data.description || "",
          purpose: data.purpose || "",
          notes: data.notes || "",
          color: data.color || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleChange = (key, value) => {
    setDet((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    let newErrors = {};
    if (!det.statusCode) newErrors.statusCode = "Status Code is required";
    if (!det.statusName.trim())
      newErrors.statusName = "Status Name is required";
    if (!det.purpose.trim()) newErrors.purpose = "Purpose is required";
    if (!det.color.trim()) newErrors.color = "Color is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statusCode: Number(det.statusCode),
          statusName: det.statusName,
          description: det.description,
          purpose: det.purpose,
          notes: det.notes,
          color: det.color,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push("/status/report");
    } catch (err) {
      console.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-blue-600 font-semibold text-lg">
          Edit Status — ID: {id}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/status/report")}
            className="px-4 py-2 border border-gray-400 text-gray-600 rounded-md text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 bg-blue-600 text-white rounded-md text-sm disabled:opacity-60"
          >
            {saving ? "Updating..." : "Update"}
          </button>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-blue-600 font-semibold mb-4 border-l-4 border-blue-600 pl-2">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* STATUS ID (READONLY) */}
          <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase">
              Status ID
            </label>
            <input
              type="number"
              disabled
              className="w-full border rounded-md p-2 bg-gray-100 text-sm"
              value={det.statusId}
            />
          </div>

          {/* STATUS CODE */}
          <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase">
              Status Code
            </label>
            <input
              type="number"
              className="w-full border rounded-md p-2 text-sm focus:outline-blue-400"
              value={det.statusCode}
              onChange={(e) => handleChange("statusCode", e.target.value)}
            />
            <p className="text-red-500 text-xs mt-1">{errors.statusCode}</p>
          </div>

          {/* STATUS NAME */}
          <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase">
              Status Name
            </label>
            <input
              type="text"
              className="w-full border rounded-md p-2 text-sm focus:outline-blue-400"
              value={det.statusName}
              onChange={(e) => handleChange("statusName", e.target.value)}
            />
            <p className="text-red-500 text-xs mt-1">{errors.statusName}</p>
          </div>

          {/* PURPOSE */}
          <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase">
              Purpose
            </label>
            <input
              type="text"
              className="w-full border rounded-md p-2 text-sm focus:outline-blue-400"
              value={det.purpose}
              onChange={(e) => handleChange("purpose", e.target.value)}
            />
            <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>
          </div>

          {/* COLOR */}
          <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase">
              Color
            </label>
            <input
              type="text"
              className="w-full border rounded-md p-2 text-sm focus:outline-blue-400"
              value={det.color}
              onChange={(e) => handleChange("color", e.target.value)}
            />
            <p className="text-red-500 text-xs mt-1">{errors.color}</p>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase">
              Description
            </label>
            <input
              type="text"
              className="w-full border rounded-md p-2 text-sm focus:outline-blue-400"
              value={det.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* NOTES */}
          <div className="md:col-span-3">
            <label className="block text-xs text-gray-500 mb-1 uppercase">
              Notes
            </label>
            <textarea
              className="w-full border rounded-md p-2 text-sm focus:outline-blue-400"
              rows="3"
              value={det.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
