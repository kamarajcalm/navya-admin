import React, { useState, useEffect } from "react";
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
import Add from "./Add";
import EmployerList from "./EmployerList";
import { isSmallScreen, canAccess } from "../../../utils";
import "./styles.scss";
class Employer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      addShowModel: false,
      employerShowModel: false,
      pageSize: 5,
      clientList: [],
      employerListByClient: null,
      clientDetail: null,
      status: "",
      tableHead: [
        {
          title: "Client Name",
          field: "client_name",
          cellStyle: {
            width: "25%",
          },

        },
        {
          title: "Employers List",
          field: "employer",
          align: "center",
          cellStyle: {
            width: "40%",
          },

          render: (rowData) => {
            return (
              <>
                <div className="employer-align-list">
                  {rowData.employers && rowData.employers.map((x, index) => (
                    <div key={index} className={index > 9 ? 'd-none' : null}>
                      {index <= 9 ? x : null}{""}
                      {index <= 9 && index < rowData.employers.length - 1
                        ? ", "
                        : null}
                    </div>
                  ))}
                  {rowData.employers && rowData.employers.length > 10 ? (

                    <div className="dot">
                      {rowData.employers.length > 10 ? "+" : null}
                      {rowData.employers.length - 10} more
                    </div>
                  ) : null}
                </div>
              </>
            );
          },
        },
        {
          title: "",
          field: "count",
          cellStyle: {
            width: "35%",
          },

          render: (rowData) => (
            <div className="common-button">
              {canAccess(['can_add_employers']) ? (
              <Button
                variant="contained"
                onClick={() => this.addButtonClick(rowData)}
                disabled={rowData.active == 1 ? false : true}
                className="mr-3 min-100 blue"
              >
                Add Employers
              </Button>
              ) : null}
              {rowData.count && rowData.count > 0 && canAccess(['can_edit_employers']) ? (
                <Button
                  variant="contained"
                  className="min-100 blue"
                  disabled={rowData.active == 1 ? false : true}
                  onClick={() => this.updateClick(rowData)}
                >
                  Edit Employers
                </Button>
              ) : null}
            </div>
          ),
        },
      ],
    };
  }

  componentDidMount() {
    this.getEmployerList();
  }

  updateClick = (rowData) => {
    this.setState({
      addShowModel: true,
      clientDetail: rowData,
      status: "update",
    });
  };
  countClick = (rowData) => {
    this.setState({
      employerShowModel: true,
      employerListByClient: rowData,
    });
  };
  closeEmployerShowModel = () => {
    this.setState({
      employerShowModel: false,
      employerListByClient: null,
    });
  };

  addButtonClick = (rowData) => {
    this.setState({
      addShowModel: true,
      status: "add",
      clientDetail: rowData,
    });
  };

  onClose = (statuss) => {
    if (statuss) {
      this.getEmployerList();
    }
    this.setState({
      addShowModel: false,
      clientDetail: null,
      status: "",
    });
  };

  getEmployerList = async () => {
    this.setState({
      showLoading: true,
    });
    let obj = {
      search_by_client_name: "",
    };
    try {
      let getData = await api.getEmployerListApi(obj);

      if (getData && getData.success) {
        getData.data.forEach((element) => {
          element.employer = element.employers ?  element.employers.join() : []
        });
        this.setState({
          showLoading: false,
          clientList: getData.data,
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
    const {
      showLoading,
      addShowModel,
      employerShowModel,
      employerListByClient,
      tableHead,
      clientList,
      clientDetail,
      status,
    } = this.state;
    return (
      <IonPage>
        {!showLoading && (
          <IonContent className="home-container" scrollEvents={true}>
            <div className="router-section">
              <HeaderTitle title="Employers">
                <div className="common-button"></div>
              </HeaderTitle>
              <Dashboard
                title=" "
                dict_mapped_data={clientList || {}}
                columns={tableHead || {}}
                bottomMargin={45}
                clearFilter={false}
                exportButton={false}
                filtering={false}
                grouping={false}
                noDataText="No clients added yet. Please add a client to assign employers."
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
              />
            </div>
          </IonContent>
        )}
        <IonLoading isOpen={showLoading} />
        {addShowModel ? (
          <Add
            isOpen={addShowModel}
            clientDetail={clientDetail}
            status={status}
            onClose={this.onClose}
          ></Add>
        ) : null}

        {employerShowModel ? (
          <EmployerList
            isOpen={employerShowModel}
            employerListByClient={employerListByClient}
            onClose={this.closeEmployerShowModel}
          ></EmployerList>
        ) : null}
      </IonPage>
    );
  }
}
export default withRouter(withIonLifeCycle(Employer));
