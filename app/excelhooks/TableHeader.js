
"use client";

export default function TableHeader({ columns }) {
  return (
    <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white sticky top-0 z-10">
      <tr>
        {columns.map((col) => (
          <th
            key={col}
            className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}
