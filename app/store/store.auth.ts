/* eslint-disable max-lines */
// #region IMPORTS

// PACKAGES
import {makeAutoObservable} from 'mobx';
import MainStore from "./store.main";
import ServiceStore from "./store.service";
import {AuthApi} from "@services/api/auth/auth-api";
import {Api} from "@services/api";
import {
  ErrorFormResponse, ForgotPasswordResponse,
  LoginResponse,
  LoginVerifyResponse,
  ResendOTPResponse,
  SignupResponse,
  SignupVerifyResponse
} from "@services/api/auth/auth-api.types";

// #region MAIN CLASS

export default class AuthStore {
  // #region PROPERTIES

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
  needUpdateProfile: boolean
  token: string
  isVerify: boolean
  isLoginFlow: boolean

  isCreateProfile: boolean

  isForgotPasswordSuccess: boolean
  // End

  /* Misc */
  version = '1.0';

  api: Api

  // #region CONSTRUCTOR
  constructor(serviceStore:ServiceStore, api: Api) {

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
    this.needUpdateProfile = false
    this.token = null
    this.isVerify = null

    this.errorCode = null
    this.errorMessage = null

    this.isLoginFlow = false
    this.isCreateProfile = false

    this.isForgotPasswordSuccess = false

    makeAutoObservable(this);

  }

  async login(email: string, password: string, fcmToken: string) {
    console.log('login')
    this.isLoading = true
    try {
      const response = await this.apiAuth.login(email, password, fcmToken)

      console.log(response)

      if(response.kind === 'form-error'){
        console.log(response.response.errorCode)
        console.log(response.response.message)

        if (response.response.errorCode === 10) {
          response.response.message = 'Woops. Alamat e-mail ini belum terdaftar. Coba cek lagi alamat e-mail-mu. Kalau memang belum registrasi, registrasi dulu yuk!'
        }

        if (response.response.errorCode === 15) {
          response.response.message = 'Waduh. Password yang kamu masukan salah. Coba cek lagi password-mu.'
        }

        if (response.response.errorCode === 14 || response.response.errorCode === 3  ) {
          response.response.message = 'Woops. Jangan lupa alamat email atau password-nya diisi ya!'
        }

        this.formError(response.response)
      }

      if(response.kind === 'ok'){
        console.log(response.response)
        await this.loginSuccess(response.response, email)
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
        await this.loginVerifySuccess(response.response)
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

  async loginSuccess (data: LoginResponse, email: string){
    this.needChangePassword = data.need_change_password
    this.token = data.token
    this.isVerify = data.is_verify
    this.needUpdateProfile = data.need_update_profile
    console.log('login sukses, data is verify: ', data.is_verify)
    if (this.isVerify && !this.needUpdateProfile) {
      this.isCreateProfile = false
      await this.serviceStore.setToken(this.token)
    } else {
      this.isCreateProfile = true
      await this.serviceStore.setHeaderToken(this.token)
    }
    console.log('this.isCreateProfile ', this.isCreateProfile)
    this.email = email
    this.isLoginFlow = true
  }

  loginFailed (e: any){
    this.errorMessage = e
  }

  async loginVerifySuccess (data: LoginVerifyResponse){
    this.needChangePassword = data.needChangePassword
    this.token = data.token

    if(data.isVerify === 0){
      this.isCreateProfile = true
      await this.serviceStore.setHeaderToken(this.token)
    } else {
      this.isCreateProfile = false
      await this.serviceStore.setToken(this.token)
    }
  }

  async signup(email: string, password: string, fcmToken: string) {
    console.log('signup')
    this.isLoading = true
    try {
      const response = await this.apiAuth.signup(email, password, fcmToken)

      console.log(response)

      if(response.kind === 'form-error'){
        console.log(response.response.errorCode)
        console.log(response.response.message)

        console.log(response)

        if (response.response.errorCode === 37) {
          response.response.message = 'Password minimal 8 karakter, memiliki huruf besar dan kecil, serta memiliki angka dan simbol (!, %, &, dkk.)'
        }

        if (response.response.errorCode === 4) {
          response.response.message = 'Waduh. Alamat e-mail ini sudah terdaftar. Kalau sudah pernah registrasi, langsung login aja ya!'
        }


        this.formError(response.response)
      }

      if(response.kind === 'ok'){
        console.log(response.response.email)
        console.log(response.response.otp)
        console.log(response.response.otpHash)

        console.log(response)

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
    this.otpHash = data.otp_hash
    this.otp = data.otp
    console.log('sign up oke')
  }

  signupFailed (e: any) {
    this.errorMessage = e
    console.log(e)
  }

  async signupVerify(otpCode: string) {
    console.log('signup verify')
    console.log(otpCode)
    this.isLoading = true
    try {
      const response = await this.apiAuth.signupVerify(this.email, otpCode, this.otpHash)

      console.log(response)

      if(response.kind === 'form-error'){
        console.log(response.response.errorCode)
        console.log(response.response.message)


        if (response.response.errorCode === 7 ) {
          response.response.message = 'Waduh. Nomor verifikasi OTP yang kamu masukan salah.'
        }
        this.formError(response.response)
      }

      if(response.kind === 'ok'){
        await this.signupVerifySuccess(response.response)
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

  async signupVerifySuccess (data: SignupVerifyResponse) {
    console.log('signupVerifySuccess')
    this.userId = data.user_id
    this.token = data.token
    // this.isVerify = data.is_verify
    this.email = data.email

    this.isLoginFlow = false
    this.serviceStore.setHeaderToken(this.token)
    this.isCreateProfile = true
    this.isVerify = true
  }

  async resendOTP(email: string) {
    console.log('resendOTP for ', email)
    this.isLoading = true
    try {
      const response = await this.apiAuth.resendOTP(email)

      console.log(response)

      if(response.kind === 'form-error'){
        console.log(response)

        this.formError(response.response)
      }

      if(response.kind === 'ok'){
        // console.log(response.response.otp)
        // console.log(response.response.otp_hash)

        console.log(response)

        this.resendOTPSuccess(response.response)
      }

    } catch (e) {
      console.log('resend OTP error catch')
      console.log(e)
      this.signupFailed(e)
      this.isLoading = false
    } finally {
      console.log('resend OTP done')
      this.isLoading = false
    }
  }

  resendOTPSuccess (data: ResendOTPResponse) {
    this.otpHash = data.otp_hash
    this.otp = data.otp
    console.log('sign up oke')
  }

  async changePassword(currentPassword: string, password: string) {
    console.log('change password')
    this.isLoading = true
    try {
      const response = await this.apiAuth.changePassword(currentPassword, password)

      console.log(response)

      if(response.kind === 'form-error'){
        console.log(response.response.errorCode)
        console.log(response.response.message)

        if (response.response.errorCode === 37) {
          response.response.message = 'Password minimal 8 karakter, memiliki huruf besar dan kecil, serta memiliki angka dan simbol (!, %, &, dkk.)'
        }

        if (response.response.errorCode === 15) {
          response.response.message = 'Waduh. Password yang kamu masukan salah. Coba cek lagi password-mu.'
        }
        this.formError(response.response)
      }

      if(response.kind === 'ok'){
        console.log('change password succeed')
      }

    } catch (e) {
      console.log('change password error catch')
      console.log(e)
      this.isLoading = false
    } finally {
      console.log('change password done')
      this.isLoading = false
    }
  }

  formError (data: ErrorFormResponse){
    this.errorCode = data.errorCode
    this.errorMessage = data.message
  }

  formReset () {
    this.isCreateProfile = false
    this.errorCode = null
    this.errorMessage = null
  }

  resetLoginState () {
    this.email = null
    this.otpHash = null
    this.otp = null

    this.isLoginFlow = false
    this.token = null
    this.isCreateProfile = false
    this.isForgotPasswordSuccess = false
    this.isVerify = null
  }

  async resetAuthStore (){
    this.formReset()
    this.token = null

    this.otp = null
    this.isCreateProfile = false

    await this.serviceStore.clearTokens()
  }

  async forgotPassword(email: string) {
    console.log('forgotPassword')
    this.isLoading = true
    try {
      const response = await this.apiAuth.forgotPassword(email)

      if(response.kind === 'form-error'){
        console.log(response.response.errorCode)
        console.log(response.response.message)

        this.formError(response.response)
      }

      if(response.kind === 'ok'){
        this.forgotPasswordSuccess()
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

  forgotPasswordSuccess () {
    this.isForgotPasswordSuccess = true
  }

  forgotPasswordError (e) {
    console.log(e)
    this.isForgotPasswordSuccess = false
  }

  // #endregion
}

