import {AppRoute} from "@navigators/navigation-type";
import brainstormGroupList from '@screens/brainstorm/brainstorm-group-list';
import newBrainstormsGroup from "@screens/brainstorm/new-brainstorms-group";


const screens: AppRoute[] = [
  {
    name: 'brainstormGroupList',
    component: brainstormGroupList,
  },
  {
    name: 'newBrainstormsGroup',
    component: newBrainstormsGroup,
  }
];

export type NavigatorParamList = {
  brainstormGroupList: undefined,
  newBrainstormsGroup: undefined;
};

export default screens
