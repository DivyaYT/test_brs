import TableRow from "./TableRow";

export default function Table({ columns, data, onEdit }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">

        <thead className="text-gray-500 border-b">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="text-left py-3">
                {col.label}
              </th>
            ))}
            <th className="text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              row={row}
              columns={columns}
              onEdit={onEdit}
            />
          ))}
        </tbody>

      </table>
    </div>
  );
}