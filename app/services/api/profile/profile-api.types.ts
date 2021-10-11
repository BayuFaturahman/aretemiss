import { Profile, ProfileMember } from "@models/profile/profile-model"
import { Team } from "@models/profile/team-model"
import { GeneralApiProblem } from "../api-problem"


export interface ErrorFormResponse {
  errorCode: number
  message: string
}

export interface TeamResponse {
  token: string
  data: Team[]
  message: string
}
export interface UpdateProfileResponse {
  errorCode: number
  message: string
}

export type TeamListResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: TeamResponse }  | GeneralApiProblem

export type UpdateProfileResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: UpdateProfileResponse }  | GeneralApiProblem

export type GetProfileResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: Profile[] }  | GeneralApiProblem

export type GetTeamMemberResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: ProfileMember[] }  | GeneralApiProblem

