import { ApiResponse } from "apisauce"
import { Api } from "../api"
import { getGeneralApiProblem } from "../api-problem"
import { GetListLeaderboardResult } from "@services/api/leaderboard/leaderboard-api.types"

export class LeaderboardApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getLeaderboardPosition(id): Promise<any> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.get(`/leaderboard/${id}`)
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
      // __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getListLeaderboard(page: number, limit: number): Promise<GetListLeaderboardResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`/leaderboard`, {
        limit: limit,
        page: page
      })
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
      // __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

}
