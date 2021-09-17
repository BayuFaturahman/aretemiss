import {
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    SIGNUP,
    SIGNUP_SUCCESS,
    SIGNUP_FAILED,
    RESEND_OTP,
    RESEND_OTP_SUCCESS,
    RESEND_OTP_FAILED,
    RESET_AUTH,
    LOGIN_VERIFY,
    LOGIN_VERIFY_SUCCESS,
    LOGIN_VERIFY_FAILED,
    SIGNUP_VERIFY,
    SIGNUP_VERIFY_SUCCESS,
    SIGNUP_VERIFY_FAILED,
} from '../actions/types';

const INITIAL_STATE = {
    loginrequest: null,
    loginVerifyrequest: {},
    signuprequest: null,
    signupverifyrequest: {},
    resendOTPrequest: {},
    resendResponse: {},
    phoneNumber: null,
    loginResponse: null,
    loginResponseVerify: null,
    signupResponse: null,
    signupResponseVerify: null,
    phoneNumber: null,
    otpHash: null,
    userId: null,
    spinner: false,
};


export default (state, action) => {
    if (typeof state === 'undefined') {
       return INITIAL_STATE
     }
    switch (action.type) {
       case LOGIN:
          return { ...state, loginrequest: action.payload, phoneNumber: action.payload.phoneNumber, spinner: true}
       case LOGIN_SUCCESS:
          return { 
             ...state, 
            loginResponse: action.payload, 
            otpHash: action.payload.data.otpHash,
            userId: action.payload.data.userId,
            spinner: false,
         }
      case LOGIN_FAILED:
          return { ...state, loginResponse: action.payload, spinner: false}
      case LOGIN_VERIFY:
         return { ...state, loginVerifyrequest: action.payload, spinner: true}
      case LOGIN_VERIFY_SUCCESS:
         return { 
            ...state, 
            loginResponseVerify: action.payload, 
            spinner: false,
            otpHash: null,
            phoneNumber: null,
            loginResponse: null,
            loginrequest: null
         }
      case LOGIN_VERIFY_FAILED:
         return { ...state, loginResponse: action.payload, spinner: false}
      case SIGNUP:
         return { ...state, signuprequest: action.payload, phoneNumber: action.payload.phoneNumber, spinner: true}
      case SIGNUP_SUCCESS:
         return { 
            ...state, 
            signupResponse: action.payload, 
            spinner: false,
            otpHash: action.payload.data.otpHash
         }
      case SIGNUP_FAILED:
            return { ...state, signupResponse: action.payload, spinner: false}
      case SIGNUP_VERIFY:
            return { ...state, signupverifyrequest: action.payload, spinner: true}
      case SIGNUP_VERIFY_SUCCESS:
         return { 
            ...state, 
            signupResponseVerify: action.payload, 
            spinner: false,
            otpHash: null,
            phoneNumber: null,
            signuprequest: null,
            signupResponse: null,
         }
      case SIGNUP_VERIFY_FAILED:
            return { ...state, signupResponseVerify: action.payload, spinner: false}
      case RESEND_OTP:
            return { ...state, resendResponse: action.payload,otpHash: action.payload.data.otpHash, spinner: true}
      case RESEND_OTP_SUCCESS:
            return { 
               ...state, 
               signupResponse: action.payload, 
              spinner: false,
              otpHash: null
           }
      case RESEND_OTP_FAILED:
            return { ...state, signupResponse: action.payload, spinner: false}
      case RESET_AUTH:
            return INITIAL_STATE
      default:
            return state;
      }
   };