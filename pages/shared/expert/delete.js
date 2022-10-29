import React from "react";
import { withRouter } from "react-router-dom";
import {
  IonPage,
  withIonLifeCycle,
  IonLoading,
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

  updateExpert = async () => {
    let obj = {
      is_active: this.props.singleExpert?.is_active,
      send_on_boarding_mail: false,
    };
    this.setState({
      loading: true,
    });
    try {
      let getData = await api.updateStatusExpertApi(
        this.props.singleExpert.user_id,
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
        <FormModal
          isOpen={this.props.isOpen}
          modalTitle={
            this.props.singleExpert?.is_active
              ? "Disable Expert"
              : "Enable Expert"
          }
          onClose={this.handleClose}
        >
          <div className="form-group">
            <p>
              Are you sure you want to{" "}
              {this.props.singleExpert?.is_active ? "disable" : "enable"} this
              expert?
            </p>
          </div>

          <div className="modal-footer text-right common-button">
            <Button
              color="primary"
              variant="contained"
              type="submit"
              onClick={this.updateExpert}
              disabled={this.state.loading}
              className="min-100"
            >
              {this.state.loading && (
                <IonSpinner name="bubbles" color="light" />
              )}
              {!this.state.loading && (
                <span>
                  {this.props.singleExpert?.is_active ? "Disable" : "Enable"}
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
