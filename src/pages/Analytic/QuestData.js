import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import Loader from "../Loader/Loader";
import TableNew from "../../components/ui/table/TableNew";
import {
  dateRangeToEpoch,
  formatDateTime,
} from "../../components/AnalyticsTable/exportUtils";

import {
  getQuestListForAnalytic,
  getQuestStats,
} from "../../redux/Global Slice/cscSlice";

/* ------------------ CONSTANTS ------------------ */
const PAGE_SIZE = 10;

/* ------------------ TABLE HEADINGS ------------------ */
const tableHeadings = [
  { label: "#", key: "index" },
  { label: "Quest Name", key: "title", filterKey: "search" },
  // { label: "Creator", key: "creator", filterKey: "search" },
  { label: "Quest ID", key: "_id" },
  { label: "Posted On", key: "createdAt", filterKey: "date" },
  {
    label: "Total Applicants",
    key: "engagement_count",
    filterKey: "engagement_count",
  },
  {
    label: "Completed",
    key: "completed_count",
    filterKey: "completed_count",
  },
  { label: "Success Rate %", key: "success_rate" },
];

/* ------------------ FILTER CONFIG ------------------ */
const questTableFilters = {
  search: {
    type: "search",
    apiKey: ["title", "created_by.username", "created_by.email"],
  },

  date: {
    type: "date",
    apiKey: "createdAt",
  },

  engagement_count: {
    type: "dropdown",
    apiKey: "engagement_count",
    options: ["0-5", "5-10", "10-20", "20-50", "50+"],
  },

  completed_count: {
    type: "dropdown",
    apiKey: "completed_count",
    options: ["0-5", "5-10", "10-20", "20-50", "50+"],
  },
};

/* ------------------ COMPONENT ------------------ */
const QuestManagement = () => {
  const dispatch = useDispatch();

  const {
    getquestforAnalyticData: { data: questsData } = {},
    getQuestStatsData,
  } = useSelector((state) => state.global);
  console.log("questsData", questsData);
  const listData = questsData?.data?.list || [];

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  /* ------------------ QUERY BUILDER ------------------ */
  const buildFilterQuery = useCallback((filterKey, value) => {
    const config = questTableFilters?.[filterKey];
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

  /* ------------------ FETCH QUEST LIST ------------------ */
  const fetchQuestList = useCallback(
    async (page = 1) => {
      const apiPayload = {
        page,
        size: PAGE_SIZE,
        populate: "created_by:username email",

        select:
          "title created_by quest_no startDate engagement_count creation_path createdAt",
        searchFields: "title created_by.username created_by.email",
        keyWord: searchTerm,

        query: JSON.stringify(filters),
      };

      try {
        setIsLoading(true);
        await dispatch(getQuestListForAnalytic(apiPayload)).unwrap();
      } catch (error) {
        toast.error(error?.message || "Failed to fetch quests");
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, filters, searchTerm],
  );

  /* ------------------ FETCH QUEST STATS ------------------ */
  const fetchQuestStats = useCallback(async () => {
    try {
      await dispatch(getQuestStats()).unwrap();
    } catch (error) {
      toast.error(error?.message || "Failed to fetch quest stats");
    }
  }, [dispatch]);

  useEffect(() => {
    fetchQuestList(currentPage);
    fetchQuestStats();
  }, [currentPage, filters]);

  /* ------------------ STATS DATA ------------------ */
  const statsData = useMemo(() => {
    const stats = getQuestStatsData?.data?.data || {};

    return [
      {
        title: "Total Quests Posted",
        value: stats.totalQuests ?? 0,
        icon: "/Img/analytic/total-jobs-posted.png",
      },
      {
        title: "Total Applicants",
        value: stats.totalApplicants ?? 0,
        icon: "/Img/analytic/total-applicants.png",
      },
      {
        title: "Avg Applicant / Quest",
        value: stats.avgApplicants ?? "0.00",
        icon: "/Img/analytic/avg-applicant.png",
      },
      {
        title: "Success Rate (%)",
        value: `${stats.successRate ?? 0}%`,
        icon: "/Img/analytic/success-rate.png",
      },
    ];
  }, [getQuestStatsData]);

  /* ------------------ TABLE ROWS ------------------ */
 
  const tableRows = useMemo(() => {
    return listData.map((item, index) => {
      const successRate = item?.successRate ?? 0;
      const creator = item?.created_by;

      return [
        index + 1,

        /* Quest Name */
        <span className="capitalize">{item?.title || "-"}</span>,

        // /* Creator */
        // creator ? (
        //   <div className="flex flex-col">
        //     <span className="font-medium capitalize">
        //       {creator?.username || "-"}
        //     </span>
        //     <span className="text-xs text-gray-500">
        //       {creator?.email || ""}
        //     </span>
        //   </div>
        // ) : (
        //   "-"
        // ),

        /* Quest ID */
        <span className="text-xs text-gray-500">{item?._id}</span>,

        /* Posted On */
        item?.createdAt ? formatDateTime(item.createdAt) : "-",

        /* Counts */
        item?.engagement_count ?? 0,
        item?.completed_count ?? 0,

        /* Success Rate */
        <span
          className={`font-medium ${
            successRate >= 50 ? "text-green-600" : "text-yellow-600"
          }`}
        >
          {successRate}%
        </span>,
      ];
    });
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
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
        </div>

        {/* -------- TITLE -------- */}
        <h2 className="text-2xl font-semibold glassy-text-primary mb-4">
          Quest Management
        </h2>

        {/* -------- TABLE -------- */}
        <TableNew
          tableHeadings={tableHeadings}
          data={tableRows}
          userTablefilter={questTableFilters}
          onApplyFilter={onApplyFilter}
          onClearFilter={onClearFilter}
          onClearAll={onClearAll}
          appliedFilters={appliedFilters}
          isLoading={isLoading}
          totalItems={questsData?.data?.total || 0}
          size={PAGE_SIZE}
          pageNo={currentPage}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
};

export default QuestManagement;
