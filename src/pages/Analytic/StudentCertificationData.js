import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import Loader from "../Loader/Loader";
import TableNew from "../../components/ui/table/TableNew";
import { getInstitutionStudentsCertificationAnalytics } from "../../redux/CompanySlices/companiesSlice";

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
  { label: "Certifications", key: "certifications_count" },
  { label: "Skills", key: "skills" },
];

/* ------------------ FILTER CONFIG ------------------ */
const studentFilters = {
  search: {
    type: "search",
    apiKey: ["student_name", "email"],
  },
};

/* ------------------ COMPONENT ------------------ */
const StudentCertificationAnalytics = () => {
  const dispatch = useDispatch();
  const companiesSelector = useSelector((state) => state.companies);

  /* ------------------ API DATA ------------------ */
  const apiResponse =
    companiesSelector
      ?.getInstitutionStudentsCertificationAnalyticsData
      ?.data?.data || {};

  const summary = apiResponse?.summary || {};
  const studentsList = apiResponse?.students || [];
  const departmentWiseMonthly = apiResponse?.department_wise_monthly || [];

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

  /* ------------------ FETCH DATA ------------------ */
  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      await dispatch(
        getInstitutionStudentsCertificationAnalytics()
      ).unwrap();
    } catch (error) {
      toast.error(error?.message || "Failed to fetch certification analytics");
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics,filters]);

  /* ------------------ PAGINATION ------------------ */
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
      student?.certifications_count ?? 0,

      student?.skills?.length
        ? student.skills.join(", ")
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
      title: "Total Certifications",
      value: summary?.total_certifications ?? 0,
    },
  ];

  /* ------------------ JSX ------------------ */
  return (
    <>
      <Loader loading={isLoading} />

      <div className="p-4">

        {/* -------- SUMMARY CARDS -------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {statsData.map((item, index) => (
            <div
              key={index}
              className="glassy-card p-5 rounded-xl border"
            >
              <p className="text-sm glassy-text-primary">
                {item.title}
              </p>
              <p className="text-2xl font-semibold mt-2 glassy-text-secondary">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* -------- TITLE -------- */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold glassy-text-primary">
            Student Certification Analytics
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

        {/* -------- RAW department_wise_monthly (Available for Graph) --------
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2 glassy-text-primary">
            Department Wise Monthly Certifications (Raw Data)
          </h3>
          <pre className="glassy-card p-4 rounded text-sm overflow-auto">
            {JSON.stringify(departmentWiseMonthly, null, 2)}
          </pre>
        </div> */}

      </div>
    </>
  );
};

export default StudentCertificationAnalytics;
