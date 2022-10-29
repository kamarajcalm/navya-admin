import React from "react";
import {
  IonPage,
  IonContent,
  withIonLifeCycle,
  IonLoading,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner
} from "@ionic/react";
import { withRouter } from "react-router-dom";
import api from "../../../api/endpoints";
import Button from "@material-ui/core/Button";
import { Form, Input, Select } from "@trendmicro/react-validation";
import HeaderTitle from "../../../common/header_title";
import Card from "../../../common/card";

const Error = (props) => <div {...props} className="error-message" />;

export const required = (value, props, components) => {
  value = ("" + value).trim();
  if (!value) {
    return <Error>{"This field is required."}</Error>;
  }
};
class Update extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      loading: false,
      employerSlaDetail: {},
      APO: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    };
  }

  componentDidMount() {
    this.forceUpdate();
    if (this.props.match.params) this.getEmployerSla(this.props.match.params);
  }

  componentDidUpdate(prevProps) {
    let oldId = prevProps.match.params.id;
    let newId = this.props.match.params.id;
    if (newId !== oldId) {
      this.getEmployerSla(this.props.match.params);
    }
  }

  updateEmployerSal = async (data) => {
    let obj = {
      request_type: "update",
      data: {
        client_id: this.state.employerSlaDetail.client_id,
        employer_id: this.state.employerSlaDetail.employer_id,
        referrer_id: 10,
        APO: data.APO,
        EAR: data.EAR,
      },
    };
    this.setState({
      loading: true,
    });
    try {
      let getData = await api.updateEmployerSlaApi(obj);
      if (getData && getData.success) {
        this.setState({
          loading: false,
        });
       this.gotoSla();
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
      this.updateEmployerSal(values);
    });
  };

  getEmployerSla = async (params) => {
    this.setState({
      showLoading: true,
    });
    let obj = {
      client_id: params.client_id,
      employer_id: params.employer_id,
    };
    try {
      let getData = await api.getEmployerSlaApi(obj);
      if (getData && getData.success) {
        let datas = getData.data[0];
        this.setState({
          employerSlaDetail: datas,
        });
        this.setState({
          showLoading: false,
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

  gotoSla = () => {
    let number = Math.floor(Math.random() * 11)
    this.props.history.push("/user/slamanagement/" + number);
  };
  render() {
    return (
      <IonPage>
        {!this.state.showLoading && (
          <IonContent className="home-container" scrollEvents={true}>
            <div className="router-section">
              <HeaderTitle title="SLA Management">
                <div></div>
              </HeaderTitle>
              <Card title="Update SLA">
                <IonGrid>
                  <IonRow>
                    <IonCol size="8">
                      <Form
                        ref={(node) => {
                          this.form = node;
                        }}
                      >
                        <IonGrid>
                          <IonRow>
                            <IonCol size="5">
                              <label>Employer</label>
                            </IonCol>
                            <IonCol size="7">
                              <div className="form-group">
                                <Input
                                  name="client_name"
                                  value={
                                    this.state.employerSlaDetail.client_name
                                  }
                                  validations={[required]}
                                  className="form-control"
                                  disabled
                                />
                              </div>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size="5">
                              <label>Client</label>
                            </IonCol>
                            <IonCol size="7">
                              <div className="form-group">
                                <Input
                                  name="employer_name"
                                  value={
                                    this.state.employerSlaDetail.employer_name
                                  }
                                  validations={[required]}
                                  className="form-control"
                                  disabled
                                />
                              </div>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size="5">
                              <label>APO SLA (days)</label>
                            </IonCol>
                            <IonCol size="7">
                              <div className="form-group">
                                <Select
                                  name="APO"
                                  value={this.state.employerSlaDetail.APO}
                                  validations={[required]}
                                  className="form-control"
                                >
                                  <option value="">Select</option>
                                  {this.state.APO.map((apo) => (
                                    <option value={apo}>{apo}</option>
                                  ))}
                                </Select>
                              </div>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size="5">
                              <label>EAR SLA (days)</label>
                            </IonCol>
                            <IonCol size="7">
                              <div className="form-group">
                                <Select
                                  name="EAR"
                                  value={this.state.employerSlaDetail.EAR}
                                  validations={[required]}
                                  className="form-control"
                                >
                                  <option value="">Select</option>
                                  {this.state.APO.map((apo) => (
                                    <option value={apo}>{apo}</option>
                                  ))}
                                </Select>
                              </div>
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                        <div className="modal-footer text-right common-button">
                          <Button
                            color="primary"
                            variant="contained"
                            onClick={this.onSubmit}
                            disabled={this.state.loading}
                            type="button"
                            className="mr-3 min-100"
                          >
                            {this.state.loading && (
                              <IonSpinner name="bubbles" color="light" />
                            )}
                            {!this.state.loading && <span>Update</span>}
                          </Button>
                          <Button
                            variant="outlined"
                            type="button"
                            className="min-100"
                            onClick={this.gotoSla}
                          >
                            Cancel
                          </Button>
                        </div>
                      </Form>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </Card>
            </div>
          </IonContent>
        )}
        <IonLoading isOpen={this.state.showLoading} />
      </IonPage>
    );
  }
}

export default withRouter(withIonLifeCycle(Update));
