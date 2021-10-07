import {AppRoute} from "@navigators/navigation-type";
import {coachingJournalMain, newJournalEntry, fillFeedback, quizForm} from "@screens/coaching-journal";
import {settings, myAccount, changePassword, changePhone} from "@screens/settings";
import {notifications} from "@screens/notification";

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
};

export default screens
