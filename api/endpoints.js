import TokenManager from './tokenManager';
import requestsNAPI from './requestsNAPI';
import requestsCB from './requestsCB';
import { isMobileApp, getSurveyType, getQueryVariable, getEnvironment, getReferrer, useCookie } from '../utils';

const tokenManager = new TokenManager();

const DEFAULT_EXTENSION = 'webapi/'
const EOS_EXTENSION = 'eos/'

const CaseAssignmentBaseURLs = {
  "local": "https://accesshope.dev.bestopinions.us/cbbackend/",
  "dev": "https://accesshope.dev.bestopinions.us/cbbackend/",
  "preprod": "https://accesshope.patients.preproduction.navya.care/cbbackend/",
  "prod": "https://accesshope.patients.navya.care/cbbackend/"
}

const getCaseAssignmentBaseURL = () => {
  var environment = getEnvironment();
  return CaseAssignmentBaseURLs[environment];
}

const preLoggedInRequest = async(api_extension, values={}, first_extension=DEFAULT_EXTENSION) => {
  api_extension = first_extension + api_extension
  try {
    const data = await requestsNAPI.post(api_extension, values, {});
    return data;
  }
  catch(ex) {
    return getErrorResponse(ex.response);
  }
}

const getErrorResponse = (response) => {
  let error = null;
  console.log('api error');
  if(response) {
    if(response.body) {
      error = response.body;
    } else {
      error = {
          "error": "Something went wrong. Please try again after few minutes.",
          "client_error": true // required to differentiate between error key from client and server
      };
    }
    error['status'] = response.statusCode;
  }
  console.log(error);
  return error;
}

// Login and Forgot Password

const baseauth = async (values) => {
    let endpoint_url = 'baseauth';
    // if (useCookie()){
    //   endpoint_url = 'expertappbaseauth'
    // }
    const data = await preLoggedInRequest(endpoint_url, values);
    return data;
}

const registerDevice = async (values) => {
    const data = await loggedInRequest('registerDevice', values);
    return data;
}

const authenticate = async (values) => {
    const data = await preLoggedInRequest('authenticate', values);
    return data;
}

const forgotPassword = async (values) => {
    const data = await preLoggedInRequest('forgotPassword', values);
    return data;
}

const loggedInRequest = async(api_extension, values={}, first_extension=DEFAULT_EXTENSION) => {
  api_extension = first_extension + api_extension
  try {
    const data = await requestsNAPI.post(api_extension, values, {}, tokenManager.defaultFormHandler);
    return data;
  }
  catch(ex) {
    return getErrorResponse(ex.response);
  }
}

const updateInfo = async (values) => {
    const data = await preLoggedInRequest('updateInfo', values);
    return data;
}

// Home
const dashboard = async () => {
    const data = await loggedInRequest('dashboard');
    return data;
}
const getannouncements = async () => {
    const data = await loggedInRequest('getannouncements');
    return data;
}

// Performance
const experttotal = async () => {
    const data = await loggedInRequest('experttotal');
    return data;
}
const experttotalinorg = async () => {
    const data = await loggedInRequest('experttotalinorg');
    return data;
}
const expertlastxdays = async (ndays) => {
    const data = await loggedInRequest('expertlastxdays', {"ndays": ndays});
    return data;
}
const experttotalinorglastxdays = async (ndays) => {
    const data = await loggedInRequest('experttotalinorglastxdays', {"ndays": ndays});
    return data;
}
const expertdmgperformance = async (ndays) => {
    const data = await loggedInRequest('expertdmgperformance', {"ndays": ndays});
    return data;
}
const orgdmgperformance = async (ndays) => {
    const data = await loggedInRequest('orgdmgperformance', {"ndays": ndays});
    return data;
}

const expertspecialityxdays = async (ndays) => {
  const data = await loggedInRequest('expertspecialityxdays', {"ndays": ndays});
  return data;
}

const expertspeciality = async () => {
    const data = await loggedInRequest('expertspeciality');
    return data;
}

const getExpertTotal = async (days) => {
  const data = days ? await expertlastxdays(days) : await experttotal();
  return data;
}

const getExpertTotalInOrg = async (days) => {
  const data = days ? await experttotalinorglastxdays(days) : await experttotalinorg();
  return data;
}

const getExpertSpecialty = async (days) => {
  const data = days ? await expertspecialityxdays(days) : await expertspeciality();
  return data;
}

const getDMG = async (days) => {
  days = days || 3650;
  const data = await expertdmgperformance(days);
  return data;
}

const getDMGOrg = async (days) => {
  days = days || 3650;
  const data = await orgdmgperformance(days);
  return data;
}

// Settings

const getprofile = async () => {
    const data = await loggedInRequest('getprofile');
    return data;
}

const passwordReset = async (oldpass, newpass) => {
    const data = await loggedInRequest('passwordReset', {'oldpass': oldpass, 'newpass': newpass});
    return data;
}

const passwordResetViaLink = async (newpass) => {
  const token = getQueryVariable('token')
  console.log('token : ', token);
  const data = await preLoggedInRequest('passwordReset', {'newpass': newpass, 'alpha_token': token});
  return data;
}

const completeRegistration = async (newpass) => {
  const token = getQueryVariable('token')
  console.log('token : ', token);
  const data = await preLoggedInRequest('complete_registration', {'newpass': newpass, 'alpha_token': token});
  return data;
}

const requestSignup = async (email) => {
  const referrer = getReferrer();
  console.log('requestSignup - ' + referrer);
  return await preLoggedInRequest('request_signup', {'email': email, 'org_name': referrer});
}

const validateLinkToken = async () => {
  const token = getQueryVariable('token')
  return await preLoggedInRequest('validate_link_token', {'token': token});
}

const savePushNotificationToken = async (token, deviceID, platform) => {
  const params = {
    gcmsid: token,
    uniquekey: deviceID,
    platform: platform
  };
  const data = await loggedInRequest('pushnotification', params);
  return data;
}

const logout = async (deviceID) => {
  const data = await loggedInRequest('logout', {uniquekey: deviceID});
  tokenManager.clearToken()
  let locationHref= "/login";
  // localStorage.setItem('loggedOut', true);
  tokenManager.clearToken();
  window.location = locationHref;
}

const analyticsTracking = async (params) => {
  const data = await requestsNAPI.post_json('webapi/analytics_tracking', params);
  return data;
}

const expertUnavailability = async ({start_date='', end_date='', reason='', type="get"}) => {
  let obj = {};
  if (type !== "get") {
    obj = { start_date, end_date, reason };
  }
  const data = await loggedInRequest('expert_unavailability', obj);
  return data;
}

const getExpertsDashboard = async (payload) => {
    payload['org'] = getReferrer();
    const data = await loggedInRequest('get_experts_aggregated_data', payload);
    return data;
}

const getExpertSurveyListDashboard = async (payload) => {
  payload['org'] = getReferrer();
  const data = await loggedInRequest('get_expert_survey_list_data', payload);
  return data;
}

const getCaseAggregatedListDashboard = async (payload) => {
  payload['org'] = getReferrer();
  const data = await loggedInRequest('get_case_aggregated_data', payload);
  return data;
}

const getHospitalSummaryDashboard = async (payload) => {
  payload['org'] = getReferrer();
  const data = await loggedInRequest('get_hospital_summary_dashboard', payload);
  return data;
}

const getExpertListByOrg = async () => {
  const payload = {org: getReferrer()};
  const data = await loggedInRequest('get_org_experts', payload);
  return data;
}

const cbPostRequest = async (url, payload) => {
  try {
   const response = await requestsCB.post(url, payload, {}, tokenManager.clientIdAuth);
   return response
 } catch(err) {
   return err;
 }
}

const caseAssignmentPostRequest = async (url, payload) => {
  try {
   let case_assignment_url = getCaseAssignmentBaseURL();
   const response = await requestsCB.testCaseAssignmentPost(case_assignment_url+url, payload, {}, tokenManager.clientIdAuth);
   return response
 } catch(err) {
   return err;
 }
}

const caseAssignmentGetRequest = async (url) => {
  try {
   let case_assignment_url = getCaseAssignmentBaseURL();
   const response = await requestsCB.testCaseAssignmentGet(case_assignment_url+url, {}, tokenManager.clientIdAuth);
   return response
 } catch(err) {
   return err;
 }
}

const cbPutRequest = async (url, payload) => {
  try {
   const response = await requestsCB.put(url, payload, {}, tokenManager.clientIdAuth);
   return response
 } catch(err) {
   console.log(err)
   return null;
 }
}
const cbDeleteRequest = async (url, payload) => {
  try {
   const response = await requestsCB.delete(url, payload, {}, tokenManager.clientIdAuth);
   return response
 } catch(err) {
   console.log(err)
   return null;
 }
}
const cbGetRequest = async (url, payload) => {
  try {
   const response = await requestsCB.get(url, payload, {}, tokenManager.clientIdAuth);
   return response
 } catch(err) {
   console.log(err)
   return null;
 }
}
const getOrgExperts = async (payload) => {
  return cbPostRequest('get_org_experts', payload);
}

const getCaseData = async (payload) => {
  return cbPostRequest('get_case_data_by_physician', payload);
}

const getTurnAroundTimeToAcceptCase = async (payload) => {
  return cbPostRequest('get_turn_around_time_to_accept_case_by_physician', payload);
}

const getTurnAroundTimeToSubmitCase = async (payload) => {
  return cbPostRequest('get_turn_around_time_to_submit_case_by_physician', payload);
}

const getCaseStatus = async (payload) => {
  return cbPostRequest('get_case_status_by_physician', payload);
}

const getCaseRejection = async (payload) => {
  return cbPostRequest('get_case_rejection_by_physician', payload);
}

const getCaseSubmission = async (payload) => {
  return cbPostRequest('get_case_submission_by_physician', payload);
}

const getPendingInvites = async (payload) => {
  return cbPostRequest('get_case_status_pending_invites', payload);
}

const getAcceptedCases = async (payload) => {
  return cbPostRequest('get_case_status_accepted_cases', payload);
}

const getRejectedOrIgnoredCases = async (payload) => {
  return cbPostRequest('get_case_status_rejected_or_ignored', payload);
}

const getCompletedOpinions = async (payload) => {
  return cbPostRequest('get_case_status_completed_opinions', payload);
}

const getFPList = async (payload) => {
  return cbPostRequest('get_fp_list', payload);
}

const getCaseDataByFP = async (payload) => {
  return cbPostRequest('get_case_data_by_fp', payload);
}

const getCaseDataByDXGroup = async (payload) => {
  return cbPostRequest('get_cases_by_dx_group', payload);
}

const getCaseStatusByFP = async (payload) => {
  return cbPostRequest('get_case_status_by_fp', payload);
}

const getClientListApi = async (payload) => {
  const data = await cbPostRequest('client_list', payload);
  return data;
}
const addClientListApi = async (payload) => {
  const data = await cbPostRequest('client', payload);
  return data;
}
const updateClientListApi = async (id, payload) => {
  const data = await cbPutRequest('client/' + id, payload);
  return data;
}

const getFinanceReports = async (payload) => {
  return cbPostRequest('get_finance_reports', payload);
}

const getEmployerListApi = async (payload) => {
  const data = await cbPostRequest('get_client_with_employer_count_list', payload);
  return data;
}

const addEmployerApi = async (payload) => {
  const data = await cbPostRequest('employer', payload);
  return data;
}
const updateEmployerApi = async (payload) => {
  const data = await cbPutRequest('employer', payload);
  return data;
}
const getEmployerDetailApi = async (id) => {
  const data = await cbGetRequest('get_employer_list_by_client_id/' + id);
  return data;
}
const getClientWithEmployerApi = async (id) => {
  const data = await cbGetRequest('employer/' + id);
  return data;
}
const deleteEmployerApi = async (id) => {
  console.log('id', id)
  const data = await cbDeleteRequest('employer/' + id);
  console.log('data', data)
  return data;
}
const getSlaListApi = async (payload) => {
  const data = await cbPostRequest('sla_list', payload);
  return data;
}
const getEmployerSlaApi = async (payload) => {
  const data = await cbPostRequest('sla_data_view', payload);
  return data;
}
const updateEmployerSlaApi = async (payload) => {
  const data = await cbPostRequest('sla', payload);
  return data;
}
const getAllStates = async(payload) => {
  const data = await cbPostRequest('get_all_states_from_us',payload)
  return data;
}
const getFpListAndStates = async(payload) => {
  const data = await cbPostRequest('get_fp_list_and_states', payload)
  return data;
}
const addStateToFp = async(payload) => {
  const data = await cbPostRequest('add_state_to_fp', payload)
  return data;
}
const removeStateFromFp = async(payload) => {
  const data = await cbPostRequest('remove_states_from_fp', payload)
  return data;
}

const getStatesForFp = async(payload) => {
  const data = await cbPostRequest('get_states_for_fp', payload)
  return data;
}
const convertStatesForFp = async(payload) => {
  const data = await cbPostRequest('convert_states_for_fp', payload)
  return data;
}
const addStatesToFp = async(payload) => {
  const data = await cbPostRequest('add_states_to_fp', payload)
  return data;
}
const getNPQcCompletedOpinions = async (payload) => {
  return cbPostRequest('get_case_status_np_qc_cases', payload);
}

const getMdQcCompletedOpinions = async (payload) => {
  return cbPostRequest('get_case_status_md_qc_cases', payload);
}

const getNPQCPendingCaseStatus = async (payload) => {
  return cbPostRequest('get_case_status_np_qc_pending_cases', payload);
}

const getMDQCPendingCaseStatus = async (payload) => {
  return cbPostRequest('get_case_status_md_qc_pending_cases', payload);
}

const getExpertListApi = async (payload) => {
  const data = await cbPostRequest('expert_list', payload);
  return data;
}

const getListsForExpertAddApi = async (payload) => {
  const data = await cbGetRequest('list/' + payload, );
  return data;
}
const addExpertApi = async (payload) => {
  const data = await cbPostRequest('expert', payload);
  return data;
}
const updateExpertApi = async (payload) => {
  const data = await cbPutRequest('expert', payload);
  return data;
}
const updateStatusExpertApi = async (id, payload) => {
  const data = await cbPutRequest('expert_status/' + id, payload);
  return data;
}
const getStateListApi = async (payload) => {
  const data = await cbGetRequest('list/state');
  return data;
}
const getSingleExpertApi = async (userId,expertId) => {
  const data = await cbGetRequest(`expert/${userId}/${expertId}`);
  return data;
}
const getFPListData = async (payload) => {
  const response = await cbPostRequest('get_fp_list_data', payload);
  return response;
}

const addFPHoliday = async (payload) => {
  const response = await cbPostRequest('add_fp_holiday', payload);
  return response;
}

const updateFPHoliday = async (payload) => {
  const response = await cbPostRequest('update_fp_holiday', payload);
  return response;
}

const getFPData = async (payload) => {
  const response = await cbPostRequest('get_fp_data', payload);
  return response;
}

const getFPHolidays = async (payload) => {
  const response = await cbPostRequest('get_fp_holidays', payload);
  return response;
}

const updateFPTimezone = async (payload) => {
  const response = await cbPostRequest('update_fp_timezone', payload);
  return response;
}

const deleteFPHoliday = async (payload) => {
  const response = await cbPostRequest('delete_fp_holiday', payload);
  return response;
}

const updateFPAvailability = async (payload) => {
  const response = await cbPostRequest('update_fp_availability', payload);
  return response;
}

const getFPAvailability = async (payload) => {
  const response = await cbPostRequest('get_fp_availability', payload);
  return response;
}
const getAvailableTimezones = async (payload) => {
  const response = await cbPostRequest('get_available_timezones', payload);
  return response;
}

const updateFPMultipleHolidays = async (payload) => {
  const response = await cbPostRequest('update_fp_multiple_holidays', payload);
  return response;
}

const getCaseAssignmentData = async (payload) => {
  return caseAssignmentPostRequest('accesshope/survey_experts/config/', payload);
}

const getSpecialityListApi = async () => {
  const data = await cbGetRequest('list/speciality');
  return data;
}

const getDmgListApi = async () => {
  const data = await caseAssignmentGetRequest('process/api/get_dmg_list');
  return data;
}

const getSubDmgListApi = async (payload) => {
  const data = await caseAssignmentPostRequest('process/api/get_sub_dmg_list',payload);
  return data;
}
const createExpertAvailability = async (payload) => {
  const response = await cbPostRequest('create_expert_availability', payload);
  return response;
}

const getExpertAvailability = async (payload) =>{
  const response = await cbPostRequest('get_expert_availability', payload)
  return response;
}

const expertUpdateAvailability = async (payload) =>{
  const response = await cbPostRequest('update_expert_availability',payload)
  return response;
}

const deleteExpertAvailability = async (payload) =>{
  const response = await cbPostRequest('delete_expert_availability',payload)
  return response;
}

const setCasePriority = async (payload) => {
  const data = await cbPostRequest("set_case_priority", payload);
  return data;
};

const assignExpertApi = async (payload) => {
  const data = await cbPostRequest("assign_expert_user", payload);
  return data;
};
const expertList = async (payload) => {
  const data = await cbPostRequest("expert_list", payload);
  return data;
};
const getUserList = async (payload) => {
  const data = await cbPostRequest("get_case_report_expert_list", payload);
  return data;
};

const revertExpert = async (payload) => {
  const data = await cbPostRequest("revert_expert_user ", payload);
  return data;
};


const getCaseReportUserList = async (url, payload) => {
  const data = await cbPostRequest(url, payload);
  return data;
};
const assignOrRejectQc = async (url, payload) => {
  const data = await cbPostRequest(url, payload);
  return data;
};
const AcceptReject = async (payload) => {
  const data = await cbPostRequest(
    "accept_or_reject_case_single_page",
    payload
  );
  return data;
};


const getPermissions = async () => {
  const data = await cbGetRequest('get_user_permissions');
  return data;
}
const getCaseReportViewApi = async (payload) => {
  const data = await cbPostRequest("get_case_details", payload);
  return data;
};


export default {
  expertUnavailability,
  analyticsTracking,
  updateInfo,
  baseauth,
  registerDevice,
  authenticate,
  forgotPassword,
  dashboard,
  getannouncements,
  experttotal,
  experttotalinorg,
  expertlastxdays,
  expertdmgperformance,
  expertspecialityxdays,
  expertspeciality,
  getExpertTotal,
  getExpertTotalInOrg,
  getExpertSpecialty,
  getDMG,
  getDMGOrg,
  orgdmgperformance,
  getprofile,
  passwordReset,
  logout,
  savePushNotificationToken,
  passwordResetViaLink,
  requestSignup,
  completeRegistration,
  validateLinkToken,
  getExpertsDashboard,
  getExpertSurveyListDashboard,
  getCaseAggregatedListDashboard,
  getExpertListByOrg,
  getHospitalSummaryDashboard,
  getOrgExperts,
  getCaseData,
  getTurnAroundTimeToAcceptCase,
  getTurnAroundTimeToSubmitCase,
  getCaseStatus,
  getCaseRejection,
  getCaseSubmission,
  getPendingInvites,
  getAcceptedCases,
  getRejectedOrIgnoredCases,
  getCompletedOpinions,
  getFPList,
  getCaseDataByFP,
  getCaseStatusByFP,
  getCaseDataByDXGroup,
  getClientListApi,
  addClientListApi,
  updateClientListApi,
  getFinanceReports,
  getEmployerListApi,
  addEmployerApi,
  updateEmployerApi,
  deleteEmployerApi,
  getEmployerDetailApi,
  getClientWithEmployerApi,
  getSlaListApi,
  getEmployerSlaApi,
  updateEmployerSlaApi,
  getAllStates,
  getFpListAndStates,
  addStateToFp,
  addStatesToFp,
  removeStateFromFp,
  getStatesForFp,
  convertStatesForFp,
  getNPQcCompletedOpinions,
  getMdQcCompletedOpinions,
  getNPQCPendingCaseStatus,
  getMDQCPendingCaseStatus,
  getExpertListApi,
  getListsForExpertAddApi,
  addExpertApi,
  getStateListApi,
  getSingleExpertApi,
  updateExpertApi,
  updateStatusExpertApi,
  getFPListData,
  addFPHoliday,
  updateFPHoliday,
  getFPData,
  getFPHolidays,
  updateFPTimezone,
  deleteFPHoliday,
  updateFPAvailability,
  getFPAvailability,
  getAvailableTimezones,
  updateFPMultipleHolidays,
  getCaseAssignmentData,
  getSpecialityListApi,
  getDmgListApi,
  getSubDmgListApi,
  createExpertAvailability,
  getExpertAvailability,
  expertUpdateAvailability,
  deleteExpertAvailability,
  setCasePriority,
  assignExpertApi,
  getUserList,
  expertList,
  getCaseReportUserList,
  assignOrRejectQc,
  AcceptReject,
  getPermissions,
  getCaseReportViewApi,
  revertExpert,
};
