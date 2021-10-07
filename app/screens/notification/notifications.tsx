import React, {FC, useCallback, } from "react"
import { SafeAreaView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  Text,
  BackNavigation, Button
} from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import {VStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {Colors, Layout, Spacing} from "@styles";

import {useStores} from "@models";

const Notifications: FC<StackScreenProps<NavigatorParamList, "notificationList">> = observer(
  ({ navigation }) => {

    const { authStore } = useStores()

    const goBack = () => navigation.goBack()

    const goToMyAccount = () => navigation.navigate('myAccount')

    const logout = useCallback( ()=>{
      authStore.resetAuthStore()
    }, [])

    return (
      <VStack testID="CoachingJournalMain" style={{backgroundColor: Colors.UNDERTONE_BLUE, flex: 1, justifyContent: 'center'}}>
        <SafeAreaView style={Layout.flex}>
          <BackNavigation goBack={goBack} />
          <VStack top={Spacing[8]} horizontal={Spacing[24]} bottom={Spacing[12]}>
            <Spacer height={Spacing[24]} />
            <Text type={'header'} style={{color: Colors.WHITE, fontSize: Spacing[16]}} text="Notifications" />
            <Spacer height={Spacing[32]} />
          </VStack>
          <VStack top={Spacing[32]} horizontal={Spacing[24]} style={[Layout.heightFull, {backgroundColor: Colors.WHITE, borderTopStartRadius: Spacing[48], borderTopEndRadius: Spacing[48]}]}>

            <Spacer height={Spacing[12]} />

          </VStack>
        </SafeAreaView>
      </VStack>
    )
  },
)

export default Notifications;
