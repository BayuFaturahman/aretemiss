import {
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    LOGIN_VERIFY,
    LOGIN_VERIFY_SUCCESS,
    LOGIN_VERIFY_FAILED,
    SIGNUP,
    SIGNUP_SUCCESS,
    SIGNUP_FAILED,
    SIGNUP_VERIFY,
    SIGNUP_VERIFY_SUCCESS,
    SIGNUP_VERIFY_FAILED,
    ACCOUNT,
    ACCOUNT_SUCCESS,
    ACCOUNT_FAILED,
    CREATE_GOAL,
    CREATE_GOAL_SUCCESS,
    CREATE_GOAL_FAILED,
    RESET_AUTH,
    UPDATE_PROFILE,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAILED,
    GET_JOURNAL,
    GET_JOURNAL_SUCCESS,
    GET_JOURNAL_FAILED,
    CREATE_JOURNAL,
    GET_TEAM_LIST,
    GET_TEAM_LIST_SUCCESS,
    GET_TEAM_LIST_FAILED,
    GET_TEAM_MEMBER,
    GET_TEAM_MEMBER_SUCCESS,
    GET_TEAM_MEMBER_FAILED,
    CREATE_FEEDBACK,
    CREATE_FEEDBACK_SUCCESS,
    CREATE_FEEDBACK_FAILED,
    GET_FEEBACK,
    GET_FEEBACK_FAILED,
    GET_FEEBACK_SUCCESS,
    GET_JOURNAL_DETAIL,
    GET_JOURNAL_DETAIL_SUCCESS,
    GET_JOURNAL_DETAIL_FAILED,
    SET_REQUEST_JOURNAL,
    CREATE_JOURNAL_SUCCESS,
    CREATE_JOURNAL_FAILED,
} from './types';


export const loginActions = (value) => {
    return {
        type: LOGIN,
        payload: value
    }
}

export const loginSuccess = (response) => {
    return {
        type: LOGIN_SUCCESS,
        payload: response
    }
}

export const loginFailed = (response) => {
    return {
        type: LOGIN_FAILED,
        payload: response
    }
}

export const loginVerifyActions = (value) => {
    return {
        type: LOGIN_VERIFY,
        payload: value
    }
}

export const loginVerifySuccess = (response) => {
    return {
        type: LOGIN_VERIFY_SUCCESS,
        payload: response
    }
}

export const loginVerifyFailed = (response) => {
    return {
        type: LOGIN_VERIFY_FAILED,
        payload: response
    }
}

export const signupactions = (value) => {
    return {
        type: SIGNUP,
        payload: value
    }
}

export const signupSuccess = (response) => {
    return {
        type: SIGNUP_SUCCESS,
        payload: response
    }
}

export const signupFailed = (response) => {
    return {
        type: SIGNUP_FAILED,
        payload: response
    }
}

export const signupVerifyActions = (value) => {
    return {
        type: SIGNUP_VERIFY,
        payload: value
    }
}

export const signupVerifySuccess = (response) => {
    return {
        type: SIGNUP_VERIFY_SUCCESS,
        payload: response
    }
}

export const signVerifyFailed = (response) => {
    return {
        type: SIGNUP_VERIFY_FAILED,
        payload: response
    }
}


export const accountActions = (value) => {
    return {
        type: ACCOUNT,
        payload: value
    }
}

export const accountSuccess = (response) => {
    return {
        type: ACCOUNT_SUCCESS,
        payload: response
    }
}

export const accountFailed = (response) => {
    return {
        type: ACCOUNT_FAILED,
        payload: response
    }
}

export const createGoalActions = (value) => {
    return {
        type: CREATE_GOAL,
        payload: value
    }
}

export const createGoalSuccess = (response) => {
    return {
        type: CREATE_GOAL_SUCCESS,
        payload: response
    }
}

export const createGoalFailed = (response) => {
    return {
        type: CREATE_GOAL_FAILED,
        payload: response
    }
}

export const resetAuth = (value) => {
    return {
        type: RESET_AUTH,
        payload: value
    }
}


export const updateProfileActions = (value) => {
    return {
        type: UPDATE_PROFILE,
        payload: value
    }
}

export const updateProfileSuccess = (response) => {
    return {
        type: UPDATE_PROFILE_SUCCESS,
        payload: response
    }
}

export const updateProfileFailed = (response) => {
    return {
        type: UPDATE_PROFILE_FAILED,
        payload: response
    }
}
export const getJournalActions = (value) => {
    return {
        type: GET_JOURNAL,
        payload: value
    }
}

export const getJournalSuccess = (response) => {
    return {
        type: GET_JOURNAL_SUCCESS,
        payload: response
    }
}

export const getJournalFailed = (response) => {
    return {
        type: GET_JOURNAL_FAILED,
        payload: response
    }
}

export const createJournalActions = (value) => {
    return {
        type: CREATE_JOURNAL,
        payload: value
    }
}

export const createJournalSuccess = (response) => {
    return {
        type: CREATE_JOURNAL_SUCCESS,
        payload: response
    }
}

export const createJournalFailed = (response) => {
    return {
        type: CREATE_JOURNAL_FAILED,
        payload: response
    }
}

export const getTeamListActions = (value) => {
    return {
        type: GET_TEAM_LIST,
        payload: value
    }
}

export const getTeamListSuccess = (response) => {
    return {
        type: GET_TEAM_LIST_SUCCESS,
        payload: response
    }
}

export const getTeamListFailed = (response) => {
    return {
        type: GET_TEAM_LIST_FAILED,
        payload: response
    }
}

export const getTeamMemberActions = (value) => {
    return {
        type: GET_TEAM_MEMBER,
        payload: value
    }
}

export const getTeamMemberSuccess = (response) => {
    return {
        type: GET_TEAM_MEMBER_SUCCESS,
        payload: response
    }
}

export const getTeamMemberFailed = (response) => {
    return {
        type: GET_TEAM_MEMBER_FAILED,
        payload: response
    }
}

export const createFeedbackActions = (value) => {
    return {
        type: CREATE_FEEDBACK,
        payload: value
    }
}

export const createFeedbackSuccess = (response) => {
    return {
        type: CREATE_FEEDBACK_SUCCESS,
        payload: response
    }
}

export const createFeedbackFailed = (response) => {
    return {
        type: CREATE_FEEDBACK_FAILED,
        payload: response
    }
}

export const getFeedbackActions = (value) => {
    return {
        type: GET_FEEBACK,
        payload: value
    }
}

export const getFeedbackSuccess = (response) => {
    return {
        type: GET_FEEBACK_FAILED,
        payload: response
    }
}

export const getFeedbackFailed = (response) => {
    return {
        type: GET_FEEBACK_SUCCESS,
        payload: response
    }
}

export const getJournalDetailActions = (value) => {
    return {
        type: GET_JOURNAL_DETAIL,
        payload: value
    }
}

export const getJournalDetailSuccess = (response) => {
    return {
        type: GET_JOURNAL_DETAIL_SUCCESS,
        payload: response
    }
}

export const getJournalDetailFailed = (response) => {
    return {
        type: GET_JOURNAL_DETAIL_FAILED,
        payload: response
    }
}

export const setRequestJournal = (response) => {
    return {
        type: SET_REQUEST_JOURNAL,
        payload: response
    }
}