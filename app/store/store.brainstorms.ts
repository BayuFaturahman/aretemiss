/* eslint-disable max-lines */
// #region IMPORTS
// PACKAGES
import ServiceStore from "./store.service"
import { Api } from "@services/api"
import { ErrorFormResponse } from "@services/api/feed/feed-api.types"
import { BrainstormsApi } from "@services/api/brainstorms/brainstorms-api"
import { BrainstormGroupType } from "@screens/brainstorm/brainstorms.type"
import { CreateBrainstormGroupType } from "@services/api/brainstorms/brainstorms-api.types"

export default class BrainStormsStore {
  // #region PROPERTIES

  serviceStore: ServiceStore
  api: Api
  isLoading: boolean

  refreshData: boolean

  errorCode: number
  errorMessage: string

  brainstormsApi: BrainstormsApi

  listBrainstormsGroup: BrainstormGroupType[]

  constructor(serviceStore: ServiceStore, api: Api) {
    this.serviceStore = serviceStore
    this.api = api
    this.isLoading = false
    this.brainstormsApi = new BrainstormsApi(this.api)

    this.refreshData = false

    this.errorCode = null
    this.errorMessage = null

    this.listBrainstormsGroup = []
  }

  async createBrainstormGroup(data: CreateBrainstormGroupType) {
    console.log("createBrainstormGroup with body request", data)
    this.isLoading = true
    try {
      const result = await this.brainstormsApi.createBrainstormsGroup(data)

      console.log("result createBrainstormGroup: ", result)
      if (result.kind === "ok") {
        this.createBrainstormGroupSuccess()
      } else if (result.kind === "form-error") {
        this.formError(result.response)
        // } else if () {
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    } catch (e) {
      console.log("createBrainstormGroup error")
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("createBrainstormGroup done")
      this.isLoading = false
    }
  }

  createBrainstormGroupSuccess() {
    console.log("createBrainstormGroup success")
    this.refreshData = true
  }

  formReset() {
    this.errorCode = null
    this.errorMessage = null
    this.refreshData = false
  }

  formError(data: ErrorFormResponse) {
    this.errorCode = data.errorCode
    this.errorMessage = data.message
  }

  setErrorMessage(e: any) {
    this.errorMessage = e
  }
}
