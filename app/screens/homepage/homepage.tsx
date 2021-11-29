import React, {FC, useCallback, useState, useEffect, useReducer} from "react"
import {SafeAreaView, ScrollView, StatusBar, RefreshControl} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  Text,
} from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import {VStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {Colors, Layout, Spacing} from "@styles";

import FastImage from "react-native-fast-image";
import topLogo from "@assets/icons/home-top-bg.png";
import moment from 'moment'

import {dimensions} from "@config/platform.config";
import {CoachingJournalItem} from "@screens/coaching-journal/coaching-journal.type";
import { useStores } from "../../bootstrap/context.boostrap"

import {NotificationButton} from "@screens/homepage/components/notification-button";
import {SettingsButton} from "@screens/homepage/components/settings-button";
import {HomepageCardWrapper} from "@screens/homepage/components/homepage-card-wrapper";
import {CoachingJournalComponent} from "@screens/homepage/components/coaching-journal-component";
import {FeedItemComponent, FeedItemType} from "@screens/homepage/components/feed-homepage-component";
import {MoodComponent, MoodItemType} from "@screens/homepage/components/mood-component";
import {HomepageErrorCard} from "@screens/homepage/components/homepage-error-card";

import RNAnimated from "react-native-animated-component";
import {debounce} from "lodash";
import messaging from "@react-native-firebase/messaging";

const FEED_EXAMPLE_DATA_ITEM: FeedItemType[] = [
  {
    id: "0",
    imageUrl:
      "https://www.gstatic.com/webp/gallery/4.jpg;https://www.gstatic.com/webp/gallery/4.jpg",
    description:
      "Today, I’m starting a new monthly task! I designed a new strategy to nudge my team members to be more active in our monthly meetings. ",
    author: {
      fullname: "Mrs. Geneva Herrings",
      nickname: "Geneva",
      title: "Head of Accounting Dept.",
    },
    commentCount: 4,
    isNew: true,
    createdAt: "2021-09-24T10:39:39.000Z",
    updatedAt: "2021-09-24T10:39:39.000Z",
    comments: [],
  },
  {
    id: "1",
    imageUrl:
      "https://www.gstatic.com/webp/gallery/4.jpg;https://www.gstatic.com/webp/gallery/4.jpg;https://www.gstatic.com/webp/gallery/4.jpg",
    description:
      "Today, I’m starting a new monthly task! I designed a new strategy to nudge my team members to be more active in our monthly meetings. ",
    author: {
      fullname: "Mrs. Geneva Herrings",
      nickname: "Geneva",
      title: "Head of Accounting Dept.",
    },
    commentCount: 4,
    isNew: true,
    createdAt: "2021-09-24T10:39:39.000Z",
    updatedAt: "2021-09-24T10:39:39.000Z",
    comments: [],
  },
  {
    id: "2",
    imageUrl: "https://www.gstatic.com/webp/gallery/4.jpg",
    description:
      "Tmr, I’m starting a new monthly task! I designed a new strategy to nudge my team members to be more active in our monthly meetings. ",
    author: {
      fullname: "Mr. Herrings",
      nickname: "Herri",
      title: "Manager of Accounting Dept.",
    },
    commentCount: 4,
    isNew: true,
    createdAt: "2021-09-24T10:39:39.000Z",
    updatedAt: "2021-09-24T10:39:39.000Z",
    comments: [],
  },
  {
    id: "3",
    imageUrl:
      "https://www.gstatic.com/webp/gallery/4.jpg;https://www.gstatic.com/webp/gallery/4.jpg;https://www.gstatic.com/webp/gallery/4.jpg;https://www.gstatic.com/webp/gallery/4.jpg",
    description:
      "Today, I’m starting a new monthly task! I designed a new strategy to nudge my team members to be more active in our monthly meetings. ",
    author: {
      fullname: "Mrs. Geneva Herrings",
      nickname: "Geneva",
      title: "Head of Accounting Dept.",
    },
    commentCount: 4,
    isNew: true,
    createdAt: "2021-09-24T10:39:39.000Z",
    updatedAt: "2021-09-24T10:39:39.000Z",
    comments: [],
  },
]

const MOOD_EXAMPLE_DATA:MoodItemType = {
  avatarUrl: '',
  user: {
    name: '',
    title: ''
  },
  moodType: ''
}

const Homepage: FC<StackScreenProps<NavigatorParamList, "homepage">> = observer(
  ({ navigation }) => {

    const onRefresh = React.useCallback(async() => {
      await loadData()
    }, []);

    if (__DEV__) {
      // eslint-disable-next-line global-require
      const DevMenu = require('react-native-dev-menu');
      DevMenu.addItem('Feedback Detail', () => {
        navigation.navigate('fillFeedbackDetail')
      });
    }


    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const [selectedActivities, setSelectedActivities] = useState<string>('');
    const [isHomepageError, setHomepageError] = useState<boolean>(false);

    const [moodData, setMoodData] = useState<MoodItemType>(MOOD_EXAMPLE_DATA);

    const holdActivitiesId = useCallback((selectedId)=>{
      setSelectedActivities(selectedId)
    }, [selectedActivities])

    // const [feedData, setFeedDAta] = useState<FeedItemType>(FEED_EXAMPLE_DATA_ITEM);
    const [feedData, setFeedData] = useState<FeedItemType>(null);
    const [coachingJournalData, setCoachingJournalData] = useState<CoachingJournalItem>(null);
    const {mainStore, coachingStore, authStore, feedStore} = useStores()

    const goToNote = useCallback((id, coach_id)=>{
      console.log(id)
      coachingStore.isDetailJournal(true)
      const detailCoaching = coach_id == mainStore.userProfile.user_id
      coachingStore.setDetailCoaching(detailCoaching)
      coachingStore.setDetailID(id)
      coachingStore.setFormCoach(true)
      console.log('goToNote coach_id', coach_id)
      console.log('goToNote user_id', mainStore.userProfile.user_id)
      navigation.navigate("overviewJournalEntry", {
        journalId: id,
        isCoachee: false
      })
    }, [])

    const goToFeedback = useCallback((id)=>{
      coachingStore.isDetailJournal(true)
      coachingStore.setDetailID(id)
      navigation.navigate("fillFeedbackDetail")
      console.log(id)
    }, [])

    const goToNoteFeedback = useCallback((id, coach_id)=>{
      coachingStore.isDetailJournal(true)
      const detailCoaching = coach_id == mainStore.userProfile.user_id
      coachingStore.setDetailCoaching(detailCoaching)
      coachingStore.setDetailID(id)
      coachingStore.setFormCoach(false)
      console.log('goToNoteFeedback id', id)
      console.log('goToNoteFeedback coach_id', coach_id)
      console.log('goToNoteFeedback user_id', mainStore.userProfile.user_id)

      navigation.navigate("overviewJournalEntry", {
        journalId: id,
        isCoachee: true
      })
    }, [])

    const getUserProfile = useCallback(async ()=>{
      await mainStore.getProfile()
    },[])

    const getJournalList = useCallback(async ()=>{
      await coachingStore.clearJournal()
      await coachingStore.getJournal()
    },[])

    const getListFeed = useCallback(async () => {
      await feedStore.getListFeeds()
    }, [])

    useEffect(() => {
      loadData()
    },[])


    useEffect(()=> {
      if(mainStore.userProfile){
        const data = MOOD_EXAMPLE_DATA
        data.user.name = mainStore.userProfile.user_fullname
        data.user.title = mainStore.userProfile.team1_name
        data.avatarUrl = mainStore.userProfile.user_photo
        setMoodData(data)
        forceUpdate()
      }
    }, [mainStore.userProfile])

    useEffect(()=> {
      if(coachingStore.listJournal){
        console.log('useCallback coachingStore.listJournal', coachingStore.listJournal)
        createList()
      }
    }, [coachingStore.listJournal])

    useEffect(()=> {
      if(feedStore.listFeeds){
        setFeedData(feedStore.listFeeds[0])
      }
    }, [feedStore.listFeeds])

    const loadData = debounce( async () => {
      await getUserProfile()
      await getJournalList()
      await getListFeed()
      if(feedStore.listFeeds){
        setFeedData(feedStore.listFeeds[0])
      }
    }, 500)

    useEffect(()=> {
      setCoachingJournalData(null)
      setFeedData(null)
      loadData()
    }, [])

    useEffect(()=> {
      if(coachingStore.formErrorCode === 9){
        authStore.resetAuthStore()
      }
    }, [coachingStore.formErrorCode])

    const createList = () => {
      const id = mainStore.userProfile.user_id
      let groupArrays = []
      if(coachingStore.listJournal){
        const groups = coachingStore.listJournal.reduce((groups, journalData) => {
          const date = journalData.journal_date.split('T')[0];
             if (!groups[date]) {
              groups[date] = [];
             }
             groups[date].push(
               {
                 ...journalData,
                  title: journalData.journal_title,
                  type: journalData.journal_type,
                  id: journalData.journal_id,
                  isTagged: id != journalData.coach_id
               }
             );
             return groups;
          }, {});
          groupArrays = Object.keys(groups).map((date) => {
             return {
             date: moment(date).format('DD MMM'),
             activities: groups[date]
             };
          });
      }
      if(groupArrays[0]){
        setCoachingJournalData(groupArrays[0])
        forceUpdate()
      }
    }

    const goToNotifications = () => navigation.navigate('notificationList')

    const goToJournalCoaching = () => navigation.navigate('coachingJournalMain')

    const goToFeed = () => navigation.navigate('feedTimelineMain')

    const goToNewPost = () => navigation.navigate('newPost')

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
             <NotificationButton goToNotifications={goToNotifications} isNewNotification={false} />
            </RNAnimated>
            </VStack>
          <Spacer height={Spacing[24]} />
          <RNAnimated
            appearFrom="right"
            animationDuration={700}
          >
            <VStack horizontal={Spacing[12]}>
              <Text
                type={'right-header'}
                style={{color: Colors.WHITE, fontSize: Spacing[16]}}
                underlineWidth={Spacing[72]}>
                {`Hai, ${mainStore.userProfile.user_nickname}`}
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
              data={feedData}
              // data={FEED_EXAMPLE_DATA_ITEM[0]}
              goToFeed={goToFeed}
              goToNewPost={goToNewPost}
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
                refreshing={coachingStore.isLoading || mainStore.isLoading}
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
