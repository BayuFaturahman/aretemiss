import { ApiResponse } from "apisauce"
import { Api } from "../api"
import { getGeneralApiProblem } from "../api-problem"
import { CreateFeedbackCommitmentResult, ExistingCoacheeListResult, FeedbackCommitmentResult, FeedbackUserDetailListResult, ListFeedbackUserByCoacheeResult, RequestFeedbackUserResult } from "./feedback-api.types";
import { CreateCommitmentType } from "@screens/feedback/feedback.type";
import { CreateFeedbackUserModel } from "app/store/store.feedback";

export class FeedbackApi {
  private api: Api

  constructor(api: Api) {
    console.log()
    this.api = api
  }

  async getExistingCoacheeList(page: number, limit: number): Promise<ExistingCoacheeListResult> {
    try {
      console.log('request getExistingCoacheeList', page)

      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(
        "/existing-coachees", {
        limit: limit,
        page: page
      })
      // console.log('getExistingCoacheeList response', response.data)

      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }
      // the typical ways to die when calling an api
      if (!response.ok) {
        const res = response.data
        const problem = getGeneralApiProblem(response)
        if (problem) return { ...problem, response: res }
      }
      const res = response.data
      return { kind: "ok", response: res }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getListFeedbackUserByCoachee(coacheeId: string, page: number, limit: number): Promise<ListFeedbackUserByCoacheeResult> {
    try {
      console.log('request getListFeedbackUserByCoachee', page)

      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(
        "/feedback-user", {
        coachee_id: coacheeId,
        limit: limit,
        page: page
      })
      // console.log('getExistingCoacheeList response', response.data)

      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }
      // the typical ways to die when calling an api
      if (!response.ok) {
        const res = response.data
        const problem = getGeneralApiProblem(response)
        if (problem) return { ...problem, response: res }
      }
      const res = response.data
      return { kind: "ok", response: res }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getFeedbackUserDetail(feedbackUserId: string): Promise<FeedbackUserDetailListResult> {
    try {
      console.log('request getFeedbackUserDetail', feedbackUserId)

      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(
        `/feedback-user-detail/${feedbackUserId}`)
      console.log('getFeedbackUserDetail response', response.data)

      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }
      // the typical ways to die when calling an api
      if (!response.ok) {
        const res = response.data
        const problem = getGeneralApiProblem(response)
        if (problem) return { ...problem, response: res }
      }
      const res = response.data
      return { kind: "ok", response: res }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async requestFeedbackUser(coacheeId: string): Promise<RequestFeedbackUserResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(
        `/request-feedback`,
        {
          coachee_id: coacheeId
        }
      )
      console.log('requestFeedbackUser response', response.data)
      if (response.status === 400) {
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
      console.log(e, 'line 150');
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getFeedbackCommitment(id: string): Promise<FeedbackCommitmentResult> {
    try {
      console.log('request getFeedbackCommitment', id)

      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(
        `/feedback-commitment/${id}`)

      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }
      // the typical ways to die when calling an api
      if (!response.ok) {
        const res = response.data
        const problem = getGeneralApiProblem(response)
        if (problem) return { ...problem, response: res }
      }
      const res = response.data
      return { kind: "ok", response: res }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async createFeedbackCommitment(data: CreateCommitmentType): Promise<CreateFeedbackCommitmentResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(
        `/feedback-commitment`, data
      )
      console.log('createFeedbackCommitment response', response.data)
      if (response.status === 400) {
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
      console.log(e);
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getListRequestFeedbackUser(page: number, limit: number): Promise<FeedbackCommitmentResult> {
    try {
      console.log('request getListRequestFeedbackUser')

      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(
        `/request-feedback`, {
        limit: limit,
        page: page
      })

      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }
      // the typical ways to die when calling an api
      if (!response.ok) {
        const res = response.data
        const problem = getGeneralApiProblem(response)
        if (problem) return { ...problem, response: res }
      }
      const res = response.data
      return { kind: "ok", response: res }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async createFeedbackUser(data: CreateFeedbackUserModel): Promise<RequestFeedbackUserResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(
        `/feedback-user`, data
      )
      console.log('createFeedbackUser response', response.data)
      if (response.status === 400) {
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
      console.log(e, 'line 150');
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

}
