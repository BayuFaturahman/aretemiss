
import { FeedbackDetail, JournalDetail, JournalModel } from "app/store/store.coaching"
import { GeneralApiProblem } from "../api-problem"


export interface ErrorFormResponse {
  errorCode: number
  message: string
}

export interface JournalResponse {
  token: string
  journal: JournalModel[]
  message: string

}
export interface CreateJournalResponse {
  errorCode: number
  message: string
}

export interface UpdateJournalResponse {
  journal: JournalModel
}

export type JournalListResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: JournalResponse }  | GeneralApiProblem

export type CreateJournalResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: CreateJournalResponse }  | GeneralApiProblem

export type JournalDetailResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: JournalDetail}  | GeneralApiProblem

export type FeedbackDetailResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: FeedbackDetail }  | GeneralApiProblem

export type UpdateJournalResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: UpdateJournalResponse }  | GeneralApiProblem
