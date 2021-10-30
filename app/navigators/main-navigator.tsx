import {AppRoute} from "@navigators/navigation-type";
import {
  coachingJournalMain,
  newJournalEntry,
  fillFeedback,
  quizForm,
  fillFeedbackDetail,
  overviewJournalEntry, fillFeedbackCoachee, overviewJournalEntryByCoachee
} from "@screens/coaching-journal";
import {settings, myAccount, changePassword, changePhone, notification} from "@screens/settings";
import {notifications} from "@screens/notification";
import {homepage} from "@screens/homepage";
import {createProfile} from "@screens";
import {JournalEntryType} from "@screens/coaching-journal/new-journal-entry";

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
    name: 'overviewJournalEntryByCoachee',
    component: overviewJournalEntryByCoachee,
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
  newJournalEntry: {
    isDetail: boolean
  };
  fillFeedback: {
    isDetail: boolean;
    data: JournalEntryType;
  };
  quizForm: undefined;
  notificationList: undefined;
  notificationSettings: undefined;
  homepage: undefined;
  fillFeedbackDetail: undefined;
  overviewJournalEntry: {
    journalId: string
  };
  overviewJournalEntryByCoachee: {
    title: string;
    lessonLearned: string;
    commitment: string;
    content: string;
  };
  fillFeedbackCoachee: {
    isFilled: boolean,
    journalId: string
  }
};

export default screens
