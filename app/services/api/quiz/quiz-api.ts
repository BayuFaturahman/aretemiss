import { ApiResponse } from "apisauce"
import { Api } from "../api"
import { getGeneralApiProblem } from "../api-problem"
import {
  GetListFeedsResult, QuizListResult,
} from "@services/api/quiz/quiz-api.types"
import {DEFAULT_API_CONFIG} from "@services/api/api-config";

export class QuizApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getQuizList(page: number, limit: number): Promise<QuizListResult> {
    console.log("getQuizList()")
    try {
      const response: ApiResponse<any> = await this.api.apisauce.get(`/quiz`, {
        limit: limit,
        page: page
      })

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data.data
      return { kind: "ok", response: res }
    } catch (e) {
      console.log(e)
      console.log("error")
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
