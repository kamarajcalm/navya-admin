import React from "react";
import Select from "react-select";
import { IonGrid, IonRow, IonCol, IonLoading } from "@ionic/react";
import api from "../../../../api/endpoints";
import Card from "material-table-ui/components/Card/Card.jsx";
import CardBody from "material-table-ui/components/Card/CardBody.jsx";
import { getMonthOptions } from '../../../../stubs/utility';
import PieGraphCards from "../../../../common/graph_cards/pieGraphCards.jsx";
import BarGraphCards from "../../../../common/graph_cards/barGraphCards.jsx";
class DataByPhysicianDashboard extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            selectedMonth: { value: new Date().getMonth() + 1, label: new Date().toLocaleString('default', { month: 'long' }) },
            selectedYear: { value: null, label: null },
            caseData: { data: [], labelslist: [] },
            tatAcceptedCaseData: { data: [], labelslist: [], average_time_to_accept_case: 0, unit: '' },
            tatSubmitedCaseData: { data: [], labelslist: [], average_time_to_submit_case: 0, unit: '' },
            caseStatus: { data: [], labelslist: [] },
            caseRejection: { data: [], labelslist: [] },
            caseSubmission: { data: [], labelslist: [] },
            expertId: null,
        };
    }

    componentDidMount = () => {
        const date = new Date();
        this.setState({ selectedYear: { value: date.getFullYear(), label: date.getFullYear() } }, async () => {
            if (this.props.expertId) {
                await this.getDataByPhysicianCaseData(this.props.expertId);
                await this.getDataByPhysicianTAtimeToAccept(this.props.expertId);
                await this.getDataByPhysicianTAtimeToSubmitCase(this.props.expertId);
                // await this.getDataByPhysicianCaseStatus(this.props.expertId);
                await this.getDataByPhysicianRejection(this.props.expertId);
                await this.getDataByPhysicianSubmission(this.props.expertId);
            }
        });
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.expertId !== this.props.expertId) {
            await this.getDataByPhysicianCaseData(this.props.expertId);
            await this.getDataByPhysicianTAtimeToAccept(this.props.expertId);
            await this.getDataByPhysicianTAtimeToSubmitCase(this.props.expertId);
            // await this.getDataByPhysicianCaseStatus(this.props.expertId);
            await this.getDataByPhysicianRejection(this.props.expertId);
            await this.getDataByPhysicianSubmission(this.props.expertId);
        }
    }

    handleDateChange = async (selectedOption, val) => {
        this.setState({ [selectedOption]: val }, async () => {
            await this.getDataByPhysicianCaseStatus(this.props.expertId);
        })
    }

    async getDataByPhysicianCaseData(id) {
        this.setState({ loading: true });
        let response = await api.getCaseData({ 'expert_id': id });
        if (response && response.success) {
            let data = response?.data;
            let cData = [];
            for (const property in data.result[0]) {
                if (property !== 'expert_id')
                    cData.push({ 'name': property, 'value': data?.result[0][property] });
            }
            let labelslist = [];
            let colors = ['#00DEF5', '#EC008C', '#FFBF3F'];
            data.columns.forEach((val, i) => {
                labelslist.push({ value: val.title, type: 'square', color: colors[i], field: val.field })
            })
            const caseData = { data: cData, labelslist, }
            this.setState({ caseData });
        }
    }

    async getDataByPhysicianTAtimeToAccept(id) {
        let response = await api.getTurnAroundTimeToAcceptCase({ 'expert_id': id });
        if (response && response.success) {
            let data = response?.data;
            let taData = []
            for (const property in data.result[0]) {
                taData.push({ 'name': property, 'value': data?.result[0][property] });
            }
            let labelslist = [];
            let colors = ['#0072CE', '#FFBF3F', '#EC008C'];
            data.columns.forEach((val, i) => {
                labelslist.push({ value: val.title, type: 'square', color: colors[i], field: val.field })
            })
            const tatAcceptedCaseData = {
                data: taData,
                labelslist,
                average_time_to_accept_case: data.average_time_to_accept_case,
                unit: data.unit
            }
            this.setState({ tatAcceptedCaseData });
        }
    }

    async getDataByPhysicianTAtimeToSubmitCase(id) {
        let response = await api.getTurnAroundTimeToSubmitCase({ 'expert_id': id });
        if (response && response.success) {
            let data = response?.data;
            let tsData = [];
            for (const property in data.result[0]) {
                tsData.push({ 'name': property, 'value': data?.result[0][property] });
            }
            let labelslist = [];
            let colors = ['#0072CE', '#FFBF3F', '#EC008C'];
            data.columns.forEach((val, i) => {
                labelslist.push({ value: val.title, type: 'square', color: colors[i], field: val.field })
            })
            const tatSubmitedCaseData = {
                data: tsData,
                labelslist,
                average_time_to_submit_case: data.average_time_to_submit_case,
                unit: data.unit
            }
            this.setState({ tatSubmitedCaseData });
        }
    }

    async getDataByPhysicianRejection(id) {
        let response = await api.getCaseRejection({ 'expert_id': id });
        if (response && response.success) {
            let data = response?.data;
            let rejData = [];
            for (let i = 0; i < data.result.length; i++) {
                for (const property in data.result[i]) {
                    if (property !== 'total')
                        rejData.push({ 'name': property, 'value': data.result[i].total });
                }
            }
            let labelslist = [];
            let colors = ['#00DEF5', '#FFBF3F', '#0072CE', '#EC008C'];
            data.columns.forEach((val, i) => {
                labelslist.push({ value: val.title, type: 'square', color: colors[i], field: val.field })
            })
            const caseRejection = { data: rejData, labelslist, }
            this.setState({ caseRejection });
        }
    }

    async getDataByPhysicianSubmission(id) {
        let response = await api.getCaseSubmission({ 'expert_id': id });
        if (response && response.success) {
            let data = response?.data;
            let subData = [];
            for (const property in data.result[0]) {
                subData.push({ 'name': property, 'value': data?.result[0][property] })
            }
            let labelslist = [];
            let colors = ['#0072CE', '#FFBF3F'];
            data.columns.forEach((val, i) => {
                labelslist.push({ value: val.title, type: 'square', color: colors[i], field: val.field })
            })
            const caseSubmission = { data: subData, labelslist, }
            this.setState({ caseSubmission, loading: false });
        } else {
            this.setState({ loading: false });
        }
    }

    async getDataByPhysicianCaseStatus(expertId) {
        if (expertId && this.state.selectedYear && this.state.selectedMonth) {
            const param = {
                'expert_id': expertId,
                'year': Number(this.state.selectedYear.label),
                'month': Number(this.state.selectedMonth.value)
            };
            let response = await api.getCaseStatus(param);
            if (response && response.success) {
                let data = response?.data;
                let labelslist = [];
                let colors = ['#00DEF5', '#FFBF3F', '#E74965', '#0072CE', '#55EF7C'];
                data.columns.forEach((val, i) => {
                    labelslist.push({ value: val.title, type: 'square', color: colors[i], field: val.field })
                })
                const caseStatus = { data: data.result, labelslist }
                this.setState({ caseStatus, loading: false });
            } else {
                this.setState({ loading: false });
            }
        }
    }

    getYearOptions() {
        let yearOptions = [];
        const date = new Date();
        for (let i = date.getFullYear(); i > date.getFullYear() - 40; i--) {
            yearOptions.push({ value: i, label: i });
        }
        return yearOptions;
    }

    render() {

        const { tatAcceptedCaseData, tatSubmitedCaseData } = this.state;

        const acceptCaseTime = tatAcceptedCaseData.average_time_to_accept_case ? tatAcceptedCaseData.average_time_to_accept_case : 0;
        const submitCseTime = tatSubmitedCaseData.average_time_to_submit_case ? tatSubmitedCaseData.average_time_to_submit_case : 0;

        return (
            <React.Fragment>
                {!this.state.loading && (
                    <div>
                        { !this.state.caseData?.data?.length && !this.state.tatAcceptedCaseData?.data?.length &&
                          !this.state.tatSubmitedCaseData?.data?.length && !this.state.caseRejection?.data?.length &&
                          !this.state.caseSubmission?.data?.length &&
                          <h5 className='no-data-text'>No data found for this physician. Please select another physician.</h5>
                        }

                        <IonGrid>
                            <IonRow>
                                {
                                    this.state.caseData?.data?.length ? (
                                        <PieGraphCards title='Invitation Responses' payload={this.state.caseData} />
                                    ) : null
                                }
                                {
                                    this.state.tatAcceptedCaseData?.data?.length ? (
                                        <PieGraphCards title='Time to Accept Case'
                                            payload={this.state.tatAcceptedCaseData}
                                            isBadge={true}
                                            avgTime={acceptCaseTime} />
                                    ) : null
                                }
                                {
                                    this.state.tatSubmitedCaseData?.data?.length ? (
                                        <PieGraphCards title='Time to Submit Case'
                                            payload={this.state.tatSubmitedCaseData}
                                            isBadge={true}
                                            avgTime={submitCseTime} />
                                    ) : null
                                }
                            </IonRow>
                            {/* Commenting case activity section as per current requirements */}
                            {/* <IonRow>
                                <IonCol>
                                    <Card className="card-container-ah">
                                        <CardBody className="filter-card-body">
                                            <ion-grid>
                                                <IonRow class="ion-justify-content-around">
                                                    <IonCol size="6">
                                                        <h6 className="card-title-ah">Case Activity</h6>
                                                    </IonCol>
                                                    <IonCol size="3">
                                                        <Select
                                                            menuPortalTarget={document.body}
                                                            value={this.state.selectedMonth}
                                                            onChange={(e) => this.handleDateChange("selectedMonth", e)}
                                                            options={getMonthOptions()}
                                                            placeholder={"Select a Month"}
                                                        />
                                                    </IonCol>
                                                    <IonCol size="3">
                                                        <Select
                                                            menuPortalTarget={document.body}
                                                            value={this.state.selectedYear}
                                                            onChange={(e) => this.handleDateChange("selectedYear", e)}
                                                            options={this.getYearOptions()}
                                                            placeholder={"Select a Year"}
                                                        />
                                                    </IonCol>
                                                </IonRow>
                                                <IonRow>
                                                    <BarGraphCards
                                                        payload={this.state.caseStatus}
                                                    />
                                                </IonRow>
                                            </ion-grid>
                                        </CardBody>
                                    </Card>
                                </IonCol>
                            </IonRow> */}
                            <IonRow>
                                {
                                    this.state.caseRejection?.data?.length ? (
                                        <PieGraphCards title='Reject Reason' payload={this.state.caseRejection} />
                                    ) : null
                                }
                                {
                                    this.state.caseSubmission?.data?.length ? (
                                        <PieGraphCards title='Submission On-Time' payload={this.state.caseSubmission} />
                                    ) : null
                                }
                                <IonCol>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </div>
                )}
                <IonLoading isOpen={this.state.loading} />
            </React.Fragment>
        );
    }
}

export default DataByPhysicianDashboard;
