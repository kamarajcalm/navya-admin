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
import EditHoliday from "./edit_holiday";
import HolidayList from "./holiday_list";
import "./style.scss";
import { isSmallScreen, canAccess } from "../../../utils";

class FPAvailability extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      showEditPage: false,
      showHolidayListModal: false,
      deleteShowModel: false,
      pageSize: 5,
      dict_mapped_data: [],
      columns: [],
      tableHead: [
        {
          requiresEditAccess: false,
          title: "Foundational Partner",
          field: "fp_name",
        },
        {
          requiresEditAccess: false,
          title: "Timezone",
          field: "timezone",
        },
        {
          requiresEditAccess: false,
          title: "Business Hours",
          field: "business_hours",
        },
        {
          requiresEditAccess: false,
          title: "Holidays",
          field: "holidays",
          render: rowData => <div className="view-holidays" onClick={() => this.viewHolidaysClicked(rowData)}>View Holidays</div>
        },
        { 
          requiresEditAccess: true,
          title: "",
          field: "holidays",
          width: 350,
          align: "center",
          render: (rowData) => (
            <div className="common-button">
              <Button
                variant="contained"
                onClick={() => this.editButtonClick(rowData)}
                // type="submit"
                className="table-edit-button"
              // className="mr-3 min-100 blue"
              >
                Edit
              </Button>
            </div>
          ),
        },
      ].filter(row => !row.requiresEditAccess || canAccess(['can_edit_fp_availability'])),
    };
  }

  async componentDidMount() {
    this.setState({ showLoading: true }, async () => {
      await this.getFPListData();
    })
  }

  editButtonClick = (row) => {
    this.setState({
      showEditPage: true,
      fpName: row.fp_name,
      hospitalId: row.hospital_id,
      timezone: row.timezone
    });
  };

  viewHolidaysClicked = (row) => {
    this.setState({
      showHolidayListModal: true,
      fpName: row.fp_name,
      hospitalId: row.hospital_id
    });
  };

  onClose = (status) => {
    this.setState({
      showEditPage: false,
      showHolidayListModal: false
    });
  };

  getFPListData = async () => {
    this.setState({ showLoading: true }, async () => {
      let payload = { 'org': 'Accesshope' };
      try {
        let response = await api.getFPListData(payload);
        if (response && response.success) {
          this.setState({
            showLoading: false,
            dict_mapped_data: response.data.result,
          });
        } else {
          this.setState({ showLoading: false });
        }
      } catch (error) {
        console.log('Error : ', error);
        this.setState({ showLoading: false });
      }
    });
  };

  changeRoutes = () => {
    this.setState({ showEditPage: false }, () => {
      this.setState({ showLoading: true }, async () => {
        await this.getFPListData();
      });
    })
  }

  render() {
    const isMobile = isSmallScreen();
    return (
      <IonPage>
        {!this.state.showLoading && (
          <IonContent className="home-container" scrollEvents={true}>
            <div className="router-section">
              {
                this.state.showEditPage && (
                  <>
                    <div className="fp-routes">
                      <ion-icon onClick={() => this.changeRoutes()} color="bright" name="arrow-back"></ion-icon>
                      <span className="fp-routes-text" onClick={() => this.changeRoutes()}>
                        FP Availability /
                      </span>
                      <span className="fp-routes-text c-routes">
                        Edit FP Availability
                      </span>
                    </div>
                    <EditHoliday
                      fpName={this.state.fpName}
                      hospitalId={this.state.hospitalId}
                      timezone={{ 'value': 1, 'label': this.state.timezone }}
                      onClose={this.onClose}
                    ></EditHoliday>
                  </>
                )
              }
              {
                !this.state.showEditPage && (
                  <>
                    <HeaderTitle title="FP Business Hours" />
                    <Dashboard
                      title=' '
                      dict_mapped_data={this.state.dict_mapped_data || []}
                      columns={this.state.tableHead || []}
                      exportButton={false}
                      bottomMargin={true ? 0 : 45}
                      pageSize={10}
                      filtering={false}
                      grouping={false}
                      searchFieldAlignment={Object.assign(
                        {},
                        isMobile
                          ? {
                            searchFieldAlignment: "left",
                            searchFieldStyle: {
                              marginLeft: "-16px",
                              width: "200px",
                            },
                          }
                          : null
                      )}
                      noDataText="No holiday list available"
                    />
                  </>
                )
              }
            </div>
          </IonContent>
        )}
        <IonLoading isOpen={this.state.showLoading} />
        {this.state.showHolidayListModal ? (
          <HolidayList
            isOpen={this.state.showHolidayListModal}
            onClose={this.onClose}
            fpName={this.state.fpName}
            hospitalId={this.state.hospitalId}
          ></HolidayList>
        ) : null}
      </IonPage>
    );
  }
}
export default withRouter(withIonLifeCycle(FPAvailability));
