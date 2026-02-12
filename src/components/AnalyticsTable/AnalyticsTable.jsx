import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button, Tag } from "antd";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import { exportToExcel } from "./exportUtils";
import moment from "moment";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AnalyticsTable = ({
  module,
  columns,
  data = [],
  total = 0,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  onFilterChange,
  chartConfig = null,
  missingFieldsKey = null,
  showExport = true,
}) => {
  console.log("AnalyticsTable data:", data);
  const [gridApi, setGridApi] = useState(null);

  // Full AG Grid Column Definitions
  const columnDefs = useMemo(() => {
    return columns.map((col) => {
      const def = {
        headerName: col.title,
        field: col.dataIndex,
        sortable: col.sorter || false,
        filter: false, // will be set below
        floatingFilter: true,
        resizable: true,
        cellRenderer: (params) => {
          const value = params.value;
          if (col.dataIndex === missingFieldsKey) {
            return (
              <>
                {(value || []).map((f) => (
                  <Tag key={f} color="red">
                    {f}
                  </Tag>
                ))}
              </>
            );
          }

          // Profile Completion Circle
          if (col.dataIndex === "profile_completion_percentage") {
            const p = Number(value) || 0;
            const color = p < 50 ? "#A1BEFF" : p < 80 ? "#217AFF" : "#0066FF";
            return (
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  border: `2px solid ${color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  color,
                }}
              >
                {p}%
              </div>
            );
          }

          // Date Formatting
          if (col.filterType === "dateRange" && value) {
            return moment(value).format("YYYY-MM-DD");
          }

          return value ?? "-";
        },
      };

      // Set AG Grid Filters
      if (col.filterType === "text") def.filter = "agTextColumnFilter";
      if (col.filterType === "select" || col.filterType === "countRange")
        def.filter = "agSetColumnFilter";
      if (col.filterType === "dateRange") def.filter = "agDateColumnFilter";

      return def;
    });
  }, [columns, missingFieldsKey]);
  console.log("Column Definitions:", columnDefs);
  // Chart Data
  const chartData = useMemo(() => {
    if (!chartConfig || data.length === 0) return [];
    const stats = {};
    chartConfig.ranges.forEach((r) => (stats[r.label] = 0));
    data.forEach((item) => {
      const value = item[chartConfig.key] || 0;
      const range =
        chartConfig.ranges.find((r) => value >= r.min && value < r.max) ||
        chartConfig.ranges.slice(-1)[0];
      stats[range.label]++;
    });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [chartConfig, data]);

  // Excel Export
  const handleExport = () => {
    exportToExcel(data, `${module}.xlsx`);
  };

  // Pagination Callback
  const onPaginationChanged = () => {
    if (!gridApi) return;
    const current = gridApi.paginationGetCurrentPage() + 1;
    const size = gridApi.paginationGetPageSize();
    if (onPageChange) onPageChange(current, size);
  };

  return (
    <div>
      {/* Chart */}
      {chartData.length > 0 && (
        <PieChart width={300} height={200} style={{ marginBottom: 16 }}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={60}
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      )}

      {/* Export Button */}
      {showExport && (
        <Button onClick={handleExport} style={{ marginBottom: 16 }}>
          Export Excel
        </Button>
      )}

      {/* AG Grid Table */}
      <div className="ag-theme-alpine" style={{ width: "100%", height: 500 }}>
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
          rowSelection="single"
          pagination={true}
          paginationPageSize={pageSize}
          onGridReady={(params) => setGridApi(params.api)}
          onPaginationChanged={onPaginationChanged}
          animateRows={true}
          defaultColDef={{
            filter: true,
            floatingFilter: true,
            sortable: true,
            resizable: true,
          }}
        />
      </div>
    </div>
  );
};

export default AnalyticsTable;
