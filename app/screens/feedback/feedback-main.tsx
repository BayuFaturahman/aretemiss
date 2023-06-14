import React, { FC, useCallback, useReducer, useState, useEffect } from "react"
import { FlatList, ImageBackground, RefreshControl, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native"
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
import { ExistingCoacheeModel } from "app/store/store.feedback"
import { ExistingCoacheeComponent } from "./components/existing-coachee-component"

import Modal from "react-native-modalbox"
import { MoodComponent } from "@screens/homepage/components/mood-component"
import { FeedbackRequestListComponent } from "./components/feedback-request-list-component"

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

const FeedbackMain: FC<StackScreenProps<NavigatorParamList, "feedbackMain">> =
  observer(({ navigation }) => {


    const [existingCoacheeData, setExistingCoacheeData] = useState<Array<ExistingCoacheeModel>>([])
    const [coachingData, setCoachingData] = useState<Array<CoachingJournalItem>>([])
    const [selectedFeedbackRequest, setSelectedFeedbackRequest] = useState<string>("")
    const [selectedExistingCoachee, setSelectedExistingCoachee] = useState<string>("")
    const [, forceUpdate] = useReducer((x) => x + 1, 0)
    const { mainStore, feedbackStore } = useStores()

    const [currentPage, setCurrentPage] = useState<number>(2)

    const [initialLoading, setInitialLoading] = useState<boolean>(true)

    const [isModalVisible, setModalVisible] = useState<boolean>(false)
    const [modalTitle, setModalTitle] = useState<string>("")
    const [modalDesc, setModalDesc] = useState<string>("")
    const [modalIcon, setModalIcon] = useState("senang")

    // const onLoadMore = React.useCallback(async () => {
    //   if (!feedbackStore.isLoading) {
    //     console.log("load more journal")
    //     await loadJournal(currentPage).then(r =>
    //       setCurrentPage(currentPage + 1))
    //   }
    // }, [currentPage, feedbackStore.isLoading])

    const setModalContent = (title: string, desc: string, icon: string) => {
      setModalTitle(title)
      setModalDesc(desc)
      setModalIcon(icon)
    }

    const toggleModal = (value: boolean) => {
      setModalVisible(value)
    }

    const loadJournal = async (page: number) => {
      await feedbackStore.getJournal(page)
    }

    const onRefresh = React.useCallback(async () => {
      setCurrentPage(2)
      firstLoadJournal()
    }, [])

    const goBack = () => {
      navigation.reset({
        routes: [{ name: "homepage" }],
      })
    }

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

    const requestFeedback = useCallback(
      (selectedId) => {
        if (isModalVisible) {
          // toggleModal(false)
        }
        console.log(`selectedId for requestFeedback: ${selectedId}`)

        setModalContent("Sukses!", "Feedback telah sukses direquest!", "senang")
        toggleModal(true)
        // setSelectedActivities(selectedId)
      },
      [selectedExistingCoachee],
    )

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

      setTimeout(() => {
        feedbackStore.listExistingCoachees = MOCK_EXISTING_COACHEE
        setInitialLoading(false)
        feedbackStore.setRefreshData(false)
        forceUpdate()
      }, 1500)
    }, 500)

    useEffect(() => {
      firstLoadExistingCoachee()
      setExistingCoacheeData(MOCK_EXISTING_COACHEE)
    }, [])

    // useEffect(() => {
    //   if (feedbackStore.listJournal) {
    //     createList()
    //   }
    // }, [feedbackStore.listJournal])

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
          {/* </HStack> */}
          <Spacer height={Spacing[12]} />

          <VStack horizontal={Spacing[24]} style={{ backgroundColor: Colors.WHITE, width: "100%", borderRadius: Spacing[20], maxHeight: Spacing[160] + Spacing[12], borderWidth: Spacing[1], }}>
            <FlatList
              contentContainerStyle={{ paddingBottom: 50 * 10 }}
              refreshControl={
                <RefreshControl refreshing={false} onRefresh={onRefresh} />
              }
              scrollEnabled={false}
              data={MOCK_EXISTING_COACHEE}
              keyExtractor={item => item.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity animationDuration={500}>
                  {/* <VStack style={{ borderTopWidth: index % 4 === 0 ? Spacing[0] : Spacing[1], paddingVertical: Spacing[12] }}>
                    <Text>{item.user_fullname}</Text>
                  </VStack> */}

                  <ExistingCoacheeComponent
                    data={item}
                    index={index}
                    onPressRequestFeedback={requestFeedback}
                    onPressActivity={holdExistingCoachee}
                    selectedActivities={selectedExistingCoachee}
                    onPressNote={() => { }}
                    onPressFeedback={() => { }}
                    onPressNoteFeedback={() => { }}
                    goToCoaching={() => { }}
                  />
                </TouchableOpacity>
              )}
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
              keyExtractor={item => item.toString()}
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
          </VStack >

        </>
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
              <VStack horizontal={Spacing[24]} top={Spacing[24]} style={Layout.widthFull}>
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
              </VStack>
            </VStack>
          </View>
        </Modal>

      </VStack>


      // <VStack
      //   testID="feedbackMain"
      //   style={{ backgroundColor: Colors.ABM_MAIN_BLUE, flex: 1, justifyContent: "center" }}
      // >
      //   <SafeAreaView style={Layout.flex}>
      //     <FlatList
      //       style={{ backgroundColor: Colors.WHITE }}
      //       refreshControl={
      //         <RefreshControl
      //           refreshing={false}
      //           onRefresh={onRefresh}
      //           tintColor={Colors.MAIN_RED}
      //         />
      //       }
      //       ItemSeparatorComponent={() => (
      //         <VStack style={{ backgroundColor: Colors.WHITE }}>
      //           <Spacer height={Spacing[24]} />
      //         </VStack>
      //       )}
      //       data={initialLoading ? [] : coachingData}
      //       // data={[]}
      //       ListEmptyComponent={() => feedbackStore?.isLoading || initialLoading ? <ActivityIndicator animating={true} /> : <EmptyList />}
      //       renderItem={({ item, index }) => (
      //         <VStack horizontal={Spacing[24]} style={{ backgroundColor: Colors.WHITE }}>
      //           {/* <CoachingJournalItemRender
      //             {...{ item, index }}
      //             onPressActivity={holdActivitiesId}
      //             selectedActivities={selectedActivities}
      //             onPressNote={goToNote}
      //             onPressFeedback={goToFeedback}
      //             onPressNoteFeedback={goToNoteFeedback}
      //           /> */}
      //         </VStack>
      //       )}
      //       keyExtractor={(item) => item.date}
      //       ListHeaderComponent={
      //         <VStack style={{ backgroundColor: Colors.ABM_BG_BLUE }}>
      //           <ImageBackground source={images.feedbackBgPattern} style={{ width: '100%', height: '100%' }} resizeMode={"cover"}>
      //             <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
      //             <VStack top={Spacing[0]} horizontal={Spacing[24]} bottom={Spacing[12]}>
      //               <Text type={"header"} text="Feedback" />
      //               <Spacer height={Spacing[24]} />
      //               <Text type={"body"} style={{ textAlign: "center" }}>
      //                 Setiap coaching journal yang dicatat akan memberikan kesempatan bagi coachee-mu
      //                 untuk memberikan{" "}
      //                 <Text type={"label"} style={{ color: Colors.WHITE }}>
      //                   feedback
      //                 </Text>
      //                 , sehingga kamu dapat terus melakukan improvement.
      //               </Text>
      //               <Spacer height={Spacing[32]} />
      //               <VStack top={Spacing[8]} horizontal={Spacing[12]} bottom={Spacing[12]}>
      //                 {/* <NewButton onPress={newEntry} /> */}
      //                 {/* {coachingData.length === 0 && !initialLoading && !feedbackStore.isLoading ? (
      //                   <FastImage
      //                     style={{
      //                       height: Spacing[96],
      //                       width: Spacing[96],
      //                       left: dimensions.screenWidth / 2 + Spacing[32],
      //                       top: Spacing[24],
      //                       zIndex: 20,
      //                       position: "absolute",
      //                     }}
      //                     source={arrowYellow}
      //                     resizeMode={"contain"}
      //                   />
      //                 ) : null} */}
      //                 <Text type={"left-header"} text="Existing Coachees." />

      //                 <Spacer height={Spacing[24]} />
      //               </VStack>

      //             </VStack>
      //           </ImageBackground>
      //           <Spacer height={Spacing[24]} />

      //         </VStack>
      //       }
      //       ListFooterComponent={
      //         coachingData.length === 0 && !initialLoading && !feedbackStore.isLoading ? null : (
      //           <VStack vertical={Spacing[24]} style={{ backgroundColor: Colors.WHITE }}>
      //             {initialLoading ? null : <ActivitiesTypeLegends />}
      //           </VStack>
      //         )
      //       }
      //       // onEndReached={onLoadMore}
      //       onEndReachedThreshold={0.1}
      //     />
      //     {/* {feedbackStore?.isLoading ? (
      //       <VStack
      //         vertical={Spacing[12]}
      //         style={{ position: "absolute", bottom: 0, width: dimensions.screenWidth }}
      //       >
      //         <ActivityIndicator animating={feedbackStore.isLoading} />
      //       </VStack>
      //     ) : null} */}
      //   </SafeAreaView>
      // </VStack>
    )
  })

export default FeedbackMain

const styles = StyleSheet.create({
  bg: {
    backgroundColor: Colors.ABM_BG_BLUE, flex: 1, justifyContent: "center"
  },
  bgBottom: { backgroundColor: Colors.WHITE, borderTopEndRadius: Spacing[0], borderTopStartRadius: Spacing[48], minHeight: dimensions.screenHeight * 1.5 }
});