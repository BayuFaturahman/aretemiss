/* eslint-disable max-lines */
// #region IMPORTS
// PACKAGES
import { makeAutoObservable } from "mobx"
import { Api } from "@services/api"
import { NotificationApi } from "@services/api/notification/notification-api";
import { ErrorFormResponse } from "@services/api/feed/feed-api.types"
import {NotificationItemModel, NotificationType} from "@services/api/notification/notification-api.types";

export type NotificationItem = {
  "id": string;
  "content": string;
  "type": NotificationType
  "data": {
    "journalId": string;
    "feedId" : string;
    "fu_id" : string;
    "rfu_id" : string;
    "coach_id" : string;
    "jl_id", string;
  },
  "createdAt": string;
  "updatedAt": string;
  "authorId": string;
  "authorPhoto": string;
  isNew: boolean;
}

export default class NotificationStore {
  // #region PROPERTIES

  api: Api
  isLoading: boolean

  refreshData: boolean

  errorCode: number
  errorMessage: string

  notificationApi: NotificationApi
  notificationsList: NotificationItem[]

  constructor(api: Api) {
    this.api = api
    this.isLoading = false

    this.errorCode = null
    this.errorMessage = null

    this.notificationsList = []
    this.notificationApi = new NotificationApi(this.api)

    makeAutoObservable(this);
  }

  async getListNotifications(page = 1, limit = 5) {
    this.isLoading = true
    try {
      const response = await this.notificationApi.getListNotifications(page, limit)

      console.log("getListNotifications response.kind", response.kind)

      if (response.kind === "form-error") {
        this.formError(response.response)
      }

      if (response.kind === "ok") {
        this.getNotificationsSuccess(response.response.data.notifications)
      }
    } catch (e) {
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("getListNotifications done")
      this.isLoading = false
    }
  }

  getNotificationsSuccess(data: NotificationItemModel[]) {
    console.log("getNotificationsSuccess data", JSON.stringify(data))
    const newNotification = []
    data.forEach(item => {
      newNotification.push({
        id: item.notification_id,
        content: item.notification_content,
        type: item.notification_type,
        data: {
          journalId: item.notification_data.journal_id,
          feedId: item.notification_data.feed_id,
          fu_id: item.notification_data.fu_id,
          rfu_id: item.notification_data.rfu_id,
          coach_id: item.notification_data.coach_id,
          jl_id: item.notification_data.jl_id
        },
        createdAt: item.notification_created_at,
        updatedAt: item.notification_updated_at,
        authorId: item.notification_author_id,
        authorPhoto: item.notification_author_photo,
        isNew: item.notification_is_new !== 0
      })
    })

    this.notificationsList = [
      ...this.notificationsList,
      ...(newNotification ?? [])
    ]
    console.log("list notifications data: ", JSON.stringify(this.notificationsList))
  }

  clearListNotifications() {
    this.notificationsList = []
    console.log("list feed: ", this.notificationsList)
  }

  formError(data: ErrorFormResponse) {
    this.errorCode = data.errorCode
    this.errorMessage = data.message
  }

  setErrorMessage(e: any) {
    this.errorMessage = e
  }
}
