import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import {
  dateRangeToEpoch,
  formatDateTime,
} from "../../components/AnalyticsTable/exportUtils";

import Loader from "../Loader/Loader";
import {
  getActiveEmployees,
  // getEmployeeStats,
} from "../../redux/CompanySlices/companiesSlice";
 
import TableNew from "../../components/ui/table/TableNew";

/* ------------------ CONSTANTS ------------------ */
const PAGE_SIZE = 10;

/* ------------------ TABLE HEADINGS ------------------ */
const tableHeadings = [
  { label: "#", key: "index" },
  { label: "Employee", key: "employee", filterKey: "search" },
  { label: "Role", key: "role", filterKey: "search" },
  { label: "User ID", key: "user_id" },
  { label: "Joined On", key: "start_date", filterKey: "date" },
  { label: "Status", key: "status", filterKey: "status" },
  { label: "Verified", key: "verified", filterKey: "verified" },
];

/* ------------------ FILTER CONFIG ------------------ */
const employeeTableFilters = {
  search: {
    type: "search",
    apiKey: ["user_id.name", "profile_role_id.name"],
  },

  date: {
    type: "date",
    apiKey: "start_date",
  },

  status: {
    type: "dropdown",
    apiKey: "status",
    options: ["pending", "approved", "rejected"],
  },

  verified: {
    type: "dropdown",
    apiKey: "is_verified",
    options: ["true", "false"],
  },
};

/* ------------------ COMPONENT ------------------ */
const EmployeeManagement = () => {
  const dispatch = useDispatch();

 
  const companiesSelector = useSelector((state) => state.companies);
  console.log("companiesSelector", companiesSelector?.getActiveEmployeesData);
  const listData = companiesSelector?.getActiveEmployeesData?.data?.data?.users || [];

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});

  /* ------------------ QUERY BUILDER ------------------ */
  const buildFilterQuery = useCallback((filterKey, value) => {
    const config = employeeTableFilters?.[filterKey];
    if (!config || value == null) return {};

    switch (config.type) {
      case "search":
        return {
          $or: config.apiKey.map((key) => ({
            [key]: { $regex: value, $options: "i" },
          })),
        };

      case "date":
        return {
          [config.apiKey]: dateRangeToEpoch(value),
        };

      case "dropdown":
        return {
          [config.apiKey]:
            value === "true" ? true : value === "false" ? false : value,
        };

      default:
        return {};
    }
  }, []);

  /* ------------------ APPLY FILTER ------------------ */
  const onApplyFilter = useCallback(
    (filterKey, value) => {
      setAppliedFilters((prev) => ({
        ...prev,
        [filterKey]: value,
      }));

      setFilters((prev) => ({
        ...prev,
        ...buildFilterQuery(filterKey, value),
      }));

      setCurrentPage(1);
    },
    [buildFilterQuery],
  );

  /* ------------------ CLEAR FILTERS ------------------ */
  const onClearFilter = (key) => {
    setAppliedFilters((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });

    setFilters({});
    setCurrentPage(1);
  };

  const onClearAll = () => {
    setAppliedFilters({});
    setFilters({});
    setCurrentPage(1);
  };

  /* ------------------ FETCH EMPLOYEES ------------------ */
  const fetchEmployees = useCallback(
    async (page = 1) => {
      const apiPayload = {
        page,
        size: PAGE_SIZE,
        populate: "user_id:name profile_pic|profile_role_id:name",
        query: JSON.stringify(filters),
      };

      try {
        setIsLoading(true);
        await dispatch(getActiveEmployees(apiPayload)).unwrap();
      } catch (error) {
        toast.error(error?.message || "Failed to fetch employee list");
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, filters],
  );

  useEffect(() => {
    fetchEmployees(currentPage);
  }, [currentPage, fetchEmployees]);

  /* ------------------ FETCH STATS ------------------ */
  const fetchEmployeeStats = useCallback(async () => {
    try {
      // await dispatch(getEmployeeStats()).unwrap();
    } catch (error) {
      toast.error(error?.message || "Failed to fetch employee stats");
    }
  }, [dispatch]);

  useEffect(() => {
    fetchEmployees(currentPage);
    // fetchEmployeeStats();
  }, [currentPage]);

  /* ------------------ STATS DATA ------------------ */
  const statsData = useMemo(() => {
    // const stats = getEmployeeStatsData?.data?.data || {};
    const stats =  {};

    return [
      {
        title: "Total Active Employees",
        value: stats.totalActive ?? 0,
        icon: "/Img/analytic/total-employees.png",
      },
      {
        title: "Verified Employees",
        value: stats.verified ?? 0,
        icon: "/Img/analytic/verified.png",
      },
      {
        title: "Pending Verification",
        value: stats.pending ?? 0,
        icon: "/Img/analytic/pending.png",
      },
      {
        title: "Rejected Employees",
        value: stats.rejected ?? 0,
        icon: "/Img/analytic/rejected.png",
      },
    ];
  }, [/* getEmployeeStatsData */]);

  /* ------------------ TABLE ROWS ------------------ */
  const tableRows = useMemo(() => {
    return listData.map((item, index) => [
      index + 1,

      /* -------- Employee -------- */
      <span className="capitalize glassy-text-primary">
        {item?.user_id?.username || "N/A"}
      </span>,

      /* -------- Role -------- */
      <span className="capitalize">
        {item?.profile_role_id?.name || "-"}
      </span>,

      /* -------- User ID -------- */
      <span className="text-xs glassy-text-secondary">
        {item?.user_id?._id}
      </span>,

      /* -------- Joined On -------- */
      item?.start_date ? formatDateTime(item.start_date) : "-",

      /* -------- Status -------- */
      <span className="capitalize">{item?.status}</span>,

      /* -------- Verified -------- */
      <span
        className={`font-medium ${
          item?.is_verified ? "text-green-600" : "text-yellow-600"
        }`}
      >
        {item?.is_verified ? "Yes" : "No"}
      </span>,
    ]);
  }, [listData]);

  /* ------------------ PAGE CHANGE ------------------ */
  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  /* ------------------ JSX ------------------ */
  return (
    <>
      <Loader loading={isLoading} />

      <div className="p-4">
        {/* -------- STATS -------- */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
          {statsData.map((item, index) => (
            <div
              key={index}
              className="glassy-card p-5 rounded-xl flex items-center justify-between border"
            >
              <div>
                <p className="glassy-text-primary text-sm">{item.title}</p>
                <p className="text-2xl font-semibold mt-1 glassy-text-secondary">
                  {item.value}
                </p>
              </div>

              <img src={item.icon} alt="" className="w-10 h-10" />
            </div>
          ))}
        </div> */}

        {/* -------- TITLE -------- */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold glassy-text-primary">
            Employee Management
          </h2>
        </div>

        {/* -------- TABLE -------- */}
        <TableNew
          tableHeadings={tableHeadings}
          data={tableRows}
          userTablefilter={employeeTableFilters}
          onApplyFilter={onApplyFilter}
          onClearFilter={onClearFilter}
          onClearAll={onClearAll}
          appliedFilters={appliedFilters}
          isLoading={isLoading}
          totalItems={listData?.length || 0}
          size={PAGE_SIZE}
          pageNo={currentPage}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
};

export default EmployeeManagement;
