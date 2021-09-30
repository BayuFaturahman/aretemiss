import {applySnapshot, Instance, SnapshotOut, types} from "mobx-state-tree"
import { withEnvironment } from "../extensions/with-environment"
import {AuthModel} from "@models/auth/auth-model";
import {AuthApi} from "@services/api/auth/auth-api";
import {Api} from "@services/api";


/**
 * Example store containing Rick and Morty characters
 */
export const AuthStoreModel = types
  .model("AuthStore")
  .props({
    authUser: types.optional(AuthModel, {
      id: '',
      name: '',
      email: '',
      phoneNumber: '',
      isVerify: false,
      createdAt: '',
      updatedAt: '',
      token: '',
      otp: null,
      otpHash: '',
    }),
    formErrorCode: types.maybeNull(types.number),
    isLoading: types.optional(types.boolean, false)
  })
  .extend(withEnvironment)
  .actions((self) => ({
    loginSucceed: (userId: string, otpHash: string, otp: number) => {

      self.authUser.id = userId
      self.authUser.otpHash = otpHash
      self.authUser.otp = otp

      self.formErrorCode = null
      self.isLoading = false

    },
  }))
  .actions((self) => ({
    loginFailed: (errorId: number) => {
      self.formErrorCode = errorId
      self.isLoading = false
    },
    resetAuthStore: () => {
      self.formErrorCode = null

      const emptyValue = {
        id: '',
        name: '',
        email: '',
        phoneNumber: '',
        isVerify: false,
        createdAt: '',
        updatedAt: '',
        token: '',
        otp: null,
        otpHash: '',
      }

      applySnapshot(self.authUser , emptyValue)

      self.environment.api.removeToken()

    },
  }))
  .actions((self) => ({
    login: async (phoneNumber: string, password: string) => {

      self.isLoading = true

      const authApi = new AuthApi(self.environment.api)
      const result = await authApi.login(phoneNumber, password)

      console.log(result.kind)

      if (result.kind === "ok") {
        self.loginSucceed(result.response.userId, result.response.otpHash, result.response.otp)
      } else if (result.kind === 'form-error'){
        self.loginFailed(result.response.errorCode)
      } else {
        self.isLoading = false
        __DEV__ && console.tron.log(result.kind)
      }
    },
  }))

type AuthStoreType = Instance<typeof AuthStoreModel>
export interface AuthStore extends AuthStoreType {}
type AuthStoreSnapshotType = SnapshotOut<typeof AuthStoreModel>
export interface AuthStoreSnapshot extends AuthStoreSnapshotType {}
export const createCharacterStoreDefaultModel = () => types.optional(AuthStoreModel, {})
