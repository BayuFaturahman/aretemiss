import React, {FC, useCallback, useEffect, useState,} from "react"
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

import { useStores } from "../../bootstrap/context.boostrap"

import {dimensions} from "@config/platform.config";


export type ProfileUpdateForm = {
  fullname: string
  nickname: string
  email: string
  team1Id: string
  team2Id: string
  team3Id: string
  isAllowNotification?: number
  isAllowReminderNotification?: number
}


const MyAccount: FC<StackScreenProps<NavigatorParamList, "myAccount">> = observer(
  ({ navigation }) => {

    const { authStore, mainStore } = useStores();

    console.log('ATAs ', mainStore.userProfile)

    const userProfile: ProfileUpdateForm = {
      fullname: mainStore.userProfile.fullName,
      nickname: mainStore.userProfile.nickName,
      email: mainStore.userProfile.email,
      team1Id: mainStore.userProfile.team1Id,
      team2Id: mainStore.userProfile.team2Id,
      team3Id: mainStore.userProfile.team3Id,
      isAllowNotification: mainStore.userProfile.isAllowNotification,
      isAllowReminderNotification: mainStore.userProfile.isAllowReminderNotification,
    }

    console.log('USER PROFILE', userProfile)

    
    const submitUpdateNotification = useCallback(async (data: ProfileUpdateForm) => {
      console.log('dalam submit ', data)
      await mainStore.updateProfile(authStore.userId, data)
      await mainStore.setProfile()
    }, [])
    
    const goBack = () => {
      submitUpdateNotification(userProfile)
      navigation.goBack()

    }

    const [isNotificationEnabled, setIsNotificationEnabled] = useState(userProfile.isAllowNotification===1 ? true: false);
    const toggleSwitchIsNotificationEnabled = () => {
      console.log('before: ', isNotificationEnabled)
      setIsNotificationEnabled(previousState => !previousState)
      // submitUpdateNotification(userProfile)
    }
   
    

    const [isNotificationReminderEnabled, setIsNotificationReminderEnabled] = useState(userProfile.isAllowReminderNotification === 1 ? true: false);
    const toggleSwitchIsNotificationReminderEnabled = () => {
      setIsNotificationReminderEnabled(previousState => !previousState);
      console.log(isNotificationReminderEnabled)
    }

   
    useEffect(() => {
      console.log('dalem use effect ', isNotificationEnabled)
      userProfile['isAllowNotification'] = isNotificationEnabled ? 1:0;
      userProfile['isAllowReminderNotification'] = isNotificationReminderEnabled ? 1:0;
      console.log(userProfile)
      // submitUpdateNotification(userProfile);
    },[isNotificationEnabled, isNotificationReminderEnabled])

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
