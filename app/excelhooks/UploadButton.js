"use client";
import { FiUploadCloud, FiDownload } from "react-icons/fi";

export default function UploadButton({ onFileChange, onDownload, uploading }) {
  return (
    <div className="flex flex-wrap justify-end gap-6 w-full">
      <label className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl cursor-pointer">
        <FiUploadCloud />
        {uploading ? "Processing..." : "Upload Excel"}
        <input type="file" hidden onChange={onFileChange} />
      </label>

      <button
        onClick={onDownload}
        className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-xl"
      >
        <FiDownload /> Template
      </button>
    </div>
  );
}
