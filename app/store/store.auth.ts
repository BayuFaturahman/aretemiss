/* eslint-disable max-lines */
// #region IMPORTS

// PACKAGES
import {makeAutoObservable} from 'mobx';
import MainStore from "./store.main";
import ServiceStore from "./store.service";
import {AuthApi} from "@services/api/auth/auth-api";
import {Api} from "@services/api";
import {LoginResponse} from "@services/api/auth/auth-api.types";

// #region MAIN CLASS

export default class AuthStore {
  // #region PROPERTIES

  mainStore: MainStore
  serviceStore: ServiceStore
  apiAuth: AuthApi
  isLoading: boolean

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

    makeAutoObservable(this);

    this.mainStore = mainStore;

    this.api = api

    this.apiAuth = new AuthApi(this.api)

    this.isLoading = false

  }

  async login(email: string, password: string) {
    console.log('login')
    this.isLoading = true
    try {
      const response = await this.apiAuth.login(email,password)

      if(response.kind === 'form-error'){
        console.log(response.response.errorCode)
        console.log(response.response.message)
      }

      if(response.kind === 'ok'){
        console.log(response.response.otp)
        console.log(response.response.userId)
        console.log(response.response.otpHash)
      }

    } catch (e) {
      console.log('login e catch')
      console.log(e)
    } finally {
      console.log('ssssfinaly')
      this.isLoading = false
    }

  }

  loginSuccess (data: LoginResponse){
    this.userId = data.userId
    this.otpHash = data.otpHash
    this.otp = data.otp
  }

  loginFailed (){

  }

  // #endregion
}
