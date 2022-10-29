
import { getEnvironment, isWeb, isDev2 } from '../utils';

const CBBaseURLs = {
  "local": "https://accesshope.dev.bestopinions.us/cbbackend/admin/",
  "dev": "https://accesshope.dev.bestopinions.us/cbbackend/admin/",
  "preprod": "https://accesshope.patients.preproduction.navya.care/cbbackend/admin/",
  "prod": "https://accesshope.patients.navya.care/cbbackend/admin/"
}

function getConfig() {

  /* Inside config.js file here */
  console.log('inside configjs file-- tested ! busint cache!');

  var environment = getEnvironment();

  let ServiceURL, tSubmitServiceURL, urlRootNAPI, urlRootCB;

  if (environment === 'local'){
    urlRootNAPI = "https://ahadmin.dev.bestopinions.us/napi3/";
    // urlRootNAPI = "http://0.0.0.0:8008/napi3/";
    // urlRootCB = "http://localhost:8005/cbbackend/admin/";
    urlRootCB = "https://accesshope.dev.bestopinions.us/cbbackend/admin/";
  }
  else {
    urlRootNAPI = window.location.origin + "/napi3/";
    urlRootCB = CBBaseURLs[environment];
  }

  if (isDev2()){
    urlRootCB = 'https://accesshope.dev2.bestopinions.us/cbbackend/admin/';
  }

  ServiceURL = `${urlRootNAPI}webapi/`;
  tSubmitServiceURL = `${urlRootNAPI}eos/eosResponse`;

  return {
    ServiceURL,
    tSubmitServiceURL,
    urlRootNAPI,
    urlRootCB
  }
}

export default getConfig;
