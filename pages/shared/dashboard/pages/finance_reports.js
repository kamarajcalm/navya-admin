import React from "react";
import { IonLoading, IonRow, IonCol } from "@ionic/react";
import Dashboard from 'material-table-ui/Dashboard';
import api from "../../../../api/endpoints";
import Card from "material-table-ui/components/Card/Card.jsx";
import CardBody from "material-table-ui/components/Card/CardBody.jsx";

class FinanceReportsDashboard extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            dict_mapped_data: [],
            columns: [],
            fpName: this.props.fpName || null,
            cases_sent_to_navya: 0,
            dual_review_cases: 0,
        };
    }

    async componentDidMount() {
        await this.getFinanceReports(this.props.fpName);
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.fpName !== this.props.fpName) {
            await this.getFinanceReports(this.props.fpName);
        }
    }

    async getFinanceReports(id) {
        if (id) {
            this.setState({ loading: true });
            let response = await api.getFinanceReports({ 'hospital': id });
            if (response && response.success && response.data.result) {
                let data = response?.data;
                let cData = [];
                for (const property in data.result[0]) {
                    if (property !== 'fp_name')
                        cData.push({ 'name': property, 'value': data?.result[0][property] });
                }
                const columns = response.data.columns.filter((col) => {
                    if (col.field !== 'cases_sent_to_navya' && col.field !== 'dual_review_cases') {
                        return col;
                    }
                });

                const finalData = Object.assign([], response.data.result.physicians_case_completion);
                this.setState({
                    dict_mapped_data: finalData,
                    columns,
                    loading: false,
                    fpName: this.props.fpName,
                    cases_sent_to_navya: response.data.result.cases_sent_to_navya,
                    dual_review_cases: response.data.result.dual_review_cases
                });
            } else {
                this.setState({ loading: false });
            }
        }
    }

    render() {
        const { dual_review_cases, cases_sent_to_navya, dict_mapped_data, columns } = this.state;
        return (
            <div className="finance-reports-dashboard">
                {!this.state.loading && <React.Fragment>
                    <IonRow>
                        <IonCol size="3">
                            <Card className="finance-cards">
                                <CardBody className="">
                                    Cases sent to Navya
                                    <div>{cases_sent_to_navya}</div>
                                </CardBody>
                            </Card>
                        </IonCol>
                        <IonCol size="3">
                            <Card className="finance-cards">
                                <CardBody className="">
                                    Dual review cases
                                    <div>{dual_review_cases}</div>
                                </CardBody>
                            </Card>
                        </IonCol>
                    </IonRow>
                    <Dashboard
                        title={<span className="table-title-1"> Expert case completion : </span>}
                        dict_mapped_data={dict_mapped_data || []}
                        columns={columns || []}
                        exportButton={false}
                        bottomMargin={true ? 0 : 45}
                        pageSize={true ? dict_mapped_data.length : 50}
                        filtering={false}
                        grouping={false}
                    />
                </React.Fragment>}
                <IonLoading isOpen={this.state.loading} />
            </div>
        );
    }
}

export default FinanceReportsDashboard;
