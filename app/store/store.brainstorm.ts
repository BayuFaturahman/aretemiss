/* eslint-disable max-lines */
// #region IMPORTS
// PACKAGES
import ServiceStore from "./store.service"
import { Api } from "@services/api"
import { BrainstormApi } from "@services/api/brainstorm/brainstorm-api"
import { CreateBrainstormGroupType, ErrorFormResponse } from "@services/api/brainstorm/brainstorm-api.types";


export default class BrainstormStore {
  // #region PROPERTIES
  serviceStore: ServiceStore
  api: Api
  isLoading: boolean
  refreshData: boolean
  errorCode: number
  errorMessage: string
  brainstormApi: BrainstormApi
  listBrainstormGroups: any[]

  constructor(api: Api) {
    this.api = api
    this.isLoading = false

    this.refreshData = false

    this.errorCode = null
    this.errorMessage = null
    this.listBrainstormGroups = [];
    this.brainstormApi = new BrainstormApi(this.api)
  }

  async getListBrainstormGroups() {
    this.isLoading = true
    try {
      const response = await this.brainstormApi.getListBrainstormGroups()

      if (response.kind === "form-error") {
        this.formError(response.response)
      } else if (response.kind === "ok") {
        console.log(response.response.data, 'line 41');
        this.getListBrainstormGroupsSuccess(response.response.data?.brainstorm_group);
      } else if (response.kind === 'unauthorized'){
        console.log('token expired journal')
        console.log(response)
        this.formError(response.response)
      } else if (response.kind === 'not-found') {
        this.getListBrainstormGroupsSuccess([]);
      } else {
        __DEV__ && console.tron.log(response.kind)
      }
    } catch (e) {
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("getListBrainstormGroups done")
      this.isLoading = false
    }
  }

  getListBrainstormGroupsSuccess(data: Array<any>) {
    console.log('getListBrainstormGroupsSuccess ' ,data)
    // console.log('lastSeen ', lastSeen , lastSeen.getTime())
    this.listBrainstormGroups = [...(data ?? [])
    ]
    this.refreshData = true
    this.isLoading = false
    // this.listFeeds = sortedListFeed
    // console.log("list feed: ", this.listFeeds)
  }

  async createBrainstormGroup(data: CreateBrainstormGroupType) {
    console.log("createBrainstormGroup with body request", data)
    this.isLoading = true
    try {
      const result = await this.brainstormApi.createBrainstormsGroup(data)

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

  clearListBrainstormGroups() {
    this.listBrainstormGroups = []
    console.log("list brainstorm groups: ", this.listBrainstormGroups)
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
