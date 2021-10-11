/* eslint-disable max-lines */
// #region IMPORTS

// PACKAGES
import {makeAutoObservable} from 'mobx';
import MainStore from "./store.main";
import ServiceStore from "./store.service";
import {AuthApi} from "@services/api/auth/auth-api";
import {Api} from "@services/api";
import {
  ErrorFormResponse, 
  LoginResponse, 
  LoginVerifyResponse, 
  SignupResponse, 
  SignupVerifyResponse
} from "@services/api/auth/auth-api.types";

// #region MAIN CLASS

export default class AuthStore {
  // #region PROPERTIES

  mainStore: MainStore
  serviceStore: ServiceStore
  apiAuth: AuthApi
  isLoading: boolean

  errorCode: number
  errorMessage: string

  // User Properties
  userId: string
  otpHash: string
  otp: number

  email: string
  emailVerify: string
  needChangePassword: boolean
  token: string
  isVerify: boolean
  // End

  /* Misc */
  version = '1.0';
  isLoginFlow: boolean

  api: Api

  // #region CONSTRUCTOR
  constructor(serviceStore:ServiceStore, mainStore: MainStore, api: Api) {

    this.mainStore = mainStore;
    this.serviceStore = serviceStore;

    this.api = api

    this.apiAuth = new AuthApi(this.api)

    this.isLoading = false

    this.userId = null
    this.otpHash = null
    this.otp = null

    this.email = null
    this.emailVerify = null
    this.needChangePassword = false
    this.token = null
    this.isVerify = false

    this.errorCode = null
    this.errorMessage = null

    this.isLoginFlow = false

    makeAutoObservable(this);

  }

  async login(email: string, password: string) {
    console.log('login')
    this.isLoading = true
    try {
      const response = await this.apiAuth.login(email,password)

      if(response.kind === 'form-error'){
        console.log(response.response.errorCode)
        console.log(response.response.message)

        this.formError(response.response)
      }

      if(response.kind === 'ok'){
        console.log(response.response.otp)
        console.log(response.response.userId)
        console.log(response.response.otpHash)

        this.loginSuccess(response.response, email)
      }

    } catch (e) {
      console.log('login error catch')
      console.log(e)
      this.loginFailed(e)
      this.isLoading = false
    } finally {
      console.log('login done')
      this.isLoading = false
    }
  }

  async loginVerify(otpCode: string) {
    console.log('login verify')
    this.isLoading = true
    try {
      const response = await this.apiAuth.loginVerify(this.email, this.userId, otpCode, this.otpHash)

      console.log(response)

      if(response.kind === 'form-error'){
        console.log(response.response.errorCode)
        console.log(response.response.message)

        this.formError(response.response)
      }

      if(response.kind === 'ok'){
        this.loginVerifySuccess(response.response)
      }

    } catch (e) {
      console.log('login verify error catch')
      console.log(e)
      this.loginFailed(e)
      this.isLoading = false
    } finally {
      console.log('login done')
      this.isLoading = false
    }
  }

  loginSuccess (data: LoginResponse, email: string){
    this.userId = data.userId
    this.otpHash = data.otpHash
    this.otp = data.otp
    this.email = email
    this.isLoginFlow = true
  }

  loginFailed (e: any){
    this.errorMessage = e
  }

  async loginVerifySuccess (data: LoginVerifyResponse){
    this.needChangePassword = data.needChangePassword
    this.token = data.token

    await this.serviceStore.setToken(this.token)
  }

  async signup(email: string, password: string) {
    console.log('signup')
    this.isLoading = true
    try {
      const response = await this.apiAuth.signup(email, password)

      if(response.kind === 'form-error'){
        console.log(response.response.errorCode)
        console.log(response.response.message)

        this.formError(response.response)
      }

      if(response.kind === 'ok'){
        console.log(response.response.email)
        console.log(response.response.otp)
        console.log(response.response.otpHash)

        this.signupSuccess(response.response)
      }

    } catch (e) {
      console.log('signup error catch')
      console.log(e)
      this.signupFailed(e)
      this.isLoading = false
    } finally {
      console.log('signup done')
      this.isLoading = false
    }
  }

  signupSuccess (data: SignupResponse) {
    this.email = data.email
    this.otpHash = data.otpHash
    this.otp = data.otp
  }

  signupFailed (e: any) {
    this.errorMessage = e
  }

  async signupVerify(otpCode: string) {
    console.log('login verify')
    this.isLoading = true
    try {
      const response = await this.apiAuth.signupVerify(this.email, otpCode, this.otpHash)

      console.log(response)

      if(response.kind === 'form-error'){
        console.log(response.response.errorCode)
        console.log(response.response.message)

        this.formError(response.response)
      }

      if(response.kind === 'ok'){
        this.signupVerifySuccess(response.response)
      }

    } catch (e) {
      console.log('signup verify error catch')
      console.log(e)
      this.signupFailed(e)
      this.isLoading = false
    } finally {
      console.log('signup done')
      this.isLoading = false
    }
  }

  signupVerifySuccess (data: SignupVerifyResponse) {
    this.userId = data.userId
    this.token = data.token
    this.isVerify = data.isVerify
    this.email = data.email
  }

  formError (data: ErrorFormResponse){
    this.errorCode = data.errorCode
    this.errorMessage = data.message
  }

  formReset () {
    this.errorCode = null
    this.errorMessage = null
  }

  async resetAuthStore (){
    this.formReset()
    this.token = null

    this.otp = null

    await this.serviceStore.clearTokens()
  }


  // #endregion
}

