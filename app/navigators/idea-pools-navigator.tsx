import {AppRoute} from "@navigators/navigation-type";
import { brainstorms, brainstormGroupList, newBrainstormsGroup } from "@screens/brainstorm";

const screens: AppRoute[] = [
  {
    name: 'brainstormGroupList',
    component: brainstormGroupList,
  },
  {
    name: 'newBrainstormsGroup',
    component: newBrainstormsGroup,
  },
  {
    name: "brainstorms",
    component: brainstorms,
  },
];

export type NavigatorParamList = {
  brainstormGroupList: undefined,
  newBrainstormsGroup: undefined,
  brainstorms: {
    groupId: string
  }
};

export default screens
