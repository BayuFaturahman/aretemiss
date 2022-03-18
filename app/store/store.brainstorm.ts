/* eslint-disable max-lines */
// #region IMPORTS
// PACKAGES
import ServiceStore from "./store.service"
import { Api } from "@services/api"
import { BrainstormApi } from "@services/api/brainstorm/brainstorm-api"
import { CreateBrainstormGroupType, ErrorFormResponse, IdeaPoolsByBrainstormGroupApiModel } from "@services/api/brainstorm/brainstorm-api.types";
import { IdeaPoolsByGroupType } from "@screens/brainstorm/brainstorms.type";


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
  ideaPoolsByGroup: IdeaPoolsByGroupType

  constructor(api: Api) {
    this.api = api
    this.isLoading = false

    this.refreshData = false

    this.errorCode = null
    this.errorMessage = null
    this.listBrainstormGroups = []
    
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

  async getIdeaPoolsByBrainstormGroup(groupId: string) {
    this.isLoading = true
    try {
      const response = await this.brainstormApi.getIdeaPoolsByBrainstormGroup(groupId)

      if (response.kind === "form-error") {
        this.formError(response.response)
      } else if (response.kind === "ok") {
        this.getIdeaPoolsByBrainstormGroupSuccess(response.response.data)
      } else if (response.kind === "unauthorized") {
        console.log("token expired journal")
        console.log(response)
        this.formError(response.response)
      } else {
        __DEV__ && console.tron.log(response.kind)
      }
    } catch (e) {
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("getListFeeds done")
      this.isLoading = false
    }
  }

  getIdeaPoolsByBrainstormGroupSuccess(data: IdeaPoolsByBrainstormGroupApiModel) {
    console.log("getIdeaPoolsByBrainstormGroupSuccess", data)
    // this.listFeeds = []
    const tempListIdeas: IdeaPoolsByGroupType = {
      brainstormed: [],
      shortlisted: [],
      selected: [],
    }

    data.brainstormed?.forEach((idea) => {
      tempListIdeas.brainstormed.push({
        id: idea.ip_id,
        // brainstormGroupId: idea.ip_brainstorm_group_id,
        // title: idea.ip_title,
        description: idea.ip_description,
        color: idea.ip_color,
        colorShade: idea.ip_shadow,
        // is_selected: idea.ip_is_selected,
        // votes: idea.ip_votes,
      })
    })

    data.shortlisted?.forEach((idea) => {
      tempListIdeas.shortlisted.push({
        id: idea.ip_id,
        // brainstormGroupId: idea.ip_brainstorm_group_id,
        // title: idea.ip_title,
        description: idea.ip_description,
        color: idea.ip_color,
        colorShade: idea.ip_shadow,
        // is_selected: idea.ip_is_selected,
        // votes: idea.ip_votes,
      })
    })

    data.selected?.forEach((idea) => {
      tempListIdeas.selected.push({
        id: idea.ip_id,
        // brainstormGroupId: idea.ip_brainstorm_group_id,
        // title: idea.ip_title,
        description: idea.ip_description,
        color: idea.ip_color,
        colorShade: idea.ip_shadow,
        // is_selected: idea.ip_is_selected,
        // votes: idea.ip_votes,
      })
    })

    this.ideaPoolsByGroup = tempListIdeas
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
