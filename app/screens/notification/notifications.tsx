import React, {FC, useCallback, useState,} from "react"
import {FlatList, SafeAreaView} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  Text,
  BackNavigation, Button
} from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import {HStack, VStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {Colors, Layout, Spacing} from "@styles";

import {useStores} from "@models";
import {EmptyList} from "@screens/coaching-journal/components/empty-list";
import {CoachingJournalItemRender} from "@screens/coaching-journal/components/coaching-journal-item-render";
import {ActivitiesTypeLegends} from "@screens/coaching-journal/components/activities-type-legends";
import FastImage from "react-native-fast-image";
import logoBottom from "@assets/icons/ilead-bottom-logo.png";

import nullProfileIcon from "@assets/icons/settings/null-profile-picture.png";

type NotificationItemType = {
  id: string
  type: 'tagged' | 'liked' | 'comment' | 'feedback'
  isNew: boolean
  user: {
    name: string
    avatar: string
  }
  session: string
}

const EXAMPLE_NOTIFICATION_DATA:Array<NotificationItemType> = [
  {
    id: '0',
    type: 'feedback',
    isNew: true,
    user: {
      name: 'Agus SUrya Pradana',
      avatar: ''
    },
    session: 'Weekly Coaching'
  },
  {
    id: '1',
    type: 'feedback',
    isNew: true,
    user: {
      name: 'Dewi Permata Kurnia',
      avatar: ''
    },
    session: 'Coffee Time'
  },
  {
    id: '2',
    type: 'comment',
    isNew: false,
    user: {
      name: 'Agus SUrya Pradana',
      avatar: ''
    },
    session: ''
  },
  {
    id: '3',
    type: 'tagged',
    isNew: false,
    user: {
      name: 'Joni',
      avatar: ''
    },
    session: 'Weekly Coaching #2.'
  },
  {
    id: '4',
    type: 'liked',
    isNew: false,
    user: {
      name: 'Intan Permata',
      avatar: ''
    },
    session: ''
  },
  {
    id: '5',
    type: 'tagged',
    isNew: false,
    user: {
      name: 'Indrawan Kresna',
      avatar: ''
    },
    session: 'Weekly Coaching #1.'
  },
]

const Notifications: FC<StackScreenProps<NavigatorParamList, "notificationList">> = observer(
  ({ navigation }) => {

    const [notificationsData, setNotificationsData] = useState<Array<NotificationItemType>>(EXAMPLE_NOTIFICATION_DATA);

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
            <FlatList
              ItemSeparatorComponent={()=><Spacer height={Spacing[24]} />}
              data={notificationsData}
              ListEmptyComponent={()=>
                <EmptyList />
              }
              renderItem={({item, index})=> {
                return(
                  <HStack>
                    <FastImage style={{
                      height: Spacing[32],
                      width: Spacing[32]
                    }} source={nullProfileIcon} resizeMode={"cover"}/>
                    <Text type={'body-bold'} style={{ fontSize: Spacing[16]}} text="Notifications" />
                  </HStack>
                )
              }}
              keyExtractor={item => item.id}
            />
          </VStack>
        </SafeAreaView>
      </VStack>
    )
  },
)

export default Notifications;
