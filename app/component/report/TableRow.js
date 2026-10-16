import { Download, Eye, Pencil } from "lucide-react";

export default function TableRow({ row, columns, onEdit }) {
  return (
    <tr className="border-b hover:bg-gray-50">
      {columns.map((col) => (
        <td key={col.key} className="py-4">
          {/* CUSTOM RENDER */}
          {col.render ? col.render(row[col.key], row) : row[col.key]}
        </td>
      ))}

      {/* ACTION */}
      <td className="text-right">
        <div className="flex justify-end gap-2">
          <button className="p-2 border rounded">
            <Download size={16} />
          </button>

          <button className="p-2 border rounded">
            <Eye size={16} />
          </button>

          <button onClick={() => onEdit(row.id)} className="p-2 border rounded">
            <Pencil size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
