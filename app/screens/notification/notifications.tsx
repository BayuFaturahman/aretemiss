import React, {FC, useCallback, useEffect, useState,} from "react"
import {ActivityIndicator, FlatList, ImageBackground, RefreshControl, SafeAreaView, View} from "react-native"
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
import {FeedItemType} from "@screens/feed/feed.type";
import {backgroundColor} from "react-native-calendars/src/style";
import {images} from "@assets/images";

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

    const {notificationStore, coachingStore, mainStore, feedStore} = useStores()

    const goBack = () => navigation.goBack()

    const [currentPage, setCurrentPage] = useState<number>(2);

    const onLoadMore = React.useCallback(async () => {
      await notificationStore.getListNotifications(currentPage)
      setCurrentPage(currentPage + 1)
    }, [currentPage]);

    const onRefresh = React.useCallback(async() => {
      setNotificationsData([])
      setCurrentPage(2)
      notificationStore.clearListNotifications()
      await notificationStore.getListNotifications()
    }, []);

    useEffect(()=>{
      onRefresh()
    },[])

    const goToFeedback = useCallback((id)=>{
      coachingStore.isDetailJournal(true)
      coachingStore.setDetailID(id)
      navigation.navigate("fillFeedbackDetail")
    }, [])

    const goToNoteFeedback = (authorId, journalId) => {
      coachingStore.isDetailJournal(true)
      const detailCoaching = authorId === mainStore.userProfile.user_id
      coachingStore.setDetailCoaching(detailCoaching)
      coachingStore.setDetailID(journalId)
      coachingStore.setFormCoach(false)
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

    const goToPostDetail = useCallback(async (feedId: string) => {
      await feedStore.getPostDetail(feedId)
      if (feedStore.postDetail !== null) {
        goToDetails(feedStore.postDetail)
      }
    },[feedStore.getPostDetailSuccess, feedStore.postDetail])

    const goToDetails = async (data: FeedItemType) => {
      navigation.navigate("postDetails", {
        data,
        isFromMainFeed: false
      })
    }

    return (
      <VStack testID="CoachingJournalMain" style={{backgroundColor: Colors.ABM_MAIN_BLUE, flex: 1, justifyContent: 'center'}}>
        <View style={Layout.flex}>
          <FlatList
            style={{backgroundColor: Colors.WHITE}}
            ItemSeparatorComponent={()=> <VStack style={{backgroundColor: Colors.WHITE}}><Spacer height={Spacing[32]} /></VStack>}
            ListHeaderComponent={
              <VStack top={Spacing[32]} style={{backgroundColor: Colors.ABM_MAIN_BLUE}}>
                <ImageBackground source={images.bgPattern} style={{width: '100%'}} resizeMode={"cover"}>
                  <BackNavigation goBack={goBack} />
                  <VStack top={Spacing[8]} horizontal={Spacing[24]} bottom={Spacing[12]}>
                    <Spacer height={Spacing[24]} />
                    <Text type={'header'} style={{color: Colors.WHITE, fontSize: Spacing[16]}} text="Notifications" />
                    <Spacer height={Spacing[32]} />
                  </VStack>
                  <VStack style={{backgroundColor: Colors.WHITE, borderTopStartRadius: Spacing[32], borderTopEndRadius: Spacing[32], height:Spacing[48], width: dimensions.screenWidth, bottom: -1}}/>
                </ImageBackground>
              </VStack>
            }
            refreshControl={
              <RefreshControl
                refreshing={notificationStore.isLoading}
                onRefresh={onRefresh}
                tintColor={Colors.MAIN_RED}
              />
            }
            showsVerticalScrollIndicator={false}
            data={notificationsData}
            ListEmptyComponent={()=>
              <EmptyList navigateTo={goBack} />
            }
            renderItem={({item, index})=> {
              return(
                <HStack horizontal={Spacing[24]} style={{backgroundColor: Colors.WHITE}}>
                  <VStack>
                    {item.isNew === true ? <View style={{backgroundColor: Colors.MAIN_RED, height: Spacing[12], width: Spacing[12], borderRadius: 999, position: 'absolute', zIndex: 100, left: -Spacing[4]}} /> : null}
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
                     {item.type === 'submitted_comment' ?
                      <VStack>
                        <Text type={'body'}>
                          <Text type={'body-bold'} text={`${item.content} `} />
                        </Text>
                        <Spacer height={Spacing[4]} />
                        <VStack right={Spacing[48]}>
                          <Button
                            type={"primary"}
                            text={"Lihat postingan terkait."}
                            style={{height:Spacing[32]}}
                            textStyle={{fontSize: Spacing[14], lineHeight: Spacing[18]}}
                            onPress={()=>{
                              goToPostDetail(item.data.feedId)}
                            }
                          />
                        </VStack>
                      </VStack> : null }
                    {item.type === 'reaction_feed' ?
                      <VStack>
                        <Text type={'body'}>
                          <Text type={'body-bold'} text={`${item.content} `} />
                        </Text>
                        <Spacer height={Spacing[4]} />
                        <VStack right={Spacing[48]}>
                          <Button
                            type={"primary"}
                            text={"Lihat postingan terkait."}
                            style={{height:Spacing[32]}}
                            textStyle={{fontSize: Spacing[14], lineHeight: Spacing[18]}}
                            onPress={()=>{
                              goToPostDetail(item.data.feedId)}
                            }
                          />
                        </VStack>
                      </VStack> : null }
                    {/* {item.type === 'liked' ? */}
                    {/*  <VStack> */}
                    {/*    <Text type={'body-bold'}> */}
                    {/*      <Text type={'body-bold'} text={`${item.user.name} `} /> */}
                    {/*      menyukai post Feed-mu! */}
                    {/*    </Text> */}
                    {/*    <Spacer height={Spacing[4]} /> */}
                    {/*  </VStack> : null } */}
                  </HStack>
                </HStack>
              )
            }}
            keyExtractor={item => item.id}
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.1}
          />
        </View>
        {
          notificationStore.isLoading ?
            <VStack vertical={Spacing[12]} style={{position:'absolute',bottom: 0, width: dimensions.screenWidth}}>
              <ActivityIndicator
                animating={notificationStore.isLoading}
              />
            </VStack> : null
        }
      </VStack>
    )
  },
)

export default Homepage;
