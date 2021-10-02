import {AppRoute} from "@navigators/navigation-type";
import {coachingJournalMain} from "@screens/coaching-journal";
import {settings, myAccount, changePassword, changePhone} from "@screens/settings";

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
  {
    name: 'changePassword',
    component: changePassword,
  },
  {
    name: 'changePhone',
    component: changePhone,
  },
];

export type NavigatorParamList = {
  coachingJournalMain: undefined;
  settingsPage: undefined;
  myAccount: undefined;
  changePhone: undefined;
  changePassword: undefined;
};

export default screens
