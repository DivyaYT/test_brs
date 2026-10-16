import * as XLSX from "xlsx";

export function readExcel(file: ArrayBuffer) {
  const workbook = XLSX.read(file, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet);
}
