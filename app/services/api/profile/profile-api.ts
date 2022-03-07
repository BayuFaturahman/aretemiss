import { ApiResponse } from "apisauce"
import { Api } from "../api"
import { getGeneralApiProblem } from "../api-problem"
import {
  GetProfileResult,
  GetTeamMemberResult,
  PostUpdateProfile,
  TeamListResult,
  UpdateProfileResult,
  ResendOTPResult,
  VerifyOTPResult,
  CheckEmailResult,
  RequestChangeDivisionResult
} from "./profile-api.types";
import {ProfileUpdateForm} from "@screens/auth/create-profile";

export class ProfileApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getTeamList(): Promise<TeamListResult> {
    console.log('get team list')

    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(
        "/team?search=&limit=300")
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

  async updateProfile(userId: string, formData: ProfileUpdateForm): Promise<UpdateProfileResult> {
    try {
      console.log('updateProfile', userId)
      console.log('updateProfile data', formData)
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.patch(
        `/user/${userId}`,
        formData,
      )

      console.log('updateProfile response', response.data)
      console.log('updateProfile response', response.status)

      if(response.status === 400 || response.status === 500 ) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data
      console.log('response res', res)

      return { kind: "ok", response: res }
    } catch (e) {
      console.log('error', e)
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data"}
    }
  }

  async getProfile(): Promise<GetProfileResult> {
    console.log('getProfile() GetProfileResult',)
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`/user/profile`)
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

      // console.log(res)
      console.log(response.status)

      return { kind: "ok", response: res }
    } catch (e) {
      console.log(e)
      console.log('error')
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data"}
    }
  }

  async getTeamMember(id: string, page: number, limit: number): Promise<GetTeamMemberResult> {
    try {
      console.log('getTeamMember())', id)

      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`/user`, {
        teamId: id,
        limit: limit,
        page: page
      })
      console.log('ApiResponse():', response.data.data[0])
      if(response.status === 400){
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      console.log('getTeamMember():', response.data.data)

      const res = response.data.data

      return { kind: "ok", response: res }
    } catch (e) {
      console.log('getTeamMember(): e', e)

      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data"}
    }
  }

  async resendOTP(oldEmail: string, email: string): Promise<ResendOTPResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post("/user/resend-otp", {
        action: "change-email",
        email: oldEmail,
        newEmail: email
      })

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

  async verifyOTP(otpCode: string, otpHash: string, email: string): Promise<VerifyOTPResult> {
    try {
      // make the api call
      const bodyRequest = {
        otp_code: otpCode,
        otp_hash: otpHash,
        email: email
      }
      const response: ApiResponse<any> = await this.api.apisauce.post(
        `/user/verify-otp`,
        bodyRequest,
      )

      console.log('verifyOTP response', response)

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
      console.log('response res', res)

      return { kind: "ok", response: res }
    } catch (e) {
      console.log('error', e)
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data"}
    }
  }
  
  async postUploadFiles(formData: FormData): Promise<PostUpdateProfile> {
    try {
      // console.log('postUploadFiles data', formData)
      console.log('postUploadFiles data api call')
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(
        `/upload`,
        formData,
      )

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
      console.log('response postUploadFiles', res)

      return { kind: "ok", response: res }
    } catch (e) {
      console.log('error', e)
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data"}
    }
  }

  async checkEmail(email: string): Promise<CheckEmailResult> {
    try {
      // make the api call
      const bodyRequest = {
        new_email: email
      }
      const response: ApiResponse<any> = await this.api.apisauce.post(
        `/user/check-email`,
        bodyRequest,
      )

      console.log('CheckEmail response', response)

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
      console.log('response res', res)

      return { kind: "ok", response: res }
    } catch (e) {
      console.log('error', e)
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data"}
    }
  }

  async requestChangeDivision(bodyRequest): Promise<RequestChangeDivisionResult> {
    try {
      // make the api call
    
      // console.log('body request: ', bodyRequest)
      const response: ApiResponse<any> = await this.api.apisauce.post(
        `/user/request-change-division`,
        bodyRequest,
      )

      // console.log('requestChangeDivision response', response)

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
      console.log('response res', res)

      return { kind: "ok", response: res }
    } catch (e) {
      console.log('error', e)
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data"}
    }
  }

  async requestChangePosition(bodyRequest): Promise<RequestChangeDivisionResult> {
    try {
      // make the api call
    
      // console.log('body request: ', bodyRequest)
      const response: ApiResponse<any> = await this.api.apisauce.post(
        `/user/request-change-position`,
        bodyRequest,
      )

      // console.log('requestChangePosition response', response)

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
      console.log('response res', res)

      return { kind: "ok", response: res }
    } catch (e) {
      console.log('error', e)
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data"}
    }
  }
}
