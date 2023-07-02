import React, { FC, useReducer, useState, useEffect, useCallback } from "react"
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, BackNavigation, Button, TextField } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"

import { useStores } from "../../bootstrap/context.boostrap"

import { dimensions } from "@config/platform.config"
import { debounce } from "lodash";
import { FeedbackCommitmentModel } from "app/store/store.feedback"

import Modal from "react-native-modalbox"
import { MoodComponent } from "@screens/homepage/components/mood-component"
import { Formik } from "formik"
import Spinner from "react-native-loading-spinner-overlay"

type ChoiceItemType = {
    id: string
    title: string
    choice: 0 | 1 | 2 | 3 | 4 | 5
}

export type feedbackCommitmentForm = {
    commitment: string
}

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
        const [isCommitmentEmpty, setIsCommitmentEmpty] = useState<boolean>(false)

        const feedbackCommitmentInitialForm: feedbackCommitmentForm = {
            commitment: '',
        }

        const [errorMessage, setErrorMessage] = useState<string>('')
        const [isCommitmentError, setIsCommitmentError] = useState<boolean>(false)

        const [, forceUpdate] = useReducer((x) => x + 1, 0)
        const { mainStore, feedbackStore } = useStores()


        const [initialLoading, setInitialLoading] = useState<boolean>(true)

        const [isModalVisible, setModalVisible] = useState<boolean>(false)
        const [modalTitle, setModalTitle] = useState<string>("")
        const [modalDesc, setModalDesc] = useState<string>("")
        const [modalIcon, setModalIcon] = useState("senang")


        const setModalContent = (title: string, desc: string, icon: string) => {
            setModalTitle(title)
            setModalDesc(desc)
            setModalIcon(icon)
        }

        const toggleModal = (value: boolean) => {
            setModalVisible(value)
        }

        const goBack = () => {
            navigation.goBack()
        }

        const loadFeedbackCommitment = debounce(async () => {
            await feedbackStore.clearFeedbackCommitment()
            await feedbackStore.getFeedbackCommitment(feedbackUserId)

            console.log(`+-+-+-+timeout loadFeedbackCommitment , ${feedbackStore.feedbackCommitment}`)
            setInitialLoading(false)
            feedbackStore.setRefreshData(false)
            forceUpdate()

            if (feedbackStore.feedbackCommitment !== null) {
                feedbackCommitmentInitialForm.commitment = feedbackStore.feedbackCommitment.commitment
                setFeedbackUserCommitment(feedbackStore.feedbackCommitment)
                setIsCommitmentEmpty(false)
            } else {
                setIsCommitmentEmpty(true)
            }
        }, 500)

        useEffect(() => {
            loadFeedbackCommitment()
        }, [feedbackUserId])

        useEffect(() => {

        }, [feedbackStore.getFeedbackCommitmentSucceed, feedbackUserCommitment])

        // useEffect(() => {
        //     console.log('feedbackStore.messageCreateFeedbackCommitment ---- ', feedbackStore.messageCreateFeedbackCommitment)
        //     console.log('feedbackStore.createFeedbackCommitmentSucceed ', feedbackStore.createFeedbackCommitmentSucceed)

        // }, [])

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
            // feedbackStore.clearRequestFeedback()
            toggleModal(false)
        }

        const submitFeedbackCommitment = useCallback(async (data: feedbackCommitmentForm) => {

            if (!data.commitment) {
                setIsCommitmentError(true)
                return
            } else {
                setIsCommitmentError(false)
            }

            feedbackStore.formReset()
            console.log('data ', {
                fu_id: feedbackUserId,
                commitment: data.commitment

            })
            await feedbackStore.createFeedbackCommitment({
                fu_id: feedbackUserId,
                commitment: data.commitment
            });

            // if (feedbackStore.errorCode === null) {
            //     // feedStore.formReset()
            //     // await feedStore.getListFeeds()

            // } else {
            //     setErrorMessage(feedbackStore.errorMessage)
            //     console.log(feedbackStore.errorCode, ' : ', feedbackStore.errorMessage)
            // }

            if (feedbackStore.messageCreateFeedbackCommitment == "Success" || feedbackStore.errorCode === null) {
                // resetSelectedIndicator()
                feedbackStore.setRefreshData(true)
                setModalContent("Sukses!", "Komitmen telah sukses disimpan!", "senang")
                toggleModal(true)
                loadFeedbackCommitment()
            } else {
                setModalContent("Ada Kesalahan!", "Ups! Sepertinya ada kesalahan!\nSilahkan coba lagi!", "sedih")
                toggleModal(true)
            }
        }, [feedbackStore.errorCode])

        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={Layout.flex}
            >
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

                                    <Formik initialValues={feedbackCommitmentInitialForm} onSubmit={submitFeedbackCommitment}>
                                        {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
                                            <VStack top={Spacing[8]} horizontal={Spacing[0]} bottom={Spacing[12]} style={[Layout.heightFull, { justifyContent: 'space-between' }]}>
                                                <VStack top={Spacing[12]}>
                                                    <Text type={"body"} style={{ textAlign: "center" }}>
                                                        <Text type={"body-bold"}>Isi kolom dibawah ini dengan
                                                            <Text type={"body-bold"} style={{ color: Colors.ABM_LIGHT_BLUE }}> pernyataan komitmen </Text>
                                                            agar kamu akan terus berkembang kedepannya.</Text>
                                                    </Text>

                                                    {isCommitmentError &&
                                                        <>
                                                            <Spacer height={Spacing[12]} />
                                                            <Text type={"warning"} style={{ textAlign: "center" }}>
                                                                Ups! Sepertinya ada kolom yang belum diisi! Silahkan dicek kembali dan isi semua kolom yang tersedia!
                                                            </Text>
                                                        </>
                                                    }

                                                    <Spacer height={Spacing[12]} />
                                                    <Text type={"body"} style={{ textAlign: "center" }}>
                                                        <Text type={"label"}>Apa saja yang saya lakukan untuk memperbaiki dan meningkatkankan performa saya dari
                                                            <Text type={"label"} style={{ color: Colors.ABM_LIGHT_BLUE }}> hasil feedback sebelumnya </Text>
                                                            ?</Text>
                                                    </Text>
                                                    <TextField
                                                        value={values.commitment}
                                                        style={{ paddingTop: 0, textAlign: "left" }}
                                                        inputStyle={isCommitmentEmpty ?
                                                            (isCommitmentError ? { minHeight: Spacing[144], textAlign: 'left', paddingLeft: Spacing[12], borderColor: Colors.MAIN_RED } :
                                                                { minHeight: Spacing[144], textAlign: 'left', paddingLeft: Spacing[12], borderColor: Colors.ABM_DARK_BLUE }) :
                                                            { minHeight: Spacing[144], textAlign: 'left', paddingLeft: Spacing[12], borderColor: Colors.ABM_DARK_BLUE, backgroundColor: Colors.ABM_BG_BLUE }}
                                                        isRequired={true}
                                                        secureTextEntry={false}
                                                        isTextArea={true}
                                                        onChangeText={handleChange("commitment")}
                                                        isError={isCommitmentError}
                                                        charCounter={true}
                                                        maxChar={2500}
                                                        editable={isCommitmentEmpty}
                                                    />
                                                </VStack>
                                                {isCommitmentEmpty &&
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
                                                }
                                                <Spacer height={Spacing[32]} />
                                            </VStack>
                                        )}
                                    </Formik>
                                </VStack>


                            </VStack>

                            <Spacer height={Spacing[24]} />

                        </VStack>

                    </SafeAreaView>
                    <Spinner visible={initialLoading || feedbackStore.isLoading} textContent={"Memuat..."} />

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
                                    {renderNotificationModal()}
                                </VStack>
                            </VStack>
                        </View>
                    </Modal>

                </VStack>
            </KeyboardAvoidingView>
        )
    })

export default FeedbackCommitment

const styles = StyleSheet.create({
    bg: {
        backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center"
    },
    bgBottom: { backgroundColor: Colors.WHITE, borderTopEndRadius: Spacing[0], borderTopStartRadius: Spacing[48], minHeight: dimensions.screenHeight * 1.5 }
});