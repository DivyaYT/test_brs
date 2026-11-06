// "use client";

// import { FiEdit, FiTrash2 } from "react-icons/fi";

// export default function MainTable({
//   data = [],
//   headers = [],
//   editingId,
//   form = {},
//   deletingId,
//   selectedIds = [],
//   allSelected = false,
//   onSelectRow,
//   onSelectAll,
//   onEdit,
//   onDelete,
//   onChange,
//   onUpdate,
// }) {
//   const bulkDeleting = deletingId === "bulk";

//   return (
//     <div className="mt-6 bg-white rounded-2xl shadow-xl overflow-hidden">
//       <div className="overflow-x-auto max-h-[500px]">
//         <table className="min-w-full text-sm text-gray-700">
//           {/* TABLE HEADER */}
//           <thead>
//             <tr className="bg-gray-100 sticky top-0 z-10">
//               {/* SELECT ALL */}
//               <th className="px-4 py-3">
//                 <input
//                   type="checkbox"
//                   checked={allSelected}
//                   onChange={(e) => onSelectAll?.(e.target.checked)}
//                   disabled={bulkDeleting}
//                   className="w-4 h-4 accent-blue-600 cursor-pointer"
//                   title="Select all current page records"
//                 />
//               </th>

//               {/* ID */}
//               <th className="px-4 py-3 text-left">ID</th>

//               {/* DYNAMIC HEADERS */}
//               {headers.map((h) => (
//                 <th key={h} className="px-4 py-3 text-left whitespace-nowrap">
//                   {h}
//                 </th>
//               ))}

//               {/* ACTIONS */}
//               <th className="px-4 py-3 text-center">Actions</th>
//             </tr>
//           </thead>

//           {/* TABLE BODY */}
//           <tbody className="divide-y">
//             {data.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={headers.length + 3}
//                   className="text-center py-8 text-gray-400"
//                 >
//                   No records found
//                 </td>
//               </tr>
//             ) : (
//               data.map((row) => {
//                 const id = String(row.AP_ID ?? row.ap_id);

//                 const isSelected = selectedIds.includes(id);

//                 const isEditing =
//                   editingId !== null && String(editingId) === id;

//                 const isDeleting = String(deletingId) === id;

//                 return (
//                   <tr
//                     key={id}
//                     className={`transition ${
//                       isSelected ? "bg-blue-50" : "hover:bg-gray-50"
//                     }`}
//                   >
//                     {/* INDIVIDUAL CHECKBOX */}
//                     <td className="px-4 py-3 text-center">
//                       <input
//                         type="checkbox"
//                         checked={isSelected}
//                         disabled={bulkDeleting || isDeleting}
//                         onChange={(e) => onSelectRow?.(id, e.target.checked)}
//                         className="w-4 h-4 accent-blue-600 cursor-pointer"
//                       />
//                     </td>

//                     {/* ID */}
//                     <td className="px-4 py-3 font-medium whitespace-nowrap">
//                       {id}
//                     </td>

//                     {/* DYNAMIC COLUMNS */}
//                     {headers.map((h) => (
//                       <td key={h} className="px-4 py-3 whitespace-nowrap">
//                         {isEditing ? (
//                           <input
//                             name={h}
//                             value={form[h] ?? form[h.toLowerCase()] ?? ""}
//                             onChange={onChange}
//                             disabled={bulkDeleting}
//                             className="border rounded-lg px-2 py-1 w-full
//                                        focus:ring-2 focus:ring-blue-400
//                                        outline-none"
//                           />
//                         ) : (
//                           (row[h] ?? row[h.toLowerCase()] ?? "")
//                         )}
//                       </td>
//                     ))}

//                     {/* ACTIONS */}
//                     <td className="px-4 py-3">
//                       <div className="flex items-center justify-center gap-3">
//                         {/* EDIT / SAVE */}
//                         {isEditing ? (
//                           <button
//                             onClick={() => onUpdate?.(id)}
//                             disabled={bulkDeleting || deletingId !== null}
//                             className="text-green-600 font-semibold
//                                        hover:underline disabled:opacity-50"
//                           >
//                             Save
//                           </button>
//                         ) : (
//                           <button
//                             onClick={() => onEdit?.(row)}
//                             disabled={bulkDeleting || deletingId !== null}
//                             title="Edit"
//                             className="text-blue-500 hover:scale-110
//                                        transition disabled:opacity-40"
//                           >
//                             <FiEdit size={18} />
//                           </button>
//                         )}

//                         {/* SINGLE DELETE */}
//                         <button
//                           onClick={() => onDelete?.(id)}
//                           disabled={bulkDeleting || deletingId !== null}
//                           title="Delete"
//                           className="text-red-500 hover:scale-110
//                                      transition disabled:opacity-40
//                                      disabled:cursor-not-allowed"
//                         >
//                           <FiTrash2 size={18} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

"use client";


import { FiEdit, FiTrash2 } from "react-icons/fi";


const getRowId = (row) => {
  const id =
    row?.GL_ID ??
    row?.gl_id ??
    row?.AP_ID ??
    row?.ap_id ??
    row?.BS_ID ??
    row?.bs_id ??
    row?.id ??
    row?.ID;


  return id === undefined || id === null ? "" : String(id);
};


export default function MainTable({
  data = [],
  headers = [],
  editingId,
  form = {},
  deletingId,
  selectedIds = [],
  allSelected = false,
  onSelectRow,
  onSelectAll,
  onEdit,
  onDelete,
  onChange,
  onUpdate,
}) {
  const bulkDeleting = deletingId === "bulk";


  return (
    <div className="mt-6 bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto max-h-[500px]">
        <table className="min-w-full text-sm text-gray-700">
          {/* TABLE HEADER */}
          <thead>
            <tr className="bg-gray-100 sticky top-0 z-10">
              {/* SELECT ALL */}
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll?.(e.target.checked)}
                  disabled={bulkDeleting}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  title="Select all current page records"
                />
              </th>


              {/* ID */}
              <th className="px-4 py-3 text-left">ID</th>


              {/* DYNAMIC HEADERS */}
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left whitespace-nowrap"
                >
                  {h}
                </th>
              ))}


              {/* ACTIONS */}
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>


          {/* TABLE BODY */}
          <tbody className="divide-y">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length + 3}
                  className="text-center py-8 text-gray-400"
                >
                  No records found
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const id = getRowId(row);


                const isSelected = selectedIds.includes(id);


                const isEditing =
                  editingId !== null && String(editingId) === id;


                const isDeleting = String(deletingId) === id;


                return (
                  <tr
                    key={id || `row-${Math.random()}`}
                    className={`transition ${
                      isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    {/* INDIVIDUAL CHECKBOX */}
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={bulkDeleting || isDeleting || !id}
                        onChange={(e) =>
                          onSelectRow?.(id, e.target.checked)
                        }
                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                      />
                    </td>


                    {/* ID */}
                    <td className="px-4 py-3 font-medium whitespace-nowrap">
                      {id || "—"}
                    </td>


                    {/* DYNAMIC COLUMNS */}
                    {headers.map((h) => (
                      <td
                        key={h}
                        className="px-4 py-3 whitespace-nowrap"
                      >
                        {isEditing ? (
                          <input
                            name={h}
                            value={form[h] ?? form[h.toLowerCase()] ?? ""}
                            onChange={onChange}
                            disabled={bulkDeleting}
                            className="border rounded-lg px-2 py-1 w-full
                                       focus:ring-2 focus:ring-blue-400
                                       outline-none"
                          />
                        ) : (
                          (row[h] ?? row[h.toLowerCase()] ?? "")
                        )}
                      </td>
                    ))}


                    {/* ACTIONS */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-3">
                        {/* EDIT / SAVE */}
                        {isEditing ? (
                          <button
                            onClick={() => onUpdate?.(id)}
                            disabled={bulkDeleting || deletingId !== null}
                            className="text-green-600 font-semibold
                                       hover:underline disabled:opacity-50"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => onEdit?.(row)}
                            disabled={bulkDeleting || deletingId !== null}
                            title="Edit"
                            className="text-blue-500 hover:scale-110
                                       transition disabled:opacity-40"
                          >
                            <FiEdit size={18} />
                          </button>
                        )}


                        {/* SINGLE DELETE */}
                        <button
                          onClick={() => onDelete?.(id)}
                          disabled={
                            bulkDeleting ||
                            deletingId !== null ||
                            !id
                          }
                          title="Delete"
                          className="text-red-500 hover:scale-110
                                     transition disabled:opacity-40
                                     disabled:cursor-not-allowed"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}