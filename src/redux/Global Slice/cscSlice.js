import { createSlice } from "@reduxjs/toolkit";
import {
  createExtraReducersForThunk,
  createApiThunkPrivate,
  createApiThunkPublic,
} from "../../components/hooks/apiThunk";

const initialState = {
  countriesData: {},
  stateData: {},
  citiesData: {},
  getQuestionBankData: {},
  masterSkillsData: {},
  jobsListData: {},
  masterIndustryData: {},
  profileRolesData: {},
  userJobsData: {},
  masterLevelData: {},
  getAllCourseCategoryData: {},
  getQuestListData: {},
  searchUsersData: {},
  getJobListData: {},
  getJobStatsData: {},
  getquestforAnalyticData: {},
  getQuestStatsData: {},
};

export const countries = createApiThunkPublic(
  "countries",
  "/global-module/countries",
  "POST",
);
export const state = createApiThunkPublic(
  "state",
  "/global-module/states",
  "POST",
);
export const cities = createApiThunkPublic(
  "cities",
  "/global-module/cities",
  "POST",
);
export const masterSkills = createApiThunkPrivate(
  "masterSkills",
  "user/profiles/master-skills",
  "GET",
);
export const jobsList = createApiThunkPrivate(
  "jobsList",
  "/global-module/jobs/list",
  "GET",
);
export const jobsCreate = createApiThunkPrivate(
  "jobsCreate",
  "/global-module/jobs/create",
  "POST",
);
export const jobsUpdate = createApiThunkPrivate(
  "jobsCreate",
  "/global-module/jobs/update",
  "POST",
);
export const masterLevel = createApiThunkPrivate(
  "masterLevel",
  "user/profiles/master-levels",
  "GET",
);
export const searchUsers = createApiThunkPrivate(
  "searchUsers",
  "/global-module/user-search",
  "GET",
);

export const masterIndustry = createApiThunkPublic(
  "masterIndustry",
  "user/profiles/master-industries",
  "GET",
);
export const profileRoles = createApiThunkPrivate(
  "profileRoles",
  "user/profiles/master-profile-roles",
  "GET",
);
export const jobsSingleDocument = createApiThunkPrivate(
  "jobsSingleDocument",
  "/global-module/jobs/single-document",
  "GET",
);
export const jobsApplicationList = createApiThunkPrivate(
  "jobsApplicationList",
  "/global-module/jobs/applicants-list",
  "POST",
);
export const recommendedApplicationList = createApiThunkPrivate(
  "recommendedApplicationList",
  "/global-module/jobs/recommended/applicants-list",
  "GET",
);
export const updateApplicationStatus = createApiThunkPrivate(
  "updateApplicationStatus",
  "/global-module/jobs/update-applications-status",
  "POST",
);
export const viewJobApplication = createApiThunkPrivate(
  "viewJobApplication",
  "/global-module/jobs/view-application",
  "POST",
);
export const scheduleInterview = createApiThunkPrivate(
  "scheduleInterview",
  "/global-module/jobs/schedule-interview",
  "POST",
);
export const ReScheduleInterview = createApiThunkPrivate(
  "ReScheduleInterview",
  "/global-module/jobs/reschedule-interview",
  "POST",
);
export const userJobs = createApiThunkPrivate(
  "userJobs",
  "/user/jobs/list",
  "GET",
);
export const getAllCourseCategory = createApiThunkPrivate(
  "getAllCourseCategory",
  "/global-module/course-categories/all-documents",
  "GET",
);
export const createQuest = createApiThunkPrivate(
  "createQuest",
  "/global-module/quests/create",
  "POST",
);
export const getQuestList = createApiThunkPrivate(
  "getQuestList",
  "/global-module/quests/list",
  "GET",
);
export const singleDocuments = createApiThunkPrivate(
  "singleDocuments",
  "/global-module/quests/single-document",
  "GET",
);
export const updateQuest = createApiThunkPrivate(
  "updateQuest",
  "/global-module/quests/update",
  "POST",
);
export const softDelete = createApiThunkPrivate(
  "softDelete",
  "/global-module/quests/soft-delete",
  "DELETE",
);

export const addReviews = createApiThunkPrivate(
  "addReviews",
  "/global-module/jobs/add-reviews",
  "POST",
);
export const userRegisterOnQuest = createApiThunkPrivate(
  "userRegisterOnQuest",
  "/global-module/quests/add-engagements",
  "POST",
);
export const voteOnPoll = createApiThunkPrivate(
  "voteOnPoll",
  "/global-module/quests/vote-on-poll",
  "POST",
);

export const engagementList = createApiThunkPrivate(
  "engagementList",
  "/global-module/quests/engagements-list",
  "POST",
);
export const submitSurveyPolls = createApiThunkPrivate(
  "submitSurveyPolls",
  "/global-module/quests/submit-survey-polls",
  "POST",
);
export const submitFeedback = createApiThunkPrivate(
  "submitFeedback",
  "/global-module/quests/submit-feedbacks",
  "POST",
);
export const getFeedbackReport = createApiThunkPrivate(
  "getFeedbackReport",
  "/global-module/quests/feedbacks-reports",
  "POST",
);

export const feedbackReport = createApiThunkPrivate(
  "feedbackReport",
  "/global-module/quests/feedbacks-reports",
  "POST",
);

export const surveyPollReport = createApiThunkPrivate(
  "surveyPollReport",
  "/global-module/quests/survey-polls-reports",
  "POST",
);
export const approveRejectInterview = createApiThunkPrivate(
  "approveRejectInterview",
  "/global-module/jobs/approve-reject-interview",
  "POST",
);
export const removeFeedbackData = createApiThunkPrivate(
  "removeFeedbackData",
  "/global-module/quests/remove-feedback",
  "POST",
);
export const closeJob = createApiThunkPrivate(
  "closeJob",
  "/global-module/jobs/close-for-now",
  "POST",
);

export const getJobList = createApiThunkPrivate(
  "getOpportunitylistAnalytic",
  "/global-module/jobs/analytic/list",
  "GET",
);
export const getJobStats = createApiThunkPrivate(
  "getOpportunityStatsAnalytic",
  "/global-module/jobs/analytic/opportunity-stats",
  "GET",
);

export const getQuestListForAnalytic = createApiThunkPrivate(
  "getQuestListForAnalytic",
  "/global-module/quests/analytic/list",
  "GET",
);
export const getQuestStats = createApiThunkPrivate(
  "getQuestStats",
  "/global-module/quests/analytic/quest-stats",
  "GET",
);

const cscSlice = createSlice({
  name: "csc",
  initialState,
  reducers: {
    updateMasterSkillData: (state, action) => {
      if (state.masterSkillsData?.data?.data) {
        if (Array.isArray(state.masterSkillsData.data.data)) {
          state.masterSkillsData.data.data = [
            action.payload,
            ...state.masterSkillsData.data.data,
          ];
        } else if (Array.isArray(state.masterSkillsData.data.data.list)) {
          state.masterSkillsData.data.data.list = [
            action.payload,
            ...state.masterSkillsData.data.data.list,
          ];
        }
      }
    },
    updateMasterIndustryData: (state, action) => {
      if (state.masterIndustryData.data?.data.list) {
        state.masterIndustryData.data.data.list = [
          action.payload,
          ...state.masterIndustryData.data.data.list,
        ];
      }
    },
    updateProfileRoleData: (state, action) => {
      if (state.profileRolesData.data?.data.list) {
        state.profileRolesData.data.data.list = [
          action.payload,
          ...state.profileRolesData.data.data.list,
        ];
      }
    },

    updateQuestViewCount: (state, action) => {
      const { questId, engagementCount, isEngaged } = action.payload;
      if (state.getQuestListData.data?.data?.list) {
        state.getQuestListData.data.data.list =
          state.getQuestListData.data.data.list.map((quest) => {
            if (quest._id === questId) {
              return {
                ...quest,
                engagement_count: engagementCount,
                isEngaged: isEngaged,
              };
            }
            return quest;
          });
      }
    },
  },
  extraReducers: (builder) => {
    createExtraReducersForThunk(builder, countries, "countriesData");
    createExtraReducersForThunk(builder, searchUsers, "searchUsersData");
    createExtraReducersForThunk(builder, state, "stateData");
    createExtraReducersForThunk(builder, cities, "citiesData");
    createExtraReducersForThunk(builder, masterSkills, "masterSkillsData");
    createExtraReducersForThunk(builder, masterLevel, "masterLevelData");
    createExtraReducersForThunk(builder, jobsList, "jobsListData");
    createExtraReducersForThunk(builder, masterIndustry, "masterIndustryData");
    createExtraReducersForThunk(builder, profileRoles, "profileRolesData");
    createExtraReducersForThunk(builder, userJobs, "userJobsData");
    createExtraReducersForThunk(
      builder,
      getAllCourseCategory,
      "getAllCourseCategoryData",
    );
    createExtraReducersForThunk(builder, getQuestList, "getQuestListData");
    createExtraReducersForThunk(builder, getJobList, "getJobListData");
    createExtraReducersForThunk(builder, getJobStats, "getJobStatsData");
    createExtraReducersForThunk(
      builder,
      getQuestListForAnalytic,
      "getquestforAnalyticData",
    );
    createExtraReducersForThunk(builder, getQuestStats, "getQuestStatsData");
  },
});

export const {
  updateMasterSkillData,
  updateMasterIndustryData,
  updateProfileRoleData,
  updateQuestViewCount,
} = cscSlice.actions;

export default cscSlice.reducer;
