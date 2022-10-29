import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  withIonLifeCycle,
  IonLoading,
  IonRow,
  IonCol,
  IonGrid,
  IonAlert,
  IonSpinner,
} from "@ionic/react";
import Select from "react-select";
import moment from "moment";
import Button from "@material-ui/core/Button";
import { withRouter } from "react-router-dom";
import HeaderTitle from "../../../common/header_title";
import Dashboard from "material-table-ui/Dashboard";
import "./index.scss";
import { slaOptions, productOptions } from "./dropdownOptions";
import api from "../../../api/endpoints";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";

const tableHead = [
  { title: "Sl no", field: "sl_no" },
  { title: "Name", field: "name" },
  { title: "FP", field: "fp" },
  { title: "Availability", field: "availability" },
  { title: "State", field: "state" },
  { title: "Sequence", field: "rank" },
];

class CaseAssignmentTest extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      pageSize: 5,
      loadingId: "",
      showAlert: false,
      alertMessage: "",
      loading: false,
      caseAssignmentTestFilters: [
        {
          label: "SLA*",
          value: "",
          type:'dropdown',
          options: slaOptions,
          id: "sla_validation_days",
          isRequired:true,
        },
        { label: "State*", value: "", type:'dropdown', options: "", id: "state_id", isRequired:true },
        {
          label: "Product*",
          value: "",
          options: productOptions,
          type:'dropdown',
          id: "product_type",
          isRequired:true,
        },
        { label: "Enter age*", type:'input', value: "", options: "", id: "patient_age", isRequired:true},
        {
          label: "Specialty*",
          value: "",
          options: "",
          type:'dropdown',
          id: "speciality_id",
          isRequired:true,
        },
        { label: "DMG*", value: "", type:'dropdown', options: "", id: "dmg_id", isRequired:true },
        { label: "Sub DMG", value: "", type:'dropdown', options: "", id: "sub_dmg_id", isRequired:false },
        { label: "Date", value: "", type:'date', options: "", id: "timestamp", isRequired: false },
      ],
      caseAssignmentTestData: [],
    };
  }

  setOptions = (data, key) => {
    if (data && data.success) {
      const dataArr = data.data.map((obj) => {
        return {
          ...obj,
          label:
            key === "dmg_id"
              ? obj.dmg
              : key === "sub_dmg_id"
              ? obj.sub_dmg
              : obj.value,
          value:
            key === "dmg_id"
              ? obj.dmg_id
              : key === "sub_dmg_id"
              ? obj.sub_dmg_id
              : obj.id,
        };
      });
      const newTestFilters = [...this.state.caseAssignmentTestFilters].map(
        (obj) => {
          return { ...obj, options: key === obj.id ? dataArr : obj.options };
        }
      );
      this.setState({ caseAssignmentTestFilters: newTestFilters });
    }
  };

  getOptions = async (key) => {
    let options = [...this.state.caseAssignmentTestFilters].filter(
      (val) => val.id === key
    )[0].options;
    if (!options || key === "sub_dmg_id") {
      this.setState({ loadingId: key });
      switch (key) {
        case "state_id":
          const stateData = await api.getStateListApi();
          this.setOptions(stateData, key);
          break;
        case "dmg_id":
          const dmgData = await api.getDmgListApi();
          this.setOptions(dmgData, key);
          break;
        case "sub_dmg_id":
          let dmgId = [...this.state.caseAssignmentTestFilters].filter(
            (val) => val.id === "dmg_id"
          )[0].value;
          let payload = { dmg_id: dmgId.value };
          const subDmgData = await api.getSubDmgListApi(payload);
          this.setOptions(subDmgData, key);
          break;
        case "speciality_id":
          const splData = await api.getSpecialityListApi();
          this.setOptions(splData, key);
          break;
        default:
          break;
      }
      this.setState({ loadingId: "" });
    }
  };

  updateTime = (date) => {
    this.setState({ date: date });
  };

  onAgeChange = (event) => {
    this.setState({ age: event.target.value });
  };

  // on filter dropdown change
  onChangeFilter = (value, id) => {
    if(id === 'patient_age'){
      var reg = new RegExp('^[0-9]*$');
      if(!reg.test(value) && value !== '')
      return;
    }
    const filterArr = [...this.state.caseAssignmentTestFilters].map(
      (option) => {
        return { ...option, value: id === "dmg_id" && option.id ==='sub_dmg_id' ? '' : option.id === id ? value : option.value };
      }
    );
    this.setState({ caseAssignmentTestFilters: filterArr });
  };

  //  on reset filter values
  onResetFilterValues = () => {
    const filterArr = [...this.state.caseAssignmentTestFilters].map(
      (option) => {
        return { ...option, value: "" };
      }
    );
    this.setState({
      caseAssignmentTestFilters: filterArr,
      caseAssignmentTestData: [],
    });
  };

  //  on Apply filter values
  onApplyFilterValues = async () => {
    const filterArr = [...this.state.caseAssignmentTestFilters];
    let reqObj = {};
    filterArr.map((option) => (option.value?reqObj[option.id] = option.value? option.type ==='input'? parseInt(option.value) : option.type ==='date' ? moment(option.value).utc().format("YYYY-MM-DD HH:mm:ss") : option.value.value: '':''));
    this.setState({ loading: true });
    try {
      let data = await api.getCaseAssignmentData(reqObj);
      if (data.data && "expert_list" in data.data) {
        const modifiedData = data.data.expert_list.map((obj, index) => {
          return { ...obj, sl_no: index + 1 };
        });
        this.setState({
          caseAssignmentTestData: modifiedData,
          loading: false,
          alertMessage: "",
          showAlert: false,
        });
      } else {
        this.setState({
          loading: false,
          caseAssignmentTestData: [],
          showAlert: true,
          alertMessage: data ? JSON.parse(JSON.stringify(data)).response.body.error : "Something went wrong",
        });
      }
    } catch (error) {
      this.setState({
        loading: false,
        caseAssignmentTestData: [],
        showAlert: true,
        alertMessage: error,
      });
    }
  };

  hideAlert = () => {
    this.setState({ showAlert: false });
  };

  render() {
    const {
      showLoading,
      caseAssignmentTestData,
      caseAssignmentTestFilters,
      age,
      date,
    } = this.state;

    const isEnalbeResetFilter =
      caseAssignmentTestFilters.some((option) => option.value !== "") ||
      age ||
      date;
    const isEnalbeApplyFilter = [...caseAssignmentTestFilters].filter(obj=>obj.isRequired).every((option) => option.value !== "");
    return (
      <IonPage>
        {!showLoading && (
          <IonContent className="home-container" scrollEvents={true}>
            <div className="router-section">
              <HeaderTitle title="Case assignment test">
                <div className="common-button"></div>
              </HeaderTitle>
              <IonGrid>
                <IonRow className="case-assignment-filter-row">
                  {caseAssignmentTestFilters.map((type, index) => {
                    return (
                      type.type==='dropdown' ? (
                        <IonCol key={index + type.label} sizeSm='6' sizeMd="4" sizeLg="3" sizeXl="3" sizeXs='12' size='3'>
                          <div className="form-group-select">
                            <Select
                              isLoading={this.state.loadingId === type.id}
                              onFocus={() => this.getOptions(type.id)}
                              placeholder={type.label}
                              onChange={(val) =>
                                this.onChangeFilter(val, type.id)
                              }
                              value={type.value}
                              options={type.options ? type.options : []}
                            />
                          </div>
                        </IonCol>
                      ) :
                      type.type === 'input' ? <IonCol sizeSm='6' sizeMd="4" sizeLg="3" sizeXl="3" sizeXs='12' size='3'>
                      <div>
                        <input
                          value={type.value}
                          onChange={(e) =>
                            this.onChangeFilter(e.target.value, type.id)
                          }
                          min='1'
                          max='120'
                          placeholder={type.label}
                          className="age-filter-input form-control"
                          type="number"
                        />
                      </div>
                    </IonCol> :
                    type.type==='date' ? <IonCol sizeSm='6' sizeMd="4" sizeLg="3" sizeXl="3" sizeXs='12' size='3'>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDateTimePicker
                        inputVariant="outlined"
                        value={type.value || null}
                        format="MMMM dd HH:mm"
                        placeholder="Select  date"
                        minDate={new Date() || null}
                        onChange={(date) =>
                          this.onChangeFilter(date, type.id)
                        }
                        className="date-input"
                      />
                    </MuiPickersUtilsProvider>
                  </IonCol>:''
                  )
                  })}
                </IonRow>
                <IonRow>
                  <IonCol size="12">
                    <div className="common-button end">
                      <Button
                        disabled={!isEnalbeResetFilter}
                        onClick={this.onResetFilterValues}
                        variant="contained"
                        size="medium"
                        className="mr-3 min-150 white"
                      >
                        {" "}
                        Reset Filters{" "}
                      </Button>
                      <Button
                        disabled={this.state.loading || !isEnalbeApplyFilter}
                        onClick={this.onApplyFilterValues}
                        variant="contained"
                        size="medium"
                        color="primary"
                        className="min-150"
                      >
                        {this.state.loading && (
                          <IonSpinner name="bubbles" color="light" />
                        )}
                        {!this.state.loading && <span> Apply Filters</span>}
                      </Button>
                    </div>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="12">
                    {!this.state.loading ? (
                      <Dashboard
                        title=" "
                        dict_mapped_data={caseAssignmentTestData || {}}
                        columns={tableHead || {}}
                        bottomMargin={45}
                        clearFilter={false}
                        exportButton={false}
                        filtering={false}
                        grouping={false}
                        noDataText="No expert assignment results yet. Please search using the options above."
                      />
                    ) : null}
                  </IonCol>
                </IonRow>
              </IonGrid>
            </div>
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
        <IonLoading isOpen={showLoading} />
      </IonPage>
    );
  }
}
export default withRouter(withIonLifeCycle(CaseAssignmentTest));
