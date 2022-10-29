import React from "react";
import {
  IonPage,
  IonContent,
  withIonLifeCycle,
  IonLoading,
  IonAlert,
} from "@ionic/react";
import { withRouter } from "react-router-dom";
import api from "../../../api/endpoints";
import HeaderTitle from "../../../common/header_title";
import BreadCrumb from "../../../common/breadcrumb";
import moment from "moment";
import UpdateAvailability from "./updateavailability";
import CalendarView from "../../../common/calendar";
import Button from "@material-ui/core/Button";
import AddAvailability from "./addAvailability";
import {
  dateTimeFormatConversion,
  hasViewEditExpertAvailabilityAccess,
} from "../../../stubs/utility";

class ViewAvailability extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      updateModel: false,
      event: [],
      rowobj: [],
      fpTimezone: "",
      showAlert: false,
      alertMessage: "",
      weekOffDays: [],
      fpHolidays: [],
      expertAvailabilities: [],
      addShowModel: false,
      slotDate: "",
      fpAvailability: "",
      displayDate:'',
      expertName:""
    };
    this.hasEditAcess = hasViewEditExpertAvailabilityAccess("can_edit_physician_availability");
  }

  ionViewWillEnter() {
    this.getAvailability();
  }

  // changing months in calendar
  onChangeView = (dateObj) => {
    let weekOffList = this.getWeekOffDates(
      this.state.weekOffDays,
      new Date(dateObj)
    );
    let eventsList = this.expertAvaiabilityEvent(
      this.state.expertAvailabilities,
      this.state.fpHolidays,
      weekOffList
    );
    this.setState({
      event: eventsList,
    });
  };

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  // get dates for the particular day to create event
  getWeekOffDates = (weekOffArr, date) => {
    var d = date || new Date();
    var getTot = this.daysInMonth(d.getMonth() + 1, d.getFullYear()); //Get total days in a month
    var dateList = []; //Declaring array for inserting dateList

    for (var i = 1; i <= getTot; i++) {
      //looping through days in month
      var newDate = new Date(d.getFullYear(), d.getMonth(), i);
      let intDay = newDate.getDay() === 0 ? 6 : newDate.getDay() - 1; // to check phython js day integer difference
      if (weekOffArr.indexOf(intDay) !== -1) {
        let obj = {
          date: dateTimeFormatConversion("date", newDate),
          name: null,
          weekend: "weekend", //label for weekend
        };
        dateList.push(obj);
      }
    }
    return dateList;
  };

  // creating event array of objects for react-big-calendar
  expertAvaiabilityEvent = (eventData, holidays, weekoff) => {
    let expertAvailabilty = [...eventData, ...holidays, ...weekoff];

    expertAvailabilty.forEach((element) => {
      let dateVal = element.date ? element.date : element.availability_date;
      element.startandend = element.start_time ? element.start_time : null;
      element.label = element.name ? element.name : element.label;
      element.availability_date = dateTimeFormatConversion("date", dateVal);
      element.labelName = element.label ? element.label : null;
      element.start_time = dateTimeFormatConversion("view_availability_time",element.start_time);
      element.end_time = dateTimeFormatConversion("view_availability_time",element.end_time);

      // title - component to render inside date
      element.title = element.labelName ? (
        <p className="event-name">{element.labelName}</p>
      ) : (
        <div
          onClick={() => this.editavailabily(element)}
          className="event-name"
        >
          {element.start_time.concat(" - ", element.end_time)}
        </div>
      );

      element.start =
        element.startandend || element.labelName
          ? element.availability_date
          : null;
      element.end =
        element.startandend || element.labelName
          ? element.availability_date
          : null;
    });
    return expertAvailabilty;
  };

  getAvailability = async (displayDate) => {
    this.setState({ showLoading: true });
    let obj = {
      expert_id: this.props.match.params.expert_id,
    };
    console.log('displayDate',displayDate)
    try {
      let response = await api.getExpertAvailability(obj);
      if (response && response.success) {
        let weekOffList = this.getWeekOffDates(response.data.fp_weekend);
        let eventsList = this.expertAvaiabilityEvent(
          response.data.expert_availability,
          response.data.fp_holidays,
          weekOffList
        );
        this.setState({
          showLoading: false,
          event: eventsList,
          fpTimezone: response.data.fp_timezone,
          weekOffDays: response.data.fp_weekend,
          fpHolidays: response.data.fp_holidays,
          expertAvailabilities: response.data.expert_availability,
          fpAvailability: response.data.fp_availability,
          displayDate:displayDate,
          expertName:response.data.expert_name
        });
      } else {
        this.setState({
          showLoading: false,
        });
      }
    } catch (error) {
      this.setState({ showLoading: false });
    }
  };

  editavailabily = (row) => {
    if(this.hasEditAcess){
      var d = new Date();
      var todayDate = dateTimeFormatConversion("date", d);
      if (moment(row.availability_date).isSameOrAfter(todayDate)) {
        this.setState({ updateModel: true, rowobj: row });
      } else {
        // dont let edit the past dates
        this.setState({
          alertMessage: "Unable to edit past dates",
          showAlert: true,
        });
      }
    }
  };

  addAvailability = () => {
    this.setState({ addShowModel: true });
  };

  onCloseModal = () => {
    this.setState({ updateModel: false });
  };

  onCloseAddModal = () => {
    this.setState({ addShowModel: false, slotDate: "" });
  };

  hideAlert = () => {
    this.setState({ showAlert: false });
  };

  addSlotAvilability = (slotItem) => {
    //  add availability by slot in calender
    let slotDate = dateTimeFormatConversion("date", slotItem.start);
    var d = new Date();
    var todayDate = dateTimeFormatConversion("date", d);
    let weekendDateLists = this.getWeekOffDates(
      this.state.weekOffDays,
      slotItem.start
    );
    let checkDate = [...this.state.event, ...weekendDateLists].filter((x) => {
      return slotDate == x.availability_date || slotDate == x.date;
    });
    if (checkDate.length === 0 && moment(slotDate).isSameOrAfter(todayDate)) {
      this.setState({ addShowModel: true, slotDate: slotItem.start });
    }
    // to show weekend
    else if (checkDate.length > 0 && checkDate[0].weekend === "weekend") {
      this.setState({
        alertMessage:"The selected date falls on a weekend. Unable to edit availability on a weekend",
        showAlert: true,
      });
    }
    // past dates cant able to edit
    else if (checkDate.length === 0 && moment(slotDate).isBefore(todayDate)) {
      this.setState({
        alertMessage: "Unable to edit past dates",
        showAlert: true,
      });
    }
  };
  render() {
    return (
      <IonPage>
        {!this.state.showLoading && (
          <IonContent className="home-container" scrollEvents={true}>
            {!this.state.showLoading ? (
              <div className="router-section">
                <BreadCrumb
                  gobackurl={`/user/expert/`}
                  notactivetitle="Experts"
                  activetitle="View Availability"
                />
                <HeaderTitle title="Availability">
                  {this.hasEditAcess && (
                    <div className="common-button">
                      <Button
                        color="primary"
                        variant="contained"
                        type="button"
                        className="min-100"
                        onClick={() => this.addAvailability()}
                      >
                        Add Availability
                      </Button>
                    </div>
                  )}
                </HeaderTitle>
               <HeaderTitle title = {this.state.expertName}/>
              </div>
             
               
            ) : null}

            <>
              <CalendarView
                events={this.state.event}
                onNavigate={this.onChangeView}
                onAddAvilability={(item) => this.addSlotAvilability(item)}
                selectable={this.hasEditAcess}
                date={this.state.displayDate}
              />
            </>
          </IonContent>
        )}
        <IonAlert
          isOpen={this.state.showAlert}
          message={this.state.alertMessage}
          onDidDismiss={this.hideAlert}
          buttons={[
            {
              text: "OK",
              role: "cancel",
              cssClass: "navyaPink",
            },
          ]}
        />
        <IonLoading isOpen={this.state.showLoading} />
        {this.state.updateModel ? (
          <UpdateAvailability  
            isOpen={this.state.updateModel}
            onClose={this.onCloseModal}
            dataList={this.state.rowobj}
            expert_id={this.props.match.params.expert_id}
            recall={this.getAvailability}
            fpTimezone={this.state.fpTimezone}
            availability={this.state.fpAvailability}
          />
        ) : null}
        {this.state.addShowModel ? (
          <AddAvailability
            expertId={this.props.match.params.expert_id}
            isOpen={this.state.addShowModel}
            onClose={this.onCloseAddModal}
            recall={this.getAvailability}
            fpTimezone={this.state.fpTimezone}
            availability={this.state.fpAvailability}
            date={this.state.slotDate}
            disableDates={{holidays:this.state.fpHolidays,weekends:this.state.weekOffDays}}
          />
        ) : null}
      </IonPage>
    );
  }
}

export default withRouter(withIonLifeCycle(ViewAvailability));
