import React from "react";
import {
  IonPage,
  IonLoading,
  IonContent,
  withIonLifeCycle,
  IonSpinner,
  IonAlert,
} from "@ionic/react";
import { withRouter } from "react-router-dom";
import { canAccess } from "../../../../../utils";
import BreadCrumb from "../../../../../common/breadcrumb";
import Card from "../../../../../common/card";
import HeaderTitle from "../../../../../common/header_title";
import CaseInformationLayout from "./caseinformationlayout";
import api from "../../../../../api/endpoints";
import Dashboard from "material-table-ui/Dashboard";
import { getBreadCrumbData, tableDataFormat } from "./reportoption";
import AssignRevertQc from "./assignrevertqc";
import Decline from "./declineexpert";
import InviteExpert from "./inviteexpert";
import Button from "@material-ui/core/Button";

class CaseStatusReportView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      caseInformation: {
        case_id: null,
      },
      inviteButton: false,
      npAssinButton: false,
      mdAssignButton: false,
      showLoading: false,
      inviteShowModel: false,
      declineShowModel: false,
      accpeptLoading: false,
      revertLoading: false,
      survey_id: null,
      expert_id: null,
      modalTitle: null,
      heading: null,
      whichReport: null,
      showAlert: false,
      errorMessage: "",
      expertList: {
        result: [],
        columns: [],
      },
      npList: {
        result: [],
        columns: [],
      },
      mdList: {
        result: [],
        columns: [],
      },
      expertListButton: {
        title: "Status",
        field: "Actions",
        align: "center",
        cellStyle: {
          width: "370px",
        },
        render: (rowData) => (
          <>
            {rowData.status === "invited" &&
            (!rowData.decision ||
              rowData.decision === null ||
              rowData.decision === "-") ? (
              <div className="common-button fixed three-button">
                <>
                  {canAccess(["can_accept_case_for_expert"]) ? (
                    <Button
                      variant="contained"
                      onClick={() => this.acceptButtonClick(rowData)}
                      disabled={this.state.accpeptLoading}
                      type="button"
                      className="mr-2 mb-2 min-100 MuiButton-containedSuccess"
                    >
                      {this.state.accpeptLoading && (
                        <IonSpinner name="bubbles" color="light" />
                      )}
                      {!this.state.accpeptLoading && <span>Accept</span>}
                    </Button>
                  ) : null}
                </>
                <>
                  {canAccess(["can_reject_case_for_expert"]) ? (
                    <Button
                      color="primary"
                      onClick={() => this.declineButtonClick(rowData)}
                      variant="contained"
                      className="mb-2 mr-2 min-100"
                    >
                      Decline
                    </Button>
                  ) : null}
                </>
                <>
                  {canAccess(["can_remove_case_from_expert"]) ? (
                    <Button
                      color="secondary"
                      variant="contained"
                      onClick={() => this.revertButtonClick(rowData)}
                      type="button"
                      className="mr-2 mb-2 min-100"
                    >
                      {this.state.revertLoading && (
                        <IonSpinner name="bubbles" color="light" />
                      )}
                      {!this.state.revertLoading && <span>Revert</span>}
                    </Button>
                  ) : null}
                </>
              </div>
            ) : rowData.status === "completed" ? (
              <div>
                <p className="text-center">Completed</p>
              </div>
            ) : rowData.status === "revert" &&
              (rowData.decision === "reject" ||
                rowData.decision === "Reject") ? (
              <div>
                <p className="text-center">Rejected</p>
              </div>
            ) : rowData.status === "revert" &&
              (rowData.decision === "ignore" ||
                rowData.decision === "Ignore" ||
                rowData.decision === "accept" ||
                rowData.decision === "Accept") ? (
              <div>
                <p className="text-center">Reverted</p>
              </div>
            ) : rowData.status === "revert" &&
              (!rowData.decision ||
                rowData.decision === null ||
                rowData.decision === "-" ||
                rowData.decision === "") ? (
              <div>
                <p className="text-center">Reverted</p>
              </div>
            ) : rowData.status === "pending" ? (
              <div className="common-button">
                {canAccess(["can_revert_case_from_expert"]) ? (
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => this.revertButtonClick(rowData)}
                    disabled={this.state.revertLoading}
                    className="min-100"
                    type="button"
                  >
                    {this.state.revertLoading && (
                      <IonSpinner name="bubbles" color="light" />
                    )}
                    {!this.state.revertLoading && <span> Revert</span>}
                  </Button>
                ) : null}
              </div>
            ) : null}
          </>
        ),
      },
      npmdListButton: {
        title: "",
        field: "",
        align: "center",
        render: (rowData) => (
          <div className="common-button">
            {rowData.status == "pending" ? (
              <Button
                color="secondary"
                variant="contained"
                className="min-100"
                disabled={this.state.revertLoading}
                onClick={() => this.revertQcClick(rowData.qc_id)}
              >
                {this.state.revertLoading && (
                  <IonSpinner name="bubbles" color="light" />
                )}
                {!this.state.revertLoading && <span>Revert</span>}
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
  acceptButtonClick = async (row) => {
    let obj = {
      invite_decision: "accept",
      reject_reason: "",
      expert_id: row.expert_id,
      survey_id: row.survey_id,
    };
    this.setState({
      accpeptLoading: true,
    });
    try {
      let getData = await api.AcceptReject(obj);
      if (getData && getData.success) {
        this.getViewDetail();
        this.setState({
          accpeptLoading: false,
        });
      } else {
        this.setState({
          accpeptLoading: false,
          showAlert: true,
          errorMessage: getData.message,
        });
      }
    } catch (e) {
      this.setState({
        accpeptLoading: false,
      });
    }
  };

  revertButtonClick = async (row) => {
    let obj = {
      expert_id: row.expert_id,
      survey_id: row.survey_id,
    };
    this.setState({
      revertLoading: true,
    });
    try {
      let getData = await api.revertExpert(obj);

      if (getData && getData.success) {
        this.getViewDetail();
        this.setState({
          revertLoading: false,
        });
      } else {
        this.setState({
          revertLoading: false,
          showAlert: true,
          errorMessage: getData,
        });
      }
    } catch (err) {
      this.setState({
        revertLoading: false,
        showAlert: true,
        errorMessage: err.message,
      });
    }
  };
  qcClick = (title, heading, report) => {
    this.setState({
      assignRevertShowModel: true,
      modalTitle: title,
      heading: heading,
      whichReport: report,
    });
  };
  revertQcClick = async (qc_id) => {
    this.setState({
      revertLoading: true,
    });
    let obj = {
      qc_id: +qc_id,
      survey_id: +this.props.match.params.survey_id,
    };
    try {
      let getData = await api.assignOrRejectQc("revert_qc_user", obj);
      if (getData && getData.success) {
        this.setState({
          revertLoading: false,
        });
        this.getViewDetail();
      } else {
        this.setState({
          revertLoading: false,
          showAlert: true,
          errorMessage: getData.message,
        });
      }
    } catch (e) {
      this.setState({
        revertLoading: false,
      });
    }
  };
  inviteButtonClick = () => {
    this.setState({
      inviteShowModel: true,
    });
  };
  declineButtonClick = (row) => {
    this.setState({
      survey_id: row.survey_id,
      expert_id: row.expert_id,
      declineShowModel: true,
    });
  };

  onClose = (status) => {
    if (status) {
      this.getViewDetail();
    }
    this.setState({
      declineShowModel: false,
      survey_id: null,
      expert_id: null,
      inviteShowModel: false,
      assignRevertShowModel: false,
      modalTitle: null,
      heading: null,
      whichReport: null,
    });
  };

  getResultData = (data, whichtable) => {
    if (data.columns) {
      data.columns.forEach((element) => {
        delete element.status;
      });
      if (whichtable == "expert") {
        data.columns.push(this.state.expertListButton);
      } else if (whichtable == "np") {
        if (canAccess(["can_revert_case_from_np_qc"])) {
          data.columns.push(this.state.npmdListButton);
        }
      } else {
        if (canAccess(["can_revert_case_from_md_qc"])) {
          data.columns.push(this.state.npmdListButton);
        }
      }
    }

    if (data && data.result && data.result.length) {
      data.result = tableDataFormat(data.result);
    }
    return data;
  };

  getViewDetail = async () => {
    this.setState(
      {
        showLoading: true,
      },
      async () => {
        try {
          let obj = {
            org: "accesshope",
            survey_id: this.props.match.params.survey_id,
            case_data_reference: this.props.match.params.viewtab,
          };
          const response = await api.getCaseReportViewApi(obj);
          if (response && response.success) {
            this.setState({
              expertList: this.getResultData(
                response.data.expert_case_list,
                "expert"
              ),
              npList: this.getResultData(response.data.np_case_list, "np"),
              mdList: this.getResultData(response.data.md_case_list, "md"),
              inviteButton: response.data.is_enable_invite_button,
              npAssinButton: response.data.is_enable_np_assign_button,
              mdAssignButton: response.data.is_enable_md_assign_button,
              showLoading: false,
              caseInformation: response.data.case_information.result,
              revertShowModel: false,
            });
          } else {
            this.setState({ showLoading: false });
          }
        } catch (err) {
          this.setState({ showLoading: false });
        }
      }
    );
  };

  render() {
    const { case_id } = this.state.caseInformation;
    const { survey_id } = this.props.match.params;
    return (
      <IonPage>
        {!this.state.showLoading ? (
          <IonContent className="home-container" scrollEvents={true}>
            <div className="router-section">
              <BreadCrumb
                gobackurl={
                  getBreadCrumbData(this.props.match.params.viewtab).backUrl
                }
                notactivetitle="Case Status Reports"
                notactivesecondtitle={
                  getBreadCrumbData(this.props.match.params.viewtab).tabName
                }
                activetitle={case_id ? case_id : "Case Status Detail"}
              />
              <Card title={`AccessHope Case No. ${case_id ? case_id : "-"}`}>
                <HeaderTitle title="Details" />
                <CaseInformationLayout
                  surveyId={survey_id ? survey_id : null}
                  caseInformation={this.state.caseInformation}
                />
                <HeaderTitle title="Experts">
                  {this.state.inviteButton &&
                  canAccess(["can_invite_an_expert"]) ? (
                    <div className="common-button">
                      <Button
                        variant="contained"
                        onClick={this.inviteButtonClick}
                        type="submit"
                        className="MuiButton-containedSuccess"
                      >
                        Invite an Expert
                      </Button>
                    </div>
                  ) : null}
                </HeaderTitle>
                <div className="mb-4">
                  <Dashboard
                    title=" "
                    dict_mapped_data={this.state.expertList.result || []}
                    columns={this.state.expertList.columns || []}
                    bottomMargin={true ? 0 : 45}
                    clearFilter={false}
                    exportButton={false}
                    filtering={false}
                    grouping={false}
                    displayFullHeight={true}
                  />
                </div>
                <HeaderTitle title="NP QC">
                  {canAccess(["can_assign_case_to_np_qc"]) &&
                  this.state.npAssinButton ? (
                    <div className="common-button">
                      <Button
                        variant="contained"
                        type="button"
                        className="min-150 MuiButton-containedSuccess"
                        onClick={() =>
                          this.qcClick(
                            "Assign to NP",
                            "Nurse Practitioner",
                            "completed"
                          )
                        }
                      >
                        Assign to NP
                      </Button>
                    </div>
                  ) : null}
                </HeaderTitle>
                <div className="mb-4">
                  <Dashboard
                    title=" "
                    dict_mapped_data={this.state.npList.result || []}
                    columns={this.state.npList.columns || []}
                    bottomMargin={true ? 0 : 45}
                    clearFilter={false}
                    exportButton={false}
                    filtering={false}
                    grouping={false}
                    noDataText={"No NP Assigned for QC"}
                    displayFullHeight={true}
                  />
                </div>
                <HeaderTitle title="MD QC">
                  {canAccess(["can_assign_case_to_md_qc"]) &&
                  this.state.mdAssignButton ? (
                    <div className="common-button">
                      <Button
                        variant="contained"
                        type="button"
                        className="min-150 MuiButton-containedSuccess"
                        onClick={() =>
                          this.qcClick(
                            "Assign to AH MD",
                            "AH MD",
                            "qclist"
                          )
                        }
                      >
                        Assign to AH MD
                      </Button>
                    </div>
                  ) : null}
                </HeaderTitle>
                <Dashboard
                  title=" "
                  dict_mapped_data={this.state.mdList.result || []}
                  columns={this.state.mdList.columns || []}
                  bottomMargin={true ? 0 : 45}
                  clearFilter={false}
                  exportButton={false}
                  filtering={false}
                  grouping={false}
                  noDataText={"No MD Assigned for QC"}
                  displayFullHeight={true}
                />
              </Card>
            </div>
          </IonContent>
        ) : null}
        <IonLoading isOpen={this.state.showLoading} />
        <IonAlert
          isOpen={this.state.showAlert}
          onDidDismiss={() => this.setState({ showAlert: false })}
          message={this.state.errorMessage}
        />
        {this.state.inviteShowModel ? (
          <InviteExpert
            isOpen={this.state.inviteShowModel}
            onClose={this.onClose}
            modalTitle="Invite an Expert"
            heading="Expert"
            survey_id={this.props.match.params.survey_id}
          ></InviteExpert>
        ) : null}
        {this.state.declineShowModel ? (
          <Decline
            isOpen={this.state.declineShowModel}
            onClose={this.onClose}
            expert_id={this.state.expert_id}
            survey_id={this.props.match.params.survey_id}
          ></Decline>
        ) : null}
        {this.state.assignRevertShowModel ? (
          <AssignRevertQc
            isOpen={this.state.assignRevertShowModel}
            onClose={this.onClose}
            modalTitle={this.state.modalTitle}
            heading={this.state.heading}
            whichReport={this.state.whichReport}
            survey_id={this.props.match.params.survey_id}
          ></AssignRevertQc>
        ) : null}
      </IonPage>
    );
  }
}
export default withRouter(withIonLifeCycle(CaseStatusReportView));
