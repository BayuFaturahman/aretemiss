import { GeneralApiProblem } from "../api-problem"

export type UserRanksModel = {
  "user_id": string
  "score": number
  "user_fullname": string
}

export interface ErrorFormResponse {
  errorCode: number
  message: string
}


export interface GetListLeaderboardResponse {
  message: string
  token: string
  data: UserRanksModel[],
  "new_notif": number  
}

export type GetListLeaderboardResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: GetListLeaderboardResponse }  | GeneralApiProblem
