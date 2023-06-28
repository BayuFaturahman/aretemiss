/* eslint-disable max-lines */
// #region IMPORTS
// PACKAGES
import ServiceStore from "./store.service"
import { Api } from "@services/api"
import { FeedApi } from "@services/api/feed/feed-api"
import { ErrorFormResponse, FeedApiModel } from "@services/api/feed/feed-api.types"
import { CommentNotificationType, FeedCategoryType, FeedItemType, FeedPostCommentType } from "@screens/feed/feed.type"
import { CultureMeasurementApi } from "@services/api/cultureMeasurement/culture-measurement-api"
import { CMPublishDataModel, cultureMeasurementObjectiveModel } from "@services/api/cultureMeasurement/culture-measurement-api.types"

const CM_OBJECTIVES_EMPTY: cultureMeasurementObjectiveModel = {
    cm_objective_id: '',
    cm_objective_title: '',
    cm_objective_max_answerred: 0,
    culture_measurement_takers: [],
    is_enable: false
}

const CM_PUBLISH_EMPTY: CMPublishDataModel = {
    id: '',
    title: '',
    description: '',
    status: '',
    startDate: '',
    endDate: '',
    cm_created_at: '',
    cm_updated_at: '',
    cm_deleted_at: '',
    culture_measurement_objectives: []
}

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


    constructor(api: Api) {
        this.api = api
        this.isLoading = false

        this.refreshData = false

        this.errorCode = null
        this.errorMessage = null

        this.cmApi = new CultureMeasurementApi(this.api)

        this.cmPublishData = CM_PUBLISH_EMPTY
    }

    async getListPublish() {
        this.isLoading = true

        try {
            const result = await this.cmApi.getListPublish()
            console.log('in store getListPublish')
            if (result.kind === "ok") {
                // console.log('result.response  ', result.response)
                await this.getListPublishSuccess(result.response)
            } else if (result.kind === 'form-error') {
                console.log('getListFeedbackUserByCoachee failed')
                // console.log(result.response.errorCode)
                this.cMFailed(result.response.errorCode)
            } else if (result.kind === 'unauthorized') {
                console.log('token expired getListFeedbackUserByCoachee')
                // console.log(result)
                this.cMFailed(result.response.errorCode)
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
