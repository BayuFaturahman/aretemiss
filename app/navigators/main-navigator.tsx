import {AppRoute} from "@navigators/navigation-type";
import {
  coachingJournalMain,
  newJournalEntry,
  fillFeedback,
  quizForm,
  fillFeedbackDetail,
  overviewJournalEntry, fillFeedbackCoachee, overviewJournalEntryByCoachee
} from "@screens/coaching-journal";
import {feedTimelineMain, newPost} from "@screens/feed";
import {settings, myAccount, myAccountVerifyOTP, changePassword, changePhone, notification} from "@screens/settings";
import {notifications} from "@screens/notification";
import {homepage} from "@screens/homepage";
import {createProfile} from "@screens";
import {JournalEntryType} from "@screens/coaching-journal/new-journal-entry";
import { FeedItemType } from "@screens/homepage/components/feed-homepage-component";

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
    name: 'myAccountVerifyOTP',
    component: myAccountVerifyOTP,
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
  {
    name: 'feedTimelineMain',
    component: feedTimelineMain,
  },
  {
    name: 'newPost',
    component: newPost,
  },
];

export type NavigatorParamList = {
  coachingJournalMain: undefined;
  feedTimelineMain: {
    listFeeds: FeedItemType[]
  }
  settingsPage: undefined;
  myAccount:{
    newEmail?: string,
    newNickname?: string,
    photo?: string
  };
  myAccountVerifyOTP: {
    newEmail: string,
    newNickname: string
    photo?: string
  };
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
    journalId: string,
    isCoachee: boolean
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
  };
  newPost: undefined
};

export default screens
