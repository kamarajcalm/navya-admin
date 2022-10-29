import React from "react";
import { withRouter } from "react-router-dom";
import { IonPage, withIonLifeCycle, IonLoading } from "@ionic/react";
import api from "../../../api/endpoints";

import FormModal from "../../../common/formModal";
class EmployerList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      pageSize: 5,
      employerDetailList: [],

      tableHead: [
        {
          title: "Employer Name",
          field: "name",
        },
      ],
    };
  }
  componentDidMount() {
    if (this.props.employerListByClient) {
      this.getEmployerDetails(this.props.employerListByClient);
    }
  }

  handleClose = () => {
    this.props.onClose();
  };
  getEmployerDetails = async (row) => {
    this.setState({
      showLoading: true,
    });
    try {
      let getData = await api.getEmployerDetailApi(row.client_id);
      if (getData && getData.success) {
        this.setState({
          showLoading: false,
          employerDetailList: getData.data,
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

  render() {
    const { employerDetailList } = this.state;
    return (
      <IonPage className="login-container-page">
        {!this.state.showLoading ? (
          <FormModal
            isOpen={this.props.isOpen}
            modalTitle="Employers"
            onClose={this.handleClose}
          >
            <div className="common-list">
              <p>Client: {this.props.employerListByClient.client_name}</p>
              <p>No. of Employers: {this.props.employerListByClient.count}</p>
              <ul>
                {employerDetailList &&
                  employerDetailList.map((employee, index) => (
                    <li key={index}>{employee.name}</li>
                  ))}
              </ul>
            </div>
          </FormModal>
        ) : null}
        <IonLoading isOpen={this.state.showLoading} />
      </IonPage>
    );
  }
}
export default withRouter(withIonLifeCycle(EmployerList));
