import { Download, Upload, Plus } from "lucide-react";

export default function TableActions({ onCreate, onUpload, onDownload }) {
  return (
    <div className="flex gap-3 flex-wrap">
      <button
        onClick={onCreate}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg"
      >
        <Plus size={16} /> Create
      </button>

      <button
        onClick={onUpload}
        className="flex items-center gap-2 px-4 py-2 border rounded-lg"
      >
        <Upload size={16} /> Upload
      </button>

      <button
        onClick={onDownload}
        className="flex items-center gap-2 px-4 py-2 border rounded-lg"
      >
        <Download size={16} /> Download
      </button>
    </div>
  );
}
