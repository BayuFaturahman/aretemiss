import { JournalUser } from "@models/coaching/journal-model";
import { ApiResponse } from "apisauce"
import { Api } from "../api"
import { getGeneralApiProblem } from "../api-problem"
import { CreateJournalResult, JournalDetailResult, JournalListResult, JournalResponse } from "./coaching-api.types";

export class CoachingApi {
  private api: Api

  constructor(api: Api) {
    console.log()
    this.api = api
  }

  async getJournalList(): Promise<JournalListResult> {
    try {
      console.log('request getJournalList')

      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(
        "/journal")
        console.log('response', response.data)

      if(response.status === 400){
        const res = response.data
        return { kind: "form-error", response: res }
      }
      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data.data
      return { kind: "ok", response: res }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data"}
    }
  }
  async getJournalDetail(id: string): Promise<JournalDetailResult> {
    console.log('request getJournal Detail', id)
    try {
          // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(
      `/journal/${id}`)
      console.log('response detail', response.data)
      if(response.status === 400){
        const res = response.data
        return { kind: "form-error", response: res }
      }
      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data.data
      return { kind: "ok", response: res }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data"}
    }
  }

  async getFeedbackDetail(id: string): Promise<JournalListResult> {
    try {
      console.log('request getFeedbackDetail Detail')

      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(
        `/journal/${id}/feedback`)
        console.log('response feedbackdetail', response.data)

      if(response.status === 400){
        const res = response.data
        return { kind: "form-error", response: res }
      }
      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data.data
      return { kind: "ok", response: res }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data"}
    }
  }
  async createJournal(
    coachId: string,
    date: string,
    title: string,
    content: string,
    strength: string,
    improvement: string,
    commitment: string,
    learnerIds: string[],
    type: string,
    q1:number,
    q2:number,
    q3:number,
    q4:number,
    q5:number,
    q6:number
  ): Promise<CreateJournalResult> {
    try {
      console.log('createJournal ap', coachId)
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(
        `/journal`,
        {
          coachId,
          date,
          title,
          content,
          strength,
          improvement,
          commitment,
          learnerIds,
          type,
          questions: {
            q1,
            q2,
            q3,
            q4,
            q5,
            q6
          }
        },
      )
      console.log('createJournal response', response)
      console.log(response)
      if(response.status === 400){
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
      return { kind: "bad-data"}
    }
  }


}
