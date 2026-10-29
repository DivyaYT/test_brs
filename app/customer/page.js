// "use client";

// import { useEffect, useState } from "react";
// import "./customer.css";
// import useFormState from "../../component/useFormState";
// const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// const initialForm = {
//   name: "",
//   email: "",
//   phone: "",
// };

// export default function CustomerPage() {
//   const [formData, setFormData] = useState(initialForm);
//   const [customers, setCustomers] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({}); // Correct
//   const { state: checked, setState: setChecked } = useFormState("docMaster");
//   const [editId, setEditId] = useState(null);
//   const [deleteItem, setDeleteItem] = useState(null);

//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   const [success, setSuccess] = useState("");
//   const [apiError, setApiError] = useState("");

//   // VALIDATION
//   const validateField = (field, value) => {
//     const text = value.trim();

//     if (field === "name") {
//       if (!text) return "Customer name is required";
//       if (text.length < 3) return "Minimum 3 characters required";
//       if (text.length > 150) return "Maximum 150 characters allowed";
//     }

//     if (field === "email") {
//       if (!text) return "Email is required";
//       if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
//         return "Enter a valid email address";
//       }
//       if (text.length > 255) return "Email is too long";
//     }

//     if (field === "phone") {
//       if (!text) return "Phone number is required";
//       if (!/^[0-9]{10}$/.test(text)) {
//         return "Enter exactly 10 digits";
//       }
//     }

//     return "";
//   };

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));

//     setErrors((prev) => ({
//       ...prev,
//       [field]: validateField(field, value),
//     }));

//     setSuccess("");
//   };

//   const handleBlur = (field) => {
//     setTouched((prev) => ({
//       ...prev,
//       [field]: true,
//     }));

//     setErrors((prev) => ({
//       ...prev,
//       [field]: validateField(field, formData[field]),
//     }));
//     console.log("checked:", checked);
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     Object.keys(formData).forEach((field) => {
//       const error = validateField(field, formData[field]);
//       if (error) newErrors[field] = error;
//     });

//     setErrors(newErrors);
//     setTouched({
//       name: true,
//       email: true,
//       phone: true,
//     });

//     return Object.keys(newErrors).length === 0;
//   };

//   // GET
//   const fetchCustomers = async () => {
//     setFetchLoading(true);

//     try {
//       const response = await fetch(`${API_URL}/customers`, {
//         cache: "no-store",
//       });

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(result.message || "Failed to fetch customers");
//       }

//       setCustomers(result.data);
//       setApiError("");
//     } catch (error) {
//       setApiError(error.message);
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   // POST + PUT
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     setSuccess("");
//     setApiError("");

//     if (!validateForm()) return;

//     setLoading(true);

//     try {
//       const isEdit = editId !== null;

//       const url = isEdit
//         ? `${API_URL}/customers/${editId}`
//         : `${API_URL}/customers`;

//       const response = await fetch(url, {
//         method: isEdit ? "PUT" : "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         if (result.errors) {
//           setErrors(result.errors);
//           setTouched({
//             name: true,
//             email: true,
//             phone: true,
//           });
//         }

//         throw new Error(result.message || "Save failed");
//       }

//       setSuccess(
//         isEdit
//           ? "Customer updated successfully!"
//           : "Customer created successfully!",
//       );

//       setFormData({ ...initialForm });
//       setEditId(null);
//       setErrors({});
//       setTouched({});

//       await fetchCustomers();
//     } catch (error) {
//       setApiError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // EDIT
//   const handleEdit = (customer) => {
//     setEditId(customer.customer_id);

//     setFormData({
//       name: customer.name,
//       email: customer.email,
//       phone: customer.phone,
//     });

//     setErrors({});
//     setTouched({});
//     setSuccess("");
//     setApiError("");

//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // DELETE
//   const handleDelete = async () => {
//     if (!deleteItem) return;

//     setDeleteLoading(true);
//     setSuccess("");
//     setApiError("");

//     try {
//       const response = await fetch(
//         `${API_URL}/customers/${deleteItem.customer_id}`,
//         { method: "DELETE" },
//       );

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(result.message || "Delete failed");
//       }

//       if (editId === deleteItem.customer_id) {
//         setEditId(null);
//         setFormData({ ...initialForm });
//         setErrors({});
//         setTouched({});
//       }

//       setDeleteItem(null);
//       setSuccess("Customer deleted successfully!");

//       await fetchCustomers();
//     } catch (error) {
//       setApiError(error.message);
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   // RESET
//   const handleReset = () => {
//     setFormData({ ...initialForm });
//     setEditId(null);
//     setErrors({});
//     setTouched({});
//     setSuccess("");
//     setApiError("");
//   };

//   // SEARCH
//   const filteredCustomers = customers.filter((customer) => {
//     const keyword = search.toLowerCase().trim();

//     return (
//       String(customer.customer_id).includes(keyword) ||
//       customer.name.toLowerCase().includes(keyword) ||
//       customer.email.toLowerCase().includes(keyword) ||
//       customer.phone.includes(keyword)
//     );
//   });

//   return (
//     <div className="customer-page">
//       <div className="customer-container">
//         {/* HEADER */}
//         <div className="customer-header">
//           <div>
//             <h1>Customer Master</h1>
//             <p>Manage customer registration and details</p>
//           </div>

//           <div className="customer-count">
//             Total Customers: {customers.length}
//           </div>
//         </div>

//         {/* MESSAGES */}
//         {success && (
//           <div className="success-message" role="status">
//             {success}
//           </div>
//         )}

//         {apiError && (
//           <div className="api-error-message" role="alert">
//             {apiError}
//           </div>
//         )}

//         {/* FORM */}
//         <div className="customer-card">
//           <div className="card-header">
//             <h2>
//               {editId !== null
//                 ? `Edit Customer #${editId}`
//                 : "Customer Registration"}
//             </h2>
//             <p>
//               {editId !== null
//                 ? "Modify the customer information"
//                 : "Enter customer information below"}
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} noValidate>
//             <div className="customer-form-grid">
//               {/* NAME */}
//               <div className="form-group">
//                 <label
//                   htmlFor="customer-name"
//                   className={touched.name && errors.name ? "error-label" : ""}
//                 >
//                   Customer Name <span>*</span>
//                 </label>

//                 <input
//                   id="customer-name"
//                   type="text"
//                   placeholder="Enter customer name"
//                   value={formData.name}
//                   onChange={(e) => handleChange("name", e.target.value)}
//                   onBlur={() => handleBlur("name")}
//                   className={touched.name && errors.name ? "input-error" : ""}
//                   aria-invalid={Boolean(touched.name && errors.name)}
//                 />

//                 {touched.name && errors.name && (
//                   <p className="error-message">{errors.name}</p>
//                 )}
//               </div>

//               {/* PHONE */}
//               <div className="form-group">
//                 <label
//                   htmlFor="customer-phone"
//                   className={touched.phone && errors.phone ? "error-label" : ""}
//                 >
//                   Phone Number <span>*</span>
//                 </label>

//                 <input
//                   id="customer-phone"
//                   type="tel"
//                   placeholder="Enter 10-digit phone number"
//                   value={formData.phone}
//                   maxLength={10}
//                   inputMode="numeric"
//                   onChange={(e) => handleChange("phone", e.target.value)}
//                   onBlur={() => handleBlur("phone")}
//                   className={touched.phone && errors.phone ? "input-error" : ""}
//                   aria-invalid={Boolean(touched.phone && errors.phone)}
//                 />

//                 {touched.phone && errors.phone && (
//                   <p className="error-message">{errors.phone}</p>
//                 )}
//               </div>

//               {/* EMAIL */}
//               <div className="form-group">
//                 <label
//                   htmlFor="customer-email"
//                   className={touched.email && errors.email ? "error-label" : ""}
//                 >
//                   Email Address <span>*</span>
//                 </label>

//                 <input
//                   id="customer-email"
//                   type="email"
//                   placeholder="Enter email address"
//                   value={formData.email}
//                   onChange={(e) => handleChange("email", e.target.value)}
//                   onBlur={() => handleBlur("email")}
//                   className={touched.email && errors.email ? "input-error" : ""}
//                   aria-invalid={Boolean(touched.email && errors.email)}
//                 />

//                 {touched.email && errors.email && (
//                   <p className="error-message">{errors.email}</p>
//                 )}
//               </div>
//             </div>

//             <div className="form-actions">
//               <button
//                 type="button"
//                 className="reset-btn"
//                 onClick={handleReset}
//                 disabled={loading}
//               >
//                 {editId !== null ? "Cancel Edit" : "Reset"}
//               </button>

//               <button type="submit" className="submit-btn" disabled={loading}>
//                 {loading
//                   ? "Saving..."
//                   : editId !== null
//                     ? "Update Customer"
//                     : "Save Customer"}
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* REPORT */}
//         <div className="customer-card report-card">
//           <div className="card-header report-header">
//             <div>
//               <h2>Customer Report</h2>
//               <p>View and manage all registered customers</p>
//             </div>

//             <button
//               type="button"
//               className="refresh-btn"
//               onClick={fetchCustomers}
//               disabled={fetchLoading}
//             >
//               {fetchLoading ? "Loading..." : "Refresh"}
//             </button>
//           </div>

//           <div className="report-toolbar">
//             <input
//               type="search"
//               className="search-input"
//               placeholder="Search by ID, name, email or phone..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />

//             <span className="report-count">
//               Showing {filteredCustomers.length} of {customers.length}
//             </span>
//           </div>

//           <div className="table-responsive">
//             <table className="customer-table">
//               <thead>
//                 <tr>
//                   <th>S.No</th>
//                   <th>Customer ID</th>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Phone</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {fetchLoading ? (
//                   <tr>
//                     <td colSpan={7} className="empty-data">
//                       Loading customers...
//                     </td>
//                   </tr>
//                 ) : filteredCustomers.length === 0 ? (
//                   <tr>
//                     <td colSpan={7} className="empty-data">
//                       No customers found
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredCustomers.map((customer, index) => (
//                     <tr key={customer.customer_id}>
//                       <td>{index + 1}</td>
//                       <td>{customer.customer_id}</td>
//                       <td>{customer.name}</td>
//                       <td>{customer.email}</td>
//                       <td>{customer.phone}</td>
//                       <td>
//                         <span
//                           className={
//                             customer.status === "ACTIVE"
//                               ? "status-active"
//                               : "status-inactive"
//                           }
//                         >
//                           {customer.status}
//                         </span>
//                       </td>
//                       <td>
//                         <div className="table-actions">
//                           <button
//                             type="button"
//                             className="edit-btn"
//                             onClick={() => handleEdit(customer)}
//                             disabled={loading || deleteLoading}
//                           >
//                             Edit
//                           </button>

//                           <button
//                             type="button"
//                             className="delete-btn"
//                             onClick={() => setDeleteItem(customer)}
//                             disabled={loading || deleteLoading}
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* DELETE CONFIRMATION */}
//       {deleteItem && (
//         <div className="modal-overlay">
//           <div
//             className="delete-modal"
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="delete-heading"
//           >
//             <div className="delete-modal-icon">!</div>

//             <h2 id="delete-heading">Delete Customer?</h2>

//             <p>
//               Are you sure you want to delete <strong>{deleteItem.name}</strong>
//               ?
//             </p>

//             <p className="delete-warning">This action cannot be undone.</p>

//             <div className="modal-actions">
//               <button
//                 type="button"
//                 className="reset-btn"
//                 onClick={() => setDeleteItem(null)}
//                 disabled={deleteLoading}
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 className="confirm-delete-btn"
//                 onClick={handleDelete}
//                 disabled={deleteLoading}
//               >
//                 {deleteLoading ? "Deleting..." : "Yes, Delete"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
