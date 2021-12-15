import { ApiResponse } from "apisauce"
import { Api } from "../api"
import { getGeneralApiProblem } from "../api-problem"
import { GetListFeedsResult, PostUploadFeedImagesResult, CreatePostResult, DeletePostResult, GetListCommentResult } from "@services/api/feed/feed-api.types"
import { CreatePostType } from "@screens/feed/feed.type"

export class FeedApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getListFeeds(page: number, limit: number): Promise<GetListFeedsResult> {
    console.log("getListFeeds()")
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`/feed`, {
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
      __DEV__ && console.tron.log(e.message)
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
      __DEV__ && console.tron.log(e.message)
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
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data"}
    }
  }

  async createPost(data: CreatePostType): Promise<CreatePostResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(
        `/feed`, data
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
      __DEV__ && console.tron.log(e.message)
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
      __DEV__ && console.tron.log(e.message)
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
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

}
