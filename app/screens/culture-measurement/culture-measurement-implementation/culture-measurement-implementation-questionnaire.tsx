import React, { FC, useCallback, useEffect, useReducer, useState, useRef } from "react"
import { KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, View, TouchableOpacity } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, Button } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"

import { useStores } from "../../../bootstrap/context.boostrap"

import { dimensions } from "@config/platform.config"
import { debounce } from "lodash"

import Spinner from "react-native-loading-spinner-overlay"
import { ProgressBar } from "react-native-paper"

import { CMCreateAnswerModel, CMSectionModel, CMUpdateAnswerModel, QuestionnaireModel } from "@services/api/cultureMeasurement/culture-measurement-api.types"
import { CM_SECTION_EMPTY, QUESTIONNAIRE_EXAMPLE, QUESTIONNAIRE_OPTION } from "../culture-measurement.type"
import { ModalComponent } from "../component/cm-modal"

const CultureMeasurementImplementation: FC<StackScreenProps<NavigatorParamList, "cultureMeasurementImplementationQuestionnaire">> =
    observer(({ navigation, route }) => {

        const [, forceUpdate] = useReducer((x) => x + 1, 0)
        const { cmoId, isToCreate, totalPage, cmTakerId, goToPage } = route.params
        const { cultureMeasurementStore, mainStore } = useStores()
        const scrollRef = useRef();

        const [submitBtnText, setSubmitBtnText] = useState<string>('Selanjutnya')

        const [isError, setIsError] = useState<boolean>(false)
        const [isNextClicked, setIsNextClicked] = useState<boolean>(false)

        const [currSectionNo, setCurrSectionNo] = useState<number>(0)
        const [currSectionData, setCurrSectionData] = useState<CMSectionModel>(CM_SECTION_EMPTY)

        const [currPage, setCurrPage] = useState<number>(1)

        const [listSectionData, setListSectionData] = useState<CMSectionModel[]>()
        const [listDescription, setLisDescription] = useState<string[]>([])
        const [listQuestionnaire, setListQuestionnaire] = useState<QuestionnaireModel[]>([QUESTIONNAIRE_EXAMPLE])
        const [listError, setListError] = useState<number[]>([])

        const [isModalVisible, setModalVisible] = useState<boolean>(false)
        const [isIconFromMood, setIsIconFromMood] = useState<boolean>(false)
        const [modalTitle, setModalTitle] = useState<string>("")
        const [modalDesc, setModalDesc] = useState<string>("")
        const [modalIcon, setModalIcon] = useState("senang")
        const [modalBtnText, setModalBtnText] = useState("")


        const setModalContent = (title: string, desc: string, icon: string) => {
            setModalTitle(title)
            setModalDesc(desc)
            setModalIcon(icon)
        }

        const goBack = () => {
            setIsError(false)

            if (currPage > 1) {
                if (currPage === totalPage - 1) {
                    setSubmitBtnText('Selanjutnya')
                }
                setCurrPage(currPage - 1)
                extractSection(currSectionNo - 1)
                setCurrSectionNo(currSectionNo - 1)
            } else {
                navigation.goBack()
            }
            scrollUp()
        }

        const goToNextPage = () => {
            console.log(`goToNextPage `)
            setIsError(false)

            // if going to last page
            if (currPage === totalPage - 2) {
                setSubmitBtnText('Submit Kuisioner')
            }

            // if current page = before last 2 pages
            if (currPage < (totalPage - 1)) {
                setCurrPage(currPage + 1)
            }
            extractSection(currSectionNo + 1)
            setCurrSectionNo(currSectionNo + 1)
            scrollUp()
        }

        const goToCultureMeasurement = () => navigation.navigate("cultureMeasurementMain")

        const scrollUp = () => {
            scrollRef?.current?.scrollTo({
                y: 0,
                animated: true,
            });
        }

        const loadGetAnswerData = async (cmTakerId: string) => {
            // console.log(`loadGetAnswerData, ${cmTakerId} `)
            await cultureMeasurementStore.getCMAnswerById(cmTakerId)
            setListSectionData(cultureMeasurementStore.cmAnswerData.temp_data)
            // console.log(`------ cultureMeasurementStore.cmAnswerData.temp_data: ${JSON.stringify(cultureMeasurementStore.cmAnswerData.temp_data)}`)
        }

        const firstLoadGetAnswerData = debounce(async () => {
            console.log(`firstLoadGetAnswerData`)
            await loadGetAnswerData(cmTakerId)
            forceUpdate()
        }, 500)



        const createCMAnswer = useCallback(async (data: CMCreateAnswerModel) => {
            // console.log(`create answer ${JSON.stringify(data)}`)
            await cultureMeasurementStore.createCMAnswer(data)
        }, [])

        const updateCMAnswer = useCallback(async (data: CMUpdateAnswerModel) => {
            // console.log(`updateCMAnswer ${JSON.stringify(data)}`)
            await cultureMeasurementStore.updateCMAnswer(cmTakerId, data)
        }, [])

        const extractDesc = useCallback(() => {
            let tempDesc = currSectionData.description
            tempDesc = tempDesc.split('<br>').join('')
            tempDesc = tempDesc.split('</p>').join('')
            
            let listTempDesc = tempDesc.split('<p>')
            setLisDescription(listTempDesc)
        }, [currSectionData, listDescription])

        const extractSection = useCallback(async (sectionNo: number) => {
            if (listSectionData?.length > 0 && sectionNo < listSectionData.length) {
                setCurrSectionData(listSectionData[sectionNo])
            }
        }, [listSectionData])

        const extractQuestionnaire = useCallback(() => {
            setListQuestionnaire(currSectionData.questionnaire)
            setListError(new Array(currSectionData.questionnaire.length).fill(0))
        }, [currSectionData, listQuestionnaire])

        useEffect(() => {
            if (currSectionData?.id !== '') {
                extractDesc()
                extractQuestionnaire()
            }
        }, [currSectionData])

        useEffect(() => {
            if (listSectionData?.length > 0) {
                if (isToCreate && cmoId) {
                    setCurrSectionNo(1)
                    extractSection(1)
                } else if (!isToCreate && cmTakerId) {

                    let tempGoToPage = 1
                    for (let i = 0; i < listSectionData.length; i++) {
                        let tempQues = listSectionData[i].questionnaire.filter(item => item.point === undefined)
                        if (tempQues.length > 0) {
                            tempGoToPage = i
                            i = listSectionData.length
                        }
                    }
                    extractSection(tempGoToPage)
                    setCurrSectionNo(tempGoToPage)
                    setCurrPage(tempGoToPage)
                    setCurrSectionNo(tempGoToPage)
                }
            }
        }, [listSectionData])

        useEffect(() => {
            // setListSectionData(CM_SECTION_MOCK_DATA)
            if (isToCreate && cmoId) {
                setListSectionData(cultureMeasurementStore.cmSections)
            } else if (!isToCreate && cmTakerId) {
                firstLoadGetAnswerData()


            }

            setIsNextClicked(false)
        }, [])

        const selectOption = useCallback((index, indexQ) => {
            let tempListQuestionnaire = [...listQuestionnaire]
            tempListQuestionnaire[index].point = indexQ + 1
            setListQuestionnaire(tempListQuestionnaire)
        }, [listQuestionnaire])

        const renderQuesitonOptions = (data: QuestionnaireModel, index, dataQ, indexQ) => {
            return (
                <>
                    <TouchableOpacity disabled={false} onPress={() => selectOption(index, indexQ)}>
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
                                    <Spacer /><Text type="body" text={(indexQ + 1).toString()} style={{ fontSize: Spacing[12], color: data.point === indexQ + 1 ? Colors[dataQ.fontColor] : Colors.WHITE }} /><Spacer />
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
                        <Text type={(listError[index] === 1 && isNextClicked) ? "warning-not-bold" : "body-bold"} style={{ fontSize: Spacing[14] }}>{data.item}</Text>
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

        const onClickCancel = () => {
            renderCancelModal()
        }

        const onClickSave = async () => {
            console.log(`click save`)
            await saveData()
        }

        const onClickNextOrSubmit = () => {
            console.log(`click next or submit `)

            setIsNextClicked(true)

            let temptErrorList = new Array(listQuestionnaire.length).fill(0)
            let tempIsError = false

            listQuestionnaire.map((data, index) => {
                if (!data.point || data.point === 0) {
                    temptErrorList[index] = 1
                    tempIsError = true
                    setIsError(true)
                }
            })
            setListError(temptErrorList)

            if (!tempIsError) {
                if (currPage === totalPage - 1) {
                    submitData()
                } else {
                    goToNextPage()
                }
            } else {
                scrollUp()
            }
        }

        const submitData = () => {
            console.log(`submit data`)
            saveOrSubmitData('submitted')
        }

        const saveData = useCallback(async () => {
            console.log(`simpan data`)
            saveOrSubmitData('draft')

        }, [cultureMeasurementStore.message, listSectionData])

        const saveOrSubmitData = useCallback(async (type: string) => {
            cultureMeasurementStore.formReset()
            // let tempParam = {}
            if (isToCreate) {
                console.log(`will create CM answer`)
                //prepare param
                let tempParam = {
                    cmo_id: cmoId,
                    rated_user_id: isToCreate ? mainStore.userProfile.user_id : cultureMeasurementStore.cmAnswerData.rated_user_id,
                    status: type,
                    sn: "", //null
                    structural_position: "", //null
                    temp_data: listSectionData
                }
                await createCMAnswer(tempParam)
                // console.log(`let tempParam =  ${JSON.stringify(tempParam)}`)
            } else {
                console.log(`will update CM answer`)
                //prepare body 
                let tempParam = {
                    rated_user_id: cultureMeasurementStore.cmAnswerData.rated_user_id,
                    status: type,
                    temp_data: listSectionData
                }
                await updateCMAnswer(tempParam)
                // console.log(`let tempParam =  ${JSON.stringify(tempParam)}`)
            }


            if (cultureMeasurementStore.message === 'Culture Measurement updated' || cultureMeasurementStore.message === 'Culture Measurement Created') {
                renderSuccessModal('disimpan')
            } else {
                renderFailModal()
            }
            forceUpdate()
        }, [listSectionData])

        const toggleModal = (value: boolean) => {
            setModalVisible(value)
        }

        const onClickModalBtn = () => {
            if (modalBtnText.includes('Kembali ke Main Menu')) {
                // on success save/submit
                goToCultureMeasurement()
            } else {
                // on fail to save/submit
                toggleModal(false)
            }
        }

        const renderSuccessModal = (actionType: string) => {
            setModalVisible(true)
            setModalContent("Sukses!", `Kuesioner telah berhasil ${actionType}!`, "senang")
            setModalBtnText('Kembali ke Main Menu\nKuesioner')
            setIsIconFromMood(true)
        }

        const renderFailModal = () => {
            setModalVisible(true)
            setModalContent("Ada Kesalahan!", "Ups! Sepertinya ada kesalahan!\nSilahkan coba lagi!", "sedih")
            setModalBtnText('Kembali ke\nMenu Sebelumnya')
            setIsIconFromMood(true)

        }

        const renderCancelModal = () => {
            setModalVisible(true)
            setModalContent("Kamu akan membatalkan pengisian kuesioner.", "Pengisian kuesioner akan dibatalkan. Apakah kamu yakin ingin membatalkannya?", "")
            setModalBtnText('Kembali ke Main Menu\nKuesioner')
            setIsIconFromMood(false)

        }

        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={Layout.flex}
            >
                <VStack
                    testID="cultureMeasurementImplementation"
                    style={styles.bg}
                >
                    <SafeAreaView style={Layout.flex}>
                        <ScrollView
                            ref={scrollRef}
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
                                        <Text type={"left-header"} text={`Penilaian Pelaksanaan\nProyek Budaya Juara`} style={{ fontSize: Spacing[16], textAlign: 'left' }} />
                                        <Spacer />
                                        <Button type={"dark-yellow"} text="Simpan Data" style={{ paddingHorizontal: Spacing[12], borderRadius: Spacing[12] }} onPress={() => onClickSave()} />
                                        <Spacer />
                                        <Button type={"warning"} text="Cancel" style={{ paddingHorizontal: Spacing[12], borderRadius: Spacing[12] }} onPress={() => onClickCancel()} />
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

                                    {isError &&
                                        <><Text
                                            type={"warning-not-bold"}
                                            style={{
                                                textAlign: 'center',
                                                marginTop: Spacing[4],
                                                color: Colors.MAIN_RED
                                            }}
                                        >Ups! Sepertinya ada kolom yang belum diisi! Silahkan dicek kembali dan isi semua kolom yang tersedia!</Text>
                                            <Spacer height={Spacing[12]} />
                                        </>
                                    }

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
                                        <Button type={"primary"} text={submitBtnText} style={{ paddingHorizontal: Spacing[14], borderRadius: Spacing[12] }} onPress={() => onClickNextOrSubmit()} />
                                    </HStack>

                                    <Spacer height={Spacing[24]} />
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
                    <Spinner visible={cultureMeasurementStore.isLoading} textContent={"Memuat..."} />

                    {isModalVisible &&
                        <ModalComponent
                            isModalVisible={isModalVisible}
                            isIconFromMood={isIconFromMood}
                            toggleModal={() => toggleModal(false)}
                            onClickModalBtn={() => onClickModalBtn()}
                            onClickCancelModalBtn={() => goToCultureMeasurement()}
                            modalTitle={modalTitle}
                            modalIcon={modalIcon}
                            modalDesc={modalDesc}
                            modalBtnText={modalBtnText}
                        />

                    }
                </VStack >
            </KeyboardAvoidingView>
        )
    })

export default CultureMeasurementImplementation

const styles = StyleSheet.create({
    bg: {
        backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center"
    },
    bgBottom: { backgroundColor: Colors.WHITE, borderTopEndRadius: Spacing[0], borderTopStartRadius: Spacing[48], minHeight: dimensions.screenHeight * 1.5 }
});
