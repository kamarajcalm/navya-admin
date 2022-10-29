import React, { Component, Children } from "react";

import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "./style.scss";
import { dateTimeFormatConversion } from "../../stubs/utility";

export default class index extends Component {
  
  render() {
    const localizer = momentLocalizer(moment);
    const displayDate = this.props.date
      ? new Date(this.props.date)
      : new Date();

    const checkWeeEndHoliday = (value) => {
      let findElement = this.props.events.find(
        (x) => x.date === dateTimeFormatConversion("date", value)
      );
      if (findElement) {
        return true;
      }
      return false;
    };
    const ColoredDateCellWrapper = ({ children, value }) => {
      return React.cloneElement(Children.only(children), {
        style: {
          ...children.style,
          backgroundColor: checkWeeEndHoliday(value) ? "#dddddd" : "",
        },
      });
    };

    return (
      <Calendar
        views={{
          month: true,
        }}
        localizer={localizer}
        events={this.props.events}
        startAccessor="start"
        endAccessor="end"
        tooltipAccessor={(data) => data.name}
        onNavigate={this.props.onNavigate}
        showAllEvents={true}
        onSelectSlot={(slotInfo) => {
          this.props.onAddAvilability(slotInfo);
        }}
        selectable={this.props.selectable}
        defaultDate={displayDate}
        components={{
          dateCellWrapper: ColoredDateCellWrapper,
        }}
      />
    );
  }
}
