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
import Button from "@material-ui/core/Button";
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
      showLoading: false,
      name: "",
      loading: false,
    };
  }

  componentDidMount() {
    if (this.props.singleClient) {
      this.setState({
        name: this.props.singleClient.name,
      });
    }
  }
  handleClose = () => {
    this.props.onClose(false);
  };
  handleChange = (e) => {
    this.setState({
      name: e.target.value,
    });
  };
  addClient = async (data) => {
    data.referrer_id = 10;
    this.setState({
      loading: true,
    });
    try {
      let addData = await api.addClientListApi(data);
      if (addData && addData.success) {
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

  updateClient = async (data) => {
    data.referrer_id = 10;
    let obj = {
      data,
      update: "content",
    };
    this.setState({
      loading: true,
    });
    console.log("obj", obj);
    try {
      let updateData = await api.updateClientListApi(
        this.props.singleClient.id,
        obj
      );
      if (updateData && updateData.success) {
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
      if (err) {
        return;
      }

      const values = this.form.getValues();
      if (this.props.singleClient) {
        this.updateClient(values);
      } else {
        this.addClient(values);
      }
    });
  };
  render() {
    return (
      <IonPage className="login-container-page">
        <FormModal
          isOpen={this.props.isOpen}
          modalTitle={
            this.props.singleClient && this.props.singleClient.id
              ? "Update Client"
              : "Add Client"
          }
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
                <IonCol size="4">
                  <label>Client Name</label>
                </IonCol>
                <IonCol size="8">
                  <div className="form-group">
                    <Input
                      className="form-control"
                      autoComplete="off"
                      name="name"
                      onChange={this.handleChange}
                      value={this.state.name}
                      validations={[required]}
                    />
                  </div>
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
                    {this.props.singleClient && this.props.singleClient.id
                      ? "Update"
                      : "Add"}
                  </span>
                )}

              </Button>

            </div>
          </Form>
        </FormModal>
      </IonPage>
    );
  }
}

export default withRouter(withIonLifeCycle(Add));
