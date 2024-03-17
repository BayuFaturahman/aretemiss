import {AppRoute} from "@navigators/navigation-type";
import CreateEvent, { createEventForm } from "@screens/event/create-event";
import PreviewEvent from "@screens/event/preview-event";
import { homepage } from "@screens/homepage";

const screens: AppRoute[] = [
  {
    name: 'createEvent',
    component: CreateEvent,
  },
  {
    name: 'previewEvent',
    component: PreviewEvent,
  },
  {
    name: "homepage",
    component: homepage,
  },
];

export type NavigatorParamList = {
    createEvent: undefined;
    previewEvent: { data: createEventForm };
    homepage: undefined
};

export default screens
