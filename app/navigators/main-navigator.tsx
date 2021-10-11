import {AppRoute} from "@navigators/navigation-type";
import {coachingJournalMain, newJournalEntry, fillFeedback, quizForm, fillFeedbackDetail} from "@screens/coaching-journal";
import {settings, myAccount, changePassword, changePhone, notification} from "@screens/settings";
import {notifications} from "@screens/notification";
import {homepage} from "@screens/homepage";

const screens: AppRoute[] = [
  {
    name: 'coachingJournalMain',
    component: coachingJournalMain,
  },
  {
    name: 'newJournalEntry',
    component: newJournalEntry,
  },
  {
    name: 'fillFeedback',
    component: fillFeedback,
  },
  {
    name: 'settingsPage',
    component: settings,
  },
  {
    name: 'myAccount',
    component: myAccount,
  },
  {
    name: 'changePassword',
    component: changePassword,
  },
  {
    name: 'changePhone',
    component: changePhone,
  },
  {
    name: 'quizForm',
    component: quizForm,
  },
  {
    name: 'notificationList',
    component: notifications,
  },
  {
    name: 'notificationSettings',
    component: notification,
  },
  {
    name: 'homepage',
    component: homepage,
  },
  {
    name: 'fillFeedbackDetail',
    component: fillFeedbackDetail,
  },
];

export type NavigatorParamList = {
  coachingJournalMain: undefined;
  settingsPage: undefined;
  myAccount: undefined;
  changePhone: undefined;
  changePassword: undefined;
  newJournalEntry: undefined;
  fillFeedback: undefined;
  quizForm: undefined;
  notificationList: undefined;
  notificationSettings: undefined;
  homepage: undefined;
  fillFeedbackDetail: undefined;
};

export default screens
