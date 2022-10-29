import React from "react";
import {
  IonPage,
  IonContent,
  withIonLifeCycle,
  IonLoading,
  IonSpinner,
} from "@ionic/react";
export const getUserTypeandStatus = (viewtab) => {
  switch (viewtab) {
    case "pending":
      return {
        userType: "expert",
        caseStatus: "invited",
        backUrl: "/user/dashboard?report=case&type=0",
      };
    case "accepted":
      return {
        userType: "expert",
        caseStatus: "pending",
        backUrl: "/user/dashboard?report=case&type=1",
      };
    case "rejected":
      return {
        userType: "expert",
        caseStatus: "revert",
        backUrl: "/user/dashboard?report=case&type=2",
      };
    case "completed":
      return {
        userType: "expert",
        caseStatus: "completed",
        backUrl: "/user/dashboard?report=case&type=3",
      };
    case "npqccompleted":
      return {
        userType: "np",
        caseStatus: "completed",
        backUrl: "/user/dashboard?report=case&type=4",
      };
    case "mdqccompleted":
      return {
        userType: "md",
        caseStatus: "completed",
        backUrl: "/user/dashboard?report=case&type=5",
      };
  }
};

export const dateFormat = (date) => {
  return new Date(date).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const tableDataFormat = (data) => {
  if (data && data.length) {
    data.forEach((element) => {
      element.expert_name = element.expert;
      element.assigned_date = element.assigned_date
        ? dateFormat(element["assigned_date"])
        : "-";
      element.accepted_date = element.accepted_date
        ? dateFormat(element["accepted_date"])
        : "-";
      element.completed_date = element.completed_date
        ? dateFormat(element["completed_date"])
        : "-";
      element.invited_date = element.invited_date
        ? dateFormat(element["invited_date"])
        : "-";
      element.rejected_date = element.rejected_date
        ? dateFormat(element["rejected_date"])
        : "-";
    });
  }
  return data;
};

import { canAccess } from "../../../../utils";
import Button from "@material-ui/core/Button";
import api from "../../../../api/endpoints";
export default class AllActionButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = { accpeptLoading: false };
  }
  componentDidMount() {
    console.log(this.props);
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
        this.setState({
          accpeptLoading: false,
        });
        this.props.onAccept(row.expert_id);
      } else {
        this.setState({
          accpeptLoading: false,
        });
      }
    } catch (e) {
      this.setState({
        accpeptLoading: false,
      });
    }
  };
  removeButtonClick = async (row) => {
    let obj = {
      expert_id: row.expert_id,
      survey_id: row.survey_id,
    };
    this.setState({
      revertLoading: true,
    });
    try {
      let getData = await api.removeExpert(obj);
      if (getData && getData.success) {
        this.props.onSuccess();
        this.setState({
          revertLoading: false,
        });
      } else {
        this.setState({
          revertLoading: false,
        });
      }
    } catch (e) {
      this.setState({
        revertLoading: false,
      });
    }
  };
  revertButtonClick = async (row) => {
    this.setState({
      revertLoading: true,
    });
    let obj = {
      invite_decision: "reject",
      reject_reason: "",
      expert_id: row.expert_id,
      survey_id: +row.survey_id,
    };
    let getData = await api.AcceptReject(obj);
    if (getData && getData.success) {
      this.setState({
        revertLoading: false,
      });
      this.props.onSuccess();
    } else {
      this.setState({
        revertLoading: false,
        apiError: true,
        errorMessage: getData.message,
      });
    }
  };
  declineButtonClick = () => {};
  render() {
    const { rowData, type } = this.props;
    return (
      <React.Fragment>
        {type == "pending" ? (
          <>
            {rowData.accepted ? (
              <div>
                <p className="text-center">Accepted</p>
              </div>
            ) : rowData.EMail_Status === "invited" &&
              (!rowData.decision || rowData.decision == null) ? (
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
                  {canAccess(["can_remove_case_from_expert"]) ? (
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => this.removeButtonClick(rowData)}
                      type="button"
                      className="mr-2 mb-2 min-100"
                    >
                      {this.state.revertLoading && (
                        <IonSpinner name="bubbles" color="light" />
                      )}
                      {!this.state.revertLoading && <span>Remove</span>}
                    </Button>
                  ) : null}
                </>
                <>
                  {canAccess(["can_reject_case_for_expert"]) ? (
                    <Button
                      color="secondary"
                      onClick={() => this.declineButtonClick(rowData)}
                      variant="contained"
                      className="mb-2 mr-2 min-100"
                    >
                      Decline
                    </Button>
                  ) : null}
                </>
              </div>
            ) : (
              <div>
                <p className="text-center">Rejected</p>
              </div>
            )}
          </>
        ) : null}
        {type == "accepted" ? (
          <>
            {rowData.EMail_Status === "pending" ? (
              <>
                <div className="common-button">
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => this.revertButtonClick(rowData)}
                    disabled={this.state.revertLoading}
                    className="min-150"
                    type="button"
                  >
                    {this.state.revertLoading && (
                      <IonSpinner name="bubbles" color="light" />
                    )}
                    {!this.state.revertLoading && (
                      <span> Revert From Expert</span>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-center">Rejected</p>
                </div>
              </>
            )}
          </>
        ) : null}
      </React.Fragment>
    );
  }
}
