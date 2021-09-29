import {AppRoute} from "@navigators/navigation-type";
import {coachingJournalMain} from "@screens/coaching-journal";

const screens: AppRoute[] = [
  {
    name: 'coachingJournalMain',
    component: coachingJournalMain,
  },
];

export type NavigatorParamList = {
  coachingJournalMain: undefined;
};

export default screens
