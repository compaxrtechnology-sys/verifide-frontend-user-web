import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import moment from "moment";
export const exportToExcel = (data, filename = "analytics.xlsx") => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buf], { type: "application/octet-stream" });
  saveAs(blob, filename);
};



/* ---------------- DATE → EPOCH ---------------- */

export const dateRangeToEpoch = ({ from, to }) => {
  if (!from || !to) return {};

  return {
    $gte: moment(from).startOf("day").valueOf(),
    $lte: moment(to).endOf("day").valueOf(),
  };
};

/* ---------------- TIME → EPOCH ---------------- */
// expects HH:mm (from TimeFilter)
export const timeToEpoch = (time) => {
  if (!time) return null;

  const [hour, minute] = time.split(":").map(Number);
  return moment()
    .hour(hour)
    .minute(minute)
    .second(0)
    .millisecond(0)
    .valueOf();
};

/* ---------------- DISPLAY DATE + TIME ---------------- */

export const formatDateTime = (
  ts,
  timezone = "Asia/Kolkata"
) => {
  if (!ts) return "-";

  return new Date(ts).toLocaleString("en-IN", {
    timeZone: timezone,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/* ---------------- DISPLAY DATE ONLY ---------------- */

export const formatDate = (ts, timezone = "Asia/Kolkata") => {
  if (!ts) return "-";

  return new Date(ts).toLocaleDateString("en-IN", {
    timeZone: timezone,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatHeadquarters = (hq) => {
  if (!hq) return "N/A";

  const parts = [
    hq?.address_line_1,
    hq?.address_line_2,
    hq?.city?.name,
    hq?.state?.name,
    hq?.country?.name,
    hq?.pin_code,
  ];

  return parts.filter(Boolean).join(", ");
};

