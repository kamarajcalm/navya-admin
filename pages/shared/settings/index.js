
import React from 'react';
import { IonPage, withIonLifeCycle } from '@ionic/react';
import { withRouter } from 'react-router-dom';
import { Header, Tabs } from '../../../common';
import globalVars from '../../../globalVars';
import General from './general';
import Profile from './profile';
import './styles.scss';

class SettingsComponent extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = { profile: null }
    this.mounted = null;
  }

  redirectToLogin = () => {
    this.props.history.push('/login');
  }

  getSettingsTabsList() {
    const settingsTabList = [
      {
        tabLabel: {
          name: "General",
          class: 'settings-tab',
        },
        tabDataComponent: {
          name: General,
          props: {
            currentTabIndex: 0,
            parentTabIndex: 0,
            isSubTab: 0
          }
        }
      },
      {
        tabLabel: {
          name: "Profile",
          class: 'settings-tab',
        },
        tabDataComponent: {
          name: Profile,
          props: {
            currentTabIndex: 0,
            parentTabIndex: 1,
            isSubTab: 0
          }
        }
      }
    ];
    return settingsTabList;
  }

  ionViewDidEnter() {
    window.alertShownCounter = 0;
  }

  render() {

    const settingsTabList = this.getSettingsTabsList();
    return (
      <IonPage>
          <Tabs
            wrapperClass="settings-tabs"
            tabObj={{currentTabIndex:0, parentTabIndex:0, isSubTab: 0}}
            data={settingsTabList}
            type="settings"
          />

      </IonPage>
    )
  }
}

export default withRouter(withIonLifeCycle(SettingsComponent));
