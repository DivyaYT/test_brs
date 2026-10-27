"use client";
import { useState } from "react";

export default function OrganizationForm() {
  const [form, setForm] = useState({
    orgCode: "",
    orgName: "",
    shortName: "",
    effectiveFrom: "",
    effectiveTo: "",
    industry: "",
    currency: "INR",
    status: "Active",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-semibold">Organization Setup</h1>
          <p className="text-sm text-gray-500">
            Fill in all required details below
          </p>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-md bg-gray-200">
            Back
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Save
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-blue-600 font-semibold mb-4 border-l-4 border-blue-600 pl-2">
          Basic Information
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* ORG CODE */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              ORGANIZATION CODE
            </label>
            <input
              className="w-full border rounded-md p-2 bg-gray-100"
              value={form.orgCode}
              onChange={(e) => handleChange("orgCode", e.target.value)}
            />
          </div>

          {/* ORG NAME */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              ORGANIZATION NAME
            </label>
            <input
              className="w-full border rounded-md p-2 bg-gray-100"
              value={form.orgName}
              onChange={(e) => handleChange("orgName", e.target.value)}
            />
          </div>

          {/* SHORT NAME */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              SHORT NAME
            </label>
            <input
              className="w-full border rounded-md p-2"
              placeholder="Enter short name"
              value={form.shortName}
              onChange={(e) => handleChange("shortName", e.target.value)}
            />
          </div>

          {/* EFFECTIVE FROM */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              EFFECTIVE FROM
            </label>
            <input
              type="date"
              className="w-full border rounded-md p-2"
              value={form.effectiveFrom}
              onChange={(e) => handleChange("effectiveFrom", e.target.value)}
            />
          </div>

          {/* EFFECTIVE TO */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              EFFECTIVE TO
            </label>
            <input
              type="date"
              className="w-full border rounded-md p-2"
              value={form.effectiveTo}
              onChange={(e) => handleChange("effectiveTo", e.target.value)}
            />
          </div>

          {/* INDUSTRY */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">INDUSTRY</label>
            <input
              className="w-full border rounded-md p-2"
              placeholder="Enter industry"
              value={form.industry}
              onChange={(e) => handleChange("industry", e.target.value)}
            />
          </div>

          {/* CURRENCY */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">CURRENCY</label>
            <select
              className="w-full border rounded-md p-2"
              value={form.currency}
              onChange={(e) => handleChange("currency", e.target.value)}
            >
              <option>INR</option>
              <option>USD</option>
            </select>
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">STATUS</label>
            <select
              className="w-full border rounded-md p-2"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";
// import { useState } from "react";

// const fields = [
//   { label: "Organization Code", name: "orgCode", type: "text", icon: "🏷️" },
//   { label: "Organization Name", name: "orgName", type: "text", icon: "🏢" },
//   { label: "Short Name", name: "shortName", type: "text", icon: "✏️" },
//   { label: "Effective From", name: "effectiveFrom", type: "date", icon: "📅" },
//   { label: "Effective To", name: "effectiveTo", type: "date", icon: "📅" },
//   { label: "Industry", name: "industry", type: "text", icon: "🏭" },
//   {
//     label: "Currency",
//     name: "currency",
//     type: "select",
//     icon: "💱",
//     options: [
//       { label: "INR", value: "INR" },
//       { label: "USD", value: "USD" },
//     ],
//   },
//   {
//     label: "Status",
//     name: "status",
//     type: "select",
//     icon: "🔘",
//     options: [
//       { label: "Active", value: "1" },
//       { label: "Inactive", value: "0" },
//     ],
//   },
//   { label: "Landline No", name: "landlineNo", type: "text", icon: "☎️" },
//   { label: "Mobile No", name: "mobileNo", type: "text", icon: "📱" },
//   { label: "Email", name: "email", type: "email", icon: "📧" },
//   { label: "Website", name: "website", type: "text", icon: "🌐" },
//   { label: "LinkedIn", name: "linkedin", type: "text", icon: "🔗" },
//   { label: "Bank Name", name: "bankName", type: "text", icon: "🏦" },
//   { label: "Branch Name", name: "branchName", type: "text", icon: "🏦" },
//   { label: "IFSC Code", name: "ifscCode", type: "text", icon: "🔢" },
//   { label: "Account No", name: "accNo", type: "text", icon: "💳" },
//   { label: "Account Holder", name: "accHolder", type: "text", icon: "👤" },
//   { label: "PAN No", name: "panNo", type: "text", icon: "📄" },
//   { label: "GSTIN", name: "gstin", type: "text", icon: "🧾" },
// ];

// const sections = [
//   {
//     title: "Basic Information",
//     accent: "#2563eb",
//     light: "#eff6ff",
//     fields: [
//       "orgCode",
//       "orgName",
//       "shortName",
//       "effectiveFrom",
//       "effectiveTo",
//       "industry",
//       "currency",
//       "status",
//     ],
//   },
//   {
//     title: "Contact Details",
//     accent: "#0891b2",
//     light: "#ecfeff",
//     fields: ["landlineNo", "mobileNo", "email", "website", "linkedin"],
//   },
//   {
//     title: "Address",
//     accent: "#7c3aed",
//     light: "#f5f3ff",
//     fields: ["address"],
//     wide: true,
//   },
//   {
//     title: "Bank Details",
//     accent: "#059669",
//     light: "#ecfdf5",
//     fields: ["bankName", "branchName", "ifscCode", "accNo", "accHolder"],
//   },
//   {
//     title: "Tax & Compliance",
//     accent: "#d97706",
//     light: "#fffbeb",
//     fields: ["panNo", "gstin"],
//   },
// ];

// const allFields = [
//   ...fields,
//   { label: "Address", name: "address", type: "textarea", icon: "📍" },
// ];

// export default function OrgFormPage() {
//   const [formData, setFormData] = useState(
//     Object.fromEntries(allFields.map((f) => [f.name, ""])),
//   );
//   const [saving, setSaving] = useState(false);
//   const [saved, setSaved] = useState(false);

//   const handleChange = (name, value) =>
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   console.log("formData", formData);
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const res = await fetch("/api/org", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Save failed");
//       setSaved(true);
//       setTimeout(() => setSaved(false), 3000);
//     } catch (err) {
//       alert(`❌ ${err.message}`);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const getFieldDef = (name) => allFields.find((f) => f.name === name);

//   const renderInput = (fieldName, accentColor) => {
//     const field = getFieldDef(fieldName);
//     if (!field) return null;
//     const value = formData[field.name] ?? "";
//     const onChange = (e) => handleChange(field.name, e.target.value);

//     const base = `w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg
//       focus:outline-none focus:ring-2 transition-all duration-150 text-gray-800 placeholder-gray-400`;

//     return (
//       <div
//         key={field.name}
//         className={field.type === "textarea" ? "col-span-full" : ""}
//       >
//         <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
//           <span className="mr-1.5">{field.icon}</span>
//           {field.label}
//         </label>

//         {["text", "email", "date"].includes(field.type) && (
//           <input
//             type={field.type}
//             value={value}
//             onChange={onChange}
//             placeholder={
//               field.type !== "date" ? `Enter ${field.label.toLowerCase()}` : ""
//             }
//             className={base}
//             style={{ "--tw-ring-color": accentColor }}
//           />
//         )}

//         {field.type === "select" && (
//           <select
//             value={value}
//             onChange={onChange}
//             className={`${base} cursor-pointer`}
//             style={{ "--tw-ring-color": accentColor }}
//           >
//             <option value="">— Select {field.label} —</option>
//             {field.options?.map((opt, i) => (
//               <option key={i} value={opt.value}>
//                 {opt.label}
//               </option>
//             ))}
//           </select>
//         )}

//         {field.type === "textarea" && (
//           <textarea
//             value={value}
//             onChange={onChange}
//             rows={3}
//             placeholder="Enter full address..."
//             className={`${base} resize-none`}
//             style={{ "--tw-ring-color": accentColor }}
//           />
//         )}
//       </div>
//     );
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
//         * { font-family: 'DM Sans', sans-serif; }
//         .mono { font-family: 'DM Mono', monospace; }
//         .section-card { transition: box-shadow 0.2s; }
//         .section-card:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
//         input:focus, select:focus, textarea:focus { border-color: var(--accent) !important; box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 15%, transparent) !important; }
//         .save-btn { transition: all 0.2s; }
//         .save-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,99,235,0.35); }
//         .save-btn:active:not(:disabled) { transform: translateY(0); }
//         .fade-in { animation: fadeIn 0.4s ease both; }
//         @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
//       `}</style>

//       <div className="min-h-screen bg-gray-50">
//         {/* TOP HEADER */}
//         <header
//           className="sticky top-0 z-50 bg-white border-b border-gray-200"
//           style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}
//         >
//           <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
//                 O
//               </div>
//               <div>
//                 <h1 className="text-base font-semibold text-gray-900 leading-tight">
//                   Organization Setup
//                 </h1>
//                 <p className="text-xs text-gray-400">
//                   Fill in all required details below
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2.5">
//               <button
//                 type="button"
//                 onClick={() => window.history.back()}
//                 className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//               >
//                 ← Back
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 disabled={saving}
//                 className="save-btn px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg flex items-center gap-2"
//               >
//                 {saving ? (
//                   <>
//                     <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />{" "}
//                     Saving…
//                   </>
//                 ) : saved ? (
//                   <>✅ Saved!</>
//                 ) : (
//                   <>💾 Save</>
//                 )}
//               </button>
//             </div>
//           </div>
//         </header>

//         {/* PROGRESS DOTS */}
//         <div className="max-w-5xl mx-auto px-6 pt-5 pb-1 flex items-center gap-2">
//           {sections.map((s, i) => (
//             <div key={i} className="flex items-center gap-2">
//               <div className="flex items-center gap-1.5">
//                 <div
//                   className="w-2 h-2 rounded-full"
//                   style={{ background: s.accent }}
//                 />
//                 <span className="text-xs text-gray-400 font-medium hidden sm:inline">
//                   {s.title}
//                 </span>
//               </div>
//               {i < sections.length - 1 && (
//                 <div className="w-6 h-px bg-gray-200" />
//               )}
//             </div>
//           ))}
//         </div>

//         {/* FORM BODY */}
//         <main className="max-w-5xl mx-auto px-6 py-4 space-y-5 pb-16">
//           {sections.map((section, si) => (
//             <div
//               key={si}
//               className="section-card bg-white rounded-xl border border-gray-200 overflow-hidden fade-in"
//               style={{ animationDelay: `${si * 0.06}s` }}
//             >
//               {/* Section Header */}
//               <div
//                 className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100"
//                 style={{ background: section.light }}
//               >
//                 <div
//                   className="w-1 h-5 rounded-full"
//                   style={{ background: section.accent }}
//                 />
//                 <h2
//                   className="text-sm font-semibold"
//                   style={{ color: section.accent }}
//                 >
//                   {section.title}
//                 </h2>
//               </div>

//               {/* Fields Grid */}
//               <div
//                 className="p-5 grid gap-4"
//                 style={{
//                   gridTemplateColumns: section.wide
//                     ? "1fr"
//                     : "repeat(auto-fill, minmax(220px, 1fr))",
//                 }}
//               >
//                 {section.fields.map((name) =>
//                   renderInput(name, section.accent),
//                 )}
//               </div>
//             </div>
//           ))}

//           {/* FOOTER ACTIONS */}
//           <div className="flex justify-end gap-3 pt-2">
//             <button
//               type="button"
//               onClick={() =>
//                 setFormData(
//                   Object.fromEntries(allFields.map((f) => [f.name, ""])),
//                 )
//               }
//               className="px-5 py-2.5 text-sm font-medium text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
//             >
//               🔄 Reset
//             </button>
//             <button
//               onClick={handleSubmit}
//               disabled={saving}
//               className="save-btn px-7 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg"
//             >
//               {saving
//                 ? "Saving…"
//                 : saved
//                   ? "✅ Saved!"
//                   : "💾 Save Organization"}
//             </button>
//           </div>
//         </main>
//       </div>
//     </>
//   );
// }

// "use client";
// import { useState } from "react";

// export default function Org() {
//   const [formData, setFormData] = useState({
//     fname: "",
//     age: "",
//     email: "",
//   });

//   const [data, setData] = useState([]); // ✅ FIX

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     setData((prev) => [...prev, formData]); // ✅ FIX

//     // optional: reset form
//     // setFormData({
//     //   fname: "",
//     //   age: "",
//     //   email: "",
//     // });
//   };

//   console.log("Data", data);

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         {" "}
//         {/* ✅ FIX */}
//         <label>Name</label>
//         <br />
//         <input
//           type="text"
//           name="fname"
//           value={formData.fname}
//           onChange={handleChange}
//         />
//         <br />
//         <br />
//         <button type="submit">Submit</button>
//       </form>

//       <h3>Form Data:</h3>
//       <pre>{JSON.stringify(formData, null, 2)}</pre>

//       <h3>All Submitted Data:</h3>
//       <pre>{JSON.stringify(data, null, 2)}</pre>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import {
//   Trash2,
//   Plus,
//   FileText,
//   Calendar,
//   User,
//   Tag,
//   Hash,
//   Percent,
//   DollarSign,
//   StickyNote,
//   ChevronRight,
// } from "lucide-react";

// export default function BillingPage() {
//   const [header, setHeader] = useState({
//     bill_no: "",
//     bill_date: "",
//     customer: "",
//     discount: 0,
//     notes: "",
//   });

//   const [lines, setLines] = useState([]);
//   const [line, setLine] = useState({ item_desc: "", qty: 1, price: 0, tax: 0 });
//   const [saved, setSaved] = useState(false);

//   const addLine = () => {
//     if (!line.item_desc) return;
//     const item_value = line.qty * line.price;
//     const tax_amt = (item_value * line.tax) / 100;
//     const total = item_value + tax_amt;
//     setLines([
//       ...lines,
//       { ...line, item_value, tax_amt, total, id: Date.now() },
//     ]);
//     setLine({ item_desc: "", qty: 1, price: 0, tax: 0 });
//   };

//   const deleteLine = (id) => setLines(lines.filter((l) => l.id !== id));

//   const totalItem = lines.reduce((s, l) => s + l.item_value, 0);
//   const totalTax = lines.reduce((s, l) => s + l.tax_amt, 0);
//   const grandTotal = totalItem + totalTax - header.discount;

//   const fmt = (n) =>
//     Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

//   const handleSave = () => {
//     setSaved(true);
//     setTimeout(() => setSaved(false), 2000);
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         :root {
//           --ink: #0d0f1a;
//           --ink-2: #1e2236;
//           --ink-3: #2e3354;
//           --accent: #5b6af7;
//           --accent-light: #eef0ff;
//           --accent-glow: rgba(91,106,247,0.15);
//           --gold: #f4a427;
//           --surface: #ffffff;
//           --surface-2: #f7f8fc;
//           --border: #e8eaf2;
//           --muted: #8b91b0;
//           --green: #22c55e;
//           --red: #ef4444;
//           --shadow-sm: 0 1px 3px rgba(13,15,26,0.06), 0 1px 2px rgba(13,15,26,0.04);
//           --shadow-md: 0 4px 16px rgba(13,15,26,0.08), 0 2px 6px rgba(13,15,26,0.05);
//           --shadow-lg: 0 12px 40px rgba(13,15,26,0.12), 0 4px 12px rgba(13,15,26,0.08);
//           --radius: 16px;
//           --radius-sm: 10px;
//         }

//         .billing-root {
//           min-height: 100vh;
//           background: var(--surface-2);
//           font-family: 'DM Sans', sans-serif;
//           color: var(--ink);
//           padding: 0;
//         }

//         /* ── TOP BAR ── */
//         .topbar {
//           background: var(--ink);
//           padding: 0 32px;
//           height: 64px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           position: sticky;
//           top: 0;
//           z-index: 100;
//         }

//         .topbar-brand {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//         }

//         .topbar-brand .icon-box {
//           width: 34px;
//           height: 34px;
//           background: var(--accent);
//           border-radius: 8px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .topbar-brand span {
//           font-family: 'Syne', sans-serif;
//           font-weight: 700;
//           font-size: 17px;
//           color: #fff;
//           letter-spacing: -0.3px;
//         }

//         .topbar-meta {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           color: var(--muted);
//           font-size: 13px;
//         }

//         .topbar-meta .sep { width: 4px; height: 4px; border-radius: 50%; background: var(--ink-3); }

//         /* ── MAIN LAYOUT ── */
//         .main-wrap {
//           max-width: 1200px;
//           margin: 0 auto;
//           padding: 32px 24px;
//           display: flex;
//           gap: 28px;
//           align-items: flex-start;
//         }

//         .left-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 24px; }
//         .right-col { width: 300px; flex-shrink: 0; display: flex; flex-direction: column; gap: 20px; position: sticky; top: 88px; }

//         /* ── PAGE TITLE ── */
//         .page-title {
//           display: flex;
//           align-items: center;
//           gap: 14px;
//           margin-bottom: 4px;
//         }

//         .page-title h1 {
//           font-family: 'Syne', sans-serif;
//           font-size: 26px;
//           font-weight: 800;
//           color: var(--ink);
//           letter-spacing: -0.5px;
//         }

//         .bill-badge {
//           background: var(--accent-light);
//           color: var(--accent);
//           font-size: 12px;
//           font-weight: 600;
//           padding: 4px 10px;
//           border-radius: 20px;
//           letter-spacing: 0.2px;
//         }

//         /* ── CARD ── */
//         .card {
//           background: var(--surface);
//           border-radius: var(--radius);
//           box-shadow: var(--shadow-md);
//           border: 1px solid var(--border);
//           overflow: hidden;
//         }

//         .card-header {
//           padding: 20px 24px 16px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           border-bottom: 1px solid var(--border);
//         }

//         .card-title {
//           font-family: 'Syne', sans-serif;
//           font-size: 14px;
//           font-weight: 700;
//           color: var(--ink);
//           letter-spacing: 0.4px;
//           text-transform: uppercase;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }

//         .card-title .dot {
//           width: 7px;
//           height: 7px;
//           border-radius: 50%;
//           background: var(--accent);
//         }

//         .card-body { padding: 20px 24px; }

//         /* ── FIELD GRID ── */
//         .field-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr 1fr;
//           gap: 16px;
//         }

//         .field-group { display: flex; flex-direction: column; gap: 6px; }

//         .field-label {
//           font-size: 11px;
//           font-weight: 600;
//           color: var(--muted);
//           text-transform: uppercase;
//           letter-spacing: 0.7px;
//           display: flex;
//           align-items: center;
//           gap: 5px;
//         }

//         .field-label svg { color: var(--accent); }

//         .field-input {
//           border: 1.5px solid var(--border);
//           padding: 10px 14px;
//           border-radius: var(--radius-sm);
//           font-family: 'DM Sans', sans-serif;
//           font-size: 14px;
//           color: var(--ink);
//           background: var(--surface);
//           outline: none;
//           transition: border-color 0.18s, box-shadow 0.18s;
//           width: 100%;
//         }

//         .field-input:focus {
//           border-color: var(--accent);
//           box-shadow: 0 0 0 3px var(--accent-glow);
//         }

//         .field-input::placeholder { color: #c0c5db; }

//         /* ── ADD ITEM ROW ── */
//         .add-row {
//           display: grid;
//           grid-template-columns: 2fr 90px 110px 90px auto;
//           gap: 12px;
//           align-items: flex-end;
//         }

//         .add-btn {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 7px;
//           background: var(--accent);
//           color: #fff;
//           border: none;
//           border-radius: var(--radius-sm);
//           padding: 10px 20px;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 14px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
//           white-space: nowrap;
//           box-shadow: 0 4px 12px rgba(91,106,247,0.3);
//           height: 42px;
//         }

//         .add-btn:hover {
//           background: #4455e8;
//           transform: translateY(-1px);
//           box-shadow: 0 6px 18px rgba(91,106,247,0.4);
//         }

//         .add-btn:active { transform: translateY(0); }

//         /* ── TABLE ── */
//         .tbl-wrap { overflow-x: auto; }

//         table { width: 100%; border-collapse: collapse; font-size: 13.5px; }

//         thead tr {
//           background: var(--surface-2);
//         }

//         th {
//           padding: 11px 16px;
//           text-align: left;
//           font-size: 11px;
//           font-weight: 700;
//           color: var(--muted);
//           text-transform: uppercase;
//           letter-spacing: 0.7px;
//           white-space: nowrap;
//         }

//         th:last-child { text-align: center; }

//         tbody tr {
//           border-top: 1px solid var(--border);
//           transition: background 0.12s;
//         }

//         tbody tr:hover { background: #fafbff; }

//         td {
//           padding: 13px 16px;
//           color: var(--ink);
//           vertical-align: middle;
//         }

//         td:last-child { text-align: center; }

//         .td-item { font-weight: 500; color: var(--ink); }

//         .td-num {
//           font-variant-numeric: tabular-nums;
//           font-weight: 500;
//           color: var(--ink-2);
//         }

//         .td-total {
//           font-variant-numeric: tabular-nums;
//           font-weight: 700;
//           color: var(--accent);
//         }

//         .tax-badge {
//           background: var(--accent-light);
//           color: var(--accent);
//           padding: 2px 8px;
//           border-radius: 20px;
//           font-size: 12px;
//           font-weight: 600;
//         }

//         .del-btn {
//           background: none;
//           border: none;
//           cursor: pointer;
//           color: #d0d4e8;
//           transition: color 0.15s, transform 0.12s;
//           display: inline-flex;
//           padding: 4px;
//           border-radius: 6px;
//         }

//         .del-btn:hover { color: var(--red); transform: scale(1.15); }

//         .empty-state {
//           text-align: center;
//           padding: 48px 16px;
//           color: var(--muted);
//         }

//         .empty-state .empty-icon {
//           width: 52px;
//           height: 52px;
//           background: var(--surface-2);
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin: 0 auto 14px;
//         }

//         .empty-state p { font-size: 14px; }

//         /* ── COUNT BADGE ── */
//         .count-chip {
//           background: var(--ink);
//           color: #fff;
//           font-size: 11px;
//           font-weight: 700;
//           padding: 2px 8px;
//           border-radius: 20px;
//         }

//         /* ── NOTES ── */
//         .notes-area {
//           width: 100%;
//           border: 1.5px solid var(--border);
//           border-radius: var(--radius-sm);
//           padding: 12px 14px;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 14px;
//           color: var(--ink);
//           resize: vertical;
//           min-height: 110px;
//           outline: none;
//           transition: border-color 0.18s, box-shadow 0.18s;
//         }

//         .notes-area:focus {
//           border-color: var(--accent);
//           box-shadow: 0 0 0 3px var(--accent-glow);
//         }

//         .notes-area::placeholder { color: #c0c5db; }

//         /* ── SUMMARY CARD ── */
//         .summary-card {
//           background: var(--ink);
//           border-radius: var(--radius);
//           padding: 24px;
//           color: #fff;
//           box-shadow: var(--shadow-lg);
//         }

//         .summary-title {
//           font-family: 'Syne', sans-serif;
//           font-size: 13px;
//           font-weight: 700;
//           letter-spacing: 0.5px;
//           text-transform: uppercase;
//           color: rgba(255,255,255,0.5);
//           margin-bottom: 20px;
//         }

//         .summary-row {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 14px;
//           font-size: 14px;
//         }

//         .summary-row .label { color: rgba(255,255,255,0.6); }

//         .summary-row .value {
//           font-variant-numeric: tabular-nums;
//           font-weight: 600;
//           color: #fff;
//         }

//         .summary-divider {
//           height: 1px;
//           background: rgba(255,255,255,0.1);
//           margin: 16px 0;
//         }

//         .summary-total {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }

//         .summary-total .label {
//           font-family: 'Syne', sans-serif;
//           font-size: 15px;
//           font-weight: 700;
//           color: rgba(255,255,255,0.85);
//         }

//         .summary-total .value {
//           font-family: 'Syne', sans-serif;
//           font-size: 24px;
//           font-weight: 800;
//           color: var(--gold);
//           font-variant-numeric: tabular-nums;
//         }

//         .discount-row {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 14px;
//         }

//         .discount-row .label { font-size: 14px; color: rgba(255,255,255,0.6); }

//         .discount-input {
//           width: 100px;
//           background: rgba(255,255,255,0.08);
//           border: 1.5px solid rgba(255,255,255,0.15);
//           border-radius: 8px;
//           padding: 6px 10px;
//           color: #fff;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 14px;
//           font-weight: 600;
//           text-align: right;
//           outline: none;
//           transition: border-color 0.18s;
//         }

//         .discount-input:focus { border-color: var(--gold); }

//         .save-btn {
//           margin-top: 20px;
//           width: 100%;
//           padding: 14px;
//           background: linear-gradient(135deg, var(--accent), #7c3aed);
//           border: none;
//           border-radius: 12px;
//           color: #fff;
//           font-family: 'Syne', sans-serif;
//           font-size: 15px;
//           font-weight: 700;
//           cursor: pointer;
//           letter-spacing: 0.3px;
//           transition: opacity 0.18s, transform 0.12s, box-shadow 0.18s;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 8px;
//           box-shadow: 0 6px 20px rgba(91,106,247,0.35);
//         }

//         .save-btn:hover {
//           opacity: 0.92;
//           transform: translateY(-1px);
//           box-shadow: 0 10px 28px rgba(91,106,247,0.45);
//         }

//         .save-btn.saved { background: linear-gradient(135deg, var(--green), #16a34a); box-shadow: 0 6px 20px rgba(34,197,94,0.35); }

//         /* ── QUICK STATS ── */
//         .quick-stats {
//           background: var(--surface);
//           border-radius: var(--radius);
//           border: 1px solid var(--border);
//           padding: 18px 20px;
//           box-shadow: var(--shadow-sm);
//         }

//         .qs-title {
//           font-size: 11px;
//           font-weight: 700;
//           color: var(--muted);
//           text-transform: uppercase;
//           letter-spacing: 0.7px;
//           margin-bottom: 14px;
//         }

//         .qs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

//         .qs-item {
//           background: var(--surface-2);
//           border-radius: 10px;
//           padding: 12px;
//           display: flex;
//           flex-direction: column;
//           gap: 4px;
//         }

//         .qs-num {
//           font-family: 'Syne', sans-serif;
//           font-size: 18px;
//           font-weight: 800;
//           color: var(--ink);
//           font-variant-numeric: tabular-nums;
//         }

//         .qs-lbl { font-size: 11px; color: var(--muted); font-weight: 500; }

//         /* ── RESPONSIVE ── */
//         @media (max-width: 1024px) {
//           .main-wrap { flex-direction: column; }
//           .right-col { width: 100%; position: static; }
//           .qs-grid { grid-template-columns: repeat(4, 1fr); }
//         }

//         @media (max-width: 768px) {
//           .topbar { padding: 0 16px; }
//           .main-wrap { padding: 20px 16px; gap: 18px; }
//           .field-grid { grid-template-columns: 1fr 1fr; }
//           .field-grid .full { grid-column: 1 / -1; }
//           .add-row { grid-template-columns: 1fr 1fr; }
//           .add-row .item-col { grid-column: 1 / -1; }
//           .add-row .add-btn { grid-column: 1 / -1; }
//           .qs-grid { grid-template-columns: 1fr 1fr; }
//           .card-body { padding: 16px; }
//           .card-header { padding: 16px; }
//         }

//         @media (max-width: 480px) {
//           .field-grid { grid-template-columns: 1fr; }
//           .page-title h1 { font-size: 22px; }
//         }
//       `}</style>

//       <div className="billing-root">
//         {/* TOP BAR */}
//         <header className="topbar">
//           <div className="topbar-brand">
//             <div className="icon-box">
//               <FileText size={17} color="#fff" />
//             </div>
//             <span>BillFlow</span>
//           </div>
//           <div className="topbar-meta">
//             <span>Billing</span>
//             <div className="sep" />
//             <span>New Entry</span>
//           </div>
//         </header>

//         <div className="main-wrap">
//           {/* ── LEFT COLUMN ── */}
//           <div className="left-col">
//             {/* Page title */}
//             <div className="page-title">
//               <h1>New Invoice</h1>
//               <span className="bill-badge">DRAFT</span>
//             </div>

//             {/* Bill Header */}
//             <div className="card">
//               <div className="card-header">
//                 <div className="card-title">
//                   <div className="dot" />
//                   Bill Details
//                 </div>
//               </div>
//               <div className="card-body">
//                 <div className="field-grid">
//                   <div className="field-group">
//                     <label className="field-label">
//                       <Hash size={11} /> Bill No.
//                     </label>
//                     <input
//                       className="field-input"
//                       placeholder="e.g. INV-0042"
//                       value={header.bill_no}
//                       onChange={(e) =>
//                         setHeader({ ...header, bill_no: e.target.value })
//                       }
//                     />
//                   </div>
//                   <div className="field-group">
//                     <label className="field-label">
//                       <Calendar size={11} /> Bill Date
//                     </label>
//                     <input
//                       type="date"
//                       className="field-input"
//                       value={header.bill_date}
//                       onChange={(e) =>
//                         setHeader({ ...header, bill_date: e.target.value })
//                       }
//                     />
//                   </div>
//                   <div className="field-group">
//                     <label className="field-label">
//                       <User size={11} /> Customer
//                     </label>
//                     <input
//                       className="field-input"
//                       placeholder="Customer name"
//                       value={header.customer}
//                       onChange={(e) =>
//                         setHeader({ ...header, customer: e.target.value })
//                       }
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Add Item */}
//             <div className="card">
//               <div className="card-header">
//                 <div className="card-title">
//                   <div className="dot" />
//                   Add Item
//                 </div>
//               </div>
//               <div className="card-body">
//                 <div className="add-row">
//                   <div
//                     className="field-group item-col"
//                     style={{ gridColumn: "1 / -1" }}
//                   >
//                     <label className="field-label">
//                       <Tag size={11} /> Item Description
//                     </label>
//                     <input
//                       className="field-input"
//                       placeholder="Enter item or service name"
//                       value={line.item_desc}
//                       onChange={(e) =>
//                         setLine({ ...line, item_desc: e.target.value })
//                       }
//                       onKeyDown={(e) => e.key === "Enter" && addLine()}
//                     />
//                   </div>
//                   <div className="field-group">
//                     <label className="field-label">
//                       <Hash size={11} /> Qty
//                     </label>
//                     <input
//                       type="number"
//                       className="field-input"
//                       placeholder="1"
//                       value={line.qty}
//                       onChange={(e) =>
//                         setLine({ ...line, qty: Number(e.target.value) })
//                       }
//                     />
//                   </div>
//                   <div className="field-group">
//                     <label className="field-label">
//                       <DollarSign size={11} /> Price
//                     </label>
//                     <input
//                       type="number"
//                       className="field-input"
//                       placeholder="0.00"
//                       value={line.price}
//                       onChange={(e) =>
//                         setLine({ ...line, price: Number(e.target.value) })
//                       }
//                     />
//                   </div>
//                   <div className="field-group">
//                     <label className="field-label">
//                       <Percent size={11} /> Tax %
//                     </label>
//                     <input
//                       type="number"
//                       className="field-input"
//                       placeholder="0"
//                       value={line.tax}
//                       onChange={(e) =>
//                         setLine({ ...line, tax: Number(e.target.value) })
//                       }
//                     />
//                   </div>
//                   <div className="field-group">
//                     <label className="field-label" style={{ opacity: 0 }}>
//                       —
//                     </label>
//                     <button className="add-btn" onClick={addLine}>
//                       <Plus size={16} /> Add
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Items Table */}
//             <div className="card">
//               <div className="card-header">
//                 <div className="card-title">
//                   <div className="dot" />
//                   Line Items
//                 </div>
//                 {lines.length > 0 && (
//                   <span className="count-chip">{lines.length}</span>
//                 )}
//               </div>
//               <div className="tbl-wrap">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>#</th>
//                       <th>Item</th>
//                       <th>Qty</th>
//                       <th>Price</th>
//                       <th>Tax</th>
//                       <th>Value</th>
//                       <th>Total</th>
//                       <th></th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {lines.length === 0 ? (
//                       <tr>
//                         <td colSpan="8">
//                           <div className="empty-state">
//                             <div className="empty-icon">
//                               <FileText size={22} color="#c0c5db" />
//                             </div>
//                             <p>No items added yet</p>
//                           </div>
//                         </td>
//                       </tr>
//                     ) : (
//                       lines.map((l, i) => (
//                         <tr key={l.id}>
//                           <td
//                             style={{
//                               color: "var(--muted)",
//                               fontSize: 12,
//                               fontWeight: 600,
//                             }}
//                           >
//                             {String(i + 1).padStart(2, "0")}
//                           </td>
//                           <td className="td-item">{l.item_desc}</td>
//                           <td className="td-num">{l.qty}</td>
//                           <td className="td-num">₹{fmt(l.price)}</td>
//                           <td>
//                             <span className="tax-badge">{l.tax}%</span>
//                           </td>
//                           <td className="td-num">₹{fmt(l.item_value)}</td>
//                           <td className="td-total">₹{fmt(l.total)}</td>
//                           <td>
//                             <button
//                               className="del-btn"
//                               onClick={() => deleteLine(l.id)}
//                             >
//                               <Trash2 size={15} />
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Notes */}
//             <div className="card">
//               <div className="card-header">
//                 <div className="card-title">
//                   <div className="dot" />
//                   Notes
//                 </div>
//               </div>
//               <div className="card-body">
//                 <textarea
//                   className="notes-area"
//                   placeholder="Add any terms, payment instructions, or additional notes..."
//                   value={header.notes}
//                   onChange={(e) =>
//                     setHeader({ ...header, notes: e.target.value })
//                   }
//                 />
//               </div>
//             </div>
//           </div>

//           {/* ── RIGHT COLUMN ── */}
//           <div className="right-col">
//             {/* Quick Stats */}
//             <div className="quick-stats">
//               <div className="qs-title">Overview</div>
//               <div className="qs-grid">
//                 <div className="qs-item">
//                   <div className="qs-num">{lines.length}</div>
//                   <div className="qs-lbl">Items</div>
//                 </div>
//                 <div className="qs-item">
//                   <div className="qs-num">
//                     {lines.reduce((s, l) => s + l.qty, 0)}
//                   </div>
//                   <div className="qs-lbl">Total Qty</div>
//                 </div>
//                 <div className="qs-item">
//                   <div className="qs-num">₹{fmt(totalTax)}</div>
//                   <div className="qs-lbl">Tax Amt</div>
//                 </div>
//                 <div className="qs-item">
//                   <div className="qs-num">₹{fmt(totalItem)}</div>
//                   <div className="qs-lbl">Item Total</div>
//                 </div>
//               </div>
//             </div>

//             {/* Summary */}
//             <div className="summary-card">
//               <div className="summary-title">Summary</div>

//               <div className="summary-row">
//                 <span className="label">Subtotal</span>
//                 <span className="value">₹{fmt(totalItem)}</span>
//               </div>

//               <div className="summary-row">
//                 <span className="label">Tax</span>
//                 <span className="value">+ ₹{fmt(totalTax)}</span>
//               </div>

//               <div className="discount-row">
//                 <span className="label">Discount</span>
//                 <input
//                   type="number"
//                   className="discount-input"
//                   value={header.discount}
//                   onChange={(e) =>
//                     setHeader({ ...header, discount: Number(e.target.value) })
//                   }
//                 />
//               </div>

//               <div className="summary-divider" />

//               <div className="summary-total">
//                 <span className="label">Grand Total</span>
//                 <span className="value">₹{fmt(grandTotal)}</span>
//               </div>

//               <button
//                 className={`save-btn ${saved ? "saved" : ""}`}
//                 onClick={handleSave}
//               >
//                 {saved ? (
//                   "✓ Saved!"
//                 ) : (
//                   <>
//                     <ChevronRight size={17} />
//                     Save Invoice
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
