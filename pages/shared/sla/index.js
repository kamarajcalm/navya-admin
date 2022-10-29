import React from "react";
import {
  IonPage,
  IonContent,
  withIonLifeCycle,
  IonLoading,
} from "@ionic/react";
import { withRouter } from "react-router-dom";
import api from "../../../api/endpoints";
import Dashboard from "material-table-ui/Dashboard";
import { isSmallScreen, canAccess } from "../../../utils";
import Button from "@material-ui/core/Button";
import HeaderTitle from "../../../common/header_title";
class Sla extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      pageSize: 5,
      slaList: [],
      tableHead: [
        {
          requiresEditAccess: false,
          title: "Employer Name",
          field: "employer_name",
          cellStyle: {
            width: "25%",
          },
        },
        {
          requiresEditAccess: false,
          title: "Client Name",
          field: "client_name",
          cellStyle: {
            width: "25%",
          },
        },
        {
          requiresEditAccess: false,
          title: "APO SLA (days)",
          field: "APO",
          align: "center",
          cellStyle: {
            width: "17%",
          },
        },
        {
          requiresEditAccess: false,
          title: "EAR SLA (days)",
          field: "EAR",
          align: "center",
          cellStyle: {
            width: "17%",
          },
        },
        {
          requiresEditAccess: true,
          title: "",
          field: "age",
          align: "center",
          cellStyle: {
            width: "16%",
          },
          render: (rowData) => (
            <div className="common-button">
              <Button
                color="primary"
                variant="contained"
                disabled={rowData.client_active == 1 && rowData.employer_active == 1 ? false : true}
                onClick={() => this.updateButtonClick(rowData)}
                type="submit"
                className="mr-3 min-100"
              >
                Update
              </Button>
            </div>
          ),
        },
      ].filter(row => !row.requiresEditAccess || canAccess(['can_edit_sla'])),
    };
  }
  componentDidMount() {
    this.getSlaList("");
  }
  componentDidUpdate(prevProps) {
    let oldId = prevProps.match.params.id;
    let newId = this.props.match.params.id;
    if (newId !== oldId) {
      this.getSlaList("");
    }
  }
  updateButtonClick = (row) => {
    let number = Math.floor(Math.random() * 12)
    this.props.history.push(
      "/user/slamanagement/" + row.employer_id + "/" + row.client_id + '/' + number
    );
  };
  getSlaList = async (search) => {
    this.setState({
      showLoading: true,
    });
    let obj = {
      search_by_client_or_employer_name: search,
    };
    try {
      let getData = await api.getSlaListApi(obj);
      console.log("getData", getData);
      if (getData && getData.success) {
        this.setState({
          showLoading: false,
          slaList: getData.data,
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
    const isMobile = isSmallScreen();
    const { tableHead, slaList } = this.state;
    return (
      <IonPage>
        {!this.state.showLoading && (
          <IonContent className="home-container" scrollEvents={true}>
            <div className="router-section">
              <HeaderTitle title="SLA Management">
                <div></div>
              </HeaderTitle>
              <Dashboard
                title=" "
                dict_mapped_data={slaList || {}}
                columns={tableHead || {}}
                bottomMargin={45}
                clearFilter={false}
                exportButton={false}
                filtering={false}
                grouping={false}
                searchFieldAlignment={"left"}
                noDataText="No employers added yet. Please add an employer to a client to manage SLA."
              />
            </div>
          </IonContent>
        )}
        <IonLoading isOpen={this.state.showLoading} />
      </IonPage>
    );
  }
}
export default withRouter(withIonLifeCycle(Sla));
