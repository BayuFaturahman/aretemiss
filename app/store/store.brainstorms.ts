/* eslint-disable max-lines */
// #region IMPORTS
// PACKAGES
import ServiceStore from "./store.service"
import { Api } from "@services/api"
import { ErrorFormResponse } from "@services/api/feed/feed-api.types"
import { BrainstormsApi } from "@services/api/brainstorms/brainstorms-api"
import { BrainstormGroupType, IdeaPoolsByGroupType } from "@screens/brainstorm/brainstorms.type"
import {
  CreateBrainstormGroupType,
  IdeaPoolsByBrainstormsGroupApiModel,
} from "@services/api/brainstorms/brainstorms-api.types"

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
  ideaPoolsByGroup: IdeaPoolsByGroupType

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

  async getIdeaPoolsByBrainstormsGroup(groupId: string) {
    this.isLoading = true
    try {
      const response = await this.brainstormsApi.getIdeaPoolsByBrainstormGroup(groupId)

      if (response.kind === "form-error") {
        this.formError(response.response)
      } else if (response.kind === "ok") {
        this.getIdeaPoolsByBrainstormsGroupSuccess(response.response.data)
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

  getIdeaPoolsByBrainstormsGroupSuccess(data: IdeaPoolsByBrainstormsGroupApiModel) {
    console.log("getIdeaPoolsByBrainstormsGroupSuccess")
    // this.listFeeds = []
    const tempListIdeas: IdeaPoolsByGroupType = {
      brainstormed: [],
      shortlisted: [],
      selected: [],
    }

    data.brainstormed?.forEach((idea) => {
      tempListIdeas.brainstormed.push({
        id: idea.ip_id,
        brainstormGroupId: idea.ip_brainstorm_group_id,
        title: idea.ip_title,
        description: idea.ip_description,
        color: idea.ip_color,
        shadow: idea.ip_shadow,
        is_selected: idea.ip_is_selected,
        votes: idea.ip_votes,
      })
    })

    data.shortlisted?.forEach((idea) => {
      tempListIdeas.shortlisted.push({
        id: idea.ip_id,
        brainstormGroupId: idea.ip_brainstorm_group_id,
        title: idea.ip_title,
        description: idea.ip_description,
        color: idea.ip_color,
        shadow: idea.ip_shadow,
        is_selected: idea.ip_is_selected,
        votes: idea.ip_votes,
      })
    })

    data.selected?.forEach((idea) => {
      tempListIdeas.selected.push({
        id: idea.ip_id,
        brainstormGroupId: idea.ip_brainstorm_group_id,
        title: idea.ip_title,
        description: idea.ip_description,
        color: idea.ip_color,
        shadow: idea.ip_shadow,
        is_selected: idea.ip_is_selected,
        votes: idea.ip_votes,
      })
    })

    this.ideaPoolsByGroup = tempListIdeas
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
