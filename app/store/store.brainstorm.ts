/* eslint-disable max-lines */
// #region IMPORTS
// PACKAGES
import ServiceStore from "./store.service"
import { Api } from "@services/api"
import { BrainstormApi } from "@services/api/brainstorm/brainstorm-api"
import {
  CpApiModel,
  CreateBrainstormGroupType,
  CreateIdeaType,
  ErrorFormResponse,
  IdeaPoolDetailsApiModel,
  IdeaPoolsByBrainstormGroupApiModel,
  UpdateIdeaType,
} from "@services/api/brainstorm/brainstorm-api.types"
import { CpUser, IdeaPoolsByGroupType, IdeaPoolsDetail } from "@screens/brainstorm/brainstorms.type"

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
  ideaDetail: IdeaPoolsDetail

  listCpUser: CpUser[]

  constructor(api: Api) {
    this.api = api
    this.isLoading = true

    this.refreshData = false

    this.errorCode = null
    this.errorMessage = null
    this.listBrainstormGroups = []
    this.ideaDetail = null
    this.listCpUser = []

    this.brainstormApi = new BrainstormApi(this.api)
  }

  async getListBrainstormGroups() {
    this.formReset();
    this.isLoading = true
    try {
      const response = await this.brainstormApi.getListBrainstormGroups()

      if (response.kind === "form-error") {
        this.formError(response.response)
      } else if (response.kind === "ok") {
        console.log(response.response.data, "line 41")
        this.getListBrainstormGroupsSuccess(response.response.data?.brainstorm_group)
      } else if (response.kind === "unauthorized") {
        console.log("token expired journal")
        console.log(response)
        this.formError(response.response)
      } else if (response.kind === "not-found") {
        this.getListBrainstormGroupsSuccess([])
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
    console.log("getListBrainstormGroupsSuccess ", data)
    // console.log('lastSeen ', lastSeen , lastSeen.getTime())
    this.listBrainstormGroups = [...(data ?? [])]
    this.refreshData = true
    this.isLoading = false
    // this.listFeeds = sortedListFeed
    // console.log("list feed: ", this.listFeeds)
  }

  async createBrainstormGroup(data: CreateBrainstormGroupType) {
    console.log("createBrainstormGroup with body request", data)
    this.formReset();
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
    this.formReset();
    try {
      const response = await this.brainstormApi.getIdeaPoolsByBrainstormGroup(groupId)

      if (response.kind === "form-error" || response.kind === "timeout") {
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
        title: idea.ip_title,
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
        title: idea.ip_title,
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
        title: idea.ip_title,
        description: idea.ip_description,
        color: idea.ip_color,
        colorShade: idea.ip_shadow,
        // is_selected: idea.ip_is_selected,
        // votes: idea.ip_votes,
      })
    })

    this.ideaPoolsByGroup = tempListIdeas
  }

  async createIdea(data: CreateIdeaType) {
    console.log("createIdea with body request", data)
    this.isLoading = true
    this.formReset();
    try {
      const result = await this.brainstormApi.createIdea(data)

      console.log("result createIdea: ", result)
      if (result.kind === "ok") {
        this.createIdeaSuccess()
      } else if (result.kind === "form-error") {
        this.formError(result.response)
        // } else if () {
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    } catch (e) {
      console.log("createIdea error")
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("createIdea done")
      this.isLoading = false
    }
  }

  createIdeaSuccess() {
    console.log("createIdeaSuccess success")
    this.refreshData = true
  }

  async getIdeaDetail(id: string) {
    console.log("getIdeaDetail with body request", id)
    this.isLoading = true
    this.formReset();
    try {
      const result = await this.brainstormApi.getIdea(id)

      console.log("result getIdeaDetail: ", result)
      if (result.kind === "ok") {
        this.getIdeaDetailSuccess(result.response.data)
      } else if (result.kind === "form-error") {
        this.formError(result.response)
        // } else if () {
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    } catch (e) {
      console.log("getIdeaDetail error")
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("getIdeaDetail done")
      this.isLoading = false
    }
  }

  getIdeaDetailSuccess(data: IdeaPoolDetailsApiModel) {
    console.log("getIdeaDetailSuccess success", data)

    const tempIdeaDetail: IdeaPoolsDetail = {
      id: data.ip_id,
      title: data.ip_title,
      description: data.ip_description,
      color: data.ip_color,
      votes: data.ip_votes,
      authorId: data.ip_author_id,
      authorFullname: data.ip_author_fullname,
      isSelected: data.ip_is_selected,
      groupInitiatorId: data.bg_initiator_id,
      isAuthor: data.is_author,
      isInitiator: data.is_initiator,
    }

    this.ideaDetail = tempIdeaDetail
    this.refreshData = true
  }

  async updateIdea(data: UpdateIdeaType) {
    console.log("updateIdea with body request", data)
    this.isLoading = true
    this.formReset();
    try {
      const result = await this.brainstormApi.updateIdea(data)

      console.log("result updateIdea: ", result)
      if (result.kind === "ok") {
        this.updateIdeaSuccess()
      } else if (result.kind === "form-error") {
        this.formError(result.response)
        // } else if () {
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    } catch (e) {
      console.log("updateIdea error")
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("updateIdea done")
      this.isLoading = false
    }
  }

  updateIdeaSuccess() {
    console.log("updateIdeaSuccess success")
    this.refreshData = true
  }

  async deleteIdea(id: string) {
    console.log("deleteIdea with body request", id)
    this.isLoading = true
    this.formReset();
    try {
      const result = await this.brainstormApi.deleteIdea(id)

      console.log("result deleteIdea: ", result)
      if (result.kind === "ok") {
        this.deleteIdeaSuccess()
      } else if (result.kind === "form-error") {
        this.formError(result.response)
        // } else if () {
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    } catch (e) {
      console.log("deleteIdea error")
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("deleteIdea done")
      this.isLoading = false
    }
  }

  deleteIdeaSuccess() {
    console.log("deleteIdeaSuccess success")
    this.refreshData = true
  }

  async voteIdea(ideaId: string) {
    console.log("voteIdea with body request", ideaId)
    this.isLoading = true
    this.formReset();
    try {
      const result = await this.brainstormApi.voteIdea({
        ideaPoolsId: ideaId,
      })

      console.log("result voteIdea: ", result)
      if (result.kind === "ok") {
        this.updateIdeaSuccess()
      } else if (result.kind === "form-error") {
        this.formError(result.response)
        // } else if () {
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    } catch (e) {
      console.log("voteIdea error")
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("voteIdea done")
      this.isLoading = false
    }
  }

  voteIdeaSuccess() {
    console.log("voteIdeaSuccess success")
    this.refreshData = true
  }

  async selectIdea(ideaId: string) {
    console.log("selectIdea with body request", ideaId)
    this.isLoading = true
    this.formReset();
    try {
      const result = await this.brainstormApi.selectIdea({
        ideaPoolsId: ideaId,
      })

      console.log("result voteIdea: ", result)
      if (result.kind === "ok") {
        this.selectIdeaSuccess()
      } else if (result.kind === "form-error") {
        this.formError(result.response)
        // } else if () {
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    } catch (e) {
      console.log("selectIdea error")
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("selectIdea done")
      this.isLoading = false
    }
  }

  selectIdeaSuccess() {
    console.log("selectIdeaSuccess success")
    this.refreshData = true
  }

  async getListCP(page = 1, limit = 200) {
    this.isLoading = true
    this.formReset();
    try {
      const result = await this.brainstormApi.getListCP(page, limit)
      console.log("getListCP result", result)

      if (result.kind === "form-error") {
        this.formError(result.response)
      }

      if (result.kind === "ok") {
        await this.getListCPSucceed(result.response.data)
      }
    } catch (e) {
      console.log("getListCP error")
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("getListUser done")
      this.isLoading = false
    }
  }

  async getListCPSucceed(listCP: CpApiModel[]) {
    console.log("getListCPSucceed", listCP)

    this.listCpUser = []

    listCP?.forEach((data) => {
      this.listCpUser.push({
        id: data.id,
        item: data.fullname
      })
    })


    this.errorMessage = null
    this.isLoading = false
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
