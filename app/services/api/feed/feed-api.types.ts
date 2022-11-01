import { GeneralApiProblem } from "../api-problem"
import {FeedReactionItemType} from "@screens/feed/feed.type";

export type FeedApiModel = {
  "feed_id": string
  "feed_description": string
  "feed_images_url": string
  "feed_author_id": string
  "feed_is_deleted": number
  "feed_created_at": string
  "feed_updated_at": string
  "feed_deleted_at": string
  "feed_author_nickname": string
  "feed_author_photo": string
  "feed_comment_count": number
  "feed_author_mood": string
  "feed_author_team_1": string
  "feed_author_team_2": string
  "feed_author_team_3": string
  "feed_type_name": string
  "feed_thumbnail": string
  "feed_reactions": FeedReactionItemType[]
}

export type CommentApiModel = {
  "feed_comment_id": string
  "feed_comment_comment": string
  "feed_comment_feed_id": string
  "feed_comment_author_id": string
  "feed_comment_reply_to_id": string
  "feed_comment_created_at": string
  "feed_comment_updated_at": string
  "feed_comment_deleted_at": string
  "feed_comment_author_nickname": string
  "feed_comment_author_photo": null
  "feed_comment_reply_to_nickname": string
}

export type CommentNotifApiModel = {
  "feed_id": string
  "feed_comment_id": string
  "notification_is_new": number
  "notification_id": string
  "feed_comment_comment": string
  "feed_comment_author_fullname": string
  "feed_comment_author_photo": string
  "feed_comment_author_mood": string
  "feed_comment_reply_to_id": string
  "feed_comment_reply_to_nickname": string
}

export type FeedCategoryApiModel = {
  feed_type_id: string
  feed_type_name: string
  feed_type_created_at: string
  feed_type_updated_at: string
  feed_type_deleted_at: string
}

export interface ErrorFormResponse {
  errorCode: number
  message: string
}

export interface GetPostDetailResponse {
  message: string
  token: string
  data: FeedApiModel,
}
export interface GetListFeedsResponse {
  message: string
  token: string
  data: FeedApiModel[],
  "new_notif": number
  
}

export interface PostUploadFeedImagesResponse {
  message: string
  token: string
  data: {
    urls: string
  }
}

export interface CreatePostResponse {
  message: string
  token: string
  data: {
    feed: {
      "id": string
      // "isDeleted": boolean
      "description": string
      "imagesUrl": string
      "authorId": string
      "feed_updated_at": string
      "feed_created_at": string
    }
  }
}

export interface DeletePostResponse {
  message: string
  token: string
  data: {
  }
}
export interface GetListCommentResponse {
  message: string
  token: string
  data: {
    comments: CommentApiModel[]
  }
}
export interface CreateCommentResponse {
  message: string
  token: string
  data: {
    comment: {
      id: string,
      comment: string,
      feedId: string,
      authorId: string,
      "feed_comment_updated_at": string,
      "feed_comment_created_at": string
    },
    token: string
  }
}

export interface CreateCommentToResponse {
  message: string
  token: string
  data: {
    comment: {
      id: string,
      comment: string,
      feedId: string,
      authorId: string,
      replyToId: string,
      "feed_comment_updated_at": string,
      "feed_comment_created_at": string
    },
    token: string
  }
}

export interface DeleteCommentResponse {
  message: string
  token: string
  data: {
   }
}

export interface GetListCommentNotificationResponse {
  message: string
  data: {
    notificationComments: CommentNotifApiModel[] 
  }
  
}

export type GetListFeedCategoryResponse = {
  message: string
  token: string
  data: FeedCategoryApiModel[]
}

export type PostFeedReactResponse = {
  message: string
  token: string
  data: {
    "feedReact": {
      "id": string
      "reaction": string
      "feedId": string
      "authorId": string
      "feed_react_updated_at": string
      "feed_react_created_at": string
    }
  }
}


export type GetListFeedsResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: GetListFeedsResponse }  | GeneralApiProblem
export type GetPostDetailResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: GetPostDetailResponse }  | GeneralApiProblem
export type PostUploadFeedImagesResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: PostUploadFeedImagesResponse }  | GeneralApiProblem
export type CreatePostResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: CreatePostResponse }  | GeneralApiProblem
export type DeletePostResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: DeletePostResponse }  | GeneralApiProblem
export type GetListCommentResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: GetListCommentResponse }  | GeneralApiProblem
export type CreateCommentResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: CreateCommentResponse }  | GeneralApiProblem
export type CreateCommentToResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: CreateCommentToResponse }  | GeneralApiProblem
export type DeleteCommentResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: DeleteCommentResponse }  | GeneralApiProblem
export type GetListCommentNotification = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: GetListCommentNotificationResponse }  | GeneralApiProblem
export type GetListFeedCategoryResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: GetListFeedCategoryResponse }  | GeneralApiProblem
export type PostFeedReact = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: PostFeedReactResponse }  | GeneralApiProblem