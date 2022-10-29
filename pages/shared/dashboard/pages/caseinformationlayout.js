import React from "react";
import { IonGrid, IonRow, IonCol } from "@ionic/react";

import Switch from "@material-ui/core/Switch";

class CaseInformationLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      priority: false,
    };
  }
  componentDidMount() {
    this.setState({
      priority: this.props.caseInformation.priority === 1 ? true : false,
    });
  }
  casePriority = async (e, value) => {
    let obj = {
      survey_id: this.props.surveyId,
      make_priority: value === 0 ? 1 : 0,
    };

    try {
      let getData = await api.setCasePriority(obj);
      if (getData && getData.success) {
        this.setState({
          priority: !this.state.priority,
        });
        this.props.onSucces();
      }
    } catch (e) {}
  };
  dateFormat = (date) => {
    return new Date(date).toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  render() {
    const {
      age,
      gender,
      disease_description,
      case_id,
      priority,
      product,
      fp,
      survey_due_date,
      expert_assigned_date,
      number_of_invitation_sent,
      expert_invited_date,
    } = this.props.caseInformation;
    return (
      <>
        {this.props.caseInformation ? (
          <IonGrid className="information-layput">
            <IonRow class="form-group">
              <IonCol size="4">
                <label>Age</label>
              </IonCol>
              <IonCol size="8">
                <span>{age ? age : "-"}</span>
              </IonCol>
            </IonRow>
            <IonRow class="form-group">
              <IonCol size="4">
                <label>Gender</label>
              </IonCol>
              <IonCol size="8">
                <span>{gender ? gender : "-"}</span>
              </IonCol>
            </IonRow>
            <IonRow class="form-group">
              <IonCol size="4">
                <label>DX Group</label>
              </IonCol>
              <IonCol size="8">
                <span>{disease_description ? disease_description : "-"}</span>
              </IonCol>
            </IonRow>
            <IonRow class="form-group">
              <IonCol size="4">
                <label>Number of Invitations Sent</label>
              </IonCol>
              <IonCol size="8">
                <span>
                  {number_of_invitation_sent ? number_of_invitation_sent : "-"}
                </span>
              </IonCol>
            </IonRow>
            <IonRow class="form-group">
              <IonCol size="4">
                <label>Case Due Date</label>
              </IonCol>
              <IonCol size="8">
                <span>
                  {survey_due_date ? this.dateFormat(survey_due_date) : "-"}
                </span>
              </IonCol>
            </IonRow>
            <IonRow class="form-group">
              <IonCol size="4">
                <label>FP</label>
              </IonCol>
              <IonCol size="8">
                <span>{fp ? fp : "-"}</span>
              </IonCol>
            </IonRow>
            <IonRow class="form-group">
              <IonCol size="4">
                <label>Product</label>
              </IonCol>
              <IonCol size="8">
                <span>{product ? product : "-"}</span>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <div className="straight-ine"></div>
              </IonCol>
            </IonRow>
          </IonGrid>
        ) : null}
      </>
    );
  }
}

export default CaseInformationLayout;
