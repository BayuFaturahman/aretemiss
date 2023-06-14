// #region IMPORTS

// LOCAL CONFIG IMPORTS

// #endregion

import ServiceStore from "../store/store.service";
import MainStore from "../store/store.main";
import AuthStore from "../store/store.auth"
import BrainstormStore from "../store/store.brainstorm";
import CoachingStore from "../store/store.coaching"
import FeedbackStore from "../store/store.feedback";
import FeedStore from "../store/store.feed";
import NotificationStore from "../store/store.notification";
import LeaderboardStore from "../store/store.leaderboard";

import {Api} from "@services/api";
import {FeedApi} from "@services/api/feed/feed-api";
import {QuizApi} from "@services/api/quiz/quiz-api";

export default class RootStore {
  authStore: AuthStore;
  serviceStore: ServiceStore;
  mainStore: MainStore;
  brainstormStore: BrainstormStore;
  api: Api;
  coachingStore: CoachingStore;
  feedbackStore: FeedbackStore;
  feedStore: FeedStore;
  notificationStore: NotificationStore;
  leaderboardStore: LeaderboardStore;

  feedApi: FeedApi
  quizApi: QuizApi

  constructor(api: Api) {

    this.api = api

    this.serviceStore = new ServiceStore(api);
    this.authStore = new AuthStore(this.serviceStore, this.api);
    this.mainStore = new MainStore(this.serviceStore, this.authStore, this.api);
    this.coachingStore = new CoachingStore(this.serviceStore, this.mainStore, this.api);
    this.feedbackStore = new FeedbackStore(this.serviceStore, this.mainStore, this.api);
    this.feedStore = new FeedStore(this.serviceStore, this.api);
    this.notificationStore = new NotificationStore(this.api);
    this.leaderboardStore = new LeaderboardStore(this.api);
    this.brainstormStore = new BrainstormStore(this.api);

    this.feedApi = new FeedApi(api)
    this.quizApi = new QuizApi(api)
  }
}
