/* eslint-disable max-lines */
// #region IMPORTS
// PACKAGES
import { makeAutoObservable } from "mobx"
import ServiceStore from "./store.service"
import { Api } from "@services/api"
import { FeedApi } from "@services/api/feed/feed-api"
import { CommentApiModel, ErrorFormResponse, FeedApiModel } from "@services/api/feed/feed-api.types"
import { CreateCommentToType, CreateCommentType, CreatePostType, FeedItemType, FeedPostCommentType } from "@screens/feed/feed.type"


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
  listComment: FeedPostCommentType[]

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
          mood: post.feed_author_mood
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
    console.log('on getListFeedsSuccess, total store list feed ', this.listFeeds)
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
          mood: post.feed_author_mood
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

  async getListComment(userId: string, feedId: string, page = 1, limit = 5) {
    this.isLoading = true
    try {
      const response = await this.feedApi.getListComment(feedId, page, limit)

      if (response.kind === "form-error") {
        this.formError(response.response)
      }

      if (response.kind === "ok") {
        this.getListCommentSuccess(userId, response.response.data.comments)
      }
    } catch (e) {
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("getListComment done")
      this.isLoading = false
    }
  }

  getListCommentSuccess(userId: string, data: CommentApiModel[]) {
    console.log("getListCommentSuccess data", data)
    const tempPostComment: FeedPostCommentType[] = []
    data.forEach(comment => {
      console.log()
      tempPostComment.push({
        id: comment.feed_comment_id,
        comment: comment.feed_comment_comment,
        feedId: comment.feed_comment_feed_id,
        isOwnComment: comment.feed_comment_author_id === userId,
        replyToId: comment.feed_comment_reply_to_id? comment.feed_comment_reply_to_id : '',
        replyToNickname: comment.feed_comment_reply_to_nickname ? comment.feed_comment_reply_to_nickname: '',
        createdAt: comment.feed_comment_created_at,
        updatedAt: comment.feed_comment_updated_at,
        deletedAt: comment.feed_comment_deleted_at ? comment.feed_comment_deleted_at : '',
        author: {
          id: comment.feed_comment_author_id,
          nickname: comment.feed_comment_author_nickname,
          title: '',
          photo: comment.feed_comment_author_photo
        }
      })
    })
    
    const sortedComment = tempPostComment.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).reverse()

    this.listComment = [
      ...this.listComment,
      ...(sortedComment ?? [])
    ]
    this.isLoading = false
    this.refreshData = true    
    console.log("list comment: ", this.listComment)
  }

  clearListComment() {
    this.listComment = []
    console.log('clear list comment')
    // console.log("list feed: ", this.listFeeds)
  }

  async createComment(data: CreateCommentType) {
    console.log('createComment with body request',data)
    this.isLoading = true
    try {
      const result = await this.feedApi.createComment(data)

      console.log('result create comment: ', result)
      if (result.kind === "ok") {
        this.createCommentSuccess()
      } else if (result.kind === 'form-error'){
        this.formError(result.response)
      // } else if () {

      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    } catch (e) {
      console.log("createComment error")
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("createComment done")
      this.isLoading = false
    }
  }

  createCommentSuccess() {
    console.log('createComment')
    this.refreshData = true
  }

  async createCommentTo(data: CreateCommentToType) {
    console.log('createCommentTo with body request',data)
    this.isLoading = true
    try {
      const result = await this.feedApi.createCommentTo(data)

      console.log('result create comment: ', result)
      if (result.kind === "ok") {
        this.createCommentToSuccess()
      } else if (result.kind === 'form-error'){
        this.formError(result.response)
      // } else if () {

      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    } catch (e) {
      console.log("createComment error")
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("createComment done")
      this.isLoading = false
    }
  }

  createCommentToSuccess() {
    console.log('createCommentTo')
    this.refreshData = true
  }

  async deleteComment(id: string) {
    this.isLoading = true
    try {
      const response = await this.feedApi.deleteComment(id)
      console.log('delete comment utk id: ', id)

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
      console.log("deleteComment done")
      this.isLoading = false
      // this.refreshData = true
      console.log('this.refreshdata ', this.refreshData)
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
