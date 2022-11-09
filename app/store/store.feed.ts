/* eslint-disable max-lines */
// #region IMPORTS
// PACKAGES
import { makeAutoObservable } from "mobx"
import ServiceStore from "./store.service"
import { Api } from "@services/api"
import { FeedApi } from "@services/api/feed/feed-api"
import { CommentApiModel, CommentNotifApiModel, ErrorFormResponse, FeedApiModel, FeedCategoryApiModel } from "@services/api/feed/feed-api.types"
import { CommentNotificationType, CreateCommentToType, CreateCommentType, CreatePostType, FeedCategoryType, FeedItemType, FeedPostCommentType } from "@screens/feed/feed.type"


export default class FeedStore {
  // #region PROPERTIES
  
  serviceStore: ServiceStore
  api: Api
  isLoading: boolean

  refreshData: boolean

  errorCode: number
  errorMessage: string

  feedApi: FeedApi
  postDetail: FeedItemType
  listFeeds: FeedItemType[]
  listMyFeed: FeedItemType[]
  listComment: FeedPostCommentType[]
  listCommentNotif: CommentNotificationType[]
  newNotif: number

  listFeedCategory: FeedCategoryType[]

  constructor(serviceStore: ServiceStore, api: Api) {
    this.serviceStore = serviceStore
    this.api = api
    this.isLoading = false

    this.refreshData = false

    this.errorCode = null
    this.errorMessage = null

    this.listFeedCategory = []
    this.postDetail = null
    this.listFeeds = []
    this.listMyFeed = []
    this.feedApi = new FeedApi(this.api)
    this.newNotif = 0
  }

  async getListFeeds(page = 1, limit = 5) {
    this.isLoading = true
    try {
      const response = await this.feedApi.getListFeeds(page, limit)

      if (response.kind === "form-error") {
        this.formError(response.response)
      } else if (response.kind === "ok") {
        this.getListFeedsSuccess(response.response.data, response.response.new_notif)
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

  getListFeedsSuccess(data: FeedApiModel[], notif: number) {
    console.log("getListFeedsSuccess")
    // this.listFeeds = []
    const tempListFeeds: FeedItemType[] = []
    const lastSeen = new Date(this.serviceStore.lastSeenFeed)
    // console.log('lastSeen ', lastSeen , lastSeen.getTime())
    data.forEach(post => {
      const postCreated = new Date(post.feed_created_at)
      // console.log('is lasSeen < created ', lastSeen.getTime() < postCreated.getTime())
      const tempPost:FeedItemType = {
        id: post.feed_id,
        description: post.feed_description,
        imageUrl: post.feed_images_url.match("\\b\\w*undefined\\w*\\b") ? null : post.feed_images_url,
        author: {
          id: post.feed_author_id,
          nickname: post.feed_author_nickname,
          title: (post.feed_author_team_1 && post.feed_author_team_1!== null? post.feed_author_team_1 : '') + (post.feed_author_team_2 && post.feed_author_team_2 !== null ? ', ' + post.feed_author_team_2 : '') + (post.feed_author_team_3 && post.feed_author_team_3 !== null ? ', ' + post.feed_author_team_3 : ''),
          photo: post.feed_author_photo,
          mood: post.feed_author_mood
        },
        type: post.feed_type_name,
        commentCount: post.feed_comment_count,
        isNew: lastSeen.getTime() < postCreated.getTime(),
        createdAt: post.feed_created_at,
        updatedAt: post.feed_updated_at,
        isDeleted: (post.feed_is_deleted === 1),
        deletedAt: post.feed_deleted_at,
        thumbnail: post.feed_thumbnail ? (post.feed_thumbnail === "undefined" || post.feed_thumbnail === "" || post.feed_thumbnail.match("\\b\\w*undefined\\w*\\b") ? null : post.feed_thumbnail) : null,
        feedReactions: post.feed_reactions
      }
      tempListFeeds.push(tempPost)
    })
    
    const sortedListFeed = tempListFeeds.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    this.newNotif = notif
    this.listFeeds = [
      ...this.listFeeds,
      ...(sortedListFeed ?? [])
    ]
    this.isLoading = false
    this.refreshData = true
    // this.listFeeds = sortedListFeed
    console.log('on getListFeedsSuccess, total store list feed ')
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
        this.getListMyFeedsSuccess(response.response.data, response.response.new_notif)
      }
    } catch (e) {
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("getListMyFeeds done")
      this.isLoading = false
    }
  }

  getListMyFeedsSuccess(data: FeedApiModel[], notif: number) {
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
        imageUrl: post.feed_images_url.match("\\b\\w*undefined\\w*\\b") ? null : post.feed_images_url,
        author: {
          id: post.feed_author_id,
          nickname: post.feed_author_nickname,
          title: '',
          photo: post.feed_author_photo,
          mood: post.feed_author_mood
        },
        type: post.feed_type_name,
        commentCount: post.feed_comment_count,
        isNew: lastSeen.getTime() < postCreated.getTime(),
        createdAt: post.feed_created_at,
        updatedAt: post.feed_updated_at,
        isDeleted: (post.feed_is_deleted === 1),
        deletedAt: post.feed_deleted_at,
        thumbnail: post.feed_thumbnail ? (post.feed_thumbnail === "undefined" || post.feed_thumbnail === "" || post.feed_thumbnail.match("\\b\\w*undefined\\w*\\b") ? null : post.feed_thumbnail) : null,
        feedReactions: post.feed_reactions
      })
    })
    
    const sortedListMyFeed = tempListMyFeeds.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    this.newNotif = notif
    this.listMyFeed = [
      ...this.listMyFeed,
      ...(sortedListMyFeed ?? [])
    ]
    this.isLoading = false
    this.refreshData = true    
    // console.log("list my feed: ", this.listMyFeed)
  }

  async getPostDetail(postId: string) {
    this.isLoading = true
    try {
      const response = await this.feedApi.getPostDetail(postId)

      if (response.kind === "form-error") {
        this.formError(response.response)
      }

      console.log('response ', response, postId)
      if (response.kind === "ok") {
        this.getPostDetailSuccess(response.response.data)
      }
    } catch (e) {
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("getPostDetail done")
      this.isLoading = false
    }
  }

  getPostDetailSuccess(post: FeedApiModel) {
    console.log("getPostDetailSuccess ")
    
    const lastSeen = new Date(this.serviceStore.lastSeenFeed)
    const postCreated = new Date(post.feed_created_at)
    
    this.postDetail = {
      id: post.feed_id,
      description: post.feed_description,
      imageUrl: post.feed_images_url.match("\\b\\w*undefined\\w*\\b") ? null : post.feed_images_url,
      author: {
        id: post.feed_author_id,
        nickname: post.feed_author_nickname,
        title: (post.feed_author_team_1 && post.feed_author_team_1 !== null? post.feed_author_team_1 : '') + (post.feed_author_team_2 && post.feed_author_team_2 !== null ? ', ' + post.feed_author_team_2 : '') + (post.feed_author_team_3 && post.feed_author_team_3 !== null ? ', ' + post.feed_author_team_3 : ''),
        photo: post.feed_author_photo,
        mood: post.feed_author_mood
      },
      type: post.feed_type_name,
      commentCount: post.feed_comment_count,
      isNew: lastSeen.getTime() < postCreated.getTime(),
      createdAt: post.feed_created_at,
      updatedAt: post.feed_updated_at,
      isDeleted: (post.feed_is_deleted === 1),
      deletedAt: post.feed_deleted_at,
      thumbnail: post.feed_thumbnail ? (post.feed_thumbnail === "undefined" || post.feed_thumbnail === "" || post.feed_thumbnail.match("\\b\\w*undefined\\w*\\b") ? null : post.feed_thumbnail) : null,
      feedReactions: post.feed_reactions ?? []
    }
    
    
    this.isLoading = false
    this.refreshData = true    
    console.log("postDetail set")
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

  async getListCommentNotification(userId: string, page = 1, limit = 5) {
    this.isLoading = true
    try {
      const response = await this.feedApi.getListCommentNotification(page, limit)

      if (response.kind === "form-error") {
        this.formError(response.response)
      }

      if (response.kind === "ok") {
        this.getListCommentNotificationSuccess(userId, response.response.data.notificationComments)
      }
    } catch (e) {
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("getListMyFeeds done")
      this.isLoading = false
    }
  }

  getListCommentNotificationSuccess(userId: string, data: CommentNotifApiModel[]) {
    console.log("getListCommentNotificationSuccess data", )
    const temptListCommentNotif: CommentNotificationType[] = []
    const lastSeen = new Date(this.serviceStore.lastSeenFeed)
    // console.log('lastSeen ', lastSeen , lastSeen.getTime())
    data.forEach(notif => {
      // const postCreated = new Date(post.feed_created_at)
      // console.log('is lasSeen < created ', lastSeen.getTime() < postCreated.getTime())
      
      temptListCommentNotif.push({
        id: notif.notification_id,
        isNew: notif.notification_is_new === 1,
        feedId: notif.feed_id,
        feedCommentId: notif.feed_comment_id,
        feedComment: notif.feed_comment_comment,
        replyToNickname: notif.feed_comment_reply_to_nickname,
        type: notif.feed_comment_reply_to_id === userId ? 'replied': 'comment' ,
        author: {
          fullName: notif.feed_comment_author_fullname,
          photo: notif.feed_comment_author_photo,
          mood: notif.feed_comment_author_mood
        }
      })
    })
    
    
    this.listCommentNotif = [
      ...this.listCommentNotif,
      ...(temptListCommentNotif ?? [])
    ]
    console.log('this.listCommentNotif ')
    this.isLoading = false
    this.refreshData = true    
  }
  
  clearListCommentNotification() {
    this.listCommentNotif = []
    console.log('clear list comment notif')
    // console.log("list feed: ", this.listFeeds)
  }

  async getListFeedCategory(page = 1, limit = 10) {
    this.isLoading = true
    try {
      const response = await this.feedApi.getListFeedCategory(page, limit)

      console.log('response.response.data', response.response.data)

      if (response.kind === "form-error") {
        this.formError(response.response)
      }

      if (response.kind === "ok") {
        this.getListFeedCategorySuccess(response.response.data)
      }
    } catch (e) {
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("getListMyFeeds done")
      this.isLoading = false
    }
  }

  getListFeedCategorySuccess(data: FeedCategoryApiModel[]) {
    console.log("getListFeedCategorySuccess data", data)
    const temptListCategory: FeedCategoryType[] = []
    data.forEach(category => {
      
      temptListCategory.push({
        id: category.feed_type_id,
        item: category.feed_type_name,
        key: category.feed_type_name,
      })
    })
    
    
    this.listFeedCategory = temptListCategory
    console.log('this.listFeedCategory ', this.listFeedCategory)
    this.isLoading = false
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
