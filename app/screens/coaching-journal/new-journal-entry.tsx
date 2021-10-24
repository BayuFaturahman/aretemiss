import React, { FC, useCallback, useReducer, useState, useEffect } from "react"
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, Button, TextField, DropDownPicker } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"
import { IOption } from "react-native-modal-selector"

import {
  ACTIVITIES_TYPE,
  ActivitiesTypeLegends,
} from "@screens/coaching-journal/components/activities-type-legends"

import { dimensions } from "@config/platform.config"

import CalendarPicker from "react-native-calendar-picker"
import { typography } from "@theme"
import { useStores } from "../../bootstrap/context.boostrap"

import Modal from "react-native-modalbox"
import moment from "moment"

import Spinner from "react-native-loading-spinner-overlay"

import { Formik } from 'formik';

export type JournalEntryType = {
  coachId: string
  date: string
  title: string
  content: string
  strength: string
  improvement: string
  commitment: string
  type: string
  learnerIds: string[]
  questions:{
    q1:string
    q2:string
    q3:string
    q4:string
    q5:string
    q6:string
  }
}

const JournalEntryInitialValue: JournalEntryType = {
  coachId: '',
  date: moment(new Date()).format('LLLL'),
  title: '',
  content: '',
  strength: '',
  improvement: '',
  commitment: '',
  type: '',
  learnerIds: [],
  questions:{
    q1:'',
    q2:'',
    q3:'',
    q4:'',
    q5:'',
    q6:'',
  }
};

const NewJournalEntry: FC<StackScreenProps<NavigatorParamList, "coachingJournalMain">> = observer(
  ({ navigation }) => {
    const { mainStore, coachingStore } = useStores()

    const styles = StyleSheet.create({
      textError: {
        color: Colors.MAIN_RED,
      },
    })

    const fieldError = false

    // empty list state
    const [selectedActivities, setSelectedActivities] = useState<string>("")
    const [, forceUpdate] = useReducer((x) => x + 1, 0)

    const [isModalVisible, setModalVisible] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null)
    const [dataTeamMember, setDataTeamMember] = useState<IOption[]>([])

    const [title, setTitle] = useState<string>("")
    const [learner, setLearner] = useState({})
    const [learnerDetail, setLearnerDetail] = useState("")

    const [content, setContent] = useState<string>("")
    const [leassons, setLeassons] = useState<string>("")

    const [strength, setStrength] = useState<string>("")
    const [improvement, setImprovement] = useState<string>("")
    const [commitment, setCommitment] = useState<string>("")
    const [activity, setActivity] = useState<string>("")
    const [isError, setError] = useState<string>("")

    const [isEncouragementModalVisible, setIsEncouragementModalVisible] = useState(false)

    const [journalEntryForm, setJournalEntryForm] = useState<JournalEntryType>(JournalEntryInitialValue);

    const toggleModal = () => {
      setTimeout(() => {
        setModalVisible(!isModalVisible)
      }, 100)
    }

    const toggleEncouragementModal = () => {
      setTimeout(() => {
        setIsEncouragementModalVisible(!isEncouragementModalVisible)
      }, 100)
    }

    const closeModal = () => {
      setTimeout(() => {
        setModalVisible(false)
      }, 100)
    }

    const onDateChange = (selectedDate, setFieldValue)=>{
      const dateTime = moment(selectedDate).format('LLLL')
      setSelectedDate(dateTime)
      setFieldValue('date', selectedDate)
      console.log(dateTime)
    }

    const getListUser = useCallback(async (id: string) => {
      await mainStore.getListUser(id)
      console.log('useEffect mainStore.listUserProfile', mainStore.listUserProfile)
    },[])

    useEffect(()=>{
      if(mainStore.listUserProfile){
        console.log('mainStore.listUserProfile', mainStore.listUserProfile)
        const itemsData:IOption[] = mainStore.listUserProfile.map((item, index)=>{
          return{
            key: index,
            label: item.fullname,
            id: item.id
          }
        })
        setDataTeamMember(itemsData)
      }
    },[mainStore.listUserProfile])

    useEffect(() => {
      setSelectedDate(moment().format("LLLL"))
      // profileStore.resetLoading()
      // coachingStore.resetLoading()
    }, [])

    const getListDetail = useCallback(async () => {
      await coachingStore.getJournalDetail()
      console.log("coachingStore.getListDetail", coachingStore.journalDetail)
      console.log("coachingStore.isDetailCoach", coachingStore.isDetailCoach)

      console.log("coachingStore.getListDetail.is_edited", coachingStore.journalDetail.is_edited)

      if (coachingStore.isDetailCoach) {
        setTitle(coachingStore.journalDetail.journal_title)
        setContent(coachingStore.journalDetail.journal_content)
        setStrength(coachingStore.journalDetail.journal_strength)
        setImprovement(coachingStore.journalDetail.journal_improvement)
        setCommitment(coachingStore.journalDetail.jl_commitment[0].desc)
        setSelectedDate(coachingStore.journalDetail.journal_date)
        setSelectedActivities(coachingStore.journalDetail.journal_type)
        setLearnerDetail(coachingStore.journalDetail.jl_learner_fullname[0])
        setLeassons(coachingStore.journalDetail.jl_lesson_learned[0].desc)
        forceUpdate()
      } else {
        setTitle(coachingStore.journalDetail.journal_title)
        setContent(coachingStore.journalDetail.jl_content)
        setCommitment(coachingStore.journalDetail.jl_commitment)
        setLeassons(coachingStore.journalDetail.jl_lesson_learned)
        setSelectedDate(coachingStore.journalDetail.journal_date)
        setSelectedActivities(coachingStore.journalDetail.journal_type)
        setLearnerDetail(coachingStore.journalDetail.coach_fullname)
        forceUpdate()
      }
    }, [coachingStore.journalDetail, coachingStore.journalDetailSucced])

    useEffect(()=>{
      // console.log('coachingStore.isDetail', coachingStore.isDetail)
      // if(coachingStore.isDetail){
      //   setTimeout(()=>{
      //     getListDetail()
      //   }, 20)
      // }else{
      //   if(mainStore.userProfile  && mainStore.userProfile.team1_id){
      //     setTimeout(()=>{
      //       getListUser(mainStore.userProfile.team1_id)
      //     }, 20)
      //   }
      // }
      getListUser(mainStore.userProfile.team1_id)
    }, [])

    useEffect(() => {
        if(coachingStore.messageUpdatedJournal == "Success" && coachingStore.isDetail && !coachingStore.isDetailCoach){
          navigation.navigate("fillFeedback")
        }

    },[coachingStore.messageUpdatedJournal])

    const goBack = () => {
      coachingStore.resetCoachingStore()
      navigation.goBack()
    }

    const goToFeedback = () => navigation.navigate("fillFeedback")

    const verifyData = async () => {
      if (coachingStore.isFormCoach) {
        if (title === "") {
          setError("title")
        } else if (learner == {}) {
          setError("learner")
        } else if (content == "") {
          setError("content")
        } else if (strength == "") {
          setError("strength")
        } else if (improvement == "") {
          setError("improvement")
        } else if (commitment == "") {
          setError("commitment")
        } else if (selectedActivities == "") {
          setError("selectedActivities")
        } else if (selectedDate == "") {
          setError("selectedDate")
        } else {
          if (coachingStore.isDetail) {
            await coachingStore.updateJournal(
              content,
              commitment,
              leassons,
              strength,
              selectedActivities,
            )
          } else {
            coachingStore.saveFormJournal(
              mainStore.userProfile.user_id,
              moment(selectedDate).format("YYYY-MM-DDTHH:mm:ss.SSS\\Z"),
              title,
              content,
              strength,
              improvement,
              commitment,
              [`${learner && learner.id}`],
              selectedActivities,
            )
            toggleEncouragementModal()
            // goToFeedback()
          }
        }
      } else {
        if (content == "") {
          setError("content")
        } else if (commitment == "") {
          setError("commitment")
        } else if (leassons == "") {
          setError("leassons")
        } else {
          await coachingStore.updateJournal(content, commitment, leassons, "", "")
        }
      }
    }

    const holdActivitiesId = useCallback((selectedId, setFieldValue)=>{
      setSelectedActivities(selectedId)
      // setFieldValue('type', selectedId)
    }, [selectedActivities])

    const searchDataUser = (id: string) => {
      dataTeamMember.find((data) => {
        return data.id == id
      })
    }

    const onSubmit = useCallback(async (data: JournalEntryType)=>{
      console.log(data)
    },[])

    const ActivityTypeSelector = ({onActivityPress = (item) => setActivity(item), selectedActivity = 'weekly_coaching', isError = false}) => {

      const styles = StyleSheet.create({
        container: {
          borderColor: "red",
          borderRadius: Spacing[20],
          borderStyle: "dashed",
          borderWidth: isError ? Spacing[2] : 0,
          justifyContent: "space-around",
          padding: Spacing[6],
        },
      })

      return (
        <HStack style={styles.container}>
          {ACTIVITIES_TYPE.map((item, index) => {
            if (index < 2) {
              return (
                <TouchableOpacity
                  style={{
                    borderColor: Colors.MAIN_RED,
                    borderWidth: item.value === selectedActivity ? Spacing[2] : 0,
                    height: Spacing[32],
                    width: Spacing[32],
                    backgroundColor: item.color,
                    borderRadius: Spacing[128],
                  }}
                  onPress={() => onActivityPress(item.value)}
                />
              )
            } else {
              return <></>
            }
          })}
        </HStack>
      )
    }

    return (
      <VStack
        testID="CoachingJournalMain"
        style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
      >
        <SafeAreaView style={Layout.flex}>
          <ScrollView>
            <VStack top={Spacing[32]} horizontal={Spacing[24]}>
              <HStack>
                <Text type={"left-header"} style={{}} text="Tambah journal entry" />
                <Spacer />
                <HStack>
                  <Button type={"negative"} text={"Cancel"} onPress={goBack} />
                </HStack>
              </HStack>

              <Formik
                initialValues={journalEntryForm}
                onSubmit={onSubmit}
              >
                {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
                  <>
                    <VStack>
                      <TextField
                        value={values.title}
                        onChangeText={handleChange('title')}
                        isRequired={false}
                        editable={!coachingStore.isDetail}
                        isError={isError === "title"}
                        secureTextEntry={false}
                        placeholder={'Tulis nama judul sesi coaching di sini.'}
                      />
                      <HStack style={{zIndex: 100}}>
                        <VStack style={{width:Spacing[64]}}>
                          <Text type={'body-bold'} style={[{textAlign: 'center', top: Spacing[4]}, isError == "learner" ? styles.textError : null ]} text="dengan" />
                        </VStack>
                        <Spacer/>
                        <VStack style={{maxWidth: dimensions.screenWidth - Spacing[128]}}>
                          { !coachingStore.isDetail ? <DropDownPicker
                            items={dataTeamMember}
                            isRequired={false}
                            value={values.learnerIds[0]}
                            onValueChange={
                              (value:IOption)=> {
                                setFieldValue('learnerIds', [value?.id ?? ''])
                              }
                            }
                            placeholder={'Pilih salah satu'}
                            containerStyle={{marginTop: Spacing[4]}}
                            isError={isError === "learner"}
                          /> :
                          <TextField
                            style={{ paddingTop: 0, minWidth: dimensions.screenWidth - Spacing[128]}}
                            value={journalEntryForm.learnerIds.toString()}
                            isError={isError === "content"}
                            inputStyle={{minHeight: Spacing[48]}}
                            isRequired={false}
                            secureTextEntry={false}
                            isTextArea={true}
                          /> }
                        </VStack>
                      </HStack>
                      <HStack>
                        <TouchableOpacity
                          style={{height: '100%', width: '20%'}}
                          onPress={toggleModal}
                          disabled={coachingStore.isDetail}
                        >
                          <VStack horizontal={Spacing[8]} vertical={Spacing[2]} style={{flex:1, width: '100%', borderRadius: Spacing[12], alignItems: 'flex-end', justifyContent: 'flex-end', backgroundColor: Colors.MAIN_BLUE}}>
                            <Text type={'button'} style={{color:Colors.WHITE, bottom: -Spacing[8]}} text={`${moment(selectedDate).format('DD MMM')}`.split(' ')[0]} />
                            <Text type={'button'} style={{color:Colors.WHITE}}>{`${moment(values.date).format('DD MMM')}`.split(' ')[1]}</Text>
                          </VStack>
                        </TouchableOpacity>
                         <Spacer />
                        <VStack top={Spacing[8]} style={{width: '75%'}}>
                          <Text type={'body-bold'} style={[{textAlign: 'center', top: Spacing[4]}, isError == "content" ? styles.textError : null ]}>
                            {`Apa yang `}
                            <Text type={'body-bold'} style={{color: Colors.BRIGHT_BLUE}}>
                              {'dibicarakan'}
                            </Text>
                            {` saat coaching?`}
                          </Text>
                          <TextField
                            style={{ paddingTop: 0}}
                            value={values.content}
                            // editable={!coachingStore.isDetail}
                            isError={isError === "content"}
                            onChangeText={handleChange('content')}
                            inputStyle={{minHeight: Spacing[72]}}
                            isRequired={false}
                            secureTextEntry={false}
                            isTextArea={true}
                          />
                        </VStack>
                      </HStack>
                      { coachingStore.isFormCoach &&
                        <VStack top={Spacing[12]}>
                          <Text type={'body-bold'} style={[{textAlign: 'center', top: Spacing[4]}, isError === "strength" ? styles.textError : null ]}>
                            {`Sebagai coach, apa yang sudah saya lakukan dengan `}
                            <Text type={'body-bold'} style={{color: Colors.BRIGHT_BLUE}}>
                              {'efektif?'}
                            </Text>
                          </Text>
                          <TextField
                            style={{ paddingTop: 0}}
                            inputStyle={{minHeight: Spacing[48]}}
                            isRequired={false}
                            value={values.strength}
                            editable={!coachingStore.isDetail}
                            isError={isError === "strength"}
                            onChangeText={handleChange('strength')}
                            secureTextEntry={false}
                            isTextArea={true}
                          />
                        </VStack>
                      }
                      {coachingStore.isFormCoach &&
                        <VStack top={Spacing[12]}>
                          <Text type={'body-bold'} style={[{textAlign: 'center', top: Spacing[4]}, isError === "improvement" ? styles.textError : null ]}>
                            {`Sebagai coach, kualitas apa yang dapat saya `}
                            <Text type={'body-bold'} style={[{color: Colors.BRIGHT_BLUE}, fieldError ? styles.textError : null]}>
                              {'tingkatkan?'}
                            </Text>
                          </Text>
                          <TextField
                            style={{ paddingTop: 0}}
                            inputStyle={{minHeight: Spacing[48]}}
                            isRequired={false}
                            secureTextEntry={false}
                            isTextArea={true}
                            editable={!coachingStore.isDetail}
                            isError={isError === "improvement"}
                            value={values.improvement}
                            onChangeText={handleChange('improvement')}
                          />
                        </VStack> }
                      {coachingStore.isDetail &&<VStack top={Spacing[12]}>
                        <Text type={'body-bold'} style={[{textAlign: 'center', top: Spacing[4]}, isError == "leassons" ? styles.textError : null ]}>
                          {'Tulislah '}
                          <Text type={'body-bold'} style={{color: Colors.BRIGHT_BLUE}}>
                            {'"lessons learned"'}
                          </Text>
                          {`-mu dicoaching sessions ini.`}
                        </Text>
                        <TextField
                          style={{ paddingTop: 0}}
                          inputStyle={{minHeight: Spacing[128]}}
                          isRequired={false}
                          secureTextEntry={false}
                          isTextArea={true}
                          editable={!coachingStore.isDetail}
                          // value={leassons}
                          isError={isError === "leassons"}
                          onChangeText={handleChange('lessons')}
                        />
                      </VStack>}
                      <VStack top={Spacing[12]}>
                        <Text type={'body-bold'} style={[{textAlign: 'center', top: Spacing[4]}, isError === "commitment" ? styles.textError : null ]}>
                          Apa saja yang akan saya lakukan secara berbeda untuk
                          <Text type={'body-bold'} style={{color: Colors.BRIGHT_BLUE}}>
                            {' sesi selanjutnya?'}
                          </Text>
                        </Text>
                        <TextField
                          style={{ paddingTop: 0}}
                          inputStyle={{minHeight: Spacing[128]}}
                          isRequired={false}
                          secureTextEntry={false}
                          isTextArea={true}
                          editable={!coachingStore.isDetail}
                          value={values.commitment}
                          isError={isError === "commitment"}
                          onChangeText={handleChange('commitment')}
                        />
                      </VStack>
                    </VStack>

                    <Modal
                      isOpen={isModalVisible}
                      style={{
                        height: '50%',
                        width: dimensions.screenWidth - Spacing[24],
                        backgroundColor: 'rgba(52, 52, 52, 0)'
                      }}
                    >
                      <View style={{ flex: 1, justifyContent: 'center' }}>
                        <VStack style={{backgroundColor: Colors.WHITE, borderRadius: Spacing[48], minHeight: Spacing[256], alignItems: 'center', justifyContent:'center'}} horizontal={Spacing[24]} vertical={Spacing[24]}>
                          <VStack vertical={Spacing[12]}>
                            <Spacer height={Spacing[24]} />
                            <CalendarPicker
                              onDateChange={(value)=> {
                                onDateChange(value, setFieldValue)
                              }}
                              textStyle={{
                                fontFamily: typography.primaryBold,
                                colors: Colors.MAIN_BLUE
                              }}
                              selectedDayColor={Colors.MAIN_BLUE}
                              selectedDayTextColor={Colors.WHITE}
                              style={{padding: Spacing[20]}}
                              width={dimensions.screenWidth - Spacing[64]}
                            />
                            <HStack style={[Layout.widthFull, {justifyContent: 'center'}]}>
                              <Button
                                type={"negative"}
                                text={"Cancel"}
                                onPress={toggleModal}
                              />
                              <Button
                                type={"primary"}
                                text={"Pilih"}
                                onPress={toggleModal}
                                style={{minWidth: Spacing[72]}}
                              />
                            </HStack>
                          </VStack>
                        </VStack>
                      </View>
                    </Modal>
                  </>
                )}
              </Formik>
            </VStack>
            {coachingStore.isFormCoach && (
              <VStack vertical={Spacing[16]}>
                <VStack bottom={Spacing[8]} horizontal={Spacing[128]}>
                  <ActivityTypeSelector
                    onActivityPress={holdActivitiesId}
                    selectedActivity={selectedActivities}
                    isError={fieldError}
                  />
                </VStack>
                <Text
                  type={"body-bold"}
                  style={[
                    { color: Colors.BRIGHT_BLUE, textAlign: "center" },
                    fieldError ? styles.textError : null,
                  ]}
                >
                  {"Pilihlah kategori sesi coaching-mu."}
                </Text>
              </VStack>
            )}
            <VStack horizontal={Spacing[72]} vertical={Spacing[24]}>
              {coachingStore.isFormCoach ? (
                <ActivitiesTypeLegends showedItems={[1, 2]} />
              ) : (
                <ActivitiesTypeLegends showedItems={[3]} />
              )}
              <Spacer height={Spacing[24]} />
              {coachingStore.isDetail ? (
                <Button type={"primary"} text={"Hasil Feedback"} onPress={verifyData} />
              ) : (
                <Button type={"primary"} text={"Lakukan Feedback"} onPress={verifyData} />
              )}
            </VStack>
          </ScrollView>
          <Modal
            isOpen={isEncouragementModalVisible}
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
                <VStack horizontal={Spacing[24]} top={Spacing[24]} style={Layout.widthFull}>
                  <VStack style={{ alignItems: "flex-end" }}>
                    <TouchableOpacity onPress={toggleEncouragementModal}>
                      <Text type={"header"} >X</Text>
                    </TouchableOpacity>
                  </VStack>
                  <VStack>
                    <Text
                      type={"body-bold"}
                      style={{ fontSize: Spacing[18], textAlign: "center" }}
                      text={"Nicely done! "}
                    />
                    <Spacer height={Spacing[24]} />
                    <Text type={'body'} style={{textAlign: 'center', top: Spacing[4]}}>
                          {`Sebelum catatan coaching-mu tersimpan \n`}
                          <Text type={'body-bold'} >
                            {'isi self-reflection feedback '}
                          </Text>
                          <Text>{`dulu yaa`}</Text>
                      </Text>
                    <Spacer height={Spacing[24]} />
                    <Text
                      type={"body"}
                      style={{ textAlign: "center" }}
                      text={
                        "Feedback ini akan diisi juga oleh coachee-mu juga sehingga kamu dapat membandingkan penilaian dirimu sendiri dengan penilaian dari coachee-mu."
                      }
                    />

                    <Spacer height={Spacing[24]} />
                    <Text
                      type={"body"}
                      style={{ textAlign: "center", color: "red" }}
                      text={
                        "Penting! Catatan coaching-mu belum tersimpan sampai kamu klik “Submit” setelah melakukan feedback."
                      }
                    />
                    <Spacer height={Spacing[20]} />

                    <HStack bottom={Spacing[32]}>
                      <Spacer />

                      <Spacer />
                    </HStack>
                    <HStack bottom={Spacing[24]}>
                      <Spacer />
                      <VStack style={{ maxWidth: Spacing[256], minWidth: Spacing[128] }}>
                        <Button
                          type={"primary"}
                          text={"Isi Feedback"}
                          style={{ height: Spacing[32], paddingHorizontal: Spacing[8] }}
                          textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                          onPress={goToFeedback}
                        />
                      </VStack>
                      <Spacer />
                    </HStack>
                  </VStack>
                </VStack>
              </VStack>
            </View>
          </Modal>
        </SafeAreaView>
        <Spinner
          visible={coachingStore.isLoading || mainStore.isLoading}
          textContent={"Memuat..."}
          textStyle={styles.spinnerTextStyle}
        />
      </VStack>
    )
  },
)

export default NewJournalEntry
