/* eslint-disable max-lines */
// #region IMPORTS
// PACKAGES
import ServiceStore from "./store.service"
import { Api } from "@services/api"
import { ErrorFormResponse } from "@services/api/feed/feed-api.types"
import { CultureMeasurementApi } from "@services/api/cultureMeasurement/culture-measurement-api"
import { CMCreateAnswerModel, CMGetAnswerModel, CMPublishDataModel, CMSectionModel, CMUpdateAnswerModel } from "@services/api/cultureMeasurement/culture-measurement-api.types"
import { CM_GET_ANSWER_EMPTY_DATA, CM_PUBLISH_EMPTY, CM_SECTION_EMPTY } from "@screens/culture-measurement/culture-measurement.type"

export default class CultureMeasurementStore {
    // #region PROPERTIES

    serviceStore: ServiceStore
    api: Api
    isLoading: boolean

    refreshData: boolean

    errorCode: number
    errorMessage: string
    message: string

    cmApi: CultureMeasurementApi

    cmPublishData: CMPublishDataModel
    cmImplementationSection: CMSectionModel[]
    cmAnswerData: CMGetAnswerModel


    constructor(api: Api) {
        this.api = api
        this.isLoading = false

        this.refreshData = false

        this.errorCode = null
        this.errorMessage = null
        this.message = null

        this.cmApi = new CultureMeasurementApi(this.api)

        this.cmPublishData = CM_PUBLISH_EMPTY
        this.cmImplementationSection = [CM_SECTION_EMPTY]
        this.cmAnswerData = CM_GET_ANSWER_EMPTY_DATA
    }

    async getListPublish() {
        this.isLoading = true

        try {
            const result = await this.cmApi.getListPublish()
            console.log('in store getListPublish')
            // console.log(`result ${result}`)
            if (result.kind === "ok") {
                // console.log('result.response  ', JSON.stringify(result.response))
                await this.getListPublishSucceed(result.response)
            } else if (result.kind === 'form-error') {
                console.log('getListPublish failed')
                // console.log(result.response.errorCode)
                this.cMFailed(result?.response?.errorCode)
            } else if (result.kind === 'unauthorized') {
                console.log('token expired getListPublish')
                // console.log(result)
                this.cMFailed(result.response.errorCode)
            } else {
                // below code is used during development
                // await this.getListPublishSucceed(GET_PUBLISH_MOCK_DATA.data)
                __DEV__ && console.tron.log(result.kind)
            }
        } catch (e) {
            console.log(e)
        } finally {
            this.isLoading = false
        }
    }

    getListPublishSucceed(data: CMPublishDataModel) {
        console.log('getListPublishSucceed')
        this.cmPublishData = data
        this.isLoading = false
        this.refreshData = true
    }

    async getAllSection(id: string) {
        this.isLoading = true

        try {
            const result = await this.cmApi.getAllSection(id)
            console.log('in store getAllSection')
            // console.log(`result ${result}`)
            if (result.kind === "ok") {
                // console.log('result.response  ', JSON.stringify(result.response))
                await this.getAllSectionSucceed(result.response)
            } else if (result.kind === 'form-error') {
                console.log('getAllSection failed')
                // console.log(result.response.errorCode)
                this.cMFailed(result?.response?.errorCode)
            } else if (result.kind === 'unauthorized') {
                console.log('token expired getAllSection')
                // console.log(result)
                this.cMFailed(result.response.errorCode)
            } else {
                // below code is used during development
                // await this.getListPublishSucceed(GET_PUBLISH_MOCK_DATA.data)
                __DEV__ && console.tron.log(result.kind)
            }
        } catch (e) {
            console.log(e)
        } finally {
            this.isLoading = false
        }
    }

    getAllSectionSucceed(data: CMSectionModel[]) {
        console.log('getAllSectionSucceed')
        this.cmImplementationSection = data
        this.isLoading = false
        this.refreshData = true
    }

    async createCMAnswer(data: CMCreateAnswerModel) {
        this.isLoading = true

        try {
            const result = await this.cmApi.createAnswer(data)
            console.log('in store createCMAnswer')
            // console.log(`result ${result}`)
            if (result.kind === "ok") {
                // console.log('result.response  ', JSON.stringify(result.response))
                await this.createCMAnswerSucceed(result.response.message, result.response)
            } else if (result.kind === 'form-error') {
                console.log('createCMAnswer failed')
                // console.log(result.response.errorCode)
                this.cMFailed(result?.response?.errorCode)
            } else if (result.kind === 'unauthorized') {
                console.log('token expired createCMAnswer')
                // console.log(result)
                this.cMFailed(result.response.errorCode)
            } else {
                // console.log(`result error ${JSON.stringify(result)}`)
                __DEV__ && console.tron.log(result.kind)
            }
        } catch (e) {
            console.log(e)
        } finally {
            this.isLoading = false
        }
    }

    createCMAnswerSucceed(message: string, data: CMCreateAnswerModel) {
        console.log('createCMAnswerSucceed')
        this.message = message
        this.cmAnswerData.temp_data = data.temp_data
        this.cmAnswerData.rated_user_id = data.rated_user_id
        this.isLoading = false
        this.refreshData = true
    }

    async getCMAnswerById(id: string) {
        this.isLoading = true

        try {
            const result = await this.cmApi.getCMAnswerById(id)
            console.log('in store getCMAnswerById')
            // console.log(`result ${result}`)
            if (result.kind === "ok") {
                // console.log('result.response  ', JSON.stringify(result.response))
                await this.getCMAnswerByIdSucceed(result.response)
            } else if (result.kind === 'form-error') {
                console.log('getAllSection failed')
                // console.log(result.response.errorCode)
                this.cMFailed(result?.response?.errorCode)
            } else if (result.kind === 'unauthorized') {
                console.log('token expired getAllSection')
                // console.log(result)
                this.cMFailed(result.response.errorCode)
            } else {
                // below code is used during development
                // await this.getListPublishSucceed(GET_PUBLISH_MOCK_DATA.data)
                __DEV__ && console.tron.log(result.kind)
            }
        } catch (e) {
            console.log(e)
        } finally {
            this.isLoading = false
        }
    }

    getCMAnswerByIdSucceed(data: CMGetAnswerModel) {
        console.log('getCMAnswerByIdSucceed')
        this.cmAnswerData = data
        this.isLoading = false
        this.refreshData = true
    }

    async updateCMAnswer(id: string, data: CMUpdateAnswerModel) {
        this.isLoading = true

        try {
            const result = await this.cmApi.updateAnswer(id, data)
            console.log('in store updateCMAnswer')
            // console.log(`id: ${id} ;; data: ${data}`)
            // console.log(`result ${JSON.stringify(result)}`)
            if (result.kind === "ok") {
                // console.log('result.response  ', JSON.stringify(result.response))
                await this.updateCMAnswerSucceed(result.response.message, result.response.data)
            } else if (result.kind === 'form-error') {
                console.log('updateCMAnswer failed')
                // console.log(result.response.errorCode)
                this.cMFailed(result?.response?.errorCode)
            } else if (result.kind === 'unauthorized') {
                console.log('token expired updateCMAnswer')
                // console.log(result)
                this.cMFailed(result.response.errorCode)
            } else {
                // console.log(`result error ${JSON.stringify(result)}`)
                __DEV__ && console.tron.log(result.kind)
            }
        } catch (e) {
            console.log(e)
        } finally {
            this.isLoading = false
        }
    }

    updateCMAnswerSucceed(message: string, data: CMUpdateAnswerModel) {
        console.log('updateCMAnswerSucceed')
        this.message = message
        this.cmAnswerData.temp_data = data.temp_data
        this.cmAnswerData.rated_user_id = data.rated_user_id
        this.isLoading = false
        this.refreshData = true

        console.log(`message ${message}`)
    }

    cMFailed(errorId: number) {
        this.errorCode = errorId
        this.isLoading = false
    }

    clearCMData() {
        this.cmPublishData = CM_PUBLISH_EMPTY
        this.cmImplementationSection = [CM_SECTION_EMPTY]
        this.cmAnswerData = CM_GET_ANSWER_EMPTY_DATA
    }

    formReset() {
        this.errorCode = null
        this.errorMessage = null
        this.refreshData = false
        this.message = null
        this.isLoading = false
    }

    formError(data: ErrorFormResponse) {
        this.errorCode = data.errorCode
        this.errorMessage = data.message
        this.isLoading = false
    }

    setErrorMessage(e: any) {
        this.errorMessage = e
    }
}
