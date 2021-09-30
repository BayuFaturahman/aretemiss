import {AppRoute} from "@navigators/navigation-type";
import {coachingJournalMain} from "@screens/coaching-journal";
import Settings from "@screens/settings/settings";

const screens: AppRoute[] = [
  {
    name: 'coachingJournalMain',
    component: coachingJournalMain,
  },
  {
    name: 'settingsPage',
    component: Settings,
  },
];

export type NavigatorParamList = {
  coachingJournalMain: undefined;
  settingsPage: undefined;
};

export default screens
