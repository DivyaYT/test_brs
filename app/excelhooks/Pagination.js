

"use client";

export default function Pagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}) {
  if (totalPages <= 1) return null; // ✅ hide if not needed

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
      <p className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex gap-2">
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          className="px-4 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>

        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="px-4 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
