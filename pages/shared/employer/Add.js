import React from "react";
import { withRouter } from "react-router-dom";
import {
  IonPage,
  withIonLifeCycle,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonLoading,
} from "@ionic/react";
import { Form, Input, Select } from "@trendmicro/react-validation";
import IconButton from "@material-ui/core/IconButton";
import Switch from "@material-ui/core/Switch";

import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import api from "../../../api/endpoints";
import FormModal from "../../../common/formModal";
const Error = (props) => <div {...props} className="error-message" />;

export const required = (value, props, components) => {
  value = ("" + value).trim();
  if (!value) {
    return <Error>{"This field is required."}</Error>;
  }
};
class Add extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      clientDetail: {},
      client_: "",
      showLoading: false,
      loading: false,
      clientList: [],
      employer_name_list: [],
    };
  }

  componentDidMount() {
    this.setState({
      showLoading: true,
    });
    if (this.props.status && this.props.status == "update") {
      this.setState({
        clientDetail: this.props.clientDetail,
      });
      this.getClientWithEmployer(this.props.clientDetail);
    } else {
      this.addClick();
      this.setState({
        showLoading: false,
      });
    }
  }
  getClientWithEmployer = async (client) => {
    this.setState({
      showLoading: true,
    });

    try {
      let getData = await api.getClientWithEmployerApi(client.client_id);
      if (getData && getData.success) {
        let data = getData.data[0].employers;
        data.forEach((element) => {
          element.active = element.active == 1 ? true : false;
        });
        this.setState({
          showLoading: false,
          employer_name_list: data,
        });
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
  addClick = () => {
    let obj = {
      id: new Date(),
      name: "",
    };
    this.setState({
      employer_name_list: [...this.state.employer_name_list, obj],
    });
  };
  removeClick = (id) => {
    let { employer_name_list } = this.state;
    let removedList = employer_name_list.filter((x) => x.id != id);
    this.setState({
      employer_name_list: removedList,
    });
  };
  handleClose = () => {
    this.props.onClose(false);
  };
  handleChange = (e) => {
    this.setState({
      client_id: e.target.value,
    });
  };
  arrayChange = (e, index) => {
    const { employer_name_list } = this.state;
    employer_name_list[index].name = e.target.value;
    this.setState({
      employer_name_list,
    });
  };
  activeChange = (e, index) => {
    const { employer_name_list } = this.state;
    employer_name_list[index].active = e.target.checked;
    this.setState({
      employer_name_list,
    });
    this.forceUpdate();
  };

  addEmployer = async () => {
    let obj = {
      client_id: this.props.clientDetail.client_id,
      referrer_id: 10,
      employer_name_list: this.state.employer_name_list.map((x) => x.name),
    };
    this.setState({
      loading: true,
    });
    try {
      let getData = await api.addEmployerApi(obj);
      if (getData && getData.success) {
        this.setState({
          loading: false,
        });
        this.props.onClose(true);
      } else {
        this.setState({
          loading: false,
        });
      }
    } catch (e) {
      this.setState({
        loading: false,
      });
    }
  };
  updateEmployer = async () => {
    let employer = [];
    this.state.employer_name_list.forEach((element) => {
      employer.push(element);
    });
    employer.forEach((element) => {
      element.active = element.active ? 1 : 0;
    });
    this.setState({
      loading: true,
    });
    try {
      let getData = await api.updateEmployerApi(employer);
      if (getData && getData.success) {
        this.setState({
          loading: false,
        });
        this.props.onClose(true);
      } else {
        this.setState({
          loading: false,
        });
      }
    } catch (e) {
      this.setState({
        loading: false,
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
      if (this.props.status && this.props.status == "update") {
        this.updateEmployer();
      } else {
        this.addEmployer();
      }
    });
  };

  render() {
    const { client_name } = this.props.clientDetail;
    return (
      <IonPage className="login-container-page">
        {!this.state.showLoading ? (
          <FormModal
            isOpen={this.props.isOpen}
            modalTitle={
              this.props.status && this.props.status == "update"
                ? "Update Employers"
                : "Add Employers"
            }
            onClose={this.handleClose}
          >
            <Form
              ref={(node) => {
                this.form = node;
              }}
            >
              <IonGrid>
                <IonRow>
                  <IonCol size="4">
                    <label>Client Name</label>
                  </IonCol>
                  <IonCol size="8">
                    <div className="form-group">
                      <Input
                        className="form-control"
                        name="client_name"
                        value={client_name ? client_name : ""}
                        disabled
                        validations={[required]}
                      />
                    </div>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="4">
                    <label>Employers</label>
                  </IonCol>
                  <IonCol size="8">
                    {this.state.employer_name_list.map((item, index) => {
                      return (
                        <IonRow key={index}>
                          <IonCol size="10">
                            <div className="form-group">
                              <Input
                                className="form-control"
                                autoComplete="off"
                                name={"name_" + index}
                                value={item.name}
                                validations={[required]}
                                onChange={(e) => this.arrayChange(e, index)}
                              />
                            </div>
                          </IonCol>
                          <IonCol size="2">
                            {this.props.status &&
                            this.props.status == "update" ? (
                              <Switch
                                name={"active_" + index}
                                color="primary"
                                onChange={(e) => this.activeChange(e, index)}
                                className={item.active ? "checked" : null}
                                checked={item.active}
                              />
                            ) : (
                              <div className="text-right common-button">
                                {index == 0 ? (
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
                                    onClick={() => this.removeClick(item.id)}
                                  >
                                    <RemoveCircleOutlineIcon />
                                  </IconButton>
                                )}
                              </div>
                            )}
                          </IonCol>
                        </IonRow>
                      );
                    })}
                  </IonCol>
                </IonRow>
              </IonGrid>

              <div className="modal-footer text-right common-button">
                <Button
                  color="primary"
                  variant="contained"
                  type="button"
                  onClick={this.onSubmit}
                  disabled={this.state.loading}
                  className="min-100"
                >
                  {this.state.loading && (
                    <IonSpinner name="bubbles" color="light" />
                  )}
                  {!this.state.loading && (
                    <span>
                      {this.props.status && this.props.status == "update"
                        ? "Update"
                        : "Add"}
                    </span>
                  )}
                </Button>
              </div>
            </Form>
          </FormModal>
        ) : null}
        <IonLoading isOpen={this.state.showLoading} />
      </IonPage>
    );
  }
}
export default withRouter(withIonLifeCycle(Add));
