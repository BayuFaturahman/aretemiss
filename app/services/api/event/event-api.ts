import { ApiResponse } from "apisauce"
import { Api } from "../api"
import { getGeneralApiProblem } from "../api-problem"
import {DEFAULT_API_CONFIG} from "@services/api/api-config";
import { GetListCategoryEventTypes, PostCreateEventyTypes } from "./event-api.types"
import { createEventForm } from "@screens/event/create-event"

export class EventApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getListEventCategory(type:string): Promise<GetListCategoryEventTypes> {
    console.log(`getList by ${type}`)
    try {
      const response: ApiResponse<any> = await this.api.apisauce.get(`/${type}`, {baseURL: `${DEFAULT_API_CONFIG.url.slice(0, -3)}v1/`})
      console.log(response)
      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      console.log(res)
      console.log(response.status)

      return { kind: "ok", response: res }
    } catch (e) {
      console.log(e)
      console.log("error")
      // __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async postCreateEvent(data:createEventForm): Promise<PostCreateEventyTypes> {
    console.log(`postCreateEvent`)
    try {
      const response: ApiResponse<any> = await this.api.apisauce.post(
        `/event`,
        data
        // {baseURL: `${DEFAULT_API_CONFIG.url.slice(0, -3)}v1/`
      )
      console.log(response)
      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      console.log(res)
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
