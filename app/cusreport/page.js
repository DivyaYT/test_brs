// "use client";

// import { Download, Eye } from "lucide-react";

// const data = [
//   {
//     id: "#012",
//     name: "Invoice #012 – May 2024",
//     date: "May 01, 2024",
//     price: "$120.00",
//     plan: "Starter Plan",
//     status: "Paid",
//   },
//   {
//     id: "#013",
//     name: "Invoice #013 – June 2024",
//     date: "June 01, 2024",
//     price: "$120.00",
//     plan: "Starter Plan",
//     status: "Paid",
//   },
//   {
//     id: "#014",
//     name: "Invoice #014 – July 2024",
//     date: "July 01, 2024",
//     price: "$120.00",
//     plan: "Starter Plan",
//     status: "Unpaid",
//   },
//   {
//     id: "#015",
//     name: "Invoice #015 – August 2024",
//     date: "August 01, 2024",
//     price: "$250.00",
//     plan: "Pro Plan",
//     status: "Paid",
//   },
//   {
//     id: "#016",
//     name: "Invoice #016 – September 2024",
//     date: "September 01, 2024",
//     price: "$250.00",
//     plan: "Pro Plan",
//     status: "Paid",
//   },
// ];

// export default function InvoiceReport() {
//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="bg-white rounded-xl shadow p-6">
//         {/* HEADER */}
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h2 className="text-xl font-semibold">Invoices</h2>
//             <p className="text-gray-500 text-sm">
//               Access all your previous invoices.
//             </p>
//           </div>

//           <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100">
//             <Download size={16} />
//             Download All
//           </button>
//         </div>

//         {/* TABLE */}
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="text-gray-500 border-b">
//               <tr>
//                 <th className="text-left py-3">Name</th>
//                 <th className="text-left">Date</th>
//                 <th className="text-left">Price</th>
//                 <th className="text-left">Plan</th>
//                 <th className="text-left">Status</th>
//                 <th className="text-right">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {data.map((item, index) => (
//                 <tr key={index} className="border-b hover:bg-gray-50">
//                   {/* NAME */}
//                   <td className="py-4 flex items-center gap-3">
//                     <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
//                       PDF
//                     </span>
//                     {item.name}
//                   </td>

//                   {/* DATE */}
//                   <td>{item.date}</td>

//                   {/* PRICE */}
//                   <td>{item.price}</td>

//                   {/* PLAN */}
//                   <td>{item.plan}</td>

//                   {/* STATUS */}
//                   <td>
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-medium ${
//                         item.status === "Paid"
//                           ? "bg-green-100 text-green-600"
//                           : "bg-red-100 text-red-600"
//                       }`}
//                     >
//                       {item.status}
//                     </span>
//                   </td>

//                   {/* ACTION */}
//                   <td className="text-right">
//                     <div className="flex justify-end gap-2">
//                       <button className="p-2 border rounded hover:bg-gray-100">
//                         <Download size={16} />
//                       </button>
//                       <button className="p-2 border rounded hover:bg-gray-100">
//                         <Eye size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* PAGINATION */}
//         <div className="flex justify-between items-center mt-6">
//           <button className="px-4 py-2 border rounded-lg text-gray-500">
//             ← Previous
//           </button>

//           <div className="flex gap-2">
//             <button className="w-10 h-10 bg-indigo-600 text-white rounded-lg">
//               1
//             </button>
//             <button className="w-10 h-10 border rounded-lg">2</button>
//             <button className="w-10 h-10 border rounded-lg">3</button>
//           </div>

//           <button className="px-4 py-2 border rounded-lg">Next →</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { Download, Eye, Pencil, Plus } from "lucide-react";
// import { useRouter } from "next/navigation";

// const data = [
//   {
//     id: "#012",
//     name: "Invoice #012 – May 2024",
//     date: "May 01, 2024",
//     price: "$120.00",
//     plan: "Starter Plan",
//     status: "Paid",
//   },
//   {
//     id: "#013",
//     name: "Invoice #013 – June 2024",
//     date: "June 01, 2024",
//     price: "$120.00",
//     plan: "Starter Plan",
//     status: "Paid",
//   },
//   {
//     id: "#014",
//     name: "Invoice #014 – July 2024",
//     date: "July 01, 2024",
//     price: "$120.00",
//     plan: "Starter Plan",
//     status: "Unpaid",
//   },
//   {
//     id: "#015",
//     name: "Invoice #015 – August 2024",
//     date: "August 01, 2024",
//     price: "$250.00",
//     plan: "Pro Plan",
//     status: "Paid",
//   },
// ];

// export default function InvoiceReport() {
//   const router = useRouter();

//   // 🔥 CREATE NAVIGATION
//   const handleCreate = () => {
//     router.push("/invoice/create");
//   };

//   // 🔥 EDIT NAVIGATION
//   const handleEdit = (id) => {
//     router.push(`/invoice/edit/${id}`);
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="bg-white rounded-xl shadow p-6">
//         {/* HEADER */}
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h2 className="text-xl font-semibold">Invoices</h2>
//             <p className="text-gray-500 text-sm">
//               Access all your previous invoices.
//             </p>
//           </div>

//           {/* 🔥 ACTION BUTTONS */}
//           <div className="flex gap-3">
//             <button
//               onClick={handleCreate}
//               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//             >
//               <Plus size={16} />
//               Create
//             </button>

//             <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100">
//               <Download size={16} />
//               Download All
//             </button>
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="text-gray-500 border-b">
//               <tr>
//                 <th className="text-left py-3">Name</th>
//                 <th className="text-left">Date</th>
//                 <th className="text-left">Price</th>
//                 <th className="text-left">Plan</th>
//                 <th className="text-left">Status</th>
//                 <th className="text-right">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {data.map((item, index) => (
//                 <tr key={index} className="border-b hover:bg-gray-50">
//                   {/* NAME */}
//                   <td className="py-4 flex items-center gap-3">
//                     <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
//                       PDF
//                     </span>
//                     {item.name}
//                   </td>

//                   {/* DATE */}
//                   <td>{item.date}</td>

//                   {/* PRICE */}
//                   <td>{item.price}</td>

//                   {/* PLAN */}
//                   <td>{item.plan}</td>

//                   {/* STATUS */}
//                   <td>
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-medium ${
//                         item.status === "Paid"
//                           ? "bg-green-100 text-green-600"
//                           : "bg-red-100 text-red-600"
//                       }`}
//                     >
//                       {item.status}
//                     </span>
//                   </td>

//                   {/* ACTION BUTTONS */}
//                   <td className="text-right">
//                     <div className="flex justify-end gap-2">
//                       {/* DOWNLOAD */}
//                       <button className="p-2 border rounded hover:bg-gray-100">
//                         <Download size={16} />
//                       </button>

//                       {/* VIEW */}
//                       <button className="p-2 border rounded hover:bg-gray-100">
//                         <Eye size={16} />
//                       </button>

//                       {/* 🔥 EDIT */}
//                       <button
//                         onClick={() => handleEdit(item.id)}
//                         className="p-2 border rounded hover:bg-gray-100"
//                       >
//                         <Pencil size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* PAGINATION */}
//         <div className="flex justify-between items-center mt-6">
//           <button className="px-4 py-2 border rounded-lg text-gray-500">
//             ← Previous
//           </button>

//           <div className="flex gap-2">
//             <button className="w-10 h-10 bg-indigo-600 text-white rounded-lg">
//               1
//             </button>
//             <button className="w-10 h-10 border rounded-lg">2</button>
//             <button className="w-10 h-10 border rounded-lg">3</button>
//           </div>

//           <button className="px-4 py-2 border rounded-lg">Next →</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { Download, Eye, Pencil, Plus, Upload, Search } from "lucide-react";
// import { useRouter } from "next/navigation";

// const initialData = [
//   {
//     id: "012",
//     name: "Invoice #012 – May 2024",
//     date: "May 01, 2024",
//     price: "$120.00",
//     plan: "Starter Plan",
//     status: "Paid",
//   },
//   {
//     id: "013",
//     name: "Invoice #013 – June 2024",
//     date: "June 01, 2024",
//     price: "$120.00",
//     plan: "Starter Plan",
//     status: "Paid",
//   },
//   {
//     id: "014",
//     name: "Invoice #014 – July 2024",
//     date: "July 01, 2024",
//     price: "$120.00",
//     plan: "Starter Plan",
//     status: "Unpaid",
//   },
//   {
//     id: "015",
//     name: "Invoice #015 – August 2024",
//     date: "August 01, 2024",
//     price: "$250.00",
//     plan: "Pro Plan",
//     status: "Paid",
//   },
// ];

// export default function InvoiceReport() {
//   const router = useRouter();
//   const [search, setSearch] = useState("");

//   // 🔍 FILTER DATA
//   const filteredData = initialData.filter((item) =>
//     item.name.toLowerCase().includes(search.toLowerCase()),
//   );

//   // 🚀 NAVIGATION
//   const handleCreate = () => router.push("/invoice/create");
//   const handleEdit = (id) => router.push(`/invoice/edit/${id}`);

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="bg-white rounded-xl shadow p-6">
//         {/* HEADER */}
//         <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
//           {/* TITLE */}
//           <div>
//             <h2 className="text-xl font-semibold">Invoices</h2>
//             <p className="text-gray-500 text-sm">
//               Access all your previous invoices.
//             </p>
//           </div>

//           {/* ACTIONS */}
//           <div className="flex flex-wrap gap-3">
//             {/* SEARCH */}
//             <div className="flex items-center border rounded-lg px-3">
//               <Search size={16} className="text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search invoice..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="p-2 outline-none"
//               />
//             </div>

//             {/* CREATE */}
//             <button
//               onClick={handleCreate}
//               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//             >
//               <Plus size={16} />
//               Create
//             </button>

//             {/* UPLOAD */}
//             <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100">
//               <Upload size={16} />
//               Upload
//             </button>

//             {/* DOWNLOAD ALL */}
//             <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100">
//               <Download size={16} />
//               Download All
//             </button>
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="text-gray-500 border-b">
//               <tr>
//                 <th className="text-left py-3">Name</th>
//                 <th className="text-left">Date</th>
//                 <th className="text-left">Price</th>
//                 <th className="text-left">Plan</th>
//                 <th className="text-left">Status</th>
//                 <th className="text-right">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredData.map((item) => (
//                 <tr key={item.id} className="border-b hover:bg-gray-50">
//                   {/* NAME */}
//                   <td className="py-4 flex items-center gap-3">
//                     <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
//                       PDF
//                     </span>
//                     {item.name}
//                   </td>

//                   {/* DATE */}
//                   <td>{item.date}</td>

//                   {/* PRICE */}
//                   <td>{item.price}</td>

//                   {/* PLAN */}
//                   <td>{item.plan}</td>

//                   {/* STATUS */}
//                   <td>
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-medium ${
//                         item.status === "Paid"
//                           ? "bg-green-100 text-green-600"
//                           : "bg-red-100 text-red-600"
//                       }`}
//                     >
//                       {item.status}
//                     </span>
//                   </td>

//                   {/* ACTION */}
//                   <td className="text-right">
//                     <div className="flex justify-end gap-2">
//                       {/* DOWNLOAD */}
//                       <button className="p-2 border rounded hover:bg-gray-100">
//                         <Download size={16} />
//                       </button>

//                       {/* VIEW */}
//                       <button className="p-2 border rounded hover:bg-gray-100">
//                         <Eye size={16} />
//                       </button>

//                       {/* EDIT */}
//                       <button
//                         onClick={() => handleEdit(item.id)}
//                         className="p-2 border rounded hover:bg-gray-100"
//                       >
//                         <Pencil size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* PAGINATION */}
//         <div className="flex justify-between items-center mt-6">
//           <button className="px-4 py-2 border rounded-lg text-gray-500">
//             ← Previous
//           </button>

//           <div className="flex gap-2">
//             <button className="w-10 h-10 bg-indigo-600 text-white rounded-lg">
//               1
//             </button>
//             <button className="w-10 h-10 border rounded-lg">2</button>
//             <button className="w-10 h-10 border rounded-lg">3</button>
//           </div>

//           <button className="px-4 py-2 border rounded-lg">Next →</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// import TableContainer from "../component/report/TableContainer";
// import TableHeader from "../component/report/TableHeader";
// import TableSearch from "../component/report/TableSearch";
// import TableActions from "../component/report/TableActions";
// import Table from "../component/report/Table";

// export default function Page() {
//   const router = useRouter();
//   const [search, setSearch] = useState("");

//   const data = [
//     {
//       id: "012",
//       name: "Invoice #012 – May 2024",
//       date: "May 01, 2024",
//       price: "$120.00",
//       plan: "Starter Plan",
//       status: "Paid",
//     },
//     {
//       id: "014",
//       name: "Invoice #014 – July 2024",
//       date: "July 01, 2024",
//       price: "$120.00",
//       plan: "Starter Plan",
//       status: "Unpaid",
//     },
//   ];

//   // 🔥 FILTER
//   const filtered = data.filter((d) =>
//     d.name.toLowerCase().includes(search.toLowerCase()),
//   );

//   // 🔥 DYNAMIC COLUMNS
//   const columns = [
//     { key: "name", label: "Name" },
//     { key: "date", label: "Date" },
//     { key: "price", label: "Price" },
//     { key: "plan", label: "Plan" },
//     {
//       key: "status",
//       label: "Status",
//       render: (value) => (
//         <span
//           className={`px-3 py-1 rounded-full text-xs ${
//             value === "Paid"
//               ? "bg-green-100 text-green-600"
//               : "bg-red-100 text-red-600"
//           }`}
//         >
//           {value}
//         </span>
//       ),
//     },
//   ];

//   return (
//     <TableContainer>
//       <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
//         <TableHeader
//           title="Invoices"
//           subtitle="Access all your previous invoices"
//         />

//         <div className="flex gap-3 flex-wrap">
//           <TableSearch value={search} onChange={setSearch} />

//           <TableActions
//             onCreate={() => router.push("/customer")}
//             onUpload={() => alert("Upload")}
//             onDownload={() => alert("Download")}
//           />
//         </div>
//       </div>

//       <Table
//         columns={columns}
//         data={filtered}
//         onEdit={(id) => router.push(`/edit/${id}`)}
//       />
//     </TableContainer>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// import TableContainer from "../component/report/TableContainer";
// import TableHeader from "../component/report/TableHeader";
// import TableSearch from "../component/report/TableSearch";
// import TableActions from "../component/report/TableActions";
// import Table from "../component/report/Table";

// export default function Page() {
//   const router = useRouter();
//   const [search, setSearch] = useState("");
//   const [data, setData] = useState([]);

//   // 🔥 FETCH DATA
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch("/api/org");
//         const json = await res.json();
//         setData(json);
//         console.log("res", res);
//       } catch (err) {
//         console.error("Fetch error:", err);
//       }
//     };

//     console.log("data", data);
//     fetchData();
//   }, []);

//   // 🔥 FILTER
//   const filtered = data.filter((d) =>
//     d.name?.toLowerCase().includes(search.toLowerCase()),
//   );

//   const columns = [
//     { key: "org_id", label: "org_id" },
//     { key: "org_code", label: "org_code" },
//     { key: "org_name", label: "org_name" },
//     { key: "created_by", label: "created_by" },
//     {
//       key: "status",
//       label: "Status",
//       render: (value) => (
//         <span
//           className={`px-3 py-1 rounded-full text-xs ${
//             value === "Paid"
//               ? "bg-green-100 text-green-600"
//               : "bg-red-100 text-red-600"
//           }`}
//         >
//           {value}
//         </span>
//       ),
//     },
//   ];
//   console.log("data", data);
//   return (
//     <TableContainer>
//       <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
//         <TableHeader
//           title="Invoices"
//           subtitle="Access all your previous invoices"
//         />

//         <div className="flex gap-3 flex-wrap">
//           <TableSearch value={search} onChange={setSearch} />

//           <TableActions
//             onCreate={() => router.push("/customer")}
//             onUpload={() => alert("Upload")}
//             onDownload={() => alert("Download")}
//           />
//         </div>
//       </div>

//       <Table
//         columns={columns}
//         data={filtered}
//         onEdit={(id) => router.push(`/edit/${id}`)}
//       />
//     </TableContainer>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// import TableContainer from "../component/report/TableContainer";
// import TableHeader from "../component/report/TableHeader";
// import TableSearch from "../component/report/TableSearch";
// import TableActions from "../component/report/TableActions";
// import Table from "../component/report/Table";

// export default function Page() {
//   const router = useRouter();
//   const [search, setSearch] = useState("");
//   const [data, setData] = useState([]);

//   // 🔥 FETCH DATA
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch("/api/org");
//         const json = await res.json();

//         console.log("API RESPONSE:", json);
//         setData(json);
//       } catch (err) {
//         console.error("Fetch error:", err);
//       }
//     };

//     fetchData();
//   }, []);

//   // 🔥 FIXED FILTER (IMPORTANT)
//   const filtered = data.filter((d) =>
//     d.org_name?.toLowerCase().includes(search.toLowerCase()),
//   );

//   const columns = [
//     { key: "org_id", label: "Org ID" },
//     { key: "org_code", label: "Org Code" },
//     { key: "org_name", label: "Org Name" },
//     { key: "created_by", label: "Created By" },

//     {
//       key: "status",
//       label: "Status",
//       render: (value) => (
//         <span
//           className={`px-3 py-1 rounded-full text-xs ${
//             value === 1
//               ? "bg-green-100 text-green-600"
//               : "bg-red-100 text-red-600"
//           }`}
//         >
//           {value === 1 ? "Active" : "Inactive"}
//         </span>
//       ),
//     },
//   ];

//   return (
//     <TableContainer>
//       <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
//         <TableHeader title="Organization" subtitle="Manage all organizations" />

//         <div className="flex gap-3 flex-wrap">
//           <TableSearch value={search} onChange={setSearch} />

//           <TableActions
//             onCreate={() => router.push("/organization")}
//             onUpload={() => alert("Upload")}
//             onDownload={() => alert("Download")}
//           />
//         </div>
//       </div>

//       <Table
//         columns={columns}
//         data={filtered}
//         onEdit={(id) => router.push(`/edit/${id}`)}
//       />
//     </TableContainer>
//   );
// }

"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import TableContainer from "../component/report/TableContainer";
import TableHeader from "../component/report/TableHeader";
import TableSearch from "../component/report/TableSearch";
import TableActions from "../component/report/TableActions";
import Table from "../component/report/Table";

// 🔥 IMPORT SPLIT FILES
import { TableColumns } from "../component/report/TableColumns";
export default function Page() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/org");
        const json = await res.json();
        setData(json);
        console.log("err", data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // ================= FILTER =================
  const filtered = useMemo(() => {
    return data.filter((d) =>
      d.org_name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  return (
    <TableContainer>
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <TableHeader title="Organization" subtitle="Manage all organizations" />

        <div className="flex gap-3 flex-wrap">
          <TableSearch value={search} onChange={setSearch} />

          <TableActions
            onCreate={() => router.push("/customer")}
            onUpload={() => alert("Upload")}
            onDownload={() => alert("Download")}
          />
        </div>
      </div>

      {/* 🔥 ONLY COLUMN CONFIG PASSED */}
      <Table
        columns={TableColumns}
        data={filtered}
        onEdit={(id) => router.push(`/edit/${id}`)}
      />
    </TableContainer>
  );
}
