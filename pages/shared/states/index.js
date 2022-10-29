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
import "./style.scss";
import { isSmallScreen, canAccess } from "../../../utils";
import StateList from "./stateList"
import AddStates from "./addStates";
import ConfirmAddStates from "./confirmAddState"

class States extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            showStatesListModal: false,
            showAddStatesListModal: false,
            deleteShowModel: false,
            showAddStateConfirmationModal: false,
            selectedStatesToAdd: [],
            isManage: false,
            pageSize: 5,
            dict_mapped_data: [],
            columns: [],
            tableHead: [
                {
                    title: "FP name",
                    field: "fp_name",

                },
                {
                    title: "Exclusive territory",
                    field: "exclusive_territory",
                    align: "center",
                    render: rowData => <div>{rowData.exclusive_territory?.length} states</div>
                },
                {
                    title: "White Space allocation",
                    field: "white_space_allocation",
                    align: "center",
                    render: rowData => <div>{rowData.white_space_allocation?.length } states</div>
                },
                {
                    title: "Action",
                    field: "holidays",
                    align: "center",
                    render: (rowData) => (
                        <div className="common-button-state">
                            <Button
                                variant="contained"
                                onClick={() => this.viewStatesClicked(rowData)}
                                className="table-edit-button"
                            >
                                View States
                            </Button>
                            <>
                            {canAccess(['can_edit_fp_states']) && 
                                <Button
                                    variant="contained"
                                    onClick={() => this.viewStatesClicked(rowData, true)}
                                    className="table-edit-button"
                                >
                                    Manage States
                                </Button>
                            }</>
                            <> {
                                canAccess(['can_add_fp_states']) &&
                                    <Button
                                    variant="contained"
                                    onClick={() => this.addStatesClicked(rowData)}
                                    className="table-edit-button"
                                >
                                    Add States
                            </Button>
                            }
                            </>
                        </div>
                    ),
                },
            ],
        };
    }

    async componentDidMount() {
        this.setState({ showLoading: true }, async () => {
            await this.getFpListAndStates();
        })
    }
    addStatesClicked = (row) => {
        console.log('VIEW CLICKED', row)
        this.setState({
            showAddStatesListModal: true,
            hospitalId: row.hospital_id,
        });
    };

    viewStatesClicked = (row, isManage = false) => {
        console.log('VIEW CLICKED', row)
        this.setState({
            hospitalId: row.hospital_id,
            isManage,
            showStatesListModal: true,
        });
    };

    onClose = (status) => {
        console.log("status", status);
        this.setState({
            showStatesListModal: false,
            showAddStatesListModal: false,
        }, () => {
            if (status && status.length > 0) {
                this.setState({ showAddStateConfirmationModal: true, selectedStatesToAdd: status });
            } else {
                this.setState({ showAddStateConfirmationModal: false }, async () => {
                    await this.getFpListAndStates()
                });
            }
        });

    };

    getFpListAndStates = async () => {
        this.setState({ showLoading: true }, async () => {
            let payload = { 'org': 'Accesshope' };
            try {
                let response = await api.getFpListAndStates(payload)
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

    render() {
        const isMobile = isSmallScreen();
        return (
            <IonPage>
                {!this.state.showLoading && (
                    <IonContent className="home-container" scrollEvents={true}>
                        <div className="router-section">
                            <>
                                <HeaderTitle title="States allocated to FP:" />
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
                                    noDataText="No State list is available"
                                />
                            </>
                        </div>
                    </IonContent>
                )}
                <IonLoading isOpen={this.state.showLoading} />
                {this.state.showStatesListModal ? (
                    <StateList
                        isOpen={this.state.showStatesListModal}
                        onClose={this.onClose}
                        hospitalId={this.state.hospitalId}
                        isManage={this.state.isManage}
                    ></StateList>
                ) : null}
                {this.state.showAddStatesListModal ? (
                    <AddStates
                        isOpen={this.state.showAddStatesListModal}
                        onClose={this.onClose}
                        hospitalId={this.state.hospitalId}
                    ></AddStates>
                ) : null}
                {this.state.showAddStateConfirmationModal ? (
                    <ConfirmAddStates
                        isOpen={this.state.showAddStateConfirmationModal}
                        onClose={this.onClose}
                        hospitalId={this.state.hospitalId}
                        states={this.state.selectedStatesToAdd}
                    />
                ) : null}
            </IonPage>
        );
    }
}
export default withRouter(withIonLifeCycle(States));
