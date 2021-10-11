import { JournalDetailUser } from "@models/coaching/journal-detail-model"
import { JournalUser } from "@models/coaching/journal-model"
import { Team } from "@models/profile/team-model"
import { GeneralApiProblem } from "../api-problem"


export interface ErrorFormResponse {
  errorCode: number
  message: string
}

export interface JournalResponse {
  token: string
  journal: JournalUser[]
}
export interface CreateJournalResponse {
  errorCode: number
  message: string
}

export type JournalListResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: JournalResponse }  | GeneralApiProblem

export type CreateJournalResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: CreateJournalResponse }  | GeneralApiProblem

export type JournalDetailResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: JournalDetailUser}  | GeneralApiProblem

export type FeedbackDetailResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: FeedbackDetail }  | GeneralApiProblem
