import React from "react";
import { withRouter } from "react-router-dom";
import {
    IonPage,
    withIonLifeCycle,
    IonLoading,
    IonRow,
    IonCol,
} from "@ionic/react";
import { Button } from "@material-ui/core";
import Select from "react-select";
import api from "../../../api/endpoints";
import FormModal from "../../../common/formModal";

class ConfirmAddState extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            type: '',
        };
    }

    handleClose = () => {
        this.props.onClose(false);
    };

    handleTypeChange = (e) => {
        this.setState({ type: e });
    };

    AddStateClicked = async () => {
        const ids = this.props.states.map(v => {
            return v.state_id
        })
        const payload = {
            "hospital_id": this.props.hospitalId,
            "state_ids": ids,
            "white_space": this.state.type.value === 'White_Space_Allocation' ? 1 : 0
        }
        await api.addStatesToFp(payload);
        this.props.onClose(false);
    }

    render() {

        let statesList = this.props.states;

        return (
            <IonPage className="login-container-page">
                {
                    !this.state.showLoading && (
                        <FormModal modalClass={'holiday-list-modal addState-modal'} isOpen={this.props.isOpen} modalTitle={"Add States"} onClose={this.handleClose}>
                            <div style={{ padding: "15px 20px 29px 20px" }}>
                                <IonRow>
                                    <IonCol>
                                        <div className="confirm-state-list-container ">
                                            <h7 style={{ fontWeight: 'bold' }}>States:</h7>
                                            {
                                                statesList.map(v => {
                                                    return (
                                                        <div className="" key={this.props.state_id}>
                                                            <span>{v.state_name}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </IonCol>
                                </IonRow>

                                <IonRow>
                                    <IonCol size="4">
                                        <span style={{ fontWeight: 'bold' }}> Select the type</span>

                                    </IonCol>
                                    <IonCol size="8">
                                        <Select
                                            value={this.state.type}
                                            onChange={(e) =>
                                                this.handleTypeChange(e)
                                            }
                                            options={[{
                                                value: 'Exclusive_Territory',
                                                label: 'Exclusive Territory'
                                            }, {
                                                value: 'White_Space_Allocation',
                                                label: 'White Space Allocation'
                                            }]}
                                            placeholder={"Select Type"}

                                        />

                                    </IonCol>
                                </IonRow>
                            </div>

                            <div className="footer">
                                <Button

                                    variant="contained"
                                    onClick={this.handleClose}
                                    className="min-100"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => this.AddStateClicked()}
                                    className="table-edit-button"
                                >
                                    Add States
                                </Button>
                            </div>
                        </FormModal>
                    )
                }
                <IonLoading isOpen={this.state.showLoading} />
            </IonPage>
        );
    }
}
export default withRouter(withIonLifeCycle(ConfirmAddState));
