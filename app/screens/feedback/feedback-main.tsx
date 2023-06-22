import React, { FC, useCallback, useReducer, useState, useEffect } from "react"
import { ActivityIndicator, FlatList, ImageBackground, RefreshControl, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, BackNavigation, Button } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"
import moment from "moment"

import { useStores } from "../../bootstrap/context.boostrap"

import { dimensions } from "@config/platform.config"
import { debounce } from "lodash";
import { images } from "@assets/images";
import { ExistingCoacheeModel, FeedbackUserDetailModel, RequestFeedbackUserModel } from "app/store/store.feedback"
import { ExistingCoacheeComponent } from "./components/existing-coachee-component"

import Modal from "react-native-modalbox"
import { MoodComponent } from "@screens/homepage/components/mood-component"
import { FeedbackRequestListComponent } from "./components/feedback-request-list-component"
import { IconClose } from "@assets/svgs"
import { spacing } from "@theme/spacing"
import Spinner from 'react-native-loading-spinner-overlay';
import { EmptyList } from "./components/empty-list"

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

]

const MOCK_LIST_REQUEST_FEEDBACK: RequestFeedbackUserModel[] = [
  {
    "rfu_user_from_id": "8c61265f-d2ba-469b-8c6e-96cb75e69ee4",
    "user_fullname": "Pol1"
  },
  {
    "rfu_user_from_id": "8c61265f-d2ba-469b-8c6e-96cb75e69ee1",
    "user_fullname": "Pol2"
  },
  {
    "rfu_user_from_id": "8c61265f-d2ba-469b-8c6e-96cb75e69ee2",
    "user_fullname": "Pol3"
  },
  {
    "rfu_user_from_id": "8c61265f-d2ba-469b-8c6e-96cb75e69ee3",
    "user_fullname": "Pol44"
  },
  {
    "rfu_user_from_id": "8c61265f-d2ba-469b-8c6e-96cb75e69ee4",
    "user_fullname": "Pol5"
  },
  {
    "rfu_user_from_id": "8c61265f-d2ba-469b-8c6e-96cb75e69ee5",
    "user_fullname": "Pol6"
  }
]

const FeedbackMain: FC<StackScreenProps<NavigatorParamList, "feedbackMain">> =
  observer(({ navigation }) => {


    const [existingCoacheeData, setExistingCoacheeData] = useState<Array<ExistingCoacheeModel>>([])
    const [listFeedbackUser, setListFeedbackUser] = useState<Array<FeedbackUserDetailModel>>([])

    const [listRequestFeedbackUser, setListRequestFeedbackUser] = useState<Array<RequestFeedbackUserModel>>([])


    const [selectedFeedbackRequest, setSelectedFeedbackRequest] = useState<string>("")
    const [selectedExistingCoachee, setSelectedExistingCoachee] = useState<string>("")


    const [selectedPreviousFeedbackUserByCoachee, setSelectedPreviousFeedbackUserByCoachee] = useState<string>("") // Feedback User ID
    const [selectedPreviousFeedbackUser, setSelectedPreviousFeedbackUser] = useState<string>("") // Coachee ID
    const [selectedPreviousFeedbackDetail, setSelectedPreviousFeedbackDetail] = useState<FeedbackUserDetailModel>()

    const [currentPageExistingCoachee, setCurrentPageExistingCoachee] = useState<number>(2)
    const [currentPageFeedbackRequest, setCurrentPageFeedbackRequest] = useState<number>(2)
    const [currentPageListFeedbackUserByCoachee, setCurrentPageListFeedbackUserByCoachee] = useState<number>(2)

    const [, forceUpdate] = useReducer((x) => x + 1, 0)
    const { mainStore, feedbackStore } = useStores()

    const [currentPage, setCurrentPage] = useState<number>(2)


    const [initialLoading, setInitialLoading] = useState<boolean>(true)
    const [initialLoadingFeedbackRequest, setInitialLoadingFeedbackRequest] = useState<boolean>(true)

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
        setModalType("")
      }
    }

    const goBack = () => {
      navigation.reset({
        routes: [{ name: "homepage" }],
      })
    }

    const loadExistingCoachee = async (page: number) => {
      await feedbackStore.getListExistingCoachee(page)
      setExistingCoacheeData(feedbackStore.listExistingCoachees)
    }

    const loadFeedbackUserByCoachee = async (coacheeId: string, page: number) => {
      console.log('coacheeId: ', coacheeId)
      if (coacheeId !== '') {
        await feedbackStore.getListFeedbackUserByCoachee(coacheeId, page)
        setListFeedbackUser(feedbackStore.listFeedbackUserByCoachee)
        // console.log(`selectedPreviousFeedbackUserByCoachee: `, selectedPreviousFeedbackUserByCoachee)
        // console.log(`feedbackStore.listFeedbackUserByCoachee: `, feedbackStore.listFeedbackUserByCoachee)
      }
    }

    const loadListRequestFeedbackUser = async (page: number) => {
      console.log(`loadListRequestFeedbackUser page ${page}`)
      await feedbackStore.getListRequestFeedbackUser(page)
      setListRequestFeedbackUser(feedbackStore.listRequestFeedbackUser)
    }

    const requestFeedbackToCoachee = async () => {
      console.log('selectedPreviousFeedbackUser ', selectedExistingCoachee)
      await feedbackStore.requestFeedbackUser(selectedExistingCoachee)
    }

    const onRefresh = React.useCallback(async () => {
      setCurrentPage(2)
      firstLoadExistingCoachee()
    }, [])

    const onRefreshExistingCoachee = React.useCallback(async () => {
      setCurrentPageExistingCoachee(2)
      firstLoadExistingCoachee()
    }, [])

    const onRefreshFeedbackUserByCoachee = React.useCallback(async () => {
      setCurrentPageListFeedbackUserByCoachee(2)
      firstLoadFeedbackUserByCoachee()
    }, [])

    const onRefreshFeedbackRequest = React.useCallback(async () => {
      setCurrentPageFeedbackRequest(2)
      firstLoadListRequestFeedbackUser()
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

    const onLoadMoreFeedbackUserByCoachee = React.useCallback(async () => {
      console.log('onLoadMoreFeedbackUserByCoachee ', currentPageListFeedbackUserByCoachee)
      if (!feedbackStore.isLoadingListFeedbackUserByCoachee) {
        console.log("load more feedback user by coachee ", currentPageListFeedbackUserByCoachee)
        await loadFeedbackUserByCoachee(selectedPreviousFeedbackUserByCoachee, currentPageListFeedbackUserByCoachee)
        setCurrentPageListFeedbackUserByCoachee(currentPageListFeedbackUserByCoachee + 1)
      }
    }, [currentPageListFeedbackUserByCoachee])

    const onLoadMoreFeedbackRequest = React.useCallback(async () => {
      console.log('---onLoadMoreFeedbackRequest ', currentPageFeedbackRequest)
      if (!feedbackStore.isLoadingListRequetsFeedbackUser) {
        console.log("load more existing coachees ", currentPageFeedbackRequest)
        await loadListRequestFeedbackUser(currentPageFeedbackRequest)
        setCurrentPageListFeedbackUserByCoachee(currentPageFeedbackRequest + 1)
      }
    }, [currentPageFeedbackRequest])


    useEffect(() => {
      console.log('currentPageListFeedbackUserByCoachee: ', currentPageListFeedbackUserByCoachee)
    }, [currentPageListFeedbackUserByCoachee])

    const holdFeedbackRequest = useCallback(
      (selectedId) => {
        console.log(`holdFeedbackRequest selectedId: ${selectedId}`)
        // setTimeout(() => {
        setSelectedFeedbackRequest(selectedId)
        // }, 400);
        setSelectedExistingCoachee('')
      },
      [selectedFeedbackRequest],
    )

    const holdExistingCoachee = useCallback(
      (selectedId) => {
        console.log(`holdExistingCoachee selectedId: ${selectedId}`)
        setSelectedExistingCoachee(selectedId)
        setSelectedFeedbackRequest('')
      },
      [selectedExistingCoachee],
    )

    const holdPreviousFeedbackDate = useCallback(
      (selectedId, index) => {
        console.log(`holdPreviousFeedbackDate selectedId: ${selectedId}`)
        setSelectedPreviousFeedbackUserByCoachee(selectedId)
        setSelectedPreviousFeedbackUser(selectedId)
        setSelectedExistingCoachee('')
        setSelectedPreviousFeedbackDetail(listFeedbackUser[index])
      },
      [selectedFeedbackRequest],
    )

    const requestFeedback = useCallback(
      (selectedId) => {
        console.log(`selectedId for requestFeedback: ${selectedId}`)
        requestFeedbackToCoachee()

        setModalType("notification")
        if (feedbackStore.messageRequestFeedback == "Success" || feedbackStore.errorCode === null) {
          resetSelectedIndicator()
          feedbackStore.setRefreshData(true)
          setModalContent("Sukses!", "Feedback telah sukses direquest!", "senang")
        } else {
          setModalContent("Ada Kesalahan!", "Ups! Sepertinya ada kesalahan!\nSilahkan coba lagi!", "sedih")
        }
        toggleModal(true)

      },
      [selectedExistingCoachee],
    )

    const openListPreviousFeedbackDateModal = useCallback(
      async (selectedId) => {
        if (selectedId !== '' && selectedId !== null) {
          feedbackStore.clearFeedbackUserByCoachee()
          await loadFeedbackUserByCoachee(selectedId, 1)
          setModalType("previousFeedbackDates")
          toggleModal(true)
        }
      },
      [selectedExistingCoachee],
    )

    const resetSelectedIndicator = () => {
      setSelectedPreviousFeedbackUserByCoachee("")
      setSelectedPreviousFeedbackUser("")
      setSelectedExistingCoachee("")
    }

    const goToFeedbackDetail = (isFeedbackRequest: boolean = false) => {
      navigation.navigate("feedbackDetail", {
        id: isFeedbackRequest ? selectedFeedbackRequest : selectedPreviousFeedbackUserByCoachee,
        isFeedbackRequest: isFeedbackRequest
      })
    }

    const openFeedbackDetail = () => {
      toggleModal(false)
      goToFeedbackDetail()
    }

    const openFillFeedbackPage = () => {
      goToFeedbackDetail(true)
      console.log('openFillFeedbackPage')
    }

    const firstLoadExistingCoachee = debounce(async () => {
      console.log(`firstLoadExistingCoachee`)
      await feedbackStore.clearFeedback()

      await loadExistingCoachee(1)
      // feedbackStore.listExistingCoachees = MOCK_EXISTING_COACHEE
      setInitialLoading(false)
      feedbackStore.setRefreshData(false)
      forceUpdate()

    }, 500)

    const firstLoadFeedbackUserByCoachee = debounce(async () => {
      console.log(`firstLoadFeedbackUserByCoachee`)
      await feedbackStore.clearFeedbackUserByCoachee()

      setTimeout(async () => {
        await loadFeedbackUserByCoachee(selectedPreviousFeedbackUser, 1)
        // feedbackStore.listExistingCoachees = MOCK_EXISTING_COACHEE
        setInitialLoading(false)
        feedbackStore.setRefreshData(false)
        forceUpdate()
      }, 500);

    }, 500)

    const firstLoadListRequestFeedbackUser = debounce(async () => {
      console.log(`firstLoadRequestFeedbackUser`)
      await feedbackStore.clearListRequestFeedback()
      await loadListRequestFeedbackUser(1)
      // feedbackStore.listExistingCoachees = MOCK_EXISTING_COACHEE
      setInitialLoadingFeedbackRequest(false)
      feedbackStore.setRefreshData(false)
      forceUpdate()

    }, 500)


    useEffect(() => {
      firstLoadExistingCoachee()
      firstLoadListRequestFeedbackUser()
      console.log('use effect firstLoadExistingCoachee')
      // setExistingCoacheeData(feedbackStore.listExistingCoachees)
    }, [])

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
              ListEmptyComponent={() => initialLoading ? <Spinner visible={feedbackStore.isLoadingExistingCoachee} /> : <EmptyList navigateTo={goBack} />}
              renderItem={({ item, index }) => (
                <TouchableOpacity animationDuration={500}>
                  <ExistingCoacheeComponent
                    data={item}
                    index={index}
                    onPressRequestFeedback={requestFeedback}
                    onPressExistingCoachee={holdExistingCoachee}
                    onPressPreviousFeedback={openListPreviousFeedbackDateModal}
                    selectedCoachee={selectedExistingCoachee}
                  />
                </TouchableOpacity>
              )}
              ListFooterComponent={
                <Spinner
                  visible={feedbackStore.isLoadingExistingCoachee}
                />
              }
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
          <Spacer height={Spacing[12]} />

          <VStack horizontal={Spacing[24]} style={{ backgroundColor: Colors.WHITE, width: "100%", borderRadius: Spacing[20], height: Spacing[160] + Spacing[12], maxHeight: Spacing[160] + Spacing[12], borderWidth: Spacing[1] }}>
            <FlatList
              refreshControl={
                <RefreshControl refreshing={false} onRefresh={onRefreshFeedbackRequest} />
              }
              data={listRequestFeedbackUser}
              keyExtractor={item => item.rfu_user_from_id + 'feedback'}
              showsVerticalScrollIndicator={true}
              ListEmptyComponent={() => initialLoading ? <Spinner visible={feedbackStore.isLoadingListRequetsFeedbackUser} /> : <EmptyList navigateTo={goBack} description="Belum ada request feedback!\nKembali lagi saat sudah ada Feedback Request ya!" />}
              renderItem={({ item, index }) => (
                <TouchableOpacity animationDuration={500}>
                  <FeedbackRequestListComponent
                    data={item}
                    index={index}
                    selectedId={selectedFeedbackRequest}
                    onPressActivity={holdFeedbackRequest}
                    onPressFillFeedback={openFillFeedbackPage}
                  />
                </TouchableOpacity>
              )}
              ListFooterComponent={
                <Spinner
                  visible={feedbackStore.isLoadingExistingCoachee}
                />
              }
              onEndReached={onLoadMoreFeedbackRequest}
              onEndReachedThreshold={0.1}
              style={{ paddingVertical: Spacing[2] }}
            />
          </VStack >

        </>
      )
    }

    const renderNotificationModal = () => {
      return (
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
                    onPress={closeNotificationModal}
                  />
                </VStack>
                <Spacer />
              </HStack>
            </VStack>
          </VStack>
          {/* {modalType === 'notification' ? null : renderPreviousFeedbackDatesModal()} */}
        </VStack>

      )
    }

    const renderFeedbackDatesModal = () => {
      return (
        <VStack
          style={{
            backgroundColor: Colors.WHITE,
            borderRadius: Spacing[48],
            minHeight: Spacing[256],
            alignItems: "center",
            justifyContent: "center",

          }}
          // horizontal={Spacing[24]}
          vertical={Spacing[24]}
        >
          <VStack horizontal={Spacing[24]} top={Spacing[12]} bottom={Spacing[12]} style={[Layout.widthFull, { justifyContent: "center" }]}>
            {/* <VStack style={{
              padding: 0, width: '100%', backgroundColor: Colors.RED100
            }}> */}
            <HStack bottom={Spacing[8]} horizontal={Spacing[24]} >
              <Text type={"header"} text="Pilih tanggal feedback" style={{ fontSize: Spacing[18] }} />
              <TouchableOpacity onPress={() => toggleModal(false)}>
                <IconClose height={Spacing[32]} width={Spacing[32]} />
              </TouchableOpacity>
              <Spacer />
            </HStack>

            {/* </VStack> */}
          </VStack>

          <VStack style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            width: '100%',
            backgroundColor: Colors.WHITE,
          }}>
            <Spacer height={Spacing[12]} />
            <HStack style={{
              minHeight: Spacing[96], maxHeight: Spacing[128],
            }}>
              <Spacer />
              <FlatList
                refreshControl={
                  <RefreshControl refreshing={false}
                    onRefresh={onRefreshFeedbackUserByCoachee} />
                }
                data={listFeedbackUser}
                keyExtractor={item => item.fu_id}
                showsVerticalScrollIndicator={true}
                renderItem={({ item, index }) => (
                  <TouchableOpacity key={item.fu_id} onPress={() => { holdPreviousFeedbackDate(item.fu_id, index) }} style={{
                    height: Spacing[42], borderTopWidth: index === 0 ? Spacing[0] : Spacing[1], flex: 1,
                    justifyContent: "center",
                  }}>
                    <Text type={"body"} style={{ lineHeight: Spacing[42], backgroundColor: selectedPreviousFeedbackUserByCoachee === item.fu_id ? Colors.ABM_DARK_BLUE : Colors.WHITE, color: selectedPreviousFeedbackUserByCoachee === item.fu_id ? Colors.WHITE : Colors.ABM_DARK_BLUE, paddingHorizontal: spacing[2], textAlign: "center" }}>{moment(item.fu_created_at).format('DD MMMM YYYY')}</Text>
                  </TouchableOpacity>
                )}
                onEndReached={onLoadMoreFeedbackUserByCoachee}
                onEndReachedThreshold={0.2}
                style={{
                  paddingVertical: Spacing[2], paddingHorizontal: 0, width: "70%"
                }}
              />
              <Spacer />
            </HStack>
            <Spacer height={Spacing[12]} />
          </VStack>

          <HStack bottom={Spacing[24]} top={Spacing[16]}>
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
          {/* {modalType === 'notification' ? null : renderPreviousFeedbackDatesModal()} */}
        </VStack>

      )
    }

    const closeNotificationModal = () => {
      feedbackStore.clearRequestFeedback()
      toggleModal(false)
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
                </VStack>
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
            {/* <VStack
              style={{
                backgroundColor: Colors.ORANGE100,
                borderRadius: Spacing[48],
                minHeight: Spacing[256],
                alignItems: "center",
                justifyContent: "center",

              }}
              horizontal={Spacing[24]}
              vertical={Spacing[24]}
            >
              <VStack horizontal={Spacing[24]} top={Spacing[12]} style={[Layout.widthFull, { justifyContent: "center", backgroundColor: Colors.ABM_GREEN }]}>
                
              </VStack>
              {modalType === 'notification' ? null : renderPreviousFeedbackDatesModal()}
            </VStack> */}
            {modalType === 'notification' ? renderNotificationModal() : renderFeedbackDatesModal()}
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