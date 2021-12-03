import React, {FC, useCallback, useReducer, useState, useEffect } from "react"
import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  Text,
  Button, TextField, BackNavigation, DismissKeyboard
} from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import {HStack, VStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {Colors, Layout, Spacing} from "@styles";
import {IOption} from "react-native-modal-selector";

import {ACTIVITIES_TYPE, ActivitiesTypeLegends} from "@screens/coaching-journal/components/activities-type-legends";

import {dimensions} from "@config/platform.config";

import CalendarPicker from 'react-native-calendar-picker';
import {typography} from "@theme";
import { useStores } from "../../bootstrap/context.boostrap"

import Modal from 'react-native-modalbox';
import moment from "moment"

import Spinner from 'react-native-loading-spinner-overlay';
import { Formik } from 'formik';
import FastImage from "react-native-fast-image"
import smileYellow from "@assets/icons/coachingJournal/empty/smile-yellow.png"

const NewJournalEntry: FC<StackScreenProps<NavigatorParamList, "overviewJournalEntry">> = observer(
  ({ navigation, route }) => {
    const {mainStore, coachingStore} = useStores()

    const { journalId, isCoachee } = route.params

    console.log('overview journal '+ journalId)
    console.log('is coachee '+ isCoachee)

    const styles = StyleSheet.create({
      textError: {
        color: Colors.MAIN_RED
      }
    })

    const fieldError = false

    // empty list state
    const [selectedActivities, setSelectedActivities] = useState<string>('');
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [dataTeamMember, setDataTeamMember] = useState<IOption[]>([])

    const [isModalEditEntryVisible, setIsModalEditEntryVisible] = useState(false)

    const [title, setTitle] = useState<string>('');
    const [jlContent, setJlContent] = useState<string>('');
    const [jlCommitment, setJlCommitment] = useState<string>('');
    const [jlLessonLearned, setJlLessonLearned] = useState<string>('');

    const [activity, setActivity] = useState<string>('');
    const [isError, setError] = useState<string>('');

    const [isOnEditMode, setIsOnEditMode] = useState(true);

    const [coach, setCoach] = useState<string>('');

    const journalEntryInitialValue = {
      // coachId: '',
      date: moment(new Date()).format('LLLL'),
      title: '',
      content: '',
      strength: '',
      improvement: '',
      commitment: '',
      type: '',
      learner: '',
      jlLessonLearned: '',
      jlCommitment: '',
      jlContent: ''
    }

    const toggleModal = () => {
      setTimeout(() => {
        setModalVisible(!isModalVisible);
      }, 100);
    };

    const toggleModalEditEntry = () => {
      setTimeout(() => {
        setIsModalEditEntryVisible(!isModalEditEntryVisible);
      }, 100);
    };

    const closeModal = () => {
      setTimeout(() => {
        setModalVisible(false);
      }, 100);
    };

    const onDateChange = (selectedId)=>{
      const dateTime = moment(selectedId).format('LLLL')
      setSelectedDate(dateTime)
      console.log(dateTime)
    }

    const getListUser = useCallback(async (id: string)=>{
      await mainStore.getListUser(id)
      console.log('useEffect mainStore.listUserProfile', mainStore.listUserProfile)

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
    },[])
    useEffect(() => {
      setSelectedDate(moment().format('LLLL'))
      // profileStore.resetLoading()
      // coachingStore.resetLoading()
    }, [])


    const getListDetail = useCallback(async ()=>{
      await coachingStore.getJournalDetail()

      if (isCoachee){
        console.log('is coachee true')
        console.log(coachingStore.journalDetail)
        journalEntryInitialValue.learner = coachingStore.journalDetail.jl_learner_fullname;
        journalEntryInitialValue.jlContent = coachingStore.journalDetail.jl_content;
        journalEntryInitialValue.jlLessonLearned = coachingStore.journalDetail.jl_lesson_learned;
        journalEntryInitialValue.jlCommitment = coachingStore.journalDetail.jl_commitment;

        setJlLessonLearned(coachingStore.journalDetail.jl_lesson_learned)
        setJlCommitment(coachingStore.journalDetail.jl_commitment);
        setJlContent(coachingStore.journalDetail.jl_content);
        setTitle(`${coachingStore.journalDetail.journal_title}`)
        setSelectedDate(coachingStore.journalDetail.journal_date)
        setSelectedActivities(coachingStore.journalDetail.journal_type)
        setCoach(coachingStore.journalDetail.coach_fullname)
        if(coachingStore.journalDetail.is_edited){
          setIsOnEditMode(false)
        }
      }else {
        journalEntryInitialValue.title = coachingStore.journalDetail.journal_title;
        journalEntryInitialValue.content = coachingStore.journalDetail.journal_content;
        journalEntryInitialValue.strength = coachingStore.journalDetail.journal_strength;
        journalEntryInitialValue.improvement = coachingStore.journalDetail.journal_improvement;
        journalEntryInitialValue.commitment = coachingStore.journalDetail.journal_commitment;
        journalEntryInitialValue.learner = coachingStore.journalDetail.jl_learner_fullname[0];

        setJlLessonLearned(coachingStore.journalDetail.jl_lesson_learned[0].desc)
        setJlCommitment(coachingStore.journalDetail.jl_commitment[0].desc);
        setJlContent(coachingStore.journalDetail.jl_content[0].desc);
        setTitle(`${coachingStore.journalDetail.journal_title} with ${coachingStore.journalDetail.jl_learner_fullname[0]}`)
        setSelectedDate(coachingStore.journalDetail.journal_date)
        setSelectedActivities(coachingStore.journalDetail.journal_type)
        forceUpdate()
        setIsOnEditMode(false)
      }

    },[coachingStore.journalDetail, coachingStore.journalDetailSucced])

    useEffect(()=>{
      console.log('coachingStore.isDetail', coachingStore.isDetail)
      if(coachingStore.isDetail){
        setTimeout(()=>{
          getListDetail()
        }, 20)
      }else{
        if(mainStore.userProfile  && mainStore.userProfile.team1_id){
          setTimeout(()=>{
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
      console.log('journalEntryInitialValue : ', journalEntryInitialValue)
      navigation.navigate("overviewJournalEntryByCoachee", {
        title: title,
        lessonLearned:  jlLessonLearned,
        commitment: jlCommitment,
        content: jlContent
      })
    }

    const goToFeedback = () => {
      navigation.navigate("fillFeedbackCoachee",{
        isFilled: false,
        journalId: journalId
      })
    }

    const verifyData = async (data) => {
      console.log(coachingStore.journalDetail.is_coachee)
      console.log(coachingStore.journalDetail.is_edited)
      console.log(coachingStore.isFormCoach)
      console.log(coachingStore.isDetail)
      console.log('verify data: ',data)

      if(coachingStore.isFormCoach){
        if(data.content === ""){
          setError("content")
        }else if(data.strength === ""){
          setError("strength")
        }else if(data.improvement === ""){
          setError("improvement")
        }else if(data.commitment === ""){
          setError("commitment")
        }else{
          if(coachingStore.isDetail){
            setError('');
            await coachingStore.updateJournal(data.content,data.commitment,"",data.strength,selectedActivities,data.improvement)
            toggleModalEditEntry()
            setIsOnEditMode(false)
          }
        }
      }

      if(isCoachee){
        if (data.jlContent === '' || data.jlContent === null) {
          setError('jlContent')
        }
        else if (data.jlLessonLearned === '' || data.jlLessonLearned === null) {
          setError('jlLessonLearned')
        }
        else if (data.jlCommitment === '' || data.jlCommitment === null) {
          setError('jlCommitment')
        }
        else {
          setError('')
          await coachingStore.updateJournalCoachee(
            data.jlContent, data.jlLessonLearned, data.jlCommitment, journalId)
          toggleModalEditEntry()
          setIsOnEditMode(false)
        }
      }
    }



    const holdActivitiesId = useCallback((selectedId)=>{
      setSelectedActivities(selectedId)
    }, [selectedActivities])

    const searchDataUser = (id: string) => {
      dataTeamMember.find((data)=>{return data.id == id})
    }


    const ActivityTypeSelector = ({onActivityPress = (item) => setActivity(item), selectedActivity = 'weekly_coaching', isError = false}) => {

      const styles = StyleSheet.create({
        container: {borderColor: 'red', borderRadius: Spacing[20], borderStyle: 'dashed', borderWidth: isError ? Spacing[2] : 0, justifyContent: 'space-around', padding: Spacing[6]}
      })

      return(
      <HStack style={styles.container}>
        {ACTIVITIES_TYPE.map((item, index)=>{
          if(index < 2){
            return(
              <TouchableOpacity style={{
                borderColor: Colors.MAIN_RED, borderWidth: item.value === selectedActivity ? Spacing[2] : 0,
                height: Spacing[32], width: Spacing[32], backgroundColor: item.color, borderRadius: Spacing[128]}}
                disabled={!isOnEditMode}
                onPress={()=>onActivityPress(item.value)}
              />
            )
          } else{
            return (
              <></>
            )
          }
        })}
      </HStack>
      )
    }

    const onClickEditEntry = () =>  {
      setIsOnEditMode(true)
    }

    const onClickCancel = () => {
        setIsOnEditMode(false)
    }

    return (
      <VStack testID="CoachingJournalMain" style={{backgroundColor: Colors.WHITE, flex: 1, justifyContent: 'center'}}>
        <SafeAreaView style={Layout.flex}>
        <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
            <ScrollView>
              <DismissKeyboard>
              <Formik
                initialValues={journalEntryInitialValue}
                onSubmit={(values) =>{
                  verifyData(values)
                }}
              >
                {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
                  <>
                    <VStack top={Spacing[32]} horizontal={Spacing[24]}>
                      <HStack>
                        <Text type={'left-header'} style={{}} text="Isi coaching journal" />
                        <Spacer/>
                        {/*<HStack>*/}
                        {/*  {isOnEditMode ?*/}
                        {/*    <Button*/}
                        {/*      type={"negative"}*/}
                        {/*      text={"Cancel"}*/}
                        {/*      onPress={onClickCancel}*/}
                        {/*    />:*/}
                        {/*    <Button*/}
                        {/*      type={"negative"}*/}
                        {/*      text={"Edit Entry"}*/}
                        {/*      onPress={onClickEditEntry}*/}
                        {/*    />*/}
                        {/*  }*/}
                        {/*</HStack>*/}
                      </HStack>

                      <VStack>
                        <TextField
                          value={title}
                          isRequired={false}
                          editable={false}
                          inputStyle={{backgroundColor:Colors.MAIN_BLUE, color:Colors.WHITE, textAlign:'left', paddingHorizontal: 10, fontWeight:'bold'}}
                          style={{paddingVertical: 0}}
                          secureTextEntry={false}
                        />
                        { isCoachee ?
                        <HStack>
                            <VStack left={Spacing[24]} right={Spacing[8]}>
                                <Text type={'body-bold'} style={[{textAlign: 'center', top: Spacing[4]}, isError === "title" ? styles.textError : null ]}>
                                  {`dengan`}
                                </Text>
                            </VStack>
                            <TextField
                                value={coach}
                                isRequired={false}
                                editable={false}
                                inputStyle={{backgroundColor:Colors.MAIN_BLUE, color:Colors.WHITE, textAlign:'left', paddingHorizontal: 10, fontWeight:'bold'}}
                                style={{paddingVertical: 0, paddingBottom: Spacing[12], flex: 1, width: '100%'}}
                                secureTextEntry={false}
                            />
                        </HStack> : <Spacer height={Spacing[12]} /> }
                        <HStack>
                          <TouchableOpacity
                            style={{height: '100%', width: '20%'}}
                            onPress={toggleModal}
                            disabled={coachingStore.isDetail}
                          >
                            <VStack horizontal={Spacing[8]} vertical={Spacing[2]} style={{flex:1, width: '100%', borderRadius: Spacing[12], alignItems: 'flex-end', justifyContent: 'flex-end', backgroundColor: Colors.MAIN_BLUE}}>
                              <Text type={'button'} style={{color:Colors.WHITE, bottom: -Spacing[8]}} text={`${moment(selectedDate).format('DD MMM')}`.split(' ')[0]} />
                              <Text type={'button'} style={{color:Colors.WHITE}}>{`${moment(selectedDate).format('DD MMM')}`.split(' ')[1]}</Text>
                            </VStack>
                          </TouchableOpacity>
                          <Spacer />
                          <VStack style={{width: '75%'}}>
                            <Text type={'body-bold'} style={[{textAlign: 'center', top: Spacing[4]}, isError === "content" ? styles.textError : null ]}>
                              {`Apa yang `}
                              <Text type={'body-bold'} style={{color: Colors.BRIGHT_BLUE}}>
                                {'dibicarakan'}
                              </Text>
                              {` saat coaching?`}
                            </Text>
                            <TextField
                              style={{ paddingTop: 0}}
                              value={isCoachee ? values.jlContent : values.content}
                              isError={isError === "content" || isError === "jlContent"}
                              onChangeText={isCoachee ? handleChange('jlContent') : handleChange('content')}
                              inputStyle={isOnEditMode? {minHeight: Spacing[72]} : {minHeight: Spacing[72], backgroundColor:Colors.LIGHT_GRAY} }
                              editable={isOnEditMode}
                              isRequired={false}
                              secureTextEntry={false}
                              isTextArea={true}
                            />
                          </VStack>
                        </HStack>
                        {coachingStore.isFormCoach && <VStack top={Spacing[12]}>
                          <Text type={'body-bold'} style={[{textAlign: 'center', top: Spacing[4]}, isError === "strength" ? styles.textError : null ]}>
                            {`Sebagai coach, apa yang sudah saya lakukan dengan `}
                            <Text type={'body-bold'} style={{color: Colors.BRIGHT_BLUE}}>
                              {'efektif?'}
                            </Text>
                          </Text>
                          <TextField
                            style={{ paddingTop: 0}}
                            inputStyle={isOnEditMode? {minHeight: Spacing[48]} : {minHeight: Spacing[48], backgroundColor:Colors.LIGHT_GRAY}}
                            editable={isOnEditMode}
                            isRequired={false}
                            value={values.strength}
                            isError={isError === "strength"}
                            onChangeText={handleChange('strength')}
                            secureTextEntry={false}
                            isTextArea={true}
                          />
                        </VStack>}
                        {coachingStore.isFormCoach &&<VStack top={Spacing[12]}>
                          <Text type={'body-bold'} style={[{textAlign: 'center', top: Spacing[4]}, isError == "improvement" ? styles.textError : null ]}>
                            {`Sebagai coach, kualitas apa yang dapat saya `}
                            <Text type={'body-bold'} style={[{color: Colors.BRIGHT_BLUE}, fieldError ? styles.textError : null]}>
                              {'tingkatkan?'}
                            </Text>
                          </Text>
                          <TextField
                            style={{ paddingTop: 0}}
                            inputStyle={isOnEditMode? {minHeight: Spacing[48]} : {minHeight: Spacing[48], backgroundColor:Colors.LIGHT_GRAY}}
                            editable={isOnEditMode}
                            isRequired={false}
                            secureTextEntry={false}
                            isTextArea={true}
                            isError={isError === "improvement"}
                            value={values.improvement}
                            onChangeText={handleChange('improvement')}
                          />
                        </VStack>}

                        {coachingStore.isFormCoach &&
                        <>
                          <VStack top={Spacing[12]} >
                            <Text type={'body-bold'} style={[{textAlign: 'center', top: Spacing[4]}, isError == "commitment" ? styles.textError : null ]}>
                                {`Apa saja yang akan saya lakukan secara\nberbeda untuk`}
                                <Text type={'body-bold'} style={{color: Colors.BRIGHT_BLUE}}>
                                  {' sesi selanjutnya?'}
                                </Text>
                            </Text>
                            <TextField
                                style={{ paddingTop: 0}}
                                inputStyle={isOnEditMode? {minHeight: Spacing[128]} : {minHeight: Spacing[128], backgroundColor:Colors.LIGHT_GRAY}}
                                isRequired={false}
                                secureTextEntry={false}
                                isTextArea={true}
                                editable={isOnEditMode}
                                value={values.commitment}
                                isError={isError === "commitment"}
                                onChangeText={handleChange('commitment')}
                            />
                          </VStack>
                        </>
                        }
                      </VStack>
                      { isCoachee ?
                        <>
                          <VStack top={Spacing[8]}>
                            <Text type={'body-bold'} style={[{textAlign: 'center', top: Spacing[4]}, isError == "content" ? styles.textError : null ]}>
                              {`Tulislah `}
                              <Text type={'body-bold'} style={{color: Colors.BRIGHT_BLUE}}>
                                {'"lesson learned"'}
                              </Text>
                              {`-mu di coaching session ini.`}
                            </Text>
                            <TextField
                              style={{ paddingTop: 0}}
                              value={values.jlLessonLearned}
                              isError={isError === "jlLessonLearned"}
                              onChangeText={handleChange('jlLessonLearned')}
                              inputStyle={isOnEditMode? {minHeight: Spacing[72]} : {minHeight: Spacing[72], backgroundColor:Colors.LIGHT_GRAY} }
                              editable={isOnEditMode}
                              isRequired={false}
                              secureTextEntry={false}
                              isTextArea={true}
                            />
                          </VStack>
                          <VStack>
                            <Text type={'body-bold'} style={[{textAlign: 'center', top: Spacing[4]}, isError == "content" ? styles.textError : null ]}>
                              <Text type={'body-bold'} style={{color: Colors.BRIGHT_BLUE}}>
                                {'Komitmen'}
                              </Text>
                              {` apa saja yang sudah disepakati bersama?`}
                            </Text>
                            <TextField
                              style={{ paddingTop: 0}}
                              value={values.jlCommitment}
                              isError={isError === "jlCommitment"}
                              onChangeText={handleChange('jlCommitment')}
                              inputStyle={isOnEditMode? {minHeight: Spacing[72]} : {minHeight: Spacing[72], backgroundColor:Colors.LIGHT_GRAY} }
                              editable={isOnEditMode}
                              isRequired={false}
                              secureTextEntry={false}
                              isTextArea={true}
                            />
                          </VStack>
                        </> : null }
                    </VStack>

                    {/* {coachingStore.isFormCoach && <VStack vertical={Spacing[16]}>
                      <VStack bottom={Spacing[8]} horizontal={Spacing[128]}>
                        <ActivityTypeSelector onActivityPress={holdActivitiesId} selectedActivity={selectedActivities} isError={fieldError} />
                      </VStack>
                    </VStack>} */}
                    <VStack horizontal={Spacing[72]} vertical={Spacing[24]}>
                      {isCoachee === false ?
                        <ActivitiesTypeLegends showedItems={[1]} />:
                        <ActivitiesTypeLegends showedItems={[2]} />
                      }
                      <Spacer height={Spacing[24]} />
                      {/* {coachingStore.isDetail ? */}
                          {!isOnEditMode ?
                            <Button
                              type={"primary"}
                              text={isCoachee ? "Lakukan feedback" : "Lihat catatan coachee"}
                              onPress={ isCoachee ? goToFeedback : goToOverviewJournalByCoachee}
                            /> :
                            <Button
                              type={"warning"}
                              text={"Save entry"}
                              onPress={() => handleSubmit()}
                            />
                          }
                    </VStack>
                    <VStack horizontal={Spacing[24]} bottom={Spacing[24]}>
                      { isOnEditMode ?
                      <Text
                          type={"warning"}
                          style={{ fontSize: Spacing[12], textAlign: "center" }}
                          text={"Penting! Catatan coaching-mu belum tersimpan sampai kamu klik “Submit” setelah melakukan feedback."}
                      /> : null }
                    </VStack>
                  </>
                )}
              </Formik>
              </DismissKeyboard>
            </ScrollView>
        </SafeAreaView>

        <Modal
          isOpen={isModalEditEntryVisible}
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
                <VStack>
                  <Text
                    type={"body-bold"}
                    style={{ fontSize: Spacing[18], textAlign: "center" }}
                    text={"Hore!"}
                  />
                  <Spacer height={Spacing[24]} />
                  <Text
                    type={"body"}
                    style={{ textAlign: "center" }}
                    text={"Catatan jurnal kamu sudah berhasil diganti."}
                  />
                  <Spacer height={Spacing[20]} />
                  <HStack bottom={Spacing[32]}>
                    <Spacer />
                    <FastImage
                      style={{
                        height: Spacing[64],
                        width: Spacing[64],
                      }}
                      source={smileYellow}
                      resizeMode={"contain"}
                    />
                    <Spacer />
                  </HStack>
                  <HStack bottom={Spacing[24]}>
                    <Spacer />
                    <VStack style={{ maxWidth: Spacing[256], minWidth: Spacing[128] }}>
                      <Button
                        type={"primary"}
                        text={"Oke"}
                        style={{ height: Spacing[32], paddingHorizontal: Spacing[8] }}
                        textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                        onPress={toggleModalEditEntry}
                      />
                    </VStack>
                    <Spacer />
                  </HStack>
                </VStack>
              </VStack>
            </VStack>
          </View>
        </Modal>

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
                  onDateChange={onDateChange}
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
        <Spinner
          visible={coachingStore.isLoading || mainStore.isLoading}
          textContent={'Memuat...'}
        />
      </VStack>
    )
  },
)

export default NewJournalEntry;
