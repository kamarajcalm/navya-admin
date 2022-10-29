import React from "react";
import { withRouter } from "react-router-dom";
import {
  IonPage,
  withIonLifeCycle,
  IonLoading,
} from "@ionic/react";
import api from "../../../api/endpoints";
import FormModal from "../../../common/formModal";
import { formatDateMDY } from '../../../stubs/utility';
class HolidayList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: true,
      holidays: []
    };
  }
  componentDidMount() {
    this.setState({
      showLoading: true
    }, async () => {
      const payload = { "hospital_id": this.props.hospitalId }
      const response = await api.getFPHolidays(payload);
      if (response && response.success && response.data.result) {
        this.setState({
          holidays: response.data.result,
          showLoading: false
        })
      } else {
        this.setState({ showLoading: false });
      }
    })
  }

  handleClose = () => {
    this.props.onClose(false);
  };

  render() {
    return (
      <IonPage className="login-container-page">
        {
          !this.state.showLoading && (
            <FormModal modalClass={'holiday-list-modal'} isOpen={this.props.isOpen} modalTitle={'Holidays at ' + this.props.fpName} onClose={this.handleClose}>
              <div className="holiday-list-container form-group">
                {
                  this.state.holidays.map(v => {
                    return (
                      <div className="holiday-list">
                        <span>{v.holiday_name}</span>
                        <span style={{ float: 'right' }}>{formatDateMDY(v.holiday_date)}</span>
                      </div>
                    )
                  })
                }
              </div>
            </FormModal>
          )
        }
        <IonLoading isOpen={this.state.showLoading} />
      </IonPage>
    );
  }
}
export default withRouter(withIonLifeCycle(HolidayList));
