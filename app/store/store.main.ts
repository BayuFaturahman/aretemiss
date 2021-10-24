/* eslint-disable max-lines */
// #region IMPORTS
// PACKAGES
import { makeAutoObservable } from "mobx"
import ServiceStore from "./store.service"
import { Api } from "@services/api"
import { ProfileApi } from "@services/api/profile/profile-api"
import { ErrorFormResponse } from "@services/api/auth/auth-api.types"
import { TeamResponse, UpdateProfileResponse } from "@services/api/profile/profile-api.types"
import { ProfileUpdateForm } from "@screens/auth/create-profile"

// CONFIGS

// CONSTANTS

export type UpdatingProfile = {
  userId: string
  fullName: string
  nickName: string
  phoneNumber?: string
  isAllowNotification?: number
  isAllowReminderNotification?: number
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
    this.serviceStore = serviceStore
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

  formError(data: ErrorFormResponse) {
    this.errorCode = data.errorCode
    this.errorMessage = data.message
  }

  formReset () {
    this.errorCode = null
    this.errorMessage = null
  }

  resetLoading(){
    this.isLoading = false
  }

  async getTeamList() {
    console.log("getTeamList")
    this.isLoading = true
    try {
      const response = await this.profileApi.getTeamList()

      console.log(response)

      if (response.kind === "form-error") {
        this.formError(response.response)
      }

      if (response.kind === "ok") {
        await this.getTeamSuccess(response.response)
      }
    } catch (e) {
      console.log("getTeamList error")
      console.log(e)
      this.getTeamFailed(e)
    } finally {
      console.log("get team done")
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

      console.log(response)

      if (response.kind === "form-error") {
        if (response.response.errorCode === 35) {
          response.response.message = 'Alamat email yang kamu ganti sudah dimiliki akun lain. Kamu yakin mau pakai alamat yang ini?'
        }
        this.formError(response.response)
      }

      if (response.kind === "ok") {
        await this.updateProfileSuccess(response.response)
      }
    } catch (e) {
      console.log("updateProfile error")
      console.log(e)
      this.updateProfileFailed(e)
    } finally {
      console.log("updateProfile done")
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
      team3Id: data.data.team3Id,
      isAllowNotification: this.userProfile.isAllowNotification,
      isAllowReminderNotification: this.userProfile.isAllowReminderNotification,
    }
    await this.serviceStore.setToken(data.data.token)
  }

  async setProfile() {
    console.log("setProfile")
    this.isLoading = true
    try {
      const response = await this.profileApi.getProfile()

      console.log(response)

      if (response.kind === "form-error") {
        this.formError(response.response)
      }
      if (response.kind === "ok") {
        this.userProfile = {
          userId: response.response[0]["user_id"],
          fullName: response.response[0]["user_fullname"],
          nickName: response.response[0]["user_nickname"],
          email: response.response[0]["user_email"],
          team1Id: response.response[0]["user_team_1_id"],
          team2Id: response.response[0]["user_team_2_id"],
          team3Id: response.response[0]["user_team_3_id"],
          phoneNumber: response.response[0]["user_phone_number"],
          isAllowNotification: response.response[0]["user_is_allow_notification"],
          isAllowReminderNotification: response.response[0]["user_is_allow_reminder_notification"],
        }
        console.log("USer profile ", this.userProfile)
      }
    } catch (e) {
      console.log("setProfile error")
      console.log(e)
      // this.updateProfileFailed(e)
    } finally {
      console.log("setProfile done")
      this.isLoading = false
    }
  }

  updateProfileFailed(e: any) {
    this.errorMessage = e
  }

  async getProfile(){
     this.isLoading = true
     try {
      const response = await this.profileApi.getProfile()

       if(response.kind === 'form-error'){
         this.formError(response.response)
       }

       if(response.kind === 'ok'){
         this.getProfileSuccess(response.response.data)
       }
     } catch (e) {
       console.log(e)
       this.updateProfileFailed(e)
     } finally {
       console.log('getProfile done')
       this.isLoading = false
    }
  }

  getProfileSuccess(data: ProfileModel) {
    console.log('getProfileSuccess data', data[0])
    this.userProfile =  {
      user_id: data.user_id,
      user_fullname: data.user_fullname,
      user_nickname: data.user_nickname,
      user_email: data.user_email,
      user_phone_number: data.user_phone_number,
      user_password: data.user_password,
      user_team_1_id: data.user_team_1_id,
      user_team_2_id: data.user_team_2_id,
      user_team_3_id: data.user_team_3_id,
      user_status: data.user_status,
      is_deleted: data.is_deleted,
      user_role: data.user_role,
      user_is_verify: data.user_is_verify,
      user_forgot_password_hash: data.user_forgot_password_hash,
      user_created_at: data.user_created_at,
      user_updated_at: data.user_updated_at,
      user_forgot_pass: data.user_forgot_pass,
      user_mood: data.user_mood,
      user_photo: data.user_photo,
      user_is_allow_notification: data.user_is_allow_notification,
      user_is_allow_reminder_notification: data.user_is_allow_reminder_notification,
      user_fcm_token: data.user_fcm_token,
      team1_id: data.team1_id,
      team1_name: data.team1_name,
      team2_id: data.team2_id,
      team2_name: data.team2_name,
      team3_id: data.team3_id,
      team3_name: data.team3_name,
    }
  }

  getProfileFailed(e: any) {
    this.errorMessage = e
  }

  async getListUser(id: string){
    this.isLoading = true
    try {
     const result = await this.profileApi.getTeamMember(id)
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
