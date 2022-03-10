// #region IMPORTS

// LOCAL CONFIG IMPORTS

// #endregion

import ServiceStore from "../store/store.service";
import MainStore from "../store/store.main";
import AuthStore from "../store/store.auth"
import CoachingStore from "../store/store.coaching"
import FeedStore from "../store/store.feed";
import NotificationStore from "../store/store.notification";
import LeaderboardStore from "../store/store.leaderboard";
import BrainStormsStore from "../store/store.brainstorms";

import {Api} from "@services/api";

export default class RootStore {
  authStore: AuthStore;
  serviceStore: ServiceStore;
  mainStore: MainStore;
  api: Api;
  coachingStore: CoachingStore;
  feedStore: FeedStore;
  notificationStore: NotificationStore;
  leaderboardStore: LeaderboardStore;
  brainstormStore: BrainStormsStore;

  constructor(api: Api) {

    this.api = api

    this.serviceStore = new ServiceStore(api);
    this.authStore = new AuthStore(this.serviceStore, this.api);
    this.mainStore = new MainStore(this.serviceStore, this.authStore, this.api);
    this.coachingStore = new CoachingStore(this.serviceStore, this.mainStore, this.api);
    this.feedStore = new FeedStore(this.serviceStore, this.api);
    this.notificationStore = new NotificationStore(this.api);
    this.leaderboardStore = new LeaderboardStore(this.api);
    this.brainstormStore = new BrainStormsStore(this.serviceStore, this.api);
  }
}
