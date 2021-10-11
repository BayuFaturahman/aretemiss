// #region IMPORTS
import * as storage from "@utils/storage"

// PACKAGE IMPORTS
import {makeAutoObservable} from 'mobx';
import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY} from "./types.store";
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

  private async initToken() {
    console.log('start initToken');
    console.log(`this.api ${this.api}`);

    try {
      // Check whether there's a saved token or not
      const savedToken = await storage.load(ACCESS_TOKEN_KEY);
      const savedRefreshToken = await storage.load(REFRESH_TOKEN_KEY);

      // Token available
      if (savedToken && savedRefreshToken) {
        console.log('SAVED TOKEN');
        this.accessToken = savedToken;
        this.refreshToken = savedRefreshToken;
        this.setHeaderToken(savedToken);
      }
    } catch (error) {
      console.log(error);
      throw new Error('Unable to retrieved saved token from storage.');
    }
    this.setRehydrated(true);
  }

}

// #endregion
