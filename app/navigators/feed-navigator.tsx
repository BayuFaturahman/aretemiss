import {AppRoute} from "@navigators/navigation-type";
import {
    newPost,
    feedTimelineMain,
    feedGuideline,
} from "@screens/feed";

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
