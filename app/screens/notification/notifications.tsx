import React, {FC, useCallback, useEffect, useState,} from "react"
import {FlatList, RefreshControl, SafeAreaView, TouchableOpacity, View} from "react-native"
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

import { useStores } from "../../bootstrap/context.boostrap"
import {EmptyList} from "@screens/notification/components/empty-list";
import FastImage from "react-native-fast-image";

import nullProfileIcon from "@assets/icons/settings/null-profile-picture.png";
import {dimensions} from "@config/platform.config";
import {NotificationItem} from "../../store/store.notification";

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
      name: 'Agus Surya Pradana',
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
      name: 'Agus Surya Pradana',
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

const Homepage: FC<StackScreenProps<NavigatorParamList, "notificationList">> = observer(
  ({ navigation }) => {

    const [notificationsData, setNotificationsData] = useState<Array<NotificationItem>>([]);
    // const [notificationsData, setNotificationsData] = useState<Array<NotificationItemType>>([]);

    const {notificationStore, coachingStore, mainStore} = useStores()


    const goBack = () => navigation.goBack()

    const onRefresh = React.useCallback(async() => {
      setNotificationsData([])
      await notificationStore.getListNotifications()
    }, []);

    useEffect(()=>{
      onRefresh()
    },[])

    const goToFeedback = useCallback((id)=>{
      coachingStore.isDetailJournal(true)
      coachingStore.setDetailID(id)
      navigation.navigate("fillFeedbackDetail")
      console.log(id)
    }, [])

    const goToNoteFeedback = (authorId, journalId) => {
      coachingStore.isDetailJournal(true)
      const detailCoaching = authorId === mainStore.userProfile.user_id
      coachingStore.setDetailCoaching(detailCoaching)
      coachingStore.setDetailID(journalId)
      coachingStore.setFormCoach(false)
      console.log('goToNoteFeedback journalId', journalId)
      console.log('goToNoteFeedback authorId', authorId)
      console.log('goToNoteFeedback user_id', mainStore.userProfile.user_id)

      navigation.navigate("overviewJournalEntry", {
        journalId: journalId,
        isCoachee: true
      })
    }

    useEffect(()=>{
      if(notificationStore.notificationsList){
        setNotificationsData(notificationStore.notificationsList)
      }
    },[notificationStore.notificationsList, notificationStore.getNotificationsSuccess])

    return (
      <VStack testID="CoachingJournalMain" style={{backgroundColor: Colors.UNDERTONE_BLUE, flex: 1, justifyContent: 'center'}}>
        <SafeAreaView style={Layout.flex}>
          <BackNavigation goBack={goBack} />
          <VStack top={Spacing[8]} horizontal={Spacing[24]} bottom={Spacing[12]}>
            <Spacer height={Spacing[24]} />
            <Text type={'header'} style={{color: Colors.WHITE, fontSize: Spacing[16]}} text="Notifications" />
            <Spacer height={Spacing[32]} />
          </VStack>
          <VStack top={Spacing[12]} horizontal={Spacing[24]} style={[Layout.heightFull, {flex: 1, backgroundColor: Colors.WHITE, borderTopStartRadius: Spacing[48], borderTopEndRadius: Spacing[48]}]}>
            <Spacer height={Spacing[12]} />
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={notificationStore.isLoading}
                  onRefresh={onRefresh}
                  tintColor={Colors.MAIN_RED}
                />
              }
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={()=><Spacer height={Spacing[24]} />}
              data={notificationsData}
              ListEmptyComponent={()=>
                <EmptyList navigateTo={goBack} />
              }
              renderItem={({item, index})=> {
                return(
                  <HStack vertical={Spacing[2]} horizontal={Spacing[8]}>
                    <VStack>
                      {/* {item.isNew === true ? <View style={{backgroundColor: Colors.MAIN_RED, height: Spacing[12], width: Spacing[12], borderRadius: 999, position: 'absolute', zIndex: 100, left: -Spacing[4]}} /> : null} */}
                      <Spacer height={Spacing[4]}/>
                      <FastImage style={{
                        height: Spacing[48],
                        width: Spacing[48],
                        borderRadius: Spacing[8]
                      }} source={item.authorPhoto === '' ? nullProfileIcon : {uri: item.authorPhoto}} resizeMode={"cover"}/>
                      <Spacer/>
                    </VStack>
                    <HStack left={Spacing[12]} style={{maxWidth: dimensions.screenWidth - Spacing["128"]}}>
                      {item.type === 'request_feedback' ?
                        <VStack>
                          <Text type={'body'}>
                            <Text type={'body-bold'} text={`${item.content} `} />
                          </Text>
                          <Spacer height={Spacing[4]} />
                          <VStack right={Spacing[48]}>
                            <Button
                              type={"primary"}
                              text={"Isi feedback untuknya."}
                              style={{height:Spacing[32], backgroundColor: Colors.MAIN_RED}}
                              textStyle={{fontSize: Spacing[14], lineHeight: Spacing[18]}}
                              onPress={()=>{
                                goToNoteFeedback(item.authorId, item.data.journalId)}
                              }
                            />
                          </VStack>
                        </VStack> : null }
                      {item.type === 'submitted_feedback' ?
                        <VStack>
                          <Text type={'body'}>
                            <Text type={'body-bold'} text={`${item.content} `} />
                          </Text>
                          <Spacer height={Spacing[4]} />
                          <VStack right={Spacing[48]}>
                             <Button
                              type={"primary"}
                              text={"Lihat feedback di sini."}
                              style={{height:Spacing[32]}}
                              textStyle={{fontSize: Spacing[14], lineHeight: Spacing[18]}}
                              onPress={()=>{
                                goToFeedback(item.data.journalId)}
                              }
                             />
                          </VStack>
                        </VStack> : null }
                      {item.type === 'tagged' ?
                        <VStack>
                          <Text type={'body'}>
                            <Text type={'body-bold'} text={`${item.user.name} `} />
                            telah menandaimu dalam sesi
                            <Text type={'body-bold'} text={` ${item.session}`} />
                          </Text>
                          <Spacer height={Spacing[4]} />
                          <VStack right={Spacing[48]}>
                            <Button
                              type={"primary"}
                              text={"Isi feedback untuknya."}
                              style={{height:Spacing[32], backgroundColor: Colors.MAIN_RED}}
                              textStyle={{fontSize: Spacing[14], lineHeight: Spacing[18]}}
                            />
                          </VStack>
                        </VStack> : null }
                      {item.type === 'liked' ?
                        <VStack>
                          <Text type={'body-bold'}>
                            <Text type={'body-bold'} text={`${item.user.name} `} />
                            menyukai post Feed-mu!
                          </Text>
                          <Spacer height={Spacing[4]} />
                        </VStack> : null }
                    </HStack>
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

export default Homepage;
