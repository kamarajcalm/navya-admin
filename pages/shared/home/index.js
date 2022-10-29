
import React, { useState } from 'react';
import {
  IonPage, IonContent, withIonLifeCycle, IonLoading, IonItemDivider
} from '@ionic/react';
import { withRouter } from 'react-router-dom';
import { Header } from '../../../common';
import getStubForHome from '../../../stubs/home';
import api from '../../../api/endpoints';
import globalVars from '../../../globalVars';
import { getTabSubTabData, hasSurveyAndDashboardAccess, hasOnlySurveyAccess, hasOnlyDashboardAccess } from '../../../utils';
import { getAvatarStyles } from '../../../styles/avatars';
import './styles.scss';

function HomeComponent() {
  const [showLoading,setShowLoading] = useState(false);
  return ( 
    <IonPage>
        {
          !showLoading &&
          <IonContent className="home-container" fullscreen>Home</IonContent>
        }
        <IonLoading isOpen={showLoading} />
    </IonPage>
  );
}

//export default withRouter(withIonLifeCycle(HomeComponent));
export default withRouter(HomeComponent);

