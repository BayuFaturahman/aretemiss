/* eslint-disable max-lines */
// #region IMPORTS
// PACKAGES
import { makeAutoObservable } from "mobx"
import ServiceStore from "./store.service"
import { Api } from "@services/api"
import { FeedApi } from "@services/api/feed/feed-api"
import { CommentApiModel, ErrorFormResponse, FeedApiModel } from "@services/api/feed/feed-api.types"

export type Feed = {
  id: string
  description: string
  images: string
  authorId: string
  isDeleted: number
  createdAt: string
  updatedAt: string
  comments: CommentApiModel[]
}

export type Comment = {
  id: string
  comment: string
  feedId: string
  authorId: string
  isDeleted: number
  createdAt: string
  updatedAt: string
  // commentAuthorId: string
  // commentFeedId: string
  commentAuthor: null
}

export default class FeedStore {
  // #region PROPERTIES

  serviceStore: ServiceStore
  api: Api
  isLoading: boolean

  errorCode: number
  errorMessage: string

  feedApi: FeedApi
  listFeeds: Feed[]

  constructor(serviceStore: ServiceStore, api: Api) {
    this.serviceStore = serviceStore
    this.api = api
    this.isLoading = false

    this.errorCode = null
    this.errorMessage = null

    this.feedApi = new FeedApi(this.api)
  }

  async getListFeeds() {
    this.isLoading = true
    try {
      const response = await this.feedApi.getListFeeds()

      if (response.kind === "form-error") {
        this.formError(response.response)
      }

      if (response.kind === "ok") {
        this.getListFeedsSuccess(response.response.data.feeds)
        // this.getProfileSuccess(response.response.data)
      }
    } catch (e) {
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("getProfile done")
      this.isLoading = false
    }
  }

  getListFeedsSuccess(data: FeedApiModel[]) {
    console.log("getListFeedsSuccess data", data)
    console.log("list feed: ", this.listFeeds)
  }

  async uploadImage(formData: FormData) {
    console.log("Upload Photo")
    this.isLoading = true
    try {
      const response = await this.feedApi.PostUploadFeedImages(formData)

      console.log(response)

      if (response.kind === "form-error") {
        this.formError(response.response)
      }

      if (response.kind === "ok") {
        return response.response;
        console.log(response.response)
      }
    } catch (e) {
      console.log("Upload Feed Image error")
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("Upload Feed Image done")
      this.isLoading = false
    }
  }

  formError(data: ErrorFormResponse) {
    this.errorCode = data.errorCode
    this.errorMessage = data.message
  }

  setErrorMessage(e: any) {
    this.errorMessage = e
  }
}
