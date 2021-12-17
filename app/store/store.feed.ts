/* eslint-disable max-lines */
// #region IMPORTS
// PACKAGES
import { makeAutoObservable } from "mobx"
import ServiceStore from "./store.service"
import { Api } from "@services/api"
import { FeedApi } from "@services/api/feed/feed-api"
import { ErrorFormResponse, FeedApiModel } from "@services/api/feed/feed-api.types"
import { CreatePostType, FeedItemType } from "@screens/feed/feed.type"


export default class FeedStore {
  // #region PROPERTIES
  
  serviceStore: ServiceStore
  api: Api
  isLoading: boolean

  refreshData: boolean

  errorCode: number
  errorMessage: string

  feedApi: FeedApi
  listFeeds: FeedItemType[]
  listMyFeed: FeedItemType[]

  constructor(serviceStore: ServiceStore, api: Api) {
    this.serviceStore = serviceStore
    this.api = api
    this.isLoading = false

    this.refreshData = false

    this.errorCode = null
    this.errorMessage = null

    this.listFeeds = []
    this.listMyFeed = []
    this.feedApi = new FeedApi(this.api)
  }

  async getListFeeds(page = 1, limit = 5) {
    this.isLoading = true
    try {
      const response = await this.feedApi.getListFeeds(page, limit)

      if (response.kind === "form-error") {
        this.formError(response.response)
      } else if (response.kind === "ok") {
        this.getListFeedsSuccess(response.response.data)
      } else if (response.kind === 'unauthorized'){
        console.log('token expired journal')
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

  getListFeedsSuccess(data: FeedApiModel[]) {
    console.log("getListFeedsSuccess")
    // this.listFeeds = []
    const tempListFeeds: FeedItemType[] = []
    const lastSeen = new Date(this.serviceStore.lastSeenFeed)
    // console.log('lastSeen ', lastSeen , lastSeen.getTime())
    data.forEach(post => {
      const postCreated = new Date(post.feed_created_at)
      // console.log('is lasSeen < created ', lastSeen.getTime() < postCreated.getTime())
      const tempPost = {
        id: post.feed_id,
        description: post.feed_description,
        imageUrl: post.feed_images_url,
        author: {
          id: post.feed_author_id,
          nickname: post.feed_author_nickname,
          title: '',
          photo: post.feed_author_photo,
        },
        commentCount: post.feed_comment_count,
        isNew: lastSeen.getTime() < postCreated.getTime(),
        createdAt: post.feed_created_at,
        updatedAt: post.feed_updated_at,
        isDeleted: (post.feed_is_deleted === 1),
        deletedAt: post.feed_deleted_at
      }
      tempListFeeds.push(tempPost)
    })
    
    const sortedListFeed = tempListFeeds.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    this.listFeeds = [
      ...this.listFeeds,
      ...(sortedListFeed ?? [])
    ]
    this.isLoading = false
    this.refreshData = true
    // this.listFeeds = sortedListFeed
    console.log('on getListFeedsSuccess, total store list feed ', this.listFeeds.length)
    // console.log("list feed: ", this.listFeeds)
  }

  async createPost(data: CreatePostType) {
    console.log('createPost with body request',data)
    this.isLoading = true
    try {
      const result = await this.feedApi.createPost(data)

      console.log('result create Post: ', result)
      if (result.kind === "ok") {
        this.createPostSuccess()
      } else if (result.kind === 'form-error'){
        this.formError(result.response)
      // } else if () {

      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    } catch (e) {
      console.log("createPost error")
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("createPost done")
      this.isLoading = false
    }
  }

  createPostSuccess() {
    console.log('createPostSuccess')
    this.refreshData = true
  }

  clearListFeed() {
    this.listFeeds = []
    console.log('clear list feed')
    // console.log("list feed: ", this.listFeeds)
  }


  async getListMyFeeds(id: string, page = 1, limit = 5) {
    this.isLoading = true
    try {
      const response = await this.feedApi.getListMyFeed(id, page, limit)

      if (response.kind === "form-error") {
        this.formError(response.response)
      }

      if (response.kind === "ok") {
        this.getListMyFeedsSuccess(response.response.data)
      }
    } catch (e) {
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("getListMyFeeds done")
      this.isLoading = false
    }
  }

  getListMyFeedsSuccess(data: FeedApiModel[]) {
    console.log("getListMyFeedsSuccess data", )
    const tempListMyFeeds: FeedItemType[] = []
    const lastSeen = new Date(this.serviceStore.lastSeenFeed)
    // console.log('lastSeen ', lastSeen , lastSeen.getTime())
    data.forEach(post => {
      const postCreated = new Date(post.feed_created_at)
      // console.log('is lasSeen < created ', lastSeen.getTime() < postCreated.getTime())
      
      tempListMyFeeds.push({
        id: post.feed_id,
        description: post.feed_description,
        imageUrl: post.feed_images_url,
        author: {
          id: post.feed_author_id,
          nickname: post.feed_author_nickname,
          title: '',
          photo: post.feed_author_photo,
        },
        commentCount: post.feed_comment_count,
        isNew: lastSeen.getTime() < postCreated.getTime(),
        createdAt: post.feed_created_at,
        updatedAt: post.feed_updated_at,
        isDeleted: (post.feed_is_deleted === 1),
        deletedAt: post.feed_deleted_at
      })
    })
    
    const sortedListMyFeed = tempListMyFeeds.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    this.listMyFeed = [
      ...this.listMyFeed,
      ...(sortedListMyFeed ?? [])
    ]
    this.isLoading = false
    this.refreshData = true    
    // console.log("list my feed: ", this.listMyFeed)
  }

  async deletePost(id: string) {
    this.isLoading = true
    try {
      const response = await this.feedApi.deletePost(id)
      console.log('delete utk id: ', id)

      if (response.kind === "form-error") {
        this.formError(response.response)
      }

      if (response.kind === "ok") {
        // this.getListMyFeedsSuccess(response.response.data)
      }
    } catch (e) {
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("deletePost done")
      this.isLoading = false
      // this.refreshData = true
      console.log('this.refreshdata ', this.refreshData)
    }
  }


  clearListMyFeed() {
    this.listMyFeed = []
    // console.log("list MY feed: ", this.listMyFeed)
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
