import React, { FC, useCallback, useEffect, useReducer, useState, useRef } from "react"
import { KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, View, TouchableOpacity } from "react-native"
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
import { CMCreateAnswerModel, CMSectionModel, CMUpdateAnswerModel, QuestionnaireModel } from "@services/api/cultureMeasurement/culture-measurement-api.types"
import { CM_TEAM_MEMBER_VALUE_MOCK_DATA, QUESTIONNAIRE_EXAMPLE, QUESTIONNAIRE_OPTION } from "../culture-measurement.type"
import { debounce } from "lodash"
import { USER_POSITION } from "@screens/settings/change-user-position"
import { ProfileUpdateForm } from "@screens/settings/my-account"
import { ModalComponent } from "../component/cm-modal"

const cultureMeasurementRating: FC<StackScreenProps<NavigatorParamList, "cultureMeasurementRating">> =
    observer(({ navigation, route }) => {

        const [, forceUpdate] = useReducer((x) => x + 1, 0)
        const { cmoId, isToCreate, cmTakerId, isFromQuestionnaire } = route.params
        const { mainStore, cultureMeasurementStore } = useStores()
        const scrollRef = useRef();

        const [totalPage, setTotalPage] = useState<number>(1)
        const [currPage, setCurrPage] = useState<number>(1)
        const [isError, setIsError] = useState<boolean>(false)
        const [listError, setListError] = useState<number[]>([])

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
        const [myTeamValue, setMyTeamValue] = useState(mainStore.userProfile.team1_id ? { "id": mainStore.userProfile.team1_id, "item": mainStore.userProfile.team1_name } : {})
        const [teamMemberValue, setTeamMemberValue] = useState({ id: '', item: '' })
        const [cmMemberPagination, setCmMemberPagination] = useState<number>(1)
        const [cmMemberLimit, setCmMemberLimit] = useState<number>(10)

        const [isModalVisible, setModalVisible] = useState<boolean>(false)
        const [isIconFromMood, setIsIconFromMood] = useState<boolean>(true)
        const [modalTitle, setModalTitle] = useState<string>("")
        const [modalDesc, setModalDesc] = useState<string>("")
        const [modalIcon, setModalIcon] = useState("senang")
        const [modalBtnText, setModalBtnText] = useState("")


        const descSeparator = '{{type_answer}}';
        const positionSeparator = '{{user_position}}';
        const teamSeparator = '{{user_team}}';
        const userProfile: ProfileUpdateForm = {
            fullname: mainStore.userProfile.user_fullname,
            nickname: mainStore.userProfile.user_nickname,
            email: mainStore.userProfile.user_email,
            team1Id: mainStore.userProfile.team1_id,
            team2Id: mainStore.userProfile.team2_id,
            team3Id: mainStore.userProfile.team3_id,
            team1Name: mainStore.userProfile.team1_name,
            team2Name: mainStore.userProfile.team2_name,
            team3Name: mainStore.userProfile.team3_name,
            photo: mainStore.userProfile.user_photo,
            isAllowNotification: mainStore.userProfile.user_is_allow_notification,
            isAllowReminderNotification: mainStore.userProfile.user_is_allow_reminder_notification,
            mood: mainStore.userProfile.user_mood,
            userPosition: mainStore.userProfile.user_position ? USER_POSITION.filter((position) => position.id === mainStore.userProfile.user_position).length > 0 ? USER_POSITION.filter((position) => position.id === mainStore.userProfile.user_position)[0].item : '' : '',
        }

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

        const goToCultureMeasurement = () => navigation.navigate("cultureMeasurementMain")

        const goToQuestionnaire = (isGoToLastModifiedPage: boolean) => {
            navigation.navigate("cultureMeasurementRatingQuestionnaire", {
                cmoId: cmoId,
                isToCreate: isToCreate,
                totalPage: totalPage,
                cmTakerId: cmTakerId,
                isGoToLastModifiedPage: isGoToLastModifiedPage
            })
        }

        const goToChangePosition = () => navigation.navigate("changeUserPosition", {
            isFromSetting: false
        })

        const loadGetTeam = useCallback(async () => {
            await mainStore.getTeamList()
        }, [])

        const firstLoadGetTeam = debounce(async () => {
            console.log(`firstLoadGetTeam`)
            await loadGetTeam()
            forceUpdate()
        }, 500)

        const loadGetMemberList = useCallback(async () => {
            await cultureMeasurementStore.getCmMemberList(cmMemberPagination, cmMemberLimit)
        }, [])

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


        const createCMAnswer = useCallback(async (data: CMCreateAnswerModel) => {
            await cultureMeasurementStore.createCMAnswer(data)
        }, [])

        const updateCMAnswer = useCallback(async (data: CMUpdateAnswerModel) => {
            await cultureMeasurementStore.updateCMAnswer(cmTakerId, data)
        }, [])

        const handleBackButton = () => {
            if (currPage !== 1) {
                setCurrPage((page) => page - 1)
            } else {
                goBack()
            }
        }

        const handleNextButton = (async () => {
            if (currPage === 1) {
                validateAppraiserForm()
            } else if (currPage === 2) {
                validateRatePerson()
            } else if (currPage === 3) {
                goToQuestionnaire(false)
            }
        })

        const validateAppraiserForm = async () => {
            setIsError(false)
            setListError(new Array(5).fill(0))

            let tempListError = new Array(5).fill(0)
            let tempIsError = false
            if (fullName === '' || fullName === null) {
                tempListError[0] = 1
                tempIsError = true
            }

            if (userPosition === '' || userPosition === null) {
                tempListError[1] = 1
                tempIsError = true
            }

            if (sn === '' || sn === null) {
                tempListError[2] = 1
                tempIsError = true
            }

            console.log(`structurePos ${structurePos}`)
            if (structurePos === '' || structurePos === null) {
                tempListError[3] = 1
                tempIsError = true
            }

            if (myTeamValue.id === null || myTeamValue.id === '') {
                tempListError[4] = 1
                tempIsError = true
            }

            setListError(tempListError)
            setIsError(tempIsError)

            if (tempIsError) {
                return false
            }

            cultureMeasurementStore.cmSN = sn
            cultureMeasurementStore.cmStructurelPosition = structurePos
            userProfile.fullname = fullName
            userProfile.userPosition = userPosition
            userProfile.team1Id = myTeamValue.id

            await updateProfile()
        }

        const validateRatePerson = async () => {
            setIsError(false)
            setListError(new Array(1).fill(0))

            let tempListError = new Array(5).fill(0)
            let tempIsError = false
            if (teamMemberValue.id === '' || teamMemberValue.id === undefined) {
                tempListError[0] = 1
                tempIsError = true
            }

            setListError(tempListError)
            setIsError(tempIsError)

            if (tempIsError) {
                return false
            }
            cultureMeasurementStore.cmRatedUserId = teamMemberValue.id
            setCurrPage((page) => page + 1)
        }

        const updateProfile = async () => {
            console.log('on updateProfile')
            // console.log("Data to be submitted", userProfile)
            await mainStore.updateProfile(mainStore.userProfile.user_id, userProfile)
            if (mainStore.errorCode === null) {
                await mainStore.getProfile()

                cultureMeasurementStore.clearCMListUsersData()
                await loadGetMemberList()
                forceUpdate()
                setModalBtnText('Kembali ke Kuesioner')
                renderSuccessModal()
            } else {
                renderFailModal()
                console.log('error code ', mainStore.errorCode)
            }
        }

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
                // const itemsData: DropDownItem[] = CM_TEAM_MEMBER_VALUE_MOCK_DATA.map((item, index) => {
                const itemsData: DropDownItem[] = cultureMeasurementStore.cmListUsersData.map((item, index) => {
                    return {
                        item: item.fullname,
                        id: item.id,
                    }
                })
                setMemberList(itemsData)
            }
        }, [cultureMeasurementStore.getCmMemberListSucceed, cultureMeasurementStore.cmListUsersData, cultureMeasurementStore.isLoading])

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

        const setInitValue = () => {
            console.log(`setInitValue`)
            let tempCurrPage = 1
            // Set SN
            setSn(cultureMeasurementStore.cmAnswerData.sn)
            // Set position
            setStructurePos(cultureMeasurementStore.cmAnswerData.structural_position)

            console.log(`cultureMeasurementStore.cmAnswerData.rated_user_id ${cultureMeasurementStore.cmAnswerData.rated_user_id}`)
            if (cultureMeasurementStore.cmAnswerData.rated_user_id !== '') {
                let tempRatedPersonID = cultureMeasurementStore.cmAnswerData.rated_user_id
                let tempMatchRatedPerson = memberList.filter(item => item.id === tempRatedPersonID)
                let tempRatedPersonName = tempMatchRatedPerson.length > 0 ? tempMatchRatedPerson[0].item : ''
                // Set rate person
                setTeamMemberValue({ id: tempRatedPersonID, item: tempRatedPersonName })
            }
            if (isFromQuestionnaire) {
                tempCurrPage = 3
                console.log('its from questionnaire')
            } else {

                if (!cultureMeasurementStore.cmIsExistSubmttedRating) {
                    if (cultureMeasurementStore.cmAnswerData.sn === '' || cultureMeasurementStore.cmAnswerData.sn === null || cultureMeasurementStore.cmAnswerData.structural_position === '' || cultureMeasurementStore.cmAnswerData.structural_position === null) {
                        tempCurrPage = 1
                    }
                } else if (cultureMeasurementStore.cmAnswerData.rated_user_id === '') {
                    tempCurrPage = 2
                } else {
                    let tempGoToPage = 1
                    for (let i = 0; i < listSectionData.length; i++) {
                        if (listSectionData[i].type === 'questionnaire') {
                            let tempQues = listSectionData[i].questionnaire.filter(item => item.point === undefined)
                            if (tempQues.length > 0) {
                                tempGoToPage = i
                                i = listSectionData.length
                            }
                        }
                    }

                    if (tempGoToPage >= 3) {
                        goToQuestionnaire(true)
                    }
                }
            }
            extractDesc(tempCurrPage)
            setCurrPage(tempCurrPage)
        }

        useEffect(() => {
            if (listSectionData?.length > 0) {
                setTotalPage(listSectionData.length)

                if (isToCreate) {
                    let tempPage = 1;
                    if (cultureMeasurementStore.cmIsExistSubmttedRating) {
                        tempPage = 2
                    }
                    extractDesc(tempPage)
                    setCurrPage(tempPage)
                } else {
                    setInitValue()
                }
            }
        }, [listSectionData, cultureMeasurementStore.cmAnswerData, totalPage])


        useEffect(() => {
            // Initial render hook
            // Fetch area / fungsi dropdown
            firstLoadGetTeam()
            // Set initial Date
            setDate(moment().format('DD MMMM YYYY'))
            // Set fullname
            setFullName(mainStore.userProfile.user_fullname)
            // Set position
            setUserPosition(mainStore.userProfile.user_position ? USER_POSITION.filter((position) => position.id === mainStore.userProfile.user_position).length > 0 ? USER_POSITION.filter((position) => position.id === mainStore.userProfile.user_position)[0].item : '' : '')


            console.log(`cultureMeasurementStore.cmIsExistSubmttedRating ${cultureMeasurementStore.cmIsExistSubmttedRating}`)
            if (!isFromQuestionnaire) {
                if (isToCreate && cmoId) {
                    firstLoadCMAllSectionData()

                    setIsError(false)
                    setListError(new Array(5).fill(0))
                    forceUpdate()
                } else if (!isToCreate && cmTakerId) {
                    // console.log(`isFromQuestionnaire ${isFromQuestionnaire}`)
                    firstLoadGetAnswerData()
                }
            }
        }, [cmoId, isToCreate, cmTakerId])

        const onClickCancel = () => {
            renderCancelModal()
        }

        const onClickSave = async () => {
            console.log(`click save`)
            await saveData()
        }

        const saveData = useCallback(async () => {
            console.log('simpan data')
            cultureMeasurementStore.formReset()

            //prepare param
            let tempParam = {
                cmo_id: cmoId,
                rated_user_id: teamMemberValue.id,
                status: 'draft',
                sn: sn ? sn : '', //null
                structural_position: structurePos ? structurePos : '', //null
                temp_data: listSectionData
            }

            // console.log(`let tempParam =  ${JSON.stringify(tempParam)}`)
            if (isToCreate) {
                console.log(`will create CM answer`)
                await createCMAnswer(tempParam)
            } else {
                console.log(`will update CM answer`)
                await updateCMAnswer(tempParam)
            }

            if (cultureMeasurementStore.message === 'Culture Measurement updated' || cultureMeasurementStore.message === 'Culture Measurement Created') {
                setModalBtnText('Kembali ke Main Menu\nKuesioner')
                renderSuccessModal()
            } else {
                renderFailModal()
            }
            forceUpdate()
        }, [listSectionData, sn, teamMemberValue, structurePos])

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
                        secureTextEntry={false}
                        inputStyle={{ borderRadius: Spacing[12], backgroundColor: Colors.ABM_BG_BLUE }}
                    />

                    <TextField
                        label="Nama Lengkap:"
                        value={fullName}
                        changeButton={true}
                        changeButtonText="Edit"
                        onChangeText={(val) => setFullName(val)}
                        isRequired={false}
                        editable={editFullName}
                        isError={listError[0] === 1}
                        secureTextEntry={false}
                        inputStyle={{ borderRadius: Spacing[12], backgroundColor: editFullName ? Colors.WHITE : Colors.ABM_BG_BLUE }}
                        onPressChangeButton={() => setEditFullname(!editFullName)}
                    />

                    <TextField
                        label="Posisi dalam Winning Team"
                        style={{ paddingTop: 0 }}
                        inputStyle={{ textAlign: 'left', borderRadius: Spacing[12], paddingLeft: Spacing[12], paddingVertical: Spacing[4], backgroundColor: Colors.ABM_BG_BLUE }}
                        isRequired={true}
                        secureTextEntry={false}
                        isTextArea={true}
                        changeButton={true}
                        changeButtonText="Edit"
                        editable={false}
                        isError={listError[1] === 1}
                        value={userPosition}
                        onPressChangeButton={() => goToChangePosition()}
                    />

                    <TextField
                        label="SN:"
                        value={sn}
                        onChangeText={(val) => setSn(val)}
                        isRequired={true}
                        editable={true}
                        isError={listError[2] === 1}
                        secureTextEntry={false}
                        inputStyle={{ borderRadius: Spacing[12] }}
                    />

                    <TextField
                        label="Posisi Struktural:"
                        value={structurePos}
                        onChangeText={(val) => setStructurePos(val)}
                        isRequired={true}
                        editable={true}
                        isError={listError[3] === 1}
                        secureTextEntry={false}
                        inputStyle={{ borderRadius: Spacing[12] }}
                    />

                    <DropDownPicker
                        items={teamList}
                        isRequired={true}
                        label="Area / Fungsi:"
                        isError={listError[4] === 1}
                        onValueChange={(value: IOption) => {
                            setMyTeamValue(value)
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
                        isError={listError[0] === 1}
                        onValueChange={(value: IOption) => {
                            setTeamMemberValue({
                                id: value?.id,
                                item: value?.item
                            })
                        }}
                        placeholder={""}
                        containerStyle={{ marginTop: Spacing[4] }}
                        zIndex={3000}
                        zIndexInverse={1000}
                        dropDownDirection={"BOTTOM"}
                        isRemovable={false}
                        initialValue={teamMemberValue}
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

        const renderSuccessModal = () => {
            setModalVisible(true)
            setModalContent("Sukses!", `Data telah berhasil disimpan!`, "senang")
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

        const onClickModalBtn = () => {
            // if click next
            if (modalTitle.includes('Sukses') && modalBtnText.includes('Kembali ke Kuesioner')) {
                toggleModal(false)
                setCurrPage((page) => page + 1)
                setListError(new Array(1).fill(0))
            } else if (modalTitle.includes('Sukses') && modalBtnText.includes('Kembali ke Main Menu')) {
                // if click simpan data, back to culture measurement main
                goToCultureMeasurement()
            } else {
                // on fail to save/submit
                toggleModal(false)
            }
        }

        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={Layout.flex}
            >
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
                                        <Button type={"dark-yellow"} text="Simpan Data" style={{ paddingHorizontal: Spacing[12], borderRadius: Spacing[12] }} onPress={() => onClickSave()} />
                                        <Spacer />
                                        <Button type={"warning"} text="Cancel" style={{ paddingHorizontal: Spacing[12], borderRadius: Spacing[12] }} onPress={() => onClickCancel()} />
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
                                        {/* Back button should be hidden on below condition:
                                        cultureMeasurementStore.cmIsExistSubmttedRating = true and on second page
                                    */}
                                        {((cultureMeasurementStore.cmIsExistSubmttedRating && currPage > 2) || !cultureMeasurementStore.cmIsExistSubmttedRating) &&
                                            < Button type={"primary-dark"} text="Sebelumnya" style={{ paddingHorizontal: Spacing[14], borderRadius: Spacing[12] }} onPress={() => handleBackButton()} />
                                        }
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
                    <Spinner visible={mainStore.isLoading || cultureMeasurementStore.isLoading || (currPage > 1 ? listDescription.length === 0 : false)} textContent={"Memuat..."} />

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

export default cultureMeasurementRating

const styles = StyleSheet.create({
    bg: {
        backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center"
    },
    bgBottom: { backgroundColor: Colors.WHITE, borderTopEndRadius: Spacing[0], borderTopStartRadius: Spacing[48], minHeight: dimensions.screenHeight * 1.5 }
});