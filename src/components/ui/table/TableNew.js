 
import React, { useState } from "react";
import SearchFilter from "./Filters/SearchFilter";
import DateRangeFilter from "./Filters/DateRangeFilter";
import TimeFilter from "./Filters/TimeFilter";
import DropdownFilter from "./Filters/DropdownFilter";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Pagination from "../../Pagination/Pagination";
import { IconCalendarDot, IconSelector } from "@tabler/icons-react";


const normalizeCell = (cell) => {
  if (cell == null) return "";

  if (typeof cell === "string" || typeof cell === "number") return cell;

  if (Array.isArray(cell)) return cell.join(", ");

  if (typeof cell === "object" && cell?.props?.children) {
    const children = cell.props.children;
    return Array.isArray(children) ? children.join(" ") : children;
  }

  return String(cell);
};

const exportExcel = (tableHeadings, data) => {
  const { headers, rows } = getExportData(tableHeadings, data);

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  XLSX.writeFile(workbook, `table_export_${Date.now()}.xlsx`);
};

const exportPDF = (tableHeadings, data) => {
  const doc = new jsPDF("l", "pt", "a4");

  const headers = tableHeadings.map((h) => h.label);
  const rows = data.map((row) =>
    row.map((cell) => normalizeCell(cell))
  );

  doc.text("Exported Table Data", 40, 30);

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 50,
    styles: { fontSize: 8 },
  });

  doc.save(`table_export_${Date.now()}.pdf`);
};

const getExportData = (tableHeadings, data) => {
  const headers = tableHeadings.map((h) => h.label);

  const rows = data.map((row) =>
    row.map((cell) => normalizeCell(cell))
  );

  return { headers, rows };
};
const exportCSV = (tableHeadings, data) => {
  const { headers, rows } = getExportData(tableHeadings, data);

  const csvContent = [
    headers.join(","),
    ...rows.map((r) => r.map((v) => `"${v}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `table_export_${Date.now()}.csv`);
};

/* ---------------- SKELETON ---------------- */

const TableSkeletonLoader = ({ columns = 5, rows = 10 }) => (
  <div className="animate-pulse">
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex -b">
        {Array.from({ length: columns }).map((_, c) => (
          <div key={c} className="flex-1 p-4">
            <div className="h-4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    ))}
  </div>
);

/* ---------------- NO DATA ---------------- */

const NoData = ({ message = "No Data found" }) => (
  <div className="py-12 text-center glassy-text-[rimary">{message}</div>
);

/* ---------------- FILTER VALUE FORMATTER ---------------- */

const renderFilterValue = (value) => {
  if (value == null) return "-";

  // Date range { from, to }
  if (typeof value === "object" && value?.from && value?.to) {
    return `${new Date(value.from).toLocaleDateString()} - ${new Date(
      value.to
    ).toLocaleDateString()}`;
  }

  // Time filter (timestamp)
  if (typeof value === "number") {
    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Multi select
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  // String / dropdown
  return String(value);
};

const getDateRangeByType = (type) => {
  const now = new Date();
  const end = now.getTime();

  let start;

  switch (type) {
    case "1D": // last 1 day
      start = new Date(end - 1 * 24 * 60 * 60 * 1000).getTime();
      break;

    case "7D": // last 7 days
    case "1W":
      start = new Date(end - 7 * 24 * 60 * 60 * 1000).getTime();
      break;

    case "15D": // last 15 days
      start = new Date(end - 15 * 24 * 60 * 60 * 1000).getTime();
      break;

    case "30D":
    case "1M": // last 1 month (approx)
      start = new Date(end - 30 * 24 * 60 * 60 * 1000).getTime();
      break;

    case "3M": // last 3 months
      start = new Date(end - 90 * 24 * 60 * 60 * 1000).getTime();
      break;

    case "6M": // last 6 months
      start = new Date(end - 180 * 24 * 60 * 60 * 1000).getTime();
      break;

    case "1Y": // last 1 year
      start = new Date(end - 365 * 24 * 60 * 60 * 1000).getTime();
      break;

    case "TODAY":
      start = new Date().setHours(0, 0, 0, 0);
      break;

    case "YESTERDAY": {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      start = d.setHours(0, 0, 0, 0);
      return {
        from: start,
        to: start + 24 * 60 * 60 * 1000 - 1,
      };
    }

    default:
      return null;
  }

  return { from: start, to: end };
};

/* ---------------- TABLE ---------------- */

const TableNew = ({
  tableHeadings = [],
  data = [],
  userTablefilter = {},
  onApplyFilter,
  onClearFilter,
  onClearAll,
  appliedFilters = {},
  isLoading = false,
  totalItems = 0,
  size = 10,
  pageNo = 1,
  onPageChange,
  emptyMessage = "No Data found",
  quickDateFilterKey = "date", // 👈 DEFAULT
}) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeQuickRange, setActiveQuickRange] = useState(null);

  const toggleFilter = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const renderFilter = (heading) => {
    const filterKey = heading?.filterKey;
    if (!filterKey) return null;

    const config = userTablefilter?.[filterKey];
    if (!config) return null;

    const onApply = (value) => {
      setActiveQuickRange(null); // 🔥 reset quick filter
      onApplyFilter?.(filterKey, value);
      setOpenIndex(null);
    };

    switch (config.type) {
      case "search":
        return <SearchFilter onApply={onApply} />;

      case "date":
        return <DateRangeFilter onApply={onApply} />;

      case "time":
        return <TimeFilter onApply={onApply} />;

      case "dropdown":
        return (
          <DropdownFilter options={config.options || []} onApply={onApply} />
        );

      case "dropdown-multi":
        return (
          <DropdownFilter
            options={config.options || []}
            multi
            onApply={onApply}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-3 gap-2">
        
        <button
          onClick={() => exportCSV(tableHeadings, data)}
          className="px-3 py-1  rounded text-sm button glassy-text-primary glassy-button "
        >
          CSV
        </button>

        <button
          onClick={() => exportExcel(tableHeadings, data)}
          className="px-3 py-1  rounded text-sm button glassy-text-primary glassy-button  "
        >
          Excel
        </button>

        <button
          onClick={() => exportPDF(tableHeadings, data)}
          className="px-3 py-1  rounded text-sm button glassy-text-primary  glassy-button "
        >
          PDF
        </button>
      </div>

      {/* -------- Quick Date Filters -------- */}
      <div className="flex justify-end items-center mb-3">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveQuickRange(null);
              onClearFilter?.(quickDateFilterKey);
            }}
            className="px-3 py-1 glassy-text-primary  rounded text-sm glassy-button " 
          >
            All
          </button>

          {["1D", "1W", "1M"].map((type) => (
            <button
              key={type}
              onClick={() => {
                setActiveQuickRange(type);
                onApplyFilter?.(quickDateFilterKey, getDateRangeByType(type));
              }}
              className={`px-3 py-1 rounded text-sm  glassy-text-primary
      ${
        activeQuickRange === type
          ? "glassy-text-primary  glassy-button  "
          : ""
      }`}
            >
              {type}
            </button>
          ))}

          {/* Calendar (opens column filter) */}
          <button
            onClick={() =>
              setOpenIndex(
                tableHeadings.findIndex(
                  (h) => h.filterKey === quickDateFilterKey
                )
              )
            }
            className="px-3 py-1  rounded"
          >
            <IconCalendarDot size={18} />
          </button>
        </div>
      </div>

      {/* -------- Applied Filters -------- */}
      {Object.keys(appliedFilters || {}).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(appliedFilters).map(([key, value]) => (
            <span
              key={key}
              className="px-3 py-1 text-xs glassy-card glassy-text-primary rounded-full cursor-pointer"
              onClick={() => onClearFilter?.(key)}
            >
              {key}: {renderFilterValue(value)} ✕
            </span>
          ))}

          <button
            onClick={onClearAll}
            className="text-xs text-red-600 underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* -------- Table -------- */}
      <div className="hidden lg:block  rounded-md overflow-x-auto">
        {isLoading ? (
          <TableSkeletonLoader columns={tableHeadings.length} rows={size} />
        ) : (
          <table className="w-full text-sm glassy-card">
            <thead className="glassy-card -b">
              <tr>
                {tableHeadings.map((heading, index) => (
                  <th
                    key={heading?.key || index}
                    className="relative px-4 py-2 text-left font-semibold cursor-pointer glassy-text-primary"
                    onClick={() => toggleFilter(index)}
                  >
                    <div className="flex justify-between items-center capitalize glassy-text-primary">
                      {heading.label}
                      {heading.filterKey && <IconSelector size={18} />}
                    </div>

                    {openIndex === index && (
                      <div
                        className="absolute z-20 mt-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {renderFilter(heading)}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data?.length ? (
                data.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="-t  glassy-text-primary capitalize"
                  >
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-4 py-3">
                        {cell ?? "-"}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={tableHeadings.length}
                    className="py-10 text-center"
                  >
                    <NoData message={emptyMessage} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* -------- Pagination -------- */}
      {totalItems > size && (
        <div className="flex justify-center mt-4">
          <Pagination
            totalPages={Math.ceil(totalItems / size)}
            currentPage={pageNo}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default TableNew;
