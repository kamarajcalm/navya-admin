import React from 'react';
import { IonRow, IonCol, IonLoading, IonPage, IonAlert } from "@ionic/react";
import Select from "react-select";
import { canAccess, isSmallScreen } from "../../../utils";
import localCache from '../../../api/localCache';
import api from "../../../api/endpoints";
import DataByPhysicianDashboard from './pages/data_by_physician';
import CaseStatusReportDashboard from './pages/case_status_reports';
import TotalCasesSentToFP from './pages/total_cases_sent_to_fp';
import FinanceReportsDashboard from './pages/finance_reports';
import { getReportOptions } from '../../../stubs/utility';
import './styles.scss';
class Dashboard extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      showMobileAlert: false,
      loading: false,
      selectedReport: { value: 'case_status_reports', label: 'Case Status Reports' },
      selectedPhysician: null,
      selectedFP: null,
      physicians: [],
      fpList: [],
      showPhysicianDropdown: false,
      showFpDropdown: false,
      expertId: null,
      fpNameTotalCasesSentToFP: null,
      fpNameFinance: null,
    };
  }

  async componentDidMount() {
    if (getReportOptions().length) {
      const [{ permissions, ...rest }] = getReportOptions();
      this.setState({ selectedReport: rest})
      this.handleChange('selectedReport', rest)
    }
    if (isSmallScreen()) {
      let show_mobile_alert = localCache.get('show_mobile_alert');
      if (!show_mobile_alert) {
        this.setState({ showMobileAlert: true })
      }
    }

    if (this.state.selectedReport.value === "data_by_physician") {
      this.setState({ loading: true })
      await this.getExpertListByOrgAdmin();
    }

    if (this.state.fpList && this.state.fpList.length === 0) {
      await this.loadFpListSilently();
    }
  }

  async loadFpListSilently() {
    await api.getprofile(); // temporarily add this to have automatic logout behavior
    let response = await api.getFPList({
      'org': 'accesshope',
    });
    if (response && response.success && response.data) {
      let fpList = response?.data;
      let finalOptions = [];
      fpList.forEach((val) => {
        finalOptions.push({ label: val.value, value: val.value })
      })
      const defaultOption = { value: fpList[0].value, label: fpList[0].value }
      this.setState({
        fpList: finalOptions,
        selectedFP: defaultOption,
      })
    }
  }

  handleChange = async (selectedOption, val) => {
    this.setState({ [selectedOption]: val }, async () => {
      switch (selectedOption) {
        case 'selectedReport':
          if (this.state.selectedReport.value === "data_by_physician") {
            this.setState({ showFpDropdown: false, loading: true }, async () => {
              await this.getExpertListByOrgAdmin();
            });
          }
          else if (this.state.selectedReport.value === "overall_fp_reports") {
            this.setState({ showPhysicianDropdown: false }, async () => {
              if (this.state.fpList && this.state.fpList.length > 0) {
                this.setState({
                  showFpDropdown: true,
                  fpNameTotalCasesSentToFP: this.state.selectedFP?.value,
                  loading: false
                })
              } else {
                await this.getFPListByOrgAdmin('fpNameTotalCasesSentToFP');
              }
            });
          }
          else if (this.state.selectedReport.value === 'finance_reports') {
            this.setState({ showPhysicianDropdown: false }, async () => {
              if (this.state.fpList && this.state.fpList.length > 0) {
                this.setState({
                  showFpDropdown: true,
                  fpNameFinance: this.state.selectedFP?.value,
                  loading: false
                })
              } else {
                await this.getFPListByOrgAdmin('fpNameFinance');
              }
            });
          }
          else if (this.state.selectedReport.value === 'case_status_reports' && selectedOption === 'selectedReport') {
            this.setState({ showPhysicianDropdown: false, showFpDropdown: false }, () => { });
          }
          break;
        case 'selectedPhysician':
          this.setState({ expertId: val.value });
          break;
        case 'selectedFP':
          if (this.state.selectedReport.value === 'finance_reports') {
            this.setState({
              showFpDropdown: true,
              fpNameFinance: val.value,
              loading: false
            })
          } else if (this.state.selectedReport.value === 'overall_fp_reports') {
            this.setState({
              showFpDropdown: true,
              fpNameTotalCasesSentToFP: val.value,
              loading: false
            })
          }
          break;
        default:
          break;
      }
    })
  }

  async getExpertListByOrgAdmin() {
    await api.getprofile(); // temporarily add this to have automatic logout behavior
    let response = await api.getOrgExperts({
      'org': 'accesshope',
      "include_test_users": 0,
      "include_inactive_experts": 1
    });
    if (response && response.success && response.data) {
      let expert_list = response?.data;
      let finalOptions = [];
      expert_list.forEach((val) => {
        finalOptions.push({ label: val.name, value: val.expert_id })
      })
      const defaultOption = { value: expert_list[0].expert_id, label: expert_list[0].name }
      this.setState({
        loading: false,
        physicians: finalOptions,
        selectedPhysician: defaultOption,
        showPhysicianDropdown: true,
        expertId: defaultOption.value
      })
    } else {
      this.setState({ loading: false });
    }
  }

  async getFPListByOrgAdmin(fpName) {
    await api.getprofile(); // temporarily add this to have automatic logout behavior
    let response = await api.getFPList({
      'org': 'accesshope',
    });
    if (response && response.success && response.data) {
      let fpList = response?.data;
      let finalOptions = [];
      fpList.forEach((val) => {
        finalOptions.push({ label: val.value, value: val.value })
      })
      const defaultOption = { value: fpList[0].value, label: fpList[0].value }
      this.setState({
        fpList: finalOptions,
        selectedFP: defaultOption,
        showFpDropdown: true,
        [fpName]: defaultOption.value,
        loading: false
      })
    } else {
      this.setState({ loading: false });
    }
  }

  hideMobileAlert() {
    this.setState({ showMobileAlert: false })
  }

  hideMobileAlertPermanently() {
    localCache.set("show_mobile_alert", false)
  }

  render() {
    return (
      <IonPage className='accesshope-dashboard-container'>
        <>
          {!this.state.loading && ( 
            <>
            {
              getReportOptions().length ? (
              <div>
              <ion-grid>
                <IonRow className='title-dropdown-container'>
                  <IonCol size="6">
                    <h6 style={{ fontWeight: 'bold' }}> {this.state.selectedReport?.label ? this.state.selectedReport.label : 'Data by Physician'}</h6>
                  </IonCol>
                  <IonCol size="3">
                    {this.state.showPhysicianDropdown && (
                      <Select
                        menuPortalTarget={document.body}
                        value={this.state.selectedPhysician}
                        onChange={(e) =>
                          this.handleChange("selectedPhysician", e)
                        }
                        options={this.state.physicians}
                        placeholder={"Select a Physician"}
                        theme={(theme) => ({
                          ...theme,
                          borderRadius: 10
                        })}
                      />
                    )}
                    {this.state.showFpDropdown && (
                      <Select
                        menuPortalTarget={document.body}
                        value={this.state.selectedFP}
                        onChange={(e) =>
                          this.handleChange("selectedFP", e)
                        }
                        options={this.state.fpList}
                        placeholder={"Select a FP"}
                        theme={(theme) => ({
                          ...theme,
                          borderRadius: 10
                        })}
                      />
                    )}
                  </IonCol>
                  <IonCol size="3">
                    {
                      (getReportOptions().length > 1 && canAccess(['view_cross_hospital'])) ?
                        <Select
                          menuPortalTarget={document.body}
                          value={this.state.selectedReport}
                          onChange={(e) => this.handleChange("selectedReport", e)}
                          options={getReportOptions()}
                          placeholder={"Select a Report"}
                          isOptionDisabled={(option) => option.isdisabled}
                          theme={(theme) => ({
                            ...theme,
                            borderRadius: 10
                          })}
                        /> : null
                    }
                  </IonCol>
                </IonRow>
              </ion-grid>
              {
                this.state.selectedReport?.value === 'data_by_physician' && this.state.showPhysicianDropdown && (
                  <ion-grid>
                    <DataByPhysicianDashboard
                      expertId={this.state.expertId}
                      org={"accesshope"}
                    />
                  </ion-grid>
                )
              }
              {
                this.state.selectedReport?.value === 'overall_fp_reports' && this.state.showFpDropdown && (
                  <ion-grid>
                    <TotalCasesSentToFP
                      fpName={this.state.fpNameTotalCasesSentToFP}
                      org={"accesshope"}
                    />
                  </ion-grid>
                )
              }
              {
                this.state.selectedReport?.value === 'finance_reports' && this.state.showFpDropdown && (
                  <ion-grid>
                    <FinanceReportsDashboard
                      fpName={this.state.fpNameFinance}
                      org={"accesshope"}
                    />
                  </ion-grid>
                )
              }
              {
                this.state.selectedReport?.value === 'case_status_reports' && (
                  <ion-grid>
                    <CaseStatusReportDashboard
                      expertId={this.state.expertId}
                      orgId={2}
                    />
                  </ion-grid>
                )
              }
            </div>) : null
            }</>
          )}
          <IonLoading isOpen={this.state.loading} />
        </>
        {this.state.showMobileAlert && <IonAlert
          isOpen={this.state.showMobileAlert}
          message={"This view is not optimized for mobile. We recommend you view on desktop.<br/><br />Dismiss to not see this message again."}
          buttons={[
            {
              text: 'OK',
              handler: () => {
                this.hideMobileAlert();
              }
            },
            {
              text: "DISMISS",
              handler: () => {
                this.hideMobileAlertPermanently();
              }
            }
          ]}
        />
        }
      </IonPage>
    );
  }
}

export default Dashboard;
