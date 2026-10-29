import { Search } from "lucide-react";

export default function TableSearch({ value, onChange }) {
  return (
    <div className="flex items-center border rounded-lg px-3">
      <Search size={16} className="text-gray-400" />
      <input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 outline-none"
      />
    </div>
  );
}
