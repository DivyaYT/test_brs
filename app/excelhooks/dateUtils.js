// excelhooks/dateUtils.js

export const DATE_FORMAT = "DD-MON-YYYY";

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const pad = (value) => String(value).padStart(2, "0");

export const formatDateToDDMONYYYY = (value) => {
  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  ) {
    return "";
  }

  let date;

  if (value instanceof Date) {
    date = value;
  } else {
    date = new Date(value);
  }

  if (isNaN(date.getTime())) {
    return String(value);
  }

  const day = pad(date.getDate());
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};