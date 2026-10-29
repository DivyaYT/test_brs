"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function StatusForm() {
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
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH DATA FOR EDIT
  useEffect(() => {
    if (!id) return;

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

    fetchData();
  }, [id]);

  const handleChange = (key, value) => {
    setDet((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validate = () => {
    let newErrors = {};

    if (!det.statusId) newErrors.statusId = "Status ID is required";
    if (!det.statusCode) newErrors.statusCode = "Status Code is required";
    if (!det.statusName.trim())
      newErrors.statusName = "Status Name is required";
    if (!det.purpose.trim()) newErrors.purpose = "Purpose is required";
    if (!det.color.trim()) newErrors.color = "Color is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔥 UPDATE API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await fetch(`/api/status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statusId: Number(det.statusId),
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

      alert("Updated successfully");

      router.push("/status-report"); // go back
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-blue-600 font-semibold">Edit Status ({id})</h1>

        <button
          onClick={handleSubmit}
          className="px-5 py-2 bg-blue-600 text-white rounded-md"
        >
          Update
        </button>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-xl shadow p-6">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            value={det.statusId}
            onChange={(e) => handleChange("statusId", e.target.value)}
            className="border p-2 rounded"
            placeholder="Status ID"
          />

          <input
            type="number"
            value={det.statusCode}
            onChange={(e) => handleChange("statusCode", e.target.value)}
            className="border p-2 rounded"
            placeholder="Status Code"
          />

          <input
            type="text"
            value={det.statusName}
            onChange={(e) => handleChange("statusName", e.target.value)}
            className="border p-2 rounded"
            placeholder="Status Name"
          />

          <input
            type="text"
            value={det.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="border p-2 rounded"
            placeholder="Description"
          />

          <input
            type="text"
            value={det.purpose}
            onChange={(e) => handleChange("purpose", e.target.value)}
            className="border p-2 rounded"
            placeholder="Purpose"
          />

          <input
            type="text"
            value={det.color}
            onChange={(e) => handleChange("color", e.target.value)}
            className="border p-2 rounded"
            placeholder="Color"
          />

          <textarea
            value={det.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            className="border p-2 rounded md:col-span-3"
            placeholder="Notes"
          />
        </form>
      </div>
    </div>
  );
}
