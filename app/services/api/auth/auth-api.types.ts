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
}

export interface SignupResponse {
  email: string
  otpHash: string
  otp: number
}

export interface SignupVerifyResponse {
  userId: string
  email: string
  isVerify: boolean
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

export type ForgotPasswordResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: ForgotPasswordResponse }  | GeneralApiProblem
