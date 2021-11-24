import { GeneralApiProblem } from "../api-problem"

export type NotificationType = "request_feedback" | "submitted_feedback" | "submitted_comment"

export type NotificationItemModel = {
  "notification_id": string;
  "notification_content": string;
  "notification_type": NotificationType
  "notification_data": {
    "journal_id": string;
  },
  "notification_created_at": string;
  "notification_updated_at": string;
  "notification_author_id": string;
  "notification_author_photo": string;
}

export interface ErrorFormResponse {
  errorCode: number
  message: string
}

export interface GetListNotificationsResponse {
  message: string
  token: string
  data: {
    notifications: NotificationItemModel[]
  }
}

export type GetNotificationsListResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: GetListNotificationsResponse } | GeneralApiProblem
