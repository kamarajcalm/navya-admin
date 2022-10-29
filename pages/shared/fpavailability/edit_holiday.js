import React from "react";
import { withRouter } from "react-router-dom";
import {
  withIonLifeCycle,
  IonGrid,
  IonRow,
  IonCol,
  IonLoading,
} from "@ionic/react";
import Select from "react-select";
import { Checkbox, Button, TextField } from "@material-ui/core";
import api from "../../../api/endpoints";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { getDayNames, getTimeOptions } from '../../../stubs/utility';
import Icon from '@material-ui/core/Icon';

const Error = (props) => <div {...props} className="error-message" />;

export const required = (value, props, components) => {
  value = ("" + value).trim();
  if (!value) {
    return <Error>{"This field is required."}</Error>;
  }
};

class EditHoliday extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: true,
      showUpdateLoading: false,
      name: "",
      loading: false,
      timezone: null,
      checked: false,
      startDate: null,
      fpAvailability: [],
      availableTimezones: [],
      fpHolidaysOriginal: [],
      fpHolidays: [],
      holidayName: '',
      holidayDate: null,
      newHolidays: [{
        holiday_name: '',
        holiday_date: ''
      }],
      showAlert: false,
      showCancelAlert: false
    };
  }

  componentDidMount() {
    this.setState({ showLoading: true }, async () => {
      await this.getAvailableTimezones();
      await this.getFPHolidays(this.props.hospitalId);
      await this.getFPAvailability(this.props.hospitalId);
      this.setState({ showLoading: false })
    })
    this.setState({ timezone: this.props.timezone })
  }

  getAvailableTimezones = async () => {
    let payload = {};
    let response = await api.getAvailableTimezones(payload);
    if (response && response.success) {
      const finalResult = response.data.map((value, index) => {
        return { value: index, label: value }
      })
      this.setState({ availableTimezones: finalResult });
    } else {
      this.setState({ showLoading: false });
    }
  }

  getFPAvailability = async (id) => {
    let payload = { 'hospital_id': id };
    let response = await api.getFPAvailability(payload);

    if (response && response.success) {
      const uniqueData = Array.from(new Set(response.data.result.map(a => a.weekday)))
        .map(weekday => {
          return response.data.result.find(a => a.weekday === weekday)
        })
      this.setState({ fpAvailability: uniqueData });
    } else {
      this.setState({ showLoading: false });
    }
  }

  getFPHolidays = async (id) => {
    let payload = { 'hospital_id': id };
    let response = await api.getFPHolidays(payload);
    if (response && response.success) {
      this.setState({ fpHolidays: response.data.result, fpHolidaysOriginal: response.data.result });
    } else {
      this.setState({ showLoading: false });
    }
  }

  addFPHoliday = async () => {
    const { newHolidays } = this.state;

    let holidayDetails = {
      holiday_name: '',
      holiday_date: ''
    }

    const newHolidaysList = [...newHolidays, holidayDetails];
    this.setState({ newHolidays: newHolidaysList });
  }

  cancelClicked = async () => {
    this.props.onClose()
  }

  updateClicked = () => {
    this.setState({ showUpdateLoading: true }, async () => {
      await this.updateFPTimezone();
      await this.updateFPAvailability();
      await this.updateFPHoliday();
      this.setState({ showUpdateLoading: false });
    })
  }

  updateFPTimezone = async () => {
    let payload = {
      hospital_id: this.props.hospitalId,
      timezone: this.state.timezone.label
    }
    try {
      let response = await api.updateFPTimezone(payload);
      if (response && response.success) {
        // this.setState({ showLoading: false });
      }
    } catch (error) {
      this.setState({ showUpdateLoading: false });
    }
  }

  updateFPAvailability = async () => {
    let payload = {
      hospital_id: this.props.hospitalId,
      availability: [...this.state.fpAvailability]
    };
    try {
      let response = await api.updateFPAvailability(payload);
      if (response && response.success) {
        // this.setState({ showLoading: false });
      } else {
        // this.setState({ showLoading: false })
      }
    } catch (error) {
      this.setState({ showUpdateLoading: false });
    }
  }

  getDifference = (array1, array2, property) => {
    return array1.filter(object1 => {
      return !array2.some(object2 => {
        return object1[property] === object2[property];
      });
    });
  }

  updateFPHoliday = async () => {
    const { fpHolidays, newHolidays, fpHolidaysOriginal } = this.state;

    // code to get removed holidays
    const removedHolidays = this.getDifference(fpHolidaysOriginal, fpHolidays, 'holiday_id');
    let removableHolidayIds = removedHolidays.map((obj) => {
      return obj.holiday_id;;
    });

    // code to get updated holidays
    const holidayKeys = ['holiday_date', 'holiday_name'];
    let updatedHolidays = [];
    for (let i = 0; i < holidayKeys.length; i++) {
      const diff = this.getDifference(fpHolidays, fpHolidaysOriginal, holidayKeys[i]);
      if (diff && diff.length > 0) {
        updatedHolidays.push(...diff);
      }
    }
    let uniqueHolidays = [...new Map(updatedHolidays.map((item) => [item["holiday_id"], item])).values()];

    const payload = {
      hospital_id: this.props.hospitalId,
      add_holidays: newHolidays,
      remove_holidays: removableHolidayIds,
      update_holidays: uniqueHolidays,
    };

    try {
      let response = await api.updateFPMultipleHolidays(payload);
      if (response && response.success) {
        this.setState({ showUpdateLoading: false });
      } else {
        this.setState({ showUpdateLoading: false })
      }
    } catch (error) {
      this.setState({ showUpdateLoading: false });
    }
  }

  handleOpeningClosingTime = (property, value, e) => {
    const { fpAvailability } = this.state;
    let result = fpAvailability.map(v => {
      if (v.weekday === value) {
        return { ...v, [property]: e.value };
      } else {
        return v;
      }
    })
    this.setState({ fpAvailability: result });
  };

  handleChange = (selectedOption, val) => {
    this.setState({ [selectedOption]: val });
  }

  handleCheckBox = (item, e) => {
    const { fpAvailability } = this.state;
    if (e.target.checked) {
      const obj = {
        weekday: item.value,
        opening_time: "8:00 AM",
        closing_time: "6:00 PM"
      }
      this.setState({ fpAvailability: [...fpAvailability, obj] })
    } else {
      let result = fpAvailability.filter((obj) => {
        return obj.weekday !== item.value;
      });
      this.setState({ fpAvailability: result })
    }
  }

  handleHolidayName = (index, value) => {
    const { newHolidays } = this.state;
    const updatedHolidays = newHolidays.map((v, i) => {
      if (index === i) {
        return (
          {
            holiday_name: value,
            holiday_date: v.holiday_date,
          }
        );
      }
      else {
        return v;
      }
    });
    this.setState({ newHolidays: updatedHolidays })
  }

  handleHolidayDate = (index, value) => {
    const { newHolidays } = this.state;
    const updatedHolidays = newHolidays.map((v, i) => {
      if (index === i) {
        let newDate = value.toLocaleString(),
        year = new Date(newDate).getFullYear(),
        month = new Date(newDate).getMonth() + 1,
        date = new Date(newDate).getDate(),
        newDateFormat = `${year}-${month}-${date}`;
        return (
          {
            holiday_name: v.holiday_name,
            holiday_date: newDateFormat,
          }
        );
      }
      else {
        return v;
      }
    });
    this.setState({ newHolidays: updatedHolidays })
  }

  getWeekday = (value) => {
    const result = (element) => element.weekday === value;
    return this.state.fpAvailability.some(result);
  }

  getOpeningClosingTime = (property, value) => {
    let result = this.state.fpAvailability.filter(time => time.weekday === value);
    let timing = '';
    if (result && result.length > 0) {
      timing = result[0][property];
    }
    return {
      value: timing,
      label: timing
    };
  }

  deleteFPHoliday = async (isNewHoliday, holidayId) => {
    const { fpHolidays, newHolidays } = this.state;
    if (isNewHoliday) {
      let result = newHolidays.filter((obj, index) => {
        return index !== holidayId;
      });
      this.setState({ newHolidays: result });
    } else {
      let result = fpHolidays.filter((obj) => {
        return obj.holiday_id !== holidayId;
      });
      this.setState({ fpHolidays: result });
    }
  }

  updateSavedHolidays = async (holidayId, value, property) => {
    const { fpHolidays } = this.state;
    let result = fpHolidays.map(holiday => {
      if (holiday.holiday_id === holidayId) {
        return { ...holiday, [property]: value };
      } else return holiday;
    })
    this.setState({ fpHolidays: result });
  }

  renderDayColumns = () => {
    let weeksData = [{ label: 'Sunday', value: 0 }, { label: 'Monday', value: 1 }, { label: 'Tuesday', value: 2 }, { label: 'Wednesday', value: 3 }, { label: 'Thursday', value: 4 }, { label: 'Friday', value: 5 }, { label: 'Saturday', value: 6 }]

    const dayList = weeksData.map((item, index) => {
      const selectedDay = this.state.fpAvailability && this.state.fpAvailability.length > 0 && this.getWeekday(item.value);
      return (
        <div key={`${item.label}-${item.value}`} style={{ borderRadius: '10px', border: '1px solid #C4C4C4', marginBottom: '10px' }}>
          <div>
            <IonRow>
              <IonCol size="4">
                <Checkbox
                  checked={selectedDay}
                  onChange={event => this.handleCheckBox(item, event)}
                  inputProps={{ 'aria-label': 'controlled' }}
                  color="primary"
                />
                <span>{getDayNames(index)}</span>
              </IonCol>
              <IonCol size="8" style={{ display: 'flex' }}>
                <IonCol size="5">
                  <span>
                    <Select
                      menuPortalTarget={document.body}
                      value={this.getOpeningClosingTime('opening_time', item.value)}
                      onChange={(e) =>
                        this.handleOpeningClosingTime('opening_time', item.value, e)
                      }
                      options={getTimeOptions()}
                      placeholder={"0"}
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 10,
                      })}
                    />
                  </span>
                </IonCol>
                <IonCol size="1" style={{ alignSelf: 'center' }}>
                  <div style={{ borderTop: "2px solid black", width: "15px", height: "0px" }}></div>
                </IonCol>
                <IonCol size="5">
                  <span>
                    <Select
                      style={{ width: "90px" }}
                      menuPortalTarget={document.body}
                      value={this.getOpeningClosingTime('closing_time', item.value)}
                      onChange={(e) =>
                        this.handleOpeningClosingTime('closing_time', item.value, e)
                      }
                      options={getTimeOptions()}
                      placeholder={"0"}
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 10,
                      })}
                    />
                  </span>
                </IonCol>
              </IonCol>
            </IonRow>
          </div>
        </div>
      )
    });
    return dayList;
  }

  renderHolidays = () => {
    const holidayList = this.state.fpHolidays.map(holiday => {
      return (
        <IonRow key={`${holiday.holiday_id}`}>
          <IonCol size="5">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                inputVariant="outlined"
                value={holiday.holiday_date + "T00:00:00" || null}
                format="MMMM dd, yyyy"
                minDate={new Date(2018, 0, 1) || null}
                onChange={(date) => this.updateSavedHolidays(holiday.holiday_id, date, 'holiday_date')}
              />
            </MuiPickersUtilsProvider>
          </IonCol>
          <IonCol size="6">
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Name of Holiday"
              value={holiday.holiday_name}
              onChange={(e) => this.updateSavedHolidays(holiday.holiday_id, e.target.value, 'holiday_name')}
            />
          </IonCol>
          <IonCol size="1" style={{ textAlign: 'center', alignSelf: 'center' }} onClick={() => this.deleteFPHoliday(false, holiday.holiday_id)}>
            <Icon color="error" style={{ marginLeft: "-50px", marginTop: "15px", display: 'contents' }}>remove_circle_outline</Icon>
          </IonCol>
        </IonRow>
      )
    })
    return holidayList;
  }

  renderAddHoliday = () => {
    const { newHolidays } = this.state;
    const newHolidayList = newHolidays.map((holiday, index) => {
      return (
        <IonRow>
          <IonCol size="5">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                inputVariant="outlined"
                value={holiday.holiday_date || null}
                format="MMMM dd, yyyy"
                minDate={new Date() || null}
                onChange={(date) => this.handleHolidayDate(index, date)}
              />
            </MuiPickersUtilsProvider>
          </IonCol>
          <IonCol size="6">
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Name of Holiday"
              value={holiday.holiday_name}
              onChange={(e) => this.handleHolidayName(index, e.target.value)}
            />
          </IonCol>
          {
            this.state.newHolidays.length - 1 === index ? (
              <IonCol size="1" style={{ textAlign: 'center', alignSelf: 'center' }} onClick={() => this.addFPHoliday()}>
                <Icon color="primary" style={{ marginLeft: "-50px", marginTop: "15px", display: 'contents' }}>add_circle_outline</Icon>
              </IonCol>
            ) : (
              <IonCol size="1" style={{ textAlign: 'center', alignSelf: 'center' }} onClick={() => this.deleteFPHoliday(true, index)}>
                <Icon color="error" style={{ marginLeft: "-50px", marginTop: "15px", display: 'contents' }}>remove_circle_outline</Icon>
              </IonCol>
            )
          }
        </IonRow>
      )
    })
    return newHolidayList;
  }

  render() {
    return (
      <div className="edit-holiday-container">
        <div className="header">{this.props.fpName}</div>
        {!this.state.showLoading && (
          <IonGrid style={{ padding: '20px', fontSize: '14px' }}>
            <IonRow>
              <IonCol size="3">
                <h6>Time Zone</h6>
              </IonCol>
              <IonCol size="6">
                <Select
                  menuPortalTarget={document.body}
                  value={this.state.timezone}
                  onChange={(e) =>
                    this.handleChange('timezone', e)
                  }
                  options={this.state.availableTimezones}
                  placeholder={"Select one"}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 10
                  })}
                />
              </IonCol>
            </IonRow>
            <IonRow style={{ marginTop: '20px' }}>
              <IonCol size="3">
                <h6>Business Hours</h6>
              </IonCol>
              <IonCol size="6">
                {this.renderDayColumns()}
              </IonCol>
            </IonRow>
            <IonRow style={{ marginTop: '20px' }}>
              <IonCol size="3">
                <h6>Holidays</h6>
              </IonCol>
              <IonCol size="6">
                {this.state.fpHolidays && this.state.fpHolidays.length > 0 && this.renderHolidays()}
                {this.renderAddHoliday()}
              </IonCol>
            </IonRow>
            <div className="footer">
              <Button
                color="secondary"
                variant="contained"
                onClick={this.cancelClicked}
                className="min-100"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={this.updateClicked}
                className="min-100"
              >
                Update
              </Button>
            </div>
          </IonGrid>
        )
        }
        <IonLoading isOpen={this.state.showLoading} />
        <IonLoading isOpen={this.state.showUpdateLoading} />
      </div>
    );
  }
}

export default withRouter(withIonLifeCycle(EditHoliday));
