import {AppRoute} from "@navigators/navigation-type";
import { brainstorms, brainstormGroupList, newBrainstormsGroup, addIdea } from "@screens/brainstorm";

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
  {
    name: "addIdea",
    component: addIdea,
  },
  {
    name: "sendEmail",
    component: brainstorms,
  },
];

export type NavigatorParamList = {
  brainstormGroupList: undefined,
  newBrainstormsGroup: undefined,
  brainstorms: {
    groupId: string
  }
  addIdea: {
    isView: boolean
    groupId?: string
    ideaId?: string
  },
  sendEmail: undefined,
};

export default screens
