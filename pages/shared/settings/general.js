
import React from 'react';
import {
  IonList, IonItem, IonLabel, IonContent, IonButton, IonAlert, IonLoading } from '@ionic/react';
import { withRouter, Redirect } from 'react-router-dom';
import { Plugins } from '@capacitor/core';
import api from '../../../api/endpoints';
import About from './about';
import ExpertUnavailability from './expertunavailability';
import { getAlertTitle, hasSurveyAccess } from '../../../utils';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './styles.scss';
import CheckCircle from "@material-ui/icons/CheckCircle";

class General extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      redirectURL: false,
      showLoading: false,
      showAlert: false,
      value: 'Copy Email Address',
      copied: false
    }
  }

  logout = async () => {
    // const info = await Plugins.Device.getInfo();
    api.logout(window.localStorage.getItem('deviceID'));
  }

  setShowLoading = (flag) => {
    this.setState({
      showLoading: flag
    })
  }

  setShowAlert = (flag) => {
    this.setState({
      showAlert: flag
    })
  }

  copyText = () => {
    this.setState({copied: true});

    setTimeout(() => {
      this.setState({copied: false});
    }, 2000);
  }

  render() {

    const hasDebugAccess = window.localStorage.getItem('has_debug_access') == 1;

    return(
      <div>
        <div className="general-container">
          <IonList>
            <IonItem>
              <IonLabel>
                <div>
                  <a href="mailto:AHExpertSupport@myaccesshope.org" target="_top" style={{display:'inline', marginRight:'30px'}}>Email AccessHope Support</a>
                  <CopyToClipboard text="AHExpertSupport@myaccesshope.org" onCopy={this.copyText}>
                      <button className="btn-action" style={{height:'30px'}}>Copy Email Address</button>
                  </CopyToClipboard>
                  <div style={{display:'inline', marginRight:'30px'}}>
                    {this.state.copied ?  <CheckCircle style={{ color: '#4ac5f7', verticalAlign: 'middle' }}/> : null}
                  </div>
                </div>
              </IonLabel>
            </IonItem>
            <IonItem onClick={this.logout}>
              <IonLabel>Log Out</IonLabel>
            </IonItem>
          </IonList>
        </div>

        <IonLoading
          isOpen={this.state.showLoading}
          onDidDismiss={() => this.setShowLoading(false)}
          message={'Please wait...'}
        />
      </div>
    );
  }
}

export default withRouter(General);
