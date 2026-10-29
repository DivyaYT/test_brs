"use client";
import { useState } from "react";
import TableHeader from "./TableHeader";

export default function PreviewTable({ previewData, headers, onUpload }) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 50;

  if (!previewData.length) return null;

  // PAGINATION LOGIC
  const totalPages = Math.ceil(previewData.length / rowsPerPage);

  const indexOfLast = page * rowsPerPage;
  const currentData = previewData.slice(indexOfLast - rowsPerPage, indexOfLast);

  return (
    <div className="mt-6 bg-white p-5 rounded-2xl shadow-xl">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Preview Data</h2>

      <div className="overflow-x-auto max-h-[300px]">
        <table className="min-w-full text-sm text-gray-700">
          <TableHeader columns={headers} />

          <tbody className="divide-y">
            {currentData.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {headers.map((h) => (
                  <td key={h} className="px-4 py-2 whitespace-nowrap">
                    {row[h] || row[h?.toLowerCase()]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* ACTION BUTTON ROW (RIGHT SIDE FIX) */}
      <div className="flex justify-end mt-4">
        <button
          onClick={onUpload}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl shadow-md transition"
        >
          Confirm Upload
        </button>
      </div>
    </div>
  );
}
