/* eslint-disable max-lines */
// #region IMPORTS

// PACKAGES
import {makeAutoObservable} from 'mobx';
import MainStore from "./store.main";
import ServiceStore from "./store.service";
import {AuthApi} from "@services/api/auth/auth-api";
import {Api} from "@services/api";
import {ErrorFormResponse, LoginResponse, LoginVerifyResponse} from "@services/api/auth/auth-api.types";

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
  needChangePassword: boolean
  token: string
  // End

  /* Misc */
  version = '1.0';

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
    this.needChangePassword = false
    this.token = null

    this.errorCode = null
    this.errorMessage = null

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
  }

  loginFailed (e: any){
    this.errorMessage = e
  }

  formError (data: ErrorFormResponse){
    this.errorCode = data.errorCode
    this.errorMessage = data.message
  }

  formReset () {
    this.errorCode = null
    this.errorMessage = null
  }

  async loginVerifySuccess (data: LoginVerifyResponse){
    this.needChangePassword = data.needChangePassword
    this.token = data.token

    await this.serviceStore.setToken(this.token)
  }

  async resetAuthStore (){
    this.formReset()
    this.token = null

    this.otp = null

    await this.serviceStore.clearTokens()
  }


  // #endregion
}

