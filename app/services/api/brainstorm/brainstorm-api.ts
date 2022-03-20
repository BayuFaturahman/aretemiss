import { ApiResponse } from "apisauce"
import { Api } from "../api"
import { getGeneralApiProblem } from "../api-problem"
import {
  CreateBrainstormsGroupResult,
  CreateIdeaType,
  DeleteIdeaResult,
  GetIdeaDetailResult,
  GetIdeaPoolsByBrainstormGroupResult,
  GetListBrainstormGroupsResult,
  GetListCpResult,
  SelectIdeaApiResponse,
  SelectIdeaType,
  UpdateIdeaResult,
  UpdateIdeaType,
  VoteIdeaResult,
  VoteIdeaType,
} from "@services/api/brainstorm/brainstorm-api.types"
import { CreateBrainstormGroupType } from "../brainstorm/brainstorm-api.types"

export class BrainstormApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getListBrainstormGroups(): Promise<GetListBrainstormGroupsResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`/brainstorm-group`)
      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      } else if (response.status === 404) {
        return { kind: "not-found" }
      }

      // console.log(response.data)

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      // console.log(res)
      console.log(response.status)

      return { kind: "ok", response: res }
    } catch (e) {
      console.log(e)
      console.log("error")
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async createBrainstormsGroup(
    data: CreateBrainstormGroupType,
  ): Promise<CreateBrainstormsGroupResult> {
    try {
      // make the api call
      console.log("body req ", data)
      const response: ApiResponse<any> = await this.api.apisauce.post(`/brainstorm-group`, data)

      // console.log('createPost response', response)
      // console.log("createBrainstormsGroup response.data", response.data)
      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      if (response.status === 500) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      return { kind: "ok", response: res }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getIdeaPoolsByBrainstormGroup(groupId: string): Promise<GetIdeaPoolsByBrainstormGroupResult> {
    console.log("getListFeeds()")
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`/brainstorm-group/${groupId}/idea-pools`,)

      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // console.log(response.data)

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      // console.log(res)
      console.log(response.status)

      return { kind: "ok", response: res }
    } catch (e) {
      console.log(e)
      console.log("error")
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async createIdea(data: CreateIdeaType): Promise<CreateBrainstormsGroupResult> {
    try {
      // make the api call
      console.log("body req ", data)
      const response: ApiResponse<any> = await this.api.apisauce.post(`/idea-pools`, data)

      // console.log('createPost response', response)
      // console.log("createBrainstormsGroup response.data", response.data)
      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      if (response.status === 500) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      return { kind: "ok", response: res }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getIdea(id: string): Promise<GetIdeaDetailResult> {
    try {
      // make the api call
      console.log("body req ", `/idea-pools/${id}`)
      const response: ApiResponse<any> = await this.api.apisauce.get(`/idea-pools/${id}`)

      console.log("getIdea response", response)

      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      if (response.status === 500) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      return { kind: "ok", response: res }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async updateIdea(data: UpdateIdeaType): Promise<UpdateIdeaResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.patch(`/idea-pools`, data)

      console.log("updateIdea response", response)

      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      if (response.status === 500) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      return { kind: "ok", response: res }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async deleteIdea(id: string): Promise<DeleteIdeaResult> {
    try {
      // make the api call
      console.log("body req ", id)
      console.log(`/idea-pools/${id}`)
      const response: ApiResponse<any> = await this.api.apisauce.delete(`/idea-pools/${id}`)

      // console.log('createPost response', response)
      // console.log("createBrainstormsGroup response.data", response.data)
      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      if (response.status === 500) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      return { kind: "ok", response: res }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }


  async voteIdea(data: VoteIdeaType): Promise<VoteIdeaResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(`/vote-idea-pools`, data)

      console.log("voteIdea response", response)

      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      if (response.status === 500) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      return { kind: "ok", response: res }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async selectIdea(data: SelectIdeaType): Promise<SelectIdeaApiResponse> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(`/select-idea-pools`, data)

      console.log("selectIdea response", response)

      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      if (response.status === 500) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      return { kind: "ok", response: res }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getListCP(page: number, limit: number): Promise<GetListCpResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`/user/counter-part?search&`,  {
        limit: limit,
        page: page
      })

      console.log("getListCP response", response)

      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      if (response.status === 500) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      return { kind: "ok", response: res }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
