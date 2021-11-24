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
  },
  "createdAt": string;
  "updatedAt": string;
  "authorId": string;
  "authorPhoto": string;
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

  async getListNotifications() {
    this.isLoading = true
    try {
      const response = await this.notificationApi.getListNotifications()

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
    console.log("getNotificationsSuccess data", data)
    this.notificationsList = []
    data.forEach(item => {
      this.notificationsList.push({
        id: item.notification_id,
        content: item.notification_content,
        type: item.notification_type,
        data: {
          journalId: item.notification_data.journal_id
        },
        createdAt: item.notification_created_at,
        updatedAt: item.notification_updated_at,
        authorId: item.notification_author_id,
        authorPhoto: item.notification_author_photo
      })
    })

    console.log("list notifications data: ", this.notificationsList)
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
