import {AppRoute} from "@navigators/navigation-type";
import {coachingJournalMain} from "@screens/coaching-journal";
import {settings, myAccount} from "@screens/settings";

const screens: AppRoute[] = [
  {
    name: 'coachingJournalMain',
    component: coachingJournalMain,
  },
  {
    name: 'settingsPage',
    component: settings,
  },
  {
    name: 'myAccount',
    component: myAccount,
  },
];

export type NavigatorParamList = {
  coachingJournalMain: undefined;
  settingsPage: undefined;
  myAccount: undefined;
};

export default screens
