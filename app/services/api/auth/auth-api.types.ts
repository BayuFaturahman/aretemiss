import { GeneralApiProblem } from "../api-problem"

export interface LoginResponse {
  token: string
  needChangePassword: boolean
  isVerify: number
}

export interface ErrorFormResponse {
  errorCode: number
  message: string
}

export interface LoginVerifyResponse {
  token: string
  needChangePassword: boolean
  isVerify: number
}

export interface SignupResponse {
  email: string
  otp_hash: string
  otp: number
}

export interface SignupVerifyResponse {
  user_id: string
  email: string
  is_verify: number
  token: string
}
export interface ChangePasswordResponse {
  userId: string
  token: string
}

export interface ForgotPasswordResponse {
  message: string
  data:{
    email: string
    password: string
    passwordHash: string
  }
}
export interface ResendOTPResponse {
  "otp_hash": string
  otp: number
}

export type LoginResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: LoginResponse }  | GeneralApiProblem

export type LoginVerifyResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: LoginVerifyResponse }  | GeneralApiProblem

export type SignupResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: SignupResponse } | GeneralApiProblem

export type SignupVerifyResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: SignupVerifyResponse } | GeneralApiProblem

export type ChangePasswordResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: ChangePasswordResponse }  | GeneralApiProblem

export type ForgotPasswordResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: ForgotPasswordResponse }  | GeneralApiProblem

export type ResendOTPResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: ResendOTPResponse }  | GeneralApiProblem
