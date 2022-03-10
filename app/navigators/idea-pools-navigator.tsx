import {AppRoute} from "@navigators/navigation-type";
import newBrainstormsGroup from "@screens/brainstorm/new-brainstorms-group";


const screens: AppRoute[] = [
  {
    name: 'newBrainstormsGroup',
    component: newBrainstormsGroup,
  }
];

export type NavigatorParamList = {
  newBrainstormsGroup: undefined;
};

export default screens
