import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import Loader from "../Loader/Loader";
import TableNew from "../../components/ui/table/TableNew";
import { getActiveStudents } from "../../redux/CompanySlices/companiesSlice";

/* ------------------ CONSTANTS ------------------ */
const PAGE_SIZE = 10;

/* ------------------ TABLE HEADINGS ------------------ */
const tableHeadings = [
  { label: "#", key: "index" },
  { label: "Student Name", key: "student_name", filterKey: "search" },
  { label: "Email", key: "email" },
  { label: "Phone", key: "phone_number" },
  { label: "Degree", key: "degree" },
  { label: "Field of Study", key: "field_of_study" },
  { label: "Skills", key: "skills" },
  { label: "Certifications", key: "certifications_count" },
  { label: "Projects", key: "project_count" },
  { label: "Jobs Passed", key: "job_count" },
  { label: "Profile Score", key: "profile_score" },
];

/* ------------------ FILTER CONFIG ------------------ */
const studentFilters = {
  search: {
    type: "search",
    apiKey: ["student_name", "email"],
  },
};

/* ------------------ COMPONENT ------------------ */
const InstitutionStudentsAnalytics = () => {
  const dispatch = useDispatch();
  const companiesSelector = useSelector((state) => state.companies);
  console.log("companiesSelector", companiesSelector?.getActiveStudentsData);
 

  /* ------------------ API DATA ------------------ */
  const apiResponse =
    companiesSelector?.getActiveStudentsData?.data?.data || {};

  const studentsList = apiResponse?.students || [];
  const summary = apiResponse?.summary || {};

  /* ------------------ STATES ------------------ */
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});

  /* ------------------ FILTER BUILDER ------------------ */
  const buildFilterQuery = useCallback((filterKey, value) => {
    const config = studentFilters?.[filterKey];
    if (!config || !value) return {};

    if (config.type === "search") {
      return {
        $or: config.apiKey.map((key) => ({
          [key]: { $regex: value, $options: "i" },
        })),
      };
    }

    return {};
  }, []);

  /* ------------------ APPLY FILTER ------------------ */
  const onApplyFilter = useCallback(
    (filterKey, value) => {
      setAppliedFilters((prev) => ({
        ...prev,
        [filterKey]: value,
      }));

      setFilters(buildFilterQuery(filterKey, value));
      setCurrentPage(1);
    },
    [buildFilterQuery]
  );

  /* ------------------ CLEAR FILTER ------------------ */
  const onClearFilter = () => {
    setAppliedFilters({});
    setFilters({});
    setCurrentPage(1);
  };

  /* ------------------ FETCH STUDENTS ------------------ */
  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      await dispatch(getActiveStudents()).unwrap();
    } catch (error) {
      toast.error(error?.message || "Failed to fetch students analytics");
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  /* ------------------ PAGINATED DATA ------------------ */
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return studentsList.slice(start, end);
  }, [studentsList, currentPage]);

  /* ------------------ TABLE ROWS ------------------ */
  const tableRows = useMemo(() => {
    return paginatedData.map((student, index) => [
      (currentPage - 1) * PAGE_SIZE + index + 1,

      student?.student_name || "-",

      student?.email || "-",

      student?.phone_number || "-",

      student?.degree || "-",

      student?.field_of_study || "-",

      student?.skills?.length
        ? student.skills.join(", ")
        : "-",

      student?.certifications_count ?? 0,

      student?.project_count ?? 0,

      student?.job_count ?? 0,

      <span
        className={`font-medium ${
          student?.profile_score >= 70
            ? "text-green-600"
            : student?.profile_score >= 40
            ? "text-yellow-600"
            : "text-red-600"
        }`}
      >
        {student?.profile_score ?? 0}%
      </span>,
    ]);
  }, [paginatedData, currentPage]);

  /* ------------------ PAGE CHANGE ------------------ */
  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  /* ------------------ STATS CARDS ------------------ */
  const statsData = [
    {
      title: "Total Students",
      value: summary?.total_students ?? 0,
    },
    {
      title: "Total Certifications",
      value: summary?.total_certifications ?? 0,
    },
    {
      title: "Total Projects",
      value: summary?.total_projects ?? 0,
    },
    {
      title: "Total Jobs Passed",
      value: summary?.total_jobs ?? 0,
    },
  ];

  /* ------------------ JSX ------------------ */
  return (
    <>
      <Loader loading={isLoading} />

      <div className="p-4">

        {/* -------- STATS -------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {statsData.map((item, index) => (
            <div
              key={index}
              className="glassy-card p-5 rounded-xl border"
            >
              <p className="text-sm glassy-text-primary">{item.title}</p>
              <p className="text-2xl font-semibold mt-2 glassy-text-secondary">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* -------- TITLE -------- */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold glassy-text-primary">
            Institution Students Analytics
          </h2>
        </div>

        {/* -------- TABLE -------- */}
        <TableNew
          tableHeadings={tableHeadings}
          data={tableRows}
          userTablefilter={studentFilters}
          onApplyFilter={onApplyFilter}
          onClearFilter={onClearFilter}
          appliedFilters={appliedFilters}
          isLoading={isLoading}
          totalItems={studentsList.length}
          size={PAGE_SIZE}
          pageNo={currentPage}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
};

export default InstitutionStudentsAnalytics;
