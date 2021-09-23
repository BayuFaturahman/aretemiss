/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {AppRoute} from "@navigators/navigation-type";
import {login, verifyPhone, verifyOTP, createProfile, landingPage, forgotPassword} from "@screens/auth";

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */


const screens: AppRoute[] = [
  {
    name: 'login',
    component: login,
  },
  {
    name: 'verifyPhone',
    component: verifyPhone,
  },
  {
    name: 'verifyOTP',
    component: verifyOTP,
  },
  {
    name: 'createProfile',
    component: createProfile,
  },
  {
    name: 'landingPage',
    component: landingPage,
  },
  {
    name: 'forgotPassword',
    component: forgotPassword,
  },
];

export type NavigatorParamList = {
  login: undefined;
  verifyPhone: undefined;
  verifyOTP: undefined;
  createProfile: undefined;
  landingPage: undefined;
  forgotPassword: undefined
};

export default screens
