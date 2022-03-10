import { ApiResponse } from "apisauce"
import { Api } from "../api"
import { getGeneralApiProblem } from "../api-problem"
import { GetListBrainstormGroupsResult } from "@services/api/brainstorm/brainstorm-api.types"

export class BrainstormApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getListBrainstormGroups(): Promise<GetListBrainstormGroupsResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`/brainstorm-group`);
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

}
