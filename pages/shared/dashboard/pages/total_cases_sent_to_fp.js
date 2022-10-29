import React from "react";
import Select from "react-select";
import { IonGrid, IonRow, IonCol, IonLoading } from "@ionic/react";
import api from "../../../../api/endpoints";
import Card from "material-table-ui/components/Card/Card.jsx";
import CardBody from "material-table-ui/components/Card/CardBody.jsx";
import { getMonthOptions } from '../../../../stubs/utility';
import PieGraphCards from "../../../../common/graph_cards/pieGraphCards.jsx";
import BarGraphCards from "../../../../common/graph_cards/barGraphCards.jsx";
class TotalCasesSentToFP extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            selectedMonth: { value: new Date().getMonth() + 1, label: new Date().toLocaleString('default', { month: 'long' }) },
            selectedYear: { value: null, label: null },
            caseData: { data: [], labelslist: [] },
            caseStatus: { data: [], labelslist: [] },
            casesByDXGroup: { data: [], labelslist: [] },
            fpName: null,
        };
    }

    componentDidMount = () => {
        const date = new Date();
        this.setState({ selectedYear: { value: date.getFullYear(), label: date.getFullYear() } }, async () => {
            if (this.props.fpName) {
                await this.getCaseDataByFP(this.props.fpName);
                // await this.getCaseStatusByFP(this.props.fpName);
                await this.getCaseDataByDXGroup(this.props.fpName);
            }
        });
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.fpName !== this.props.fpName) {
            await this.getCaseDataByFP(this.props.fpName);
            // await this.getCaseStatusByFP(this.props.fpName);
            await this.getCaseDataByDXGroup(this.props.fpName);
        }
    }

    handleDateChange = async (selectedOption, val) => {
        this.setState({ [selectedOption]: val }, async () => {
            await this.getCaseStatusByFP(this.props.fpName);
        })
    }

    async getCaseDataByFP(id) {
        this.setState({ loading: true });
        let response = await api.getCaseDataByFP({ 'hospital': id });
        if (response && response.success) {
            let data = response?.data;
            let cData = [];
            for (const property in data.result[0]) {
                if (property !== 'fp_name')
                    cData.push({ 'name': property, 'value': data?.result[0][property] });
            }
            let labelslist = [];
            let colors = ['#00DEF5', '#EC008C', '#FFBF3F'];
            data.columns.forEach((val, i) => {
                labelslist.push({ value: val.title, type: 'square', color: colors[i], field: val.field })
            })
            const caseData = { data: cData, labelslist, }
            this.setState({ caseData, loading: false });
        } else {
            this.setState({ loading: false })
        }
    }

    async getCaseDataByDXGroup(id) {
        this.setState({ loading: true });
        let response = await api.getCaseDataByDXGroup({ 'hospital': id });
        if (response && response.success) {
            let data = response?.data;
            let rejData = [];
            let labelslist = [];
            let colors = ['#00DEF5', '#FFBF3F', '#0072CE', '#EC008C', '#003366', '#00be98', '#FFA500', '#FFBF3F', '#0072CE', '#EC008C', '#003366', '#DD0500'];
            for (let i = 0; i < data.result.length; i++) {
                for (const property in data.result[i]) {
                    if (property !== 'total')
                        rejData.push({ 'name': property, 'value': data.result[i][property] });
                    labelslist.push({ value: property, type: 'square', color: colors[Object.keys(data.result[i]).indexOf(property)], field: property })
                }
            }
            const casesByDXGroup = { data: rejData, labelslist, }
            this.setState({ casesByDXGroup, loading: false });
        } else {
            this.setState({ loading: false })
        }
    }

    async getCaseStatusByFP(fpName) {
        this.setState({ loading: true });
        if (fpName && this.state.selectedYear && this.state.selectedMonth) {
            const param = {
                'hospital': fpName,
                'year': Number(this.state.selectedYear.label),
                'month': Number(this.state.selectedMonth.value)
            };
            let response = await api.getCaseStatusByFP(param);
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
                this.setState({ loading: false })
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

        console.log("this.state.caseData?.data?.length");
        console.log(this.state.caseData?.data?.length);
        console.log(this.state.caseData);

        return (
            <React.Fragment>
                {!this.state.loading && (
                    <div>
                        { !this.state.caseData?.data?.length && !this.state.casesByDXGroup?.data?.length &&
                          <h5 className='no-data-text'>No data found for this FP. Please select another FP.</h5>
                        }
                        <IonGrid>
                            <IonRow>
                                {
                                    this.state.caseData?.data?.length ? (
                                        <PieGraphCards title='Invitation Responses' payload={this.state.caseData} />
                                    ) : null
                                }
                                {
                                    this.state.casesByDXGroup?.data?.length ? (
                                        <PieGraphCards title='Cases by Dx Group' payload={this.state.casesByDXGroup} />
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
                        </IonGrid>
                    </div>
                )}
                <IonLoading isOpen={this.state.loading} />
            </React.Fragment>
        );
    }
}

export default TotalCasesSentToFP;
