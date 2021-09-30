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

export type LoginResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: LoginResponse }  | GeneralApiProblem
