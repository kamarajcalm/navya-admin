import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import {
  IonPage,
  withIonLifeCycle,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
} from "@ionic/react";
import MultiSelect from "react-select";
import Button from "@material-ui/core/Button";
import api from "../../../../../api/endpoints";
import FormModal from "../../../../../common/formModal";
const Error = (props) => <div {...props} className="error-message" />;

export const required = (value, props, components) => {
  value = ("" + value).trim();
  if (!value) {
    return <Error>{"This field is required."}</Error>;
  }
};
class InviteExpert extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      listLoading: false,
      expertList: [],
      selectedExpert: "",
      isDataExits: false,
      apiError: false,
      errorMessage: "",
    };
  }

  componentDidMount() {
    console.log(this.props);
  }
  dropDownFormat = (data) => {
    const finalFormatData = data.map((item) => {
      return {
        label: item.first_name + " " + item.last_name,
        value: item.expert_id,
      };
    });
    return finalFormatData;
  };
  getExpertList = async () => {
    this.setState({
      listLoading: true,
    });
    const getData = await api.getUserList({
      org: "accesshope",
      search_str: "",
    });
    if (getData.success) {
      this.setState({
        expertList: this.dropDownFormat(getData.data.users),
        isDataExits: true,
        listLoading: false,
      });
    } else {
      this.setState({
        listLoading: false,
      });
    }
  };
  handleClose = () => {
    this.props.onClose(false);
  };
  handleChange = (e) => {
    this.setState({
      name: e.target.value,
    });
  };
  handleFocus = () => {
    this.setState({
      apiError: false,
      errorMessage: "",
    });
    if (!this.state.isDataExits) {
      this.getExpertList();
    }
  };
  onSubmit = () => {
    if (this.state.selectedExpert) {
      this.assignExpert();
    } else {
      this.setState({
        apiError: true,
        errorMessage: "Select User",
      });
    }
  };
  assignExpert = async () => {
    this.setState({
      showLoading: true,
    });
    let obj = {
      expert_id: +this.state.selectedExpert.value,
      survey_id: +this.props.survey_id,
      org: "accesshope",
    };
    try {
      let getData = await api.assignExpertApi(obj);
      if (getData && getData.success) {
        this.setState({
          showLoading: false,
        });
        this.props.onClose(true);
      } else {
        this.setState({
          showLoading: false,
          apiError: true,
          errorMessage: getData.message,
        });
      }
    } catch (e) {
      this.setState({
        showLoading: false,
      });
    }
  };
  onChange = (selectedValue) => {
    this.setState({
      selectedExpert: selectedValue,
    });
  };
  render() {
    return (
      <FormModal
        isOpen={this.props.isOpen}
        modalTitle={this.props.modalTitle}
        onClose={this.handleClose}
      >
        <IonGrid>
          <IonRow>
            <IonCol size="4">
              <p>{this.props.heading}</p>
            </IonCol>
            <IonCol size="8">
              <div className="form-group-select">
                <MultiSelect
                  value={this.state.selectedExpert}
                  menuPortalTarget={document.body}
                  menuPosition="absolute"
                  menuPlacement="auto"
                  onChange={this.onChange}
                  onFocus={this.handleFocus}
                  options={this.state.expertList}
                  placeholder="Select User"
                  isMulti={false}
                  isLoading={this.state.listLoading}
                />

                {this.state.apiError && (
                  <div className="error-message bottom">
                    {this.state.errorMessage}
                  </div>
                )}
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
        <div className="modal-footer text-right common-button">
          <Button
            variant="contained"
            type="button"
            disabled={this.state.showLoading}
            onClick={this.onSubmit}
            className="mr-3 min-100 blue"
          >
            {this.state.showLoading && (
              <IonSpinner name="bubbles" color="light" />
            )}
            {!this.state.showLoading && <span>Assign</span>}
          </Button>
          <Button
            variant="outlined"
            type="button"
            onClick={this.handleClose}
            className="min-100"
          >
            Cancel
          </Button>
        </div>
      </FormModal>
    );
  }
}

export default withRouter(withIonLifeCycle(InviteExpert));
