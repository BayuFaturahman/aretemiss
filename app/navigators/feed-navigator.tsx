import {AppRoute} from "@navigators/navigation-type";
import {
    newPost,
    feedTimelineMain,
    feedGuideline,
} from "@screens/feed";
import {settings, myAccount, myAccountVerifyOTP, changePassword, changePhone, notification} from "@screens/settings";
import {notifications} from "@screens/notification";
import {homepage} from "@screens/homepage";
import {createProfile} from "@screens";
import {JournalEntryType} from "@screens/coaching-journal/new-journal-entry";

const screens: AppRoute[] = [
  {
    name: 'newPost',
    component: newPost,
  },
  {
    name: 'feedTimelineMain',
    component: feedTimelineMain,
  },
  {
    name: 'feedGuideline',
    component: feedGuideline,
  }
];

export type NavigatorParamList = {
  newPost: undefined;
  feedTimelineMain: {
    newPost?: boolean
  };
};

export default screens
