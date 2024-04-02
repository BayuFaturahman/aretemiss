import {AppRoute} from "@navigators/navigation-type";
import { NavigationProp } from "@react-navigation/native";
import CreateEvent, { createEventForm } from "@screens/event/create-event";
import EventCreated from "@screens/event/event-created";
import EventDetail from "@screens/event/event-detail";
import EventMain from "@screens/event/event-main";
import EventPreview from "@screens/event/event-preview";
import { homepage } from "@screens/homepage";

const screens: AppRoute[] = [
  {
    name: "homepage",
    component: homepage,
  },
  {
    name: 'createEvent',
    component: CreateEvent,
  },
  {
    name: 'eventPreview',
    component: EventPreview,
  },
  {
    name: "eventCreated",
    component: EventCreated,
  },
  {
    name: "eventMain",
    component: EventMain,
  },
  {
    name: "eventDetail",
    component: EventDetail,
  },
];

export type NavigatorParamList = {
  homepage: undefined
  createEvent: undefined;
  eventPreview: undefined;  
  eventCreated: undefined;  
  eventMain: {
    triggerRefresh?: boolean
  };
  eventDetail: {
    id: string
  };
};

export type StackNavigation = NavigationProp<NavigatorParamList>;

export default screens
