import { ApiResponse } from "apisauce"
import { Api } from "../api"
import { getGeneralApiProblem } from "../api-problem"
import {
  CreateBrainstormsGroupResult,
  GetIdeaPoolsByBrainstormGroupResult,
  GetListBrainstormGroupsResult,
} from "@services/api/brainstorm/brainstorm-api.types"
import { CreateBrainstormGroupType } from "../brainstorms/brainstorms-api.types"

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
      const response: ApiResponse<any> = await this.api.apisauce.get(`/brainstorm-group/${groupId}/idea-pools`)

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
}
