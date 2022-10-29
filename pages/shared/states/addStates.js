import React from "react";
import { withRouter } from "react-router-dom";
import {
    IonPage,
    withIonLifeCycle,
    IonLoading,
} from "@ionic/react";
import { Checkbox, Button } from "@material-ui/core";
import api from "../../../api/endpoints";
import FormModal from "../../../common/formModal";
import SearchBar from "./searchbar";

class AddStates extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            searchString: "",
            allStatesList: [],
            selectedStates: []
        };
    }
    componentDidMount() {
        this.setState({
            loading: true
        }, async () => {
            const payload = {
                "org": "Navya",
                "hospital_id": this.props.hospitalId
            }
            const response = await api.getAllStates(payload)
            if (response && response.success && response.data.result) {
                this.setState({
                    allStatesList: response.data.result,
                })
            }
            else {
                this.setState({ loading: false });
            }
        })
    }

    handleClose = () => {
        this.props.onClose(false);
    };

    handleCheckBox(item, event) {
        const { selectedStates } = this.state;
        if (event.target.checked) {
            this.setState({ selectedStates: [...selectedStates, item] });
        } else {
            const ids = selectedStates.filter(value => value.state_id !== item.state_id)
            this.setState({ selectedStates: ids });
        }
    }


    filterStateList() {
        const { searchString, allStatesList } = this.state;
        return allStatesList.filter(s => s.state_name.toLowerCase().match(searchString.toLowerCase()))
    }

    AddStateClicked = async () => {
        this.props.onClose(this.state.selectedStates);
    }

    render() {

        let statesList = this.state.searchString ? this.filterStateList() : this.state.allStatesList

        return (
            <IonPage className="login-container-page">
                {
                    !this.state.showLoading && (
                        <FormModal modalClass={'holiday-list-modal addState-modal'} isOpen={this.props.isOpen} modalTitle={"States"} onClose={this.handleClose}>
                            <div className="search-container-div">
                                <SearchBar searchValue={this.state.searchString} setSearchQuery={(val) => this.setState({ searchString: val })} />
                            </div>
                            <div className="holiday-list-container form-group">
                                {
                                    statesList.map(v => {
                                        return (
                                            <div className="holiday-list" key={this.props.state_id}>
                                                <Checkbox
                                                    className="modal-list-checkbox"
                                                    onChange={event => this.handleCheckBox(v, event)}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                    color="primary"
                                                />
                                                <span>{v.state_name}</span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="footer">
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
export default withRouter(withIonLifeCycle(AddStates));
