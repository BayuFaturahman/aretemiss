import React, {FC, useCallback, useState, useEffect} from "react"
import {SafeAreaView, ScrollView, TouchableOpacity, View, StatusBar, RefreshControl} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  Button,
  Text,
} from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import {HStack, VStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {Colors, Layout, Spacing} from "@styles";

import {CoachingJournalItemRender} from "@screens/coaching-journal/components/coaching-journal-item-render";
import FastImage from "react-native-fast-image";
import topLogo from "@assets/icons/home-top-bg.png";
import notificationBell from "@assets/icons/notification-bell.png";
import moment from 'moment'

import {dimensions} from "@config/platform.config";
import {CoachingJournalItem} from "@screens/coaching-journal/coaching-journal.type";
import { useStores } from "../../bootstrap/context.boostrap"

import nullProfileIcon from "@assets/icons/settings/null-profile-picture.png";
import downArrow from "@assets/icons/down-arrow.png";
import smileMood from "@assets/icons/mood/smile.png";
import settings from "@assets/icons/settings.png";
import surprised from "@assets/icons/homepage/surprised.png";
import sad from "@assets/icons/homepage/sad.png";
import {EmptyList} from "@screens/notification/components/empty-list";
import {NotificationButton} from "@screens/homepage/components/notification-button";
import {SettingsButton} from "@screens/homepage/components/settings-button";
import {HomepageCardWrapper} from "@screens/homepage/components/homepage-card-wrapper";
import {CoachingJournalComponent} from "@screens/homepage/components/coaching-journal-component";
import {FeedItemComponent, FeedItemType} from "@screens/homepage/components/feed-homepage-component";
import {MoodComponent, MoodItemType} from "@screens/homepage/components/mood-component";
import {HomepageErrorCard} from "@screens/homepage/components/homepage-error-card";
import DevMenu from "react-native-dev-menu";
import {navigate} from "@navigators";
import * as storage from "@utils/storage";

import RNAnimated from "react-native-animated-component";

const FEED_EXAMPLE_DATA_ITEM:FeedItemType = {
  id: '0',
  imageUrl: 'https://www.gstatic.com/webp/gallery/4.jpg',
  description: 'Today, I’m starting a new monthly task! I designed a new strategy to nudge my team members to be more active in our monthly meetings. ',
  author: {
    fullname: 'Mrs. Geneva Herrings',
    nickname: 'Geneva',
    title: 'Head of Accounting Dept.'
  },
  commentCount: 4,
  isNew: true,
  createdAt: '2021-09-24T10:39:39.000Z',
  updatedAt: '2021-09-24T10:39:39.000Z'
}

const MOOD_EXAMPLE_DATA:MoodItemType = {
  avatarUrl: 'https://www.gstatic.com/webp/gallery3/2.png',
  user: {
    name: 'Mr. Ridwan Manggala',
    title: 'Head of Sales Dept.'
  },
  moodType: 'happy'
}

const Homepage: FC<StackScreenProps<NavigatorParamList, "homepage">> = observer(
  ({ navigation }) => {

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
      }, 1000)
    }, []);

    const [coachingJournalData, setCoachingJournalData] = useState<CoachingJournalItem>({
      date: '02 AUG',
      activities: [
        {
          title: 'Weekly coaching with Agus Surya Pradana.',
          type: 'weekly_coaching',
          id: '1',
          isTagged: false
        },
        {
          title: 'Coffee time dengan semua anggota tim.',
          type: 'gathering',
          id: '2',
          isTagged: true
        },
      ]
    });
    const {mainStore} = useStores()

    if (__DEV__) {
      // eslint-disable-next-line global-require
      const DevMenu = require('react-native-dev-menu');
      // DevMenu.addItem('Reset all store', () => {
      //   profileStore.resetStore()
      //   authStore.resetStore()
      //   coachingStore.resetStore()
      //   storage.clear()
      //
      //   console.log(profileStore)
      //   console.log(authStore)
      //   console.log(coachingStore)
      // });

      DevMenu.addItem('Feedback Detail', () => {
        navigation.navigate('fillFeedbackDetail')
      });
    }

    const [selectedActivities, setSelectedActivities] = useState<string>('');
    const [isHomepageError, setHomepageError] = useState<boolean>(false);

    const holdActivitiesId = useCallback((selectedId)=>{
      setSelectedActivities(selectedId)
    }, [selectedActivities])

    const goToNote = useCallback((id)=>{
      console.log(id)
    }, [])

    const goToFeedback = useCallback((id)=>{
      console.log(id)
    }, [])

    const goToNoteFeedback = useCallback((id)=>{
      console.log(id)
    }, [])

    const getTeam = useCallback(async ()=>{
      await mainStore.getTeamList()
    },[])

    useEffect(() => {
      getTeam()
      // profileStore.getProfile()
      // coachingStore.getJournal()
    }, [])

    // const createList = async() => {
    //   const id = authStore.authUser.id
    //   let groupArrays = []
    //   const groups = coachingStore.journal.reduce((groups, journalData) => {
    //     const date = journalData.journal_created_at.split('T')[0];
    //        if (!groups[date]) {
    //         groups[date] = [];
    //        }
    //        groups[date].push(
    //          {
    //            ...journalData,
    //             title: journalData.journal_title,
    //             type: journalData.journal_type,
    //             id: journalData.jl_id,
    //             isTagged: id != journalData.coach_id
    //          }
    //        );
    //        return groups;
    //     }, {});
    //     groupArrays = Object.keys(groups).map((date) => {
    //        return {
    //        date: moment(date).format('DD MMM'),
    //        activities: groups[date]
    //        };
    //     });
    // }
    // useEffect(() => {
    //   createList()
    // }, [coachingStore.journal])
    //
    // useEffect(() => {
    //   const data = MOOD_EXAMPLE_DATA
    //   data.user.name = profileStore.profile && profileStore.profile[0] && profileStore.profile[0].user_fullname ? profileStore.profile[0].user_fullname : ''
    //   data.user.title = profileStore.profile && profileStore.profile[0] && profileStore.profile[0].team1_name ? profileStore.profile[0].team1_name : ''
    //   setMoodData(data)
    // }, [profileStore.profile])

    const [feedData, setFeedDAta] = useState<FeedItemType>(FEED_EXAMPLE_DATA_ITEM);

    const [moodData, setMoodData] = useState<MoodItemType>(MOOD_EXAMPLE_DATA);

    const goToNotifications = () => navigation.navigate('notificationList')

    const goToJournalCoaching = () => navigation.navigate('coachingJournalMain')

    const goToSettings = () => navigation.navigate("settingsPage")

    StatusBar.setBarStyle('light-content',false);

    const renderHomepage = () => {

      if(isHomepageError){
        return(
          <VStack top={dimensions.screenHeight / 2} horizontal={Spacing[12]}>
            <HomepageCardWrapper animationDuration={300}>
              <HomepageErrorCard navigateTo={onRefresh} />
            </HomepageCardWrapper>
          </VStack>
        )
      }

      return(
        <VStack top={Spacing[48]} horizontal={Spacing[8]} bottom={Spacing[12]}>
          <VStack horizontal={Spacing[12]}>
            <RNAnimated
              appearFrom="left"
              animationDuration={500}
            >
             <NotificationButton goToNotifications={goToNotifications} />
            </RNAnimated>
          </VStack>
          <Spacer height={Spacing[24]} />
          <RNAnimated
            appearFrom="right"
            animationDuration={700}
          >
            <VStack horizontal={Spacing[12]}>
              {/* <Text type={'right-header'} style={{color: Colors.WHITE, fontSize: Spacing[16]}} underlineWidth={Spacing[72]}>{`Hai, ${profileStore.profile && profileStore.profile[0] && profileStore.profile[0].user_fullname ? profileStore.profile[0].user_fullname : ''}`}</Text> */}
              <Text
                type={'right-header'}
                style={{color: Colors.WHITE, fontSize: Spacing[16]}}
                underlineWidth={Spacing[72]}>
                {`Hai, Iwan`}
              </Text>
            </VStack>
          </RNAnimated>

          <Spacer height={Spacing[32]} />

          <HomepageCardWrapper animationDuration={500}>
            <CoachingJournalComponent
              data={coachingJournalData}
              // data={null}
              onPressActivity={holdActivitiesId}
              selectedActivities={selectedActivities}
              onPressNote={goToNote}
              onPressFeedback={goToFeedback}
              onPressNoteFeedback={goToNoteFeedback} goToCoaching={goToJournalCoaching} />
          </HomepageCardWrapper>
          <Spacer height={Spacing[12]} />
          <HomepageCardWrapper animationDuration={700}>
            <FeedItemComponent
              // data={feedData}
              data={null}
              goToFeed={goToJournalCoaching}
            />
          </HomepageCardWrapper>
          <Spacer height={Spacing[12]} />
          <HomepageCardWrapper animationDuration={1000}>
            <MoodComponent data={moodData} />
          </HomepageCardWrapper>
        </VStack>
      )
    }

    return (
      <VStack testID="CoachingJournalMain" style={{backgroundColor: Colors.CLOUD_GRAY, flex: 1, justifyContent: 'center'}}>
        <SafeAreaView style={Layout.flex}>
          <VStack style={{backgroundColor: Colors.UNDERTONE_BLUE, borderBottomLeftRadius: Spacing[48], borderBottomRightRadius: Spacing[48], position: 'absolute', width: dimensions.screenWidth}}>
            <FastImage style={{
              height: Spacing[256],
              width: dimensions.screenWidth - Spacing[72],
              top: -Spacing[48],
              zIndex: -100
            }} source={topLogo} resizeMode={"contain"}/>
          </VStack>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.MAIN_RED}
              />
            }
          >
            {renderHomepage()}
          </ScrollView>
        </SafeAreaView>
        <SettingsButton goToSettings={goToSettings} />
      </VStack>
    )
  },
)

export default Homepage;
