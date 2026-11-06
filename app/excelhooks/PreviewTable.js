"use client";

import { useEffect, useMemo, useState } from "react";
import TableHeader from "./TableHeader";
import { REQUIRED_HEADERS } from "../excelhooks/RequiredHeaders";

/* =========================
   HELPERS
========================= */
const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toUpperCase();

const getCellValue = (row, header) => {
  const normalizedHeader = normalize(header);

  return (
    row[header] ?? row[header?.toLowerCase()] ?? row[normalizedHeader] ?? ""
  );
};

const isEmptyValue = (value) =>
  value === null || value === undefined || String(value).trim() === "";

const isValidNumber = (value) => !isNaN(Number(value)) && value !== "";

const isValidDate = (value) => {
  if (value instanceof Date) {
    return !isNaN(value.getTime());
  }

  return !isNaN(new Date(value).getTime());
};

const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));

const isValidBoolean = (value) =>
  ["true", "false", "yes", "no", "1", "0"].includes(
    String(value).trim().toLowerCase(),
  );

/* =========================
   VALIDATION
   Null / blank values are allowed.
   Type validation happens only when value exists.
========================= */
const validateCellValue = (value, expectedType, header) => {
  if (isEmptyValue(value)) {
    return null;
  }

  const stringValue = String(value).trim();

  switch (expectedType) {
    case "number":
      if (!isValidNumber(stringValue)) {
        return `${header} must be a number`;
      }
      break;

    case "date":
      if (!isValidDate(stringValue)) {
        return `${header} must be a valid date`;
      }
      break;

    case "email":
      if (!isValidEmail(stringValue)) {
        return `${header} must be a valid email`;
      }
      break;

    case "boolean":
      if (!isValidBoolean(stringValue)) {
        return `${header} must be true/false`;
      }
      break;

    case "string":
    default:
      break;
  }

  return null;
};

const validateRow = (row, displayColumns) => {
  const errors = [];

  displayColumns.forEach((column) => {
    const value = getCellValue(row, column.header);

    const error = validateCellValue(
      value,
      column.type || "string",
      column.label || column.header,
    );

    if (error) {
      errors.push(error);
    }
  });

  return errors;
};

/* =========================
   MAIN COMPONENT
========================= */
export default function PreviewTable({
  previewData = [],
  headers = [],
  type = "",
  onUpload,
  onCancel,
  uploading = false,
  rowsPerPage = 100,
  showErrorColumn = true,
  blockUploadOnError = false,
}) {
  const [page, setPage] = useState(1);

  const requiredConfig = REQUIRED_HEADERS(type);

  const requiredHeaders = requiredConfig?.headers || [];
  const columnTypes = requiredConfig?.types || {};

  useEffect(() => {
    setPage(1);
  }, [previewData]);

  const displayColumns = useMemo(() => {
    if (!previewData.length) return [];

    if (requiredHeaders.length) {
      return headers
        .filter((header) =>
          requiredHeaders.some(
            (required) => normalize(required) === normalize(header),
          ),
        )
        .map((header) => ({
          header,
          label: header,
          type: columnTypes[normalize(header)] || "string",
        }));
    }

    return headers.map((header) => ({
      header,
      label: header,
      type: "string",
    }));
  }, [previewData, headers, requiredHeaders, columnTypes]);

  const rowsWithErrors = useMemo(() => {
    return previewData.map((row) => ({
      row,
      errors: validateRow(row, displayColumns),
    }));
  }, [previewData, displayColumns]);

  const validRows = useMemo(() => {
    return rowsWithErrors
      .filter((item) => item.errors.length === 0)
      .map((item) => item.row);
  }, [rowsWithErrors]);

  const invalidRowCount = previewData.length - validRows.length;

  if (!previewData.length) return null;

  const totalPages = Math.max(1, Math.ceil(previewData.length / rowsPerPage));

  const safePage = Math.min(page, totalPages);

  const startIndex = (safePage - 1) * rowsPerPage;
  const currentData = previewData.slice(startIndex, startIndex + rowsPerPage);

  const handlePrevious = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleUploadValidRows = () => {
    if (!validRows.length) return;

    onUpload(validRows);
  };

  return (
    <div className="mt-6 bg-white p-5 rounded-2xl shadow-xl">
      {/* HEADER WITH BUTTONS */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Preview Data</h2>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={uploading}
            className="bg-gray-500 hover:bg-gray-600 text-white
                       px-5 py-2 rounded-xl shadow-md transition
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleUploadValidRows}
            disabled={uploading || validRows.length === 0}
            className="bg-green-500 hover:bg-green-600 text-white
                       px-5 py-2 rounded-xl shadow-md transition
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading
              ? "Uploading..."
              : `Confirm Upload (${validRows.length})`}
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3">
        Total Excel Rows: {previewData.length}
        {" | "}
        Valid Rows: {validRows.length}
        {" | "}
        Invalid Rows: {invalidRowCount}
        {" | "}
        Showing {currentData.length} rows
      </p>

      {/* TABLE */}
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="min-w-full text-sm text-gray-700">
          <TableHeader
            columns={[
              ...displayColumns.map((column) => column.label || column.header),
              ...(showErrorColumn ? ["Error"] : []),
            ]}
          />

          <tbody className="divide-y">
            {currentData.map((row, index) => {
              const actualIndex = startIndex + index;

              const rowErrors = rowsWithErrors[actualIndex]?.errors || [];

              const isValidRow = rowErrors.length === 0;

              return (
                <tr
                  key={actualIndex}
                  className={`hover:bg-gray-50 ${
                    isValidRow ? "bg-white" : "bg-red-50"
                  }`}
                >
                  {displayColumns.map((column) => {
                    const value = getCellValue(row, column.header);

                    return (
                      <td
                        key={column.header}
                        className="px-4 py-2 whitespace-nowrap"
                      >
                        {isEmptyValue(value) ? "-" : String(value)}
                      </td>
                    );
                  })}

                  {showErrorColumn && (
                    <td className="px-4 py-2 whitespace-nowrap">
                      {isValidRow ? (
                        <span className="text-green-600 font-medium">
                          Valid
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          {rowErrors.join(", ")}
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Page {safePage} of {totalPages}
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={safePage <= 1}
            className="px-4 py-2 bg-gray-200 rounded-lg
                       hover:bg-gray-300 disabled:opacity-40
                       disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={safePage >= totalPages}
            className="px-4 py-2 bg-gray-200 rounded-lg
                       hover:bg-gray-300 disabled:opacity-40
                       disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import TableHeader from "./TableHeader";
// import { REQUIRED_HEADERS } from "../excelhooks/RequiredHeaders";
// import { formatDateToDDMONYYYY } from "../excelhooks/dateUtils";

// /* =========================
//    HELPERS
// ========================= */
// const normalize = (value) =>
//   String(value ?? "")
//     .trim()
//     .toUpperCase();

// const getCellValue = (row, header) => {
//   const normalizedHeader = normalize(header);

//   return (
//     row[header] ?? row[header?.toLowerCase()] ?? row[normalizedHeader] ?? ""
//   );
// };

// const isEmptyValue = (value) =>
//   value === null || value === undefined || String(value).trim() === "";

// const isValidNumber = (value) => !isNaN(Number(value)) && value !== "";

// const isValidDate = (value) => {
//   if (value instanceof Date) {
//     return !isNaN(value.getTime());
//   }

//   return !isNaN(new Date(value).getTime());
// };

// const isValidEmail = (value) =>
//   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));

// const isValidBoolean = (value) =>
//   ["true", "false", "yes", "no", "1", "0"].includes(
//     String(value).trim().toLowerCase(),
//   );

// /* =========================
//    VALIDATION
//    Null / blank values are allowed.
//    Type validation happens only when value exists.
// ========================= */
// const validateCellValue = (value, expectedType, header) => {
//   if (isEmptyValue(value)) {
//     return null;
//   }

//   const stringValue = String(value).trim();

//   switch (expectedType) {
//     case "number":
//       if (!isValidNumber(stringValue)) {
//         return `${header} must be a number`;
//       }
//       break;

//     case "date":
//       if (!isValidDate(stringValue)) {
//         return `${header} must be a valid date`;
//       }
//       break;

//     case "email":
//       if (!isValidEmail(stringValue)) {
//         return `${header} must be a valid email`;
//       }
//       break;

//     case "boolean":
//       if (!isValidBoolean(stringValue)) {
//         return `${header} must be true/false`;
//       }
//       break;

//     case "string":
//     default:
//       break;
//   }

//   return null;
// };

// const validateRow = (row, displayColumns) => {
//   const errors = [];

//   displayColumns.forEach((column) => {
//     const value = getCellValue(row, column.header);

//     const error = validateCellValue(
//       value,
//       column.type || "string",
//       column.label || column.header,
//     );

//     if (error) {
//       errors.push(error);
//     }
//   });

//   return errors;
// };

// /* =========================
//    MAIN COMPONENT
// ========================= */
// export default function PreviewTable({
//   previewData = [],
//   headers = [],
//   type = "",
//   onUpload,
//   onCancel,
//   uploading = false,
//   rowsPerPage = 100,
//   showErrorColumn = true,
// }) {
//   const [page, setPage] = useState(1);

//   const requiredConfig = REQUIRED_HEADERS(type);

//   const requiredHeaders = requiredConfig?.headers || [];
//   const columnTypes = requiredConfig?.types || {};

//   useEffect(() => {
//     setPage(1);
//   }, [previewData]);

//   const displayColumns = useMemo(() => {
//     if (!previewData.length) return [];

//     if (requiredHeaders.length) {
//       return headers
//         .filter((header) =>
//           requiredHeaders.some(
//             (required) => normalize(required) === normalize(header),
//           ),
//         )
//         .map((header) => ({
//           header,
//           label: header,
//           type: columnTypes[normalize(header)] || "string",
//         }));
//     }

//     return headers.map((header) => ({
//       header,
//       label: header,
//       type: "string",
//     }));
//   }, [previewData, headers, requiredHeaders, columnTypes]);

//   const rowsWithErrors = useMemo(() => {
//     return previewData.map((row) => ({
//       row,
//       errors: validateRow(row, displayColumns),
//     }));
//   }, [previewData, displayColumns]);

//   const validRows = useMemo(() => {
//     return rowsWithErrors
//       .filter((item) => item.errors.length === 0)
//       .map((item) => item.row);
//   }, [rowsWithErrors]);

//   const invalidRowCount = previewData.length - validRows.length;

//   if (!previewData.length) return null;

//   const totalPages = Math.max(1, Math.ceil(previewData.length / rowsPerPage));

//   const safePage = Math.min(page, totalPages);

//   const startIndex = (safePage - 1) * rowsPerPage;

//   const currentData = previewData.slice(startIndex, startIndex + rowsPerPage);

//   const handlePrevious = () => {
//     setPage((prev) => Math.max(prev - 1, 1));
//   };

//   const handleNext = () => {
//     setPage((prev) => Math.min(prev + 1, totalPages));
//   };

//   const handleUploadValidRows = () => {
//     if (!validRows.length) return;

//     onUpload(validRows);
//   };

//   return (
//     <div className="mt-6 bg-white p-5 rounded-2xl shadow-xl">
//       {/* HEADER WITH BUTTONS */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold text-gray-700">Preview Data</h2>

//         <div className="flex gap-3">
//           <button
//             type="button"
//             onClick={onCancel}
//             disabled={uploading}
//             className="bg-gray-500 hover:bg-gray-600 text-white
//                        px-5 py-2 rounded-xl shadow-md transition
//                        disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Cancel
//           </button>

//           <button
//             type="button"
//             onClick={handleUploadValidRows}
//             disabled={uploading || validRows.length === 0}
//             className="bg-green-500 hover:bg-green-600 text-white
//                        px-5 py-2 rounded-xl shadow-md transition
//                        disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {uploading
//               ? "Uploading..."
//               : `Confirm Upload (${validRows.length})`}
//           </button>
//         </div>
//       </div>

//       <p className="text-sm text-gray-600 mb-3">
//         Total Excel Rows: {previewData.length}
//         {" | "}
//         Valid Rows: {validRows.length}
//         {" | "}
//         Invalid Rows: {invalidRowCount}
//         {" | "}
//         Showing {currentData.length} rows
//       </p>

//       {/* TABLE */}
//       <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
//         <table className="min-w-full text-sm text-gray-700">
//           <TableHeader
//             columns={[
//               ...displayColumns.map((column) => column.label || column.header),
//               ...(showErrorColumn ? ["Error"] : []),
//             ]}
//           />

//           <tbody className="divide-y">
//             {currentData.map((row, index) => {
//               const actualIndex = startIndex + index;

//               const rowErrors = rowsWithErrors[actualIndex]?.errors || [];

//               const isValidRow = rowErrors.length === 0;

//               return (
//                 <tr
//                   key={actualIndex}
//                   className={`hover:bg-gray-50 ${
//                     isValidRow ? "bg-white" : "bg-red-50"
//                   }`}
//                 >
//                   {displayColumns.map((column) => {
//                     const value = getCellValue(row, column.header);

//                     const displayValue =
//                       column.type === "date"
//                         ? formatDateToDDMONYYYY(value) || "-"
//                         : isEmptyValue(value)
//                           ? "-"
//                           : String(value);

//                     return (
//                       <td
//                         key={column.header}
//                         className="px-4 py-2 whitespace-nowrap"
//                       >
//                         {displayValue}
//                       </td>
//                     );
//                   })}

//                   {showErrorColumn && (
//                     <td className="px-4 py-2 whitespace-nowrap">
//                       {isValidRow ? (
//                         <span className="text-green-600 font-medium">
//                           Valid
//                         </span>
//                       ) : (
//                         <span className="text-red-600 font-medium">
//                           {rowErrors.join(", ")}
//                         </span>
//                       )}
//                     </td>
//                   )}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* PAGINATION */}
//       <div className="flex justify-between items-center mt-4">
//         <p className="text-sm text-gray-600">
//           Page {safePage} of {totalPages}
//         </p>

//         <div className="flex gap-2">
//           <button
//             type="button"
//             onClick={handlePrevious}
//             disabled={safePage <= 1}
//             className="px-4 py-2 bg-gray-200 rounded-lg
//                        hover:bg-gray-300 disabled:opacity-40
//                        disabled:cursor-not-allowed"
//           >
//             Previous
//           </button>

//           <button
//             type="button"
//             onClick={handleNext}
//             disabled={safePage >= totalPages}
//             className="px-4 py-2 bg-gray-200 rounded-lg
//                        hover:bg-gray-300 disabled:opacity-40
//                        disabled:cursor-not-allowed"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
