import { CommonActions } from '@react-navigation/native';
let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    CommonActions.navigate({
      routeName,
      params,
    })
  );
}

function resetNavigation(routeName) { 
  _navigator.dispatch(
    CommonActions.reset({
      index: 0,
      routes:  [{ name: routeName }],
    })
  );
}
// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
  resetNavigation
};