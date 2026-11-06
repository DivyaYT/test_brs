
"use client";

export default function Pagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}) {
  return (
    <div className="flex justify-center items-center gap-4 mt-6 mb-6">

      <button
        type="button"
        onClick={onPrev}
        disabled={currentPage <= 1}
        className="px-5 py-2 rounded-lg border
                   bg-white text-gray-700
                   hover:bg-gray-100
                   disabled:opacity-40
                   disabled:cursor-not-allowed"
      >
        Previous
      </button>

      <span className="text-sm font-semibold text-gray-700">
        Page {currentPage} of {totalPages}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={currentPage >= totalPages}
        className="px-5 py-2 rounded-lg border
                   bg-blue-600 text-white
                   hover:bg-blue-700
                   disabled:opacity-40
                   disabled:cursor-not-allowed"
      >
        Next
      </button>

    </div>
  );
}
