import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import {
  withIonLifeCycle,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
} from "@ionic/react";
import { Form, Input, Select } from "@trendmicro/react-validation";
import Button from "@material-ui/core/Button";
import api from "../../../../../api/endpoints";
import FormModal from "../../../../../common/formModal";
const Error = (props) => <div {...props} className="error-message" />;
const rejectReasonLists = [
  { name: "rejectReason", value: "Not my speciality" },
  { name: "rejectReason", value: "High caseload right now" },
  { name: "rejectReason", value: "Not interested" },
  { name: "rejectReason", value: "Other" },
];

export const required = (value, props, components) => {
  value = ("" + value).trim();
  if (!value) {
    return <Error>{"This field is required."}</Error>;
  }
};
class Decline extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      name: "",
      selectedReason: "",
      otherComments: "",
      needMoreInformation: false,
    };
  }

  componentDidMount() {
    if (this.props.singleClient) {
      this.setState({
        name: this.props.singleClient.name,
      });
    }
  }
  handleClose = () => {
    this.props.onClose(false);
  };

  handleChange = (e) => {
    this.setState({
      otherComments: e.target.value,
    });
  };

  onChangeReason = (e) => {
    this.setState({
      selectedReason: e.target.value,
    });
  };

  rejectExpert = async () => {
    let obj = {
      invite_decision: "reject",
      reject_reason:
        this.state.selectedReason !== "Other"
          ? this.state.selectedReason
          : this.state.otherComments,
      expert_id: this.props.expert_id,
      survey_id: this.props.survey_id,
    };
    this.setState({
      showLoading: true,
    });
    try {
      let getData = await api.AcceptReject(obj);
      if (getData && getData.success) {
        this.setState({
          showLoading: false,
          selectedReason: "",
          otherComments: "",
          needMoreInformation: false,
        });
        this.props.onClose(true);
      } else {
        this.setState({
          showLoading: false,
          selectedReason: "",
          otherComments: "",
          needMoreInformation: false,
        });
      }
    } catch (e) {
      this.setState({
        showLoading: false,
      });
    }
  };

  render() {
    const isEnable =
      (this.state.selectedReason === "Other" &&
        this.state.otherComments.trim().length > 0) ||
      (this.state.needMoreInformation && this.state.otherComments > 0) ||
      (this.state.selectedReason !== "Other" &&
        this.state.selectedReason.length > 0);
    return (
      <FormModal
        isOpen={this.props.isOpen}
        modalTitle="Case Rejection"
        onClose={this.handleClose}
      >
        <Form
          ref={(node) => {
            this.form = node;
          }}
          onValidate={(err) => {
            if (err) {
              return;
            }
          }}
        >
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <p>Please enter the reason for rejecting the case</p>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol size="12">
                {rejectReasonLists.map((obj, index) => (
                  <IonRow key={index + obj.value}>
                    <label className="mb-2">
                      <input
                        type="radio"
                        name={obj.name}
                        className="mr-2"
                        value={obj.value}
                        onChange={this.onChangeReason}
                      />
                      <span className="">{obj.value}</span>
                    </label>
                  </IonRow>
                ))}
                {this.state.selectedReason === "Other" ? (
                  <IonRow>
                    <textarea
                      value={this.state.otherComments}
                      onChange={this.handleChange}
                      rows={5}
                      maxLength="200"
                      className="form-control"
                    />
                  </IonRow>
                ) : (
                  ""
                )}
                {this.state.selectedReason === "Other" && (
                  <IonRow>
                    <p className="word-count">
                      {this.state.otherComments.length}/200
                    </p>
                  </IonRow>
                )}
              </IonCol>
            </IonRow>
          </IonGrid>

          <div className="modal-footer text-right common-button">
            <Button
              variant="contained"
              type="button"
              onClick={this.rejectExpert}
              disabled={isEnable ? false : true}
              className="mr-3 min-100 blue"
            >
              {this.state.showLoading && (
                <IonSpinner name="bubbles" color="light" />
              )}
              {!this.state.showLoading && <span>Submit</span>}
            </Button>
            <Button
              variant="outlined"
              type="button"
              onClick={this.handleClose}
              className="min-100"
            >
              Cancel
            </Button>
          </div>
        </Form>
      </FormModal>
    );
  }
}

export default withRouter(withIonLifeCycle(Decline));
