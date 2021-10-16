/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import React, {FunctionComponent, useEffect, useState} from "react"
import {StatusBar, useColorScheme} from "react-native"
import {NavigationContainer, DefaultTheme, DarkTheme, useNavigation} from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { navigationRef } from "./navigation-utilities"

import authScreens, { NavigatorParamList as AuthNavigatorParamList} from "@navigators/auth-navigator";

import mainScreens, { NavigatorParamList as MainNavigatorParamList } from "@navigators/main-navigator";
// import {useStores} from "@models";
import {observer} from "mobx-react-lite";
import {useStores} from "../bootstrap/context.boostrap";

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

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const AuthStack = createNativeStackNavigator<AuthNavigatorParamList>()

const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
      initialRouteName="landingPage"
    >
      {authScreens.map((route)=>{
        return(
          <AuthStack.Screen
            key={route.name}
            name={route.name}
            component={route.component as FunctionComponent<unknown>}
            options={{headerShown: false, gestureEnabled: true}} />
        )
      })}
    </AuthStack.Navigator>
  )
}

const MainStack = createNativeStackNavigator<MainNavigatorParamList>()

const MainNavigator: React.FC = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="homepage"
    >
      {mainScreens.map((route)=>{
        return(
          <MainStack.Screen
            key={route.name}
            name={route.name}
            component={route.component as FunctionComponent<unknown>}
            options={{headerShown: false}} />
        )
      })}
    </MainStack.Navigator>
  )
}

interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer( (props: NavigationProps) => {
  const colorScheme = useColorScheme()

  const [isLogin, setIsLogin] = useState(false)

  const { serviceStore } = useStores()

  useEffect(()=>{
    if(serviceStore.accessToken){
      setIsLogin(true)
    } else if (serviceStore.accessToken === ''){
      setIsLogin(false)
    }
  },[serviceStore.rehydrated, serviceStore.accessToken])


  if (__DEV__) {
    // eslint-disable-next-line global-require
    const DevMenu = require('react-native-dev-menu');

    DevMenu.addItem('Force Login true', () => {
      setIsLogin(true)
    });

    DevMenu.addItem('Force Login false', () => {
      setIsLogin(false)
    });
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <StatusBar
        barStyle="dark-content"
        // translucent
        backgroundColor="white"
      />
      {isLogin === true ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  )
}, )

AppNavigator.displayName = "AppNavigator"

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ["welcome"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
