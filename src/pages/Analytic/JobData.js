import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
 

import {
  dateRangeToEpoch,
  formatDateTime,
} from "../../components/AnalyticsTable/exportUtils";
import Loader from "../Loader/Loader";
import { getJobList, getJobStats } from "../../redux/Global Slice/cscSlice";
import TableNew from "../../components/ui/table/TableNew";

/* ------------------ CONSTANTS ------------------ */
const PAGE_SIZE = 10;

/* ------------------ TABLE HEADINGS ------------------ */
const tableHeadings = [
  { label: "#", key: "index" },
  { label: "Company", key: "company", filterKey: "search" },
  { label: "Job Name", key: "name", filterKey: "search" },
  { label: "Job ID", key: "_id" },
  { label: "Job Posted On", key: "createdAt", filterKey: "date" },
  {
    label: "Total Applicant",
    key: "total_applicant",
    filterKey: "total_applicant",
  },
  {
    label: "Total Shortlisted",
    key: "total_shortlisted",
    filterKey: "total_shortlisted",
  },
  {
    label: "Total Approved",
    key: "total_approved",
    filterKey: "total_approved",
  },
  { label: "Success Rate %", key: "success_rate" },
];

/* ------------------ FILTER CONFIG ------------------ */
const jobTableFilters = {
  search: {
    type: "search",
    apiKey: ["name", "company_id.name", "company_id.display_name"],
  },

  date: {
    type: "date",
    apiKey: "createdAt",
  },

  total_applicant: {
    type: "dropdown",
    apiKey: "total_applicant",
    options: ["0-5", "5-10", "10-20", "20-50", "50+"],
  },

  total_shortlisted: {
    type: "dropdown",
    apiKey: "total_shortlisted",
    options: ["0-5", "5-10", "10-20", "20-50", "50+"],
  },

  total_approved: {
    type: "dropdown",
    apiKey: "total_approved",
    options: ["0-5", "5-10", "10-20", "20-50", "50+"],
  },
};

/* ------------------ COMPONENT ------------------ */
const JobManagement = () => {
  const dispatch = useDispatch();

  const { getJobListData: { data: jobsData } = {}, getJobStatsData } =
    useSelector((state) => state.global);
  console.log("jobdata", jobsData);

  const listData = jobsData?.data?.list;
  console.log("listdata", listData);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  /* ------------------ QUERY BUILDER ------------------ */
  const buildFilterQuery = useCallback((filterKey, value) => {
    const config = jobTableFilters?.[filterKey];
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

      case "dropdown": {
        const [minRaw, maxRaw] = value.split("-");
        const min = Number(minRaw);
        const max = maxRaw === "+" ? undefined : Number(maxRaw);

        return {
          [config.apiKey]: {
            $gte: min,
            ...(max !== undefined && { $lte: max }),
          },
        };
      }

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

  /* ------------------ FETCH API ------------------ */
  const fetchJobList = useCallback(
    async (page = 1) => {
      const apiPayload = {
        page,
        size: PAGE_SIZE,
        populate: "company_id:name display_name|job_title:name",
        searchFields: "name",
        keyWord: searchTerm,
        query: JSON.stringify(filters),
      };

      try {
        setIsLoading(true);
        await dispatch(getJobList(apiPayload)).unwrap();
      } catch (error) {
        toast.error(error?.message || "Failed to fetch jobs list");
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, filters, searchTerm],
  );

  useEffect(() => {
    fetchJobList(currentPage);
  }, [currentPage, fetchJobList]);
  /* ------------------ FETCH STATS ------------------ */
  const fetchJobStats = useCallback(async () => {
    try {
      await dispatch(getJobStats()).unwrap();
    } catch (error) {
      toast.error(error?.message || "Failed to fetch job stats");
    }
  }, [dispatch]);

  useEffect(() => {
    fetchJobList(currentPage);
    fetchJobStats();
  }, [currentPage]);

  /* ------------------ STATS DATA (DYNAMIC) ------------------ */
  const statsData = useMemo(() => {
    const stats = getJobStatsData?.data?.data || {};

    return [
      {
        title: "Total Jobs Posted",
        value: stats.totalJobs ?? 0,
        icon: "/Img/analytic/total-jobs-posted.png",
      },
      {
        title: "Total Applicants",
        value: stats.totalApplicants ?? 0,
        icon: "/Img/analytic/total-applicants.png",
      },
      {
        title: "Avg Applicant / Job",
        value: stats.avgApplicantsPerJob ?? "0",
        icon: "/Img/analytic/avg-applicant.png",
      },
      {
        title: "Total Shortlisted",
        value: stats.totalShortlisted ?? 0,
        icon: "/Img/analytic/total-shortlisted.png",
      },
      {
        title: "Total Rejected",
        value: stats.totalRejected ?? 0,
        icon: "/Img/analytic/total-rejected.png",
      },
      {
        title: "Success Rate (%)",
        value: `${stats.successRate ?? 0}%`,
        icon: "/Img/analytic/success-rate.png",
      },
    ];
  }, [getJobStatsData]);
  /* ------------------ TABLE ROWS ------------------ */
  const tableRows = useMemo(() => {
    return (
      listData?.map((item, index) => {
        const successRate = item?.successRate;
        return [
          index + 1,

          /* -------- Company -------- */
          <span className="capitalize">
            {item?.company_id?.display_name || item?.company_id?.name || "N/A"}
          </span>,

          /* -------- Job Name -------- */
          <span className="capitalize">{item?.job_title?.name || "-"}</span>,

          /* -------- Job ID -------- */
          <span className="text-xs glassy-text-primary">{item?._id}</span>,

          /* -------- Posted Date -------- */
          item?.createdAt ? formatDateTime(item.createdAt) : "-",

          /* -------- Counts -------- */
          item?.totalApplicants ?? 0,
          item?.totalShortlisted ?? 0,
          item?.totalApproved ?? 0,

          /* -------- Success Rate -------- */
          <span
            className={`font-medium ${
              successRate >= 50 ? "text-green-600" : "text-yellow-600"
            }`}
          >
            {successRate}%
          </span>,
        ];
      }) || []
    );
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
          {statsData.map((item, index) => (
            <div
              key={index}
              className="glassy-card p-5 rounded-xl  flex items-center justify-between border"
            >
              <div>
                <p className="glassy-text-primary text-sm">{item.title}</p>
                <p className="text-2xl font-semibold mt-1 glassy-text-secondary">{item.value}</p>
              </div>

              <div className=" flex items-center justify-center rounded-full glassy-text-primary">
                <img src={item.icon} alt="" className="w-10 h-10 glassy-text-primary" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold glassy-text-primary">
            Job Management
          </h2>
        </div>

        <TableNew
          tableHeadings={tableHeadings}
          data={tableRows}
          userTablefilter={jobTableFilters}
          onApplyFilter={onApplyFilter}
          onClearFilter={onClearFilter}
          onClearAll={onClearAll}
          appliedFilters={appliedFilters}
          isLoading={isLoading}
          totalItems={jobsData?.data?.total || 0}
          size={PAGE_SIZE}
          pageNo={currentPage}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
};

export default JobManagement;
