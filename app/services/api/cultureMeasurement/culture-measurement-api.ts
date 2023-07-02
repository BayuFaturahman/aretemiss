import { ApiResponse } from "apisauce"
import { Api } from "../api"
import { getGeneralApiProblem } from "../api-problem"
import { CMCreateAnswerModel, CMUpdateAnswerModel, CreateAnswerResult, ErrorFormResponse, GetAllSectionResult, GetAnswerByIdResult, GetListPublishResult, UpdateAnswerResult } from "./culture-measurement-api.types";

export class CultureMeasurementApi {
  private api: Api
  isLoading: boolean;

  errorCode: number;
  errorMessage: string;
  refreshData: boolean;

  constructor(api: Api) {
    this.api = api
  }

  async getListPublish(): Promise<GetListPublishResult> {
    console.log('getListPublish')
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`/culture-measurement`)
      // console.log('response detail', response.data)
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

  async getAllSection(id: string): Promise<GetAllSectionResult> {
    console.log('getAllSection')
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`/culture-measurement/objective/${id}`)
      // console.log('response detail', response.data)
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

  async createAnswer(data: CMCreateAnswerModel): Promise<CreateAnswerResult> {
    console.log('createAnswer')
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(
        `/culture-measurement/`, data
      )
      // console.log('response detail', JSON.stringify(response.data))
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

  async getCMAnswerById(id: string): Promise<GetAnswerByIdResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`/culture-measurement/${id}`)
      // console.log('response detail', response.data)
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

  async updateAnswer(cmTakerId: string, data: CMUpdateAnswerModel): Promise<UpdateAnswerResult> {
    console.log('updateAnswer')
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.put(`/culture-measurement/${cmTakerId}`, data)

      // console.log('response detail', JSON.stringify(response.data))
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

  formReset() {
    this.errorCode = null
    this.errorMessage = null
    this.refreshData = false
  }

  formError(data: ErrorFormResponse) {
    this.errorCode = data.errorCode
    this.errorMessage = data.message
  }

  setErrorMessage(e: any) {
    this.errorMessage = e
  }

}
