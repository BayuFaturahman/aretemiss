import {AppRoute} from "@navigators/navigation-type";
import {
  coachingJournalMain,
  newJournalEntry,
  fillFeedback,
  quizForm,
  fillFeedbackDetail,
  overviewJournalEntry, fillFeedbackCoachee
} from "@screens/coaching-journal";
import {settings, myAccount, changePassword, changePhone, notification} from "@screens/settings";
import {notifications} from "@screens/notification";
import {homepage} from "@screens/homepage";
import {createProfile} from "@screens";

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
  {
    name: 'overviewJournalEntry',
    component: overviewJournalEntry,
  },
  {
    name: 'fillFeedbackCoachee',
    component: fillFeedbackCoachee,
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
  overviewJournalEntry: {
    journalId: string
  };
  fillFeedbackCoachee: {
    isFilled: boolean,
    journalId: string
  }
};

export default screens
