import React, { useEffect, useState } from "react";
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
import Add from "./add";
import Delete from "./Delete";
import "./style.scss";
import Switch from "@material-ui/core/Switch";
import { isSmallScreen, canAccess } from "../../../utils";
class Client extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      addShowModel: false,
      deleteShowModel: false,
      singleClient: null,
      pageSize: 5,
      tableHead: [
        { 
          requiresEditAccess: false,
          title: "Name",
          field: "name",
        },
        {
          requiresEditAccess: true,
          title: "",
          field: "age",
          width: 350,
          align: "center",
          render: (rowData) => (
            <div className="common-button">
              <Button
                variant="contained"
                onClick={() => this.editButtonClick(rowData)}
                type="submit"
                className="mr-3 min-100 blue"
              >
                Edit
              </Button>
              <Switch
                name={"active_" + rowData.name}
                color="primary"
                onChange={(e) => this.deleteButtonClick(rowData)}
                className={rowData.active ? "checked" : null}
                checked={rowData.active == 1 ? true : false}
              />

            </div>
          ),
        },
      ].filter(row => !row.requiresEditAccess || canAccess(['can_edit_clients'])),
    };
  }
  componentDidMount() {
    this.getClientList("");
  }
  addButtonClick = () => {
    this.setState({
      addShowModel: true,
    });
  };
  editButtonClick = (row) => {
    this.setState({
      addShowModel: true,
      singleClient: row,
    });
  };
  deleteButtonClick = (row) => {
    this.setState({
      deleteShowModel: true,
      singleClient: row,
    });
  };

  onClose = (status) => {
    console.log("status", status);
    if (status) this.getClientList("");
    this.setState({
      addShowModel: false,
      deleteShowModel: false,
      singleClient: null,
    });
  };
  getClientList = async (search) => {
    this.setState({
      showLoading: true,
    });
    let obj = {
      search_by_client_name: search,
      fetch_by: "all",
    };
    try {
      let getData = await api.getClientListApi(obj);
      console.log("getData", getData);
      if (getData && getData.success) {
        this.setState({
          clientList: getData.data,
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

  render() {
    const isMobile = isSmallScreen();
    return (
      <IonPage>
        {!this.state.showLoading && (
          <IonContent className="home-container" scrollEvents={true}>
            <div className="router-section">
              <HeaderTitle title="Clients">
                <div className="common-button">
                {canAccess(['can_add_clients']) ? (<Button
                    variant="contained"
                    size="medium"
                    color="primary"
                    onClick={this.addButtonClick}
                    className="min-150"
                  >
                    Add Client
                  </Button>
                ) : null}
                  </div>
              </HeaderTitle>
              <Dashboard
                title=" "
                dict_mapped_data={this.state.clientList || {}}
                columns={this.state.tableHead || {}}
                bottomMargin={45}
                clearFilter={false}
                exportButton={false}
                filtering={false}
                grouping={false}
                noDataText="No clients added yet. Please add a client to get started."
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
        <IonLoading isOpen={this.state.showLoading} />
        {this.state.addShowModel ? (
          <Add
            isOpen={this.state.addShowModel}
            onClose={this.onClose}
            singleClient={this.state.singleClient}
          ></Add>
        ) : null}
        {this.state.deleteShowModel ? (
          <Delete
            isOpen={this.state.deleteShowModel}
            onClose={this.onClose}
            singleClient={this.state.singleClient}
          ></Delete>
        ) : null}
      </IonPage>
    );
  }
}
export default withRouter(withIonLifeCycle(Client));
