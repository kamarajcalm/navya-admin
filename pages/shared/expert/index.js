import React from "react";
import {
  IonPage,
  IonContent,
  withIonLifeCycle,
  IonLoading,
} from "@ionic/react";
import { withRouter } from "react-router-dom";
import api from "../../../api/endpoints";
import Button from "@material-ui/core/Button";
import HeaderTitle from "../../../common/header_title";
import Dashboard from "material-table-ui/Dashboard";
import Switch from "@material-ui/core/Switch";
import Delete from "./delete";
import './styles.scss';
import { hasViewEditExpertAvailabilityAccess } from "../../../stubs/utility";

class Expert extends React.PureComponent {
  constructor(props) {
    super(props);
    this.hasViewAccess = hasViewEditExpertAvailabilityAccess('can_view_physician_availability')
    this.state = {
      showLoading: false,
      singleExpert: null,
      expertList: [],
      deleteShowModel: false,
      tableHead: [
        {
          title: "First Name",
          field: "first_name",
          cellStyle: {
            width: "16%",
          },
        },
        {
          title: "Last Name",
          field: "last_name",
          cellStyle: {
            width: "16%",
          },
        },

        {
          title: "Email",
          field: "email",
          cellStyle: {
            width: "28%",
          },
        },
        {
          title: "FP",
          field: "hospital_name",
          cellStyle: {
            width: "15%",
          },
        },
        {
          title: "",
          field: "email",
          align: "center",
          cellStyle: {
            width: "25%",
          },
          render: (rowData) => (
            <div className="common-button">
              {/* <Button
                color="primary"
                variant="contained"
                onClick={() => this.updateButtonClick(rowData)}
                disabled={!rowData.is_active}
                type="submit"
                className="mr-3 min-100 blue mb-2"
              >
                Update
              </Button> */}
              {/* <Switch                      hiding active / inctive experts and adding new button as said in https://gitlab.navyanetwork.com/experts/admin/issues/37  
                name={"active_" + rowData.first_name}
                color="primary"
                onChange={(e) => this.deleteButtonClick(rowData)}
                className={rowData.is_active ? "checked" : null}
                checked={rowData.is_active}
              /> */}
              {this.hasViewAccess && <Button
                color="primary"
                variant="contained"
                onClick={() => this.onEditAvailability(rowData)}
                disabled={!rowData.is_active}
                type="submit"
                className="mr-3 min-100 blue"
              >
                View Availability
              </Button>}
            </div>
          ),
        },
      ],
    };
  }

  onEditAvailability=(expertObj)=>{
    this.props.history.push({pathname : `/user/expert/update/viewavailability/${expertObj.expert_id}`, state :{userID : expertObj.user_id}})
  }

  ionViewWillEnter() {
    this.getExpertList("");
  }
  addButtonClick = () => {
    this.props.history.push("/user/expert/add");
  };

  updateButtonClick = (row) => {
    this.props.history.push({pathname:`/user/expert/update/${row.user_id}`,state:{expertId:row.expert_id}});
  };
  deleteButtonClick = (row) => {
    this.setState({
      deleteShowModel: true,
      singleExpert: row,
    });
  };
  getExpertList = async (search) => {
    this.setState({
      showLoading: true,
    });
    let obj = {
      search_str: "",
    };
    try {
      let getData = await api.getExpertListApi(obj);
      if (getData && getData.success) {
        this.setState({
          expertList: getData.data.users,
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
  onClose = (status) => {
    if (status) this.getExpertList("");
    this.setState({
      deleteShowModel: false,
      singleExpert: null,
    });
  };
  render() {
    return (
      <IonPage>
        {!this.state.showLoading && (
          <IonContent className="home-container" scrollEvents={true}>
            <div className="router-section">
              <HeaderTitle title="Experts ">
                {/* <div className="common-button">  commented as said in https://gitlab.navyanetwork.com/experts/admin/issues/37
                  <Button
                    variant="contained"
                    size="medium"
                    color="primary"
                    onClick={this.addButtonClick}
                    className="min-150"
                  >
                    Add Expert
                  </Button>
                </div> */}
              </HeaderTitle>
              <Dashboard
                title=" "
                dict_mapped_data={this.state.expertList || {}}
                columns={this.state.tableHead || {}}
                bottomMargin={45}
                clearFilter={false}
                exportButton={false}
                filtering={false}
                grouping={false}
                searchFieldAlignment={"left"}
                noDataText="No expert added yet. Please add a expert to get started."
              />
            </div>
          </IonContent>
        )}
        <IonLoading isOpen={this.state.showLoading} />
        {this.state.deleteShowModel ? (
          <Delete
            isOpen={this.state.deleteShowModel}
            onClose={this.onClose}
            singleExpert={this.state.singleExpert}
          ></Delete>
        ) : null}
      </IonPage>
    );
  }
}
export default withRouter(withIonLifeCycle(Expert));
