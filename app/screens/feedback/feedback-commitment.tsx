import React, { FC, useCallback, useReducer, useState, useEffect } from "react"
import { ActivityIndicator, FlatList, ImageBackground, RefreshControl, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, BackNavigation, Button, TextField } from "@components"
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
import { ExistingCoacheeModel, FeedbackCommitmentModel, FeedbackUserDetailModel } from "app/store/store.feedback"
import { ExistingCoacheeComponent } from "./components/existing-coachee-component"

import Modal from "react-native-modalbox"
import { MoodComponent } from "@screens/homepage/components/mood-component"
import { FeedbackRequestListComponent } from "./components/feedback-request-list-component"
import { IconClose } from "@assets/svgs"
import { RED100 } from "@styles/Color"
import { spacing } from "@theme/spacing"
import Spinner from 'react-native-loading-spinner-overlay';
import { EmptyList } from "./components/empty-list"
import { Formik } from "formik"

type ChoiceItemType = {
    id: string
    title: string
    choice: 0 | 1 | 2 | 3 | 4 | 5
}

export type feedbackCommitmentForm = {
    commitment: string
}


const EXAMPLE_DATA: Array<ChoiceItemType> = [
    {
        id: '0',
        title: 'Dalam skala 1 - 5, seberapa baik saya sudah membangun  return <Text type={\'body\'} style={{ textAlign: \'center\' }}> rapport </Text>atau kedekatan di awal sesi?',
        choice: 0,
    },
    {
        id: '1',
        title: '“Dalam skala 1 - 5, seberapa baik saya sudah membantu coachee menentukan outcome?”',
        choice: 0,
    },
    {
        id: '2',
        title: '“Dalam skala 1 - 5, seberapa baik saya sudah mempraktekan active listening atau mendengar aktif saat sesi berlangsung?”',
        choice: 0,
    },
    {
        id: '3',
        title: '“Dalam skala 1 - 5, seberapa baik saya sudah mengajukan powerful questions atau pertanyaan yang menggugah pada saat sesi berlangsung?”',
        choice: 0
    }
]

const MOCK_FEEDBACK_COMMITMENT = {
    "id": "41ed5bb2-8656-4e3d-95df-8e3a04e41090",
    "feedbackUserId": "6002192f-b931-464d-b893-bac97874f2a6",
    "commitment": "saya berkomitmen 1",
    "fuc_created_at": "2023-06-19T02:32:29.000Z",
    "fuc_updated_at": "2023-06-19T02:32:29.000Z",
    "fuc_deleted_at": null,
    "fuc_feedback_user_id": "6002192f-b931-464d-b893-bac97874f2a6"
}


const FeedbackCommitment: FC<StackScreenProps<NavigatorParamList, "feedbackCommitment">> =
    observer(({ navigation, route }) => {

        const { feedbackUserId } = route.params
        const [feedbackUserCommitment, setFeedbackUserCommitment] = useState<FeedbackCommitmentModel>()

        const feedbackCommitmentInitialForm: feedbackCommitmentForm = {
            commitment: '',
        }

        const [errorMessage, setErrorMessage] = useState<string>('')

        const [, forceUpdate] = useReducer((x) => x + 1, 0)
        const { mainStore, feedbackStore } = useStores()


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
                setModalType("")
            }
        }

        const goBack = () => {
            navigation.goBack()
        }

        const loadFeedbackCommitment = debounce(async () => {
            await feedbackStore.clearFeedbackCommitment()
            await feedbackStore.getFeedbackCommitment(feedbackUserId)

            console.log(`timeout loadFeedbackCommitment , ${feedbackStore.feedbackCommitment}`)
            setInitialLoading(false)
            feedbackStore.setRefreshData(false)
            forceUpdate()
        }, 500)

        useEffect(() => {
            loadFeedbackCommitment()
        }, [feedbackUserId])


        const resetSelectedIndicator = () => {
            setSelectedPreviousFeedbackUserByCoachee("")
            setSelectedPreviousFeedbackUser("")
            setSelectedExistingCoachee("")
        }

        useEffect(() => {
            if (feedbackStore.feedbackCommitment !== null) {
                feedbackCommitmentInitialForm.commitment = feedbackStore.feedbackCommitment.commitment
                setFeedbackUserCommitment(feedbackStore.feedbackCommitment)
            }
        }, [feedbackStore.getFeedbackCommitmentSucceed, feedbackUserCommitment])

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
                                onPress={closeNotificationModal}
                            />
                        </VStack>
                        <Spacer />
                    </HStack>
                </VStack>
            )
        }


        const closeNotificationModal = () => {
            feedbackStore.clearRequestFeedback()
            toggleModal(false)
        }

        return (
            <VStack
                testID="feedbackCommitment"
                style={styles.bg}
            >
                <SafeAreaView style={Layout.flex}>
                    <VStack style={{ backgroundColor: Colors.WHITE }}>
                        <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
                        <VStack top={Spacing[0]} horizontal={Spacing[24]} bottom={Spacing[12]}>
                            <Text type={"header"} text="Commitment for Improvement." />


                            {/* <Spacer height={Spacing[32]} /> */}
                            <VStack top={Spacing[8]} horizontal={Spacing[0]} bottom={Spacing[12]}>

                                <Formik initialValues={feedbackCommitmentInitialForm} onSubmit={() => { }}>
                                    {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
                                        <VStack top={Spacing[8]} horizontal={Spacing[0]} bottom={Spacing[12]} style={[Layout.heightFull, { justifyContent: 'space-between' }]}>
                                            <VStack top={Spacing[12]}>
                                                <Text type={"body"} style={{ textAlign: "center" }}>
                                                    <Text type={"body-bold"}>Isi kolom dibawah ini dengan
                                                        <Text type={"body-bold"} style={{ color: Colors.ABM_LIGHT_BLUE }}> pernyataan komitmen </Text>
                                                        agar kamu akan terus berkembang kedepannya.</Text>
                                                </Text>

                                                {/* { && */}
                                                <Spacer height={Spacing[12]} />
                                                <Text type={"warning"} style={{ textAlign: "center" }}>
                                                    Ups! Sepertinya ada kolom yang belum diisi! Silahkan dicek kembali dan isi semua kolom yang tersedia!
                                                </Text>
                                                {/* } */}

                                                <Spacer height={Spacing[12]} />
                                                <Text type={"body"} style={{ textAlign: "center" }}>
                                                    <Text type={"label"}>Apa saja yang saya lakukan untuk memperbaiki dan meningkatkankan performa saya dari
                                                        <Text type={"label"} style={{ color: Colors.ABM_LIGHT_BLUE }}> hasil feedback sebelumnya </Text>
                                                        ?</Text>
                                                </Text>
                                                <TextField
                                                    value={values.commitment}
                                                    style={{ paddingTop: 0, textAlign: "left" }}
                                                    inputStyle={{ minHeight: Spacing[144], textAlign: 'left', paddingLeft: Spacing[12], borderColor: Colors.ABM_DARK_BLUE }}
                                                    isRequired={true}
                                                    secureTextEntry={false}
                                                    isTextArea={true}
                                                    onChangeText={handleChange("commitment")}
                                                    // onChangeText={(value) => setDescription(value)}
                                                    charCounter={true}
                                                    maxChar={2500}
                                                />
                                            </VStack>
                                            {/* <Text type={"warning"} style={{ textAlign: "center" }}>
                                                {errorMessage}
                                            </Text> */}
                                            <HStack>
                                                <Spacer />
                                                <Button
                                                    type={"primary-dark"}
                                                    text={"Simpan Komitmen"}
                                                    style={{ borderRadius: Spacing[10], paddingHorizontal: Spacing[12], paddingVertical: Spacing[14] }}
                                                    textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                                                    onPress={handleSubmit}
                                                />
                                                <Spacer />
                                            </HStack>
                                            <Spacer height={Spacing[32]} />
                                        </VStack>
                                    )}

                                </Formik>
                            </VStack>


                        </VStack>

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
                                {modalType === 'notification' ? renderNotificationModal() : null}
                            </VStack>
                            {/* {modalType === 'notification' ? null : renderPreviousFeedbackDatesModal()} */}
                        </VStack>
                    </View>
                </Modal>

            </VStack>
        )
    })

export default FeedbackCommitment

const styles = StyleSheet.create({
    bg: {
        backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center"
    },
    bgBottom: { backgroundColor: Colors.WHITE, borderTopEndRadius: Spacing[0], borderTopStartRadius: Spacing[48], minHeight: dimensions.screenHeight * 1.5 }
});