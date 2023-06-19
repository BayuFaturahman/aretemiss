import { JournalUser } from "@models/coaching/journal-model";
import { ApiResponse } from "apisauce"
import { FeedbackDetail, FeedbackJLSixth } from "app/store/store.coaching";
import { Api } from "../api"
import { getGeneralApiProblem } from "../api-problem"
import { CreateJournalResult, ExistingCoacheeListResult, FeedbackCommitmentResult, FeedbackDetailResult, FeedbackUserDetailListResult, JournalDetailResult, JournalListResult, ListFeedbackUserByCoacheeResult, RequestFeedbackUserResult } from "./feedback-api.types";

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

  async getJournalList(page: number, limit: number): Promise<JournalListResult> {
    try {
      console.log('request getJournalList', page)

      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(
        "/journal", {
        limit: limit,
        page: page
      })
      console.log('getJournalList response', response.data)

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
      const res = response.data.data
      console.log('getJournalList res', res)

      return { kind: "ok", response: res }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getJournalDetail(id: string): Promise<JournalDetailResult> {
    console.log('request getJournal Detail', id)
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(
        `/journal/${id}`)
      console.log('response detail', response.data)
      if (response.status === 400) {
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
      return { kind: "bad-data" }
    }
  }

  async getFeedbackDetail(id: string): Promise<FeedbackDetailResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(
        `/journal/${id}/feedback`)
      if (response.status === 400) {
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
    label: string,
    feedback: FeedbackJLSixth
  ): Promise<CreateJournalResult> {
    try {
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
          label,
          questions: {
            q1: feedback.q1,
            q2: feedback.q2,
            q3: feedback.q3,
            q4: feedback.q4,
            q5: feedback.q5,
            q6: feedback.q6
          }
        },
      )
      console.log('createJournal response', response.data)
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

  async updateJournalLearner(
    content: string,
    commitment: string,
    lessonsLearned: string,
    journalId: string
  ): Promise<CreateJournalResult> {
    try {
      console.log('updateJournalLearner ', journalId)
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.patch(
        `/journal/${journalId}`,
        {
          content,
          lessonsLearned,
          commitment,
        },
      )
      console.log('updateJournalLearner response', response)
      console.log(response)
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
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async updateJournalCoach(
    content: string,
    commitment: string,
    strength: string,
    improvement: string,
    type: string,
    id: string,
    label: string,
  ): Promise<CreateJournalResult> {
    try {
      console.log('updateJournalCoach ap', id)
      // make the api call
      const bodyRequest = {
        content,
        commitment,
        strength,
        improvement,
        type,
        label,
      }
      console.log("REQUEST ", bodyRequest)
      const response: ApiResponse<any> = await this.api.apisauce.patch(
        `/journal/${id}`,
        bodyRequest,
      )
      console.log('updateJournalCoach response', response)
      console.log(response)
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
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async createFeedback(
    journalId: string,
    q1: number,
    q2: number,
    q3: number,
    q4: number,
    q5: number,
    q6: number
  ): Promise<CreateJournalResult> {
    try {
      console.log('createFeedback ap', journalId)
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(
        `/feedback`,
        {
          journalId,
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
      console.log('createFeedback response', response)
      console.log(response)
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
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }


}
