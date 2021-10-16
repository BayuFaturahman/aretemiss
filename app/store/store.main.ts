/* eslint-disable max-lines */
// #region IMPORTS
// PACKAGES
import {makeAutoObservable} from 'mobx';
import ServiceStore from "./store.service";
import {Api} from "@services/api";
import {ProfileApi} from "@services/api/profile/profile-api";
import {ErrorFormResponse} from "@services/api/auth/auth-api.types";
import {TeamResponse, UpdateProfileResponse} from "@services/api/profile/profile-api.types";
import {ProfileUpdateForm} from "@screens/auth/create-profile";

// CONFIGS

// CONSTANTS

export type UpdatingProfile = {
  userId: string
  fullName: string
  nickName: string
  phoneNumber?: string
  email: string
  team1Id: string
  team2Id: string
  team3Id: string
}

export type ProfileModel = {
  user_id: string
  user_fullname: string
  user_nickname: string
  user_email: string
  user_phone_number: string
  user_password: string
  user_team_1_id: string
  user_team_2_id: string
  user_team_3_id: string
  user_status: string
  is_deleted: number
  user_role: string
  user_is_verify: number
  user_forgot_password_hash: string
  user_created_at: string
  user_updated_at: string
  user_forgot_pass: number
  user_mood: string
  user_photo: string
  user_is_allow_notification: number
  user_is_allow_reminder_notification: number
  user_fcm_token: string
  team1_id: string
  team1_name: string
  team2_id: string
  team2_name: string
  team3_id: string
  team3_name: string
}


export type ListProfileModel = {
  id: string
  fullname: string
  nickname: string
  email: string
  phoneNumber: string
  password: string
  team1Id: string
  team2Id: string
  team3Id: string
  status: string
  isDeleted: string
  role: string
  isVerify: number
  forgotPasswordFlag: string
  mood: string
  photo: string
  isAllowNotification: number
  isAllowReminderNotification: number
  user_created_at: string
  user_updated_at: string
  user_id: string
}

export default class MainStore {
  // #region PROPERTIES

  serviceStore: ServiceStore
  api: Api
  isLoading: boolean
  
  errorCode: number
  errorMessage: string

  profileApi: ProfileApi
  teamResponse: TeamResponse

  updatingProfile: UpdatingProfile

  userProfile: ProfileModel
  listUserProfile: ListProfileModel[]

  // #region CONSTRUCTOR

  constructor(serviceStore: ServiceStore, api: Api) {
    this.serviceStore = serviceStore;
    this.api = api
    this.isLoading = false

    this.errorCode = null
    this.errorMessage = null

    this.profileApi = new ProfileApi(this.api)
    this.teamResponse = null

    this.updatingProfile = {
      userId: '',
      fullName: '',
      nickName: '',
      email:'',
      team1Id: '',
      team2Id: '',
      team3Id: ''
    }

    this.userProfile =  {
      user_id: '',
      user_fullname: '',
      user_nickname: '',
      user_email: '',
      user_phone_number: '',
      user_password: '',
      user_team_1_id: '',
      user_team_2_id: '',
      user_team_3_id: '',
      user_status: '',
      is_deleted: 0,
      user_role: '',
      user_is_verify: 0,
      user_forgot_password_hash: '',
      user_created_at: '',
      user_updated_at: '',
      user_forgot_pass: 0,
      user_mood: '',
      user_photo: '',
      user_is_allow_notification: 0,
      user_is_allow_reminder_notification: 0,
      user_fcm_token: '',
      team1_id: '',
      team1_name: '',
      team2_id: '',
      team2_name: '',
      team3_id: '',
      team3_name: '',
    }

    makeAutoObservable(this);
  }
  // #endregion

  // #region ACTIONS

  formError (data: ErrorFormResponse){
    this.errorCode = data.errorCode
    this.errorMessage = data.message
  }
  resetLoading(){
    this.isLoading = false
  }
  async getTeamList() {
    console.log('getTeamList')
    this.isLoading = true
    try {
      const response = await this.profileApi.getTeamList()

      console.log(response)

      if(response.kind === 'form-error'){
        this.formError(response.response)
      }

      if(response.kind === 'ok'){
        await this.getTeamSuccess(response.response)
      }

    } catch (e) {
      console.log('getTeamList error')
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

  async updateProfile(userId: string, data: ProfileUpdateForm) {
    this.isLoading = true
    try {
      const response = await this.profileApi.updateProfile(userId, data)

      if(response.kind === 'form-error'){
        this.formError(response.response)
      }

      if(response.kind === 'ok'){
        await this.updateProfileSuccess(response.response)
      }

    } catch (e) {
      console.log('updateProfile error')
      console.log(e)
      this.updateProfileFailed(e)
    } finally {
      console.log('updateProfile done')
      this.isLoading = false
    }
  }

  async updateProfileSuccess(data: UpdateProfileResponse) {
    this.updatingProfile = {
      userId: data.data.userId,
      fullName: data.data.fullname,
      nickName: data.data.nickname,
      email: data.data.email,
      team1Id: data.data.team1Id,
      team2Id: data.data.team2Id,
      team3Id: data.data.team3Id
    }

    await this.serviceStore.setToken(data.data.token)
  }

  updateProfileFailed(e: any) {
    this.errorMessage = e
  }

  async getProfile(){
     this.isLoading = true
     try {
      let response = await this.profileApi.getProfile()

       if(response.kind === 'form-error'){
         this.formError(response.response)
       }
 
       if(response.kind === 'ok'){
         await this.getProfileSuccess(response.response.data)
       }
 
     } catch (e) {
       console.log(e)
       this.updateProfileFailed(e)
     } finally {
       console.log('getProfile done')
       this.isLoading = false
    }
  }

  async getProfileSuccess(data: ProfileModel[]) {
    console.log('getProfileSuccess data', data[0])
    this.userProfile =  {
      user_id: data[0].user_id,
      user_fullname: data[0].user_fullname,
      user_nickname: data[0].user_nickname,
      user_email: data[0].user_email,
      user_phone_number: data[0].user_phone_number,
      user_password: data[0].user_password,
      user_team_1_id: data[0].user_team_1_id,
      user_team_2_id: data[0].user_team_2_id,
      user_team_3_id: data[0].user_team_3_id,
      user_status: data[0].user_status,
      is_deleted: data[0].is_deleted,
      user_role: data[0].user_role,
      user_is_verify: data[0].user_is_verify,
      user_forgot_password_hash: data[0].user_forgot_password_hash,
      user_created_at: data[0].user_created_at,
      user_updated_at: data[0].user_updated_at,
      user_forgot_pass: data[0].user_forgot_pass,
      user_mood: data[0].user_mood,
      user_photo: data[0].user_photo,
      user_is_allow_notification: data[0].user_is_allow_notification,
      user_is_allow_reminder_notification: data[0].user_is_allow_reminder_notification,
      user_fcm_token: data[0].user_fcm_token,
      team1_id: data[0].team1_id,
      team1_name: data[0].team1_name,
      team2_id: data[0].team2_id,
      team2_name: data[0].team2_name,
      team3_id: data[0].team3_id,
      team3_name: data[0].team3_name,
    }
  }

  getProfileFailed(e: any) {
    this.errorMessage = e
  }

  async getListUser(id: string){
    this.isLoading = true
    try {
     let result = await this.profileApi.getTeamMember(id)
     console.log('getListUser result', result)

      if(result.kind === 'form-error'){
        this.formError(result.response)
      }

      if(result.kind === 'ok'){
        await this.listUserTeamSucceed(result.response)
      }

    } catch (e) {
      console.log(e)
      this.getListProfileFailed(e)
    } finally {
      console.log('getListUser done')
      this.isLoading = false
   }
 }

 async listUserTeamSucceed (ListUser: ListProfileModel[]) {
    console.log('journalSucceed', ListUser)
    this.listUserProfile = ListUser
    this.errorMessage = null
    this.isLoading = false
  }

  getListProfileFailed(e: any) {
    this.errorMessage = e
  } 
  // #endregion
}

// #endregion
