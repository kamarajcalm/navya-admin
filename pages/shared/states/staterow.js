import React from "react";
import { withRouter } from "react-router-dom";
import {

    withIonLifeCycle,
    IonLoading

} from "@ionic/react";


import api from "../../../api/endpoints";



class StateRow extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false

        };
    }


    async onAddState() {
        this.setState({ showLoading: true }, async () => {
            const payload = {
                "hospital_id": this.props.hospitalId,
                "state_id": this.props.stateId,
                "white_space": this.props.selectedState === "exclusive_territory" ? 0 : 1
            }
            try {
                const response = await api.addStateToFp(payload)
                if (response && response.success)
                    this.props.onUpdateStatesList(false, this.props.stateId)
                this.setState({ showLoading: false });
                
            } catch (error) {
                console.error('Error : ', error);
                this.setState({ showLoading: false });
            }
        });

    }

    onRemoveState() {

        this.setState({ showLoading: true }, async () => {
            const payload = {
                "hospital_id": this.props.hospitalId,
                "state_id": this.props.stateId,
                "white_space": this.props.selectedState === "exclusive_territory" ? 0 : 1
            }
            try {
                const response = await api.removeStateFromFp(payload)
                if (response && response.success)
                    this.props.onUpdateStatesList(true, this.props.stateId)
                this.setState({ showLoading: false });
                
            } catch (error) {
                console.error('Error : ', error);
                this.setState({ showLoading: false });
            }
        });
    }


    render() {
        return (
            <div className="holiday-list" key={this.props.stateId}>
                <span>{this.props.stateName}</span>
                {!this.state.showLoading &&
                    this.props.isExist
                    ? <span className="remove-state" onClick={() => this.onRemoveState()} >Remove</span>
                    : <span className="add-state" onClick={() => this.onAddState()}>Add State</span>

                }
                <IonLoading style={{ float: "right" }} isOpen={this.state.showLoading} />


            </div>
        )
    }
}
export default withRouter(withIonLifeCycle(StateRow));
