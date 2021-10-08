import React, {FC, useState,} from "react"
import {SafeAreaView} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  Text,
  BackNavigation, Switch
} from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import {HStack, VStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {Colors, Layout, Spacing} from "@styles";

import {dimensions} from "@config/platform.config";


const MyAccount: FC<StackScreenProps<NavigatorParamList, "myAccount">> = observer(
  ({ navigation }) => {

    const goBack = () => navigation.goBack()

    const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
    const toggleSwitchIsNotificationEnabled = () => setIsNotificationEnabled(previousState => !previousState);

    const [isNotificationReminderEnabled, setIsNotificationReminderEnabled] = useState(false);
    const toggleSwitchIsNotificationReminderEnabled = () => setIsNotificationReminderEnabled(previousState => !previousState);

    return (
      <VStack testID="CoachingJournalMain" style={{backgroundColor: Colors.UNDERTONE_BLUE, flex: 1, justifyContent: 'center'}}>
        <SafeAreaView style={Layout.flex}>
          <BackNavigation goBack={goBack} />
          <VStack top={Spacing[8]} horizontal={Spacing[24]} bottom={Spacing[12]}>
            <Spacer height={Spacing[24]} />
            <Text type={'header'} style={{color: Colors.WHITE, fontSize: Spacing[16]}} text="Notifications" />
            <Spacer height={Spacing[32]} />
          </VStack>
            <VStack top={Spacing[32]} horizontal={Spacing[24]} style={{flex:1, backgroundColor: Colors.WHITE, borderTopStartRadius: Spacing[48], borderTopEndRadius: Spacing[48]}}>
              <HStack top={Spacing[24]}>
                <Text type={'body-bold'} style={{maxWidth: (dimensions.screenWidth / 5 ) * 3}} numberOfLines={2} text="Izinkan iLEAD untuk memberikan notifikasi." />
                <Spacer />
                <Switch
                  value={isNotificationEnabled}
                  onToggle={toggleSwitchIsNotificationEnabled}
                  thumbOnStyle={{backgroundColor: Colors.BRIGHT_BLUE}}
                  trackOnStyle={{backgroundColor: Colors.UNDERTONE_BLUE}}
                  style={{borderColor: Colors.WHITE}}
                />
              </HStack>
              <HStack top={Spacing[24]}>
                <Text type={'body-bold'} style={{maxWidth: (dimensions.screenWidth / 5 ) * 3}} numberOfLines={2} text="Ingatkan saya untuk notifikasi yang sama." />
                <Spacer />
                <Switch
                  value={isNotificationReminderEnabled}
                  onToggle={toggleSwitchIsNotificationReminderEnabled}
                  thumbOnStyle={{backgroundColor: Colors.BRIGHT_BLUE}}
                  trackOnStyle={{backgroundColor: Colors.UNDERTONE_BLUE}}
                  style={{borderColor: Colors.WHITE}}
                />
              </HStack>
            </VStack>
        </SafeAreaView>
      </VStack>
    )
  },
)

export default MyAccount;
