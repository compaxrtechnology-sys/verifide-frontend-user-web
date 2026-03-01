import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import Loader from "../Loader/Loader";
import TableNew from "../../components/ui/table/TableNew";
import { getActiveStudentsforjob } from "../../redux/CompanySlices/companiesSlice";

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
  { label: "Company Jobs", key: "no_of_company_jobs" },
  { label: "Jobs Applied", key: "no_of_jobs_applied" },
  { label: "Shortlisted", key: "shortlisted_count" },
  { label: "Interviews", key: "scheduled_interviews" },
  { label: "Selected", key: "selected_count" },
  { label: "Selected Companies", key: "company_selected_name" },
];

/* ------------------ FILTER CONFIG ------------------ */
const studentFilters = {
  search: {
    type: "search",
    apiKey: ["student_name", "email"],
  },
};

/* ------------------ COMPONENT ------------------ */
const JobActiveStudentsAnalytics = ({  }) => {
  const dispatch = useDispatch();
  const companiesSelector = useSelector((state) => state.companies);

  /* ------------------ API DATA ------------------ */
  const apiResponse =
    companiesSelector?.getActiveStudentsforjobData?.data?.data || {};

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
      await dispatch(getActiveStudentsforjob()).unwrap();
    } catch (error) {
      toast.error(error?.message || "Failed to fetch job students");
    } finally {
      setIsLoading(false);
    }
  }, [dispatch ]);

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

      student?.no_of_company_jobs ?? 0,
      student?.no_of_jobs_applied ?? 0,
      student?.shortlisted_count ?? 0,
      student?.scheduled_interviews ?? 0,
      student?.selected_count ?? 0,

      student?.company_selected_name?.length
        ? student.company_selected_name.join(", ")
        : "-",
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
      title: "Total Jobs",
      value: summary?.total_jobs ?? 0,
    },
    {
      title: "Total Shortlisted",
      value: summary?.total_shortlisted ?? 0,
    },
    {
      title: "Interviews Scheduled",
      value: summary?.total_interview_scheduled ?? 0,
    },
    {
      title: "Total Selected",
      value: summary?.total_selected ?? 0,
    },
  ];

  /* ------------------ JSX ------------------ */
  return (
    <>
      <Loader loading={isLoading} />

      <div className="p-4">

        {/* -------- STATS -------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
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
            Job Active Students Analytics
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

export default JobActiveStudentsAnalytics;
