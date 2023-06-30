/* eslint-disable max-lines */
// #region IMPORTS
// PACKAGES
import ServiceStore from "./store.service"
import { Api } from "@services/api"
import { FeedApi } from "@services/api/feed/feed-api"
import { ErrorFormResponse, FeedApiModel } from "@services/api/feed/feed-api.types"
import { CommentNotificationType, FeedCategoryType, FeedItemType, FeedPostCommentType } from "@screens/feed/feed.type"
import { CultureMeasurementApi } from "@services/api/cultureMeasurement/culture-measurement-api"
import { CMObjectiveDataModel, CMPublishDataModel, CMSectionModel, cultureMeasurementObjectiveModel } from "@services/api/cultureMeasurement/culture-measurement-api.types"
import { CM_PUBLISH_EMPTY, CM_SECTION_EMPTY, GET_PUBLISH_MOCK_DATA } from "@screens/culture-measurement/culture-measurement.type"

export default class CultureMeasurementStore {
    // #region PROPERTIES

    serviceStore: ServiceStore
    api: Api
    isLoading: boolean

    refreshData: boolean

    errorCode: number
    errorMessage: string

    cmApi: CultureMeasurementApi

    cmPublishData: CMPublishDataModel
    cmImplementationSection: CMSectionModel[]

    cmObjectiveData: CMObjectiveDataModel[]


    constructor(api: Api) {
        this.api = api
        this.isLoading = false

        this.refreshData = false

        this.errorCode = null
        this.errorMessage = null

        this.cmApi = new CultureMeasurementApi(this.api)

        this.cmPublishData = CM_PUBLISH_EMPTY
        this.cmImplementationSection = [CM_SECTION_EMPTY]

    }

    async getListPublish() {
        this.isLoading = true

        try {
            const result = await this.cmApi.getListPublish()
            console.log('in store getListPublish')
            // console.log(`result ${result}`)
            if (result.kind === "ok") {
                // console.log('result.response  ', result.response)
                await this.getListPublishSuccess(result.response)
            } else if (result.kind === 'form-error') {
                console.log('getListFeedbackUserByCoachee failed')
                // console.log(result.response.errorCode)
                this.cMFailed(result?.response?.errorCode)
            } else if (result.kind === 'unauthorized') {
                console.log('token expired getListFeedbackUserByCoachee')
                // console.log(result)
                this.cMFailed(result.response.errorCode)
            } else {
                // below code is used during development
                // await this.getListPublishSuccess(GET_PUBLISH_MOCK_DATA.data)
                __DEV__ && console.tron.log(result.kind)
            }
        } catch (e) {
            console.log(e)
        } finally {
            this.isLoading = false
        }
    }

    async getObjectiveById(id: string) {
        this.isLoading = true

        try {
            const result = await this.cmApi.getObjectiveById(id)

            if (result.kind === "ok") {
                await this.getObjectiveByIdSuccess(result.response.data)
            } else if (result.kind === 'form-error') {
                console.log('getCultureManagementObjectiveById failed')
                this.cMFailed(result.response.errorCode)
            } else if (result.kind === 'unauthorized') {
                console.log('token expired getCultureManagementObjectiveById')
                // 9 is app error code for invalid token
                this.cMFailed(9)
            } else {
                __DEV__ && console.tron.log(result.kind)
            }
        } catch (e) {
            console.log(e)
        } finally {
            this.isLoading = false
        }
    }

    getListPublishSuccess(data: CMPublishDataModel) {
        console.log('getListPublishSuccess')
        this.cmPublishData = data
        this.isLoading = false
        this.refreshData = true
    }

    getObjectiveByIdSuccess(data: CMObjectiveDataModel[]) {
        console.log('getCultureManagementObjectiveById')
        this.cmObjectiveData = data
        this.isLoading = false
        this.refreshData = true
    }


    cMFailed(errorId: number) {
        this.errorCode = errorId
        this.isLoading = false
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
