"use client";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import TableHeader from "./TableHeader";

export default function MainTable({
  data,
  headers,
  editingId,
  form,
  onEdit,
  onDelete,
  onChange,
  onUpdate,
}) {
  return (
    <div className="mt-6 bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* TABLE CONTAINER */}
      <div className="overflow-x-auto max-h-[500px]">
        <table className="min-w-full text-sm text-gray-700">
          <TableHeader columns={["ID", ...headers, "Actions"]} />

          <tbody className="divide-y">
            {data.map((row) => {
              const id = row.AP_ID || row.ap_id;

              return (
                <tr
                  key={id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  {/* ID */}
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {id}
                  </td>

                  {/* DYNAMIC COLUMNS */}
                  {headers.map((h) => (
                    <td key={h} className="px-4 py-3 whitespace-nowrap">
                      {editingId === id ? (
                        <input
                          name={h}
                          value={form[h] || ""}
                          onChange={onChange}
                          className="border rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                      ) : (
                        row[h] || row[h?.toLowerCase()]
                      )}
                    </td>
                  ))}

                  {/* ACTIONS */}
                  <td className="px-4 py-3 flex gap-3">
                    {editingId === id ? (
                      <button
                        onClick={() => onUpdate(id)}
                        className="text-green-600 font-semibold hover:underline"
                      >
                        Save
                      </button>
                    ) : (
                      <FiEdit
                        onClick={() => onEdit(row)}
                        className="cursor-pointer text-blue-500 hover:scale-110 transition"
                      />
                    )}

                    <FiTrash2
                      onClick={() => onDelete(id)}
                      className="cursor-pointer text-red-500 hover:scale-110 transition"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
