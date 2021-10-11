/* eslint-disable max-lines */
// #region IMPORTS
// PACKAGES
import {makeAutoObservable} from 'mobx';
import ServiceStore from "./store.service";

// CONFIGS

// CONSTANTS

export default class MainStore {
  // #region PROPERTIES

  serviceStore: ServiceStore


  // #region CONSTRUCTOR

  constructor(serviceStore: ServiceStore) {
    this.serviceStore = serviceStore;

    makeAutoObservable(this);
  }
  // #endregion

  // #region ACTIONS



  // #endregion
}

// #endregion
