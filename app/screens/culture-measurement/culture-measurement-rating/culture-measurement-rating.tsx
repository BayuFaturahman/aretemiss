import React, { FC, useCallback, useEffect, useReducer, useState, useRef } from "react"
import { SafeAreaView, ScrollView, StyleSheet, View, TouchableOpacity } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, Button, TextField, DropDownPicker, DropDownItem } from "@components"

import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"

import { useStores } from "../../../bootstrap/context.boostrap"

import { dimensions } from "@config/platform.config"

import Spinner from "react-native-loading-spinner-overlay"
import { Formik } from "formik"

import { IOption } from "react-native-modal-selector"

import { ProgressBar } from "react-native-paper"
import moment from "moment"
import { CMSectionModel, QuestionnaireModel } from "@services/api/cultureMeasurement/culture-measurement-api.types"
import { QUESTIONNAIRE_EXAMPLE, QUESTIONNAIRE_OPTION } from "../culture-measurement.type"
import { debounce } from "lodash"
import { USER_POSITION } from "@screens/settings/change-user-position"

const cultureMeasurementRating: FC<StackScreenProps<NavigatorParamList, "cultureMeasurementRating">> =
    observer(({ navigation, route }) => {

        const [, forceUpdate] = useReducer((x) => x + 1, 0)
        const { cmoId, isToCreate, cmTakerId } = route.params
        const { mainStore, cultureMeasurementStore } = useStores()
        const scrollRef = useRef();

        const [totalPage, setTotalPage] = useState<number>(1)
        const [currPage, setCurrPage] = useState<number>(1)
        const [isError, setIsError] = useState<boolean>(false)

        const [listSectionData, setListSectionData] = useState<CMSectionModel[]>([])
        const [listDescription, setListDescription] = useState<string[]>([])
        const [listQuestionnaire, setListQuestionnaire] = useState<QuestionnaireModel[]>([QUESTIONNAIRE_EXAMPLE])

        // states for appraisal form
        const [date, setDate] = useState<string>('')
        const [fullName, setFullName] = useState<string>('')
        const [userPosition, setUserPosition] = useState<string>('')
        const [sn, setSn] = useState<string>('')
        const [structurePos, setStructurePos] = useState<string>('')

        const [teamList, setTeamList] = useState<DropDownItem[]>([])
        const [memberList, setMemberList] = useState<DropDownItem[]>([])
        
        const [editFullName, setEditFullname] = useState<boolean>(false)
        const [myTeamValue, setMyTeamValue] = useState(mainStore.userProfile.team1_id? {"id": mainStore.userProfile.team1_id, "item": mainStore.userProfile.team1_name}:{})
        const [teamMemberValue, setTeamMemberValue] = useState<string>()
        const [cmMemberPagination, setCmMemberPagination] = useState<number>(1)
        const [cmMemberLimit, setCmMemberLimit] = useState<number>(10)


        const descSeparator = '{{type_answer}}';
        const positionSeparator = '{{user_position}}';
        const teamSeparator = '{{user_team}}';

        const handleNextButton = () => {
            if (currPage === 3) {
                goToQuestionnaire()
            } else {
                setCurrPage((page) => page + 1 )
            }
        }

        const handleBackButton = () => {
            if (currPage !== 1) {
                setCurrPage((page) => page - 1 )
            } else {
                goBack()
            }
        }

        const goBack = () => {
            navigation.goBack()
        }

        const goToQuestionnaire = () => {
            navigation.navigate("cultureMeasurementRatingQuestionnaire", {
                cmoId: cmoId,
                isToCreate: isToCreate,
                totalPage: totalPage,
                cmTakerId: cmTakerId
            })
        }

        const goToChangePosition = () => navigation.navigate("changeUserPosition")

        const getTeam = useCallback(async () => {
            await mainStore.getTeamList()
        }, [])

        const getMemberList = useCallback(async () => {
            await cultureMeasurementStore.getCmMemberList(cmMemberPagination, cmMemberLimit)
        }, [])

        // Fetch area / fungsi dropdown selection
        useEffect(() => {
            if (mainStore.teamResponse !== null) {
                const itemsData: DropDownItem[] = mainStore.teamResponse.data.map((item, index) => {
                    return {
                    item: item.name,
                    id: item.id,
                    }
                })
                setTeamList(itemsData)
            }
          }, [mainStore.teamResponse])

        // Fetch culturemeasurement people to-rate
        useEffect(() => {
            if (cultureMeasurementStore.cmListUsersData !== null) {
                const itemsData: DropDownItem[] = cultureMeasurementStore.cmListUsersData.data.map((item, index) => {
                    return {
                    item: item.fullname,
                    id: item.id,
                    }
                })
                setMemberList(itemsData)
            }
        }, [cultureMeasurementStore.cmListUsersData])

        const loadCMAllSectionData = async (cmoId: string) => {
            console.log('loadCMPublishData ')
            await cultureMeasurementStore.getAllSection(cmoId)
            setListSectionData(cultureMeasurementStore.cmSections)
        }

        const firstLoadCMAllSectionData = debounce(async () => {
            console.log(`firstLoadCMAllSectionData`)
            await loadCMAllSectionData(cmoId)
            forceUpdate()
        }, 500)


        const loadGetAnswerData = async (cmTakerId: string) => {
            await cultureMeasurementStore.getCMAnswerById(cmTakerId)
            setListSectionData(cultureMeasurementStore.cmAnswerData.temp_data)
        }

        const firstLoadGetAnswerData = debounce(async () => {
            console.log(`firstLoadGetAnswerData`)
            await loadGetAnswerData(cmTakerId)
            forceUpdate()
        }, 500)

        const extractDesc = (page: number) => {
            // page 1 for appraiser
            // page 2 for rated_person
            // page 3 for example
            let type = page === 1 ? 'appraiser' : page === 2 ? 'rated_person' : 'example'

            let tempData = listSectionData.filter((data) => data.type === type)

            let tempCopyWriting: CMSectionModel
            if (tempData.length > 0) {
                tempCopyWriting = tempData[0]
                let tempDesc = tempCopyWriting.description
                tempDesc = tempDesc.split('<br>').join('')
                tempDesc = tempDesc.split('</p>').join('')
                tempDesc = tempDesc.split(descSeparator).join(`<p>${descSeparator}`)
                tempDesc = tempDesc.split(positionSeparator).join(userPosition)
                tempDesc = tempDesc.split(teamSeparator).join(structurePos)
                let listTempDesc = tempDesc.split('<p>',)
                setListDescription(listTempDesc)
            }
        }

        // Initial render hook
        useEffect(() => {
            // Set initial Date
            setDate(moment().format('DD MMMM YYYY'))
            // Set position
            setUserPosition(mainStore.userProfile.user_position ? USER_POSITION.filter((position) => position.id === mainStore.userProfile.user_position).length > 0 ? USER_POSITION.filter((position) => position.id === mainStore.userProfile.user_position)[0].item : '' : '')
            // Set fullname
            setFullName(mainStore.userProfile.user_fullname)
            // Fetch area / fungsi dropdown
            getTeam()
            // Fetch member to-rate drodown
            getMemberList()
        }, [])

        useEffect(() => {
            if (listSectionData?.length > 0) {
                setTotalPage(listSectionData.length)
                extractDesc(currPage)
            }
        }, [listSectionData, currPage])


        useEffect(() => {
            if (isToCreate && cmoId) {
                firstLoadCMAllSectionData()
            } else if (!isToCreate && cmTakerId) {
                firstLoadGetAnswerData()
            }
        }, [cmoId, isToCreate, cmTakerId])

        const renderAppraiserForm = () => {
            return (
                <>
                    {isError && <Text
                        type={"warning-not-bold"}
                        style={{
                            textAlign: 'center',
                            marginTop: Spacing[4],
                            color: Colors.MAIN_RED
                        }}
                    >Ups! Sepertinya ada kolom yang belum diisi! Silahkan dicek kembali dan isi semua kolom yang tersedia!</Text>
                    }

                    <TextField
                        label="Tanggal pengisian dimulai:"
                        value={date}
                        isRequired={true}
                        editable={false}
                        isError={isError}
                        secureTextEntry={false}
                        inputStyle={{borderRadius: Spacing[12]}}
                    />

                    <TextField
                        label="Nama Lengkap:"
                        value={fullName}
                        changeButton={true}
                        changeButtonText="Edit"
                        onChangeText={(e, val) => setFullName(val)}
                        isRequired={false}
                        editable={editFullName}
                        isError={isError}
                        secureTextEntry={false}
                        inputStyle={{borderRadius: Spacing[12]}}
                        onPressChangeButton={() => setEditFullname(!editFullName)}
                    />

                    <TextField
                        label="Posisi dalam Winning Team"
                        style={{ paddingTop: 0}}
                        inputStyle={{textAlign: 'left', borderRadius: Spacing[12], paddingLeft: Spacing[12], paddingVertical: Spacing[4]}}
                        isRequired={true}
                        secureTextEntry={false}
                        isTextArea={true}
                        changeButton={true}
                        changeButtonText="Edit"
                        editable={false}
                        value={userPosition}
                        onPressChangeButton={goToChangePosition}
                        />

                    <TextField
                        label="SN:"
                        value={sn}
                        onChangeText={(e, val) => setSn(val)}
                        isRequired={true}
                        editable={true}
                        isError={isError}
                        secureTextEntry={false}
                        inputStyle={{borderRadius: Spacing[12]}}
                    />

                    <TextField
                        label="Posisi Struktural:"
                        value={structurePos}
                        onChangeText={(e, val) => setStructurePos(val)}
                        isRequired={true}
                        editable={true}
                        isError={isError}
                        secureTextEntry={false}
                        inputStyle={{borderRadius: Spacing[12]}}
                    />

                    <DropDownPicker
                      items={teamList}
                      isRequired={true}
                      label="Area / Fungsi:"
                      isError={isError}
                      onValueChange={(value: IOption) => {
                        
                      }}
                      containerStyle={{ marginTop: Spacing[4] }}
                      placeholder={"Pilih salah satu"}
                      zIndex={3000}
                      zIndexInverse={1000}
                      dropDownDirection={"BOTTOM"}
                      isRemovable={false}
                      initialValue={myTeamValue}
                    />
                </>
            )
        }

        const renderRatePerson = () => {
            return (
                <>
                    {isError && <Text
                        type={"warning-not-bold"}
                        style={{
                            textAlign: 'center',
                            marginTop: Spacing[4],
                            color: Colors.MAIN_RED
                        }}
                    >Ups! Sepertinya ada kolom yang belum diisi! Silahkan dicek kembali dan isi semua kolom yang tersedia!</Text>
                    }

                    <DropDownPicker
                      items={memberList}
                      isRequired={true}
                      label="Nama individu yang dinilai:"
                      isError={isError}
                      onValueChange={(value: IOption) => {
                        setTeamMemberValue(value?.id)
                      }}
                      placeholder={""}
                      containerStyle={{ marginTop: Spacing[4] }}
                      zIndex={3000}
                      zIndexInverse={1000}
                      dropDownDirection={"BOTTOM"}
                      isRemovable={false}
                    />
                </>
            )
        }

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
                                <Spacer /><Text type="body" text={(index + 1).toString()} style={{ fontSize: Spacing[12], color: Colors[data.fontColor] }} /><Spacer />
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
                    <Text type="body-bold" style={{ fontSize: Spacing[16] }}>Contoh:</Text>
                    <HStack >
                        <VStack>
                            <Text type="body-bold">1.</Text>
                            <Spacer />
                        </VStack>
                        <Spacer width={Spacing[6]} />
                        <Text type="body-bold" >Melaksanakan tugas dengan semangat untuk menunjukan hasil terbaik.</Text>
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
                        <VStack horizontal={Spacing[12]} vertical={Spacing[12]}>
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
                    <Text type="body" style={{ fontSize: Spacing[12] }} >Jawaban tersebut berarti perilaku “Melaksanakan tugas dengan semangat untuk menunjukan hasil terbaik” yang dijalankan oleh pemimpin Juara yang Anda nilai dinilai masih di bawah standar yang diharapkan.</Text>
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
                testID="cultureMeasurementRating"
                style={styles.bg}
            >
                <SafeAreaView style={Layout.flex}>
                    <ScrollView>
                        <VStack style={{ backgroundColor: Colors.WHITE, paddingTop: Spacing[12] }}>
                            <VStack top={Spacing[12]} horizontal={Spacing[24]} bottom={Spacing[12]}>
                                <HStack>
                                    <Text type={"left-header"} text={`Penilaian Budaya Juara`} style={{ fontSize: Spacing[16], textAlign: 'left' }} />
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
                                <View style={[{ height: Spacing[6], backgroundColor: Colors.ABM_YELLOW }, Layout.widthFull]}></View>
                                <Spacer height={Spacing[8]} />
                                {/* render appraiser form  on page 1 */}

                                {currPage === 1 && renderAppraiserForm()}

                                {/* render rate person form  on page 2 */}

                                {currPage === 2 && renderRatePerson()}

                                {/* render example questionaire on page 3*/}
                                
                                {currPage === 3 && renderQuestionExample()}
                                
                                <Spacer height={Spacing[24]} />
                                <HStack>
                                    <Button type={"primary-dark"} text="Sebelumnya" style={{ paddingHorizontal: Spacing[14], borderRadius: Spacing[12] }} onPress={() => handleBackButton()} />
                                    <Spacer />
                                    <Button type={"primary"} text="Selanjutnya" style={{ paddingHorizontal: Spacing[14], borderRadius: Spacing[12] }} onPress={() => handleNextButton()} />
                                </HStack>

                                <Spacer height={Spacing[24]} />
                                <ProgressBar
                                    progress={1 / totalPage}
                                    color={Colors.ABM_YELLOW}
                                    style={{ height: Spacing[8], backgroundColor: Colors.GRAY74 }}
                                />
                                <HStack>
                                    <Spacer />
                                    <Text>{currPage}/{totalPage}</Text>
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

export default cultureMeasurementRating

const styles = StyleSheet.create({
    bg: {
        backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center"
    },
    bgBottom: { backgroundColor: Colors.WHITE, borderTopEndRadius: Spacing[0], borderTopStartRadius: Spacing[48], minHeight: dimensions.screenHeight * 1.5 }
});