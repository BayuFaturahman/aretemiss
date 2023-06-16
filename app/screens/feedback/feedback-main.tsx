import React, { FC, useCallback, useReducer, useState, useEffect } from "react"
import { ActivityIndicator, FlatList, ImageBackground, RefreshControl, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, BackNavigation, Button } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"
import moment from "moment"

import { CoachingJournalItem } from "@screens/coaching-journal/coaching-journal.type"
import { useStores } from "../../bootstrap/context.boostrap"

import { dimensions } from "@config/platform.config"
import { debounce } from "lodash";
import { images } from "@assets/images";
import { ExistingCoacheeModel, FeedbackUserDetailModel } from "app/store/store.feedback"
import { ExistingCoacheeComponent } from "./components/existing-coachee-component"

import Modal from "react-native-modalbox"
import { MoodComponent } from "@screens/homepage/components/mood-component"
import { FeedbackRequestListComponent } from "./components/feedback-request-list-component"
import { IconClose } from "@assets/svgs"
import { RED100 } from "@styles/Color"
import { spacing } from "@theme/spacing"

const MOCK_EXISTING_COACHEE: ExistingCoacheeModel[] = [
  {
    coachee_id: "87c498af-6f6f-4e44-a8a7-ddc98cc5042e",
    journal_title: "Test Pol 12 June",
    user_fullname: "Pok1",
    is_button_disabled: 1,
    has_previous_feedback: 0
  },
  {
    coachee_id: "87c498af-6f6f-4e44-a8a7-ddc98cc50421",
    journal_title: "Test Pol 11 June",
    user_fullname: "Pok2",
    is_button_disabled: 1,
    has_previous_feedback: 0
  },
  {
    coachee_id: "87c498af-6f6f-4e44-a8a7-ddc98cc5042",
    journal_title: "Test Pol 13 June",
    user_fullname: "Pok3",
    is_button_disabled: 1,
    has_previous_feedback: 0
  },
  {
    coachee_id: "87c498af-6f6f-4e44-a8a7-ddc98cc5043",
    journal_title: "Test Pol 13 June",
    user_fullname: "Pok4",
    is_button_disabled: 1,
    has_previous_feedback: 0
  },
]

const MOCK_PREVIOUS_FEEDBACK: FeedbackUserDetailModel[] = [
  {
    "fu_id": "a45c9dd6-e2f6-4b85-92f4-6b067331ff22",
    "fu_q1": 5,
    "fu_q2": 5,
    "fu_q3": 4,
    "fu_q4": 5,
    "from": "coachee",
    "fu_coach_id": "61d8bf7f-777c-4227-9050-82ef768611d7",
    "fu_coachee_id": "61d8bf7f-777c-4227-9050-82ef768611d7",
    "fu_created_at": "2023-06-13T09:23:24.000Z",
    "fu_updated_at": "2023-06-13T09:23:24.000Z",
    "fu_deleted_at": null
  },
  {
    "fu_id": "6002192f-b931-464d-b893-bac97874f2a6",
    "fu_q1": 5,
    "fu_q2": 5,
    "fu_q3": 4,
    "fu_q4": 5,
    "from": "coachee",
    "fu_coach_id": "9d5d69df-7902-4e61-be48-a52bf01aa854",
    "fu_coachee_id": "61d8bf7f-777c-4227-9050-82ef768611d7",
    "fu_created_at": "2023-06-13T09:19:21.000Z",
    "fu_updated_at": "2023-06-13T09:19:21.000Z",
    "fu_deleted_at": null
  },
  {
    "fu_id": "fdd21e99-d297-4e59-a2ec-7441cc8092df",
    "fu_q1": 3,
    "fu_q2": 3,
    "fu_q3": 3,
    "fu_q4": 5,
    "from": "coachee",
    "fu_coach_id": "61d8bf7f-777c-4227-9050-82ef768611d7",
    "fu_coachee_id": "61d8bf7f-777c-4227-9050-82ef768611d7",
    "fu_created_at": "2023-06-12T13:24:28.000Z",
    "fu_updated_at": "2023-06-12T13:24:28.000Z",
    "fu_deleted_at": null
  },
  // {
  //   "fu_id": "1dd27874-2fff-4972-ada8-5b7528c419ac",
  //   "fu_q1": 3,
  //   "fu_q2": 3,
  //   "fu_q3": 2,
  //   "fu_q4": 4,
  //   "from": "coachee",
  //   "fu_coach_id": "61d8bf7f-777c-4227-9050-82ef768611d7",
  //   "fu_coachee_id": "61d8bf7f-777c-4227-9050-82ef768611d7",
  //   "fu_created_at": "2023-06-11T17:31:14.000Z",
  //   "fu_updated_at": "2023-06-11T17:31:14.000Z",
  //   "fu_deleted_at": null
  // },
  // {
  //   "fu_id": "9f201037-5095-4d9d-956a-9a9229d1b375",
  //   "fu_q1": 1,
  //   "fu_q2": 3,
  //   "fu_q3": 3,
  //   "fu_q4": 3,
  //   "from": "coachee",
  //   "fu_coach_id": "61d8bf7f-777c-4227-9050-82ef768611d7",
  //   "fu_coachee_id": "61d8bf7f-777c-4227-9050-82ef768611d7",
  //   "fu_created_at": "2023-06-11T14:54:08.000Z",
  //   "fu_updated_at": "2023-06-11T14:54:08.000Z",
  //   "fu_deleted_at": null
  // },
  // {
  //   "fu_id": "e808f925-2572-42b0-8edd-02c5c1922e06",
  //   "fu_q1": 3,
  //   "fu_q2": 3,
  //   "fu_q3": 3,
  //   "fu_q4": 3,
  //   "from": "coachee",
  //   "fu_coach_id": "61d8bf7f-777c-4227-9050-82ef768611d7",
  //   "fu_coachee_id": "61d8bf7f-777c-4227-9050-82ef768611d7",
  //   "fu_created_at": "2023-06-09T17:33:37.000Z",
  //   "fu_updated_at": "2023-06-09T17:33:37.000Z",
  //   "fu_deleted_at": null
  // },
  // {
  //   "fu_id": "eb258cca-0ac3-401e-80e9-18851535da02",
  //   "fu_q1": 3,
  //   "fu_q2": 3,
  //   "fu_q3": 3,
  //   "fu_q4": 3,
  //   "from": "coachee",
  //   "fu_coach_id": "61d8bf7f-777c-4227-9050-82ef768611d7",
  //   "fu_coachee_id": "61d8bf7f-777c-4227-9050-82ef768611d7",
  //   "fu_created_at": "2023-06-09T17:33:29.000Z",
  //   "fu_updated_at": "2023-06-09T17:33:29.000Z",
  //   "fu_deleted_at": null
  // },
  // {
  //   "fu_id": "b5b80008-fd12-4598-9ffa-955d42f46c86",
  //   "fu_q1": 4,
  //   "fu_q2": 4,
  //   "fu_q3": 4,
  //   "fu_q4": 4,
  //   "from": "coachee",
  //   "fu_coach_id": "61d8bf7f-777c-4227-9050-82ef768611d7",
  //   "fu_coachee_id": "61d8bf7f-777c-4227-9050-82ef768611d7",
  //   "fu_created_at": "2023-06-09T17:33:22.000Z",
  //   "fu_updated_at": "2023-06-09T17:33:22.000Z",
  //   "fu_deleted_at": null
  // },
  // {
  //   "fu_id": "475e8de8-dd3a-421b-b068-74cf57c20e3f",
  //   "fu_q1": 2,
  //   "fu_q2": 2,
  //   "fu_q3": 4,
  //   "fu_q4": 4,
  //   "from": "coachee",
  //   "fu_coach_id": "61d8bf7f-777c-4227-9050-82ef768611d7",
  //   "fu_coachee_id": "61d8bf7f-777c-4227-9050-82ef768611d7",
  //   "fu_created_at": "2023-06-09T17:32:53.000Z",
  //   "fu_updated_at": "2023-06-09T17:32:53.000Z",
  //   "fu_deleted_at": null
  // },
  // {
  //   "fu_id": "224e8a6b-f559-45bb-b79b-2060dad74f01",
  //   "fu_q1": 5,
  //   "fu_q2": 4,
  //   "fu_q3": 2,
  //   "fu_q4": 1,
  //   "from": "coachee",
  //   "fu_coach_id": "61d8bf7f-777c-4227-9050-82ef768611d7",
  //   "fu_coachee_id": "61d8bf7f-777c-4227-9050-82ef768611d7",
  //   "fu_created_at": "2023-06-09T17:32:17.000Z",
  //   "fu_updated_at": "2023-06-09T17:32:17.000Z",
  //   "fu_deleted_at": null
  // }
]

const FeedbackMain: FC<StackScreenProps<NavigatorParamList, "feedbackMain">> =
  observer(({ navigation }) => {


    const [existingCoacheeData, setExistingCoacheeData] = useState<Array<ExistingCoacheeModel>>([])
    const [listFeedbackDetail, setListFeedbackDetail] = useState<Array<FeedbackUserDetailModel>>([])

    const [listFeedbackRequest, setListFeedbacRequest] = useState<Array<ExistingCoacheeModel>>([])


    const [coachingData, setCoachingData] = useState<Array<CoachingJournalItem>>([])
    const [selectedFeedbackRequest, setSelectedFeedbackRequest] = useState<string>("")
    const [selectedExistingCoachee, setSelectedExistingCoachee] = useState<string>("")
    const [selectedPreviousFeedbackCoachee, setSelectedPreviousFeedbackCoachee] = useState<string>("")
    const [selectedPreviousFeedbackUser, setSelectedPreviousFeedbackUser] = useState<string>("")
    const [selectedPreviousFeedbackDetail, setSelectedPreviousFeedbackDetail] = useState<FeedbackUserDetailModel>()

    const [currentPageExistingCoachee, setCurrentPageExistingCoachee] = useState<number>(2)

    const [, forceUpdate] = useReducer((x) => x + 1, 0)
    const { mainStore, feedbackStore } = useStores()

    const [currentPage, setCurrentPage] = useState<number>(2)


    const [initialLoading, setInitialLoading] = useState<boolean>(true)

    const [isModalVisible, setModalVisible] = useState<boolean>(false)
    const [modalTitle, setModalTitle] = useState<string>("")
    const [modalDesc, setModalDesc] = useState<string>("")
    const [modalIcon, setModalIcon] = useState("senang")
    const [modalType, setModalType] = useState<string>("")

    const setModalContent = (title: string, desc: string, icon: string) => {
      setModalTitle(title)
      setModalDesc(desc)
      setModalIcon(icon)
    }

    const toggleModal = (value: boolean) => {
      setModalVisible(value)
      if (!value) {
        resetSelectedIndicator()
      }
    }

    const goBack = () => {
      navigation.reset({
        routes: [{ name: "homepage" }],
      })
    }

    const loadExistingCoachee = async (page: number) => {
      await feedbackStore.getListExistingCoachee(page)
    }

    const onRefresh = React.useCallback(async () => {
      setCurrentPage(2)
      firstLoadExistingCoachee()
    }, [])

    const onRefreshExistingCoachee = React.useCallback(async () => {
      setCurrentPageExistingCoachee(2)
      firstLoadExistingCoachee()
    }, [])

    const onLoadMoreExistingCoachee = React.useCallback(async () => {
      console.log('---onLoadMoreExistingCoachee ', currentPageExistingCoachee)
      if (!feedbackStore.isLoadingExistingCoachee) {
        console.log("load more existing coachees ", currentPageExistingCoachee)
        // await loadExistingCoachee(currentPageExistingCoachee).then(r =>
        //   setCurrentPageExistingCoachee(currentPageExistingCoachee + 1))

        await loadExistingCoachee(currentPageExistingCoachee)
        setCurrentPageExistingCoachee(currentPageExistingCoachee + 1)
      }
    }, [currentPageExistingCoachee])


    const holdFeedbackRequest = useCallback(
      (selectedId) => {
        console.log(`selectedId: ${selectedId}`)
        setSelectedFeedbackRequest(selectedId)
        setSelectedExistingCoachee('')
      },
      [selectedFeedbackRequest],
    )

    const holdExistingCoachee = useCallback(
      (selectedId) => {
        console.log(`selectedId: ${selectedId}`)
        setSelectedExistingCoachee(selectedId)
        setSelectedFeedbackRequest('')
      },
      [selectedExistingCoachee],
    )

    const holdPreviousFeedbackDate = useCallback(
      (selectedId, index) => {
        console.log(`selectedId: ${selectedId}`)
        setSelectedPreviousFeedbackCoachee(selectedId)
        setSelectedPreviousFeedbackUser(selectedId)
        setSelectedExistingCoachee('')
        setSelectedPreviousFeedbackDetail(listFeedbackDetail[index])
      },
      [selectedFeedbackRequest],
    )

    const loadListFeedbackUser = async (page: number) => {
      setListFeedbackDetail(MOCK_PREVIOUS_FEEDBACK)
    }

    const requestFeedback = useCallback(
      (selectedId) => {
        if (isModalVisible) {
          // toggleModal(false)
        }
        console.log(`selectedId for requestFeedback: ${selectedId}`)
        setModalType("notification")
        setModalContent("Sukses!", "Feedback telah sukses direquest!", "senang")
        toggleModal(true)
        // setSelectedActivities(selectedId)
      },
      [selectedExistingCoachee],
    )


    const openPreviousFeedbackDateList = useCallback(
      (selectedId) => {
        if (isModalVisible) {
          // toggleModal(false)
        }
        console.log(`selectedId for requestFeedback: ${selectedId}`)
        setModalType("previousFeedbackDates")
        setModalContent("Sukses!", "Feedback telah sukses direquest!", "senang")
        toggleModal(true)
        // setSelectedActivities(selectedId)
      },
      [selectedExistingCoachee],
    )

    const resetSelectedIndicator = () => {
      setSelectedPreviousFeedbackCoachee("")
      setSelectedPreviousFeedbackUser("")
      setSelectedExistingCoachee("")
    }

    const goToFeedbackDetail = () => {
      navigation.navigate("feedbackDetail", {
        feedbackDetailData: selectedPreviousFeedbackDetail
      })
    }

    const openFeedbackDetail = () => {
      toggleModal(false)
      // resetSelectedIndicator()
      // setTimeout(() => {
        goToFeedbackDetail()
      // }, 1200);

    }

    // const newEntry = () => {
    //   feedbackStore.isDetailJournal(false)
    //   feedbackStore.setFormCoach(true)
    //   navigation.navigate("newJournalEntry", {
    //     isDetail: false,
    //   })
    // }

    // const holdActivitiesId = useCallback(
    //   (selectedId) => {
    //     setSelectedActivities(selectedId)
    //     // forceUpdate()
    //   },
    //   [selectedActivities],
    // )

    // const goToNote = useCallback((id, coach_id) => {
    //   console.log(id)
    //   feedbackStore.isDetailJournal(true)
    //   const detailCoaching = coach_id === mainStore.userProfile.user_id
    //   feedbackStore.setDetailCoaching(detailCoaching)
    //   feedbackStore.setDetailID(id)
    //   feedbackStore.setFormCoach(true)
    //   console.log("goToNote coach_id", coach_id)
    //   console.log("goToNote user_id", mainStore.userProfile.user_id)
    //   navigation.navigate("overviewJournalEntry", {
    //     journalId: id,
    //     isCoachee: false,
    //   })
    // }, [])

    // const goToFeedback = useCallback((id) => {
    //   feedbackStore.isDetailJournal(true)
    //   feedbackStore.setDetailID(id)
    //   navigation.navigate("fillFeedbackDetail")
    //   console.log(id)
    // }, [])

    // const goToNoteFeedback = useCallback((id, coach_id) => {
    //   feedbackStore.isDetailJournal(true)
    //   const detailCoaching = coach_id === mainStore.userProfile.user_id
    //   feedbackStore.setDetailCoaching(detailCoaching)
    //   feedbackStore.setDetailID(id)
    //   feedbackStore.setFormCoach(false)
    //   console.log("goToNoteFeedback coach_id", coach_id)
    //   console.log("goToNoteFeedback user_id", mainStore.userProfile.user_id)

    //   navigation.navigate("overviewJournalEntry", {
    //     journalId: id,
    //     isCoachee: true,
    //   })
    // }, [])

    const firstLoadExistingCoachee = debounce(async () => {
      await feedbackStore.clearFeedback()
      await loadExistingCoachee(1)

      // setTimeout(() => {
      console.log(`timeout feedbackStore.listExistingCoachees , ${feedbackStore.listExistingCoachees}`)
      // feedbackStore.listExistingCoachees = MOCK_EXISTING_COACHEE
      setInitialLoading(false)
      feedbackStore.setRefreshData(false)
      forceUpdate()
      // }, 100)
    }, 500)

    useEffect(() => {
      firstLoadExistingCoachee()
      console.log('use effect firstLoadExistingCoachee')
      setExistingCoacheeData(feedbackStore.listExistingCoachees)
    }, [])

    useEffect(() => {
      if (feedbackStore.listExistingCoachees) {
        // createList()
        setExistingCoacheeData(feedbackStore.listExistingCoachees)
      }

      console.log(`existingCoacheeData , ${existingCoacheeData}`)
      console.log(`feedbackStore.listExistingCoachees , ${feedbackStore.listExistingCoachees}`)
    }, [feedbackStore.listExistingCoachees, feedbackStore.getExistingCoacheeSucceed])

    // useEffect(() => {
    //   console.log("feedbackStore.refreshData", feedbackStore.refreshData)

    //   if (feedbackStore.refreshData) {
    //     setTimeout(() => {
    //       // feedbackStore.getJournal(currentPage)
    //     }, 20)
    //   }
    // }, [
    //   feedbackStore.refreshData,

    // ])


    const createList = () => {
      const id = mainStore.userProfile.user_id
      let groupArrays = []
      if (feedbackStore.listJournal) {
        console.log("create list")
        console.log(feedbackStore.listJournal)
        const groups = feedbackStore.listJournal.reduce((groups, journalData) => {
          const date = journalData.journal_date.split("T")[0]
          if (!groups[date]) {
            groups[date] = []
          }
          groups[date].push({
            ...journalData,
            title: journalData.journal_title,
            type: journalData.journal_type,
            id: journalData.journal_id,
            isTagged: id !== journalData.coach_id,
            coach_id: journalData.coach_id,
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
      if (groupArrays) {
        setCoachingData(groupArrays)
        feedbackStore.setRefreshData(false)
        forceUpdate()
      }
    }

    const renderExistingCoachee = () => {
      return (
        <>
          <Text type={"left-header"} text="Existing Coachees." />
          <Spacer height={Spacing[12]} />
          <VStack horizontal={Spacing[24]} style={{ backgroundColor: Colors.WHITE, width: "100%", borderRadius: Spacing[20], height: Spacing[160] + Spacing[12], borderWidth: Spacing[1] }}>
            <FlatList
              refreshControl={
                <RefreshControl refreshing={false}
                  onRefresh={onRefreshExistingCoachee} />
              }
              data={existingCoacheeData}
              keyExtractor={item => item.coachee_id}
              showsVerticalScrollIndicator={true}
              renderItem={({ item, index }) => (
                <TouchableOpacity animationDuration={500}>
                  {/* <VStack style={{ borderTopWidth: index % 4 === 0 ? Spacing[0] : Spacing[1], paddingVertical: Spacing[12] }}>
                    <Text>{item.user_fullname}</Text>
                  </VStack> */}
                  <ExistingCoacheeComponent
                    data={item}
                    index={index}
                    onPressRequestFeedback={requestFeedback}
                    onPressExistingCoachee={holdExistingCoachee}
                    onPressPreviousFeedback={openPreviousFeedbackDateList}
                    selectedActivities={selectedExistingCoachee}
                    onPressNote={() => { }}
                    onPressFeedback={() => { }}
                    onPressNoteFeedback={() => { }}
                    goToCoaching={() => { }}
                  />
                </TouchableOpacity>
              )}
              onEndReached={onLoadMoreExistingCoachee}
              onEndReachedThreshold={0.1}
              style={{ paddingVertical: Spacing[2] }}
            />
          </VStack >

        </>
      )
    }

    const renderFeedbackRequests = () => {
      return (
        <>
          <Text type={"left-header"} text="Feedback Requests." />
          {/* </HStack> */}
          <Spacer height={Spacing[12]} />

          <VStack horizontal={Spacing[24]} style={{ backgroundColor: Colors.WHITE, width: "100%", borderRadius: Spacing[20], maxHeight: Spacing[160] + Spacing[10], borderWidth: Spacing[1], }}>
            <FlatList
              contentContainerStyle={{ paddingBottom: 50 * 10 }}
              refreshControl={
                <RefreshControl refreshing={false} onRefresh={onRefresh} />
              }
              
              scrollEnabled={false}
              data={MOCK_EXISTING_COACHEE}
              keyExtractor={item => item.coachee_id + 'feed'}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (

                <TouchableOpacity animationDuration={500}>
                  {/* <VStack style={{ borderTopWidth: index % 4 === 0 ? Spacing[0] : Spacing[1], paddingVertical: Spacing[12] }}>
                    <Text>{item.user_fullname}</Text>
                  </VStack> */}
                  <FeedbackRequestListComponent
                    data={item}
                    index={index}
                    onPressRequestFeedback={requestFeedback}
                    onPressActivity={holdFeedbackRequest}
                    selectedActivities={selectedFeedbackRequest}
                    onPressNote={() => { }}
                    onPressFeedback={() => { }}
                    onPressNoteFeedback={() => { }}
                    goToCoaching={() => { }}
                  />
                </TouchableOpacity>
              )}
            />

            {feedbackStore.isLoadingExistingCoachee ? (
              <VStack
                vertical={Spacing[12]}
                style={{ position: "absolute", bottom: 0, width: dimensions.screenWidth }}
              >
                <ActivityIndicator animating={feedbackStore.isLoadingExistingCoachee} />
              </VStack>
            ) : null}
          </VStack >

        </>
      )
    }

    const renderNotificationModal = () => {
      return (
        <VStack>
          <HStack bottom={Spacing[18]}>
            <Spacer />
            <MoodComponent data={modalIcon} width={Spacing[64]} height={Spacing[64]} />
            <Spacer />
          </HStack>
          <Text
            type={"body-bold"}
            style={{ fontSize: Spacing[24], textAlign: "center", color: Colors.ABM_GREEN }}
            text={modalTitle}
          />
          {/* <Spacer height={Spacing[12]} /> */}
          <Text type={"body"} style={{ textAlign: "center" }} text={modalDesc} />
          <Spacer height={Spacing[12]} />

          <HStack bottom={Spacing[24]}>
            <Spacer />
            <VStack style={{ maxWidth: Spacing[256], minWidth: Spacing[128] }}>
              <Button
                type={"primary"}
                text={"Kembali ke Menu Utama\nFeedback"}
                style={{ height: Spacing[54], paddingHorizontal: Spacing[8] }}
                textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                onPress={toggleModal.bind(this, false)}
              />
            </VStack>
            <Spacer />
          </HStack>
        </VStack>
      )
    }

    const renderPreviousFeedbackDatesModal = () => {
      return (
        <VStack style={{ padding: 0, width: '100%' }}>
          <HStack bottom={Spacing[8]} >
            <Text type={"header"} text="Pilih tanggal feedback" style={{ fontSize: Spacing[18] }} />
            <TouchableOpacity onPress={() => toggleModal(false)}>
              <IconClose height={Spacing[32]} width={Spacing[32]} />
            </TouchableOpacity>
          </HStack>
          <Spacer height={Spacing[12]} />
          <HStack style={{}}>
            <Spacer />
            <FlatList
              refreshControl={
                <RefreshControl refreshing={false}
                  onRefresh={onRefreshExistingCoachee} />
              }
              data={MOCK_PREVIOUS_FEEDBACK}
              keyExtractor={item => item.fu_id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity key={item.fu_id} onPress={() => { holdPreviousFeedbackDate(item.fu_id, index) }} style={{
                  height: Spacing[42], borderTopWidth: index === 0 ? Spacing[0] : Spacing[1], flex: 1,
                  justifyContent: "center",
                }}>

                  <Text type={"body"} style={{ lineHeight: Spacing[42], backgroundColor: selectedPreviousFeedbackCoachee === item.fu_id ? Colors.ABM_DARK_BLUE : Colors.WHITE, color: selectedPreviousFeedbackCoachee === item.fu_id ? Colors.WHITE : Colors.ABM_DARK_BLUE, paddingHorizontal: spacing[2], textAlign: "center" }}>{moment(item.fu_created_at).format('DD MMMM YYYY')}</Text>

                </TouchableOpacity>
              )}
              onEndReached={onLoadMoreExistingCoachee}
              onEndReachedThreshold={0.1}
              style={{ paddingVertical: Spacing[2], paddingHorizontal: 0, width: "70%", backgroundColor: Colors.YELLOW100 }}
            />
            <Spacer />
          </HStack>
          <Spacer height={Spacing[12]} />

          <HStack bottom={Spacing[24]}>
            <Spacer />
            <VStack style={{ maxWidth: Spacing[256], minWidth: Spacing[96] + Spacing[12] }}>
              <Button
                type={selectedPreviousFeedbackUser === "" ? "negative-white" : "primary"}
                text={"Pilih Tanggal"}
                style={{
                  height: Spacing[42], paddingHorizontal: Spacing[8], alignItems: "center",
                  justifyContent: "center",
                  borderRadius: Spacing[10]

                }}
                textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                onPress={openFeedbackDetail}
                disabled={selectedPreviousFeedbackUser === ""}
              />
            </VStack>
            <Spacer />
          </HStack>
        </VStack>
      )
    }

    return (
      <VStack
        testID="feedback"
        style={styles.bg}
      >
        <SafeAreaView style={Layout.flex}>
          <VStack style={{ backgroundColor: Colors.ABM_BG_BLUE }}>
            <ImageBackground source={images.feedbackBgPattern} style={{ height: '100%' }} resizeMode={"cover"}>
              <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
              <VStack top={Spacing[0]} horizontal={Spacing[24]} bottom={Spacing[12]}>
                <Text type={"header"} text="Feedback" />
                <Spacer height={Spacing[24]} />
                <Text type={"body"} style={{ textAlign: "center" }}>
                  <Text type={"body-bold"}>Lihat dan minta feedback </Text>
                  kepada coachee-mu. Coachee yang muncul di sini hanyalah coachee
                  <Text type={"body-bold"}> yang sudah pernah kamu tandai </Text>
                  di coaching journal-mu sebelumnya. Kamu juga dapat
                  <Text type={"body-bold"}> memberikan feedback </Text>
                  kepada coach-mu di sini.
                </Text>
                <Spacer height={Spacing[32]} />
                <VStack top={Spacing[8]} horizontal={Spacing[12]} bottom={Spacing[12]}>
                  {renderExistingCoachee()}
                  {/* <Spacer height={Spacing[24]} /> */}
                </VStack>
                {/* <Spacer height={Spacing[24]} /> */}
                <VStack top={Spacing[8]} horizontal={Spacing[12]} bottom={Spacing[12]}>
                  {renderFeedbackRequests()}
                  <Spacer height={Spacing[24]} />
                </VStack>

              </VStack>
            </ImageBackground>
            <Spacer height={Spacing[24]} />

          </VStack>

        </SafeAreaView>


        <Modal
          onClosed={() => toggleModal(false)}
          isOpen={isModalVisible}
          style={{
            height: "50%",
            width: dimensions.screenWidth - Spacing[24],
            backgroundColor: "rgba(52, 52, 52, 0)",
          }}

          onRequestClose={() => toggleModal(false)}
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
              <VStack horizontal={Spacing[24]} top={Spacing[12]} style={[Layout.widthFull, { justifyContent: "center" }]}>
                {modalType === 'notification' ? renderNotificationModal() : renderPreviousFeedbackDatesModal()}
              </VStack>
              {/* {modalType === 'notification' ? null : renderPreviousFeedbackDatesModal()} */}
            </VStack>
          </View>
        </Modal>

      </VStack>


    )
  })

export default FeedbackMain

const styles = StyleSheet.create({
  bg: {
    backgroundColor: Colors.ABM_BG_BLUE, flex: 1, justifyContent: "center"
  },
  bgBottom: { backgroundColor: Colors.WHITE, borderTopEndRadius: Spacing[0], borderTopStartRadius: Spacing[48], minHeight: dimensions.screenHeight * 1.5 }
});