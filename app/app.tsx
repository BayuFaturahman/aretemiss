/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
// import "./i18n"
import "./utils/ignore-warnings"
import React, { useState, useEffect } from "react"
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context"
import { initFonts } from "./theme/fonts" // expo
import * as storage from "./utils/storage"
import {useBackButtonHandler, AppNavigator, canExit, useNavigationPersistence, navigate} from "./navigators"
// import { RootStore, RootStoreProvider, setupRootStore } from "./models"
import { ToggleStorybook } from "../storybook/toggle-storybook"
import { ErrorBoundary } from "./screens/error/error-boundary"
import {useNavigation} from "@react-navigation/native";

import {StoreProvider} from "./bootstrap/context.boostrap";
import RootStore from "./bootstrap/store.bootstrap";
import {setupRootStore} from "./store/setup-store";
import {requestUserPermissionForNotification} from "@utils";

import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification, {Importance} from "react-native-push-notification";

import messaging from '@react-native-firebase/messaging';
import {Alert} from "react-native";

// This puts screens in a native ViewController or Activity. If you want fully native
// stack navigation, use `createNativeStackNavigator` in place of `createStackNavigator`:
// https://github.com/kmagiera/react-native-screens#using-native-stack-navigator

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

/**
 * This is the root component of our app.
 */
function App() {
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)

  useBackButtonHandler(canExit)
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  // Kick off initial async loading actions, like loading fonts and RootStore
  useEffect(() => {
    ;(async () => {
      await initFonts() // expo
      setupRootStore().then(setRootStore)
    })()

    requestUserPermissionForNotification();;

    messaging().onMessage((message => {
      console.log("onMessage")
      console.log(message)
      Alert.alert(
        message.notification.title,
        message.notification.body,
        [
          // {
          //   text: "Cancel",
          //   onPress: () => console.log("Cancel Pressed"),
          //   style: "cancel"
          // },
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
    }))
  }, [])

  if (__DEV__) {
    // eslint-disable-next-line global-require
    const DevMenu = require('react-native-dev-menu');
    DevMenu.addItem('Notification List Screen', () => {
      navigate('notificationList');
    });
  }

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (!rootStore || !isNavigationStateRestored) return null

  // otherwise, we're ready to render the app
  return (
    // <ToggleStorybook>
      <StoreProvider store={rootStore}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <ErrorBoundary catchErrors={"always"}>
            <AppNavigator
              initialState={initialNavigationState}
              onStateChange={onNavigationStateChange}
            />
          </ErrorBoundary>
        </SafeAreaProvider>
      </StoreProvider>
    // </ToggleStorybook>
  )
}

export default App
