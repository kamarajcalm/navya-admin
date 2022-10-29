import React from "react";
import Dashboard from 'material-table-ui/Dashboard';
import { isSmallScreen, canAccess } from '../../../../utils';
import { IonLoading, withIonLifeCycle  } from '@ionic/react';
import api from "../../../../api/endpoints";
import { formatDate, handleDateSorting } from '../../../../stubs/utility';
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";

class AcceptedCases extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = { dict_mapped_data: [], columns: [], loading: false, viewButton: {
            title: "",
            field: "",
            align: "center",
            render: (rowData) => (
              <div className="common-button">
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => this.viewClick(rowData)}
                  type="submit"
                  className="min-100 blue"
                >
                  View
                </Button>
              </div>
            ),
          },
     };
    }

    customDateFilter = async (startDate, endDate) => {
        await this.getAcceptedCases(formatDate(startDate), formatDate(endDate));
    };

    async componentDidMount() {
        let now = new Date();
        const backdate = new Date(now.setDate(now.getDate() - 30));
        let startDate = true ? new Date(backdate.getFullYear(), backdate.getMonth(), backdate.getDate()) : new Date(2020, 8, 1);
        let date = new Date(), y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
        let endDate = new Date(y, m, d);
        this.setState({
            start_date: formatDate(startDate),
            end_date: formatDate(endDate),
            loading: true
        }, async () => {
            this.customDateFilter(this.state.start_date, this.state.end_date);
        })
    }

    getAcceptedCases = async (startDate, endDate) => {
        let endDateLocal = new Date(endDate);
        let updatedEndDate = new Date(endDateLocal.getFullYear(), endDateLocal.getMonth(), endDateLocal.getDate(), 23, 59, 59, 999);
        const payload = { 'org': 'accesshope', 'start_date': new Date(startDate).toISOString(), 'end_date': new Date(updatedEndDate).toISOString() };
        const response = await api.getAcceptedCases(payload);
        if (response && response.success && response.data && response.data.result) {
            let finalData = response.data.result.map(v => {
                return {
                    case_id: v['case_id'],
                    age: !isNaN(v['age']) ? v['age'] : '',
                    gender: v['gender'],
                    consult_type: v['consult_type'],
                    dx_type: v['dx_type'],
                    date_assigned: v['date_assigned']? new Date(v['date_assigned']).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric", hour12: true, hour: '2-digit', minute: '2-digit' }) : "",
                    date_invited: v['date_invited']? new Date(v['date_invited']).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric", hour12: true, hour: '2-digit', minute: '2-digit' }) : "",
                    due_date: v['due_date']? new Date(v['due_date']).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric", hour12: true, hour: '2-digit', minute: '2-digit' }) : "",
                    state: v["state"],
                    fp: v["fp"],
                    accepted_by: v['accepted_by'],
                    survey_id: v["survey_id"],
                }
            })
            
            const newColumns = response.data.columns.map(v => {
                if (v.field === 'date_invited' || v.field === 'date_assigned' || v.field === 'due_date') {
                    const distantFuture = new Date(8640000000000000).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric", hour12: true, hour: '2-digit', minute: '2-digit' });
                    return {
                        ...v,
                        type: 'date',
                        customSort: (a, b) => {
                            let dateA = a[v.field] ? a[v.field] : distantFuture;
                            let dateB = b[v.field] ? b[v.field] : distantFuture;
                            return handleDateSorting(dateA).getTime() - handleDateSorting(dateB).getTime()
                        }
                    }
                } else {
                    return { ...v }
                }
            });
            if(canAccess(['can_view_case_actions'])) {
            newColumns.push(this.state.viewButton);
            }
            this.setState({ dict_mapped_data: finalData, columns: newColumns, loading: false });
        } else {
            this.setState({ loading: false });
        }
    }
    viewClick = (row) => {
        this.props.history.push("/user/dashboard/awaiting-review/" + row.survey_id);
      };
    
    render() {

        const isMobile = isSmallScreen();

        return (
            <React.Fragment>

                {!this.state.loading &&
                    <React.Fragment>
                        <Dashboard
                            title={this.state.dict_mapped_data.length ? <span className="table-title-1"> Total cases awaiting review: {this.state.dict_mapped_data.length}</span> : <React.Fragment />}
                            dict_mapped_data={this.state.dict_mapped_data || []}
                            columns={this.state.columns || []}
                            exportButton={{
                                csv: true,
                                pdf: false
                            }}
                            bottomMargin={true ? 0 : 45}
                            pageSize={true ? this.state.dict_mapped_data.length : 50}
                            searchFieldAlignment={Object.assign({}, isMobile ? {
                                searchFieldAlignment: 'left',
                                searchFieldStyle: { marginLeft: '-16px', width: '200px' },
                            } : null)}
                            filtering={false}
                            grouping={false}
                            datefilter={true}
                            custom_datefilter={true}
                            clearFilter={false}
                            custom_datefilter_function={this.customDateFilter}
                            defaultStartDate={this.state.start_date}
                            startMinDate={true ? new Date(2018, 0, 1) : new Date(2018, 0, 1)}
                            defaultEndDate={this.state.end_date}
                            noDataText={'No cases awaiting review'}
                            dateFormat='MMMM dd, yyyy'
                            filterDateLabel={'Filter by Accepted Date'}
                        />
                        {/* <h5 className="no-data-text">No cases awaiting review</h5> */}
                    </React.Fragment>
                }
                <IonLoading isOpen={this.state.loading} />
            </React.Fragment>
        )
    }
}

export default withRouter(withIonLifeCycle(AcceptedCases));
