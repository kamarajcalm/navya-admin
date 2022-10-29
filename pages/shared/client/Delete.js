import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import {
  IonPage,
  IonButton,
  IonLabel,
  IonBadge,
  IonItem,
  IonContent,
  IonList,
  IonListHeader,
  IonIcon,
  withIonLifeCycle,
  IonLoading,
  IonItemDivider,
  IonSpinner,
} from "@ionic/react";
import Button from "@material-ui/core/Button";
import api from "../../../api/endpoints";
import FormModal from "../../../common/formModal";
class Delete extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      loading: false,
    };
  }

  handleClose = () => {
    this.props.onClose(false);
  };

  updateClient = async () => {
    let obj = {
      data: {
        active: this.props.singleClient?.active == 1 ? 0 : 1,
      },
      update: "status",
    };
    this.setState({
      loading: true,
    });
    try {
      let getData = await api.updateClientListApi(
        this.props.singleClient.id,
        obj
      );
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

  render() {
    return (
      <IonPage className="login-container-page">
        <FormModal isOpen={this.props.isOpen} modalTitle={this.props.singleClient?.active == 1 ? "Disable Client" : "Enable Client"} onClose={this.handleClose}>
          <div className="form-group">
            <p>
              Are you sure you want to{" "}
              {this.props.singleClient?.active == 1 ? "disable" : "enable"} this
              client?
            </p>
          </div>

          <div className="modal-footer text-right common-button">
            <Button
              color="primary"
              variant="contained"
              type="submit"
              onClick={this.updateClient}
              disabled={this.state.loading}
              className="min-100"
            >
              {this.state.loading && (
                <IonSpinner name="bubbles" color="light" />
              )}
              {!this.state.loading && (
                <span>
                  {this.props.singleClient?.active == 1 ? "Disable" : "Enable"}
                </span>
              )}

            </Button>
           
          </div>
        </FormModal>
        <IonLoading isOpen={this.state.showLoading} />
      </IonPage>
    );
  }
}
export default withRouter(withIonLifeCycle(Delete));
