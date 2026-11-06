"use client";

export default function TableSelection({
  selectedIds = [],
  currentData = [],
  onSelectRow,
  onSelectAll,
  idField,
}) {
  const getId = (row) => String(row[idField] ?? row[idField.toLowerCase()]);

  const allSelected =
    currentData.length > 0 &&
    currentData.every((row) => selectedIds.includes(getId(row)));

  const selectedCount = selectedIds.length;

  return (
    <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="w-4 h-4 accent-blue-600"
          />
          Select All (Current Page)
        </label>

        <span className="text-sm text-gray-600">Selected: {selectedCount}</span>
      </div>

      {selectedCount > 0 && (
        <button
          onClick={() => onDeleteSelected?.()}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Delete Selected ({selectedCount})
        </button>
      )}
    </div>
  );
}
