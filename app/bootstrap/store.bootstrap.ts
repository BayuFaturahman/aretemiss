// #region IMPORTS

// LOCAL CONFIG IMPORTS

// #endregion

import ServiceStore from "../store/store.service";
import MainStore from "../store/store.main";
import AuthStore from "../store/store.auth"
import {Api} from "@services/api";

export default class RootStore {
  authStore: AuthStore;
  serviceStore: ServiceStore;
  mainStore: MainStore;
  api: Api

  constructor(api: Api) {

    this.api = api
    this.serviceStore = new ServiceStore(api);
    this.mainStore = new MainStore(this.serviceStore);
    this.authStore = new AuthStore(this.serviceStore, this.mainStore, this.api);

  }
}
