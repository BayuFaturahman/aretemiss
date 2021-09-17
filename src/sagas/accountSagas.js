//Async Storage Library
import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../services/api';
import {
UPDATE_PROFILE, 
GET_JOURNAL,
CREATE_JOURNAL,
ACCOUNT,
GET_TEAM_LIST,
GET_TEAM_MEMBER,
GET_JOURNAL_DETAIL,
} from '../actions/types';
import { updateProfileSuccess, updateProfileFailed, getJournalSuccess, getJournalFailed, createJournalSuccess, createJournalFailed, accountSuccess, accountFailed, getTeamListSuccess, getTeamListFailed, getTeamMemberFailed, getTeamMemberSuccess, getJournalDetailSuccess, getJournalDetailFailed } from '../actions/index';
import Utils from '../common/utils';

/* eslint-disable import/prefer-default-export */
function* workerUpdateAccount(api, params) {
  try {
    if (params.payload) {
      const response = yield call(api.updateAccount, params.payload);
      yield call(api.setAuthToken,response.data.data.token);

      if (response.status === 200) {
        yield put(updateProfileSuccess(response.data));
      } else {
        let resp = Utils.checkErrorResponse(response);
        if (resp) {
          yield put(updateProfileFailed(resp))
        } else {
          if(response.status){

          }
          yield put(updateProfileFailed(response.data))
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}
/* eslint-disable import/prefer-default-export */
function* workerGetJournal(api, params) {
  try {
    const response = yield call(api.getJurnal);
    console.log('workerGetJournal', response.data)
    if (response.status === 200) {
      yield put(getJournalSuccess(response.data));
      
    } else {
      let resp = Utils.checkErrorResponse(response);
      if (resp) {
        yield put(getJournalFailed(resp))
      } else {
        if(response.status){

        }
        yield put(getJournalFailed(response.data))
      }
    }
  } catch (error) {
    console.log(error)
  }
}

/* eslint-disable import/prefer-default-export */
function* workerCreateJournal(api, params) {
  try {
    if (params.payload) {
      const response = yield call(api.createJurnal, params.payload);
      console.log('workerCreateJournal', response.data)
      if (response.status === 200) {
        yield put(createJournalSuccess(response.data));
      } else {
        let resp = Utils.checkErrorResponse(response);
        if (resp) {
          yield put(createJournalFailed(resp))
        } else {
          if(response.status){

          }
          yield put(createJournalFailed(response.data))
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}
/* eslint-disable import/prefer-default-export */
function* workerGetAccount(api, params) {
  try {
      const response = yield call(api.getAccount);
      console.log('workerGetAccount', response.data)
      if (response.status === 200) {
        yield put(accountSuccess(response.data));
      } else {
        let resp = Utils.checkErrorResponse(response);
        if (resp) {
          yield put(accountFailed(resp))
        } else {
          if(response.status){

          }
          yield put(accountFailed(response.data))
        }
      }
  } catch (error) {
    console.log(error)
  }
}
/* eslint-disable import/prefer-default-export */
function* workerGetTeamList(api, params) {
  try {
    const response = yield call(api.getTeamList);
    console.log('workerGetTeamList', response.data)

    if (response.status === 200) {
      yield put(getTeamListSuccess(response.data));
    } else {
      let resp = Utils.checkErrorResponse(response);
      if (resp) {
        yield put(getTeamListFailed(resp))
      } else {
        if(response.status){

        }
        yield put(getTeamListFailed(response.data))
      }
    }
  } catch (error) {
    console.log(error)
  }
}
/* eslint-disable import/prefer-default-export */
function* workerGetTeamMember(api, params) {
  try {
    console.log('workerGetTeamMember', params.payload)
    if (params.payload) {
      const response = yield call(api.getTeamMember, params.payload);
      console.log('workerGetTeamMember A', response.data)
      if (response.status === 200) {
        yield put(getTeamMemberSuccess(response.data));
      } else {
        let resp = Utils.checkErrorResponse(response);
        if (resp) {
          yield put(getTeamMemberFailed(resp))
        } else {
          if(response.status){

          }
          yield put(getTeamMemberFailed(response.data))
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}

/* eslint-disable import/prefer-default-export */
function* workerGetJournalDetail(api, params) {
  try {
    console.log('workerGetJournalDetail', params.payload)
    if (params.payload) {
      const response = yield call(api.getJurnalDetail, params.payload);
      console.log('workerGetJournalDetail', response.data)
      if (response.status === 200) {
        yield put(getJournalDetailSuccess(response.data));
      } else {
        let resp = Utils.checkErrorResponse(response);
        if (resp) {
          yield put(getJournalDetailFailed(resp))
        } else {
          if(response.status){

          }
          yield put(getJournalDetailFailed(response.data))
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}
export const watcherAccount = [
  takeLatest(UPDATE_PROFILE, workerUpdateAccount, api),
  takeLatest(GET_JOURNAL, workerGetJournal, api),
  takeLatest(CREATE_JOURNAL, workerCreateJournal, api),
  takeLatest(ACCOUNT, workerGetAccount, api),
  takeLatest(GET_TEAM_LIST, workerGetTeamList, api),
  takeLatest(GET_TEAM_MEMBER, workerGetTeamMember, api),
  takeLatest(GET_JOURNAL_DETAIL, workerGetJournalDetail, api)
]