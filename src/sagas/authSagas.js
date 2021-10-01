//Async Storage Library
import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../services/api';
import {
  LOGIN, LOGIN_VERIFY, SIGNUP, SIGNUP_VERIFY,

} from '../actions/types';
import {
  loginSuccess,
  loginFailed,
  loginVerifySuccess,
  loginVerifyFailed,
  signupSuccess,
  signupFailed,
  signupVerifySuccess,
  signVerifyFailed,
  setAuthToken,
} from '../actions/index';
import Utils from '../common/utils';

/* eslint-disable import/prefer-default-export */
function* workerLogin(api, params) {
  try {
    if (params.payload) {
      console.log('params.payload.', params.payload)

      const response = yield call(api.postLogin, params.payload);
      if (response.status === 200) {
        yield put(loginSuccess(response.data));
        console.log('response.', response.data)
      } else {
        let resp = Utils.checkErrorResponse(response);
        if (resp) {
          yield put(loginFailed(resp))
        } else {
          if(response.status){

          }
          yield put(loginFailed(response.data))
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}

/* eslint-disable import/prefer-default-export */
function* workerLoginVerify(api, params) {
  try {
    if (params.payload) {
      const response = yield call(api.postLoginVerify, params.payload);
      if (response.status === 200) {
        yield call(api.setAuthToken,response.data.data.token);
        yield put(setAuthToken(response.data.data.token))
        console.log('response.', response.data)
        yield put(loginVerifySuccess(response.data));
      } else {
        let resp = Utils.checkErrorResponse(response);
        if (resp) {
          yield put(loginVerifyFailed(resp))
        } else {
          if(response.status){

          }
          yield put(loginVerifyFailed(response.data))
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}
/* eslint-disable import/prefer-default-export */
function* workerSignup(api, params) {
  try {
    if (params.payload) {
      const response = yield call(api.postSignUp, params.payload);
      console.log('response.', response.data)
      if (response.status === 200) {
        yield put(signupSuccess(response.data));
      } else {
        let resp = Utils.checkErrorResponse(response);
        if (resp) {
          yield put(signupFailed(resp))
        } else {
          if(response.status){

          }
          yield put(signupFailed(response.data))
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}
/* eslint-disable import/prefer-default-export */
function* workerSignUpVerify(api, params) {
  try {
    if (params.payload) {
      const response = yield call(api.postSignUpVerify, params.payload);
      console.log('response.', response.data)
      if (response.status === 200) {
      
        yield call(api.setAuthToken,response.data.data.token);
        yield put(signupVerifySuccess(response.data));
      } else {
        let resp = Utils.checkErrorResponse(response);
        if (resp) {
          yield put(signVerifyFailed(resp))
        } else {
          if(response.status){

          }
          yield put(signVerifyFailed(response.data))
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}
export const watcherAuth = [
  takeLatest(LOGIN, workerLogin, api),
  takeLatest(LOGIN_VERIFY, workerLoginVerify, api),
  takeLatest(SIGNUP, workerSignup, api),
  takeLatest(SIGNUP_VERIFY, workerSignUpVerify, api),
]