/* eslint-disable max-lines */
// #region IMPORTS

// PACKAGES
import { makeAutoObservable } from 'mobx';
import MainStore from "./store.main";
import ServiceStore from "./store.service";
import { AuthApi } from "@services/api/auth/auth-api";
import { Api } from "@services/api";
import { CoachingApi } from '@services/api/coaching/coaching-api';
import { JournalEntryType } from "@screens/coaching-journal/new-journal-entry";

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
  journal_recommendation_for_coachee: string
  journal_content: string
  journal_improvement: string
  journal_strength: string
  journal_type: string
  journal_date: string
  journal_label: string
  journal_documents_url?: []

  jl_learner: LearnerJournalInJournalDetail[]

  jl_learner_fullname: []
  coach_fullname: string

  is_edited: boolean
  is_coachee: boolean
}

export type LearnerJournalInJournalDetail = {
  learner_fullname: string
  journal_content: string
  jl_lesson_learned: string
  jl_commitment: string
  jl_documents_url: string[]
}

export type LearnerJournalDetail = {
  journal: JournalInLearnerJournalModel
  jl_id: string
  jl_content: string
  jl_lesson_learned: string
  jl_commitment: string
  learner_fullname: string
  coach_fullname: string
  is_filled: boolean
  jl_documents_url: string[]
}

export type JournalLearnerModel = {
  jl_id: string
  jl_learner_id: string
  jl_fullname: string
  is_filled: boolean
}

export type JournalModel = {
  journal_id: string
  journal_title: string
  journal_created_at: string
  journal_date: string
  coach_id: string
  journal_type: string
  journal_label: string
  coach_fullname: string
  is_coachee: boolean
  journal_learner: JournalLearnerModel[]
}

export type JournalInLearnerJournalModel = {
  id: string
  title: string
  content: string
  date: string,
  documents_url: string[],
  recommendation_for_coachee: string
  improvement: string
  strength: string
  coach_fullname?: string
  label: string
  type: string
}

export default class CoachingStore {
  // #region PROPERTIES

  mainStore: MainStore
  serviceStore: ServiceStore
  coachingApi: CoachingApi
  isLoading: boolean


  isDetail: boolean
  isDetailCoach: boolean

  isFormCoach: boolean
  refreshData: boolean

  formErrorCode: number

  errorCode: number
  errorMessage: string

  listJournal: JournalModel[]
  journalDetail: JournalDetail
  learnerJournalDetail: LearnerJournalDetail

  my_feedback: FeedbackJLSixth
  coachee_feedback: FeedbackJLSixth
  same_feedback: FeedbackJLFive

  coach_id: string
  date: string
  title: string
  content: string
  strength: string
  improvement: string
  recommendationForCoachee: string
  learnerIds: string[]
  type: string
  label: string
  documentsUrl: string
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

    this.isFormCoach = false
    this.refreshData = false
    this.coachingApi = new CoachingApi(this.api)

    this.isLoading = false
    this.journalDetail = {
      journal_id: '',
      journal_title: '',
      journal_coach_id: '',
      journal_recommendation_for_coachee: '',
      journal_content: '',
      journal_improvement: '',
      journal_strength: '',
      journal_type: '',
      journal_date: '',
      jl_lesson_learned: {
        desc: ''
      },
      jl_commitment: {
        desc: ''
      },
      jl_content: {
        desc: ''
      },
      jl_learner_fullname: '',
      coach_fullname: ''
    }

    this.learnerJournalDetail = {
      jl_id: '',
      jl_content: '',
      jl_lesson_learned: '',
      jl_commitment: '',
      learner_fullname: '',
      coach_fullname: '',
      is_filled: false,
      jl_documents_url: [],
      journal: {
        id: '',
        title: '',
        content: '',
        date: '',
        recommendation_for_coachee: '',
        documents_url: []
      }
    }

    this.my_feedback = {
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0,
      q5: 0,
      q6: 0,
    }
    this.coachee_feedback = {
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0,
      q5: 0,
      q6: 0,
    }
    this.same_feedback = {
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0,
      q5: 0,
    }

    this.listJournal = []
    makeAutoObservable(this);
  }

  async getJournal(page = 1, limit = 3) {
    this.isLoading = true
    try {
      const result = await this.coachingApi.getJournalList(page, limit)
      if (result.kind === "ok") {
        // console.log('result.response.journal', result.response)
        await this.journalSucceed(result.response.journal)
      } else if (result.kind === 'form-error') {
        console.log('journal failed')
        console.log(result.response.errorCode)
        this.coachingFailed(result.response.errorCode)
      } else if (result.kind === 'unauthorized') {
        console.log('token expired journal')
        console.log(result)
        this.coachingFailed(result.response.errorCode)
      } else {
        // __DEV__ && console.tron.log(result.kind)
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.isLoading = false
    }
  }

  async clearJournal() {
    this.listJournal = []
    this.isLoading = false
    this.errorCode = null
    this.errorMessage = null
    this.formErrorCode = null
    // this.learnerJournalDetail = 
  }

  setRefreshData(data: boolean) {
    this.refreshData = data
  }

  async createJournal(
    data: JournalEntryType
  ) {
    console.log('createJournal ', data)
    // console.log(this.date)

    this.isLoading = true

    const result = await this.coachingApi.createJournal(
      this.mainStore.userProfile.user_id,
      data.date,
      data.title,
      data.content,
      data.strength,
      data.improvement,
      data.recommendationForCoachee,
      data.learnerIds,
      data.type,
      data.label,
      data.documentsUrl
    )
    if (result.kind === "ok") {
      this.refreshData = true
      await this.createJournalSucceed(result.response.message)
    } else if (result.kind === 'form-error') {
      this.coachingFailed(result.response.errorCode)
    } else {
      await this.createJournalSucceed('Failed')
      // __DEV__ && console.tron.log(result.kind)
    }
  }

  resetLoading() {
    this.isLoading = false
  }

  setDetailID(id: string) {
    this.detailId = id
  }

  setJournalType(type: string) {
    this.type = type
  }

  setJournalLabel(label: string) {
    this.label = label
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
    recommendationForCoachee: string,
    learnerIds: string[],
    type: string,
    documentsUrl: string
  ) {
    this.coach_id = coach_id
    this.date = date
    this.title = title
    this.content = content
    this.strength = strength
    this.improvement = improvement
    this.recommendationForCoachee = recommendationForCoachee
    this.learnerIds = learnerIds
    this.type = type
    this.documentsUrl = documentsUrl
    // console.log('coach_id', coach_id)
    // console.log('date', date)
    // console.log('title', title)
    // console.log('content', content)
    // console.log('strength', strength)
    // console.log('improvement', improvement)
    // console.log('recommendationForCoachee', recommendationForCoachee)
    // console.log('documentsUrl', documentsUrl)
    // console.log('learnerIds', learnerIds)
  }

  async createJournalSucceed(message: string) {
    this.coach_id = ''
    this.date = ''
    this.title = ''
    this.content = ''
    this.strength = ''
    this.improvement = ''
    this.recommendationForCoachee = ''
    this.learnerIds = []
    this.type = ''
    this.documentsUrl = ''
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

  async journalSucceed(journal: JournalModel[]) {
    console.log('journalSucceed', journal)
    this.listJournal = [
      ...this.listJournal,
      ...(journal ?? [])
    ]
    this.formErrorCode = null
    this.isLoading = false
  }

  coachingFailed(errorId: number) {
    this.formErrorCode = errorId
    this.isLoading = false
  }

  createJournalFailed() {

  }

  async isDetailJournal(detailCoach: boolean) {
    this.isDetail = detailCoach
  }

  async getJournalDetail() {
    this.isLoading = true
    try {
      console.log('getJournalDetail')
      const result = await this.coachingApi.getJournalDetail(this.detailId)
      // console.log('getJournalDetail result', result)
      if (result.kind === "ok") {
        this.journalDetailSucced(result.response)
      } else if (result.kind === 'form-error') {
        this.coachingFailed(result.response.errorCode)
      } else {
        // __DEV__ && console.tron.log(result.kind)
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.isLoading = false
    }
  }

  journalDetailSucced(response: JournalDetail) {
    this.journalDetail = response
    this.formErrorCode = null
  }

  async getJournalLearnerDetail(id: string) {
    this.isLoading = true
    try {
      const result = await this.coachingApi.getJournalLearnerDetail(id)
      if (result.kind === "ok") {
        this.learnerJournalDetailSucceed(result.response)
      } else if (result.kind === 'form-error') {
        this.coachingFailed(result.response.errorCode)
      } else {
        // __DEV__ && console.tron.log(result.kind)
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.isLoading = false
    }
  }

  learnerJournalDetailSucceed(response: LearnerJournalDetail) {
    this.learnerJournalDetail = response
    this.learnerJournalDetail.journal.coach_fullname = response.coach_fullname
    this.formErrorCode = null
  }

  async getFeedbackDetail() {
    this.isLoading = true
    console.log('getFeedbackDetail')
    try {
      const result = await this.coachingApi.getFeedbackDetail(this.detailId)

      if (result.kind === "ok") {
        this.feedbackDetailSucced(result.response)
      } else if (result.kind === 'form-error') {
        this.coachingFailed(result.response.errorCode)
      } else {
        // __DEV__ && console.tron.log(result.kind)
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.isLoading = false
    }
  }

  async getFeedbackDetailById(id: string, isCoachee: boolean) {
    this.isLoading = true
    // console.log('getFeedbackDetail with id ' + id)
    const result = await this.coachingApi.getFeedbackDetail(id)
    // console.log('getFeedbackDetail with id')
    // console.log(result)

    if (result.kind === "ok") {
      if (isCoachee) {
        this.feedbackDetailCoacheeSucceed(result.response)
      } else {
        this.feedbackDetailSucced(result.response)
      }
    } else if (result.kind === 'form-error') {
      this.coachingFailed(result.response.errorCode)
    } else {
      // __DEV__ && console.tron.log(result.kind)
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
    this.recommendationForCoachee = ''
    this.learnerIds = []
    this.type = ''
    this.documentsUrl = ''
    this.messageCreateJournal = ''
    this.messageUpdatedJournal = ''
    this.messageCreateFeedback = ''


    this.isDetail = false
    this.formErrorCode = null
    this.detailId = ''

    this.learnerJournalDetail = {
      jl_id: '',
      jl_content: '',
      jl_lesson_learned: '',
      jl_commitment: '',
      learner_fullname: '',
      coach_fullname: '',
      is_filled: false,
      jl_documents_url: [],
      journal: {
        id: '',
        title: '',
        content: '',
        date: '',
        recommendation_for_coachee: '',
        documents_url: []
      }
    }
  }

  async updateJournal(
    content: string,
    recommendationForCoachee: string,
    strength: string,
    type: string,
    improvement: string,
    label: string,
    documentsUrl: string
  ) {
    this.isLoading = true

    const result = await this.coachingApi.updateJournalCoach(
      content,
      recommendationForCoachee,
      strength,
      improvement,
      type,
      this.detailId,
      label,
      documentsUrl 
    )
    console.log('updateJournal result', result)
    if (result.kind === "ok") {
      this.updateJournalSucced(result.response.message)
    } else if (result.kind === 'form-error') {
      this.coachingFailed(result.response.errorCode)
    } else {
      await this.updateJournalSucced('Failed')
      // __DEV__ && console.tron.log(result.kind)
    }
  }

  async updateJournalCoachee(
    content: string,
    lessonsLearned: string,
    commitment: string,
    journalId: string,
    documentsUrl: []
  ) {
    this.isLoading = true
    console.log('updateJournal coachee')

    const result = await this.coachingApi.updateJournalLearner(
      content,
      lessonsLearned,
      commitment,
      journalId,
      documentsUrl
    )

    console.log('updateJournal result', result)
    if (result.kind === "ok") {
      this.updateJournalSucced(result.response.message)
    } else if (result.kind === 'form-error') {
      this.coachingFailed(result.response.errorCode)
    } else {
      await this.updateJournalSucced('Failed')
      // __DEV__ && console.tron.log(result.kind)
    }
  }

  updateJournalSucced(message: string) {
    this.coach_id = ''
    this.date = ''
    this.title = ''
    this.content = ''
    this.strength = ''
    this.improvement = ''
    this.recommendationForCoachee = ''
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

    const result = await this.coachingApi.createFeedback(
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
      // __DEV__ && console.tron.log(result.kind)
    }
  }

  createFeedbackSucced(message: string) {
    this.messageCreateFeedback = message
    this.formErrorCode = null
    this.isLoading = false
  }

  async uploadImage(formData: FormData) {
    console.log("Upload Photo")

    try {
      const result = await this.coachingApi.PostUploadFeedImages(formData)

      // console.log(result)

      if (result.kind === "form-error") {
        this.coachingFailed(result.response.errorCode)
      }

      if (result.kind === "ok") {
        return result.response;
      }
    } catch (e) {
      console.log("Upload Coaching Image error")
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("Upload Coaching Image done")
      this.isLoading = false
    }
  }

  formReset() {
    this.errorCode = null
    this.errorMessage = null
    this.refreshData = false
  }
  // #endregion
}

