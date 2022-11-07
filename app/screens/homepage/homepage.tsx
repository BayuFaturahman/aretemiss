import React, { FC, useCallback, useState, useEffect, useReducer } from "react"
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  RefreshControl,
  View,
  TouchableOpacity,
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {Button, Text, TextYellowLine} from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { VStack, HStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"

import FastImage, { Source } from "react-native-fast-image"
import topLogo from "@assets/icons/home-top-bg.png"
import moment from "moment"

import { dimensions } from "@config/platform.config"
import { CoachingJournalItem } from "@screens/coaching-journal/coaching-journal.type"
import { useStores } from "../../bootstrap/context.boostrap"

import { NotificationButton } from "@screens/homepage/components/notification-button"
import { SettingsButton } from "@screens/homepage/components/settings-button"
import { HomepageCardWrapper } from "@screens/homepage/components/homepage-card-wrapper"
import { CoachingJournalComponent } from "@screens/homepage/components/coaching-journal-component"
import { FeedItemComponent } from "@screens/homepage/components/feed-homepage-component"
import { FeedItemType } from "@screens/feed/feed.type"
import { MoodHomepageComponent } from "@screens/homepage/components/mood-homepage-component"
import { HomepageErrorCard } from "@screens/homepage/components/homepage-error-card"
import { ProfileComponent, ProfileItemType } from "@screens/homepage/components/profile-component"
import { LeaderboardComponent } from "@screens/homepage/components/leaderboard-component"
import { AssessmentComponent } from "@screens/homepage/components/assessment-component"

import RNAnimated from "react-native-animated-component"
import { debounce } from "lodash"

import Modal from "react-native-modalbox"
import { ProfileUpdateForm } from "@screens/settings/my-account"

import { MoodComponent } from "./components/mood-component"
import { BrainstormsComponent } from "@screens/homepage/components/brainstorms-component"

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

// const MOOD_EXAMPLE_DATA:MoodItemType = {

//   moodType: ''
// }

const PROFILE_EXAMPLE_DATA: ProfileItemType = {
  avatarUrl: "",
  user: {
    name: "",
    title: "",
  },
}

const Homepage: FC<StackScreenProps<NavigatorParamList, "homepage">> = observer(
  ({ navigation }) => {
    const onRefresh = React.useCallback(async () => {
      await loadData()
    }, [])

    if (__DEV__) {
      // eslint-disable-next-line global-require
      const DevMenu = require("react-native-dev-menu")
      DevMenu.addItem("Feedback Detail", () => {
        navigation.navigate("fillFeedbackDetail")
      })
    }

    const [, forceUpdate] = useReducer((x) => x + 1, 0)

    const [selectedActivities, setSelectedActivities] = useState<string>("")
    const [isHomepageError, setHomepageError] = useState<boolean>(false)

    const [moodData, setMoodData] = useState<string>("")
    const [profileData, setProfileData] = useState<ProfileItemType>(PROFILE_EXAMPLE_DATA)
    const [selectedMood, setSelectedMood] = useState<string>("")
    const [isMoodUpdated, setIsMoodUpdated] = useState<boolean>(false)
    const [isModalVisible, setModalVisible] = useState<boolean>(false)

    const holdActivitiesId = useCallback(
      (selectedId) => {
        setSelectedActivities(selectedId)
      },
      [selectedActivities],
    )

    // const [feedData, setFeedDAta] = useState<FeedItemType>(FEED_EXAMPLE_DATA_ITEM);
    const [feedData, setFeedData] = useState<FeedItemType>(null)
    const [coachingJournalData, setCoachingJournalData] = useState<CoachingJournalItem>(null)
    const { mainStore, coachingStore, authStore, feedStore, leaderboardStore } = useStores()

    const userProfile: ProfileUpdateForm = {
      fullname: mainStore.userProfile.user_fullname,
      nickname: mainStore.userProfile.user_nickname,
      email: mainStore.userProfile.user_email,
      team1Id: mainStore.userProfile.user_team_1_id,
      team2Id: mainStore.userProfile.user_team_2_id,
      team3Id: mainStore.userProfile.user_team_3_id,
      photo: mainStore.userProfile.user_photo,
      isAllowNotification: mainStore.userProfile.user_is_allow_notification,
      isAllowReminderNotification: mainStore.userProfile.user_is_allow_reminder_notification,
      mood: mainStore.userProfile.user_mood,
    }

    const goToNote = useCallback((id, coach_id) => {
      console.log(id)
      coachingStore.isDetailJournal(true)
      const detailCoaching = coach_id == mainStore.userProfile.user_id
      coachingStore.setDetailCoaching(detailCoaching)
      coachingStore.setDetailID(id)
      coachingStore.setFormCoach(true)
      console.log("goToNote coach_id", coach_id)
      console.log("goToNote user_id", mainStore.userProfile.user_id)
      navigation.navigate("overviewJournalEntry", {
        journalId: id,
        isCoachee: false,
      })
    }, [])

    const goToFeedback = useCallback((id) => {
      coachingStore.isDetailJournal(true)
      coachingStore.setDetailID(id)
      navigation.navigate("fillFeedbackDetail")
      console.log(id)
    }, [])

    const goToNoteFeedback = useCallback((id, coach_id) => {
      coachingStore.isDetailJournal(true)
      const detailCoaching = coach_id == mainStore.userProfile.user_id
      coachingStore.setDetailCoaching(detailCoaching)
      coachingStore.setDetailID(id)
      coachingStore.setFormCoach(false)
      // console.log('goToNoteFeedback id', id)
      // console.log('goToNoteFeedback coach_id', coach_id)
      // console.log('goToNoteFeedback user_id', mainStore.userProfile.user_id)

      navigation.navigate("overviewJournalEntry", {
        journalId: id,
        isCoachee: true,
      })
    }, [])

    const getUserProfile = useCallback(async () => {
      await mainStore.getProfile()
    }, [])

    const getLeaderboardPosition = useCallback(async () => {
      await leaderboardStore.getLeaderboardPosition(mainStore.userProfile.user_id)
    }, [])

    const getJournalList = useCallback(async () => {
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
        setMoodData(mainStore.userProfile.user_mood)

        const profileDataTemp = PROFILE_EXAMPLE_DATA
        profileDataTemp.user.name = mainStore.userProfile.user_fullname
        profileDataTemp.user.title =
          (mainStore.userProfile.team1_name ? mainStore.userProfile.team1_name : "") +
          (mainStore.userProfile.team2_name ? ", " + mainStore.userProfile.team2_name : "") +
          (mainStore.userProfile.team3_name ? ", " + mainStore.userProfile.team3_name : "")
        profileDataTemp.avatarUrl = mainStore.userProfile.user_photo
        setProfileData(profileDataTemp)

        userProfile.fullname = mainStore.userProfile.user_fullname
        userProfile.nickname = mainStore.userProfile.user_nickname
        userProfile.email = mainStore.userProfile.user_email
        userProfile.team1Id = mainStore.userProfile.user_team_1_id
        userProfile.team2Id = mainStore.userProfile.user_team_2_id
        userProfile.team3Id = mainStore.userProfile.user_team_3_id
        userProfile.photo = mainStore.userProfile.user_photo
        userProfile.isAllowNotification = mainStore.userProfile.user_is_allow_notification
        userProfile.isAllowReminderNotification =
          mainStore.userProfile.user_is_allow_reminder_notification
        userProfile.mood = mainStore.userProfile.user_mood

        forceUpdate()
        // console.log('userprofile Use effect: ', userProfile)
        // console.log('mainStore.userProfile Use effect: ', mainStore.userProfile)
      }
    }, [mainStore.userProfile])

    useEffect(() => {
      if (coachingStore.listJournal) {
        console.log("useCallback coachingStore.listJournal", coachingStore.listJournal)
        createList()
      }
    }, [coachingStore.listJournal])

    useEffect(() => {
      if (feedStore.listFeeds) {
        setFeedData(feedStore.listFeeds[0])
      }
    }, [feedStore.listFeeds])

    const loadData = debounce(async () => {
      await getUserProfile()
      await getJournalList()
      await getLeaderboardPosition()
      await getListFeed()
      if (feedStore.listFeeds) {
        setFeedData(feedStore.listFeeds[0])
      }
      console.log("isNewNotification", mainStore.userProfile.user_is_allow_notification)
    }, 500)

    useEffect(() => {
      setCoachingJournalData(null)
      setFeedData(null)
      loadData()
    }, [])

    useEffect(() => {
      if (coachingStore.formErrorCode === 9) {
        authStore.resetAuthStore()
      }
    }, [coachingStore.formErrorCode])

    const createList = () => {
      const id = mainStore.userProfile.user_id
      let groupArrays = []
      if (coachingStore.listJournal) {
        const groups = coachingStore.listJournal.reduce((groups, journalData) => {
          const date = journalData.journal_date.split("T")[0]
          if (!groups[date]) {
            groups[date] = []
          }
          groups[date].push({
            ...journalData,
            title: journalData.journal_title,
            type: journalData.journal_type,
            id: journalData.journal_id,
            isTagged: id != journalData.coach_id,
          })
          return groups
        }, {})
        groupArrays = Object.keys(groups).map((date) => {
          return {
            date: moment(date).format("DD MMM"),
            activities: groups[date],
          }
        })
      }
      if (groupArrays[0]) {
        setCoachingJournalData(groupArrays[0])
        forceUpdate()
      }
    }

    const goToNotifications = () => navigation.navigate("notificationList")

    const goToJournalCoaching = () => navigation.navigate("coachingJournalMain")

    const goToFeed = () => navigation.navigate("feedTimelineMain")

    const goToNewPost = () => navigation.navigate("newPost")

    const goToSettings = () => navigation.navigate("settingsPage")

    const goToLeaderboards = () => navigation.navigate("leaderboards")

    const goToAssessment = () => navigation.navigate("assessment")

    const goToJuaraAssessment = () => navigation.navigate("juaraQuizMain")

    // const goToBrainstormsGroup = () => navigation.navigate("newBrainstormsGroup")

    const goToBrainstormsGroup = () => navigation.navigate("brainstormGroupList")

    const goToTeamMood = () => {
      setModalVisible(false)
      navigation.navigate("moodTeam")
    }

    StatusBar.setBarStyle("light-content", false)

    const renderHomepage = () => {
      if (isHomepageError) {
        return (
          <VStack top={dimensions.screenHeight / 2} horizontal={Spacing[12]}>
            <HomepageCardWrapper animationDuration={300}>
              <HomepageErrorCard navigateTo={onRefresh} />
            </HomepageCardWrapper>
          </VStack>
        )
      }

      return (
        <>
          <VStack top={Spacing[48]} horizontal={Spacing[8]} bottom={Spacing[12]}>
            <VStack horizontal={Spacing[12]}>
              <RNAnimated appearFrom="left" animationDuration={500}>
                <NotificationButton
                  goToNotifications={goToNotifications}
                  isNewNotification={mainStore.userProfile.new_notification_flag === true}
                />
              </RNAnimated>
            </VStack>
            <Spacer height={Spacing[24]} />
            <RNAnimated appearFrom="right" animationDuration={700}>
              <VStack horizontal={Spacing[12]}>
                <Text
                  type={"right-header"}
                  style={{ color: Colors.WHITE, fontSize: Spacing[16] }}
                  underlineWidth={Spacing[72]}
                >
                  {`Hai, ${mainStore.userProfile.user_nickname}`}
                </Text>
              </VStack>
            </RNAnimated>

            <Spacer height={Spacing[32]} />
            <HomepageCardWrapper animationDuration={1000}>
              <ProfileComponent data={profileData} />
            </HomepageCardWrapper>
            <Spacer height={Spacing[12]} />
            <HStack style={{ flex: 1, alignSelf: "center" }}>
              <HomepageCardWrapper animationDuration={1000} horizontal={Spacing[16]} width={"58%"}>
                <LeaderboardComponent
                  leaderboardPosition={leaderboardStore?.leaderboardPosition || ""}
                  goToLeaderboard={goToLeaderboards}
                />
              </HomepageCardWrapper>
              <Spacer width={Spacing[12]} />
              <HomepageCardWrapper animationDuration={1000} horizontal={Spacing[14]} width={"38%"}>
                <MoodHomepageComponent data={moodData} goToMood={toggleModal} />
              </HomepageCardWrapper>
            </HStack>
            <Spacer height={Spacing[12]} />
            <HomepageCardWrapper animationDuration={500}>
              <CoachingJournalComponent
                data={coachingJournalData}
                // data={null}
                onPressActivity={holdActivitiesId}
                selectedActivities={selectedActivities}
                onPressNote={goToNote}
                onPressFeedback={goToFeedback}
                onPressNoteFeedback={goToNoteFeedback}
                goToCoaching={goToJournalCoaching}
              />
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
            <HomepageCardWrapper animationDuration={700}>
              <VStack>
                <BrainstormsComponent goToBrainstorms={goToBrainstormsGroup} />
              </VStack>
            </HomepageCardWrapper>
            <Spacer height={Spacing[12]} />
            <HomepageCardWrapper animationDuration={700}>
              <AssessmentComponent data={profileData} goToAssessment={goToJuaraAssessment} />
            </HomepageCardWrapper>
            <Spacer height={Spacing[12]} />
          </VStack>
        </>
      )
    }

    const toggleModal = () => {
      if (!isModalVisible) {
        setSelectedMood("")
      }
      // setTimeout(() => {
      setModalVisible(!isModalVisible)
      // }, 50)
    }

    const completeUpdateMoodModal = () => {
      toggleModal()
      setTimeout(() => {
        if (isMoodUpdated) {
          setIsMoodUpdated(false)
        }
      }, 200)
    }

    const selectMood = useCallback(
      (selectedMood) => {
        setSelectedMood(selectedMood)
        console.log("selected in getmood ", selectedMood)
      },
      [selectedMood, setSelectedMood],
    )

    const getMood = (mood: string) => {
      const type = mood.toLowerCase()

      const renderUserMood = () => {
        if (!selectedMood) {
          return <MoodComponent data={type} />
        }

        if (selectedMood) {
          if (type !== selectedMood) {
            const moodInactive = type + "Inactive"
            return <MoodComponent data={moodInactive} />
          } else {
            return <MoodComponent data={type} />
          }
        }
      }

      return (
        <VStack>
          <TouchableOpacity
            onPress={selectMood.bind(this, type)}
            style={{ backgroundColor: Colors.WHITE }}
          >
            <VStack>
              <View style={{ alignSelf: "center" }}>{renderUserMood()}</View>
              <Text
                type={"body"}
                style={{ fontSize: Spacing[18], textAlign: "center" }}
                text={selectedMood === "" || selectedMood === type ? type : " "}
              />
            </VStack>
          </TouchableOpacity>
        </VStack>
      )
    }

    const updateUserMood = useCallback(async () => {
      mainStore.formReset()
      userProfile.mood = selectedMood
      console.log("user profile: ", userProfile)
      console.log("selected mood ", userProfile.mood)

      const userMood = {
        mood: selectedMood
      } as ProfileUpdateForm

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await mainStore.updateProfile(mainStore.userProfile.user_id, userMood)
      if (mainStore.errorCode === null) {
        setIsMoodUpdated(true)
        // setIsDisableEditBtn(true);
        await mainStore.getProfile()
      } else {
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
      mainStore.userProfile,
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
                <Text type={"body-bold"} style={{ fontSize: Spacing[32] }}>
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
                <Spacer />
                {getMood("Senang")}
                <Spacer />
                {getMood("Sedih")}
                <Spacer />
                {/*<Spacer />*/}
                {/*{getMood("Marah")}*/}
              </HStack>
              <HStack bottom={Spacing[12]}>
                <Spacer />
                {getMood("Terkejut")}
                <Spacer />
                {getMood("Sakit")}
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
                    type={"light-blue"}
                    text={"Lihat mood anggota team"}
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
            // console.log("type.lable ", type.label)
            if (type.label === moodType) {
              // console.log("masuk nih ", type.source)
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
              <TextYellowLine underlineWidth={120}/>
              <Spacer height={Spacing[32]} />
              <HStack bottom={Spacing[28]}>
                <Spacer />
                <MoodComponent
                  data={selectedMood.toLowerCase()}
                  height={Spacing[84]}
                  width={Spacing[84]}
                />
                <Spacer />
              </HStack>
              <Spacer height={Spacing[14]} />
              <Text type={"body"} style={{ textAlign: "center", fontSize: Spacing[16] }}>
                Anda merasa
                <Text type={"light-blue"}> {selectedMood}</Text>!
              </Text>
              <Spacer height={Spacing[32]} />
              <HStack bottom={Spacing[24]}>
                <Spacer />
                <VStack style={{ maxWidth: Spacing[256], minWidth: Spacing[128] }}>
                  <Button
                    type={"light-blue"}
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
        style={{ backgroundColor: Colors.ABM_BG_BLUE, flex: 1, justifyContent: "center" }}
      >
        <SafeAreaView style={Layout.flex}>
          <VStack
            style={{
              backgroundColor: Colors.ABM_MAIN_BLUE,
              borderBottomLeftRadius: Spacing[48],
              borderBottomRightRadius: Spacing[48],
              position: "absolute",
              width: dimensions.screenWidth,
            }}
          >
            <FastImage
              style={{
                height: Spacing[256],
                width: dimensions.screenWidth - Spacing[72],
                top: -Spacing[48],
                zIndex: -100,
              }}
              source={topLogo}
              resizeMode={"contain"}
            />
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

export default Homepage
