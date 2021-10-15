import { ApiResponse } from "apisauce"
import { Api } from "../api"
import { getGeneralApiProblem } from "../api-problem"
import {
  ForgotPasswordResult,
  LoginResult,
  LoginVerifyResult,
  SignupResult,
  SignupVerifyResult,
  ChangePasswordResult,
} from "@services/api/auth/auth-api.types"

export class AuthApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async login(email: string, password: string): Promise<LoginResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post("/signin", {
        email: email,
        password: password,
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

  async loginVerify(
    email: string,
    userId: string,
    otpCode: string,
    otpHash: string,
  ): Promise<LoginVerifyResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post("/signin/verify", {
        email: email,
        userId: userId,
        otpCode: otpCode,
        otpHash: otpHash,
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

  async signup(email: string, password: string): Promise<SignupResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(
        "/signup",
        { email: email, password: password }
      )

      if(response.status === 400){
        const res = response.data
        return { kind: "form-error", response: res }
      }

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

  async signupVerify(email: string, otpCode: string, otpHash: string): Promise<SignupVerifyResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(
        "/signup/verify",
        {
          email: email,
          otpCode: otpCode,
          otpHash: otpHash
        }
      )

      if(response.status === 400){
        const res = response.data
        return { kind: "form-error", response: res }
      }

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

  async forgotPassword(email: string): Promise<ForgotPasswordResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(
        "/forgot-password",
        {
          email: email,
        }
      )

      if(response.status === 400){
        const res = response.data
        return { kind: "form-error", response: res }
      }

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

  async changePassword(currentPassword: string, password: string): Promise<ChangePasswordResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.patch("/change-password", {
        oldPassword: currentPassword,
        password: password,
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
}
