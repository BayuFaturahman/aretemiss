import { ApiResponse } from "apisauce"
import { Api } from "../api"
import { getGeneralApiProblem } from "../api-problem"
import {LoginResult, LoginVerifyResult} from "@services/api/auth/auth-api.types";

export class AuthApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async login(email: string, password: string): Promise<LoginResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(
        "/signin",
        { email: email, password: password },
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

      const res = response.data.data

      return { kind: "ok", response: res }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data"}
    }
  }

  async loginVerify(phoneNumber: string, userId: string, otpCode: string, otpHash: string): Promise<LoginVerifyResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(
        "/signin/verify",
        {
          "phoneNumber": phoneNumber,
          "userId": userId,
          "otpCode": otpCode,
          "otpHash": otpHash
        },
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

      const res = response.data.data

      return { kind: "ok", response: res }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data"}
    }
  }

}
