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

export type FeedbackDetail = {
  my_feedback: FeedbackJLSixth
  coachee_feedback: FeedbackJLSixth
  same_feedback: FeedbackJLFive
}
export type JLDetail = {
  desc: string
}

export type JournalDetail = {
  journal_id: string
  journal_title: string
  journal_coach_id: string
  journal_commitment: string
  journal_content: string
  journal_improvement: string
  journal_strength: string
  journal_type: string
  journal_date: string
  journal_label: string

  jl_lesson_learned
  jl_commitment
  jl_content


  jl_learner_fullname: []
  coach_fullname: string

  is_edited: boolean
  is_coachee: boolean
}

export type JournalLearnerModel = {
  jl_id: string
  jl_learner_id: string
  jl_fullname: string
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


  isDetail: boolean
  isDetailCoach: boolean

  isFormCoach: boolean
  refreshData: boolean

  formErrorCode: number

  errorCode: number
  errorMessage: string

  journalDetail: JournalDetail

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

  my_feedback: FeedbackJLSixth
  coachee_feedback: FeedbackJLSixth
  same_feedback: FeedbackJLFive

  coach_id: string
  date: string
  title: string
  content: string
  strength: string
  improvement: string
  commitment: string
  learnerIds: string[]
  type: string
  messageCreateJournal: string
  messageUpdatedJournal: string
  messageCreateFeedback: string



  detailId: string

  // End

  /* Misc */
  version = '1.0';

  api: Api

  // #region CONSTRUCTOR
  constructor(serviceStore: ServiceStore, mainStore: MainStore, api: Api) {

    this.mainStore = mainStore;
    this.serviceStore = serviceStore;
    this.isDetail = false
    this.formErrorCode = null
    this.api = api
    this.messageCreateJournal = ''
    this.messageUpdatedJournal = ''
    this.messageCreateFeedback = ''
    this.messageCreateFeedbackUser = ''


    this.messageRequestFeedback = ''
    this.messageCreateFeedbackCommitment = ''

    this.isFormCoach = false
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
        this.coachingFailed(result.response.errorCode)
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

  async getListFeedbackUserByCoachee(coacheeId: string, page = 1, limit = 10) {
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
        this.coachingFailed(result.response.errorCode)
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
    this.isLoading = false
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
    console.log(`getListRequestFeedbackUser page ${page}`)

    const result = await this.feedbackApi.getListRequestFeedbackUser(page, limit)
    console.log('getListRequestFeedbackUser result', result)
    if (result.kind === "ok") {
      this.getListRequestFeedbackUserSucceed(result.response.data)
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
  }

  getListRequestFeedbackUserSucceed(data: RequestFeedbackUserModel[]) {
    console.log('request getListRequestFeedbackUserSucceed ')
    this.listRequestFeedbackUser = data
    this.isLoadingListRequetsFeedbackUser = false
    this.formErrorCode = null
    this.isLoading = false
  }

  async createFeedbackUser(data: CreateFeedbackUserModel) {
    this.isLoading = true
    console.log('createFeedbackUser ', data)

    try {
      const result = await this.feedbackApi.createFeedbackUser(data)
      // console.log('requestFeedbackUser result', result)

      if (result.kind === "ok") {
        this.createFeedbackUserSucceed(result.response.message)
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

  createFeedbackUserSucceed(message: string) {
    console.log('createFeedbackUserSucceed ')
    this.messageCreateFeedbackUser = message
    this.formErrorCode = null
    this.isLoading = false
  }



  feedbackFailed(errorId: number) {
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
    this.isloading = false
    this.errorCode = null
    this.errorMessage = null
    this.formErrorCode = null
  }

  async clearFeedbackUserByCoachee() {
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

  async createJournal(
    data: JournalEntryType
  ) {
    console.log('createJournal ', data)
    console.log(this.date)

    this.isLoading = true

    const result = await this.feedbackApi.createJournal(
      this.mainStore.userProfile.user_id,
      data.date,
      data.title,
      data.content,
      data.strength,
      data.improvement,
      data.commitment,
      data.learnerIds,
      data.type,
      data.label,
      data.questions
    )
    if (result.kind === "ok") {
      this.refreshData = true
      await this.createJournalSucceed(result.response.message)
    } else if (result.kind === 'form-error') {
      this.coachingFailed(result.response.errorCode)
    } else {
      __DEV__ && console.tron.log(result.kind)
    }
  }

  resetLoading() {
    this.isLoading = false
  }

  setDetailID(id: string) {
    this.detailId = id
  }

  setFormCoach(data: boolean) {
    this.isFormCoach = data
  }

  setDetailCoaching(data: boolean) {
    this.isDetailCoach = data
  }

  saveFormJournal(
    coach_id: string,
    date: string,
    title: string,
    content: string,
    strength: string,
    improvement: string,
    commitment: string,
    learnerIds: string[],
    type: string
  ) {
    this.coach_id = coach_id
    this.date = date
    this.title = title
    this.content = content
    this.strength = strength
    this.improvement = improvement
    this.commitment = commitment
    this.learnerIds = learnerIds
    this.type = type
    console.log('coach_id', coach_id)
    console.log('date', date)
    console.log('title', title)
    console.log('content', content)
    console.log('strength', strength)
    console.log('improvement', improvement)
    console.log('commitment', commitment)
    console.log('learnerIds', learnerIds)
  }

  async createJournalSucceed(message: string) {
    this.coach_id = ''
    this.date = ''
    this.title = ''
    this.content = ''
    this.strength = ''
    this.improvement = ''
    this.commitment = ''
    this.learnerIds = []
    this.type = ''
    this.refreshData = true
    this.listJournal = []
    this.messageCreateJournal = message
    this.formErrorCode = null
    this.isLoading = false
  }

  resetJournalList() {
    this.listJournal = []
    this.formErrorCode = null
    this.isLoading = false
  }


  coachingFailed(errorId: number) {
    this.formErrorCode = errorId
    this.isLoading = false
  }

  async isDetailJournal(detailCoach: boolean) {
    this.isDetail = detailCoach
  }


  async getFeedbackDetail() {
    this.isLoading = true
    console.log('getFeedbackDetail')
    try {
      const result = await this.feedbackApi.getFeedbackDetail(this.detailId)

      if (result.kind === "ok") {
        this.feedbackDetailSucced(result.response)
      } else if (result.kind === 'form-error') {
        this.coachingFailed(result.response.errorCode)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.isLoading = false
    }
  }

  async getFeedbackDetailById(id: string, isCoachee: boolean) {
    this.isLoading = true
    console.log('getFeedbackDetail with id ' + id)
    const result = await this.feedbackApi.getFeedbackDetail(id)
    console.log('getFeedbackDetail with id')
    console.log(result)

    if (result.kind === "ok") {
      if (isCoachee) {
        this.feedbackDetailCoacheeSucceed(result.response)
      } else {
        this.feedbackDetailSucced(result.response)
      }
    } else if (result.kind === 'form-error') {
      this.coachingFailed(result.response.errorCode)
    } else {
      __DEV__ && console.tron.log(result.kind)
    }
  }

  feedbackDetailCoacheeSucceed(response: FeedbackDetail) {
    this.my_feedback = {
      q1: response.my_feedback.q1,
      q2: response.my_feedback.q2,
      q3: response.my_feedback.q3,
      q4: response.my_feedback.q4,
      q5: response.my_feedback.q5,
      q6: response.my_feedback.q6,
    }
    this.formErrorCode = null
    this.isLoading = false
  }

  feedbackDetailSucced(response: FeedbackDetail) {
    this.my_feedback = {
      q1: response.my_feedback.q1,
      q2: response.my_feedback.q2,
      q3: response.my_feedback.q3,
      q4: response.my_feedback.q4,
      q5: response.my_feedback.q5,
      q6: response.my_feedback.q6,
    }
    this.coachee_feedback = {
      q1: response.coachee_feedback.q1,
      q2: response.coachee_feedback.q2,
      q3: response.coachee_feedback.q3,
      q4: response.coachee_feedback.q4,
      q5: response.coachee_feedback.q5,
      q6: response.coachee_feedback.q6,
    }
    this.same_feedback = {
      q1: response.same_feedback.q1,
      q2: response.same_feedback.q2,
      q3: response.same_feedback.q3,
      q4: response.same_feedback.q4,
      q5: response.same_feedback.q5,
    }
    this.formErrorCode = null
    this.isLoading = false
  }

  feedbackDetailReset() {
    console.log('feedbackDetailReset')
    this.same_feedback = {
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0,
      q5: 0,
    }
    this.my_feedback = {
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0,
      q5: 0,
      q6: 0
    }
    this.coachee_feedback = {
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0,
      q5: 0,
      q6: 0
    }
    this.formErrorCode = null
    this.isLoading = false
  }

  resetCoachingStore() {
    this.coach_id = ''
    this.date = ''
    this.title = ''
    this.content = ''
    this.strength = ''
    this.improvement = ''
    this.commitment = ''
    this.learnerIds = []
    this.type = ''
    this.messageCreateJournal = ''
    this.messageUpdatedJournal = ''
    this.messageCreateFeedback = ''

    this.isDetail = false
    this.formErrorCode = null
    this.detailId = ''
  }

  async updateJournal(
    content: string,
    commitment: string,
    strength: string,
    type: string,
    improvement: string,
    label: string,

  ) {
    this.isLoading = true

    const result = await this.feedbackApi.updateJournalCoach(
      content,
      commitment,
      strength,
      improvement,
      type,
      this.detailId,
      label,
    )
    console.log('updateJournal result', result)
    if (result.kind === "ok") {
      this.updateJournalSucced(result.response.message)
    } else if (result.kind === 'form-error') {
      this.coachingFailed(result.response.errorCode)
    } else {
      __DEV__ && console.tron.log(result.kind)
    }
  }

  async updateJournalCoachee(
    content: string,
    lessonsLearned: string,
    commitment: string,
    journalId: string
  ) {
    this.isLoading = true
    console.log('updateJournal coachee')

    const result = await this.feedbackApi.updateJournalLearner(
      content,
      lessonsLearned,
      commitment,
      journalId
    )

    console.log('updateJournal result', result)
    if (result.kind === "ok") {
      this.updateJournalSucced(result.response.message)
    } else if (result.kind === 'form-error') {
      this.coachingFailed(result.response.errorCode)
    } else {
      __DEV__ && console.tron.log(result.kind)
    }
  }

  updateJournalSucced(message: string) {
    this.coach_id = ''
    this.date = ''
    this.title = ''
    this.content = ''
    this.strength = ''
    this.improvement = ''
    this.commitment = ''
    this.learnerIds = []
    this.type = ''
    this.messageUpdatedJournal = message
    this.formErrorCode = null
    this.isLoading = false
  }

  async createFeedback(
    q1: number,
    q2: number,
    q3: number,
    q4: number,
    q5: number,
    q6: number,
    journalId: string
  ) {
    this.isLoading = true
    console.log('updateJournal')

    const result = await this.feedbackApi.createFeedback(
      journalId,
      q1,
      q2,
      q3,
      q4,
      q5,
      q6
    )
    console.log('updateJournal result', result)
    if (result.kind === "ok") {
      this.createFeedbackSucced(result.response.message)
    } else if (result.kind === 'form-error') {
      this.coachingFailed(result.response.errorCode)
    } else {
      __DEV__ && console.tron.log(result.kind)
    }
  }

  createFeedbackSucced(message: string) {
    this.messageCreateFeedback = message
    this.formErrorCode = null
    this.isLoading = false
  }
  // #endregion
}

