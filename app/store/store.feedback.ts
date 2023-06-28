/* eslint-disable max-lines */
// #region IMPORTS

// PACKAGES
import { makeAutoObservable } from 'mobx';
import MainStore from "./store.main";
import ServiceStore from "./store.service";
import { AuthApi } from "@services/api/auth/auth-api";
import { Api } from "@services/api";
import { JournalEntryType } from "@screens/coaching-journal/new-journal-entry";
import { FeedbackApi } from '@services/api/feedback/feedback-api';
import { CreateCommitmentType, FeedbackUserDetail } from '@screens/feedback/feedback.type';

// #region MAIN CLASS
export type FeedbackJLSixth = {
  q1: number,
  q2: number,
  q3: number,
  q4: number,
  q5: number,
  q6: number,
}
export type FeedbackJLFive = {
  q1: number,
  q2: number,
  q3: number,
  q4: number,
  q5: number,
}

export type ExistingCoacheeModel = {
  coachee_id: string
  journal_title: string
  user_fullname: string
  is_button_disabled: number
  has_previous_feedback: number
}

export type FeedbackUserDetailModel = {
  fu_id: string
  fu_q1: number
  fu_q2: number
  fu_q3: number
  fu_q4: number
  from: string
  fu_coach_id: string
  fu_coachee_id: string
  fu_created_at: string
  fu_updated_at: string
  fu_deleted_at: string
}

export type FeedbackCommitmentModel = {
  id: string
  feedbackUserId: string
  commitment: string
  fu_created_at: string
  fu_updated_at: string
  fu_deleted_at: string
  fuc_feedback_user_id: string
}

export type RequestFeedbackUserModel = {
  rfu_user_from_id: string
  user_fullname: string
}

export type CreateFeedbackUserModel = {
  q1: string
  q2: string
  q3: string
  q4: string
  coach_id: string
  rfu_id: string
}

export interface ErrorFormResponse {
  errorCode: number
  message: string
}

const EMPTY_FEEDBACK_USER_DETAIL = {
  id: '',
  q1: 0,
  q2: 0,
  q3: 0,
  q4: 0,
  from: '',
  coachId: '',
  coacheeId: '',
  fu_created_at: '',
  fu_updated_at: '',
  fu_deleted_at: '',
  has_commitment: 0
}

const EMPTY_FEEDBACK_COMMITMENT = {
  id: '',
  feedbackUserId: '',
  commitment: '',
  fu_created_at: '',
  fu_updated_at: '',
  fu_deleted_at: '',
  fuc_feedback_user_id: '',
}

export default class FeedbackStore {
  // #region PROPERTIES

  mainStore: MainStore
  serviceStore: ServiceStore
  feedbackApi: FeedbackApi
  isLoading: boolean

  refreshData: boolean

  formErrorCode: number

  errorCode: number
  errorMessage: string

  isLoadingExistingCoachee: boolean
  isLoadingListRequetsFeedbackUser: boolean
  isLoadingListFeedbackUserByCoachee: boolean
  isLoadingFeedbackUserDetail: boolean
  listExistingCoachees: ExistingCoacheeModel[]
  listFeedbackUserByCoachee: FeedbackUserDetailModel[]
  listRequestFeedbackUser: RequestFeedbackUserModel[]

  feedbackUserDetail: FeedbackUserDetail
  feedbackCommitment: FeedbackCommitmentModel

  messageRequestFeedback: string
  messageCreateFeedbackCommitment: string
  messageCreateFeedbackUser: string

  messageCreateJournal: string
  messageUpdatedJournal: string
  messageCreateFeedback: string
  // End

  /* Misc */
  version = '1.0';

  api: Api

  // #region CONSTRUCTOR
  constructor(serviceStore: ServiceStore, mainStore: MainStore, api: Api) {

    this.mainStore = mainStore;
    this.serviceStore = serviceStore;
    this.formErrorCode = null
    this.api = api

    this.messageCreateJournal = ''
    this.messageUpdatedJournal = ''
    this.messageCreateFeedback = ''
    this.messageCreateFeedbackUser = ''
    this.messageRequestFeedback = ''
    this.messageCreateFeedbackCommitment = ''

    this.refreshData = false
    this.feedbackApi = new FeedbackApi(this.api)

    this.isLoadingExistingCoachee = false
    this.isLoadingListFeedbackUserByCoachee = false
    this.isLoadingFeedbackUserDetail = false
    this.isLoadingListRequetsFeedbackUser = false
    this.isLoading = false

    this.listExistingCoachees = []
    this.listFeedbackUserByCoachee = []
    this.listRequestFeedbackUser = []

    this.feedbackUserDetail = EMPTY_FEEDBACK_USER_DETAIL
    this.feedbackCommitment = EMPTY_FEEDBACK_COMMITMENT
    makeAutoObservable(this);
  }

  async getListExistingCoachee(page = 1, limit = 4) {
    this.isLoadingExistingCoachee = true
    try {
      const result = await this.feedbackApi.getExistingCoacheeList(page, limit)
      // console.log('in store getListExistingCoachee')
      if (result.kind === "ok") {
        // console.log('result.response.data  ', result.response)
        await this.getExistingCoacheeSucceed(result.response.data)
      } else if (result.kind === 'form-error') {
        console.log('getListExistingCoachee failed')
        // console.log(result.response.errorCode)
        this.feedbackFailed(result.response.errorCode)
      } else if (result.kind === 'unauthorized') {
        console.log('token expired list existing coachee')
        // console.log(result)
        this.feedbackFailed(result.response.errorCode)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.isLoadingExistingCoachee = false
    }
  }

  async getExistingCoacheeSucceed(coachees: ExistingCoacheeModel[]) {
    console.log('getExistingCoacheeSucceed')
    this.listExistingCoachees = [
      ...this.listExistingCoachees,
      ...(coachees ?? [])
    ]
    this.formErrorCode = null
    this.isLoading = false
  }

  async getListFeedbackUserByCoachee(coacheeId: string, page = 1, limit = 4) {
    this.isLoadingListFeedbackUserByCoachee = true
    try {
      const result = await this.feedbackApi.getListFeedbackUserByCoachee(coacheeId, page, limit)
      console.log('in store getListFeedbackUserByCoachee')
      if (result.kind === "ok") {
        // console.log('result.response.data  ', result.response)
        await this.getListFeedbackUserByCoacheeSucceed(result.response.data)
      } else if (result.kind === 'form-error') {
        console.log('getListFeedbackUserByCoachee failed')
        // console.log(result.response.errorCode)
        this.feedbackFailed(result.response.errorCode)
      } else if (result.kind === 'unauthorized') {
        console.log('token expired getListFeedbackUserByCoachee')
        // console.log(result)
        this.feedbackFailed(result.response.errorCode)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.isLoadingListFeedbackUserByCoachee = false
    }
  }

  async getListFeedbackUserByCoacheeSucceed(feedbackList: FeedbackUserDetailModel[]) {
    console.log('getListFeedbackUserByCoacheeSucceed')
    this.listFeedbackUserByCoachee = [
      ...this.listFeedbackUserByCoachee,
      ...(feedbackList ?? [])
    ]
    this.formErrorCode = null
    this.isLoadingListFeedbackUserByCoachee = false
  }

  async getFeedbackUserDetail(feedbackUserId: string) {
    this.isLoadingFeedbackUserDetail = true
    try {
      const result = await this.feedbackApi.getFeedbackUserDetail(feedbackUserId)
      console.log('in store getFeedbackUserDetail')
      if (result.kind === "ok") {
        // console.log('result.response.data  ', result.response)
        await this.getFeedbackUserDetailSucceedd(result.response.data)
      } else if (result.kind === 'form-error') {
        console.log('getFeedbackUserDetail failed')
        // console.log(result.response.errorCode)
        this.feedbackFailed(result.response.errorCode)
      } else if (result.kind === 'unauthorized') {
        console.log('token expired getFeedbackUserDetail')
        // console.log(result)
        this.feedbackFailed(result.response.errorCode)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.isLoadingFeedbackUserDetail = false
    }
  }

  async getFeedbackUserDetailSucceedd(feedbackUserDetail: FeedbackUserDetail) {
    console.log('getFeedbackUserDetailSucceedd')
    this.feedbackUserDetail = feedbackUserDetail
    this.formErrorCode = null
    this.isLoading = false
  }

  async requestFeedbackUser(coacheeId: string) {
    this.isLoading = true
    console.log('requestFeedbackUser ', coacheeId)

    try {
      const result = await this.feedbackApi.requestFeedbackUser(coacheeId)
      // console.log('requestFeedbackUser result', result)
      if (result.kind === "ok") {
        this.requestFeedbackUserSucceed(result.response.message)
      } else if (result.kind === 'form-error') {
        console.log('requestFeedbackUser failed')
        // console.log(result.response.errorCode)
        this.feedbackFailed(result.response.errorCode)
      } else if (result.kind === 'unauthorized') {
        console.log('token expired requestFeedbackUser')
        // console.log(result)
        this.feedbackFailed(result.response.errorCode)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.isLoading = false
    }
  }

  requestFeedbackUserSucceed(message: string) {
    console.log('requestFeedbackUserSucceed ')
    this.messageRequestFeedback = message
    this.formErrorCode = null
    this.isLoading = false
  }

  async getFeedbackCommitment(feedbackUserId: string) {
    this.isLoading = true
    console.log('getFeedbackCommitment ', feedbackUserId)

    try {
      const result = await this.feedbackApi.getFeedbackCommitment(feedbackUserId)
      console.log('getFeedbackCommitment result', result)
      if (result.kind === "ok") {
        this.getFeedbackCommitmentSucceed(result.response.data)
      } else if (result.kind === 'form-error') {
        console.log('getFeedbackCommitment failed')
        // console.log(result.response.errorCode)
        this.feedbackFailed(result.response.errorCode)
      } else if (result.kind === 'unauthorized') {
        console.log('token expired getFeedbackCommitment')
        // console.log(result)
        this.feedbackFailed(result.response.errorCode)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.isLoading = false
    }
  }

  getFeedbackCommitmentSucceed(data: FeedbackCommitmentModel) {
    console.log('request getFeedbackCommitmentSucceed ')
    this.feedbackCommitment = data
    this.formErrorCode = null
    this.isLoading = false
  }

  async createFeedbackCommitment(data: CreateCommitmentType) {
    this.isLoading = true
    console.log('createFeedbackCommitment ', data)

    try {

      const result = await this.feedbackApi.createFeedbackCommitment(data)
      // console.log('requestFeedbackUser result', result)
      if (result.kind === "ok") {
        this.createFeedbackCommitmentSucceed(result.response.message)
      } else if (result.kind === 'form-error') {
        // console.log('requestFeedbackUser failed')
        this.formError(result.response.response)
        // console.log(result.response.errorCode)
        this.feedbackFailed(result.response.errorCode)
      } else if (result.kind === 'unauthorized') {
        console.log('token expired requestFeedbackUser')
        // console.log(result)
        this.feedbackFailed(result.response.errorCode)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.isLoading = false
    }
  }

  createFeedbackCommitmentSucceed(message: string) {
    console.log('requestFeedbackUserSucceed ')
    this.messageCreateFeedbackCommitment = message
    this.formErrorCode = null
    this.isLoading = false
  }

  async getListRequestFeedbackUser(page = 1, limit = 4) {
    this.isLoadingListRequetsFeedbackUser = true

    try {
      const result = await this.feedbackApi.getListRequestFeedbackUser(page, limit)
      // console.log('getListRequestFeedbackUser result', result)
      if (result.kind === "ok") {
        this.getListRequestFeedbackUserSucceed(result.response.data)
      } else if (result.kind === 'form-error') {
        console.log('getListRequestFeedbackUser failed')
        // console.log(result.response.errorCode)
        this.feedbackFailed(result.response.errorCode)
      } else if (result.kind === 'unauthorized') {
        console.log('token expired getListRequestFeedbackUser')
        // console.log(result)
        this.feedbackFailed(result.response.errorCode)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.isLoadingListRequetsFeedbackUser = false
    }
  }

  getListRequestFeedbackUserSucceed(data: RequestFeedbackUserModel[]) {
    console.log('request getListRequestFeedbackUserSucceed ')
    this.listRequestFeedbackUser = [
      ...this.listRequestFeedbackUser,
      ...(data ?? [])
    ]
    this.formErrorCode = null
    // this.isLoadingListRequetsFeedbackUser = false
  }

  async createFeedbackUser(data: CreateFeedbackUserModel) {
    this.isLoading = true
    console.log('createFeedbackUser ', data)

    try {
      const result = await this.feedbackApi.createFeedbackUser(data)
      // console.log('createFeedbackUser result', result)

      if (result.kind === "ok") {
        this.createFeedbackUserSucceed(result.response.message)
      } else if (result.kind === 'form-error') {
        console.log('createFeedbackUser failed')
        // console.log(result.response.errorCode)
        this.formError(result.response)
      } else if (result.kind === 'unauthorized') {
        console.log('token expired createFeedbackUser')
        // console.log(result)
        this.feedbackFailed(result.response.errorCode)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.isLoading = false
    }
  }

  createFeedbackUserSucceed(message: string) {
    console.log('createFeedbackUserSucceed ')
    this.messageCreateFeedbackUser = message
    this.formErrorCode = null
    this.isLoading = false
  }

  feedbackFailed(errorId: number,) {
    this.formErrorCode = errorId
    this.isLoading = false
  }

  async clearFeedback() {
    this.listExistingCoachees = []
    this.isLoadingExistingCoachee = false
    this.errorCode = null
    this.errorMessage = null
    this.formErrorCode = null
  }

  async clearListRequestFeedback() {
    this.listRequestFeedbackUser = []
    this.isLoading = false
    this.errorCode = null
    this.errorMessage = null
    this.formErrorCode = null
  }

  async clearListFeedbackUserByCoachee() {
    this.listFeedbackUserByCoachee = []
    this.isLoadingListFeedbackUserByCoachee = false
    this.errorCode = null
    this.errorMessage = null
    this.formErrorCode = null
  }

  async clearFeedbackUserDetail() {
    this.feedbackUserDetail = EMPTY_FEEDBACK_USER_DETAIL
    this.isLoadingFeedbackUserDetail = false
    this.errorCode = null
    this.errorMessage = null
    this.formErrorCode = null
  }

  async clearRequestFeedback() {
    this.messageRequestFeedback = ''
    this.isLoading = false
    this.errorCode = null
    this.errorMessage = null
    this.formErrorCode = null
  }

  async clearFeedbackCommitment() {
    this.feedbackCommitment = EMPTY_FEEDBACK_COMMITMENT
    this.isLoading = false
    this.errorCode = null
    this.errorMessage = null
    this.formErrorCode = null
  }

  setRefreshData(data: boolean) {
    this.refreshData = data
  }

  formError(data: ErrorFormResponse) {
    this.errorCode = data.errorCode
    this.errorMessage = data.message
  }

  formReset() {
    this.errorCode = null
    this.errorMessage = null
    this.refreshData = false
  }

  resetLoading() {
    this.isLoading = false
    this.isLoadingExistingCoachee = false
    this.isLoadingFeedbackUserDetail = false
    this.isLoadingListFeedbackUserByCoachee = false
    this.isLoadingListRequetsFeedbackUser = false
  }

  resetJournalList() {
    this.listJournal = []
    this.formErrorCode = null
    this.isLoading = false
  }
  // #endregion
}

