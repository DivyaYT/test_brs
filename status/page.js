"use client";
import { useState } from "react";

export default function StatusForm() {
  const [det, setDet] = useState({
    statusId: "",
    statusCode: "",
    statusName: "",
    description: "",
    purpose: "",
    notes: "",
    color: "",
  });

  const [form, setForm] = useState([]);
  const [errors, setErrors] = useState({});

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await fetch("/api/status", {
        method: "POST",
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

      setForm((prev) => [...prev, data]);

      setDet({
        statusId: "",
        statusCode: "",
        statusName: "",
        description: "",
        purpose: "",
        notes: "",
        color: "",
      });

      setErrors({});
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-blue-600 font-semibold mb-4  font-semibold">
            Status Setup
          </h1>
        </div>

        <button
          onClick={handleSubmit}
          className="px-5 py-2 bg-blue-600 text-white rounded-md"
        >
          Save
        </button>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-blue-600 font-semibold mb-4 border-l-4 border-blue-600 pl-2">
          Basic Information
        </h2>

        {/* GRID */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* STATUS ID */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              STATUS ID
            </label>
            <input
              type="number"
              className="w-full border rounded-md p-2"
              value={det.statusId}
              onChange={(e) => handleChange("statusId", e.target.value)}
            />
            <p className="text-red-500 text-xs">{errors.statusId}</p>
          </div>

          {/* STATUS CODE */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              STATUS CODE
            </label>
            <input
              type="number"
              className="w-full border rounded-md p-2"
              value={det.statusCode}
              onChange={(e) => handleChange("statusCode", e.target.value)}
            />
            <p className="text-red-500 text-xs">{errors.statusCode}</p>
          </div>

          {/* STATUS NAME */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              STATUS NAME
            </label>
            <input
              type="text"
              className="w-full border rounded-md p-2"
              value={det.statusName}
              onChange={(e) => handleChange("statusName", e.target.value)}
            />
            <p className="text-red-500 text-xs">{errors.statusName}</p>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              DESCRIPTION
            </label>
            <input
              type="text"
              className="w-full border rounded-md p-2"
              value={det.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* PURPOSE */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">PURPOSE</label>
            <input
              type="text"
              className="w-full border rounded-md p-2"
              value={det.purpose}
              onChange={(e) => handleChange("purpose", e.target.value)}
            />
            <p className="text-red-500 text-xs">{errors.purpose}</p>
          </div>

          {/* COLOR */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">COLOR</label>
            <input
              type="text"
              placeholder="#FF0000"
              className="w-full border rounded-md p-2"
              value={det.color}
              onChange={(e) => handleChange("color", e.target.value)}
            />
            <p className="text-red-500 text-xs">{errors.color}</p>
          </div>

          {/* NOTES (Full Width) */}
          <div className="md:col-span-3">
            <label className="block text-sm text-gray-600 mb-1">NOTES</label>
            <textarea
              className="w-full border rounded-md p-2"
              rows="3"
              value={det.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

// "use client";
// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";

// export default function StatusForm() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [det, setDet] = useState({
//     statusId: "",
//     statusCode: "",
//     statusName: "",
//     description: "",
//     purpose: "",
//     notes: "",
//     color: "",
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (key, value) => {
//     setDet((prev) => ({ ...prev, [key]: value }));
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch(`/api/status/${id}`);
//         const data = await res.json();
//         setDet({
//           statusId: data.status_id,
//           statusCode: data.status_code,
//           statusName: data.status_name,
//           description: data.description,
//           purpose: data.purpose,
//           notes: data.notes,
//           color: data.color,
//         });
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     if (id) fetchData();
//   }, [id]);

//   const validate = () => {
//     let newErrors = {};
//     if (!det.statusCode) newErrors.statusCode = "Status Code is required";
//     if (!det.statusName.trim())
//       newErrors.statusName = "Status Name is required";
//     if (!det.purpose.trim()) newErrors.purpose = "Purpose is required";
//     if (!det.color.trim()) newErrors.color = "Color is required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // ✅ FIX: e is optional — works from both button click & form submit
//   const handleSubmit = async (e) => {
//     if (e) e.preventDefault();

//     if (!validate()) return;

//     try {
//       const res = await fetch(`/api/status/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           statusCode: Number(det.statusCode),
//           statusName: det.statusName,
//           description: det.description,
//           purpose: det.purpose,
//           notes: det.notes,
//           color: det.color,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error);

//       router.push("/status/report");
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-blue-600 font-semibold">Edit Status (ID: {id})</h1>
//         {/* ✅ FIX: calls handleSubmit() without e — now safe */}
//         <button
//           onClick={() => handleSubmit()}
//           className="px-5 py-2 bg-blue-600 text-white rounded-md"
//         >
//           Update
//         </button>
//       </div>

//       {/* CARD */}
//       <div className="bg-white rounded-xl shadow p-6">
//         <h2 className="text-blue-600 font-semibold mb-4 border-l-4 border-blue-600 pl-2">
//           Basic Information
//         </h2>

//         {/* ✅ FIX: Removed duplicate onSubmit — header button handles submit */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* STATUS ID (READONLY) */}
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">
//               STATUS ID
//             </label>
//             <input
//               type="number"
//               disabled
//               className="w-full border rounded-md p-2 bg-gray-100"
//               value={det.statusId}
//             />
//           </div>

//           {/* STATUS CODE */}
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">
//               STATUS CODE
//             </label>
//             <input
//               type="number"
//               className="w-full border rounded-md p-2"
//               value={det.statusCode}
//               onChange={(e) => handleChange("statusCode", e.target.value)}
//             />
//             <p className="text-red-500 text-xs">{errors.statusCode}</p>
//           </div>

//           {/* STATUS NAME */}
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">
//               STATUS NAME
//             </label>
//             <input
//               type="text"
//               className="w-full border rounded-md p-2"
//               value={det.statusName}
//               onChange={(e) => handleChange("statusName", e.target.value)}
//             />
//             <p className="text-red-500 text-xs">{errors.statusName}</p>
//           </div>

//           {/* DESCRIPTION */}
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">
//               DESCRIPTION
//             </label>
//             <input
//               type="text"
//               className="w-full border rounded-md p-2"
//               value={det.description}
//               onChange={(e) => handleChange("description", e.target.value)}
//             />
//           </div>

//           {/* PURPOSE */}
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">PURPOSE</label>
//             <input
//               type="text"
//               className="w-full border rounded-md p-2"
//               value={det.purpose}
//               onChange={(e) => handleChange("purpose", e.target.value)}
//             />
//             <p className="text-red-500 text-xs">{errors.purpose}</p>
//           </div>

//           {/* COLOR */}
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">COLOR</label>
//             <input
//               type="text"
//               className="w-full border rounded-md p-2"
//               value={det.color}
//               onChange={(e) => handleChange("color", e.target.value)}
//             />
//             <p className="text-red-500 text-xs">{errors.color}</p>
//           </div>

//           {/* NOTES */}
//           <div className="md:col-span-3">
//             <label className="block text-sm text-gray-600 mb-1">NOTES</label>
//             <textarea
//               className="w-full border rounded-md p-2"
//               rows="3"
//               value={det.notes}
//               onChange={(e) => handleChange("notes", e.target.value)}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
