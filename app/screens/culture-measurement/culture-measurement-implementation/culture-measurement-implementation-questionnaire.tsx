import React, { FC, useCallback, useEffect, useReducer, useState } from "react"
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, BackNavigation, Button } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"

import { useStores } from "../../../bootstrap/context.boostrap"

import { dimensions } from "@config/platform.config"
import { images } from "@assets/images";

import { ProgressBar } from "react-native-paper"
import moment from "moment"
import { CMSectionModel, QuestionnaireModel } from "@services/api/cultureMeasurement/culture-measurement-api.types"
import { TouchableOpacity } from "react-native-gesture-handler"
import { CMObjectiveModel, CM_SECTION_EMPTY, CM_SECTION_MOCK_DATA, QUESTIONNAIRE_EXAMPLE, QUESTIONNAIRE_OPTION } from "../culture-measurement.type"
// import { EmptyList } from "./components/empty-list"

const CultureMeasurementImplementation: FC<StackScreenProps<NavigatorParamList, "cultureMeasurementImplementationQuestionnaire">> =
    observer(({ navigation }) => {

        const [, forceUpdate] = useReducer((x) => x + 1, 0)
        const { cultureMeasurementStore } = useStores()

        const [submitBtnText, setSubmitBtnText] = useState<string>('Selanjutnya')

        const [currSectionNo, setCurrSectionNo] = useState<number>(0)
        const [currSectionData, setCurrSectionData] = useState<CMSectionModel>(CM_SECTION_EMPTY)

        const [currPage, setCurrPage] = useState<number>(1)
        const [totalPage, setTotalPage] = useState<number>(1)

        const [listSectionData, setListSectionData] = useState<CMSectionModel[]>(CM_SECTION_MOCK_DATA)
        const [listDescription, setLisDescription] = useState<string[]>([])
        const [listQuestionnaire, setListQuestionnaire] = useState<QuestionnaireModel[]>([QUESTIONNAIRE_EXAMPLE])

        const goBack = () => {
            if (currPage > 1) {
                if (currPage === totalPage - 1) {
                    setSubmitBtnText('Selanjutnya')
                }
                setCurrPage(currPage - 1)
            } else {
                navigation.goBack()
            }
        }

        const goToNextPage = () => {
            if (currPage === totalPage - 2) {
                setSubmitBtnText('Submit Kuisioner')
            }

            if (currPage < (totalPage - 1)) {
                setCurrPage(currPage + 1)
                extractSection(currSectionNo + 1)
                setCurrSectionNo(currSectionNo + 1)
            }
        }

        const extractDesc = useCallback(() => {
            let tempDesc = currSectionData.description
            tempDesc = tempDesc.replaceAll('<br>', '')
            tempDesc = tempDesc.replaceAll('</p>', '')

            let listTempDesc = tempDesc.split('<p>',)
            setLisDescription(listTempDesc)
        }, [currSectionData, listDescription])

        const extractQuestionnaire = useCallback(() => {
            setListQuestionnaire(currSectionData.questionnaire)
        }, [currSectionData, listQuestionnaire])

        const extractSection = useCallback(async (sectionNo: number) => {
            console.log(`extractSection section no ${sectionNo}`)
            if (sectionNo < listSectionData.length) {
                setCurrSectionData(listSectionData[sectionNo])
            }
        }, [currSectionData])

        useEffect(() => {
            extractDesc()
            extractQuestionnaire()
        }, [currSectionData])

        useEffect(() => {
            if (listSectionData.length > 0) {
                setCurrSectionNo(1)
                extractSection(1)
                let tempListSectionQuestionnaire = listSectionData.filter(data => data.type === 'questionnaire')
                setTotalPage(tempListSectionQuestionnaire.length)
            }
        }, [listSectionData])

        useEffect(() => {
            setListSectionData(CM_SECTION_MOCK_DATA)
        }, [])

        const selectOption1 = useCallback((index, indexQ) => {
            let tempListQuestionnaire = [...listQuestionnaire]
            tempListQuestionnaire[index].point = indexQ + 1
            setListQuestionnaire(tempListQuestionnaire)
        }, [listQuestionnaire])

        const renderQuesitonOptions = (data: QuestionnaireModel, index, dataQ, indexQ) => {
            return (
                <>
                    <TouchableOpacity disabled={false} onPress={() => selectOption1(index, indexQ)}>
                        <HStack bottom={Spacing[6]} style={{ backgroundColor: data.point === indexQ + 1 ? Colors.ABM_BG_BLUE : Colors.WHITE, paddingHorizontal: Spacing[12], paddingVertical: Spacing[6], borderRadius: Spacing[10] }}>
                            {/* <Spacer /> */}
                            <View style={{
                                height: Spacing[18] + Spacing[3],
                                width: Spacing[18] + Spacing[3],
                                right: Spacing[6],
                                backgroundColor: data.point === indexQ + 1 ? Colors[dataQ.color] : Colors.GRAY74,
                                borderRadius: Spacing[128], borderWidth: Spacing[2],
                                borderColor: data.point === indexQ + 1 ? Colors[dataQ.color] : Colors.GRAY74,
                                alignContent: 'center',
                                justifyContent: 'center'
                            }} >
                                <HStack>
                                    <Spacer /><Text type="body" text={(indexQ + 1).toString()} style={{ fontSize: Spacing[12], color: Colors[dataQ.fontColor] }} /><Spacer />
                                </HStack>
                            </View>
                            <Text type={"body"} style={{ fontSize: Spacing[12] }}>{dataQ.text}</Text>
                            {/* <Spacer /> */}
                        </HStack>
                    </TouchableOpacity>
                </>
            )
        }

        const renderQuestionnaire = (data: QuestionnaireModel, index: number) => {
            return (
                <>
                    <HStack >
                        <VStack>
                            <Text type="body">{index + 1}.</Text>
                            <Spacer />
                        </VStack>
                        <Spacer width={Spacing[6]} />
                        <Text type="body-bold" style={{ fontSize: Spacing[14] }}>{data.item}</Text>
                    </HStack>
                    <HStack >
                        <VStack horizontal={Spacing[12]} vertical={Spacing[8]} >

                            {QUESTIONNAIRE_OPTION.map((dataQ, indexQ) => {
                                if (indexQ < 3) {
                                    return (
                                        renderQuesitonOptions(data, index, dataQ, indexQ)
                                    )
                                }
                            })}
                        </VStack>
                        <Spacer />
                        <VStack horizontal={Spacing[12]} vertical={Spacing[12]}>
                            {QUESTIONNAIRE_OPTION.map((dataQ, indexQ) => {
                                if (indexQ >= 3) {
                                    return (
                                        renderQuesitonOptions(data, index, dataQ, indexQ)
                                    )
                                }
                            })}
                            <Spacer />
                        </VStack>
                        <Spacer />
                    </HStack >
                </>
            )
        }

        return (
            <VStack
                testID="cultureMeasurementImplementation"
                style={styles.bg}
            >
                <SafeAreaView style={Layout.flex}>
                    <ScrollView
                    // refreshControl={
                    // <RefreshControl
                    // refreshing={}
                    // onRefresh={onRefresh}
                    //     tintColor={Colors.MAIN_RED}
                    // />
                    // }
                    >
                        <VStack style={{ backgroundColor: Colors.WHITE }}>
                            {/* <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} /> */}
                            <VStack top={Spacing[12]} horizontal={Spacing[24]} bottom={Spacing[12]}>
                                <HStack>
                                    <Text type={"left-header"} text={`Penilaian Pelaksanaan\nProyek Budaya Juara`} style={{ fontSize: Spacing[16], textAlign: 'left' }} />
                                    <Spacer />
                                    <Button type={"dark-yellow"} text="Simpan Data" style={{ paddingHorizontal: Spacing[12], borderRadius: Spacing[12] }} />
                                    <Spacer />
                                    <Button type={"warning"} text="Cancel" style={{ paddingHorizontal: Spacing[12], borderRadius: Spacing[12] }} onPress={() => goBack()} />
                                </HStack>
                                <Spacer height={Spacing[24]} />
                                <HStack>
                                    <Spacer />
                                    <Text type="body-bold" style={{ fontSize: Spacing[16] }} text={currSectionData.title} />
                                    <Spacer />
                                </HStack>

                                {listDescription.map((item, index) => {
                                    return (
                                        <>
                                            <Text type={"body"} style={{ textAlign: "center", fontSize: Spacing[12] }}>
                                                {item}
                                            </Text>
                                            {/* <Spacer height={Spacing[12]} /> */}
                                        </>
                                    )
                                })}
                                <Spacer height={Spacing[8]} />
                                <View style={[{ height: Spacing[6], backgroundColor: Colors.ABM_YELLOW }, Layout.widthFull]}></View>
                                <Spacer height={Spacing[8]} />

                                {/* start questionaire */}
                                {
                                    listQuestionnaire.map((data, index) => {
                                        return (
                                            renderQuestionnaire(data, index)
                                        )
                                    })
                                }
                                <Spacer height={Spacing[24]} />
                                <HStack>
                                    <Button type={"primary-dark"} text="Sebelumnya" style={{ paddingHorizontal: Spacing[14], borderRadius: Spacing[12] }} onPress={() => goBack()} />
                                    <Spacer />
                                    <Button type={"primary"} text={submitBtnText} style={{ paddingHorizontal: Spacing[14], borderRadius: Spacing[12] }} onPress={() => goToNextPage()} />
                                </HStack>

                                <Spacer height={Spacing[24]} />
                                {/* <Spacer height={Spacing[2]} /> */}
                                <ProgressBar
                                    progress={(currPage + 1) / totalPage}
                                    color={Colors.ABM_YELLOW}
                                    style={{ height: Spacing[8], backgroundColor: Colors.GRAY74 }}
                                // displayName={`1/3`}
                                />
                                <HStack>
                                    <Spacer />
                                    <Text>{currPage + 1}/{totalPage}</Text>
                                    <Spacer />
                                </HStack>
                                <Spacer height={Spacing[6]} />
                            </VStack>

                        </VStack>
                    </ScrollView >
                </SafeAreaView >
            </VStack >
        )
    })

export default CultureMeasurementImplementation

const styles = StyleSheet.create({
    bg: {
        backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center"
    },
    bgBottom: { backgroundColor: Colors.WHITE, borderTopEndRadius: Spacing[0], borderTopStartRadius: Spacing[48], minHeight: dimensions.screenHeight * 1.5 }
});