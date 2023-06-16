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
import { ExistingCoacheeModel } from "app/store/store.feedback"
import { ExistingCoacheeComponent } from "./components/existing-coachee-component"

import Modal from "react-native-modalbox"
import { MoodComponent } from "@screens/homepage/components/mood-component"
import { FeedbackRequestListComponent } from "./components/feedback-request-list-component"
import { IconClose } from "@assets/svgs"
import { RED100 } from "@styles/Color"
import { spacing } from "@theme/spacing"
import { FeedbackUserDetail } from "./feedback.type"



type ChoiceItemType = {
    id: string
    title: string
    choice: 0 | 1 | 2 | 3 | 4 | 5
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

const MOCK_FEEDBACK_USER_DETAIL: FeedbackUserDetail = {
    "id": "a45c9dd6-e2f6-4b85-92f4-6b067331ff22",
    "q1": 5,
    "q2": 1,
    "q3": 4,
    "q4": 5,
    "from": "coachee",
    "coachId": "61d8bf7f-777c-4227-9050-82ef768611d7",
    "coacheeId": "61d8bf7f-777c-4227-9050-82ef768611d7",
    "fu_created_at": "2023-06-13T09:23:24.000Z",
    "fu_updated_at": "2023-06-13T09:23:24.000Z",
    "fu_deleted_at": null,
    "has_commitment": 0
}

const FeedbackDetail: FC<StackScreenProps<NavigatorParamList, "feedbackDetail">> =
    observer(({ navigation }) => {


        const [existingCoacheeData, setExistingCoacheeData] = useState<Array<ExistingCoacheeModel>>([])
        const [coachingData, setCoachingData] = useState<Array<CoachingJournalItem>>([])
        const [selectedFeedbackRequest, setSelectedFeedbackRequest] = useState<string>("")
        const [selectedExistingCoachee, setSelectedExistingCoachee] = useState<string>("")
        const [selectedPreviousFeedbackCoachee, setSelectedPreviousFeedbackCoachee] = useState<string>("")
        const [selectedPreviousFeedbackUser, setSelectedPreviousFeedbackUser] = useState<string>("")
        const [currentPageExistingCoachee, setCurrentPageExistingCoachee] = useState<number>(2)

        const [, forceUpdate] = useReducer((x) => x + 1, 0)
        const { feedbackStore } = useStores()

        const [currentPage, setCurrentPage] = useState<number>(2)

        const [feedbackData, setFeedbackData] = useState<Array<ChoiceItemType>>(EXAMPLE_DATA);
        const [feedbackUserData, setFeedbackUserData] = useState<FeedbackUserDetail>(MOCK_FEEDBACK_USER_DETAIL);

        const [initialLoading, setInitialLoading] = useState<boolean>(true)

        const [isModalVisible, setModalVisible] = useState<boolean>(false)




        const goBack = () => {
            console.log('pencet back')
            navigation.goBack()
        }


        const loadExistingCoachee = async (page: number) => {
            await feedbackStore.getListExistingCoachee(page)
        }


        const resetSelectedIndicator = () => {
            setSelectedPreviousFeedbackCoachee("")
            setSelectedPreviousFeedbackUser("")
            setSelectedExistingCoachee("")
        }

        const firstLoadExistingCoachee = debounce(async () => {
            await feedbackStore.clearFeedback()
            await loadExistingCoachee(1)

            console.log(`timeout feedbackStore.listExistingCoachees , ${feedbackStore.listExistingCoachees}`)
            // feedbackStore.listExistingCoachees = MOCK_EXISTING_COACHEE
            setInitialLoading(false)
            feedbackStore.setRefreshData(false)
            forceUpdate()
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

        const ChoiceItem = ({ item }: { item: ChoiceItemType; index: number }) => {
            return (
                <VStack vertical={Spacing[8]}>
                    <Text type={'body'} style={{ textAlign: 'center' }}>
                        {item.title}
                    </Text>
                    <HStack top={Spacing[12]} style={{ justifyContent: 'space-around' }}>
                        {Array(5).fill(0).map((value, i) => {
                            return (
                                <HStack>
                                    <VStack>
                                        <View style={{
                                            position: 'absolute',
                                            height: Spacing[24],
                                            width: Spacing[24],
                                            backgroundColor: item.choice === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE,
                                            borderRadius: Spacing[128], borderWidth: Spacing[2],
                                            borderColor: item.choice === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE
                                        }} />

                                        <VStack style={{ width: Spacing[24] }} top={Spacing[28]}>
                                            <Text type={'body'} style={{ textAlign: 'center' }}>
                                                {i + 1}
                                            </Text>
                                        </VStack>
                                    </VStack>
                                </HStack>
                            )
                        })}
                    </HStack>
                </VStack>
            )
        }


        return (
            <VStack
                testID="feedbackDetail"
                style={styles.bg}
            >
                <SafeAreaView style={Layout.flex}>
                    <VStack style={{ backgroundColor: Colors.WHITE }}>
                        <VStack top={Spacing[0]} horizontal={Spacing[24]} bottom={Spacing[12]}>
                            <HStack style={{ justifyContent: 'space-around' }}>
                                {/* <Spacer /> */}
                                <Text type="left-header">Feedback results.</Text>
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
                            <Text type={"body-bold"} style={{ textAlign: "center", fontSize: Spacing[14] }}>
                                Berikut adalah hasil feedback sudah dinilai oleh anggota tim-mu.
                            </Text>
                            <Spacer height={Spacing[12]} />
                            <View style={{ height: Spacing[6], backgroundColor: Colors.ABM_YELLOW, width: '100%', marginLeft: 'auto', marginRight: 'auto' }}></View>
                            {/* <Spacer height={Spacing[24]} /> */}
                            <VStack top={Spacing[12]} horizontal={Spacing[12]} style={[Layout.heightFull, { backgroundColor: Colors.WHITE, borderTopStartRadius: Spacing[48], borderTopEndRadius: Spacing[48] }]}>
                                {/* <FlatList
                                    ItemSeparatorComponent={() => <Spacer height={Spacing[24]} />}
                                    data={feedbackData}
                                    // ListEmptyComponent={() =>
                                    // <EmptyList />
                                    // }
                                    renderItem={({ item, index }) => <ChoiceItem item={item} index={index} />}
                                    keyExtractor={item => item.id}
                                /> */}

                                {/*  Statement1 */}
                                <VStack vertical={Spacing[8]}>
                                    <Text type={'body'} style={{ textAlign: 'center' }}>
                                        “Dalam skala 1 - 5, seberapa baik saya sudah membangun<Text type={'body-bold'}> rapport </Text>atau<Text type={'body-bold'}>  kedekatan di awal sesi</Text>?”
                                    </Text>
                                    <HStack top={Spacing[12]} style={{ justifyContent: 'space-around' }}>
                                        {Array(5).fill(0).map((value, i) => {
                                            return (
                                                <HStack>
                                                    <VStack>
                                                        <View style={{
                                                            position: 'absolute',
                                                            height: Spacing[24],
                                                            width: Spacing[24],
                                                            backgroundColor: feedbackUserData.q1 === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE,
                                                            borderRadius: Spacing[128], borderWidth: Spacing[2],
                                                            borderColor: feedbackUserData.q1 === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE
                                                        }} />

                                                        <VStack style={{ width: Spacing[24] }} top={Spacing[28]}>
                                                            <Text type={'body'} style={{ textAlign: 'center' }}>
                                                                {i + 1}
                                                            </Text>
                                                        </VStack>
                                                    </VStack>
                                                </HStack>
                                            )
                                        })}
                                    </HStack>
                                </VStack>


                                {/*  Statement2 */}
                                <VStack vertical={Spacing[8]}>
                                    <Text type={'body'} style={{ textAlign: 'center' }}>
                                        “Dalam skala 1 - 5, seberapa baik saya sudah membantu coachee menentukan<Text type={'body-bold'}> outcome </Text>?”
                                    </Text>
                                    <HStack top={Spacing[12]} style={{ justifyContent: 'space-around' }}>
                                        {Array(5).fill(0).map((value, i) => {
                                            return (
                                                <HStack>
                                                    <VStack>
                                                        <View style={{
                                                            position: 'absolute',
                                                            height: Spacing[24],
                                                            width: Spacing[24],
                                                            backgroundColor: feedbackUserData.q2 === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE,
                                                            borderRadius: Spacing[128], borderWidth: Spacing[2],
                                                            borderColor: feedbackUserData.q2 === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE
                                                        }} />

                                                        <VStack style={{ width: Spacing[24] }} top={Spacing[28]}>
                                                            <Text type={'body'} style={{ textAlign: 'center' }}>
                                                                {i + 1}
                                                            </Text>
                                                        </VStack>
                                                    </VStack>
                                                </HStack>
                                            )
                                        })}
                                    </HStack>
                                </VStack>


                                {/*  Statement3 */}
                                <VStack vertical={Spacing[8]}>
                                    <Text type={'body'} style={{ textAlign: 'center' }}>
                                        “Dalam skala 1 - 5, seberapa baik saya sudah mempraktekan<Text type={'body-bold'}> active listening </Text>atau <Text type={'body-bold'}> mendengar aktif </Text>saat sesi berlangsung?”
                                    </Text>
                                    <HStack top={Spacing[12]} style={{ justifyContent: 'space-around' }}>
                                        {Array(5).fill(0).map((value, i) => {
                                            return (
                                                <HStack>
                                                    <VStack>
                                                        <View style={{
                                                            position: 'absolute',
                                                            height: Spacing[24],
                                                            width: Spacing[24],
                                                            backgroundColor: feedbackUserData.q4 === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE,
                                                            borderRadius: Spacing[128], borderWidth: Spacing[2],
                                                            borderColor: feedbackUserData.q4 === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE
                                                        }} />

                                                        <VStack style={{ width: Spacing[24] }} top={Spacing[28]}>
                                                            <Text type={'body'} style={{ textAlign: 'center' }}>
                                                                {i + 1}
                                                            </Text>
                                                        </VStack>
                                                    </VStack>
                                                </HStack>
                                            )
                                        })}
                                    </HStack>
                                </VStack>


                                {/*  Statement4 */}
                                <VStack vertical={Spacing[8]}>
                                    <Text type={'body'} style={{ textAlign: 'center' }}>
                                    “Dalam skala 1 - 5, seberapa baik saya sudah mengajukan<Text type={'body-bold'}> powerful questions </Text>atau<Text type={'body-bold'}> pertanyaan yang menggugah </Text>pada saat sesi berlangsung?”
                                    </Text>
                                    <HStack top={Spacing[12]} style={{ justifyContent: 'space-around' }}>
                                        {Array(5).fill(0).map((value, i) => {
                                            return (
                                                <HStack>
                                                    <VStack>
                                                        <View style={{
                                                            position: 'absolute',
                                                            height: Spacing[24],
                                                            width: Spacing[24],
                                                            backgroundColor: feedbackUserData.q4 === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE,
                                                            borderRadius: Spacing[128], borderWidth: Spacing[2],
                                                            borderColor: feedbackUserData.q4 === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE
                                                        }} />

                                                        <VStack style={{ width: Spacing[24] }} top={Spacing[28]}>
                                                            <Text type={'body'} style={{ textAlign: 'center' }}>
                                                                {i + 1}
                                                            </Text>
                                                        </VStack>
                                                    </VStack>
                                                </HStack>
                                            )
                                        })}
                                    </HStack>
                                </VStack>
                            </VStack>
                        </VStack>
                        <Spacer height={Spacing[24]} />

                    </VStack>
                </SafeAreaView >
            </VStack >


        )
    })

export default FeedbackDetail

const styles = StyleSheet.create({
    bg: {
        backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center"
    },
    bgBottom: { backgroundColor: Colors.WHITE, borderTopEndRadius: Spacing[0], borderTopStartRadius: Spacing[48], minHeight: dimensions.screenHeight * 1.5 }
});