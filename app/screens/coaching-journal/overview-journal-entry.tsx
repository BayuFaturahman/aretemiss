import React, { FC, useCallback, useReducer, useState, useEffect, useRef } from "react"
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, Button, TextField, BackNavigation, DropDownPicker, DropDownItem } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"
import { IOption } from "react-native-modal-selector"

import { dimensions } from "@config/platform.config"

import CalendarPicker from "react-native-calendar-picker"
import { typography } from "@theme"
import { useStores } from "../../bootstrap/context.boostrap"

import Modal from "react-native-modalbox"
import { MoodComponent } from "@screens/homepage/components/mood-component"

import moment from "moment"

import Spinner from "react-native-loading-spinner-overlay"
import { Formik } from "formik"
import { IconClose } from "@assets/svgs"
import FastImage from "react-native-fast-image"
import smileYellow from "@assets/icons/coachingJournal/empty/smile-yellow.png"
import { ABM_GREEN } from "@styles/Color"

const OverviewJournalEntry: FC<StackScreenProps<NavigatorParamList, "overviewJournalEntry">> = observer(
  ({ navigation, route }) => {
    const formikRef = useRef();
    const { mainStore, coachingStore } = useStores()

    const { journalId, isCoachee, jlId } = route.params

    // console.log("overview journal " + journalId)
    // console.log("is coachee " + isCoachee)
    // console.log("journalLearner ID " + jlId)

    const styles = StyleSheet.create({
      textError: {
        color: Colors.MAIN_RED,
      },
    })

    const fieldError = false

    // empty list state
    const [selectedActivities, setSelectedActivities] = useState<string>("")
    const [, forceUpdate] = useReducer((x) => x + 1, 0)
    const [dataJournalTags, setDataJournalTags] = useState([
      {
        id: '0',
        key: 'KPI coaching',
        item: 'KPI coaching'
      },
      {
        id: '1',
        key: 'Project Culture Coaching',
        item: 'Project Culture coaching',
      },
      {
        id: '2',
        key: 'other',
        item: 'Others',
      }
    ]);
    const [isModalVisible, setModalVisible] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null)
    const [dataTeamMember, setDataTeamMember] = useState<IOption[]>([])

    const [title, setTitle] = useState<string>("")
    const [jlContent, setJlContent] = useState<string>("")
    const [jlCommitment, setJlCommitment] = useState<string>("")
    const [jlLessonLearned, setJlLessonLearned] = useState<string>("")
    const [initValueJournalType, setInitValueJournalType] = useState({})

    const [activity, setActivity] = useState<string>("")
    const [isError, setError] = useState<string>("")

    const [isOnEditMode, setIsOnEditMode] = useState(true)

    const [coach, setCoach] = useState<string>("")
    const [isJlFilled, setIsJlFilled] = useState<boolean>(false)

    // Success / fail response modal
    const [isResponseModalVisible, setIsResponseModalVisible] = useState(false)
    const [modalTitle, setModalTitle] = useState<string>("")
    const [modalDesc, setModalDesc] = useState<string>("")
    const [modalIcon, setModalIcon] = useState("senang")
    const [modalButtonText, setModalButtonText] = useState("Kembali ke catatan")

    const journalEntryInitialValue = {
      // coachId: '',
      date: moment(new Date()).format("LLLL"),
      title: "",
      content: "",
      strength: "",
      improvement: "",
      recommendationForCoachee: "",
      type: "",
      label: "",
      documentsUrl: [],
      learner: "",
      jlLessonLearned: "",
      jlCommitment: "",
      jlContent: "",
      jlId: "",
    }

    const toggleModal = () => {
      setTimeout(() => {
        setModalVisible(!isModalVisible)
      }, 100)
    }

    const toggleResponseModal = () => {
      setTimeout(() => {
        setIsResponseModalVisible(!isResponseModalVisible)
      }, 100)
    }

    const closeModal = () => {
      setTimeout(() => {
        setModalVisible(false)
      }, 100)
    }

    const onDateChange = (selectedId) => {
      const dateTime = moment(selectedId).format("LLLL")
      setSelectedDate(dateTime)
      console.log(dateTime)
    }

    const getListUser = useCallback(async (id: string) => {
      await mainStore.getListUser(id)
      console.log("useEffect mainStore.listUserProfile", mainStore.listUserProfile)

      if (mainStore.listUserProfile) {
        console.log("mainStore.listUserProfile", mainStore.listUserProfile)
        const itemsData: IOption[] = mainStore.listUserProfile.map((item, index) => {
          return {
            key: index,
            label: item.fullname,
            id: item.id,
          }
        })
        setDataTeamMember(itemsData)
      }
    }, [])
    useEffect(() => {
      setSelectedDate(moment().format("LLLL"))
      // profileStore.resetLoading()
      // coachingStore.resetLoading()
    }, [])

    const getListDetail = useCallback(async () => {
      if (isCoachee) {
          // if coachee, use JournalLearnerDetailApi
          await coachingStore.getJournalLearnerDetail(jlId)

          console.log("is coachee true")
          console.log(coachingStore.learnerJournalDetail)

          journalEntryInitialValue.jlId = jlId
          journalEntryInitialValue.jlContent = coachingStore.learnerJournalDetail.jl_content
          journalEntryInitialValue.jlLessonLearned = coachingStore.learnerJournalDetail.jl_lesson_learned
          journalEntryInitialValue.jlCommitment = coachingStore.learnerJournalDetail.jl_commitment

          journalEntryInitialValue.type = coachingStore.type
          journalEntryInitialValue.label = coachingStore.label

          setJlLessonLearned(coachingStore.learnerJournalDetail.jl_lesson_learned)
          setJlCommitment(coachingStore.learnerJournalDetail.jl_commitment)
          setJlContent(coachingStore.learnerJournalDetail.jl_content)
          setTitle(`${coachingStore.learnerJournalDetail.journal.title}`)
          setSelectedDate(coachingStore.learnerJournalDetail.journal.date)
          setSelectedActivities(coachingStore.journalDetail.journal_type)
          setCoach(coachingStore.learnerJournalDetail.coach_fullname)
          if (coachingStore.learnerJournalDetail.is_filled) {
            setIsOnEditMode(false)
            setIsJlFilled(true)
          }
      } else {
        // if coach, use journalDetail API
        await coachingStore.getJournalDetail()

        console.log(JSON.stringify(coachingStore.journalDetail, null, 4), 'line 154')
        journalEntryInitialValue.title = coachingStore.journalDetail.journal_title
        journalEntryInitialValue.content = coachingStore.journalDetail.journal_content
        journalEntryInitialValue.strength = coachingStore.journalDetail.journal_strength
        journalEntryInitialValue.improvement = coachingStore.journalDetail.journal_improvement
        journalEntryInitialValue.recommendationForCoachee = coachingStore.journalDetail.journal_recommendation_for_coachee
        coachingStore.journalDetail.jl_learner_fullname.forEach((name, i) => {
          if (i == coachingStore.journalDetail.jl_learner_fullname.length - 1) {
            // if last element concat without space
            journalEntryInitialValue.learner = journalEntryInitialValue.learner.concat(name)
          } else {
            journalEntryInitialValue.learner = journalEntryInitialValue.learner.concat(name, ', ')
          }
        })
        journalEntryInitialValue.type = coachingStore.journalDetail.journal_type;
        journalEntryInitialValue.label = coachingStore.journalDetail.journal_label;

        setInitValueJournalType(dataJournalTags.find(data => data.key === coachingStore.journalDetail.journal_type))
        setJlLessonLearned(coachingStore.journalDetail.jl_learner.jl_lesson_learned)
        setJlCommitment(coachingStore.journalDetail.jl_learner.jl_commitment)
        setJlContent(coachingStore.journalDetail.jl_learner.journal_content)
        setTitle(`${coachingStore.journalDetail.journal_title}`)
        
        setSelectedDate(coachingStore.journalDetail.journal_date)
        setSelectedActivities(coachingStore.journalDetail.journal_type)
        forceUpdate()
        setIsOnEditMode(false)
      }
    }, [coachingStore.journalDetail, coachingStore.journalDetailSucced])

    useEffect(() => {
      console.log("coachingStore.isDetail", coachingStore.isDetail)
      if (coachingStore.isDetail) {
        setTimeout(() => {
          getListDetail()
        }, 20)
      } else {
        if (mainStore.userProfile && mainStore.userProfile.team1_id) {
          setTimeout(() => {
            getListUser(mainStore.userProfile.team1_id)
          }, 20)
        }
      }
    }, [])

    const goBack = () => {
      coachingStore.resetCoachingStore()
      navigation.goBack()
    }

    const goToOverviewJournalByCoachee = () => {
      console.log("journalEntryInitialValue : ", journalEntryInitialValue)
      navigation.navigate("overviewJournalEntryByUser", {
        title: title,
        learnerJournals: coachingStore.journalDetail.jl_learner
      })
    }

    const goToOverviewJournalByCoach = () => {
      console.log("journalEntryInitialValue : ", journalEntryInitialValue)
      navigation.navigate("overviewJournalEntryByUser", {
        title: title,
        coachJournal: coachingStore.learnerJournalDetail.journal
      })
    }

    const verifyData = async (data) => {
      console.log('');

      console.log(coachingStore.journalDetail.is_coachee)
      console.log(coachingStore.journalDetail.is_edited)
      console.log(coachingStore.isFormCoach)
      console.log(coachingStore.isDetail)
      console.log("verify data: ", data)

      if (coachingStore.isFormCoach) {
        if (data.content === "") {
          setError("content")
        } else if (data.strength === "") {
          setError("strength")
        } else if (data.improvement === "") {
          setError("improvement")
        } else if (data.commitment === "") {
          setError("commitment")
        } else if (!data.type || data.type === "") {
          setError("type")
        } else if (data.type === "Others" && data.label === "") {
          setError("label")
        } else {
          if (coachingStore.isDetail) {
            setError("")
            await coachingStore.updateJournal(
              data.content,
              data.commitment,
              data.strength,
              data.type,
              data.improvement,
              data.label,
            )
            // toggleModalEditEntry()
            setIsOnEditMode(false)
            // goToFeedback()
          }
        }
      }

      if (isCoachee) {
        if (data.jlContent === "" || data.jlContent === null) {
          setError("jlContent")
        } else if (data.jlLessonLearned === "" || data.jlLessonLearned === null) {
          setError("jlLessonLearned")
        } else if (data.jlCommitment === "" || data.jlCommitment === null) {
          setError("jlCommitment")
        } else {
          setError("")
          await coachingStore.updateJournalCoachee(
            data.jlContent,
            data.jlLessonLearned,
            data.jlCommitment,
            data.jlId,
          )
          setIsOnEditMode(false)
        }
      }
    }

    const onClickEditEntry = () => {
      setIsOnEditMode(true)
    }

    const onClickCancel = () => {
      setIsOnEditMode(false)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      formikRef?.current?.resetForm()
    }

    const setModalContent = (title: string, desc: string, icon: string, buttonText: string) => {
      setModalTitle(title)
      setModalDesc(desc)
      setModalIcon(icon)
      setModalButtonText(buttonText)
    }
    
    // Handle redirect to home or close modal
    const handleModalResponse = () => {
      if (coachingStore.messageUpdatedJournal === "Success" && !isJlFilled && isCoachee) {
        coachingStore.resetCoachingStore()
        coachingStore.setRefreshData(true)
        coachingStore.clearJournal().then(()=>{
          navigation.reset({
            routes: [{ name: 'coachingJournalMain' }]
          })
        })
      } else {
        toggleResponseModal()
      }
    }

    // Set modal content based on API success / fail
    useEffect(() => {
      if (coachingStore.messageUpdatedJournal) {
        if(coachingStore.messageUpdatedJournal === "Success"){
          if (isJlFilled && isCoachee) {
            // case coachee edit
            setModalContent("Sukses!", "Catatan telah sukses diedit!", "senang", "Kembali ke Catatan")
          } else if (!isJlFilled && isCoachee){
            // case coachee initial input
            setModalContent("Sukses!", "Catatan telah sukses disimpan!", "senang", "Kembali ke Menu utama Coaching Journal")
          } else {
            // case coach edit
            setModalContent("Sukses!", "Catatan telah sukses diedit!", "senang", "Kembali ke Catatan")
          }
        } else {
          setModalContent("Ada Kesalahan!", "Ups! Sepertinya ada kesalahan!\n Silahkan coba lagi", "terkejut", "Kembali ke Catatan")
        }
        toggleResponseModal()
      }
    },[coachingStore.messageUpdatedJournal])

    useEffect(() => {
      if (!isOnEditMode) {
        // formikRef?.current?.resetForm()
      }
    }, [isOnEditMode])

    return (
      <VStack
        testID="CoachingJournalMain"
        style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
      >
        <SafeAreaView style={Layout.flex}>
          <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
          <ScrollView>
            <Formik
              innerRef={formikRef}
              initialValues={journalEntryInitialValue}
              onSubmit={(values) => {
                verifyData(values)
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => {

                const verifyData = async (data) => {
                  console.log(coachingStore.journalDetail.is_coachee)
                  console.log(coachingStore.journalDetail.is_edited)
                  console.log(coachingStore.isFormCoach)
                  console.log(coachingStore.isDetail)
                  console.log("verify data: ", data)

                  if (coachingStore.isFormCoach) {
                    if (data.content === "") {
                      setError("content")
                    } else if (data.strength === "") {
                      setError("strength")
                    } else if (data.improvement === "") {
                      setError("improvement")
                    } else if (data.recommendationForCoachee === "") {
                      setError("recommendationForCoachee")
                    } else if (!data.type || data.type === "") {
                      setError("type")
                    } else if (data.type === "Others" && data.label === "") {
                      setError("label")
                    } else {
                      if (coachingStore.isDetail) {
                        setError("")
                        await coachingStore.updateJournal(
                          data.content,
                          data.recommendationForCoachee,
                          data.strength,
                          data.type,
                          data.improvement,
                          data.label,
                        ).then(_ => {
                          setFieldValue('content', data.content)
                          setFieldValue('recommendationForCoachee', data.recommendationForCoachee)
                          setFieldValue('strength', data.strength)
                          setFieldValue('type', data.type)
                          setFieldValue('improvement', data.improvement)
                          setIsOnEditMode(false)
                        })
                      }
                    }
                  }

                  if (isCoachee) {
                    if (data.jlContent === "" || data.jlContent === null) {
                      setError("jlContent")
                    } else if (data.jlLessonLearned === "" || data.jlLessonLearned === null) {
                      setError("jlLessonLearned")
                    } else if (data.jlCommitment === "" || data.jlCommitment === null) {
                      setError("jlCommitment")
                    } else {
                      setError("")
                      await coachingStore.updateJournalCoachee(
                        data.jlContent,
                        data.jlLessonLearned,
                        data.jlCommitment,
                        data.jlId,
                      )

                      // toggleModalEditEntry()
                      setIsOnEditMode(false)
                      // goToFeedback()
                    }
                  }
                }

                return(
                  <>
                    <VStack top={Spacing[32]} horizontal={Spacing[24]}>
                      <HStack>
                        <Text type={"left-header"} style={{}} underlineWidth={Spacing[256]} text="Coaching Journal Overview" />
                        <Spacer />
                        <HStack>
                          {isOnEditMode ? (
                            <Button type={"red-bg"} text={"Cancel"} onPress={onClickCancel} />
                          ) : (
                            <Button
                              type={"light-bg"}
                              text={"Edit"}
                              onPress={onClickEditEntry}
                            />
                          )}
                        </HStack>
                      </HStack>

                      <VStack>
                        <Spacer height={Spacing[8]} />
                        {/* <View
                          style={{
                            maxWidth: "100%",
                            backgroundColor: Colors.ABM_MAIN_BLUE,
                            borderRadius: Spacing[20],
                            minHeight: 44,
                            paddingHorizontal: Spacing[8]
                          }}>
                          <ScrollView
                            style={{
                              width: "100%",
                              borderRadius: Spacing[20],
                              minHeight: 44,
                            }}
                            horizontal={true}
                          > */}
                            <TextField
                              value={title}
                              isRequired={false}
                              editable={false}
                              inputStyle={{
                                backgroundColor: Colors.ABM_DARK_BLUE,
                                color: Colors.WHITE,
                                textAlign: "left",
                                paddingHorizontal: 10,
                                fontWeight: "bold",
                                borderWidth: 0,
                                borderRadius: Spacing[10]
                              }}
                              style={{ paddingVertical: 0 }}
                              secureTextEntry={false}
                            />
                          {/* </ScrollView> */}
                        {/* </View> */}

                        {isCoachee ? (
                          <HStack top={Spacing[8]}>
                            <VStack left={Spacing[24]} right={Spacing[8]}>
                              <Text
                                type={"body-bold"}
                                style={[
                                  { textAlign: "center", top: Spacing[4] },
                                  isError === "title" ? styles.textError : null,
                                ]}
                              >
                                {`dengan`}
                              </Text>
                            </VStack>
                            <TextField
                              value={coach}
                              isRequired={false}
                              editable={false}
                              inputStyle={{
                                backgroundColor: Colors.ABM_DARK_BLUE,
                                color: Colors.WHITE,
                                textAlign: "left",
                                paddingHorizontal: 10,
                                fontWeight: "bold",
                                borderRadius: Spacing[10]
                              }}
                              style={{
                                paddingVertical: 0,
                                paddingBottom: Spacing[12],
                                flex: 1,
                                width: "100%",
                              }}
                              secureTextEntry={false}
                            />
                          </HStack>
                        ) : (
                          <HStack top={Spacing[8]}>
                            <VStack left={Spacing[24]} right={Spacing[8]}>
                              <Text
                                type={"body-bold"}
                                style={[
                                  { textAlign: "center", top: Spacing[4] },
                                  isError === "title" ? styles.textError : null,
                                ]}
                              >
                                {`dengan`}
                              </Text>
                            </VStack>
                            <TextField
                              value={values.learner}
                              isRequired={false}
                              editable={false}
                              inputStyle={{
                                backgroundColor: Colors.ABM_DARK_BLUE,
                                color: Colors.WHITE,
                                textAlign: "left",
                                paddingHorizontal: 10,
                                fontWeight: "bold",
                                borderRadius: Spacing[10]
                              }}
                              style={{
                                paddingVertical: 0,
                                paddingBottom: Spacing[12],
                                flex: 1,
                                width: "100%",
                              }}
                              isTextArea={true}
                              secureTextEntry={false}
                            />
                          </HStack>
                        )}
                        <HStack>
                          <TouchableOpacity
                            style={{ height: "100%", width: "20%" }}
                            onPress={toggleModal}
                            disabled={coachingStore.isDetail}
                          >
                            <VStack
                              horizontal={Spacing[8]}
                              vertical={Spacing[2]}
                              style={{
                                flex: 1,
                                width: "100%",
                                borderRadius: Spacing[12],
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                                backgroundColor: Colors.ABM_DARK_BLUE,
                              }}
                            >
                              <Text
                                type={"button"}
                                style={{ color: Colors.WHITE, bottom: -Spacing[8] }}
                                text={`${moment(selectedDate).format("DD MMM")}`.split(" ")[0]}
                              />
                              <Text type={"button"} style={{ color: Colors.WHITE }}>
                                {`${moment(selectedDate).format("DD MMM")}`.split(" ")[1]}
                              </Text>
                            </VStack>
                          </TouchableOpacity>
                          <Spacer />
                          <VStack style={{ width: "75%" }}>
                            <Text
                              type={"body-bold"}
                              style={[
                                { textAlign: "center", top: Spacing[4] },
                                isError === "content" ? styles.textError : null,
                              ]}
                            >
                              {`Apa yang `}
                              <Text type={"body-bold"} style={{ color: Colors.ABM_LIGHT_BLUE }}>
                                {"dibicarakan"}
                              </Text>
                              {` saat coaching?`}
                            </Text>
                            <TextField
                              style={{ paddingTop: 0 }}
                              value={isCoachee ? values.jlContent : values.content}
                              isError={isError === "content" || isError === "jlContent"}
                              onChangeText={
                                isCoachee ? handleChange("jlContent") : handleChange("content")
                              }
                              inputStyle={
                                isOnEditMode
                                  ? { minHeight: Spacing[72], borderRadius: Spacing[10]}
                                  : { minHeight: Spacing[72], backgroundColor: Colors.ABM_BG_BLUE, borderRadius: Spacing[10] }
                              }
                              editable={isOnEditMode}
                              isRequired={false}
                              secureTextEntry={false}
                              isTextArea={true}
                            />
                          </VStack>
                        </HStack>
                        {coachingStore.isFormCoach && (
                          <VStack top={Spacing[12]}>
                            <Text
                              type={"body-bold"}
                              style={[
                                { textAlign: "center", top: Spacing[4] },
                                isError === "strength" ? styles.textError : null,
                              ]}
                            >
                              {`Sebagai coach, apa yang sudah saya lakukan dengan `}
                              <Text type={"body-bold"} style={{ color: Colors.ABM_LIGHT_BLUE }}>
                                {"efektif?"}
                              </Text>
                            </Text>
                            <TextField
                              style={{ paddingTop: 0 }}
                              inputStyle={
                                isOnEditMode
                                  ? { minHeight: Spacing[48], borderRadius: Spacing[10] }
                                  : { minHeight: Spacing[48], backgroundColor: Colors.ABM_BG_BLUE, borderRadius: Spacing[10] }
                              }
                              editable={isOnEditMode}
                              isRequired={false}
                              value={values.strength}
                              isError={isError === "strength"}
                              onChangeText={handleChange("strength")}
                              secureTextEntry={false}
                              isTextArea={true}
                            />
                          </VStack>
                        )}
                        {coachingStore.isFormCoach && (
                          <VStack top={Spacing[12]}>
                            <Text
                              type={"body-bold"}
                              style={[
                                { textAlign: "center", top: Spacing[4] },
                                isError == "improvement" ? styles.textError : null,
                              ]}
                            >
                              {`Sebagai coach, kualitas apa yang dapat saya `}
                              <Text
                                type={"body-bold"}
                                style={[
                                  { color: Colors.ABM_LIGHT_BLUE },
                                  fieldError ? styles.textError : null,
                                ]}
                              >
                                {"tingkatkan?"}
                              </Text>
                            </Text>
                            <TextField
                              style={{ paddingTop: 0 }}
                              inputStyle={
                                isOnEditMode
                                  ? { minHeight: Spacing[48] , borderRadius: Spacing[10]}
                                  : { minHeight: Spacing[48], backgroundColor: Colors.ABM_BG_BLUE, borderRadius: Spacing[10] }
                              }
                              editable={isOnEditMode}
                              isRequired={false}
                              secureTextEntry={false}
                              isTextArea={true}
                              isError={isError === "improvement"}
                              value={values.improvement}
                              onChangeText={handleChange("improvement")}
                            />
                          </VStack>
                        )}

                        {coachingStore.isFormCoach && (
                          <>
                            <VStack top={Spacing[12]}>
                              <Text
                                type={"body-bold"}
                                style={[
                                  { textAlign: "center", top: Spacing[4] },
                                  isError == "recommendationForCoachee" ? styles.textError : null,
                                ]}
                              >
                                Dari sesi coaching, apa
                                <Text type={"body-bold"} style={{ color: Colors.ABM_LIGHT_BLUE }}>
                                  {" rekomendasi saya untuk coachee?"}
                                </Text>
                              </Text>
                              <TextField
                                style={{ paddingTop: 0 }}
                                inputStyle={
                                  isOnEditMode
                                    ? { minHeight: Spacing[128] }
                                    : { minHeight: Spacing[128], backgroundColor: Colors.ABM_BG_BLUE }
                                }
                                isRequired={false}
                                secureTextEntry={false}
                                isTextArea={true}
                                editable={isOnEditMode}
                                value={values.recommendationForCoachee}
                                isError={isError === "recommendationForCoachee"}
                                onChangeText={handleChange("recommendationForCoachee")}
                              />
                            </VStack>
                          </>
                        )}
                      </VStack>
                      {isCoachee ? (
                        <>
                          <VStack top={Spacing[8]}>
                            <Text
                              type={"body-bold"}
                              style={[
                                { textAlign: "center", top: Spacing[4] },
                                isError == "content" ? styles.textError : null,
                              ]}
                            >
                              {`Tulislah `}
                              <Text type={"body-bold"} style={{ color: Colors.ABM_LIGHT_BLUE }}>
                                {'"lesson learned"'}
                              </Text>
                              {`-mu di coaching session ini.`}
                            </Text>
                            <TextField
                              style={{ paddingTop: 0 }}
                              value={values.jlLessonLearned}
                              isError={isError === "jlLessonLearned"}
                              onChangeText={handleChange("jlLessonLearned")}
                              inputStyle={
                                isOnEditMode
                                  ? { minHeight: Spacing[72] }
                                  : { minHeight: Spacing[72], backgroundColor: Colors.ABM_BG_BLUE }
                              }
                              editable={isOnEditMode}
                              isRequired={false}
                              secureTextEntry={false}
                              isTextArea={true}
                            />
                          </VStack>
                          <VStack>
                            <Text
                              type={"body-bold"}
                              style={[
                                { textAlign: "center", top: Spacing[4] },
                                isError == "content" ? styles.textError : null,
                              ]}
                            >
                              <Text type={"body-bold"} style={{ color: Colors.ABM_LIGHT_BLUE }}>
                                {"Komitmen"}
                              </Text>
                              {` apa saja yang sudah disepakati bersama?`}
                            </Text>
                            <TextField
                              style={{ paddingTop: 0 }}
                              value={values.jlCommitment}
                              isError={isError === "jlCommitment"}
                              onChangeText={handleChange("jlCommitment")}
                              inputStyle={
                                isOnEditMode
                                  ? { minHeight: Spacing[72] }
                                  : { minHeight: Spacing[72], backgroundColor: Colors.ABM_BG_BLUE }
                              }
                              editable={isOnEditMode}
                              isRequired={false}
                              secureTextEntry={false}
                              isTextArea={true}
                            />
                          </VStack>
                        </>
                      ) : null}
                      {/* TODO Kategori Coaching field */}
                      <VStack>
                        <Text
                          type={"body-bold"}
                          style={[
                            { textAlign: "left", top: Spacing[4] },
                            isError == "content" ? styles.textError : null,
                          ]}
                        >
                          {`Kategori coaching:`}
                        </Text>
                        {isCoachee?
                          <TextField
                            style={{ paddingTop: 0 }}
                            value={`${values.type}${(values.label !== '' && values.type === 'other') ? ` (${values.label})` : ''}`}
                            isError={isError === "jlCommitment"}
                            onChangeText={handleChange("jlCommitment")}
                            inputStyle={{ minHeight: Spacing[48], backgroundColor: Colors.ABM_BG_BLUE }
                            }
                            editable={false}
                            isRequired={false}
                            secureTextEntry={false}
                            isTextArea={true}
                          /> :
                          (isOnEditMode ? (
                            <>
                              <DropDownPicker
                                items={dataJournalTags}
                                isRequired={false}
                                hideInputFilter={true}
                                value={dataJournalTags.filter(item => item.key === values.type)[0]}
                                onValueChange={(value: DropDownItem | DropDownItem[]) => {
                                  if (value.key) {
                                    setFieldValue("type", value.key);
                                    if (value.key !== 'other') {
                                      setFieldValue("label", "");
                                    }
                                  }
                                }}
                                placeholder={"Pilih kategori"}
                                containerStyle={{ marginTop: -Spacing[24] }}
                                isError={isError === "type"}
                                multiple={false}
                                initialValue={initValueJournalType}
                              />
                              {values.type === "other" && (
                                <TextField
                                  style={{ paddingTop: 0 }}
                                  inputStyle={{ minHeight: Spacing[48], marginTop: Spacing[8], borderRadius: Spacing[10]}}
                                  placeholder="Tulis kategori coaching di sini."
                                  isRequired={false}
                                  secureTextEntry={false}
                                  isTextArea={false}
                                  editable={true}
                                  value={values.label}
                                  isError={isError === "label"}
                                  onChangeText={handleChange("label")}
                                />
                              )}
                            </>
                          ) : (
                            <TextField
                              style={{ paddingTop: 0 }}
                              value={`${values.type}${(values.label !== '' && values.type === 'other') ? ` (${values.label})` : ''}`}
                              isError={isError === "jlCommitment"}
                              onChangeText={handleChange("jlCommitment")}
                              inputStyle={
                                isOnEditMode
                                  ? { minHeight: Spacing[72], borderRadius: Spacing[10] }
                                  : { minHeight: Spacing[48], backgroundColor: Colors.ABM_BG_BLUE, borderRadius: Spacing[10] }
                              }
                              editable={isOnEditMode}
                              isRequired={false}
                              secureTextEntry={false}
                              isTextArea={true}
                            />
                          ))}
                      </VStack>
                    </VStack>

                    <VStack horizontal={Spacing[72]} vertical={Spacing[24]}>
                      {/* {isCoachee === false ? */}
                      {/*  <ActivitiesTypeLegends showedItems={[1]} />: */}
                      {/*  <ActivitiesTypeLegends showedItems={[2]} /> */}
                      {/* } */}
                      <Spacer height={Spacing[24]} />
                      {/* {coachingStore.isDetail ? */}
                      {!isOnEditMode ? (
                        <Button
                          type={"light-blue-form"}
                          text={isCoachee ? "Lihat Catatan Coach" : "Lihat catatan coachee"}
                          onPress={isCoachee ? goToOverviewJournalByCoach : goToOverviewJournalByCoachee}
                        />
                      ) : isCoachee ? (
                        <Button type={"primary-form"} text={"Simpan Catatan"} onPress={() => verifyData(values)}
                        />
                      ) : (
                        <Button type={"primary-form"} text={"Simpan Edit"} onPress={() => verifyData(values)} />
                      )}
                    </VStack>
                  </>
                )
              }}
            </Formik>
            <Spacer height={Spacing[72]} />
          </ScrollView>
        </SafeAreaView>

        <Modal
          isOpen={isModalVisible}
          style={{
            height: "50%",
            width: dimensions.screenWidth - Spacing[24],
            backgroundColor: "rgba(52, 52, 52, 0)",
          }}
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
              <VStack vertical={Spacing[12]}>
                <Spacer height={Spacing[24]} />
                <CalendarPicker
                  onDateChange={onDateChange}
                  textStyle={{
                    fontFamily: typography.primaryBold,
                    colors: Colors.ABM_MAIN_BLUE,
                  }}
                  selectedDayColor={Colors.ABM_MAIN_BLUE}
                  selectedDayTextColor={Colors.WHITE}
                  style={{ padding: Spacing[20] }}
                  width={dimensions.screenWidth - Spacing[64]}
                />
                <HStack style={[Layout.widthFull, { justifyContent: "center" }]}>
                  <Button type={"negative"} text={"Cancel"} onPress={toggleModal} />
                  <Button
                    type={"primary"}
                    text={"Pilih"}
                    onPress={toggleModal}
                    style={{ minWidth: Spacing[72] }}
                  />
                </HStack>
              </VStack>
            </VStack>
          </View>
        </Modal>

        <Modal
            isOpen={isResponseModalVisible}
            style={{
              position: "absolute",
              width: dimensions.screenWidth - Spacing[24],
              backgroundColor: "rgba(52, 52, 52, 0)",
            }}
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
                <VStack horizontal={Spacing[24]} top={Spacing[24]} style={Layout.widthFull}>
                  <VStack>
                    <VStack style={{
                        alignItems: "flex-end"
                      }}>
                        <TouchableOpacity onPress={toggleResponseModal}>
                          <IconClose height={Spacing[32]} width={Spacing[32]} />
                        </TouchableOpacity>
                    </VStack>
                    <HStack bottom={Spacing[32]}>
                      <Spacer />
                      <MoodComponent data={modalIcon} width={Spacing[96]} height={Spacing[96]} />
                      <Spacer />
                    </HStack>
                    <Text
                      type={"body-bold"}
                      style={{ fontSize: Spacing[32], textAlign: "center", color: ABM_GREEN }}
                      text={modalTitle}
                    />
                    <Spacer height={Spacing[24]} />
                    <Text type={"body"} style={{ textAlign: "center" }} text={modalDesc} />
                    <Spacer height={Spacing[20]} />
                    <HStack bottom={Spacing[24]}>
                      <Spacer />
                      <VStack style={{ maxWidth: Spacing[256], minWidth: Spacing[128] }}>
                        <Button
                          type={"primary-form"}
                          text={modalButtonText}
                          style={{ height: Spacing[32], paddingHorizontal: Spacing[8] }}
                          textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                          onPress={handleModalResponse}
                        />
                      </VStack>
                      <Spacer />
                    </HStack>
                  </VStack>
                </VStack>
              </VStack>
            </View>
          </Modal>
        <Spinner
          visible={coachingStore.isLoading || mainStore.isLoading}
          textContent={"Memuat..."}
        />
      </VStack>
    )
  },
)

export default OverviewJournalEntry
