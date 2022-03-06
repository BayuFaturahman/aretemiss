import {AppRoute} from "@navigators/navigation-type";
import NewBrainstormingGroup from "@screens/idea-pools/new-brainstorming-group";


const screens: AppRoute[] = [
  {
    name: 'newBrainstormingGroup',
    component: NewBrainstormingGroup,
  }
];

export type NavigatorParamList = {
  newBrainstormingGroup: undefined;
};

export default screens
