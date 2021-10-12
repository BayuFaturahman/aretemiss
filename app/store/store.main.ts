/* eslint-disable max-lines */
// #region IMPORTS
// PACKAGES
import {makeAutoObservable} from 'mobx';
import ServiceStore from "./store.service";
import {Api} from "@services/api";
import {ProfileApi} from "@services/api/profile/profile-api";
import {ErrorFormResponse} from "@services/api/auth/auth-api.types";
import {TeamResponse} from "@services/api/profile/profile-api.types";

// CONFIGS

// CONSTANTS

export default class MainStore {
  // #region PROPERTIES

  serviceStore: ServiceStore
  api: Api
  isLoading: boolean

  errorCode: number
  errorMessage: string

  profileApi: ProfileApi
  teamResponse: TeamResponse

  // #region CONSTRUCTOR

  constructor(serviceStore: ServiceStore, api: Api) {
    this.serviceStore = serviceStore;
    this.api = api
    this.isLoading = false

    this.errorCode = null
    this.errorMessage = null

    this.profileApi = new ProfileApi(this.api)

    this.teamResponse = null

    makeAutoObservable(this);
  }
  // #endregion

  // #region ACTIONS

  formError (data: ErrorFormResponse){
    this.errorCode = data.errorCode
    this.errorMessage = data.message
  }

  async getTeamList() {
    console.log('getTeamList')
    this.isLoading = true
    try {
      const response = await this.profileApi.getTeamList()

      console.log(response)

      if(response.kind === 'form-error'){
        console.log(response.response.errorCode)
        console.log(response.response.message)

        this.formError(response.response)
      }

      if(response.kind === 'ok'){
        await this.getTeamSuccess(response.response)
      }

    } catch (e) {
      console.log('getTeamList')
      console.log(e)
      this.getTeamFailed(e)
    } finally {
      console.log('get team done')
      this.isLoading = false
    }
  }

  async getTeamSuccess(data: TeamResponse) {
    await this.serviceStore.setHeaderToken(data.token)
    this.teamResponse = data
  }

  getTeamFailed(e: any) {
    this.errorMessage = e
  }


  // #endregion
}

// #endregion
