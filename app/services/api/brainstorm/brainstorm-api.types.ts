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

export type CreateBrainstormGroupType = {
  initiator_id: string
  name: string
  member_ids: string[]
  icon: string
}

export type BrainstormGroupApiModel = {
  id: string
  initiatorId: string
  name: string
  icon: string
  bg_updated_at: string
  bg_created_at: string
}

export type BrainstormGroupMemberApiModel = {
  memberVotes: number
  id: string
  brainstormGroupId: string
  memberId: string
  bgm_created_at: string
  bgm_updated_at: string
}

export interface CreateBrainstormsGroupResponse {
  message: string
  token: string
  data: {
    brainstormGroup: BrainstormGroupApiModel
    brainstormGroupMember: BrainstormGroupMemberApiModel[]
  }
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

export type IdeaApiModel = {
  ip_id: string
  ip_brainstorm_group_id: string
  ip_title: string
  ip_description: string
  ip_color: string
  ip_shadow: string
  ip_is_selected: number
  ip_votes: number
}

export type IdeaPoolsByBrainstormGroupApiModel = {
  brainstormed: IdeaApiModel[]
  shortlisted: IdeaApiModel[]
  selected: IdeaApiModel[]
}

export type GetIdeaPoolsByBrainstormGroupResponse = {
  message: string
  token: string
  data: IdeaPoolsByBrainstormGroupApiModel
}

export type GetListBrainstormGroupsResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: GetListBrainstormGroupsResponse }  | GeneralApiProblem
export type CreateBrainstormsGroupResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: CreateBrainstormsGroupResponse } | GeneralApiProblem
export type GetIdeaPoolsByBrainstormGroupResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: GetIdeaPoolsByBrainstormGroupResponse } | GeneralApiProblem
