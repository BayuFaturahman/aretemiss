
import { FeedbackDetail, JournalDetail, JournalModel } from "app/store/store.coaching"
import { GeneralApiProblem } from "../api-problem"
import { ExistingCoacheeModel, FeedbackUserDetailModel } from "app/store/store.feedback"


export interface ErrorFormResponse {
  errorCode: number
  message: string
}

export interface ExistingCoacheeListResponse {
  token: string
  message: string
  data: ExistingCoacheeModel[]
  meta: {
    total_pages: number
    total_items: number
  }
}

export interface ListFeedbackUserByCoacheeResponse {
  token: string
  message: string
  data: FeedbackUserDetailModel[]
  meta: {
    total_pages: number
    total_items: number
  }
}

export interface CreateJournalResponse {
  errorCode: number
  message: string
}

export interface UpdateJournalResponse {
  journal: JournalModel
}

export type ExistingCoacheeListResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: ExistingCoacheeListResponse } | GeneralApiProblem

export type ListFeedbackUserByCoacheeResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: ListFeedbackUserByCoacheeResponse } | GeneralApiProblem

export type CreateJournalResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: CreateJournalResponse } | GeneralApiProblem

export type JournalDetailResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: JournalDetail } | GeneralApiProblem

export type FeedbackDetailResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: FeedbackDetail } | GeneralApiProblem

export type UpdateJournalResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: UpdateJournalResponse } | GeneralApiProblem
