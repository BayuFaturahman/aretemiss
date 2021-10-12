// import { Profile, ProfileMember } from "@models/profile/profile-model"
import { GeneralApiProblem } from "../api-problem"

export type Team = {
  id: string
  name: string
}

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
  message: string
  data: {
    "userId": string
    "fullname": string
    "nickname": string
    "email": string
    "team1Id": string
    "team2Id": string
    "team3Id": string
    "token": string
  }
}

export type TeamListResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: TeamResponse }  | GeneralApiProblem

export type UpdateProfileResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: UpdateProfileResponse }  | GeneralApiProblem

export type GetProfileResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: Profile[] }  | GeneralApiProblem

export type GetTeamMemberResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: ProfileMember[] }  | GeneralApiProblem

