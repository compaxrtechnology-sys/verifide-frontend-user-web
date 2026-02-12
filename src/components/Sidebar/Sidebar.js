import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BiMessageDetail, BiChevronRight } from "react-icons/bi";
import { FaFileContract, FaRegUser } from "react-icons/fa";
import { PiSealCheckLight } from "react-icons/pi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { FaSignsPost } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { HiPlusSm } from "react-icons/hi";

import {
  MdHome,
  MdSchool,
  MdAssignment,
  MdWork,
  MdEmojiEvents,
} from "react-icons/md";
import { TbHttpConnect } from "react-icons/tb";
import { GiHamburgerMenu } from "react-icons/gi";
import ProfileCard from "../ui/cards/ProfileCard";
import { useDispatch, useSelector } from "react-redux";
import { getCookie, removeCookie, setCookie } from "../utils/cookieHandler";
import { useGlobalKeys } from "../../context/GlobalKeysContext";
import {
  switchAccount,
  switchAccountCompany,
  switchAccountInstitution,
} from "../../redux/slices/authSlice";
import { toast } from "sonner";
import { getInstitutionsList } from "../../redux/slices/instituteSlice";
import { getCompaniesList } from "../../redux/slices/companiesSlice";
import { FiChevronDown } from "react-icons/fi";
const pulseAnimation = `
  @keyframes pulse2 {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(255, 0, 0, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
  }
`;

const Sidebar = ({ navbarOpen, setNavbarOpen, unreadCounts }) => {
  const {
    token,
    role,
    activeMode,
    isAssignedUser,
    isCompany,
    isInstitution,
    isUser,
    updateToken,
    updateRole,
    updateActiveMode,
    updateIsAssignedUser,
    clearAll,
  } = useGlobalKeys();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showName = getCookie("ACCESS_MODE");

  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isInstitutionDropdownOpen, setIsInstitutionDropdownOpen] =
    useState(false);
  const [accessLabel, setAccessLabel] = useState(
    showName === "6" ? "Recruiter" : "STUDENT",
  );
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1000);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCloseSidebar = () => {
    setNavbarOpen(false);
    setOpenSubmenu(null);
  };

  const onClickMenu = (path) => {
    navigate(path);
    if (isMobile) handleCloseSidebar();
  };

  const toggleSubmenu = (label) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  const mode = getCookie("ACCESS_MODE");

  const rawSidebarData = [
    { icon: MdHome, label: "Highlights", path: "/user/feed" },
    { icon: FaRegUser, label: "Profile", path: "/user/profile" },
    {
      icon: PiSealCheckLight,
      label: "Verification",
      path: "/user/verification",
    },
    { icon: MdSchool, label: "Courses", path: "/user/course/recommended" },
    { icon: MdAssignment, label: "Assessment", path: "/user/assessment" },
    { icon: MdWork, label: "Opportunities", path: "/user/opportunitiess" },
    { icon: MdEmojiEvents, label: "Quest", path: "/user/quest" },
    { icon: BiMessageDetail, label: "Message", path: "/user/message" },
    { icon: FaSignsPost, label: "Posts", path: "/user/posts" },
    {
      icon: IoIosNotificationsOutline,
      label: "Notification",
      path: "/user/notification",
    },
    { icon: TbHttpConnect, label: "Connection", path: "/user/connections" },
    {
      icon: CiSettings,
      label: "Settings",
      children: [
        {
          icon: FaFileContract,
          label: "Terms and Conditions",
          path: "/user/terms-and-conditions",
        },
      ],
    },
  ];

  const sidebarData = rawSidebarData.filter((item) =>
    mode === "5" && item.label === "Posts" ? false : true,
  );
  const { personalInfo } = useSelector(
    (state) => state.auth.getProfileData?.data?.data || {},
  );
  // Close dropdowns when route changes
  const switchAccountFunction = async (prefillId, type) => {
    // type can be "company" or "institution"
    setIsLoading(true);
    try {
      const dispatchAction =
        type === "company" ? switchAccountCompany : switchAccountInstitution;

      const res = await dispatch(
        dispatchAction({
          accessMode: accessLabel,
          [`${type}Id`]: prefillId, // dynamically set companyId or institutionId
        }),
      ).unwrap();

      if (res) {
        // Use the same keys for all types
        setCookie("TOKEN", JSON.stringify(res.data.token));
        setCookie("ROLE", res.data.accessMode); // role for routing
        setCookie("ACTIVE_MODE", type); // 'company' or 'institution'
        setCookie("ASSIGNED_USER", res.data.isAssignedUser);
        // ✅ Update global context
        updateToken(res.data.token);
        updateRole(res.data.accessMode);
        updateActiveMode(type);
        updateIsAssignedUser(res.data.isAssignedUser);
        // toast.success(res?.message || `${type} login successful`);

        // Navigate dynamically
        navigate(`/${type}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(error || "Invalid credentials or server error");
    } finally {
      setIsLoading(false);
    }
  };
  const {
    companiesList: { data: companiesData } = {},
    companyDetails: { data: companyDetails } = {},
  } = useSelector((state) => state.userCompanies);
  const {
    institutionsList: { data: institutionsList } = {},
    // companyDetails: { data: companyDetails } = {},
  } = useSelector((state) => state.institute);
  const fetchCompaniesList = useCallback(
    async (page = 1) => {
      const apiPayload = {
        page: 1,
        size: 100,
        populate: "industry|name",
        select:
          "name display_name email industry phone_no company_size company_type is_verified createdAt logo_url created_by_users ",
        searchFields: "name",
        keyWord: "",
        query: JSON.stringify({
          created_by_users: false,
        }),
      };
      try {
        setIsLoading(true);
        await dispatch(getCompaniesList(apiPayload));
      } catch (error) {
        toast.error("Failed to fetch companies list");
        console.error("Error fetching companies:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch],
  );
  const fetchInstitutionsList = useCallback(
    async (page = 1) => {
      const apiPayload = {
        page: 1,
        size: 100,
        // populate: "industry|name",
        // select:
        //   "name display_name email industry phone_no company_size company_type is_verified createdAt logo_url created_by_users ",
        // searchFields: "name",
        keyWord: "",
        query: JSON.stringify({
          created_by_users: false,
        }),
      };
      try {
        setIsLoading(true);
        await dispatch(getInstitutionsList(apiPayload));
      } catch (error) {
        toast.error("Failed to fetch companies list");
        console.error("Error fetching companies:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch],
  );
  useEffect(() => {
    fetchCompaniesList();
    fetchInstitutionsList();
  }, [dispatch, fetchCompaniesList, fetchInstitutionsList]);
  return (
    <>
      <style>{pulseAnimation}</style>

      {/* Overlay for mobile */}
      {/* {navbarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={handleCloseSidebar}
        />
      )} */}

      {/* Hamburger button */}
      {!navbarOpen && isMobile && (
        <button
          className="fixed top-4 left-4 p-2 z-50 flex items-center justify-center hover:glassy-card transition-all duration-300 hover:scale-110"
          onClick={() => setNavbarOpen(true)}
        >
          <GiHamburgerMenu className="text-xl glassy-text-primary" />
        </button>
      )}

      {/* Sidebar */}
      {/* <div
        className={`fixed left-0 top-0 h-screen w-72 flex-col glassy-card shadow-xl z-50 transform transition-transform duration-300 ease-in-out
          ${navbarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      > */}
      <div
        className={`fixed left-0 top-0 h-screen w-72 flex-col   shadow-xl z-50 transform transition-transform duration-300 ease-in-out
    ${navbarOpen ? "translate-x-0" : "-translate-x-full"}
    
  `}
      >
        {/* Optional Close Button */}
        {isMobile && (
          <button
            className="absolute top-4 right-4 text-xl p-1 hover:scale-110 glassy-text-primary"
            onClick={handleCloseSidebar}
          >
            ✕
          </button>
        )}
        <nav className="flex-1 overflow-y-auto mt-4 pb-6 p-2">
          <ProfileCard data={personalInfo} />

          {sidebarData.map((item, idx) => {
            const isMobileHiddenLabel = [
              "Courses",
              "Opportunities",
              "Assessment",
              "Quest",
            ].includes(item.label);
            const hasUnread =
              (item.label === "Message" && unreadCounts?.messages > 0) ||
              (item.label === "Notification" &&
                unreadCounts?.notifications > 0);

            return (
              <div
                key={idx}
                className={`mb-1 ${
                  isMobileHiddenLabel ? "lg:hidden block" : ""
                }`}
              >
                {item.children ? (
                  <>
                    <div
                      className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-300 rounded-lg mx-2 hover:glassy-card hover:text-blue-600 ${
                        openSubmenu === item.label
                          ? " text-blue-600"
                          : "glassy-text-primary"
                      }`}
                      onClick={() => toggleSubmenu(item.label)}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={`text-base font-normal transition-colors duration-300 ${
                            openSubmenu === item.label
                              ? "text-blue-600"
                              : "glassy-text-primary"
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      <BiChevronRight
                        className={`text-lg transition-transform duration-300 ${
                          openSubmenu === item.label ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                    {openSubmenu === item.label && (
                      <div className="ml-10 mt-1 space-y-1 glassy-text-primary">
                        {item.children.map((child, childIdx) => (
                          <div
                            key={childIdx}
                            onClick={() => onClickMenu(child.path)}
                            className={`text-base font-normal transition-colors  duration-300 ${
                              openSubmenu === child.label
                                ? "text-blue-600"
                                : "glassy-text-primary hover:glassy-card hover:text-blue-600"
                            }`}
                          >
                            <span>{child.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-300 rounded-lg mx-2 ${
                      location.pathname === item.path
                        ? " glassy-button !rounded text-blue-600"
                        : "glassy-text-primary hover:glassy-card hover:text-blue-600"
                    }`}
                    onClick={() => onClickMenu(item.path)}
                  >
                    <item.icon
                      className={`text-lg rounded-full transition-colors duration-300 ${
                        location.pathname === item.path
                          ? "glassy-text-primary"
                          : "glassy-text-primary"
                      } ${hasUnread ? "animate-[pulse_2s_infinite]" : ""}`}
                      style={
                        hasUnread ? { animation: "pulse2 2s infinite" } : {}
                      }
                    />
                    <span className="text-sm">{item.label}</span>
                  </div>
                )}
              </div>
            );
          })}
          {/* <div className="border-t border-[var(--border-color)] p-2">
            <button
              onClick={() => setIsCompanyDropdownOpen((prev) => !prev)}
              className="w-full flex justify-between items-center px-4 py-2 text-sm glassy-text-primary hover:glassy-card transition-colors"
              data-tour="companies-dropdown"
            >
              <span className="flex items-center gap-2">
                <MdWork className="text-base" />
                Companies
              </span>

              <FiChevronDown
                className={`ml-2 glassy-text-primary transition-transform ${
                  isCompanyDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isCompanyDropdownOpen && (
              <div
                className="pl-4 space-y-1 max-h-60 overflow-y-auto"
                data-tour="company-list"
              >
                {companiesData?.data?.list?.length > 0 ? (
                  companiesData.data.list.map((company) => (
                    <Link
                      key={company._id}
                      className="flex items-center gap-2 py-2 text-sm glassy-text-primary rounded-lg hover:glassy-card transition-colors"
                      onClick={() =>
                        switchAccountFunction(company._id, "company")
                      }
                    >
                     
                      {company.logo_url ? (
                        <img
                          src={company.logo_url}
                          alt={`${company.name} logo`}
                          className="w-6 h-6 rounded-full object-cover border border-[var(--border-color)]"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/companylogo.png";
                          }}
                        />
                      ) : (
                        <div className="w-6 h-6 flex items-center justify-center rounded-full glassy-card glassy-text-secondary text-xs font-semibold">
                          <MdWork className="text-sm" />
                        </div>
                      )}

                      <span className="truncate">{company.name}</span>
                    </Link>
                  ))
                ) : (
                  <p className="py-2 text-sm glassy-text-secondary flex items-center gap-2">
                    <MdWork />
                    No companies found
                  </p>
                )}

                {companiesData?.data?.list?.length < 5 && (
                  <Link
                    to="/user/create-company"
                    className="flex items-center gap-2 py-2 text-sm glassy-text-primary hover:glassy-card rounded-lg transition-colors"
                    onClick={() => {
                      setIsCompanyDropdownOpen(false);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <HiPlusSm className="text-base" />
                    Create Company
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className=" p-2">
            <button
              onClick={() => setIsInstitutionDropdownOpen((prev) => !prev)}
              className="w-full flex justify-between items-center px-4 py-2 text-sm glassy-text-primary hover:glassy-card transition-colors"
              data-tour="institutions-dropdown"
            >
              <span className="flex items-center gap-2">
                <MdSchool className="text-base" />
                Institution
              </span>

              <FiChevronDown
                className={`ml-2 glassy-text-primary transition-transform ${
                  isInstitutionDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            
            {isInstitutionDropdownOpen && (
              <div className="pl-4 space-y-1" data-tour="institution-list">
                {institutionsList?.data?.list?.length > 0 ? (
                  institutionsList.data.list.map((company) => (
                    <Link
                      key={company._id}
                      className="flex items-center gap-2 py-2 text-sm glassy-text-primary rounded-lg hover:glassy-card transition-colors"
                      onClick={() => {
                        switchAccountFunction(company._id, "institution");
                      }}
                    >
                       
                      {company.logo_url ? (
                        <img
                          src={company.logo_url}
                          alt={`${company.name} logo`}
                          className="w-6 h-6 rounded-full object-cover border border-[var(--border-color)]"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/companylogo.png";
                          }}
                        />
                      ) : (
                        <div className="w-6 h-6 flex items-center justify-center rounded-full glassy-card glassy-text-secondary text-xs font-semibold">
                          <MdSchool className="text-sm" />
                        </div>
                      )}

                      <span className="truncate">{company.name}</span>
                    </Link>
                  ))
                ) : (
                  <p className="py-2 text-sm glassy-text-primary flex items-center gap-2">
                    <MdSchool />
                    No Institution found
                  </p>
                )}

                {institutionsList?.data?.list?.length < 5 && (
                  <Link
                    to="/user/create-institute"
                    className="flex items-center gap-2 py-2  text-sm glassy-text-primary rounded-lg transition-colors p-2 hover:glassy-card"
                    onClick={() => {
                      setIsInstitutionDropdownOpen(false);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <HiPlusSm className="text-base" />
                    Create Institution
                  </Link>
                )}
              </div>
            )}
          </div> */}
          <div className="glassy-card p-2 m-2">
            <h2 className="glassy-text-secondary text-xs uppercase font-semibold mb-2 px-3">
              Switch Account
            </h2>
            <div className=" ] p-2">
              <button
                onClick={() => setIsCompanyDropdownOpen((prev) => !prev)}
                className="w-full flex justify-between scroll-hidden items-center px-4 py-2 text-sm glassy-text-primary hover:glassy-card transition-colors"
              >
                <span className="flex items-center gap-2">
                  <MdWork />
                  Company
                </span>
                <FiChevronDown
                  className={`transition-transform ${
                    isCompanyDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCompanyDropdownOpen && (
                <div className="px-3 pt-2 space-y-2  ">
                  {companiesData?.data?.list?.length > 0 ? (
                    companiesData.data.list.map((company) => {
                      // const isActive =
                      //   selectedAccount === `company-${company._id}`;

                      return (
                        <div
                          key={company._id}
                          className="flex items-center justify-between rounded-xl glassy-card p-3 hover:opacity-90 transition"
                        >
                          {/* Left */}
                          <div className="flex items-center gap-3">
                            {company.logo_url ? (
                              <img
                                src={company.logo_url}
                                className="w-9 h-9 rounded-lg object-cover"
                                onError={(e) =>
                                  (e.currentTarget.src = "/companylogo.png")
                                }
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-lg flex items-center justify-center glassy-card">
                                <MdWork />
                              </div>
                            )}
                            <span className="text-sm line-clamp-2 glassy-text-primary">
                              {company.name}
                            </span>
                          </div>

                          {/* Radio */}
                          <div
                            onClick={() => {
                              // setSelectedAccount(`company-${company._id}`);
                              switchAccountFunction(company._id, "company");
                            }}
                            className={`w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer ${"border-gray-500"}`}
                          ></div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs glassy-text-secondary px-2">
                      No companies found
                    </p>
                  )}

                  {companiesData?.data?.list?.length < 5 && (
                    <Link
                      to="/user/create-company"
                      className="flex items-center justify-center gap-2 py-2 text-sm border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500/10"
                    >
                      <HiPlusSm /> Create Company
                    </Link>
                  )}
                </div>
              )}
            </div>
            <div className="  p-2">
              <button
                onClick={() => setIsInstitutionDropdownOpen((prev) => !prev)}
                className="w-full flex justify-between items-center px-4 py-2 text-sm glassy-text-primary hover:glassy-card transition-colors"
              >
                <span className="flex items-center gap-2">
                  <MdSchool />
                  Collage
                </span>

                <FiChevronDown
                  className={`transition-transform ${
                    isInstitutionDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isInstitutionDropdownOpen && (
                <div className="px-3 pt-2 space-y-2 max-h-60 overflow-y-auto">
                  {institutionsList?.data?.list?.length > 0 ? (
                    institutionsList.data.list.map((institution) => {
                      // const isActive =
                      //   selectedAccount === `institution-${institution._id}`;

                      return (
                        <div
                          key={institution._id}
                          className="flex items-center justify-between rounded-xl glassy-card p-3 hover:opacity-90 transition"
                        >
                          {/* Left */}
                          <div className="flex items-center gap-3 min-w-0">
                            {institution.logo_url ? (
                              <img
                                src={institution.logo_url}
                                className="w-9 h-9 rounded-lg object-cover"
                                onError={(e) =>
                                  (e.currentTarget.src = "/companylogo.png")
                                }
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-lg flex items-center justify-center glassy-card">
                                <MdSchool />
                              </div>
                            )}

                            <span className="text-sm truncate glassy-text-primary">
                              {institution.name}
                            </span>
                          </div>

                          {/* Radio */}
                          <div
                            onClick={() => {
                              // setSelectedAccount(`institution-${institution._id}`);
                              switchAccountFunction(
                                institution._id,
                                "institution",
                              );
                            }}
                            className={`w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer border-gray-500`}
                          >
                            {/* optional active dot */}
                            {/* {isActive && (
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                )} */}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs glassy-text-secondary px-2">
                      No institutions found
                    </p>
                  )}

                  {institutionsList?.data?.list?.length < 5 && (
                    <Link
                      to="/user/create-institute"
                      className="flex items-center justify-center gap-2 py-2 text-sm border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500/10"
                      onClick={() => {
                        setIsInstitutionDropdownOpen(false);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <HiPlusSm />
                      Create New
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              removeCookie("VERIFIED_TOKEN");
              window.location.reload();
            }}
            className="w-full pl-4  space-y-1 p-3 text-left px-4 py-2 text-sm glassy-text-primary hover:glassy-card border-t border-[var(--border-color)] transition-colors flex items-center gap-2"
          >
            <FiLogOut className="text-base" />
            Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
