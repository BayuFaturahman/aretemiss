/* eslint-disable max-lines */
// #region IMPORTS
// PACKAGES
import ServiceStore from "./store.service"
import { Api } from "@services/api"
import { LeaderboardApi } from "@services/api/leaderboard/leaderboard-api"
import { ErrorFormResponse } from "@services/api/leaderboard/leaderboard-api.types"


export default class LeaderboardStore {
  // #region PROPERTIES
  
  serviceStore: ServiceStore
  api: Api
  isLoading: boolean

  refreshData: boolean

  errorCode: number
  errorMessage: string

  leaderboardApi: LeaderboardApi
  selfLeaderboardPoints: number;
  listLeaderboards: any[]
  leaderboardPosition: '';

  constructor(api: Api) {
    this.api = api
    this.isLoading = false

    this.refreshData = false

    this.errorCode = null
    this.errorMessage = null
    this.selfLeaderboardPoints = 0;
    this.listLeaderboards = [];
    this.leaderboardApi = new LeaderboardApi(this.api)
  }

  async getLeaderboardPosition(userId) {
    try {
      const response = await this.leaderboardApi.getLeaderboardPosition(userId);

      if (response.kind === "form-error") {
        this.formError(response.response)
      } else if (response.kind === "ok") {
        console.log(response, 'line 72')
        this.getLeaderboardPositionSuccess(response.response.data.my_position || '-')
      } else if (response.kind === 'unauthorized'){
        console.log('token expired journal')
        console.log(response)
        this.formError(response.response)
      } else if (response.kind === 'not-found') {
        this.getLeaderboardPositionSuccess('-');
      } else {
        __DEV__ && console.tron.log(response.kind)
      }
    } catch (e) {
      this.setErrorMessage(e);
    } finally {
      this.isLoading = false;
    }
  }

  async getListLeaderboards(page = 1, limit = 10) {
    this.isLoading = true
    try {
      const response = await this.leaderboardApi.getListLeaderboard(page, limit)

      if (response.kind === "form-error") {
        this.formError(response.response)
      } else if (response.kind === "ok") {
        this.getListLeaderboardsSuccess(response.response.data?.leaderboard);
        this.getSelfLeaderboardPointSuccess(+response.response.data.my_score);
      } else if (response.kind === 'unauthorized'){
        console.log('token expired journal')
        console.log(response)
        this.formError(response.response)
      } else if (response.kind === 'not-found') {
        console.log('masuk sini line 53')
        this.getListLeaderboardsSuccess([]);
        this.getSelfLeaderboardPointSuccess(0);
      } else {
        __DEV__ && console.tron.log(response.kind)
      }
    } catch (e) {
      console.log(e)
      this.setErrorMessage(e)
    } finally {
      console.log("getListLeaderboards done")
      this.isLoading = false
    }
  }

  getLeaderboardPositionSuccess(data: any) {
    this.leaderboardPosition = data;
  }

  getSelfLeaderboardPointSuccess(point: number) {
    this.selfLeaderboardPoints = point;
  }

  getListLeaderboardsSuccess(data: Array<any>) {
    console.log("getListLeaderboardsSuccess")
    // console.log('lastSeen ', lastSeen , lastSeen.getTime())
    this.listLeaderboards = [
      ...this.listLeaderboards,
      ...(data ?? [])
    ]
    this.refreshData = true
    this.isLoading = false
    // this.listFeeds = sortedListFeed
    console.log('on getListFeedsSuccess, total store list feed ')
    // console.log("list feed: ", this.listFeeds)
  }

  clearListLeaderboards() {
    this.listLeaderboards = []
    console.log("list leaderboards: ", this.listLeaderboards)
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
