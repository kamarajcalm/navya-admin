
import { isNavya, isAccessHope } from '../referrers';
import getNavyaRoutes from './navya';
import getAccessHopeRoutes from './accesshope';
import { hasOnlySurveyAccess, hasOnlyDashboardAccess, hasSurveyAndDashboardAccess } from '../utils';

const getLoggedInRoutes = () => {

  if (isNavya()) {
    return getNavyaRoutes();
  } else if(isAccessHope()){
    return getAccessHopeRoutes();
  }
  return getNavyaRoutes();
};

export default getLoggedInRoutes;
