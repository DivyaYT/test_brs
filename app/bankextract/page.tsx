// "use client";

// import { useState } from "react";

// export default function Extract() {
//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const uploadFile = async (e: any) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setLoading(true);
//     setError("");
//     setData([]);

//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       const res = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const text = await res.text();

//       let json;
//       try {
//         json = JSON.parse(text);
//       } catch {
//         setError("Server did not return valid JSON");
//         setLoading(false);
//         return;
//       }

//       if (!res.ok) {
//         setError(json?.error || "Upload failed");
//         setLoading(false);
//         return;
//       }

//       setData(Array.isArray(json.data) ? json.data : []);
//     } catch (err: any) {
//       setError(err.message || "Unexpected error");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       {/* HEADER */}
//       <div className="bg-white p-4 rounded shadow mb-4">
//         <h1 className="text-2xl font-bold text-blue-600">
//           🤖 AI Bank Reconciliation System
//         </h1>
//         <p className="text-gray-500">
//           Excel → AI Transfer Name + Type + Confidence
//         </p>
//       </div>

//       {/* UPLOAD */}
//       <div className="bg-white p-4 rounded shadow mb-4">
//         <input
//           type="file"
//           accept=".xlsx,.xls"
//           onChange={uploadFile}
//           className="border p-2"
//         />

//         {loading && <p className="text-blue-500 mt-2">Processing AI...</p>}

//         {error && <p className="text-red-500 mt-2">{error}</p>}
//       </div>

//       {/* TABLE */}
//       <div className="bg-white p-4 rounded shadow">
//         <table className="w-full border">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="p-2 border">Raw</th>
//               <th className="p-2 border">Transfer Name</th>
//               <th className="p-2 border">Type</th>
//               <th className="p-2 border">Confidence</th>
//             </tr>
//           </thead>

//           <tbody>
//             {data.length > 0 ? (
//               data.map((row, i) => (
//                 <tr key={i} className="border">
//                   <td className="p-2 border text-xs">{row.raw}</td>

//                   <td className="p-2 border font-bold text-green-600">
//                     {row.transfer_name}
//                   </td>

//                   <td className="p-2 border">
//                     <span
//                       className={
//                         row.transaction_type === "debit"
//                           ? "text-red-600"
//                           : "text-green-600"
//                       }
//                     >
//                       {row.transaction_type}
//                     </span>
//                   </td>

//                   <td className="p-2 border">
//                     <span
//                       className={
//                         row.confidence > 80
//                           ? "text-green-600"
//                           : row.confidence > 50
//                             ? "text-yellow-600"
//                             : "text-red-600"
//                       }
//                     >
//                       {row.confidence}%
//                     </span>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={4} className="text-center p-4">
//                   No data uploaded
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";

export default function Extract() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const uploadFile = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setData([]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();

      let json;
      try {
        json = JSON.parse(text);
      } catch {
        setError("Server did not return valid JSON");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(json?.error || "Upload failed");
        setLoading(false);
        return;
      }

      setData(Array.isArray(json.data) ? json.data : []);
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    }

    setLoading(false);
  };

  // 🎨 Row highlight based on confidence
  const getRowStyle = (confidence: number) => {
    if (confidence < 50) return "bg-red-50";
    if (confidence < 80) return "bg-yellow-50";
    return "";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h1 className="text-2xl font-bold text-blue-600">
          🤖 AI Bank Reconciliation System
        </h1>
        <p className="text-gray-500">
          Excel → AI Name + Type + Mode + Reference + Confidence
        </p>
      </div>

      {/* UPLOAD */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={uploadFile}
          className="border p-2"
        />

        {loading && (
          <p className="text-blue-500 mt-2 animate-pulse">
            🚀 Processing AI...
          </p>
        )}

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* TABLE */}
      <div className="bg-white p-4 rounded shadow overflow-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border">Raw</th>
              <th className="p-2 border">Transfer Name</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Mode</th>
              <th className="p-2 border">Reference No</th>
              <th className="p-2 border">Confidence</th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((row, i) => (
                <tr key={i} className={`border ${getRowStyle(row.confidence)}`}>
                  {/* RAW */}
                  <td className="p-2 border text-xs max-w-xs break-all">
                    {row.raw}
                  </td>

                  {/* NAME */}
                  <td className="p-2 border font-bold text-green-700">
                    {row.transfer_name}
                  </td>

                  {/* DEBIT / CREDIT */}
                  <td className="p-2 border">
                    <span
                      className={
                        row.transaction_type === "debit"
                          ? "text-red-600 font-semibold"
                          : "text-green-600 font-semibold"
                      }
                    >
                      {row.transaction_type}
                    </span>
                  </td>

                  {/* MODE */}
                  <td className="p-2 border">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {row.transaction_mode}
                    </span>
                  </td>

                  {/* REFERENCE */}
                  <td className="p-2 border text-xs font-mono">
                    {row.reference_no}
                  </td>

                  {/* CONFIDENCE */}
                  <td className="p-2 border">
                    <span
                      className={
                        row.confidence > 80
                          ? "text-green-600 font-bold"
                          : row.confidence > 50
                            ? "text-yellow-600 font-bold"
                            : "text-red-600 font-bold"
                      }
                    >
                      {row.confidence}%
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500">
                  No data uploaded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
