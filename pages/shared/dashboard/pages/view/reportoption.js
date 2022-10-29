export const getBreadCrumbData = (viewtab) => {
  let backUrl = 0;
  let tabName = 0;
  switch (viewtab) {
    case "awaiting-acceptance":
      backUrl = "/user/dashboard?report=case&type=0";
      tabName = "Pending Invite";
      break;
    case "awaiting-review":
      backUrl = "/user/dashboard?report=case&type=1";
      tabName = "Accepted Cases";
      break;
    case "rejected-or-ignored":
      backUrl = "/user/dashboard?report=case&type=2";
      tabName = "Rejected Cases";
      break;
    case "physician-reviewed":
      backUrl = "/user/dashboard?report=case&type=3";
      tabName = "Completed Cases";
      break;
    case "np-qc-complete":
      backUrl = "/user/dashboard?report=case&type=4";
      tabName = "NP QC Completed Opinions";
      break;
    case "md-qc-complete":
      backUrl = "/user/dashboard?report=case&type=5";
      tabName = "MD QC Completed Opinions";
      break;
    default:
      backUrl = 0;
      tabName = 0;
  }
  return { backUrl, tabName };
};

export const dateFormat = (date) => {
  return new Date(date).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const camelCase = (str) => {
  console.log(str);
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const tableDataFormat = (data) => {
  if (data && data.length) {
    data.forEach((element) => {
      element.expert_name = element.expert;
      element.accepted_date = (element.accepted_date && element.accepted_date !== '-' && element.accepted_date !== '')
        ? dateFormat(element["accepted_date"])
        : "-";
      element.assigned_date = (element.assigned_date && element.assigned_date !== '-' && element.assigned_date !== '')
        ? dateFormat(element["assigned_date"])
        : "-";
      element.completed_date = (element.completed_date && element.completed_date !== '-' && element.completed_date !== '')
        ? dateFormat(element["completed_date"])
        : "-";
      element.decision_date = (element.decision_date && element.decision_date !== '-' && element.decision_date !== '')
        ? dateFormat(element["decision_date"])
        : "-";
      element.invited_date = (element.invited_date && element.invited_date !== '-' && element.invited_date !== '')
        ? dateFormat(element["invited_date"])
        : "-";
      element.rejected_date = (element.rejected_date && element.rejected_date !== '-' && element.rejected_date !== '')
        ? dateFormat(element["rejected_date"])
        : "-";
      element.reverted_date = (element.reverted_date && element.reverted_date !== '-' && element.reverted_date !== '')
        ? dateFormat(element["reverted_date"])
        : "-";
      element.decision = element.decision ? camelCase(element.decision) : null;
    });
  }
  return data;
};
