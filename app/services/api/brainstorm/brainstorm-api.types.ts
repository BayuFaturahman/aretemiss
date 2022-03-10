import { GeneralApiProblem } from "../api-problem"

export type BrainstormGroup = {
  "id": string,
  "initiatorId": string,
  "name": string,
  "icon": string,
  "bg_created_at": string,
  "bg_updated_at": string,
  "bg_deleted_at": string,
}

export interface ErrorFormResponse {
  errorCode: number
  message: string
}


export interface GetListBrainstormGroupsResponse {
  message: string
  token: string
  data: BrainstormGroup[] 
}

export type GetListBrainstormGroupsResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: GetListBrainstormGroupsResponse }  | GeneralApiProblem
