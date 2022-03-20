import { GeneralApiProblem } from "../api-problem"

export interface ErrorFormResponse {
  errorCode: number
  message: string
}

export type BrainstormGroup = {
  id: string
  initiatorId: string
  name: string
  icon: string
  bg_created_at: string
  bg_updated_at: string
  bg_deleted_at: string
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

export type CreateIdeaType = {
  brainstormGroupId: string
  title: string
  description: string
}

export type IdeaPoolsApiModel = {
  votes: string
  isSelected: boolean
  id: string
  brainstormGroupId: string
  authorId: string
  title: string
  description: string
  color: string
  shadow: string
  ip_updated_at: string
  ip_created_at: string
}


export type IdeaPoolDetailsApiModel = {
  ip_id: string
  ip_title: string
  ip_description: string
  ip_color: string
  ip_votes: number
  ip_author_id: string
  ip_author_fullname: string
  ip_is_selected: number
  bg_initiator_id: string
  is_author: boolean
  is_initiator: boolean
}


export interface CreateBrainstormsGroupResponse {
  message: string
  token: string
  data: {
    brainstormGroup: BrainstormGroupApiModel
    brainstormGroupMember: BrainstormGroupMemberApiModel[]
  }
}

export interface GetListBrainstormGroupsResponse {
  message: string
  token: string
  data: {
    brainstorm_group: BrainstormGroup[]
  }
}

export type GetIdeaPoolsByBrainstormGroupResponse = {
  message: string
  token: string
  data: IdeaPoolsByBrainstormGroupApiModel
}

export type CreateIdeaResponse = {
  message: string
  token: string
  data: {
    ideaPool: IdeaPoolsApiModel[]
  }
}

export type GetIdeaDetailResponse = {
  message: string
  token: string
  data: IdeaPoolDetailsApiModel
}

export type UpdateIdeaType = {
  ideaPoolsId: string
  title: string
  description: string
}

export type UpdateIdeaApiModel = {
  ideaPoolsId: string
  title: string
  description: string
}

export type UpdateIdeaResponse = {
  message: string
  token: string
  data: UpdateIdeaApiModel
}



export type VoteIdeaType = {
  ideaPoolsId: string
}

export type VoteIdeaApiModel = {
  idea_pools_votes_id: string
}

export type VoteIdeaApiResponse = {
  message: string
  token: string
  data: VoteIdeaApiModel
}

export type SelectIdeaType = {
  ideaPoolsId: string
}

export type SelectIdeaApiResponse = {
  message: string
  token: string
  data: {
    
  }
}

export type GetListBrainstormGroupsResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: GetListBrainstormGroupsResponse }  | GeneralApiProblem
export type CreateBrainstormsGroupResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: CreateBrainstormsGroupResponse } | GeneralApiProblem
export type GetIdeaPoolsByBrainstormGroupResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: GetIdeaPoolsByBrainstormGroupResponse } | GeneralApiProblem
export type CreateIdeaResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: CreateIdeaResponse } | GeneralApiProblem
export type GetIdeaDetailResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: GetIdeaDetailResponse } | GeneralApiProblem
export type UpdateIdeaResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: UpdateIdeaResponse } | GeneralApiProblem
export type VoteIdeaResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: VoteIdeaApiResponse } | GeneralApiProblem
export type SelectIdeaResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: SelectIdeaApiResponse } | GeneralApiProblem
export type DeleteIdeaResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: SelectIdeaApiResponse } | GeneralApiProblem