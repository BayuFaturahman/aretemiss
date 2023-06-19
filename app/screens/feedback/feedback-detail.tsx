import React, { FC, useReducer, useState, useEffect } from "react"
import { SafeAreaView, StyleSheet, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, Button } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"

import { CoachingJournalItem } from "@screens/coaching-journal/coaching-journal.type"
import { useStores } from "../../bootstrap/context.boostrap"

import { dimensions } from "@config/platform.config"
import { ExistingCoacheeModel } from "app/store/store.feedback"

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
    observer(({ navigation, route }) => {

        const { feedbackUserId } = route.params;

        const [feedbackUserDetail, setFeedbackUserDetail] = useState<FeedbackUserDetail>(MOCK_FEEDBACK_USER_DETAIL)

        const [, forceUpdate] = useReducer((x) => x + 1, 0)
        const { feedbackStore } = useStores()

        const goBack = () => {
            navigation.goBack()
        }

        const loadFeedbackUserDetail = async () => {
            await feedbackStore.getFeedbackUserDetail(feedbackUserId)
        }

        useEffect(() => {
            loadFeedbackUserDetail()
            console.log('use effect loadFeedbackUserDetail')
        }, [])

        useEffect(() => {
            if (feedbackStore.feedbackUserDetail) {
                setFeedbackUserDetail(feedbackStore.feedbackUserDetail)
            }

            console.log(`feedbackStore.feedbackUserDetail , ${feedbackStore.feedbackUserDetail}`)
        }, [feedbackStore.feedbackUserDetail, feedbackStore.getFeedbackUserDetailSucceedd])

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
                                    <Text type={'body'} style={{ textAlign: 'center', fontSize: Spacing[12] }}>
                                        “Dalam skala 1 - 5, seberapa baik saya sudah membangun<Text type={'body-bold'} style={{ fontSize: Spacing[12] }}> rapport </Text>atau<Text type={'body-bold'} style={{ fontSize: Spacing[12] }}>  kedekatan di awal sesi</Text>?”
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
                                                            backgroundColor: feedbackUserDetail.q1 === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE,
                                                            borderRadius: Spacing[128], borderWidth: Spacing[2],
                                                            borderColor: feedbackUserDetail.q1 === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE
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
                                    <Text type={'body'} style={{ textAlign: 'center', fontSize: Spacing[12] }}>
                                        “Dalam skala 1 - 5, seberapa baik saya sudah membantu coachee menentukan<Text type={'body-bold'} style={{ fontSize: Spacing[12] }}> outcome </Text>?”
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
                                                            backgroundColor: feedbackUserDetail.q2 === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE,
                                                            borderRadius: Spacing[128], borderWidth: Spacing[2],
                                                            borderColor: feedbackUserDetail.q2 === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE
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
                                    <Text type={'body'} style={{ textAlign: 'center', fontSize: Spacing[12] }}>
                                        “Dalam skala 1 - 5, seberapa baik saya sudah mempraktekan<Text type={'body-bold'} style={{ fontSize: Spacing[12] }}> active listening </Text>atau <Text type={'body-bold'} style={{ fontSize: Spacing[12] }}> mendengar aktif </Text>saat sesi berlangsung?”
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
                                                            backgroundColor: feedbackUserDetail.q3 === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE,
                                                            borderRadius: Spacing[128], borderWidth: Spacing[2],
                                                            borderColor: feedbackUserDetail.q3 === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE
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
                                    <Text type={'body'} style={{ textAlign: 'center', fontSize: Spacing[12] }}>
                                        “Dalam skala 1 - 5, seberapa baik saya sudah mengajukan<Text type={'body-bold'} style={{ fontSize: Spacing[12] }}> powerful questions </Text>atau<Text type={'body-bold'} style={{ fontSize: Spacing[12] }}> pertanyaan yang menggugah </Text>pada saat sesi berlangsung?”
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
                                                            backgroundColor: feedbackUserDetail.q4 === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE,
                                                            borderRadius: Spacing[128], borderWidth: Spacing[2],
                                                            borderColor: feedbackUserDetail.q4 === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE
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


                                <HStack bottom={Spacing[24]} top={Spacing[24]}>
                                    <Spacer />
                                    <VStack style={{ maxWidth: Spacing[256], minWidth: Spacing[96] + Spacing[12] }}>
                                        <Button
                                            type={"primary"}
                                            text={"Komitmen Saya"}
                                            style={{
                                                height: Spacing[42], paddingHorizontal: Spacing[8], alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: Spacing[10]

                                            }}
                                            textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                                            onPress={() => { }}
                                        />
                                    </VStack>
                                    <Spacer />
                                </HStack>
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