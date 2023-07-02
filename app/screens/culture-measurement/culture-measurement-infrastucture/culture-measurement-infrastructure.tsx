import React, { FC, useEffect, useReducer, useState } from "react"
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

import Spinner from "react-native-loading-spinner-overlay"
import { ProgressBar } from "react-native-paper"
import moment from "moment"
import { CMSectionModel, QuestionnaireModel } from "@services/api/cultureMeasurement/culture-measurement-api.types"
import { TouchableOpacity } from "react-native-gesture-handler"
import { QUESTIONNAIRE_EXAMPLE, QUESTIONNAIRE_OPTION } from "../culture-measurement.type"
import { debounce } from "lodash"
// import { EmptyList } from "./components/empty-list"

const CultureMeasurementInfrastructure: FC<StackScreenProps<NavigatorParamList, "cultureMeasurementInfrastructure">> =
    observer(({ navigation, route }) => {

        const [, forceUpdate] = useReducer((x) => x + 1, 0)
        const { cmoId, isToCreate, cmTakerId } = route.params
        const { cultureMeasurementStore } = useStores()

        const [totalPage, setTotalPage] = useState<number>(1)

        const [listSectionData, setListSectionData] = useState<CMSectionModel[]>([])
        const [listDescription, setLisDescription] = useState<string[]>([])
        const [listQuestionnaire, setListQuestionnaire] = useState<QuestionnaireModel[]>([QUESTIONNAIRE_EXAMPLE])

        const descSeparator = '{{type_answer}}';

        const goBack = () => {
            navigation.goBack()
        }

        const goToQuestionnaire = () => {
            navigation.navigate("cultureMeasurementInfrastructureQuestionnaire", {
                cmoId: cmoId,
                isToCreate: isToCreate,
                totalPage: totalPage,
                cmTakerId: cmTakerId
            })
        }

        const loadCMAllSectionData = async (cmoId: string) => {
            console.log('loadCMPublishData ')
            await cultureMeasurementStore.getAllSection(cmoId)
            setListSectionData(cultureMeasurementStore.cmSections)
            // console.log(`------ cultureMeasurementStore.cmImplementationSection: ${JSON.stringify(cultureMeasurementStore.cmImplementationSection)}`)
        }

        const firstLoadCMAllSectionData = debounce(async () => {
            console.log(`firstLoadCMAllSectionData`)
            await loadCMAllSectionData(cmoId)
            forceUpdate()
        }, 500)

        const loadGetAnswerData = async (cmTakerId: string) => {
            // console.log(`loadGetAnswerData, ${cmTakerId} `)
            await cultureMeasurementStore.getCMAnswerById(cmTakerId)
            setListSectionData(cultureMeasurementStore.cmAnswerData.temp_data)
            // console.log(`------ cultureMeasurementStore.cmImplementationSection: ${JSON.stringify(cultureMeasurementStore.cmImplementationSection)}`)
        }

        const firstLoadGetAnswerData = debounce(async () => {
            console.log(`firstLoadGetAnswerData`)
            await loadGetAnswerData(cmTakerId)
            forceUpdate()
        }, 500)

        const extractDesc = () => {
            let tempData = listSectionData.filter((data) => data.type === 'example')

            let tempCopyWriting: CMSectionModel
            if (tempData.length > 0) {
                tempCopyWriting = tempData[0]
                let tempDesc = tempCopyWriting.description
                tempDesc = tempDesc.replaceAll('<br>', '')
                tempDesc = tempDesc.replaceAll('</p>', '')
                tempDesc = tempDesc.replaceAll(descSeparator, `<p>${descSeparator}`)

                let listTempDesc = tempDesc.split('<p>',)
                setLisDescription(listTempDesc)
            }
        }

        useEffect(() => {
            if (listSectionData.length > 0) {
                setTotalPage(listSectionData.length)
                extractDesc()
            }
        }, [listSectionData])


        useEffect(() => {
            if (isToCreate && cmoId) {
                firstLoadCMAllSectionData()
            } else if (!isToCreate && cmTakerId) {
                firstLoadGetAnswerData()
            }
        }, [cmoId, isToCreate, cmTakerId])

        const renderQuesitonOptions = (data, index) => {
            return (
                <TouchableOpacity disabled={true}>
                    <HStack bottom={Spacing[6]} style={{ backgroundColor: index === 1 ? Colors.ABM_BG_BLUE : Colors.WHITE, paddingHorizontal: Spacing[12], paddingVertical: Spacing[6], borderRadius: Spacing[10] }}>
                        {/* <Spacer /> */}
                        <View style={{
                            height: Spacing[18] + Spacing[3],
                            width: Spacing[18] + Spacing[3],
                            right: Spacing[6],
                            backgroundColor: listQuestionnaire[0].point === index + 1 ? Colors[data.color] : Colors.GRAY74,
                            borderRadius: Spacing[128], borderWidth: Spacing[2],
                            borderColor: listQuestionnaire[0].point === index + 1 ? Colors[data.color] : Colors.GRAY74,
                            alignContent: 'center',
                            justifyContent: 'center'
                        }} >
                            <HStack>
                                <Spacer /><Text type="body" text={(index + 1).toString()} style={{ fontSize: Spacing[12], color: 'BLACK' }} /><Spacer />
                            </HStack>
                        </View>
                        <Text type={"body"} style={{ fontSize: Spacing[12] }}>{data.text}</Text>
                        <Spacer />
                    </HStack>
                </TouchableOpacity>
            )
        }

        const renderQuestionExample = () => {
            return (
                <>
                    <HStack >
                        <VStack>
                            <Text type="body-bold">1.</Text>
                            <Spacer />
                        </VStack>
                        <Spacer width={Spacing[6]} />
                        <Text type="body-bold" >Konsep pengembangan Budaya Perusahaan telah disusun secara jelas dan mencakup seluruh aspek organisasi perusahaan.</Text>
                    </HStack>
                    <Spacer height={Spacing[12]} />
                    <HStack >
                        {/* <Spacer /> */}
                        <VStack horizontal={Spacing[12]} vertical={Spacing[12]} >
                            {QUESTIONNAIRE_OPTION.map((data, index) => {
                                if (index < 3) {
                                    return (
                                        renderQuesitonOptions(data, index)
                                    )
                                }
                            })}
                        </VStack>
                        <Spacer />
                        <VStack horizontal={Spacing[12]} vertical={Spacing[12]} >
                            {QUESTIONNAIRE_OPTION.map((data, index) => {
                                if (index >= 3) {
                                    return (
                                        renderQuesitonOptions(data, index)
                                    )
                                }
                            })}
                            <Spacer />
                        </VStack>
                        <Spacer />
                    </HStack>
                </>
            )
        }

        const renderQuestionnaireType = () => {
            return (
                <>
                    <Spacer height={Spacing[12]} />
                    <HStack horizontal={Spacing[2]}>
                        <Spacer />
                        <VStack horizontal={Spacing[24]} vertical={Spacing[12]} style={{ backgroundColor: Colors.ABM_BG_BLUE, width: Spacing[160] + Spacing[24], borderRadius: Spacing[20], borderWidth: Spacing[2], borderColor: Colors.ABM_DARK_BLUE }}>
                            {QUESTIONNAIRE_OPTION.map((data, index) => {
                                return (
                                    <HStack bottom={Spacing[6]}>
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
                                                <Spacer /><Text type="body" text={(index + 1).toString()} style={{ fontSize: Spacing[10], color: Colors[data.fontColor] }} /><Spacer />
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
                testID="cultureMeasurementInfrastructure"
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
                        <VStack style={{ backgroundColor: Colors.WHITE, paddingTop: Spacing[12] }}>
                            {/* <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} /> */}
                            <VStack top={Spacing[12]} horizontal={Spacing[24]} bottom={Spacing[12]}>
                                <HStack>
                                    <Text type={"left-header"} text={`Penilaian Infrastruktur\nBudaya Juara`} style={{ fontSize: Spacing[16], textAlign: 'left' }} />
                                    <Spacer />
                                    {/* <Button type={"dark-yellow"} text="Simpan Data" style={{ paddingHorizontal: Spacing[12], borderRadius: Spacing[12] }} />
                                    <Spacer />
                                    <Button type={"warning"} text="Cancel" style={{ paddingHorizontal: Spacing[12], borderRadius: Spacing[12] }} onPress={() => goBack()} /> */}
                                </HStack>
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
                                <Spacer height={Spacing[8]} />

                                {/* start example questionaire */}
                                <Text type="body-bold" style={{ fontSize: Spacing[16] }}>Contoh:</Text>
                                {renderQuestionExample()}
                                <Text type="body" style={{ fontSize: Spacing[12] }} >Jawaban tersebut berarti pernyataan “Konsep pengembangan Budaya Perusahaan telah disusun secara jelas dan mencakup seluruh aspek organisasi perusahaan.” dinilai tidak sesuai dengan gambaran kesiapan infrastruktur budaya.</Text>
                                <Spacer height={Spacing[24]} />
                                <HStack>
                                    <Button type={"primary-dark"} text="Sebelumnya" style={{ paddingHorizontal: Spacing[14], borderRadius: Spacing[12] }} onPress={() => goBack()} />
                                    <Spacer />
                                    <Button type={"primary"} text="Selanjutnya" style={{ paddingHorizontal: Spacing[14], borderRadius: Spacing[12] }} onPress={() => goToQuestionnaire()} />
                                </HStack>

                                <Spacer height={Spacing[24]} />
                                <ProgressBar
                                    progress={1 / totalPage}
                                    color={Colors.ABM_YELLOW}
                                    style={{ height: Spacing[8], backgroundColor: Colors.GRAY74 }}
                                />
                                <HStack>
                                    <Spacer />
                                    <Text>1/{totalPage}</Text>
                                    <Spacer />
                                </HStack>
                                <Spacer height={Spacing[6]} />
                            </VStack>

                        </VStack>
                    </ScrollView >
                </SafeAreaView >
                <Spinner visible={cultureMeasurementStore.isLoading || listDescription.length === 0} textContent={"Memuat..."} />
            </VStack >
        )
    })

export default CultureMeasurementInfrastructure

const styles = StyleSheet.create({
    bg: {
        backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center"
    },
    bgBottom: { backgroundColor: Colors.WHITE, borderTopEndRadius: Spacing[0], borderTopStartRadius: Spacing[48], minHeight: dimensions.screenHeight * 1.5 }
});