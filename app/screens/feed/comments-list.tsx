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
import {debounce} from "lodash";

import nullProfileIcon from "@assets/icons/settings/null-profile-picture.png";
import {dimensions} from "@config/platform.config";
import { CommentNotificationType } from "./feed.type"

type CommentListItemData = {
  id: string
  type: 'comment' | 'replied'
  isNew: boolean
  user: {
    name: string
    avatar: string
  }
  content: string
  taggedUser?: string
}

const EXAMPLE_LIST_DATA:Array<CommentListItemData> = [
  {
    id: '0',
    type: 'comment',
    isNew: true,
    user: {
      name: 'Mr. Griffith Dew',
      avatar: ''
    },
    content : 'I never knew drinking coffee benefits this way! Great work, Iwan.'
  },
  {
    id: '1',
    type: 'comment',
    isNew: true,
    user: {
      name: 'Mr. Keanu Herbowo',
      avatar: ''
    },
    content : 'This is what I like to see! Starting a productive day with a cup of coffee with your mates. '
  },
  {
    id: '2',
    type: 'replied',
    isNew: true,
    user: {
      name: 'Ms. Layla Fathima',
      avatar: ''
    },
    content : 'Can I join your coffee meetings, Iwan? Haha!',
    taggedUser : '@Ridwan Manggala'
  },
  {
    id: '3',
    type: 'comment',
    isNew: false,
    user: {
      name: 'Mr. Keanu Herbowo',
      avatar: ''
    },
    content : 'This is what I like to see! Starting a productive day with a cup of coffee with your mates. '
  },
  {
    id: '4',
    type: 'replied',
    isNew: false,
    user: {
      name: 'Ms. Layla Fathima',
      avatar: ''
    },
    content : 'Can I join your coffee meetings, Iwan? Haha!',
    taggedUser : '@Ridwan Manggala'
  },
]

const CommentList: FC<StackScreenProps<NavigatorParamList, "commentList">> = observer(
  ({ navigation }) => {

    const { authStore, feedStore, mainStore } = useStores()

    const [commentsData, setCommentsData] = useState<Array<CommentNotificationType>>(feedStore.listCommentNotif);
    // const [notificationsData, setNotificationsData] = useState<Array<NotificationItemType>>([]);
    const [currentPage, setCurrentPage] = useState<number>(2);
    

    const goBack = () => navigation.goBack()

    const goToMyAccount = () => navigation.navigate('myAccount')

    const logout = useCallback( ()=>{
      authStore.resetAuthStore()
    }, [])


    const firstLoadCommentNotif = debounce( async () => {
      await feedStore.clearListCommentNotification()
      await loadCommentNotif(1)
    }, 500)

    const loadCommentNotif = useCallback(async (page: number) => {
      await feedStore.getListCommentNotification(mainStore.userProfile.user_id, page)
      setCommentsData(feedStore.listCommentNotif)
    }, [feedStore.getListCommentNotificationSuccess, feedStore.listCommentNotif])

    const onLoadMore = React.useCallback(async () => {
      console.log('load more comment notif ')
      await loadCommentNotif(currentPage)
      setCurrentPage(currentPage + 1)
    }, [currentPage]);

    const onRefresh = React.useCallback(async() => {
      console.log('On refresh main comment notif')
      firstLoadCommentNotif()
    }, []);

    useEffect(() => {
      console.log('Use effect list comment notif tanpa []')
      firstLoadCommentNotif()      
    }, [])

    return (
      <VStack testID="CoachingJournalMain" style={{backgroundColor: Colors.WHITE, flex: 1, justifyContent: 'center'}}>
        <SafeAreaView style={Layout.flex}>
          <BackNavigation goBack={goBack} color={Colors.UNDERTONE_BLUE} />
          <VStack horizontal={Spacing[24]} style={[Layout.heightFull, {flex: 1, backgroundColor: Colors.WHITE, borderTopStartRadius: Spacing[48], borderTopEndRadius: Spacing[48]}]}>
            <FlatList
               refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={onRefresh}
                  tintColor={Colors.MAIN_RED}
                />
              }
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={()=><Spacer height={Spacing[24]} />}
              data={commentsData}
              ListHeaderComponent={
                <VStack top={Spacing[4]} bottom={Spacing[20]}>
                  <Text type={'left-header'} style={{ fontSize: Spacing[16]}} text="Recent comments from others." />
                </VStack>
              }
              ListEmptyComponent={()=>
                <EmptyList navigateTo={goBack} />
              }
              renderItem={({item, index})=> {
                return(
                  <TouchableOpacity>
                    <HStack vertical={Spacing[2]} horizontal={Spacing[8]}>
                      <VStack>
                        <Spacer height={Spacing[4]}/>
                        <FastImage style={{
                          height: Spacing[24],
                          width: Spacing[24]
                        }} source={nullProfileIcon} resizeMode={"cover"}/>
                        <Spacer/>
                      </VStack>
                      <HStack left={Spacing[12]} style={{maxWidth: dimensions.screenWidth - Spacing["72"]}}>
                        {item.type === 'comment' ?
                          <VStack>
                            <Text type={'body'}>
                              <Text type={'body-bold'} text={`${item.author.fullName} `} />
                              meninggalkan komentar di post Feed-mu:
                            </Text>
                            <Spacer height={Spacing[4]} />
                          </VStack> : null }
                        {item.type === 'replied' ?
                          <VStack>
                            <Text type={'body'}>
                              <Text type={'body-bold'} text={`${item.author.fullName} `} />
                              replied to you on a comment:
                            </Text>
                            <Spacer height={Spacing[4]} />
                          </VStack> : null }
                      </HStack>
                    </HStack>
                    <HStack horizontal={Spacing[16]} vertical={Spacing[8]} style={{backgroundColor: Colors.GRAY200, borderRadius: Spacing[12], marginLeft: Spacing[32], marginRight: Spacing[8]}}>
                      {item.isNew === true ? <View style={{backgroundColor: Colors.MAIN_RED, height: Spacing[12], width: Spacing[12], borderRadius: 999, position: 'absolute', zIndex: 100, right: -Spacing[4], top: -Spacing[4]}} /> : null}
                      <VStack>
                        <Text type={'body'}>
                          {item.replyToNickname !== null? <Text type={'body-bold'} text={`${item.replyToNickname} `} /> : null}
                          {item.feedComment}
                        </Text>
                        <Spacer height={Spacing[4]} />
                      </VStack>
                    </HStack>
                  </TouchableOpacity>
                )
              }}
              keyExtractor={item => item.id}
              onEndReached={onLoadMore}
              onEndReachedThreshold={0.1}
            />
          </VStack>
        </SafeAreaView>
      </VStack>
    )
  },
)

export default CommentList;
