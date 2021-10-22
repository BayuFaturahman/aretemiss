// #region IMPORTS
import * as storage from "@utils/storage"

// PACKAGE IMPORTS
import {makeAutoObservable} from 'mobx';
import {ACCESS_TOKEN_KEY} from "./types.store";
import {Api} from "@services/api";

// #endregion


// #region MAIN CLASS

export default class ServiceStore {
  // #region PROPERTIES

  api: Api
  accessToken = '';
  refreshToken = '';
  rehydrated = false;

  // #endregion

  // #region CONSTRUCTOR

  constructor(api: Api) {

    console.log('init store')

    this.api = api

    makeAutoObservable(this);

    this.initToken();

    this.api.apisauce.addMonitor(response => this.tokenMonitor(response, this.clearHeaderToken, this.clearTokens))
  }

  private async tokenMonitor(response: any, clearHeaderToken, clearTokens) {
    console.log('token monitor')
    console.log(response.status)

    const { ok, status } = response;

    if (!ok && status === 401) {
      console.log('Token Expired gan!')
      try {
        await clearTokens()
      } catch (e){
        console.log(e)
        console.log('token Monitor Error')
      } finally {
        console.log('clear?')
        clearHeaderToken()
      }
      // should be back to login screen
    }
  }

  setRehydrated(value: boolean) {
    console.log('start setRehydrated');

    this.rehydrated = value;

    console.log('end setRehydrated');
  }

  // #endregion

  // #region ACTIONS

  // #region TOKENS


  // eslint-disable-next-line class-methods-use-this
  setHeaderToken(token: string) {
    this.api.setToken(token)
  }

  // eslint-disable-next-line class-methods-use-this
  clearHeaderToken() {
    this.api.removeToken()
  }

  private async initToken() {
    console.log('start initToken');

    try {
      // Check whether there's a saved token or not
      const savedToken = await storage.load(ACCESS_TOKEN_KEY);
      // const savedRefreshToken = await storage.load(REFRESH_TOKEN_KEY);

      // Token available
      if (savedToken) {
        console.log('SAVED TOKEN');
        this.accessToken = savedToken;
        this.setHeaderToken(savedToken);
      }
    } catch (error) {
      console.log(error);
      throw new Error('Unable to retrieved saved token from storage.');
    }
    this.setRehydrated(true);
  }

  async setToken(value: string) {
    console.log('start setToken');
    this.accessToken = value;
    try {
      await storage.save(ACCESS_TOKEN_KEY, value);
      this.setHeaderToken(value);
    } catch (error) {
      console.log(error);
      throw new Error('Unable to save token to storage.');
    }

    console.log('end setToken');
  }

  async clearTokens() {
    console.log('start clearTokens');

    this.refreshToken = '';
    this.accessToken = '';
    try {
      await storage.remove(ACCESS_TOKEN_KEY);
    } catch (error) {
      throw new Error('Unable to remove access token and refresh token.');
    }

    console.log('end clearTokens');
  }

}

// #endregion
