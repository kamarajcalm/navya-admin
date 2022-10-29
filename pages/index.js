import React from 'react';
import cx from 'classnames';
import { Redirect, Route, withRouter } from 'react-router-dom';
import { IonRouterOutlet,IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import getLoggedInRoutes from '../routes';
import { isLoggedIn, getRedirectURLOnAppLoad, hasNoSurveyAndNoDashboardAccess } from '../utils';
import SideMenu from "../common/sidemenu";

class ExpertsPages extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      render: false
    }
  }
 
  getPermissionFlag = (route) => {
    return route.hasPermission ? route.hasPermission() : true;
  }

  render() {
    const DefaultRedirect = () => ([
      <Redirect exact from="/user" to={redirectURL}/>,
      <Redirect to={redirectURL || '/user/dashboard'} />
    ]);

    const loggedInRoutes = getLoggedInRoutes();
    // const HomeComponent = loggedInRoutes ? loggedInRoutes.tabs[0].component : null;

    const routes = []; 

      loggedInRoutes.routes.map((route, index) => {
        let permissionFlag = this.getPermissionFlag(route);
        if (permissionFlag) {
          routes.push(
            <Route
              path={route.path}
              render={props => <route.component {...props} />}
              exact={route.exact}
              key={`tab_route_${index}`}
            />
          )
        } else {
          <DefaultRedirect /> 
        }
      });

    const redirectURL = getRedirectURLOnAppLoad();

    return (
       <div>
        {
          isLoggedIn() ? <IonReactRouter>
            <IonSplitPane contentId="main">
              <SideMenu></SideMenu>
              <IonRouterOutlet id="main">
                {routes}
                <DefaultRedirect />
              </IonRouterOutlet>
            </IonSplitPane>
          </IonReactRouter> : <Redirect to={redirectURL} />
        }
        </div> 
    );
  }
}
export default withRouter(ExpertsPages);
