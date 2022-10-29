import Login from '../pages/shared/login';
import Settings from '../pages/shared/settings';
import ResetPassword from '../pages/shared/settings/resetpassword';
import SetPassword from '../pages/shared/settings/setpassword';
import Dashboard from '../pages/shared/dashboard';
import AccessError from '../pages/shared/accesserror';
import Error404 from '../pages/shared/error404';
import Client from '../pages/shared/client';
import FPAvailability from '../pages/shared/fpavailability';
import Employer from '../pages/shared/employer';
import Sla from '../pages/shared/sla';
import SlaUpdate from '../pages/shared/sla/Update';
import States from '../pages/shared/states';
import Expert from '../pages/shared/expert';
import ExpertAdd from '../pages/shared/expert/add';
import CaseStatusReportView from "../pages/shared/dashboard/pages/view";
import ViewAvailability from '../pages/shared/expert/viewavailability';

import {
  displayDashboardTabOption, hasDashboardAccess, hasSurveyAccess,
} from '../utils';
import CaseAssignmentTest from '../pages/shared/caseassignment';

const login =  {
  path: "/login",
  component: Login,
  exact: true
};

const settings =   {
  path: "/user/settings",
  exact: true,
  label: "Settings",
  icon: "navya-icon-settings",
  component: Settings
}

const resetpassword =   {
  path: "/resetpassword",
  exact: true,
  component: ResetPassword
}

const setpassword =   {
  path: "/setpassword",
  exact: true,
  component: SetPassword
}

const dashboard =   {
  path: "/user/dashboard",
  exact: true,
  label: "Dashboard",
  hideTabOptionCb: () => {return displayDashboardTabOption()},
  icon: 'ion-arrow-graph-up-right',
  component: Dashboard,
  permissions: ['can_view_dashboard'],
}

const accesserror =   {
  path: "/user/accesserror",
  exact: true,
  component: AccessError
}
const error404 = {
  path: "/404",
  exact: true,
  component: Error404
}
const states =   {
  path: "/user/states",
  exact: true,
  label: "FP State Assignment",
  icon: 'ion-map',
  component: States,
  permissions: ['can_view_fp_states'],
}

const icr10code =   {
  path: "/user/icr10code",
  exact: true,
  label: "ICR 10 Code",
  icon: 'ion-arrow-graph-up-right',
  component: SetPassword
}

const employers =   {
  path: "/user/employers",
  exact: true,
  label: "Employers",
  icon: 'ion-briefcase',
  component: Employer,
  permissions: ['can_view_employers'],
}

const physicians =   {
  path: "/user/physicians",
  exact: true,
  label: "Physicians",
  icon: 'ion-briefcase',
  component: SetPassword,
}

const clientmaster =   {
  path: "/user/clients",
  exact: true,
  label: "Clients",
  icon: 'ion-earth',
  component: Client,
  permissions: ['can_view_clients'],
}

const fpavailability  =   {
  path: "/user/fpavailability ",
  exact: true,
  label: "FP Business Hours",
  icon: 'ion-calendar',
  component: FPAvailability,
  permissions: ['can_view_fp_availability'],
}

const slamanagement =   {
  path: "/user/slamanagement",
  exact: true,
  label: "SLA Management",
  icon: 'ion-clock',
  component: Sla,
  permissions: ['can_view_sla'],
}

const slamanagementlist =   {
  path: "/user/slamanagement/:id",
  exact: true,
  label: "SLA Management",
  icon: 'ion-camera',
  component: Sla,
  permissions: ['can_edit_sla'],
}

const slaupdate =   {
  path: "/user/slamanagement/:employer_id/:client_id/:id",
  label: "SLA Management",
  exact: true,
  icon: 'ion-camera',
  component: SlaUpdate,
  permissions: ['can_edit_sla'],
}

const caseAssignmentTest =   {
  path: "/user/caseassignments",
  label: "Case Assignment",
  exact: true,
  icon: 'ion-camera',
  component: CaseAssignmentTest
}

const expert =   {
  path: "/user/expert",
  exact: true,
  label: "Experts",
  icon: 'ion-person',
  component: Expert,
  permissions: ['can_view_expert_list'],
}
const expertadd =   {
  path: "/user/expert/add",
  exact: true,
  label: "Experts",
  icon: 'ion-briefcase',
  component: ExpertAdd
}
const expertupdate =   {
  path: "/user/expert/update/:user_id",
  exact: true,
  label: "Experts",
  icon: 'ion-briefcase',
  component: ExpertAdd
}
const viewavailability = {
  path: "/user/expert/update/viewavailability/:expert_id",
  exact: true,
  label: "Experts",
  icon: 'ion-briefcase',
  component: ViewAvailability,
  permissions: ['can_view_physician_availability'],
}

const casestatusview = {
  path: "/user/dashboard/:viewtab/:survey_id",
  exact: true,
  label: "Pending Report",
  icon: "ion-camera",
  component: CaseStatusReportView,
  permissions: ['can_view_case_actions'],
};

export {
  settings,
  login,
  resetpassword,
  setpassword,
  dashboard,
  accesserror,
  error404,
  states,
  icr10code,
  employers,
  physicians,
  clientmaster,
  fpavailability,
  slamanagement,
  slaupdate,
  slamanagementlist,
  caseAssignmentTest,
  expert,
  expertadd,
  expertupdate,
  viewavailability,
  casestatusview
};
