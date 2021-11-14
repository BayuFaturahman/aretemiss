// #region IMPORTS

// LOCAL CONFIG IMPORTS

// #endregion

import ServiceStore from "../store/store.service";
import MainStore from "../store/store.main";
import AuthStore from "../store/store.auth"
import CoachingStore from "../store/store.coaching"
import FeedStore from "../store/store.feed";

import {Api} from "@services/api";

export default class RootStore {
  authStore: AuthStore;
  serviceStore: ServiceStore;
  mainStore: MainStore;
  api: Api;
  coachingStore: CoachingStore;
  feedStore: FeedStore;

  constructor(api: Api) {

    this.api = api

    this.serviceStore = new ServiceStore(api);
    this.mainStore = new MainStore(this.serviceStore, this.api);
    this.authStore = new AuthStore(this.serviceStore, this.mainStore, this.api);
    this.coachingStore = new CoachingStore(this.serviceStore, this.mainStore, this.api);
    this.feedStore = new FeedStore(this.serviceStore, this.api);

  }
}
