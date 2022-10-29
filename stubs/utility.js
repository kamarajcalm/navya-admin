import { canAccess } from '../utils';
import moment from "moment";

export const getMonthOptions = () => {
    return [
        { value: "1", label: "January" },
        { value: "2", label: "February" },
        { value: "3", label: "March" },
        { value: "4", label: "April" },
        { value: "5", label: "May" },
        { value: "6", label: "June" },
        { value: "7", label: "July" },
        { value: "8", label: "August" },
        { value: "9", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" },
    ];
}

export const getReportOptions = () => {
    return [
        {
            value: "case_status_reports",
            label: "Case Status Reports",
            permissions: ['can_view_case_status_reports']
        },
        {
            value: "data_by_physician",
            label: "Data by Physician",
            permissions: ['can_view_data_by_physician', 'view_cross_hospital']
        },
        {
            value: "overall_fp_reports",
            label: "Overall FP Reports",
            permissions: ['can_view_fp_reports', 'view_cross_hospital']
        },
        // {
        //     value: "finance_reports",
        //     label: "Finance Reports",
        //     permissions: ['can_view_finance_reports', 'view_cross_hospital']
        // },
    ].filter((option) => canAccess(option.permissions));
}

export const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hr = d.getHours(),
        min = d.getMinutes(),
        sec = d.getSeconds();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    var onlyDate = [year, month, day].join('-');
    var onlyTime = [hr, min, sec].join(':');
    return [onlyDate, onlyTime].join(' ');
}

export const formatDateMDY = (date) => {
  let d = new Date(date + "T00:00:00");
  var onlyDate = new Date(d).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" })
  return onlyDate;
}

export const getDayNames = (id) => {
    switch (id) {
        case 0:
            return 'Monday';
        case 1:
            return 'Tuesday';
        case 2:
            return 'Wednesday';
        case 3:
            return 'Thursday';
        case 4:
            return 'Friday';
        case 5:
            return 'Saturday';
        case 6:
            return 'Sunday';
        default:
            break;
    }
}

export const getTimeOptions = () => {
    return [
      {
        value: '12:00 AM',
        label: '12:00 AM'
      },
      {
        value: '12:30 AM',
        label: '12:30 AM'
      },
      {
        value: '1:00 AM',
        label: '1:00 AM'
      },
      {
        value: '1:30 AM',
        label: '1:30 AM'
      },
      {
        value: '2:00 AM',
        label: '2:00 AM'
      },
      {
        value: '2:30 AM',
        label: '2:30 AM'
      },
      {
        value: '3:00 AM',
        label: '3:00 AM'
      },
      {
        value: '3:30 AM',
        label: '3:30 AM'
      },
      {
        value: '4:00 AM',
        label: '4:00 AM'
      },
      {
        value: '4:30 AM',
        label: '4:30 AM'
      },
      {
        value: '5:00 AM',
        label: '5:00 AM'
      },
      {
        value: '5:30 AM',
        label: '5:30 AM'
      },
      {
        value: '6:00 AM',
        label: '6:00 AM'
      },
      {
        value: '6:30 AM',
        label: '6:30 AM'
      },
      {
        value: '7:00 AM',
        label: '7:00 AM'
      },
      {
        value: '7:30 AM',
        label: '7:30 AM'
      },
      {
        value: '8:00 AM',
        label: '8:00 AM'
      },
      {
        value: '8:30 AM',
        label: '8:30 AM'
      },
      {
        value: '9:00 AM',
        label: '9:00 AM'
      },
      {
        value: '9:30 AM',
        label: '9:30 AM'
      },
      {
        value: '10:00 AM',
        label: '10:00 AM'
      },
      {
        value: '10:30 AM',
        label: '10:30 AM'
      },
      {
        value: '11:00 AM',
        label: '11:00 AM'
      },
      {
        value: '11:30 AM',
        label: '11:30 AM'
      },
      {
        value: '12:00 PM',
        label: '12:00 PM'
      },
      {
        value: '12:30 PM',
        label: '12:30 PM'
      },
      {
        value: '1:00 PM',
        label: '1:00 PM'
      },
      {
        value: '1:30 PM',
        label: '1:30 PM'
      },
      {
        value: '2:00 PM',
        label: '2:00 PM'
      },
      {
        value: '2:30 PM',
        label: '2:30 PM'
      },
      {
        value: '3:00 PM',
        label: '3:00 PM'
      },
      {
        value: '3:30 PM',
        label: '3:30 PM'
      },
      {
        value: '4:00 PM',
        label: '4:00 PM'
      },
      {
        value: '4:30 PM',
        label: '4:30 PM'
      },
      {
        value: '5:00 PM',
        label: '5:00 PM'
      },
      {
        value: '5:30 PM',
        label: '5:30 PM'
      },
      {
        value: '6:00 PM',
        label: '6:00 PM'
      },
      {
        value: '6:30 PM',
        label: '6:30 PM'
      },
      {
        value: '7:00 PM',
        label: '7:00 PM'
      },
      {
        value: '7:30 PM',
        label: '7:30 PM'
      },
      {
        value: '8:00 PM',
        label: '8:00 PM'
      },
      {
        value: '8:30 PM',
        label: '8:30 PM'
      },
      {
        value: '9:00 PM',
        label: '9:00 PM'
      },
      {
        value: '9:30 PM',
        label: '9:30 PM'
      },
      {
        value: '10:00 PM',
        label: '10:00 PM'
      },
      {
        value: '10:30 PM',
        label: '10:30 PM'
      },
      {
        value: '11:00 PM',
        label: '11:00 PM'
      },
      {
        value: '11:30 PM',
        label: '11:30 PM'
      },
    ]
  }

export const handleDateSorting = (value) => {
  if (value && value.trim().length > 0) {
    value = value.replace(new RegExp('/', 'g'), '-');
    let stringData = value.split('_')[0];
    stringData = stringData.split('-').reverse().join("-");
    value = new Date(stringData);
    return value;
  } else if (value == null) {
    return '';
  }
  return value;
  
}

export const getAvailabilityHours = (value, availabilityArr) =>{
  let findDay = value.getDay() === 0 ? 6 : value.getDay() - 1
  let getfphours = availabilityArr.filter((x)=>{
    return findDay === x.weekday  //filter to get object for weekday
  })
  if(getfphours.length > 0){
    let hoursStartTime = moment(`${getfphours[0].opening_time}`, "h:mm A").format('h:mm A') 
    let hoursEndTime = moment(`${getfphours[0].closing_time}`, "h:mm A").format('h:mm A') 
    var availabilityHours = getTimeOptions().filter((x)=>{return moment(hoursStartTime, "h:mm a").isSameOrBefore(moment(x.value,"h:mm a")) && moment(hoursEndTime, "h:mm a").isSameOrAfter(moment(x.value,"h:mm a"))})
    return availabilityHours
  }
 
 else{
  return []
 } 
}

export const dateTimeFormatConversion=(key,val)=>{
  let finalVal;
  switch(key){
    case "date":
      finalVal = moment(val).format("YYYY-MM-DD")
    break;
    case "time":
      finalVal = moment(`${val}`, "h:mm A").format("HH:mm:ss")
    break;
    case "view_availability_time":
      finalVal = moment(`${val}`, "h:mm A").format("h:mm A")
    break;
    default:
      finalVal = ''
  }
  return finalVal;
} 

export const hasViewEditExpertAvailabilityAccess =(key)=>{
  const userAccess = localStorage.getItem('user_permissions')
  const hasEditViewAccess = userAccess && JSON.parse(userAccess).includes(key)
  return hasEditViewAccess;
}
