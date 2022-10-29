import React from "react";
import { withRouter } from "react-router-dom";
import {
  withIonLifeCycle,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
} from "@ionic/react";
import { Form, Input } from "@trendmicro/react-validation";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { parseISO } from "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import api from "../../../api/endpoints";
import FormModal from "../../../common/formModal";

import Select from "react-select";
import moment from "moment";
import {
  getAvailabilityHours,
  dateTimeFormatConversion,
} from "../../../stubs/utility";

const Error = (props) => <div {...props} className="error-message" />;

export const required = (value, props, components) => {
  value = ("" + value).trim();
  if (!value) {
    return <Error>{"This field is required."}</Error>;
  }
};

class UpdateAvailability extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      name: "",
      loading: false,
      updateDate: this.props.dataList.availability_date,
      updateStartTime: {
        label: this.props.dataList.start_time,
        value: this.props.dataList.start_time,
      },
      updateEndTime: {
        label: this.props.dataList.end_time,
        value: this.props.dataList.end_time,
      },
      apiError: false,
      errorMessage: "",
      endTime: [],
      startTime: [],
    };
  }
  componentDidMount() {
    // find availability hours for time option
    let value = new Date(`${this.props.dataList.availability_date}`);
    let availabilityHours = getAvailabilityHours(
      value,
      this.props.availability
    );
    //start and end time for option
    let hideStartTime = availabilityHours ? availabilityHours : [];
    let hideEndTime = hideStartTime
      ? hideStartTime.filter((x) => {
          return moment(this.state.updateStartTime.value, "h:mm a").isBefore(
            moment(x.value, "h:mm a")
          );
        })
      : [];
    //update start and end time by selected option
    this.setState({
      startTime: hideStartTime,
      endTime: hideEndTime,
    });
  }
  updateavailabilityDate = (date) => {
    this.setState({
      updateDate: date,
      apiError: false,
    });
  };

  updateAvailabilityStartTime = (time) => {
    // update end time option by start time
    let hideEndTime = this.state.startTime.filter((x) => {
      return moment(time.value, "h:mm a").isBefore(moment(x.value, "h:mm a"));
    });
    this.setState({
      endTime: hideEndTime,
    });
    this.setState({
      updateStartTime: time,
      apiError: false,
      updateEndTime: "",
    });
  };

  updateAvailabilityEndTime = (time) => {
    this.setState({ updateEndTime: time, apiError: false });
  };

  handleClose = () => {
    this.props.onClose(false);
  };

  onSubmit = async () => {
    this.setState({ showLoading: true });

    let obj = {
      id: this.props.dataList.id,
      expert_id: this.props.expert_id,
      availability_date: dateTimeFormatConversion(
        "date",
        this.state.updateDate
      ),
      start_time: dateTimeFormatConversion(
        "time",
        this.state.updateStartTime.value
      ),
      end_time: dateTimeFormatConversion(
        "time",
        this.state.updateEndTime.value
      ),
    };

    try {
      let response = await api.expertUpdateAvailability(obj);
      if (response && response.success) {
        this.setState({ showLoading: false });
        this.props.onClose(false);
        this.props.recall(obj.availability_date);
      } else {
        let responseData = JSON.parse(response.message);
        this.setState({
          showLoading: false,
          apiError: true,
          errorMessage: responseData.message,
        });
      }
    } catch (error) {
      this.setState({ showLoading: false });
    }
  };

  deleteAvailability = async () => {
    this.setState({ showLoading: true });
    let obj = { id: this.props.dataList.id };
    try {
      let response = await api.deleteExpertAvailability(obj);
      if (response && response.success) {
        this.setState({
          showLoading: false,
        });
        this.props.recall(this.props.dataList.availability_date);
        this.props.onClose(false);
      } else {
        this.setState({ showLoading: false });
      }
    } catch (error) {
      this.setState({ showLoading: false });
    }
  };

  render() {
    const isEnabled = this.state.updateStartTime && this.state.updateEndTime;
    return (
      <FormModal
        isOpen={this.props.isOpen}
        modalTitle="Edit Availability"
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
              <IonCol size="3">
                <label>Availability</label>
              </IonCol>
              <IonCol size="9">
                <div className="form-group">
                  <Input
                    className="form-control"
                    disabled
                    value={this.props.fpTimezone}
                  />
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="12">
                <IonRow>
                  <IonCol size="4">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        inputVariant="outlined"
                        value={parseISO(this.state.updateDate) || null}
                        format="MM-dd-yyyy"
                        placeholder="End date"
                        disabled
                        minDate={this.state.updateDate || null}
                        onChange={(date) => this.updateavailabilityDate(date)}
                      />
                    </MuiPickersUtilsProvider>
                  </IonCol>
                  <IonCol size="4">
                    <Select
                      placeholder="Start time"
                      options={this.state.startTime}
                      value={this.state.updateStartTime || null}
                      onChange={(time) =>
                        this.updateAvailabilityStartTime(time)
                      }
                    />
                  </IonCol>
                  <IonCol size="4">
                    <Select
                      placeholder="End time"
                      options={this.state.endTime}
                      value={this.state.updateEndTime || null}
                      onChange={(time) => this.updateAvailabilityEndTime(time)}
                      isOptionDisabled={(option) => option.disabled}
                    />
                  </IonCol>
                </IonRow>
              </IonCol>
            </IonRow>
          </IonGrid>
          {this.state.apiError && (
            <span className="apierror-message">{this.state.errorMessage}</span>
          )}
          <div className="modal-footer text-right common-button">
            <Button
              color="secondary"
              variant="contained"
              type="button"
              className="min-100"
              onClick={this.deleteAvailability}
            >
              Delete
            </Button>
            <Button
              color="primary"
              variant="contained"
              type="button"
              onClick={this.onSubmit}
              disabled={!isEnabled || this.state.loading}
              className="ml-3 min-100"
            >
              {this.state.loading && (
                <IonSpinner name="bubbles" color="light" />
              )}
              {!this.state.loading && <span>Update</span>}
            </Button>
          </div>
        </Form>
      </FormModal>
    );
  }
}

export default withRouter(withIonLifeCycle(UpdateAvailability));
