import * as UnitRoutes from './unit';
import {canAccess} from '../utils';

// AccessHope Routes

const tabs = [
  UnitRoutes.dashboard,

  // UnitRoutes.icr10code,

  // UnitRoutes.physicians,
  // UnitRoutes.clientmaster,
  UnitRoutes.employers,
  UnitRoutes.slamanagement,
  // UnitRoutes.caseAssignmentTest,
  UnitRoutes.states,
  UnitRoutes.expert,
  UnitRoutes.fpavailability,
  UnitRoutes.settings,
];

const routes = [
  ...tabs,
  UnitRoutes.dashboard,
  UnitRoutes.accesserror,
  UnitRoutes.clientmaster,
  UnitRoutes.employers,
  UnitRoutes.slamanagement,
  UnitRoutes.slaupdate,
  UnitRoutes.slamanagementlist,
  UnitRoutes.caseAssignmentTest,
  UnitRoutes.states,
  UnitRoutes.expert,
  UnitRoutes.expertadd,
  UnitRoutes.expertupdate,
  UnitRoutes.viewavailability,
  UnitRoutes.fpavailability,
  UnitRoutes.casestatusview,


]

const getAccessHopeRoutes = () => {
  return {
    tabs: tabs.filter((tab) => tab.permissions ? canAccess(tab.permissions) : true),
    routes: routes.filter((route) => route.permissions ? canAccess(route.permissions) : true),
  }
}

export default getAccessHopeRoutes;
