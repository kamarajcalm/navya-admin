import React from "react";
import { IonLoading, withIonLifeCycle } from "@ionic/react";
import { Tabs } from '../../../../common';
import PendingInvites from './pending_invites';
import AcceptedCases from './accepted_cases';
import RejectedOrIgnoredCases from "./rejected_ignored_cases";
import CompletedOpinions from "./completed_opinions";
import NPQCCompletedOpinions from "./np_qc_completed_opinions";
import MDQCCompletedOpinions from "./md_qc_completed_opinions";
import AwaitingNPQC from "./awaiting_np_qc";
import AwaitingMDQC from "./awaiting_md_qc";
import { withRouter } from "react-router-dom";
import { canAccess } from "../../../../utils";

class CaseStatusReportDashboard extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading: false, parentTabIndex: 0,
        };
    }

    getDashhboardTabs() {
        let tabList = [
            {
                requiresCrossHospitalAccess: false,
                tabLabel: {
                    name: "Awaiting Acceptance"
                },
                tabDataComponent: {
                    name: PendingInvites,
                    props: {
                        currentTabIndex: 0,
                        parentTabIndex: 0,
                        isSubTab: 0,
                        delegateHandle: 'perf-scroll'
                    }
                },
                tabContentClass: 'case-status-reports-dashboard-container'
            },
            {
                requiresCrossHospitalAccess: false,
                tabLabel: {
                    name: "Awaiting Review"
                },
                tabDataComponent: {
                    name: AcceptedCases,
                    props: {
                        currentTabIndex: 0,
                        parentTabIndex: 1,
                        isSubTab: 0,
                        delegateHandle: 'perf-scroll'
                    }
                },
                tabContentClass: 'case-status-reports-dashboard-container'
            },
            {
                requiresCrossHospitalAccess: false,
                tabLabel: {
                    name: "Rejected or Ignored"
                },
                tabDataComponent: {
                    name: RejectedOrIgnoredCases,
                    props: {
                        currentTabIndex: 0,
                        parentTabIndex: 2,
                        isSubTab: 0,
                        delegateHandle: 'perf-scroll'
                    }
                },
                tabContentClass: 'case-status-reports-dashboard-container'
            },
            {
                requiresCrossHospitalAccess: false,
                tabLabel: {
                    name: "Physician Reviewed"
                },
                tabDataComponent: {
                    name: CompletedOpinions,
                    props: {
                        currentTabIndex: 0,
                        parentTabIndex: 3,
                        isSubTab: 0,
                        delegateHandle: 'perf-scroll'
                    }
                },
                tabContentClass: 'case-status-reports-dashboard-container'
            },
            // {
            //     requiresCrossHospitalAccess: true,
            //     tabLabel: {
            //         name: "Awaiting NP QC "
            //     },
            //     tabDataComponent: {
            //         name: AwaitingNPQC,
            //         props: {
            //             currentTabIndex: 0,
            //             parentTabIndex: 4,
            //             isSubTab: 0,
            //             delegateHandle: 'perf-scroll'
            //         }
            //     },
            //     tabContentClass: 'case-status-reports-dashboard-container'
            // },
            {
                requiresCrossHospitalAccess: true,
                tabLabel: {
                    name: "NP QC Complete"
                },
                tabDataComponent: {
                    name: NPQCCompletedOpinions,
                    props: {
                        currentTabIndex: 0,
                        parentTabIndex: 4,
                        isSubTab: 0,
                        delegateHandle: 'perf-scroll'
                    }
                },
                tabContentClass: 'case-status-reports-dashboard-container'
            },
            // {
            //     requiresCrossHospitalAccess: true,
            //     tabLabel: {
            //         name: "Awaiting MD QC "
            //     },
            //     tabDataComponent: {
            //         name: AwaitingMDQC,
            //         props: {
            //             currentTabIndex: 0,
            //             parentTabIndex: 6,
            //             isSubTab: 0,
            //             delegateHandle: 'perf-scroll'
            //         }
            //     },
            //     tabContentClass: 'case-status-reports-dashboard-container'
            // },
            {
                requiresCrossHospitalAccess: true,
                tabLabel: {
                    name: "MD QC Complete"
                },
                tabDataComponent: {
                    name: MDQCCompletedOpinions,
                    props: {
                        currentTabIndex: 0,
                        parentTabIndex: 5,
                        isSubTab: 0,
                        delegateHandle: 'perf-scroll'
                    }
                },
                tabContentClass: 'case-status-reports-dashboard-container'
            },
            

        ].filter(row => !row.requiresCrossHospitalAccess || canAccess(['view_cross_hospital']));
        return tabList;
    }
    ionViewWillEnter() {
        this.gotoTab();
      }
      gotoTab = () => {
        this.setState({
          loading: true,
        });
        const searchParams = new URLSearchParams(this.props.location.search);
        const type = searchParams.get("type");
        let { parentTabIndex } = this.state;
        if (type) {
          parentTabIndex = +type;
        } else {
          parentTabIndex = 0;
        }
        this.setState({
          parentTabIndex,
          loading: false,
        });
      };
    render() {

        const tabList = this.getDashhboardTabs();

        return (
            <React.Fragment>
                {!this.state.loading && (
                    <div>
                        <Tabs
                            wrapperClass="dashboard-tabs"
                            tabObj={{ currentTabIndex: 0, parentTabIndex: this.state.parentTabIndex, isSubTab: 0 }}
                            data={tabList}
                            type="Dashboard"
                        />
                    </div>
                )}
                <IonLoading isOpen={this.state.loading} />
            </React.Fragment>
        );
    }
}

export default withRouter(withIonLifeCycle(CaseStatusReportDashboard));
