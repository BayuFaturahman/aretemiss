/* eslint-disable max-lines */
// #region IMPORTS

// PACKAGES
import {makeAutoObservable} from 'mobx';
import MainStore from "./store.main";
import ServiceStore from "./store.service";
import {AuthApi} from "@services/api/auth/auth-api";
import {Api} from "@services/api";
import {ErrorFormResponse, LoginResponse} from "@services/api/auth/auth-api.types";

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
  // End

  /* Misc */
  version = '1.0';

  api: Api

  // #region CONSTRUCTOR
  constructor(serviceStore:ServiceStore, mainStore: MainStore, api: Api) {

    this.mainStore = mainStore;

    this.api = api

    this.apiAuth = new AuthApi(this.api)

    this.isLoading = false

    this.userId = null
    this.otpHash = null
    this.otp = null

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

        this.loginSuccess(response.response)
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

  loginSuccess (data: LoginResponse){
    this.userId = data.userId
    this.otpHash = data.otpHash
    this.otp = data.otp
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

  // #endregion
}

