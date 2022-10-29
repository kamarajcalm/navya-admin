import TokenManager from './tokenManager';
import { errorHandler } from './errorHandler';
// import getConfig from './config';
import globalVars from '../globalVars';

import superagentPromise from 'superagent-promise';
import Promise from 'promise';

const tokenManager = new TokenManager();

const superagent = superagentPromise(require('superagent'), Promise);
/** Possible request options */
const requestsCB = {
  post: async (url, data, options, tokenHandler = function(){}, errorHandler = () => {}) => {
      const response = await superagent
        .post(`${globalVars.getCBApiHost()}${url}`, data)
        .use(tokenHandler.bind(this, options))
        .use(errorHandler)
        .withCredentials();
      return response.body || false;
  },
  get: async (url, data, options, tokenHandler = function(){}, errorHandler = () => {}) => {
    const response = await superagent
      .get(`${globalVars.getCBApiHost()}${url}`)
      .use(tokenHandler.bind(this, options))
      .use(errorHandler)
      .query(data)
      .withCredentials();
    return response.body || false;
  },
  delete: async (url, data, options, tokenHandler = function(){}, errorHandler = () => {}) => {
    const response = await superagent
      .del(`${globalVars.getCBApiHost()}${url}`)
      .use(tokenHandler.bind(this, options))
      .use(errorHandler)
      .send(data)
      .withCredentials();
    return response.body || false;
  },
  make: (url) => `${globalVars.getCBApiHost()}${url}`,
  crossPost: async (url, data, options, errorHandler = () => {}) => {
    const response = await superagent
      .post(url, data)
      .use(errorHandler);
    return response.body || false;
  },
  getBlob: async (url) => {
    const response = await superagent
      .get(url)
      .responseType('blob');
    return response || false;
  },
  put: async (url, data, options, tokenHandler = function(){}, errorHandler = () => {}) => {
    const response = await superagent
      .put(`${globalVars.getCBApiHost()}${url}`, data)
      .use(tokenHandler.bind(this, options))
      .use(errorHandler)
      .withCredentials();
    return response.body || false;
},
testCaseAssignmentPost: async (url, data, options, tokenHandler = function(){}, errorHandler = () => {}) => {
  const response = await superagent
    .post(`${url}`, data)
    .use(tokenHandler.bind(this, options))
    .use(errorHandler)
    .withCredentials();
  return response.body || false;
},
testCaseAssignmentGet: async (url, options, tokenHandler = function(){}, errorHandler = () => {}) => {
  const response = await superagent
    .get(`${url}`)
    .use(tokenHandler.bind(this, options))
    .use(errorHandler)
    .withCredentials();
  return response.body || false;
},
};

export default requestsCB;
