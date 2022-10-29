import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import {
  IonPage,
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
import Icon from "@mui/material/Icon";
import Select from "react-select";
import {
  getAvailabilityHours,
  dateTimeFormatConversion,
} from "../../../stubs/utility";
import moment from "moment";

const Error = (props) => <div {...props} className="error-message" />;

export const required = (value, props, components) => {
  value = ("" + value).trim();
  if (!value) {
    return <Error>{"This field is required."}</Error>;
  }
};

const defaultObj = {
  availability_date: "",
  end_date: "",
  start_time: "",
  end_time: "",
  repeat: { label: "Single day", value: "no" },
  start_time_options: [],
  end_time_options: [],
};

const repeatOptions = [
  {
    label: "Single day",
    value: "no",
  },
  {
    label: "All working days",
    value: "all_working_days",
  },
  {
    label: "Repeat weekly",
    value: "repeat_every_weekday",
  },
  {
    label: "Repeat monthly",
    value: "repeat_every_month_day",
  },
];

class AddAvailability extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      name: "",
      loading: false,
      availabilityLists: [{ ...defaultObj }],
      isError: false,
      errorMessage: "",
    };
  }

  componentDidMount() {
    if (this.props.date) {
      this.onPreFillStartDate();
    }
  }

  // when adding availability by clicking on date in calendar
  onPreFillStartDate = () => {
    let newObj = { ...defaultObj, availability_date: this.props.date };
    let newAvailabilityList = [newObj];
    this.setState({ availabilityList: newAvailabilityList });
    let dateVal = this.props.date;
    this.updateAvailability("availability_date", dateVal, 0);
  };

  // validating whether all the fields are filled before add new roe or submit
  checkToAddNewAvailabilityRow = () => {
    const copiedAvailabilityList = [...this.state.availabilityLists];
    let requiredObj = copiedAvailabilityList[copiedAvailabilityList.length - 1];
    let duplicateObj = { ...requiredObj };
    delete duplicateObj.end_date;
    let canAddNewRow = Object.values(
      requiredObj.repeat.value === "no" ? duplicateObj : requiredObj
    ).every((val) => val !== "");
    return canAddNewRow;
  };

  addNewAavailability = () => {
    if (this.checkToAddNewAvailabilityRow()) {
      const copiedAvailabilityList = [...this.state.availabilityLists];
      copiedAvailabilityList.push({ ...defaultObj });
      this.setState({
        availabilityLists: copiedAvailabilityList,
        isError: false,
        errorMessage: "",
      });
    } else {
      this.setState({
        isError: true,
        errorMessage: "Please select all options",
      });
    }
  };

  updateAvailability = (key, value, index) => {
    // key=what key needs to update in availability list state,value= new val thats needs to be updated, index = array index
    const copiedAvailabilityList = [...this.state.availabilityLists];
    try {
      if (key === "availability_date") {
        // find availability hours for start time options in dropdown
        this.setState({ isError: false });
        let availabilityHours = getAvailabilityHours(
          new Date(value),
          this.props.availability
        );
        if (availabilityHours && availabilityHours.length>0) {
          copiedAvailabilityList[index].start_time_options = availabilityHours;
        } else {
          this.setState({
            isError: true,
            errorMessage:
              "The selected date falls on a weekend. Unable edit availability on a weekend.",
          });
        }
      }
      if (key === "start_time") {
        // updating end time options and clearing field
        copiedAvailabilityList[index].end_time = "";
        let newEndTimeOptions = copiedAvailabilityList[
          index
        ].start_time_options.filter((x) => {
          return moment(value.value, "h:mm a").isBefore(
            moment(x.value, "h:mm a")
          );
        });
        copiedAvailabilityList[index].end_time_options = newEndTimeOptions;
      }
      copiedAvailabilityList[index][key] = value; // updating values in the copied state array
      this.setState({ availabilityLists: copiedAvailabilityList });
    } catch (e) {
      console.log(e, "errr");
    }
  };

  deleteAvailability = (index) => {
    const copiedAvailabilityList = [...this.state.availabilityLists];
    copiedAvailabilityList.splice(index, 1);
    this.setState({ availabilityLists: copiedAvailabilityList });
  };

  handleClose = () => {
    this.props.onClose(false);
  };

  onSubmit = () => {
    if (this.checkToAddNewAvailabilityRow()) {
      const copiedAvailabilityList = [...this.state.availabilityLists];
      const availabilityArr = copiedAvailabilityList.map((obj) => {
        return {
          availability_date: dateTimeFormatConversion(
            "date",
            obj.availability_date
          ),
          end_date: obj.end_date
            ? dateTimeFormatConversion("date", obj.end_date)
            : "",
          start_time: dateTimeFormatConversion("time", obj.start_time.value),
          end_time: dateTimeFormatConversion("time", obj.end_time.value),
          repeat: obj.repeat.value,
        };
      });
      let payloadObj = {
        expert_id: this.props.expertId,
        availability: availabilityArr,
      };
      this.setState({ isError: false, errorMessage: "" });
      this.onAddExpertSurvey(payloadObj);
    } else {
      this.setState({
        isError: true,
        errorMessage: "Please select all options",
      });
    }
  };

  onAddExpertSurvey = async (payload) => {
    this.setState({ loading: true });
    let displayDate = payload.availability[payload.availability.length-1].availability_date
    const data = await api.createExpertAvailability(payload);
    if (data && data.success) {
      this.setState({ loading: false, isError: false });
      this.props.onClose(false);
      this.props.recall(displayDate);
    } else {
      let responseData = JSON.parse(data.message);
      this.setState({
        loading: false,
        isError: true,
        errorMessage: responseData.message,
      });
    }
    this.setState({ loading: false });
  };

  // disable holidays and weekends
  onDisableDate=(date)=>{
    const {holidays, weekends} = this.props.disableDates
    let findDay = date.getDay() === 0 ? 6 : date.getDay() - 1
    console.log(findDay,"check", date.getUTCDay())
    let holidayDates = holidays.map(x=>x.date)
    let isHolidayDate = holidayDates.includes(dateTimeFormatConversion('date',date))
    let isWeekendDate = weekends.includes(findDay)
    const isDisableDate = isHolidayDate || isWeekendDate
    return isDisableDate
  }

  renderAvailabilityLists = () => {
    var maxMonths = new Date();
    maxMonths.setMonth(maxMonths.getMonth() + 3);
    const availabilityList = this.state.availabilityLists.map(
      (availability, index) => {
        return (
          <IonRow>
            <IonCol size="11">
              <IonRow>
                <IonCol size="6">
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      inputVariant="outlined"
                      value={availability.availability_date || null}
                      format="MM-dd-yyyy"
                      minDate={new Date() || null}
                      placeholder="Start date"
                      shouldDisableDate={this.onDisableDate}
                      onChange={(date) =>
                        this.updateAvailability(
                          "availability_date",
                          date,
                          index
                        )
                      }
                      maxDate={maxMonths}
                    />
                  </MuiPickersUtilsProvider>
                </IonCol>
                <IonCol size="6">
                  <Select
                    placeholder="Select type"
                    options={repeatOptions}
                    value={availability.repeat}
                    onChange={(value) =>
                      this.updateAvailability("repeat", value, index)
                    }
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="4">
                  <Select
                    placeholder="Start time"
                    options={availability.start_time_options}
                    value={availability.start_time}
                    isDisabled={!availability.availability_date}
                    onChange={(time) =>
                      this.updateAvailability("start_time", time, index)
                    }
                  />
                </IonCol>
                <IonCol size="4">
                  <Select
                    placeholder="End time"
                    options={availability.end_time_options}
                    value={availability.end_time}
                    isDisabled={!availability.start_time}
                    onChange={(time) =>
                      this.updateAvailability("end_time", time, index)
                    }
                    isOptionDisabled={(option) => option.disabled}
                  />
                </IonCol>
                {availability.repeat.value !== "no" && (
                  <IonCol size="4">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        inputVariant="outlined"
                        value={availability.end_date || null}
                        format="MM-dd-yyyy"
                        placeholder="End date"
                        minDate={availability.availability_date || new Date()}
                        maxDate={maxMonths}
                        shouldDisableDate={this.onDisableDate}
                        onChange={(date) =>
                          this.updateAvailability("end_date", date, index)
                        }
                      />
                    </MuiPickersUtilsProvider>
                  </IonCol>
                )}
              </IonRow>
            </IonCol>
            <IonCol
              size="1"
              style={{ textAlign: "center", alignSelf: "center" }}
            >
              <Icon
                color={index === 0 ? "primary" : "error"}
                onClick={
                  index === 0
                    ? this.addNewAavailability
                    : () => this.deleteAvailability(index)
                }
                style={{
                  marginLeft: "-50px",
                  marginTop: "15px",
                  display: "contents",
                }}
              >
                {index === 0 ? "add_circle_outline" : "remove_circle_outline"}
              </Icon>
            </IonCol>
          </IonRow>
        );
      }
    );
    return availabilityList;
  };

  render() {
    return (
      <FormModal
        isOpen={this.props.isOpen}
        modalTitle="Add Availability"
        onClose={this.handleClose}
        modalClass="add-availability-modal"
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
                <label>Time Zone</label>
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
              <IonCol size="12">{this.renderAvailabilityLists()}</IonCol>
            </IonRow>
          </IonGrid>
          {this.state.isError && (
            <span className="apierror-message">{this.state.errorMessage}</span>
          )}
          <div className="modal-footer text-right common-button">
            <Button
              color="secondary"
              variant="contained"
              type="button"
              className="min-100"
              onClick={this.handleClose}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              type="button"
              onClick={this.onSubmit}
              disabled={this.state.loading}
              className="ml-3 min-100"
            >
              {this.state.loading && (
                <IonSpinner name="bubbles" color="light" />
              )}
              {!this.state.loading && <span>Submit</span>}
            </Button>
          </div>
        </Form>
      </FormModal>
    );
  }
}

export default withRouter(withIonLifeCycle(AddAvailability));
