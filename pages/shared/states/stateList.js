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
import Select from "react-select";

class StatesList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      selectedValue: { value: "1", label: "All" },
      searchString: "",
      checkedStates: [],
      exclusiveTerritoryList: [],
      whiteSpaceAllocationsList: []

    };
  }

  getStatesForFp = async () => {
    this.setState({ showLoading: true }, async () => {
      try {
        const [whiteSpaceListResponse, exclusiveListResponse] = await Promise.all([
          api.getStatesForFp({ "hospital_id": this.props.hospitalId, "white_space": 1 }),
          api.getStatesForFp({ "hospital_id": this.props.hospitalId, "white_space": 0 })
        ])

        if (exclusiveListResponse && exclusiveListResponse.success &&
          whiteSpaceListResponse && whiteSpaceListResponse.success) {
          let exclusiveTerritoryList = exclusiveListResponse.data.result;
          let whiteSpaceAllocationsList = whiteSpaceListResponse.data.result

          this.setState({
            exclusiveTerritoryList,
            whiteSpaceAllocationsList,
            checkedStates: [],
            showLoading: false,
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


  async componentDidMount() {
    this.setState({ showLoading: true }, async () => {
      await this.getStatesForFp();
    })

  }

  handleClose = () => {
    this.props.onClose(false);
  };



  onSortByStates = (a, b) => {
    if (a.stateName < b.stateName)
      return -1;
    else if (a.stateName > b.stateName)
      return 1;
    else
      return 0;

  }

  getStateListToRender() {
    let selectedState = this.state.selectedValue.value;
    let exclusiveList = this.state.exclusiveTerritoryList.map(x => ({
      stateId: x.state_id,
      stateName: x.state_name,
      allocation: "Exclusive Territory"
    }))

    if (selectedState == "3")
      return exclusiveList.sort(this.onSortByStates)

    let whiteSpaceList = this.state.whiteSpaceAllocationsList.map(x => ({
      stateId: x.state_id,
      stateName: x.state_name,
      allocation: "White Space Allocation"
    }))

    if (selectedState == "2")
      return whiteSpaceList.sort(this.onSortByStates)

    return [...exclusiveList, ...whiteSpaceList].sort(this.onSortByStates)

  }

  filterStateList(stateList) {
    const { searchString } = this.state;
    return stateList.filter(s => s.stateName.toLowerCase().match(searchString.toLowerCase()))
  }

  onhandleCheckBox(item, event) {

    let checkedStates = this.state.checkedStates
    if (event.target.checked)
      checkedStates = checkedStates.concat(item.stateId)
    else
      checkedStates = checkedStates.filter(s => s != item.stateId)
    this.setState({ checkedStates })
  }

  onConvertClick = () => {
    let checkedStates = this.state.checkedStates;
    if (checkedStates.length === 0)
      return;
    this.setState({ showLoading: true }, async () => {
      const payload = {
        "hospital_id": this.props.hospitalId,
        "state_ids": checkedStates
      }
      try {
        const response = await api.convertStatesForFp(payload)
        if (response && response.success)
          await this.getStatesForFp(true, this.props.stateId)
        else
          this.setState({ showLoading: false });

      } catch (error) {
        console.error('Error : ', error);
        this.setState({ showLoading: false });
      }
    });
  }

  onRemoveClick = () => {
    let checkedStates = this.state.checkedStates;
    if (checkedStates.length === 0)
      return;
    this.setState({ showLoading: true }, async () => {
      const payload = {
        "hospital_id": this.props.hospitalId,
        "state_ids": checkedStates
      }
      try {
        const response = await api.removeStateFromFp(payload)
        if (response && response.success)
          await this.getStatesForFp(true, this.props.stateId)
        else
          this.setState({ showLoading: false });

      } catch (error) {
        console.error('Error : ', error);
        this.setState({ showLoading: false });
      }
    });
  }
  render() {
    let isManage = this.props.isManage
    let statesList = this.getStateListToRender();
    statesList = this.state.searchString ? this.filterStateList(statesList) : statesList;
    let title = isManage ? "Manage States" : "States";

    return (
      <IonPage className="login-container-page">
        {
          !this.state.showLoading && (
            <FormModal modalClass={'holiday-list-modal'} isOpen={this.props.isOpen} modalTitle={title} onClose={this.handleClose}>
              <div style={{ margin: "10px", display: "flex", "gap": "260px" }}>
                <span><SearchBar  searchValue={this.state.searchString} setSearchQuery={(val) => this.setState({ searchString: val })} /></span>
                <span style={{ width: "240px" }}>
                  <Select
                    onChange={(e) =>
                      this.setState({ selectedValue: e })
                    }
                    value={this.state.selectedValue}
                    options={[{ value: '1', label: 'All' },
                    { value: '2', label: 'White Space Allocation' },
                    { value: '3', label: 'Exclusive Territory' }]}
                  />
                </span>
              </div>
              {statesList.length > 0 && (
                <>
                  <div className="holiday-list-container form-group">
                    {
                      statesList.map(v => {
                        return (
                          <div className="holiday-list" key={this.props.stateId}>

                            {isManage && (
                              <Checkbox
                                className="modal-list-checkbox"

                                onChange={event => this.onhandleCheckBox(v, event)}
                                inputProps={{ 'aria-label': 'controlled' }}
                                color="primary"
                              />
                            )}
                            <span>
                              {v.stateName}</span>
                            <span style={{ float: 'right' }}>{v.allocation}</span>
                          </div>
                        )
                      })
                    }
                  </div>
                </>
              )}
               {statesList.length == 0 && (
                 <div className='no-data-container'>No Data Found</div>
              )}
              {isManage && (

                <div className="footer">

                  <Button
                    color="primary"
                    variant="contained"
                    onClick={this.onConvertClick}
                    className="min-100"
                  >
                    Convert
                  </Button>
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={this.onRemoveClick}
                    className="min-100"
                  >
                    Remove
                  </Button>
                </div>
              )}


            </FormModal>
          )
        }

        <IonLoading isOpen={this.state.showLoading} />
      </IonPage>
    );
  }
}
export default withRouter(withIonLifeCycle(StatesList));
