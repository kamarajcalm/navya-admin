import React from "react";
import {
  IonPage,
  IonContent,
  withIonLifeCycle,
  IonLoading,
  IonGrid,
  IonRow,
  IonCol,
  IonAlert,
  IonSpinner,
} from "@ionic/react";
import { withRouter } from "react-router-dom";
import api from "../../../api/endpoints";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { Form, Input, Select } from "@trendmicro/react-validation";

import HeaderTitle from "../../../common/header_title";
import Card from "../../../common/card";
import MultiSelectDropDown from "../../../common/multiSelectDropdown";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import {
  required,
  email,
  minlength,
  stringwithnumber,
} from "../../../common/formError";
import {
  dropDownFormat,
  userLicenseFormat,
  reqeustBodyArrayFormat,
} from "../../../common/dataFormat";
import BreadCrumb from "../../../common/breadcrumb";
import AddAvailability from "./addAvailability";

class ExpertAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      first_name: "",
      last_name: "",
      gender: "",
      email: "",
      npi: "",
      specialities: "",
      app_access: "",
      hospital_group: "",
      dmg: "",
      username: "",
      hospital: "",
      showLoading: false,
      dmgList: [],
      appAccessList: [],
      specialityList: [],
      hospitalList: [],
      countryList: [],
      stateList: [],
      showAlert: false,
      errorMessage: "",
      user_licenses: [],
      isSpecialist: true,
      isHospital: true,
      addShowModel:false,
      expertId:'',
      fpTimezone:'',
      fpAvailability:''
    };
  }
  ionViewWillEnter() {
    this.getCountryList();
    this.getStateList();
  }

  getSingleEXpert = async (id,expert_id) => {
    this.setState({
      showLoading: true,
    });

    try {
      let getData = await api.getSingleExpertApi(id,expert_id);
      if (getData && getData.success) {
        let data = getData.data.user;
        this.setState(
          {
            showLoading: false,
            first_name: data.first_name,
            last_name: data.last_name,
            gender: data.gender,
            email: data.email,
            username: data.username,
            npi: data.npi,
            expertId:data.expert_id,
            fpTimezone:data.fp_timezone,
            specialities: dropDownFormat(data.specialities),
            hospital: dropDownFormat([data.hospital]),
            user_licenses: userLicenseFormat(data.user_licenses),
            fpAvailability:data.fp_availability
          },
          () => {
            if (data.user_licenses && data.user_licenses.length === 0) {
              this.addClick();
            }
          }
        );
      } else {
        this.setState({
          showLoading: false,
        });
      }
    } catch (e) {
      this.setState({
        showLoading: false,
      });
    }
  };

  addExpert = async (data, status) => {
    let userLicenseCopy = this.state.user_licenses.map((x) => {
      return {
        country_id: +x.country_id,
        state_id: +x.state_id,
        state_name: x.state_name,
        user_license: x.user_license,
      };
    });
    let obj = {
      user_licenses: userLicenseCopy,
      dmg: reqeustBodyArrayFormat(this.state.dmg),
      specialities: reqeustBodyArrayFormat(this.state.specialities),
      first_name: data.first_name,
      last_name: data.last_name,
      gender: data.gender,
      email: data.email,
      npi: data.npi,
      hospital: reqeustBodyArrayFormat(this.state.hospital)[0],
    };

    this.setState({
      loading: true,
    });
    try {
      let getData;
      if (this.state.hospital && this.state.hospital.length) {
        if (status === "update") {
          obj.user_id = +this.props.match.params.user_id;
          obj.username = this.state.username;
          getData = await api.updateExpertApi(obj);
        } else {
          getData = await api.addExpertApi(obj);
        }

        if (getData && getData.success) {
          this.setState({
            loading: false,
          });

          this.gotoExpert();
        } else {
          this.setState({
            loading: false,
            showAlert: true,
            errorMessage: "User already exists",
          });
        }
      } else {
        this.setState({
          loading: false,
          showAlert: true,
          errorMessage: "Please Select Hospital",
        });
      }
    } catch (error) {
      this.setState({
        loading: false,
        showAlert: true,
        errorMessage: "User already exists",
      });
    }
  };

  onSubmit = () => {
    this.form.validate((err) => {
      // Error-first callback
      if (err) {
        return;
      }

      const values = this.form.getValues();
      if (this.props.match.params.user_id) {
        this.addExpert(values, "update");
      } else {
        this.addExpert(values, "add");
      }
    });
  };

  getCountryList = async () => {
    this.setState({
      showLoading: true,
    });
    try {
      let getData = await api.getListsForExpertAddApi("country");
      if (getData && getData.success) {
        this.setState(
          {
            countryList: getData.data ? getData.data : [],
            showLoading: false,
          },
          () => {
            if (this.props.match.params.user_id && this.props.history.location.state.expertId) {
              this.getSingleEXpert(this.props.match.params.user_id,this.props.history.location.state.expertId);
            } else {
              this.addClick();
            }
          }
        );

      } else {
        this.setState({
          showLoading: false,
        });
      }
    } catch (e) {
      this.setState({
        showLoading: false,
      });
    }
  };
  getStateList = async () => {
    try {
      let getData = await api.getListsForExpertAddApi("state");
      if (getData && getData.success) {
        this.setState({
          stateList: getData.data ? getData.data : [],
        });
      }
    } catch (e) {}
  };
  getSpecialityList = async () => {
    try {
      let getData = await api.getListsForExpertAddApi("speciality");
      if (getData && getData.success) {
        this.setState({
          specialityList: getData.data ? dropDownFormat(getData.data) : [],
          isSpecialist: false,
        });
      }
    } catch (e) {}
  };
  getHospitalList = async () => {
    try {
      let getData = await api.getListsForExpertAddApi("hospital");
      if (getData && getData.success) {
        this.setState({
          hospitalList: getData.data ? dropDownFormat(getData.data) : [],
          isHospital: false,
        });
      } else {
      }
    } catch (e) {}
  };
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  multiChange = (selectDropDown, value) => {
    this.setState({
      [selectDropDown]: value,
    });
  };
  multiForucs = (selectDropDown, value) => {
    const { isSpecialist, isHospital } = this.state;
    if (selectDropDown == "specialities" && isSpecialist) {
      this.getSpecialityList();
    }
    if (selectDropDown == "hospital" && isHospital) {
      this.getHospitalList();
    }
  };

  addClick = () => {
    const { countryList } = this.state;
    let obj = {
      id: new Date(),
      country_id: countryList[0].id,
      state_id: "",
      state_name: "",
      user_license: "",
      stateList: [],
    };
    this.setState({
      user_licenses: [...this.state.user_licenses, obj],
    });
  };
  removeClick = (id) => {
    let { user_licenses } = this.state;
    let removedList = user_licenses.filter((x) => x.id != id);
    this.setState({
      user_licenses: removedList,
    });
  };
  userLicenseChange = (e, index, keyname, stateLists) => {
    let userLicenseClone = [...this.state.user_licenses];
    userLicenseClone[index][keyname] = e.target.value;
    if (keyname === "country_id") {
      // this.getState(index, e.target.value);
    }
    if (keyname === "state_id") {
      let state_name =
        this.state.stateList &&
        this.state.stateList.find((x) => x.id === +e.target.value);
      userLicenseClone[index].state_name = state_name.value;
    }
    this.setState({
      userLicenseClone,
    });
  };
  getState = async (index, countryId) => {
    try {
      let getData = await api.getStateListApi(countryId);
      if (getData && getData.success) {
        const { user_licenses } = this.state;
        user_licenses[index].state_id = "";
        user_licenses[index].state_name = "";
        user_licenses[index].stateList = getData.data;
        this.setState({
          user_licenses,
        });
      } else {
      }
    } catch (e) {}
  };

  gotoExpert = () => {
    this.setState({
      user_licenses: [],
    });
    this.props.history.push("/user/expert");
  };

  // handle add availability modal
  onOpenModal=()=>{
    this.setState({ addShowModel : true })
  }

  onCloseModal=()=>{
    this.setState({ addShowModel : false })
  }
  viewAvailability = () =>{
    this.props.history.push({
      pathname:"/user/expert/update/viewavailability/" + this.state.expertId,
      state: {
        userID: this.props.match.params.user_id,
      },
    })
  }
  render() {
    let { specialityList, countryList, hospitalList, stateList } = this.state;
    return (
      <IonPage>
        {!this.state.showLoading && (
          <IonContent className="home-container" scrollEvents={true}>
            {!this.state.showLoading ? (
              <div className="router-section">
                <BreadCrumb
                  gobackurl="/user/expert"
                  notactivetitle="Experts"
                  activetitle={
                    this.props.match.params.user_id
                      ? "Update Expert"
                      : "Add Expert"
                  }
                />
                <HeaderTitle title="Expert"></HeaderTitle>
                <Card title="Details">
                  <IonGrid>
                    <Form
                      ref={(node) => {
                        this.form = node;
                      }}
                    >
                      <IonRow className="form-group">
                        <IonCol size="4">
                          <label>
                            First Name<span className="text-danger">*</span>
                          </label>
                        </IonCol>
                        <IonCol size="5">
                          <div>
                            <Input
                              name="first_name"
                              autoComplete="off"
                              value={this.state.first_name}
                              validations={[required]}
                              onChange={this.handleChange}
                              className="form-control"
                            />
                          </div>
                        </IonCol>
                      </IonRow>
                      <IonRow className="form-group">
                        <IonCol size="4">
                          <label>
                            Last Name<span className="text-danger">*</span>{" "}
                          </label>
                        </IonCol>
                        <IonCol size="5">
                          <div>
                            <Input
                              name="last_name"
                              autoComplete="off"
                              value={this.state.last_name}
                              validations={[required]}
                              onChange={this.handleChange}
                              className="form-control"
                            />
                          </div>
                        </IonCol>
                      </IonRow>
                      <IonRow className="form-group">
                        <IonCol size="4">
                          <label>
                            Gender<span className="text-danger">*</span>{" "}
                          </label>
                        </IonCol>
                        <IonCol size="5">
                          <div>
                            <Select
                              className="form-control"
                              autoComplete="off"
                              name="gender"
                              value={this.state.gender}
                              validations={[required]}
                              onChange={this.handleChange}
                            >
                              <option value="">Select Gender</option>
                              <option key={1} value="Male">
                                Male
                              </option>
                              <option key={2} value="Female">
                                Female
                              </option>
                            </Select>
                          </div>
                        </IonCol>
                      </IonRow>
                      <IonRow className="form-group no-margin">
                        <IonCol size="4">
                          <label>
                            User License<span className="text-danger">*</span>{" "}
                          </label>
                        </IonCol>
                        <IonCol size="8" style={{paddingLeft: 0}}>
                          {this.state.user_licenses.map((item, index) => {
                            return (
                              <IonRow key={index}>
                                <IonCol size="3" style={{display: "none"}}>
                                  <div className="form-group">
                                    <Select
                                      className="form-control"
                                      autoComplete="off"
                                      name={"country_id_" + index}
                                      value={item.country_id}
                                      validations={[required]}
                                      disabled
                                      onChange={(e) =>
                                        this.userLicenseChange(
                                          e,
                                          index,
                                          "country_id"
                                        )
                                      }
                                    >
                                      {!item.country_id ? (
                                        <option value="">Select Country</option>
                                      ) : null}
                                      {countryList &&
                                        countryList.map((item, index) => (
                                          <option key={index} value={item.id}>
                                            {item.sortname}
                                          </option>
                                        ))}
                                    </Select>
                                  </div>
                                </IonCol>
                                <IonCol size="3">
                                  <div className="form-group">
                                    <Select
                                      className="form-control"
                                      autoComplete="off"
                                      name={"state_id_" + index}
                                      value={item.state_id}
                                      validations={[required]}
                                      onChange={(e) =>
                                        this.userLicenseChange(
                                          e,
                                          index,
                                          "state_id",
                                          item.stateList
                                        )
                                      }
                                    >
                                      <option value="">Select State</option>
                                      {stateList &&
                                        stateList.map((item, index) => (
                                          <option key={index} value={item.id}>
                                            {item.value}
                                          </option>
                                        ))}
                                    </Select>
                                  </div>
                                </IonCol>
                                <IonCol size="5">
                                  <div className="form-group">
                                    <Input
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Enter License Number"
                                      name={"user_license_" + index}
                                      value={item.user_license}
                                      validations={[required]}
                                      onChange={(e) =>
                                        this.userLicenseChange(
                                          e,
                                          index,
                                          "user_license"
                                        )
                                      }
                                    />
                                  </div>
                                </IonCol>
                                <IonCol size="1">
                                  <div className="text-right common-button">
                                    {index === 0 ? (
                                      <IconButton
                                        color="primary"
                                        aria-label="add to shopping cart"
                                        onClick={this.addClick}
                                      >
                                        <AddCircleOutlineIcon />
                                      </IconButton>
                                    ) : (
                                      <IconButton
                                        color="secondary"
                                        aria-label="add an alarm"
                                        onClick={() =>
                                          this.removeClick(item.id)
                                        }
                                      >
                                        <RemoveCircleOutlineIcon />
                                      </IconButton>
                                    )}
                                  </div>
                                </IonCol>
                              </IonRow>
                            );
                          })}
                        </IonCol>
                      </IonRow>
                      <IonRow className="form-group">
                        <IonCol size="4">
                          <label>
                            Email<span className="text-danger">*</span>
                          </label>
                        </IonCol>
                        <IonCol size="5">
                          <div>
                            <Input
                              name="email"
                              autoComplete="off"
                              value={this.state.email}
                              disabled={this.props.match.params.user_id}
                              validations={[required, email]}
                              onChange={this.handleChange}
                              className="form-control"
                            />
                          </div>
                        </IonCol>
                      </IonRow>

                      <IonRow className="form-group">
                        <IonCol size="4">
                          <label>NPI (National Provider Identifier)</label>
                        </IonCol>
                        <IonCol size="5">
                          <div>
                            <Input
                              name="npi"
                              autoComplete="off"
                              value={this.state.npi}
                              onChange={this.handleChange}
                              className="form-control"
                            />
                          </div>
                        </IonCol>
                      </IonRow>

                      <IonRow className="form-group">
                        <IonCol size="4">
                          <label>Speciality</label>
                        </IonCol>
                        <IonCol size="5">
                          <div>
                            <MultiSelectDropDown
                              value={this.state.specialities}
                              onChange={(e) =>
                                this.multiChange("specialities", e)
                              }
                              onFocus={(e) =>
                                this.multiForucs("specialities", e)
                              }
                              options={specialityList}
                              placeholder={"Select Speciality"}
                              isMulti={true}
                            />
                          </div>
                        </IonCol>
                      </IonRow>
                      <IonRow className="form-group">
                        <IonCol size="4">
                          <label>
                            Foundational Partner
                            <span className="text-danger">*</span>
                          </label>
                        </IonCol>
                        <IonCol size="5">
                          <div>
                            <MultiSelectDropDown
                              value={this.state.hospital}
                              onChange={(e) => this.multiChange("hospital", e)}
                              onFocus={(e) => this.multiForucs("hospital", e)}
                              options={hospitalList}
                              placeholder={"Select Hospital"}
                              isMulti={true}
                            />
                          </div>
                        </IonCol>
                      </IonRow>
                      {this.props.match.params.user_id &&
                      <IonRow className="form-group">
                        <IonCol size="4">
                          <label>
                            Availability
                            <span className="text-danger">*</span>
                          </label>
                        </IonCol>
                        <IonCol size="5">
                          <div className="common-button">
                          <Button
                              color="primary"
                              variant="contained"
                              type="button"
                              className="min-100"
                              onClick={this.onOpenModal}
                            >
                              Add Availability
                            </Button>
                            <Button
                              color="primary"
                              variant="contained"
                              type="button"
                              className="ml-3 min-100"
                              onClick={this.viewAvailability}
                            >
                              View Availability
                            </Button>
                            </div>
                        </IonCol>
                      </IonRow>}
                      <IonRow className="form-group">
                        <IonCol size="4"></IonCol>
                        <IonCol size="5">
                          <div className="modal-footer text-right common-button">
                            <Button
                              color="secondary"
                              variant="contained"
                              type="button"
                              className="min-100"
                              onClick={this.gotoExpert}
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
                              {!this.state.loading && (
                                <span>
                                  {this.props.match.params.user_id
                                    ? "Update Expert"
                                    : "Confirm Details"}
                                </span>
                              )}
                            </Button>
                          </div>
                        </IonCol>
                      </IonRow>
                    </Form>
                  </IonGrid>
                </Card>
              </div>
            ) : null}
          </IonContent>
        )}
        <IonLoading isOpen={this.state.showLoading} />
        <IonAlert
          isOpen={this.state.showAlert}
          onDidDismiss={() => this.setState({ showAlert: false })}
          message={this.state.errorMessage}
        />
        {this.state.addShowModel ? (
          <AddAvailability
            expertId={this.state.expertId}
            isOpen={this.state.addShowModel}
            onClose={this.onCloseModal}
            fpTimezone={this.state.fpTimezone}
            availability={this.state.fpAvailability}
          />
        ) : null}
      </IonPage>
    );
  }
}

export default withRouter(withIonLifeCycle(ExpertAdd));

