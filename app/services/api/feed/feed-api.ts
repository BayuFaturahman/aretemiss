import { ApiResponse } from "apisauce"
import { Api } from "../api"
import { getGeneralApiProblem } from "../api-problem"
import {
  GetListFeedsResult,
  PostUploadFeedImagesResult,
  CreatePostResult,
  DeletePostResult,
  GetListCommentResult,
  CreateCommentResult,
  CreateCommentToResult,
  DeleteCommentResult,
  GetListCommentNotification,
  GetPostDetailResult,
  GetListFeedCategoryResult,
  PostFeedReact, PostReportPost
} from "@services/api/feed/feed-api.types"
import { CreateCommentToType, CreateCommentType, CreatePostType } from "@screens/feed/feed.type"
import {DEFAULT_API_CONFIG} from "@services/api/api-config";

export class FeedApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getListFeeds(page: number, limit: number): Promise<GetListFeedsResult> {
    console.log("getListFeeds()")
    try {
      const response: ApiResponse<any> = await this.api.apisauce.get(`/feed`, {
        limit: limit,
        page: page
      }, {baseURL: `${DEFAULT_API_CONFIG.url.slice(0, -3)}v2/`})

      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // console.log(response.data)

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      // console.log(res)
      console.log(response.status)

      return { kind: "ok", response: res }
    } catch (e) {
      console.log(e)
      console.log("error")
      // __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getListMyFeed(authorId: string, page: number, limit: number): Promise<GetListFeedsResult> {
    console.log("getListMyFeeds()")
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`/feed`, {
        limit: limit,
        page: page,
        feedAuthorId: authorId
      }, { baseURL: `${DEFAULT_API_CONFIG.url.slice(0, -3)}v2/` })
      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // console.log(response.data)

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      // console.log(res)
      console.log(response.status)

      return { kind: "ok", response: res }
    } catch (e) {
      console.log(e)
      console.log("error")
      // __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getPostDetail(postId: string): Promise<GetPostDetailResult> {
    console.log("getPostDetail()")
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`/feed/${postId}`, {},
        { baseURL: `${DEFAULT_API_CONFIG.url.slice(0, -3)}v2/` })
      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // console.log(response.data)

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      // console.log(res)
      console.log(response.status)

      return { kind: "ok", response: res }
    } catch (e) {
      console.log(e)
      console.log("error")
      // __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async PostUploadFeedImages(formData: FormData): Promise<PostUploadFeedImagesResult> {
    try {
      // console.log('postUploadFiles data', formData)
      console.log('PostUploadFeedPhoto data api call')
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(
        `/upload`,
        formData,
        { baseURL: `${DEFAULT_API_CONFIG.url.slice(0, -3)}v2/`}
      )

      if(response.status === 400){
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data
      console.log('response PostUploadFeedImages', res)

      return { kind: "ok", response: res }
    } catch (e) {
      console.log('error', e)
      // __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data"}
    }
  }

  async createPost(data: CreatePostType): Promise<CreatePostResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(
        `/feed`, data,
        // { baseURL: `${DEFAULT_API_CONFIG.url.slice(0, -3)}v2/` }
      )

      // console.log('createPost response', response)
      console.log('createPost response.data', response.data)
      if(response.status === 400){
        const res = response.data
        return { kind: "form-error", response: res }
      }

      if(response.status === 500){
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      return { kind: "ok", response: res }
    } catch (e) {
      // __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data"}
    }
  }

  async deletePost(postId: string): Promise<DeletePostResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.delete(
        `/feed/${postId}`,
      )

      // console.log('path nya ', `/feed/${postId}`)
      // console.log('deletePost response', response)
      console.log('deletePost response.data', response.data)
      if(response.status === 400){
        const res = response.data
        return { kind: "form-error", response: res }
      }

      if(response.status === 500){
        console.log('MASUK RESPONSE STATUS 500')
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // the typical ways to die when calling an api
      if (!response.ok) {
        console.log('MASUK RESPONSE NOT OK')
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      return { kind: "ok", response: res }
    } catch (e) {
      // __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data"}
    }
  }

  async getListComment(postId: string, page: number, limit: number): Promise<GetListCommentResult> {
    console.log("getListComment()")
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`/feed/${postId}/comment`, {
        limit: limit,
        page: page,
      }, { baseURL: `${DEFAULT_API_CONFIG.url.slice(0, -3)}v2/` })
      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // console.log(response.data)

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      // console.log(res)
      console.log(response.status)

      return { kind: "ok", response: res }
    } catch (e) {
      console.log(e)
      console.log("error")
      // __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async createComment(data: CreateCommentType): Promise<CreateCommentResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(
        `/comment`, data
      )

      // console.log('createComment response', response)
      console.log('createComment response.data', response.data)
      if(response.status === 400){
        const res = response.data
        return { kind: "form-error", response: res }
      }

      if(response.status === 500){
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      return { kind: "ok", response: res }
    } catch (e) {
      // __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data"}
    }
  }

  async createCommentTo(data: CreateCommentToType): Promise<CreateCommentToResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(
        `/comment`, data
      )

      // console.log('createComment response', response)
      console.log('createCommentTo response.data', response.data)
      if(response.status === 400){
        const res = response.data
        return { kind: "form-error", response: res }
      }

      if(response.status === 500){
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      return { kind: "ok", response: res }
    } catch (e) {
      // __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data"}
    }
  }

  async deleteComment(commentId: string): Promise<DeleteCommentResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.delete(
        `/comment/${commentId}`,
      )
      console.log('delete comment dngan path  ',  `/comment/${commentId}`)
      console.log('deleteComment response.data', response.data)
      if(response.status === 400){
        const res = response.data
        return { kind: "form-error", response: res }
      }

      if(response.status === 500){
        console.log('MASUK RESPONSE STATUS 500')
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // the typical ways to die when calling an api
      if (!response.ok) {
        console.log('MASUK RESPONSE NOT OK')
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      return { kind: "ok", response: res }
    } catch (e) {
      // __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data"}
    }
  }

  async getListCommentNotification(page: number, limit: number): Promise<GetListCommentNotification> {
    console.log("getListCommentNotification()")
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`/notification-comments`, {
        limit: limit,
        page: page
      }, { baseURL: `${DEFAULT_API_CONFIG.url.slice(0, -3)}v2/` })
      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // console.log(response.data)

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      // console.log(res)
      console.log(response.status)

      return { kind: "ok", response: res }
    } catch (e) {
      console.log(e)
      console.log("error")
      // __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getListFeedCategory(page: number, limit: number): Promise<GetListFeedCategoryResult> {
    console.log("getListFeedCategory()")
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`/feed-type`, {
        limit: limit,
        page: page
      })

      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // console.log(response.data)

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      // console.log(res)
      console.log(response.status)

      return { kind: "ok", response: res }
    } catch (e) {
      console.log(e)
      console.log("error")
      // __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async reactToFeed(feedId, reaction): Promise<PostFeedReact> {
    console.log("reactToFeed()")
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(`/feed-react`, {
        "reaction": reaction,
        "feed_id": feedId
      })

      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      return { kind: "ok", response: res }
    } catch (e) {
      console.log(e)
      console.log("error")
      // __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async reportPost(feedId, authorId): Promise<PostReportPost> {
    console.log("reportPost()")
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(`/feed-hide`, {
        "feedId": feedId,
        "authorId": authorId
      })

      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      return { kind: "ok", response: res }
    } catch (e) {
      console.log(e)
      console.log("error")
      // __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async reportUser(authorId): Promise<PostReportPost> {
    console.log("reportUser()")
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(`/feed-hide`, {
        "authorId": authorId
      })

      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      return { kind: "ok", response: res }
    } catch (e) {
      console.log(e)
      console.log("error")
      // __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async blockUser(authorId): Promise<PostReportPost> {
    console.log("blockUser()")
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(`user/block-user`, {
        "userId": authorId
      })

      if (response.status === 400) {
        const res = response.data
        return { kind: "form-error", response: res }
      }

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const res = response.data

      return { kind: "ok", response: res }
    } catch (e) {
      console.log(e)
      console.log("error")
      // __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
