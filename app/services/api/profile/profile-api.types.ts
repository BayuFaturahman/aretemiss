// import { Profile, ProfileMember } from "@models/profile/profile-model"
import { ListProfileModel, ProfileModel } from "app/store/store.main"
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

export interface GetProfileResponse {
  message: string
  data: ProfileModel[]
  token: string
}
export interface ResendOTPResponse {
  "otp_hash": string
  otp: number
}

export interface VerifyOTPResponse {
  isValid: boolean
}
export interface PostUploadFilesResponse {
  "message": string
  "token": string
  "data": {
    "urls": string
  }
}

export interface CheckEmailResponse {
  message: string
  token: string
  data: {
    email: string
    message: string
    is_allow_to_use: boolean
  }
}

export type TeamListResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: TeamResponse }  | GeneralApiProblem

export type UpdateProfileResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: UpdateProfileResponse }  | GeneralApiProblem

export type GetProfileResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: GetProfileResponse }  | GeneralApiProblem

export type GetTeamMemberResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: ListProfileModel[] }  | GeneralApiProblem

export type ResendOTPResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: ResendOTPResponse }  | GeneralApiProblem

export type VerifyOTPResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: VerifyOTPResponse }  | GeneralApiProblem

export type PostUpdateProfile = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: PostUploadFilesResponse }  | GeneralApiProblem

export type CheckEmailResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: CheckEmailResponse }  | GeneralApiProblem

