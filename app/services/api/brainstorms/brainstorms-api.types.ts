import { GeneralApiProblem } from "../api-problem"

export interface ErrorFormResponse {
  errorCode: number
  message: string
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

export type CreateBrainstormsGroupResult =
  | { kind: "form-error"; response: ErrorFormResponse }
  | { kind: "ok"; response: CreateBrainstormsGroupResponse }
  | GeneralApiProblem
