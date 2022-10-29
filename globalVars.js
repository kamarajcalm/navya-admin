

const surveyTabConstants = [
  ['PRIORITY'],
  ['NEW'],
  // ['PENDING', ['OVERDUE', 'XE']],
  ['OVERDUE'],
  ['DONE']
];

const apolloSurveyTabConstants = [
  ['PRIORITY'],
  ['NEW'],
  ['OVERDUE']
]

const globalVars = (function() {

  let surveysTab = null;
  const defaultSurveysTab = {
    currentTabIndex: 0,
    parentTabIndex: 0,
    isSubTab: 0
  };
  let APIHOST = null;
  let APIHOST_CB = null;
  let URILocationSearch = null;
  let networkStatus = 0;
  let historyCounter = 0;
  let isModalVisible = false;
  let isSurveySubmitInProgress = false;

  return {

    getSurveyTabConstants() {
      return surveyTabConstants;
    },

    setHistoryCounter(value) {
      historyCounter = value
    },

    getHistoryCounter() {
      return historyCounter;
    },

    setNetworkStatus(value) {
      networkStatus = value
    },

    getNetworkStatus() {
      return networkStatus;
    },

    clearSurveysTab() {
      surveysTab = null;
    },

    setSurveysTab(params) {
      if (Object.keys(params).length > 0) {
        surveysTab = {...params};
      }
    },

    getSurveysTab() {
      return surveysTab;
    },

    getDefaultSurveysTab() {
      return defaultSurveysTab;
    },

    setNApiHost(value) {
      APIHOST = value;
    },

    setCBApiHost(value) {
      APIHOST_CB = value;
    },

    getNApiHost() {
      return APIHOST;
    },

    getCBApiHost() {
      return APIHOST_CB;
    },

    setURILocationSearch(searchStr) {
      URILocationSearch = searchStr
    },

    getURILocationSearch() {
      return URILocationSearch;
    },

    setIsModalVisible(isVisible) {
      isModalVisible = isVisible;
    },

    isModalVisible() {
      return isModalVisible;
    },

    setIsSurveySubmitInProgress(inProgress) {
      isSurveySubmitInProgress = inProgress;
    },

    isSurveySubmitInProgress() {
      return isSurveySubmitInProgress;
    }
  }
})();

export default globalVars;
