import React, { FC, useEffect, useReducer, useState } from "react"
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, BackNavigation, Button } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"
import Spinner from "react-native-loading-spinner-overlay"

import { useStores } from "../../bootstrap/context.boostrap"

import { dimensions } from "@config/platform.config"
import { images } from "@assets/images";

import { ProgressBar } from "react-native-paper"
import moment from "moment"
import { CMPublishDataModel, cultureMeasurementTakers } from "@services/api/cultureMeasurement/culture-measurement-api.types"
import { CMObjectiveModel, CMObjectiveType, CM_PUBLISH_EMPTY, DaysType, QUESTIONNAIRE_TYPE } from "./culture-measurement.type"
import { useIsFocused } from "@react-navigation/native";
import {Man1} from "@assets/svgs";

// import { EmptyList } from "./components/empty-list"

const CultureMeasurementMain: FC<StackScreenProps<NavigatorParamList, "cultureMeasurementMain">> =
    observer(({ navigation }) => {

        const [, forceUpdate] = useReducer((x) => x + 1, 0)
        const isFocused = useIsFocused();
        const { cultureMeasurementStore } = useStores()

        const [publishData, setPublishData] = useState<CMPublishDataModel>(CM_PUBLISH_EMPTY)
        const [listCMObjectives, setListCMObjectives] = useState<CMObjectiveModel[]>([])
        const [listDescription, setLisDescription] = useState<string[]>([])
        const [startDate, setStartDate] = useState<string>('')
        const [endDate, setEndDate] = useState<string>('')

        const descSeparator = '{{objective}}';

        const goBack = () => {
            navigation.reset({
                routes: [{ name: "homepage" }],
            })
        }

        const goToQuestionnaire = (cmoId: string, type: number) => {
            // console.log(`cmoId: ${cmoId}`)
            let tempCMTaker: cultureMeasurementTakers = listCMObjectives[type]['cmTakersLastDraft']

            // if budaya juara
            if (type === 0) {
                if (tempCMTaker !== null && tempCMTaker !== undefined) {
                    goToCultureMeasurementRating(cmoId, false, tempCMTaker.cm_taker_id)
                } else {
                    goToCultureMeasurementRating(cmoId, true)
                }
            }
            // if penilaian infrastruktur budaya juara
            else if (type === 1) {
                if (tempCMTaker !== null && tempCMTaker !== undefined) {
                    let tempTotalSection = tempCMTaker.cm_taker_total_section
                    goToCultureMeasurementInfrastructureQuestionnaire(cmoId, false, tempCMTaker.cm_taker_id, tempTotalSection)
                } else {
                    goToCultureMeasurementInfrastructure(cmoId, true)
                }
            }
            // if penilaian pelaksanaan budaya juara
            else if (type === 2) {
                if (tempCMTaker !== null && tempCMTaker !== undefined) {
                    let tempTotalSection = tempCMTaker.cm_taker_total_section
                    goToCultureMeasurementImplementationQuestionnaire(cmoId, false, tempCMTaker.cm_taker_id, tempTotalSection)
                } else {
                    goToCultureMeasurementImplementation(cmoId, true)
                }
            }
        }

        const goToCultureMeasurementRating = (cmoId: string, isNew: boolean = true, cmTakerId: string = '') => {
            navigation.navigate("cultureMeasurementRating", {
                cmoId: cmoId,
                isToCreate: isNew,
                cmTakerId: cmTakerId,
                isFromQuestionnaire: false
            })
        }

        const goToCultureMeasurementImplementation = (cmoId: string, isNew: boolean = true, cmTakerId: string = '') => {
            navigation.navigate("cultureMeasurementImplementation", {
                cmoId: cmoId,
                isToCreate: isNew,
                cmTakerId: cmTakerId,
            })
        }

        const goToCultureMeasurementImplementationQuestionnaire = (cmoId: string, isNew: boolean = true, cmTakerId: string = '', totalPage: number = 1) => {
            navigation.navigate("cultureMeasurementImplementationQuestionnaire", {
                cmoId: cmoId,
                isToCreate: isNew,
                totalPage: totalPage,
                cmTakerId: cmTakerId,
            })
        }

        const goToCultureMeasurementInfrastructure = (cmoId: string, isNew: boolean = true, cmTakerId: string = '') => {
            navigation.navigate("cultureMeasurementInfrastructure", {
                cmoId: cmoId,
                isToCreate: isNew,
                cmTakerId: cmTakerId
            })
        }

        const goToCultureMeasurementInfrastructureQuestionnaire = (cmoId: string, isNew: boolean = true, cmTakerId: string = '', totalPage: number = 1) => {
            navigation.navigate("cultureMeasurementInfrastructureQuestionnaire", {
                cmoId: cmoId,
                isToCreate: isNew,
                totalPage: totalPage,
                cmTakerId: cmTakerId,
            })
        }

        const loadCMPublishData = async () => {
            // console.log('loadCMPublishData ')
            await cultureMeasurementStore.getListPublish()
            setPublishData(cultureMeasurementStore.cmPublishData)
        }

        const extractData = () => {
            console.log('extract')
            // start extracting description
            let tempDesc = publishData.description
            tempDesc = tempDesc.split('<br>').join('')
            tempDesc = tempDesc.split('</p>').join('')
            tempDesc = tempDesc.split(`${descSeparator}`).join(`<p>${descSeparator}`)

            let listTempDesc = tempDesc.split('<p>',)
            setLisDescription(listTempDesc)


            //start extracting period date
            setStartDate(`${DaysType[moment(publishData.startDate).day()]}, ${moment(publishData.startDate).format('DD MMMM YYYY')}`)
            setEndDate(`${DaysType[moment(publishData.endDate).day()]}, ${moment(publishData.endDate).format('DD MMMM YYYY')}`)

            //start extracting CM objectives
            let tempObjectives = publishData.culture_measurement_objectives.map((data, index) => {
                let curColor = ''

                let tempTakers = [...data.culture_measurement_takers]
                let tempTotalSubmittedTakers = tempTakers.filter(item => item.cm_taker_status === 'submitted') //get submitted taker
                let tempDraftTakers = tempTakers.filter(item => item.cm_taker_status === "draft") //get draft taker

                let tempLastDraftTaker: cultureMeasurementTakers = null; // last taker with status = draft
                if (tempDraftTakers.length > 0) {
                    tempLastDraftTaker = tempDraftTakers[0]
                }

                if (index === 0) {
                    curColor = 'ABM_LIGHT_BLUE'
                    data.cm_objective_title = `${data.cm_objective_title} ${tempTotalSubmittedTakers.length}/${data.cm_objective_max_answerred} orang`
                    if (tempTotalSubmittedTakers.length > 0) {
                        cultureMeasurementStore.cmIsExistSubmttedRating = true
                    }
                } else if (index === 1) {
                    curColor = 'ABM_YELLOW'

                    // get data for budaya juara
                    let tempBudayaJuaraData = publishData.culture_measurement_objectives.filter(tempData => tempData.cm_objective_title === CMObjectiveType.BUDAYA_JUARA)
                    if (tempBudayaJuaraData.length > 0) {

                        //get submitted takers
                        let tempTotalSubmittedTakersBudayaJuara = tempBudayaJuaraData[0].culture_measurement_takers.filter(item => item.cm_taker_status === 'submitted') //get submitted taker
                        if (tempTotalSubmittedTakersBudayaJuara.length > 0) {

                            //to enable indicator for infrastructure culture measurement
                            data.is_enable = true
                        }

                    }
                } else if (index === 2) {
                    curColor = 'ABM_GREEN'
                }

                return (
                    {
                        cmoId: data.cm_objective_id,
                        cmoTitle: data.cm_objective_title,
                        cmoMaxAnswerred: tempLastDraftTaker !== null ? tempLastDraftTaker.cm_taker_total_section : 10,
                        cmTakers: data.culture_measurement_takers,
                        cmTakersLastDraft: tempLastDraftTaker,
                        cmSubmittedTakers: tempTotalSubmittedTakers.length,
                        isEnable: data.is_enable,
                        color: curColor,
                        cmoLastModified: tempLastDraftTaker === null ? null : moment(tempLastDraftTaker.cm_taker_updated_at).format('DD MMM YYYY'), //to be updated
                    }
                )
            })

            setListCMObjectives(tempObjectives)
        }


        useEffect(() => {
            cultureMeasurementStore.clearCMData()
            loadCMPublishData()
        }, [isFocused])


        useEffect(() => {
            if (publishData && publishData.description !== '') {
                extractData()
            }
        }, [publishData])

        const renderQuestionnaireType = () => {
            return (
                <>
                    <Spacer height={Spacing[12]} />
                    <HStack horizontal={Spacing[2]}>
                        <Spacer />
                        <VStack horizontal={Spacing[24]} vertical={Spacing[12]} style={{ backgroundColor: Colors.WHITE, width: Spacing[160] + Spacing[24], borderRadius: Spacing[20], borderWidth: Spacing[2], borderColor: Colors.ABM_DARK_BLUE }}>
                            {QUESTIONNAIRE_TYPE.map((data, index) => {
                                return (
                                    <HStack bottom={Spacing[6]} key={`quistype${index}`}>
                                        <Spacer />
                                        <View style={{
                                            height: Spacing[18],
                                            width: Spacing[18],
                                            right: Spacing[6],
                                            backgroundColor: Colors[data.color],
                                            borderRadius: Spacing[128], borderWidth: Spacing[2],
                                            borderColor: Colors[data.color],
                                            alignContent: 'center',
                                            justifyContent: 'center'
                                        }} >
                                            <HStack>
                                                <Spacer /><Text type="body" text={(index + 1).toString()} style={{ fontSize: Spacing[10] }} /><Spacer />
                                            </HStack>
                                        </View>
                                        <Text type={"body"} style={{ fontSize: Spacing[12] }}>{data.text}</Text>
                                        <Spacer />
                                    </HStack>
                                )
                            })}
                        </VStack>
                        <Spacer />
                    </HStack>
                    <Spacer height={Spacing[12]} />
                </>
            )
        }

        return (
            <VStack
                testID="cultureMeasurementMain"
                style={styles.bg}
            >
                <SafeAreaView style={Layout.flex}>
                    <ScrollView
                    >
                        <VStack style={{ backgroundColor: Colors.ABM_BG_BLUE }}>
                            <ImageBackground source={images.feedbackBgPattern} style={{ height: '100%' }} resizeMode={"cover"}>
                                <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
                                <VStack top={Spacing[0]} horizontal={Spacing[24]} bottom={Spacing[12]}>
                                    {/* Render if no questionare available */}
                                    {
                                        publishData === null &&
                                        <VStack horizontal={Spacing[24]} top={Spacing[24]} style={Layout.widthFull}>
                                            <VStack>
                                                <HStack bottom={Spacing[12]}>
                                                <Spacer />
                                                <Man1 height={Spacing[256]} width={Spacing[256]} />
                                                <Spacer />
                                                </HStack>
                                                <Text type={"body"} style={{ textAlign: "center" }}>
                                                Belum ada kuesioner yang diterbitkan!
                                                </Text>
                                                <Spacer height={Spacing[12]} />
                                            </VStack>
                                        </VStack>
                                    }
                                    {/* Render if questionare available */}
                                    {
                                        publishData != null && 
                                        <>
                                        <Text type={"header"} text={publishData.title} underlineWidth={Spacing[160] + Spacing[84]} />
                                        <Spacer height={Spacing[24]} />

                                        {listDescription.map((item, index) => {
                                            if (item !== descSeparator) {
                                                return (
                                                    <>
                                                        <Text type={"body"} style={{ textAlign: "center", fontSize: Spacing[12] }}>
                                                            {item}
                                                        </Text>
                                                    </>
                                                )
                                            } else {
                                                return renderQuestionnaireType()
                                            }
                                        })}

                                        {/* start periode pengisian segment */}
                                        <VStack top={Spacing[24]} horizontal={Spacing[12]} bottom={Spacing[12]}>
                                            <Text type="left-header" text="Periode Pengisian:" style={{ fontSize: Spacing[16] }} />
                                            <Spacer height={Spacing[12]} />
                                            <VStack horizontal={Spacing[8]} vertical={Spacing[8]}
                                                style={{ backgroundColor: Colors.WHITE, width: Spacing[160] + Spacing[84], maxWidth: Spacing[160] + Spacing[112], borderRadius: Spacing[20], borderWidth: Spacing[2], borderColor: Colors.ABM_DARK_BLUE }}>
                                                <Text type="body" style={{ fontSize: Spacing[12] }}> {startDate} - {endDate}</Text>
                                            </VStack>
                                            <Spacer height={Spacing[12]} />
                                            <VStack horizontal={Spacing[24]} top={Spacing[12]}
                                                style={[Layout.widthFull, { backgroundColor: Colors.WHITE, borderRadius: Spacing[20], borderWidth: Spacing[2], borderColor: Colors.ABM_DARK_BLUE }]}>
                                                {listCMObjectives.map((data, index) => {
                                                    return (
                                                        <VStack style={{ borderBottomColor: Colors.ABM_DARK_BLUE, borderBottomWidth: index < 2 ? Spacing[1] : Spacing[0], paddingVertical: Spacing[12] }} key={`quiz${index}`}>
                                                            <HStack style={{ bottom: Spacing[6] }}>
                                                                <View style={{
                                                                    height: Spacing[18],
                                                                    width: Spacing[18],
                                                                    right: Spacing[12],
                                                                    backgroundColor: data.cmoMaxAnswerred ? Colors.GRAY74 : Colors[data.color],
                                                                    borderRadius: Spacing[128], borderWidth: Spacing[1],
                                                                    borderColor: Colors.ABM_DARK_BLUE,
                                                                    alignContent: 'center',
                                                                    justifyContent: 'center'
                                                                }} />
                                                                <Text type="body-bold" style={{ fontSize: Spacing[12], width: Spacing[128] }} >{data.cmoTitle}</Text>
                                                                <Spacer />
                                                                <Button type={data.isEnable ? "primary" : "negative"} text="Isi Kuisioner" style={{ paddingHorizontal: Spacing[8] }} textStyle={{ fontSize: Spacing[12] }}
                                                                    disabled={!data.isEnable} onPress={() => goToQuestionnaire(data.cmoId, index)} />
                                                                {/* disabled={false} onPress={() => goToQuestionnaire(data.cmoId, index)} /> */}
                                                            </HStack>
                                                            {data.cmoLastModified !== null &&
                                                                <Text type="body" style={{ fontSize: Spacing[12], fontWeight: '100' }}>{`Terakhir diisi  pada tanggal ${data.cmoLastModified}`}</Text>
                                                            }
                                                            <Spacer height={data.cmoLastModified !== null ? Spacing[2] : Spacing[6]} />
                                                            <ProgressBar
                                                                progress={(data && data['cmTakersLastDraft'] && data['cmTakersLastDraft']['cm_taker_last_filled'] ?
                                                                    data['cmTakersLastDraft']['cm_taker_last_filled'] : 0) / (data && data['cmTakersLastDraft'] && data['cmTakersLastDraft']['cm_taker_total_section'] ?
                                                                        data['cmTakersLastDraft']['cm_taker_total_section'] : 1)}
                                                                color={Colors.ABM_YELLOW}
                                                                style={{ height: Spacing[8], backgroundColor: Colors.GRAY74 }}
                                                            />
                                                            {/* <Spacer height={Spacing[6]} /> */}
                                                        </VStack>
                                                    )
                                                })}
                                            </VStack>
                                        </VStack>
                                        </>
                                    }
                                </VStack>
                            </ImageBackground>
                            <Spacer height={Spacing[12]} />
                        </VStack>
                    </ScrollView >
                </SafeAreaView >
                <Spinner visible={cultureMeasurementStore.isLoading} textContent={"Memuat..."} />
            </VStack >
        )
    })

export default CultureMeasurementMain

const styles = StyleSheet.create({
    bg: {
        backgroundColor: Colors.ABM_BG_BLUE, flex: 1, justifyContent: "center"
    },
    bgBottom: { backgroundColor: Colors.WHITE, borderTopEndRadius: Spacing[0], borderTopStartRadius: Spacing[48], minHeight: dimensions.screenHeight * 1.5 }
});