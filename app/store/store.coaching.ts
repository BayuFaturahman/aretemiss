/* eslint-disable max-lines */
// #region IMPORTS

// PACKAGES
import {makeAutoObservable} from 'mobx';
import MainStore from "./store.main";
import ServiceStore from "./store.service";
import {AuthApi} from "@services/api/auth/auth-api";
import {Api} from "@services/api";
import { CoachingApi } from '@services/api/coaching/coaching-api';

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
  jl_lesson_learned: JLDetail
  jl_commitment: JLDetail
  jl_content: JLDetail
  jl_learner_fullname: string
}

export type JournalModel = {
  journal_id : string
  journal_title : string
  journal_created_at : string
  jl_id: string
  coach_id: string
  journal_type: string
  coach_fullname: string
  learner_id: string
  learner_fullname: string
}

export default class CoachingStore {
  // #region PROPERTIES

  mainStore: MainStore
  serviceStore: ServiceStore
  coachingApi: CoachingApi
  isLoading: boolean
  isDetailCoach: boolean
  formErrorCode: number

  errorCode: number
  errorMessage: string

  listJournal : JournalModel[]
  journalDetail: JournalDetail
  feedbackDetail: FeedbackDetail
  coach_id: string
  date: string
  title: string
  content: string
  strength: string
  improvement:string
  commitment: string
  learnerIds: string[]
  type: string
  message: string
  // End

  /* Misc */
  version = '1.0';

  api: Api

  // #region CONSTRUCTOR
  constructor(serviceStore:ServiceStore, mainStore: MainStore, api: Api) {

    this.mainStore = mainStore;
    this.serviceStore = serviceStore;
    this.isDetailCoach = false
    this.formErrorCode = null
    this.api = api
    this.message = ''

    this.coachingApi = new CoachingApi(this.api)

    this.isLoading = false
    this.journalDetail ={
      journal_id: '',
      journal_title: '',
      journal_coach_id: '',
      journal_commitment: '',
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
    }
    this.feedbackDetail = {
      my_feedback: {
        q1: 0,
        q2: 0,
        q3: 0,
        q4: 0,
        q5: 0,
        q6: 0,
      },
      coachee_feedback: {
        q1: 0,
        q2: 0,
        q3: 0,
        q4: 0,
        q5: 0,
        q6: 0,
      },
      same_feedback: {
        q1: 0,
        q2: 0,
        q3: 0,
        q4: 0,
        q5: 0,
      }
    }

    makeAutoObservable(this);
  }

  async getJournal(){
    this.isLoading = true
    const result = await this.coachingApi.getJournalList()
    if (result.kind === "ok") {
      this.journalSucceed(result.response.journal)
    } else if (result.kind === 'form-error'){
      this.coachingFailed(result.response.errorCode)
    } else {
      __DEV__ && console.tron.log(result.kind)
    }
  }
  async createJournal(
    q1:number,
    q2:number,
    q3:number,
    q4:number,
    q5:number,
    q6:number
  ){
    this.isLoading = true

    const result = await this.coachingApi.createJournal(
      this.coach_id,
      this.date,
      this.title,
      this.content,
      this.strength,
      this.improvement,
      this.commitment,
      this.learnerIds,
      this.type,
      q1,
      q2,
      q3,
      q4,
      q5,
      q6
    )
    console.log('createJournal result', )
    console.log(result)
    if (result.kind === "ok") {
      this.createJournalSucceed(result.response.message)
    } else if (result.kind === 'form-error'){
      this.coachingFailed(result.response.errorCode)
    } else {
      __DEV__ && console.tron.log(result.kind)
    }
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
    ){
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
  async createJournalSucceed (message: string)  {
    this.coach_id = ''
    this.date = ''
    this.title = ''
    this.content = ''
    this.strength = ''
    this.improvement = ''
    this.commitment = ''
    this.learnerIds = []
    this.type = ''
    this.message = message
    this.formErrorCode = null
    this.isLoading = false
  }
  async journalSucceed (journal: JournalModel[]) {
    this.listJournal = journal
    this.formErrorCode = null
    this.isLoading = false
  }

  async coachingFailed (errorId: number) {
    this.formErrorCode = errorId
    this.isLoading = false
  }
  async detailCoach (detailCoach: boolean) {
    this.isDetailCoach = detailCoach
  }

  async getJournalDetail() {
    this.isLoading = true
    console.log('getJournalDetail')
    const result = await this.coachingApi.getJournalDetail("102d3573-c33e-4bd4-9fd7-82a6640fd4ac")
    console.log('getJournalDetail result', result)
    if (result.kind === "ok") {
      this.journalDetailSucced(result.response)
    } else if (result.kind === 'form-error'){
      this.coachingFailed(result.response.errorCode)
    } else {
      __DEV__ && console.tron.log(result.kind)
    }
  }
  journalDetailSucced (response: JournalDetail) {
    this.journalDetail = response
    this.formErrorCode = null
    this.isLoading = false
  }
  
  async getFeedbackDetail(){
    this.isLoading = true
    console.log('getFeedbackDetail')
    const result = await this.coachingApi.getFeedbackDetail("102d3573-c33e-4bd4-9fd7-82a6640fd4ac")
    console.log('getFeedbackDetail result', result)
    if (result.kind === "ok") {
      this.feedbackDetailSucced(result.response)
    } else if (result.kind === 'form-error'){
      this.coachingFailed(result.response.errorCode)
    } else {
      __DEV__ && console.tron.log(result.kind)
    }
  }

  feedbackDetailSucced(response: FeedbackDetail) {
    console.log('feedbackDetailSucced', response)
    this.feedbackDetail.same_feedback = response.same_feedback
    this.feedbackDetail.my_feedback = response.my_feedback
    this.feedbackDetail.same_feedback = response.same_feedback

    this.formErrorCode = null
    this.isLoading = false
  }

  feedbackDetailReset() {
    console.log('feedbackDetailReset')
    this.feedbackDetail.same_feedback = {        
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0,
      q5: 0,
    }
    this.feedbackDetail.my_feedback = {
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0,
      q5: 0,
      q6: 0
    }
    this.feedbackDetail.coachee_feedback = {
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
  // #endregion
}

