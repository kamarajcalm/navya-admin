import * as UnitRoutes from './unit';

const tabs = [
  UnitRoutes.dashboard,
  UnitRoutes.settings
];

const routes = [
  ...tabs,
  UnitRoutes.dashboard,
  UnitRoutes.accesserror
];

const getNavyaRoutes = () => {
  return {
    tabs, routes
  }
}

export default getNavyaRoutes;
