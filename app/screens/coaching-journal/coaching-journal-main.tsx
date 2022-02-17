import React, { FC, useCallback, useReducer, useState, useEffect } from "react"
import { ActivityIndicator, FlatList, RefreshControl, SafeAreaView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, BackNavigation } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"
import moment from "moment"

import { CoachingJournalItemRender } from "@screens/coaching-journal/components/coaching-journal-item-render"
import { CoachingJournalItem } from "@screens/coaching-journal/coaching-journal.type"
import { ActivitiesTypeLegends } from "@screens/coaching-journal/components/activities-type-legends"
import { NewButton } from "@screens/coaching-journal/components/new-button"
import FastImage from "react-native-fast-image"
import { useStores } from "../../bootstrap/context.boostrap"

import arrowYellow from "@assets/icons/coachingJournal/empty/arrow-yellow.png"
import { dimensions } from "@config/platform.config"
import { EmptyList } from "@screens/coaching-journal/components/empty-list"
import {debounce} from "lodash";

const CoachingJournalMain: FC<StackScreenProps<NavigatorParamList, "coachingJournalMain">> =
  observer(({ navigation }) => {
    const [coachingData, setCoachingData] = useState<Array<CoachingJournalItem>>([])
    const [selectedActivities, setSelectedActivities] = useState<string>("")
    const [, forceUpdate] = useReducer((x) => x + 1, 0)
    const { mainStore, coachingStore } = useStores()

    const [currentPage, setCurrentPage] = useState<number>(2)

    const onLoadMore = React.useCallback(async () => {
      console.log("load more journal")
      await loadJournal(currentPage)
      setCurrentPage(currentPage + 1)
    }, [currentPage])

    const loadJournal = async (page: number) => {
      await coachingStore.getJournal(page)
    }

    const onRefresh = React.useCallback(async () => {
      setCoachingData([])
      setCurrentPage(2)
      firstLoadJournal()
    }, [])

    const goBack = () => {
      navigation.reset({
        routes: [{ name: "homepage" }],
      })
    }

    const newEntry = () => {
      coachingStore.isDetailJournal(false)
      coachingStore.setFormCoach(true)
      navigation.navigate("newJournalEntry", {
        isDetail: false,
      })
    }

    const holdActivitiesId = useCallback(
      (selectedId) => {
        setSelectedActivities(selectedId)
        // forceUpdate()
      },
      [selectedActivities],
    )

    const goToNote = useCallback((id, coach_id) => {
      console.log(id)
      coachingStore.isDetailJournal(true)
      const detailCoaching = coach_id === mainStore.userProfile.user_id
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
      const detailCoaching = coach_id === mainStore.userProfile.user_id
      coachingStore.setDetailCoaching(detailCoaching)
      coachingStore.setDetailID(id)
      coachingStore.setFormCoach(false)
      console.log("goToNoteFeedback coach_id", coach_id)
      console.log("goToNoteFeedback user_id", mainStore.userProfile.user_id)

      navigation.navigate("overviewJournalEntry", {
        journalId: id,
        isCoachee: true,
      })
    }, [])

    const firstLoadJournal = debounce( async () => {
      await coachingStore.clearJournal()
      await loadJournal(1)
    }, 500)

    useEffect(() => {
      firstLoadJournal()
    }, [])

    useEffect(() => {
      if (coachingStore.listJournal) {
        createList()
      }
    }, [coachingStore.listJournal])

    useEffect(() => {
      console.log("coachingStore.refreshData", coachingStore.refreshData)

      if (coachingStore.refreshData) {
        setTimeout(() => {
          coachingStore.getJournal(currentPage)
        }, 20)
      }
    }, [
      coachingStore.refreshData,
      coachingStore.createJournalSucceed,
      coachingStore.createFeedbackSucced,
    ])

    const createList = () => {
      const id = mainStore.userProfile.user_id
      let groupArrays = []
      if (coachingStore.listJournal) {
        console.log("create list")
        console.log(coachingStore.listJournal)
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
        coachingStore.setRefreshData(false)
        forceUpdate()
      }
    }

    return (
      <VStack
        testID="CoachingJournalMain"
        style={{ backgroundColor: Colors.UNDERTONE_BLUE, flex: 1, justifyContent: "center" }}
      >
        <SafeAreaView style={Layout.flex}>
          <FlatList
            style={{ backgroundColor: Colors.WHITE }}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={onRefresh}
                tintColor={Colors.MAIN_RED}
              />
            }
            ItemSeparatorComponent={() => (
              <VStack style={{ backgroundColor: Colors.WHITE }}>
                <Spacer height={Spacing[24]} />
              </VStack>
            )}
            data={coachingData}
            ListEmptyComponent={() => <EmptyList />}
            renderItem={({ item, index }) => (
              <VStack horizontal={Spacing[24]} style={{ backgroundColor: Colors.WHITE }}>
                <CoachingJournalItemRender
                  {...{ item, index }}
                  onPressActivity={holdActivitiesId}
                  selectedActivities={selectedActivities}
                  onPressNote={goToNote}
                  onPressFeedback={goToFeedback}
                  onPressNoteFeedback={goToNoteFeedback}
                />
              </VStack>
            )}
            keyExtractor={(item) => item.date}
            ListHeaderComponent={
              <VStack style={{ backgroundColor: Colors.UNDERTONE_BLUE }}>
                <BackNavigation goBack={goBack} />
                <VStack top={Spacing[8]} horizontal={Spacing[24]} bottom={Spacing[12]}>
                  <Text type={"header"} style={{ color: Colors.WHITE }} text="Coaching Journal" />
                  <Spacer height={Spacing[24]} />
                  <Text type={"body"} style={{ textAlign: "center", color: Colors.WHITE }}>
                    Setiap coaching journal yang dicatat akan memberikan kesempatan bagi coachee-mu
                    untuk memberikan{" "}
                    <Text type={"label"} style={{ color: Colors.WHITE }}>
                      feedback
                    </Text>
                    , sehingga kamu dapat terus melakukan improvement.
                  </Text>
                  <Spacer height={Spacing[32]} />
                </VStack>
                <VStack
                  style={{
                    backgroundColor: Colors.WHITE,
                    borderTopStartRadius: Spacing[48],
                    borderTopEndRadius: Spacing[48],
                    bottom: -1,
                  }}
                >
                  <NewButton onPress={newEntry} />
                  {coachingData.length === 0 ? (
                    <FastImage
                      style={{
                        height: Spacing[96],
                        width: Spacing[96],
                        left: dimensions.screenWidth / 2 + Spacing[32],
                        top: Spacing[24],
                        zIndex: 20,
                        position: "absolute",
                      }}
                      source={arrowYellow}
                      resizeMode={"contain"}
                    />
                  ) : null}
                  <Spacer height={Spacing[42]} />
                  <HStack horizontal={Spacing[24]}>
                    <Text type={"left-header"} text="Catatan coaching journal" />
                  </HStack>
                  <Spacer height={Spacing[24]} />
                </VStack>
              </VStack>
            }
            ListFooterComponent={
              coachingData.length === 0 ? null : (
                <VStack vertical={Spacing[24]} style={{ backgroundColor: Colors.WHITE }}>
                  <ActivitiesTypeLegends />
                </VStack>
              )
            }
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.1}
          />
          {coachingStore.isLoading ? (
            <VStack
              vertical={Spacing[12]}
              style={{ position: "absolute", bottom: 0, width: dimensions.screenWidth }}
            >
              <ActivityIndicator animating={coachingStore.isLoading} />
            </VStack>
          ) : null}
        </SafeAreaView>
      </VStack>
    )
  })

export default CoachingJournalMain
