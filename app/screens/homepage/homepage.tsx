import React, {FC, useCallback, useState, useEffect, useReducer} from "react"
import {SafeAreaView, ScrollView, StatusBar, RefreshControl, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Button, Text} from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { VStack, HStack } from "@components/view-stack"
import Spacer from "@components/spacer";
import {Colors, Layout, Spacing} from "@styles";

import FastImage, { Source } from "react-native-fast-image"
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
import {MoodComponent, MoodItemType, MOOD_TYPE} from "@screens/homepage/components/mood-component";
import {HomepageErrorCard} from "@screens/homepage/components/homepage-error-card";

import RNAnimated from "react-native-animated-component";
import {debounce} from "lodash";
import messaging from "@react-native-firebase/messaging";

import Modal from "react-native-modalbox"
import senang from "@assets/icons/mood/senyum.png"
import senangBw from "@assets/icons/mood/senyum-bw.png"
import marah from "@assets/icons/mood/marah.png"
import marahBw from "@assets/icons/mood/marah-bw.png"
import sedih from "@assets/icons/mood/sedih.png"
import sedihBw from "@assets/icons/mood/sedih-bw.png"
import sakit from "@assets/icons/mood/sakit.png"
import sakitBw from "@assets/icons/mood/sakit-bw.png"
import terkejut from "@assets/icons/mood/kaget.png"
import terkejutBw from "@assets/icons/mood/kaget-bw.png"
import { TouchableOpacity } from "react-native-gesture-handler"
import { ProfileUpdateForm } from "@screens/settings/my-account"

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
    const [selectedMood, setSelectedMood] = useState<string>("")
    const [isMoodUpdated, setIsMoodUpdated] = useState<boolean>(false)
    const [isModalVisible, setModalVisible] = useState<boolean>(false)

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
    }, [])

    const getJournalList = useCallback(async ()=>{
      await coachingStore.clearJournal()
      await coachingStore.getJournal()
    }, [])

    const getListFeed = useCallback(async () => {
      await feedStore.getListFeeds()
    }, [])

    useEffect(() => {
      loadData()
    }, [])

    useEffect(() => {
      if (mainStore.userProfile) {
        const data = MOOD_EXAMPLE_DATA
        data.user.name = mainStore.userProfile.user_fullname
        data.user.title = mainStore.userProfile.team1_name
        data.avatarUrl = mainStore.userProfile.user_photo
        data.moodType = mainStore.userProfile.user_mood
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

    const goToTeamMood = () => navigation.navigate("moodTeam")

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
        <>
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
              data={feedData ?? null}
              goToFeed={goToFeed}
              goToNewPost={goToNewPost}
            />
          </HomepageCardWrapper>
          <Spacer height={Spacing[12]} />
          <HomepageCardWrapper animationDuration={1000}>
            <MoodComponent data={moodData} goToMood={toggleModal} />
          </HomepageCardWrapper>
        </VStack>
        </>
      )
    }

    const userProfile: ProfileUpdateForm = {
      fullname: mainStore.userProfile.user_fullname,
      nickname: mainStore.userProfile.user_nickname,
      email: mainStore.userProfile.user_email,
      team1Id: mainStore.userProfile.team1_id,
      team2Id: mainStore.userProfile.team2_id,
      team3Id: mainStore.userProfile.team3_id,
      photo: mainStore.userProfile.user_photo,
      isAllowNotification: mainStore.userProfile.user_is_allow_notification,
      isAllowReminderNotification: mainStore.userProfile.user_is_allow_reminder_notification,
      mood: mainStore.userProfile.user_mood,
    }

    const toggleModal = () => {
      if (!isModalVisible) {
        setSelectedMood("")
      }
      setTimeout(() => {
        setModalVisible(!isModalVisible)
      }, 100)
    }

    const completeUpdateMoodModal = () => {
      toggleModal()
      setTimeout(() => {
        if (isMoodUpdated) {
          setIsMoodUpdated(false)
        }
      }, 200)
    }

    const getMood = (source: Source, sourceBw: Source, type: string) => {
      const typeLowerCase = type.toLowerCase()
      const selectMood = () => {
        setSelectedMood(typeLowerCase)
        console.log("selected in getmood ", typeLowerCase)
      }

      return (
        <VStack>
          <TouchableOpacity onPress={selectMood}>
            <FastImage
              style={{
                height: Spacing[48],
                width: Spacing[48],
                borderColor: selectedMood === type ? Colors.MAIN_RED : "",
                borderWidth: selectedMood === type ? Spacing[3] : 0,
                borderRadius: selectedMood === type ? Spacing[128] : 0,
              }}
              source={selectedMood !== typeLowerCase && selectedMood !== "" ? sourceBw : source}
              resizeMode={"contain"}
            />
          </TouchableOpacity>
          <Text
            type={"body"}
            style={{ fontSize: Spacing[18], textAlign: "center" }}
            text={selectedMood === "" || selectedMood === typeLowerCase ? type : " "}
          />
        </VStack>
      )
    }

    const updateUserMood = useCallback(async () => {
      mainStore.formReset()
      userProfile.mood = selectedMood
      console.log("selected mood ", userProfile.mood)

      await mainStore.updateProfile(mainStore.userProfile.user_id, userProfile)
      if (mainStore.errorCode === null) {
        setIsMoodUpdated(true)
        // setIsDisableEditBtn(true);
        // setModalContent('Hore!', 'Profil kamu sudah berhasil diganti.', smileYellow)

        await mainStore.getProfile()
      } else {
        // setModalContent('Oh no! :(', 'Perubahannya gagal diproses.\nCoba lagi ya!', angry)

        console.log("error code ", mainStore.errorCode)
        if (mainStore.errorCode === 500) {
          // setGeneralErrorMessage(mainStore.errorMessage)
        } else {
          // setGeneralErrorMessage(null)
        }
      }
    }, [
      userProfile,
      selectedMood,
      mainStore.errorCode,
      mainStore.updateProfileSuccess,
      mainStore.updateProfileFailed,
    ])

    const renderMoodModal = () => {
      if (!isMoodUpdated) {
        return (
          <VStack
            horizontal={Spacing[24]}
            top={Spacing[24]}
            bottom={Spacing[24]}
            style={Layout.widthFull}
          >
            <VStack style={{ alignItems: "flex-end" }}>
              <TouchableOpacity onPress={toggleModal}>
                <Text type={"body-bold"} style={[{ fontSize: Spacing[42] }]}>
                  x
                </Text>
              </TouchableOpacity>
            </VStack>
            <VStack>
              <Text
                type={"body-bold"}
                style={{ fontSize: Spacing[18], textAlign: "center" }}
                text={"Pilih mood Anda hari ini:"}
              />
              <Spacer height={Spacing[42]} />
              <HStack bottom={Spacing[12]}>
                {getMood(senang, senangBw, "Senang")}
                <Spacer />
                <Spacer />
                {getMood(sedih, sedihBw, "Sedih")}
                <Spacer />
                <Spacer />
                {getMood(marah, marahBw, "Marah")}
              </HStack>
              <HStack bottom={Spacing[12]}>
                <Spacer />
                {getMood(terkejut, terkejutBw, "Terkejut")}
                <Spacer />
                {getMood(sakit, sakitBw, "Sakit")}
                <Spacer />
              </HStack>
              <HStack bottom={Spacing[24]}>
                <Spacer />
                <VStack
                  style={{ maxWidth: Spacing[256], minWidth: Spacing[128], alignItems: "center" }}
                >
                  <Button
                    type={"primary"}
                    text={"Pilih"}
                    style={{ height: Spacing[36], paddingHorizontal: Spacing[28] }}
                    textStyle={{ fontSize: Spacing[16], lineHeight: Spacing[20] }}
                    onPress={updateUserMood}
                    disabled={selectedMood === ""}
                  />
                  <Spacer height={Spacing[12]} />
                  <Button
                    type={"warning"}
                    text={"Lihat mood anggota lain"}
                    style={{ height: Spacing[36], paddingHorizontal: Spacing[28] }}
                    textStyle={{ fontSize: Spacing[16], lineHeight: Spacing[20] }}
                    onPress={goToTeamMood}
                  />
                </VStack>
                <Spacer />
              </HStack>
            </VStack>
          </VStack>
        )
      } else {

        const getMoodSource = (moodType: string) => {
          console.log("MasuK effect mood homepage ", MOOD_TYPE.length)
          let toReturn = null
          for (let x = 0; x < MOOD_TYPE.length; x++) {
            const type = MOOD_TYPE[x]
            console.log("type.lable ", type.label)
            if (type.label === moodType) {
              console.log("masuk nih ", type.source)
              x = MOOD_TYPE.length
              toReturn = type.source
            }
          }
          return toReturn
        }

        
        return (
          <VStack
            horizontal={Spacing[24]}
            top={Spacing[24]}
            bottom={Spacing[24]}
            style={Layout.widthFull}
          >
            <VStack>
            <Spacer height={Spacing[42]} />
              <Text
                type={"body"}
                style={{ textAlign: "center" }}
                text={"Mood Anda hari ini sudah terpilih."}
              />
              <Spacer height={Spacing[32]} />
              <HStack bottom={Spacing[28]}>
                <Spacer />
                <FastImage
                  style={{
                    height: Spacing[84],
                    width: Spacing[84],
                  }}
                  source={getMoodSource(selectedMood.toLowerCase())}
                  resizeMode={"contain"}
                />
                <Spacer />
              </HStack>
              <Spacer height={Spacing[14]} />
              <Text type={"body"} style={{ textAlign: "center", fontSize: Spacing[16] }} >Anda merasa 
                <Text type={"warning"}> {selectedMood}</Text>!
              </Text>
              <Spacer height={Spacing[32]} />
              <HStack bottom={Spacing[24]}>
                <Spacer />
                <VStack style={{ maxWidth: Spacing[256], minWidth: Spacing[128] }}>
                  <Button
                    type={"primary"}
                    text={"Kembali"}
                    style={{ height: Spacing[32], paddingHorizontal: Spacing[8] }}
                    textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                    onPress={completeUpdateMoodModal}
                  />
                </VStack>
                <Spacer />
              </HStack>
            </VStack>
          </VStack>
        )
      }
    }

    return (
      <VStack
        testID="CoachingJournalMain"
        style={{ backgroundColor: Colors.CLOUD_GRAY, flex: 1, justifyContent: "center" }}
      >
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
        <Modal
            isOpen={isModalVisible}
            style={{
              height: "50%",
              width: dimensions.screenWidth - Spacing[24],
              backgroundColor: "rgba(52, 52, 52, 0)",
            }}
          >
            <View style={{ flex: 1, justifyContent: "center" }}>
              <VStack
                style={{
                  backgroundColor: Colors.WHITE,
                  borderRadius: Spacing[48],
                  minHeight: Spacing[256],
                  alignItems: "center",
                  justifyContent: "center",
                }}
                horizontal={Spacing[24]}
                vertical={Spacing[24]}
              >
                {renderMoodModal()}
              </VStack>
            </View>
          </Modal>
        <SettingsButton goToSettings={goToSettings} />
      </VStack>
    )
  },
)

export default Homepage;
