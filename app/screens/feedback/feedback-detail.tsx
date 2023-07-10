import React, { FC, useReducer, useState, useEffect, useCallback } from "react"
import { KeyboardAvoidingView, RefreshControl, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, Button } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"
import Spinner from "react-native-loading-spinner-overlay"
import { useStores } from "../../bootstrap/context.boostrap"
import { dimensions } from "@config/platform.config"

import { FeedbackUserDetail } from "./feedback.type"
import { CreateFeedbackUserModel } from "app/store/store.feedback"
import Modal from "react-native-modalbox"
import { MoodComponent } from "@screens/homepage/components/mood-component"

type ChoiceItemType = {
    id: string
    title: string
    choice: 0 | 1 | 2 | 3 | 4 | 5
}

const MOCK_FEEDBACK_USER_DETAIL: FeedbackUserDetail = {
    "id": "a45c9dd6-e2f6-4b85-92f4-6b067331ff22",
    "q1": 5,
    "q2": 1,
    "q3": 4,
    "q4": 5,
    "q5": 1,
    "q6": 1,
    "from": "coachee",
    "coachId": "61d8bf7f-777c-4227-9050-82ef768611d7",
    "coacheeId": "61d8bf7f-777c-4227-9050-82ef768611d7",
    "fu_created_at": "2023-06-13T09:23:24.000Z",
    "fu_updated_at": "2023-06-13T09:23:24.000Z",
    "fu_deleted_at": null,
    "has_commitment": 0
}

const EMPTY_FEEDBACK_USER_DETAIL = {
    id: '',
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
    q5: 0,
    q6: 0,
    from: '',
    coachId: '',
    coacheeId: '',
    fu_created_at: '',
    fu_updated_at: '',
    fu_deleted_at: '',
    has_commitment: 0
}


const FeedbackDetail: FC<StackScreenProps<NavigatorParamList, "feedbackDetail">> =
    observer(({ navigation, route }) => {

        const { id, coachId, isFeedbackRequest } = route.params;

        const [feedbackUserDetail, setFeedbackUserDetail] = useState<FeedbackUserDetail>()

        const [isSubmitClicked, setIsSubmitClicked] = useState(false)
        const [isError, setIsError] = useState(false)
        const [errorList, setErrorList] = useState(new Array(6).fill(0))
        const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
        const [isLoading, setIsLoading] = useState(false)

        const [feedbackQuestionChoice, setFeedbackQuestionChoice] = useState(new Array(6).fill(0))

        const [title, setTitle] = useState<string>('')
        const [subjectFeedback, setSubjectFeedback] = useState<string>('')
        const [submitButtonText, setSubmitButtonText] = useState<string>('')


        const [, forceUpdate] = useReducer((x) => x + 1, 0)
        const { mainStore, feedbackStore } = useStores()

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
                // resetSelectedIndicator()
                setModalType("")
            }
        }

        const closeNotificationModal = () => {
            toggleModal(false)
            if (isSubmitSuccess) {
                navigation.navigate("feedbackMain")
            }
        }


        const goBack = () => {
            navigation.goBack()
        }

        const goToFeedbacCommitment = () => {
            navigation.navigate("feedbackCommitment", {
                feedbackUserId: feedbackUserDetail.id
            })
        }

        const loadFeedbackUserDetail = async () => {
            await feedbackStore.getFeedbackUserDetail(id)
        }

        const createFeedbackUser = async (data: CreateFeedbackUserModel) => {
            await feedbackStore.createFeedbackUser(data)
        }

        useEffect(() => {
            setFeedbackUserDetail(EMPTY_FEEDBACK_USER_DETAIL)

            if (isFeedbackRequest) {
                setTitle('Feedback untuk Coach.')
                setSubmitButtonText('Submit Feedback')
                setSubjectFeedback('coach-mu')
                // let tempChoice = new Array(4).fill(0)
                setFeedbackQuestionChoice(new Array(6).fill(0))

            } else {
                setTitle('Feedback results.')
                setSubmitButtonText('Komitmen Saya')
                setSubjectFeedback('saya')
                loadFeedbackUserDetail()
            }

            forceUpdate()
            // console.log(errorList)
            // console.log(`feedbackUserDetail: ${JSON.stringify(feedbackUserDetail)}`)
            // console.log('use effect loadFeedbackUserDetail')
        }, [isFeedbackRequest])

        useEffect(() => {
            if (feedbackStore.feedbackUserDetail) {
                setFeedbackUserDetail(feedbackStore.feedbackUserDetail)
                let tempChoice = new Array(4).fill(0)
                tempChoice[0] = feedbackStore.feedbackUserDetail.q1
                tempChoice[1] = feedbackStore.feedbackUserDetail.q2
                tempChoice[2] = feedbackStore.feedbackUserDetail.q3
                tempChoice[3] = feedbackStore.feedbackUserDetail.q4
                tempChoice[4] = feedbackStore.feedbackUserDetail.q5
                tempChoice[5] = feedbackStore.feedbackUserDetail.q6
                setFeedbackQuestionChoice(tempChoice)
            }
            // console.log(`feedbackStore.feedbackUserDetail , ${feedbackStore.feedbackUserDetail}`)
        }, [feedbackStore.feedbackUserDetail, feedbackStore.getFeedbackUserDetailSucceedd])

        const renderHeader = () => {
            if (isFeedbackRequest) {
                return (
                    <>
                        <Text type={"body-bold"} style={{ textAlign: "center", fontSize: Spacing[12], bottom: Spacing[12] }}>
                            Berilah penilaian untuk coach-mu dengan memberi rating pada pernyataan berikut ini sesuai dengan sesi coaching yang sudah kamu lakukan.
                        </Text>
                        <Text type={"body"} style={{ textAlign: "center", fontSize: Spacing[12] }}>
                            <Text type={"body-bold"}>Penting! </Text>
                            Catatan coaching-mu belum tersimpan sampai kamu klik <Text type={"body-bold"} style={{ color: Colors.ABM_GREEN }}> Submit </Text>di bawah halaman ini.
                        </Text>
                    </>
                )
            } else {
                return (
                    <Text type={"body-bold"} style={{ textAlign: "center", fontSize: Spacing[14] }}>
                        Berikut adalah hasil feedback sudah dinilai oleh anggota tim-mu.
                    </Text>
                )
            }
        }

        const selectFeedbackItem = useCallback((id, choice) => {
            const tempChoice = Array.from(feedbackQuestionChoice)
            tempChoice[id] = choice

            setFeedbackQuestionChoice(tempChoice)
            // console.log(`selectFeedbackItem tempChoice: ${JSON.stringify(tempChoice)} `)

        }, [feedbackQuestionChoice])


        const submitFeedback = useCallback(async () => {
            setIsSubmitClicked(true)
            setIsError(false)

            // setErrorList()
            console.log('submit feedback ')

            let temptErrorList = new Array(6).fill(0)
            let tempIsError = false
            temptErrorList.map((item, index) => {
                if (feedbackQuestionChoice[index] === 0) {
                    temptErrorList[index] = 1
                    setIsError(true)
                    tempIsError = true
                }
            })

            // console.log(`temptErrorList: ${temptErrorList}`)
            setErrorList(temptErrorList)
            if (!tempIsError) {
                let tempParamData = {
                    "q1": feedbackQuestionChoice[0],
                    "q2": feedbackQuestionChoice[1],
                    "q3": feedbackQuestionChoice[2],
                    "q4": feedbackQuestionChoice[3],
                    "q5": feedbackQuestionChoice[4],
                    "q6": feedbackQuestionChoice[5],
                    "coach_id": coachId,
                    "rfu_id": id
                }
                // console.log(`tempParamData: ${JSON.stringify(tempParamData)}`)
                await createFeedbackUser(tempParamData)

                if (feedbackStore.errorMessage == "Success" || feedbackStore.errorCode === null) {
                    feedbackStore.setRefreshData(true)
                    setModalContent("Sukses!", "Feedback telah sukses disimpan!", "senang")
                    setIsSubmitSuccess(true)
                } else {
                    setModalContent("Ada Kesalahan!", "Ups! Sepertinya ada kesalahan!\nSilahkan coba lagi!", "sedih")
                    setIsSubmitSuccess(false)
                }
                toggleModal(true)
            }
        }, [isError, isSubmitClicked, feedbackQuestionChoice, feedbackStore.errorCode, feedbackStore.errorMessage, isSubmitSuccess])

        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={Layout.flex}
            >
                <VStack
                    testID="feedbackDetail"
                    style={styles.bg}
                >
                    <SafeAreaView style={Layout.flex}>
                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                    refreshing={isLoading}
                                    //   onRefresh={onRefresh}
                                    tintColor={Colors.MAIN_RED}
                                />
                            }
                        >
                            <VStack style={{ backgroundColor: Colors.WHITE, paddingTop: Spacing[12] }}>
                                <VStack top={Spacing[0]} horizontal={Spacing[24]} bottom={Spacing[12]}>
                                    <HStack style={{ justifyContent: 'space-around' }}>
                                        {/* <Spacer /> */}
                                        <Text type="left-header">{title}</Text>
                                        <Spacer />
                                        <Button
                                            type={"light-bg"}
                                            text={"Back"}
                                            style={{
                                                height: Spacing[42], paddingHorizontal: Spacing[12], alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: Spacing[10],
                                            }}
                                            textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                                            onPress={goBack}
                                        />
                                    </HStack>
                                    <Spacer height={Spacing[24]} />
                                    {renderHeader()}
                                    <Spacer height={Spacing[12]} />
                                    <View style={{ height: Spacing[6], backgroundColor: Colors.ABM_YELLOW, width: '100%', marginLeft: 'auto', marginRight: 'auto' }}></View>

                                    {isError &&
                                        <>
                                            <Spacer height={Spacing[12]} />
                                            <Text type={"warning"} style={{ textAlign: "center" }}>
                                                Ups! Sepertinya ada feedback yang belum diisi! Silahkan dicek kembali dan isi semua feedback yang tersedia!
                                            </Text>
                                        </>
                                    }

                                    <VStack top={Spacing[12]} horizontal={Spacing[12]} style={[Layout.heightFull, { backgroundColor: Colors.WHITE, borderTopStartRadius: Spacing[48], borderTopEndRadius: Spacing[48] }]}>


                                        {/*  Statement1 */}
                                        <VStack vertical={Spacing[8]}>
                                            <Text type={errorList[0] === 1 ? 'warning-not-bold' : 'body'} style={{ textAlign: 'center', fontSize: Spacing[12] }}>
                                                “Dalam skala 1 - 5, seberapa baik {subjectFeedback} sudah membangun
                                                <Text type={errorList[0] === 1 ? 'warning-not-bold' : 'body-bold'} style={{ fontSize: Spacing[12] }}> rapport </Text>atau
                                                <Text type={errorList[0] === 1 ? 'warning-not-bold' : 'body-bold'} style={{ fontSize: Spacing[12] }}>  kedekatan di awal sesi</Text>?”
                                            </Text>
                                            <HStack top={Spacing[12]} style={{ justifyContent: 'space-around' }}>
                                                {Array(5).fill(0).map((value, i) => {
                                                    return (
                                                        <HStack>
                                                            <TouchableOpacity onPress={() => selectFeedbackItem(0, i + 1)} disabled={!isFeedbackRequest}>
                                                                <VStack>
                                                                    <View style={{
                                                                        position: 'absolute',
                                                                        height: Spacing[24],
                                                                        width: Spacing[24],
                                                                        backgroundColor: feedbackQuestionChoice[0] === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE,
                                                                        borderRadius: Spacing[128], borderWidth: Spacing[2],
                                                                        borderColor: feedbackQuestionChoice[0] === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE
                                                                    }} />

                                                                    <VStack style={{ width: Spacing[24] }} top={Spacing[28]}>
                                                                        <Text type={'body'} style={{ textAlign: 'center' }}>
                                                                            {i + 1}
                                                                        </Text>
                                                                    </VStack>
                                                                </VStack>
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    )
                                                })}
                                            </HStack>
                                        </VStack>


                                        {/*  Statement2 */}
                                        <VStack vertical={Spacing[8]}>
                                            <Text type={errorList[1] === 1 ? 'warning-not-bold' : 'body'} style={{ textAlign: 'center', fontSize: Spacing[12] }}>
                                                “Dalam skala 1 - 5, seberapa baik {subjectFeedback} membantu {isFeedbackRequest ? 'saya sebagai ' : ''}coachee menentukan
                                                <Text type={errorList[1] === 1 ? 'warning-not-bold' : 'body-bold'} style={{ fontSize: Spacing[12] }}> outcome </Text>?”
                                            </Text>
                                            <HStack top={Spacing[12]} style={{ justifyContent: 'space-around' }}>
                                                {Array(5).fill(0).map((value, i) => {
                                                    return (
                                                        <HStack>
                                                            <TouchableOpacity onPress={() => selectFeedbackItem(1, i + 1)} disabled={!isFeedbackRequest}>
                                                                <VStack>
                                                                    <View style={{
                                                                        position: 'absolute',
                                                                        height: Spacing[24],
                                                                        width: Spacing[24],
                                                                        backgroundColor: feedbackQuestionChoice[1] === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE,
                                                                        borderRadius: Spacing[128], borderWidth: Spacing[2],
                                                                        borderColor: feedbackQuestionChoice[1] === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE
                                                                    }} />

                                                                    <VStack style={{ width: Spacing[24] }} top={Spacing[28]}>
                                                                        <Text type={'body'} style={{ textAlign: 'center' }}>
                                                                            {i + 1}
                                                                        </Text>
                                                                    </VStack>
                                                                </VStack>
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    )
                                                })}
                                            </HStack>
                                        </VStack>


                                        {/*  Statement3 */}
                                        <VStack vertical={Spacing[8]}>
                                            <Text type={errorList[2] === 1 ? 'warning-not-bold' : 'body'} style={{ textAlign: 'center', fontSize: Spacing[12] }}>
                                                “Dalam skala 1 - 5, seberapa baik {subjectFeedback} sudah mempraktekan
                                                <Text type={errorList[2] === 1 ? 'warning-not-bold' : 'body-bold'} style={{ fontSize: Spacing[12] }}> active listening </Text>atau
                                                <Text type={errorList[2] === 1 ? 'warning-not-bold' : 'body-bold'} style={{ fontSize: Spacing[12] }}> mendengar aktif </Text>saat sesi berlangsung?”
                                            </Text>
                                            <HStack top={Spacing[12]} style={{ justifyContent: 'space-around' }}>
                                                {Array(5).fill(0).map((value, i) => {
                                                    return (
                                                        <HStack>
                                                            <TouchableOpacity onPress={() => selectFeedbackItem(2, i + 1)} disabled={!isFeedbackRequest}>
                                                                <VStack>
                                                                    <View style={{
                                                                        position: 'absolute',
                                                                        height: Spacing[24],
                                                                        width: Spacing[24],
                                                                        backgroundColor: feedbackQuestionChoice[2] === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE,
                                                                        borderRadius: Spacing[128], borderWidth: Spacing[2],
                                                                        borderColor: feedbackQuestionChoice[2] === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE
                                                                    }} />

                                                                    <VStack style={{ width: Spacing[24] }} top={Spacing[28]}>
                                                                        <Text type={'body'} style={{ textAlign: 'center' }}>
                                                                            {i + 1}
                                                                        </Text>
                                                                    </VStack>
                                                                </VStack>
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    )
                                                })}
                                            </HStack>
                                        </VStack>


                                        {/*  Statement4 */}
                                        <VStack vertical={Spacing[8]}>
                                            <Text type={errorList[3] === 1 ? 'warning-not-bold' : 'body'} style={{ textAlign: 'center', fontSize: Spacing[12] }}>
                                                “Dalam skala 1 - 5, seberapa baik {subjectFeedback} sudah mengajukan
                                                <Text type={errorList[3] === 1 ? 'warning-not-bold' : 'body-bold'} style={{ fontSize: Spacing[12] }}> powerful questions </Text>atau
                                                <Text type={errorList[3] === 1 ? 'warning-not-bold' : 'body-bold'} style={{ fontSize: Spacing[12] }}> pertanyaan yang menggugah </Text>pada saat sesi berlangsung?”
                                            </Text>
                                            <HStack top={Spacing[12]} style={{ justifyContent: 'space-around' }}>
                                                {Array(5).fill(0).map((value, i) => {
                                                    return (
                                                        <HStack>
                                                            <TouchableOpacity onPress={() => selectFeedbackItem(3, i + 1)} disabled={!isFeedbackRequest}>
                                                                <VStack>
                                                                    <View style={{
                                                                        position: 'absolute',
                                                                        height: Spacing[24],
                                                                        width: Spacing[24],
                                                                        backgroundColor: feedbackQuestionChoice[3] === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE,
                                                                        borderRadius: Spacing[128], borderWidth: Spacing[2],
                                                                        borderColor: feedbackQuestionChoice[3] === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE
                                                                    }} />

                                                                    <VStack style={{ width: Spacing[24] }} top={Spacing[28]}>
                                                                        <Text type={'body'} style={{ textAlign: 'center' }}>
                                                                            {i + 1}
                                                                        </Text>
                                                                    </VStack>
                                                                </VStack>
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    )
                                                })}
                                            </HStack>
                                        </VStack>


                                        {/*  Statement5 */}
                                        <VStack vertical={Spacing[8]}>
                                            <Text type={errorList[2] === 1 ? 'warning-not-bold' : 'body'} style={{ textAlign: 'center', fontSize: Spacing[12] }}>
                                                “Dalam skala 1 - 5, seberapa baik {subjectFeedback} sudah menggali
                                                <Text type={errorList[2] === 1 ? 'warning-not-bold' : 'body-bold'} style={{ fontSize: Spacing[12] }}> insights </Text>atau
                                                <Text type={errorList[2] === 1 ? 'warning-not-bold' : 'body-bold'} style={{ fontSize: Spacing[12] }}> pembelajaran </Text>yang saya dapatkan selama sesi berlangsung?”
                                            </Text>
                                            <HStack top={Spacing[12]} style={{ justifyContent: 'space-around' }}>
                                                {Array(5).fill(0).map((value, i) => {
                                                    return (
                                                        <HStack>
                                                            <TouchableOpacity onPress={() => selectFeedbackItem(4, i + 1)} disabled={!isFeedbackRequest}>
                                                                <VStack>
                                                                    <View style={{
                                                                        position: 'absolute',
                                                                        height: Spacing[24],
                                                                        width: Spacing[24],
                                                                        backgroundColor: feedbackQuestionChoice[4] === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE,
                                                                        borderRadius: Spacing[128], borderWidth: Spacing[2],
                                                                        borderColor: feedbackQuestionChoice[4] === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE
                                                                    }} />

                                                                    <VStack style={{ width: Spacing[24] }} top={Spacing[28]}>
                                                                        <Text type={'body'} style={{ textAlign: 'center' }}>
                                                                            {i + 1}
                                                                        </Text>
                                                                    </VStack>
                                                                </VStack>
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    )
                                                })}
                                            </HStack>
                                        </VStack>


                                        {/*  Statement6 */}
                                        <VStack vertical={Spacing[8]}>
                                            <Text type={errorList[3] === 1 ? 'warning-not-bold' : 'body'} style={{ textAlign: 'center', fontSize: Spacing[12] }}>
                                                “Dalam skala 1 - 5, seberapa baik {subjectFeedback} sudah membantu {isFeedbackRequest ? 'saya sebagai ' : ''}coachee untuk menyampaikan
                                                <Text type={errorList[3] === 1 ? 'warning-not-bold' : 'body-bold'} style={{ fontSize: Spacing[12] }}> komitmen </Text>di akhir sesi?”
                                            </Text>
                                            <HStack top={Spacing[12]} style={{ justifyContent: 'space-around' }}>
                                                {Array(5).fill(0).map((value, i) => {
                                                    return (
                                                        <HStack>
                                                            <TouchableOpacity onPress={() => selectFeedbackItem(5, i + 1)} disabled={!isFeedbackRequest}>
                                                                <VStack>
                                                                    <View style={{
                                                                        position: 'absolute',
                                                                        height: Spacing[24],
                                                                        width: Spacing[24],
                                                                        backgroundColor: feedbackQuestionChoice[5] === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE,
                                                                        borderRadius: Spacing[128], borderWidth: Spacing[2],
                                                                        borderColor: feedbackQuestionChoice[5] === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE
                                                                    }} />

                                                                    <VStack style={{ width: Spacing[24] }} top={Spacing[28]}>
                                                                        <Text type={'body'} style={{ textAlign: 'center' }}>
                                                                            {i + 1}
                                                                        </Text>
                                                                    </VStack>
                                                                </VStack>
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    )
                                                })}
                                            </HStack>
                                        </VStack>


                                        <HStack bottom={Spacing[24]} top={Spacing[24]}>
                                            <Spacer />
                                            <VStack style={{ maxWidth: Spacing[256], minWidth: Spacing[96] + Spacing[12] }}>
                                                <Button
                                                    type={"primary"}
                                                    text={submitButtonText}
                                                    style={{
                                                        height: Spacing[42], paddingHorizontal: Spacing[8], alignItems: "center",
                                                        justifyContent: "center",
                                                        borderRadius: Spacing[10]
                                                    }}
                                                    textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                                                    onPress={isFeedbackRequest ? submitFeedback : goToFeedbacCommitment}
                                                />
                                            </VStack>
                                            <Spacer />
                                        </HStack>
                                    </VStack>
                                </VStack>
                                <Spacer height={Spacing[24]} />

                            </VStack>
                        </ScrollView>
                    </SafeAreaView >
                    <Spinner visible={feedbackStore.isLoading} textContent={"Memuat..."} />

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
                                                    text={isSubmitSuccess ? "Kembali ke Menu Utama\nFeedback" : "Kembali ke\nMenu Sebelumnya"}
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
                        </View>
                    </Modal>
                </VStack >
            </KeyboardAvoidingView >
        )
    })

export default FeedbackDetail

const styles = StyleSheet.create({
    bg: {
        backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center",
    },
    bgBottom: { backgroundColor: Colors.WHITE, borderTopEndRadius: Spacing[0], borderTopStartRadius: Spacing[48], minHeight: dimensions.screenHeight * 1.5 }
});