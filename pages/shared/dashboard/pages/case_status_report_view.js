import React from "react";
import {
  IonPage,
  IonLoading,
  IonContent,
  withIonLifeCycle,
} from "@ionic/react";
import { withRouter } from "react-router-dom";
import { canAccess } from "../../../../utils";
import BreadCrumb from "../../../../common/breadcrumb";
import Card from "../../../../common/card";
import HeaderTitle from "../../../../common/header_title";
import CaseInformationLayout from "./caseinformationlayout";
import api from "../../../../api/endpoints";
import Dashboard from "material-table-ui/Dashboard";
import EnableButton from "./enable_button";
import { getUserTypeandStatus, tableDataFormat } from "./reportoption";
import AllActionButtons from './reportoption';
import Button from "@material-ui/core/Button";
class CaseStatusReportView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      caseInformation: {
        case_id: null,
      },
      showLoading: false,
      expertResultList: [],
      expertColumnList: [],
      viewReportResultList: [],
      viewReportColumnList: [],
      allActionButton: {
        title: "",
        field: "Actions",
       
        render: (rowData) => (
          <AllActionButtons rowData={rowData} type={this.props.match.params.viewtab} onAccept={this.onAccept} onSuccess={this.getViewDetail} />
        )
      },

      completedActionButon: {
        title: "",
        field: "",
        align: "center",
        render: (rowData) => (
          <div className="common-button">
            {rowData.status == "pending" &&
            canAccess(["can_revert_case_from_np_qc"]) ? (
              <Button
                color="secondary"
                variant="contained"
                className=" min-150"
                disabled={this.state.revertLoading}
                onClick={() => this.revertQcClick(rowData.qc_id)}
              >
                {this.state.revertLoading && (
                  <IonSpinner name="bubbles" color="light" />
                )}
                {!this.state.revertLoading && <span>Revert from NP</span>}
              </Button>
            ) : rowData.status == "revert" ? (
              "Reverted"
            ) : rowData.status == "completed" ? (
              "Completed"
            ) : (
              "-"
            )}
          </div>
        ),
      },
      npCompletedActionButton: {
        title: "",
        field: "",
        align: "center",
        render: (rowData) => (
          <div className="common-button">
            {rowData.status == "pending" &&
            canAccess(["can_revert_case_from_md_qc"]) ? (
              <Button
                color="secondary"
                variant="contained"
                className=" min-150"
                disabled={this.state.revertLoading}
                onClick={() => this.revertQcClick(rowData.qc_id)}
              >
                {this.state.revertLoading && (
                  <IonSpinner name="bubbles" color="light" />
                )}
                {!this.state.revertLoading && <span>Revert from AH MD</span>}
              </Button>
            ) : rowData.status == "revert" ? (
              "Reverted"
            ) : rowData.status == "completed" ? (
              "Completed"
            ) : (
              "-"
            )}
          </div>
        ),
      },
    };
  }

  ionViewWillEnter() {
    this.getViewDetail();
  }
  onAccept = (expert_id) => {
    let expertResultList = [...this.state.expertResultList];
    expertResultList.forEach((element) => {
      if (element.expert_id === expert_id) {
        element.accepted = true;
      }
    });
    this.setState({
      expertResultList
    })
  }
  getResultData = (data) => {
    const viewtab = this.props.match.params.viewtab;
    // viewtab value getting from params
    let resultData = [];
    switch (viewtab) {
      case 'npqccompleted' : resultData = data.np_case_list.result;
      break;
      case 'mdqccompleted' : resultData = data.md_case_list.result;
      break;
      default : resultData = data.expert_case_list.result;
    }
    console.log(resultData)
    return tableDataFormat(resultData)
  }
  getColumnData = (data) => {
   const viewtab = this.props.match.params.viewtab;
    let columnData = [];
    switch(viewtab) {
      case 'pending':
      case 'accepted':
      case 'rejected': columnData = [...data.expert_case_list.columns, this.state.allActionButton];
      break;
      case 'completed' : columnData = data.expert_case_list.columns;
      break;
      case 'npqccompleted' : columnData = data.np_case_list.columns;
      break;
      case 'mdqccompleted' : columnData = data.md_case_list.columns;
      break;
    }
    console.log(viewtab)
    console.log(columnData)
    return columnData;
  }

  getViewDetail = async () => {
    this.setState({
      showLoading: true,
    });
    let obj = {
      org: "accesshope",
      survey_id: this.props.match.params.survey_id,
      user_type: getUserTypeandStatus(this.props.match.params.viewtab).userType,
      case_status: getUserTypeandStatus(this.props.match.params.viewtab)
        .caseStatus,
    };
    const response = await api.getCaseReportViewApi(obj);
    if (response && response.success) {
      this.setState({
        expertResultList: this.getResultData(response.data),
        expertColumnList: this.getColumnData(response.data),
        showLoading: false,
        caseInformation: response.data.case_information.result,
        revertShowModel: false,
      });
    } else {
      this.setState({ showLoading: false });
    }
  };

  render() {
    const { case_id } = this.state.caseInformation;
    const { survey_id } = this.props.match.params;
    return (
      <IonPage>
        {!this.state.showLoading && (
          <IonContent className="home-container" scrollEvents={true}>
            <div className="router-section">
              <BreadCrumb
                gobackurl={
                  getUserTypeandStatus(this.props.match.params.viewtab).backUrl
                }
                notactivetitle="Case Status Reports"
                notactivesecondtitle="Accepted Cases"
                activetitle={case_id ? case_id : "Case Status Detail"}
              />
              <Card title={`AccessHope Case No. ${case_id ? case_id : "-"}`}>
                <HeaderTitle title="Details" />
                <CaseInformationLayout
                  surveyId={survey_id ? survey_id : null}
                  caseInformation={this.state.caseInformation}
                />
                <HeaderTitle title="Experts">
                  
                </HeaderTitle>
                {!this.state.showLoading ? (
                  <Dashboard
                    title=" "
                    dict_mapped_data={this.state.expertResultList || []}
                    columns={this.state.expertColumnList || []}
                    bottomMargin={45}
                    clearFilter={false}
                    exportButton={false}
                    filtering={false}
                    grouping={false}
                  />
                ) : null}
              </Card>
            </div>
          </IonContent>
        )}
       <IonLoading isOpen={this.state.showLoading} />
      </IonPage>
    );
  }
}
export default withRouter(withIonLifeCycle(CaseStatusReportView));
