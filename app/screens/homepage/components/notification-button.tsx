import React from "react";
import {VStack} from "@components/view-stack";
import {Colors, Spacing} from "@styles";
import {TouchableOpacity, View} from "react-native";
import {Bell} from "@assets/svgs";


export const NotificationButton = ({goToNotifications = () => null, isNewNotification = true}) => {
  return(
    <TouchableOpacity onPress={goToNotifications}>
      {isNewNotification === true ? <View style={{backgroundColor: Colors.MAIN_RED, height: Spacing[12], width: Spacing[12], borderRadius: 999, position: 'absolute', zIndex: 100}} /> : null}
      <VStack style={{backgroundColor: Colors.WHITE, height: Spacing[48], width: Spacing[48], borderRadius: 999, alignItems: 'center', justifyContent: 'center'}}>
        <Bell height={Spacing[32]} width={Spacing[32]} />
      </VStack>
    </TouchableOpacity>
  )
}
