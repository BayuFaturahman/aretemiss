import { GeneralApiProblem } from "../api-problem"

export interface LoginResponse {
  userId: string
  otpHash: string
  otp: number
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
  otpHash: string
  otp: number
}

export interface SignupVerifyResponse {
  userId: string
  email: string
  isVerify: number
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

export type LoginResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: LoginResponse }  | GeneralApiProblem

export type LoginVerifyResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: LoginVerifyResponse }  | GeneralApiProblem

export type SignupResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: SignupResponse } | GeneralApiProblem

export type SignupVerifyResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: SignupVerifyResponse } | GeneralApiProblem

export type ChangePasswordResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: ChangePasswordResponse }  | GeneralApiProblem

export type ForgotPasswordResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: ForgotPasswordResponse }  | GeneralApiProblem
