import React from "react";
import {
  IonPage,
  IonLoading,
  IonContent,
  withIonLifeCycle,
} from "@ionic/react";
import { canAccess } from "../../../../utils";
import Button from "@material-ui/core/Button";
class EnableButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      buttonEnable: false,
      buttonName: "",
      whichCase: "",
    };
  }
  componentDidMount() {
    this.checkEnableButton();
  }
  checkInviteButton = () => {
    const { list } = this.props;
    let checkDecision = list.some(
      (element) => element.EMail_Status === "pending"
    );
    return checkDecision;
  };
  checkAssignButton = () => {
    const { list } = this.props;
    let checkDecision = list.some(
      (element) => element.status == "pending" || element.status == "completed"
    );
    return checkDecision;
  };
  checkEnableButton = () => {
    const { type } = this.props;
    let { buttonEnable, buttonName, whichCase } = this.state;
    if (type == "accepted") {
      if (canAccess(["can_invite_an_expert"]) && !this.checkInviteButton() && false) {
        buttonEnable = true;
        whichCase = "accepted";
        buttonName = "Invite an Expert";
      }
    } else if (type == "completed") {
      if (canAccess(["can_assign_case_to_np_qc"]) && !this.checkAssignButton()) {
        buttonEnable = true;
        whichCase = "compelted";
        buttonName = " Assign to NP";
      }
      this.checkAssignButton();
    } else {
    }
    this.setState({
      buttonEnable,
      buttonName,
      whichCase,
    });
  };
  render() {
    const { buttonEnable, buttonName } = this.state;
    return (
      <div className="common-button">
        {buttonEnable && (
          <Button
            variant="contained"
            onClick={() => this.props.inviteButtonClick(this.state.whichCase)}
            type="submit"
            className="ml-4 MuiButton-containedSuccess"
          >
            {buttonName}
          </Button>
        )}
      </div>
    );
  }
}

export default EnableButton;
