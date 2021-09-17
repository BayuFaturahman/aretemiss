// a library to wrap and simplify api calls
import apisauce from 'apisauce';

const create = (baseURL = 'https://hermes-dot-ilead-2021.et.r.appspot.com/') => {

  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      'Cache-Control': 'no-cache',
      // 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI4YjM2Y2YxYS0zMmRmLTQyM2YtOTEwYS02NjdiNGUxMWM0ZGEiLCJpYXQiOjE2MzA1NTYxNTQsImV4cCI6MTYzMDY0MjU1NH0.tQYb2rngQWVIVFJH44ByQTVoEBAGGvOQ2U__WE3Jzo4'
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI4YjM2Y2YxYS0zMmRmLTQyM2YtOTEwYS02NjdiNGUxMWM0ZGEiLCJpYXQiOjE2MzE4Njk4ODcsImV4cCI6MTYzMTk1NjI4N30.KuKziiiypjKkBtwtNmtWDdWrxux3KvSrbrsBhjioV7A'

    },
    // 10 second timeout...
    timeout: 30000
  });

  const setAuthToken = (userAuth) => { api.setHeader('Authorization', `Bearer ${userAuth}`) };
  const setLanguage = () => api.setHeader('Accept-Language', 'id');  
  const removeAuthToken = () => api.setHeader('Authorization', '');

  const postLogin = (params) => api.post(`signin`, params);  
  const postLoginVerify = (params) => api.post(`signin/verify`, params);  
  const postSignUp = (params) => api.post(`signup`, params);  
  const postSignUpVerify = (params) => api.post(`signup/verify`, params);  
  const postResend = (params) => api.post(`user/resend-otp`, params); 

  const getAccount = () => api.get(`user/profile`);  
  const getTeamList = () => api.get(`team`);  
  const getTeamMember = (teamId) => api.get(`user?search&teamId=${teamId}`);  

  const updateAccount = (params) => api.patch(`user/${params.userid}`, params.data);  
  
  const getJurnal = () => api.get(`journal`);  
  const getJurnalDetail = (id) => api.get(`journal/${id}`);  
  const createJurnal = (params) => api.post(`journal`, params);  

  const getFeedback = (id) => api.get(`journal/${id}/feedback`);  
  const createFeedback = () => api.get(`journal`);  

  return {
    api,
    setAuthToken,
    setLanguage,
    removeAuthToken,
    postLogin,
    postLoginVerify,
    postSignUp,
    postSignUpVerify,
    postResend,
    updateAccount,
    getJurnal,
    createJurnal,
    getAccount,
    getTeamList,
    getTeamMember,
    getJurnalDetail,
    getFeedback,
    createFeedback
  };
};

// let's return back our create method as the default.
export default create();
