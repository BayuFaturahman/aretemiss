import React, {FC, useCallback, useReducer, useState, useEffect } from "react"
import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  Text,
  Button, TextField, DropDownPicker
} from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import {HStack, VStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {Colors, Layout, Spacing} from "@styles";

import {CoachingJournalItem} from "@screens/coaching-journal/coaching-journal.type";
import {ACTIVITIES_TYPE, ActivitiesTypeLegends} from "@screens/coaching-journal/components/activities-type-legends";

import {dimensions} from "@config/platform.config";

import CalendarPicker from 'react-native-calendar-picker';
import {typography} from "@theme";
import {useStores} from "@models";

import Modal from 'react-native-modalbox';
import moment from "moment"

import Spinner from 'react-native-loading-spinner-overlay';

const NewJournalEntry: FC<StackScreenProps<NavigatorParamList, "coachingJournalMain">> = observer(
  ({ navigation }) => {
    // const { profileStore, authStore, coachingStore } = useStores()

    const styles = StyleSheet.create({
      textError: {
        color: Colors.MAIN_RED
      }
    })

    const fieldError = false

    // empty list state
    const [coachingData, setCoachingData] = useState<Array<CoachingJournalItem>>([]);
    const [selectedActivities, setSelectedActivities] = useState<string>('');
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [dataTeamMember, setDataTeamMember] = useState([]);

    const [title, setTitle] = useState<string>('');
    const [learner, setLearner] = useState({});
    const [content, setContent] = useState<string>('');
    const [strength, setStrength] = useState<string>('');
    const [improvement, setImprovement] = useState<string>('');
    const [commitment, setCommitment] = useState<string>('');
    const [activity, setActivity] = useState<string>('');
    const [isError, setError] = useState<string>('');

    const toggleModal = () => {
      setTimeout(() => {
        setModalVisible(!isModalVisible);
      }, 100);
    };

    const closeModal = () => {
      setTimeout(() => {
        setModalVisible(false);
      }, 100);
    };

    const onDateChange = useCallback((selectedId)=>{
      const dateTime = moment(selectedId).format('LLLL')
      setSelectedDate(dateTime)
      forceUpdate()
    }, [selectedDate])

    useEffect(() => {
      setSelectedDate(moment().format('LLLL'))
      // profileStore.resetLoading()
      // coachingStore.resetLoading()
    }, [])

    // useEffect(()=>{
    //   if(coachingStore.isDetailCoach){
    //     coachingStore.getJournalDetail()
    //   }
    // }, [coachingStore.isDetailCoach])
    //
    // useEffect(()=>{
    //   if(!coachingStore.isDetailCoach){
    //     if(profileStore.profile && profileStore.profile[0] && profileStore.profile[0].team1_id){
    //       profileStore.getTeamMember(profileStore.profile[0].team1_id)
    //     }
    //   }else{
    //       setTitle(coachingStore.journalDetail.journal_title)
    //       setContent(coachingStore.journalDetail.journal_content)
    //       setStrength(coachingStore.journalDetail.journal_strength)
    //       setImprovement(coachingStore.journalDetail.journal_improvement)
    //       setCommitment(coachingStore.journalDetail.journal_commitment)
    //       setSelectedDate(coachingStore.journalDetail.journal_date)
    //       setSelectedActivities(coachingStore.journalDetail.journal_type)
    //   }
    // }, [profileStore.profile])
    //
    // useEffect(()=>{
    //   if(!profileStore.isLoading){
    //     const dataItem = profileStore.teamMember.map((data, index)=>{
    //       return { key:index, label: data.fullname, customKey: data.id }
    //     })
    //     setDataTeamMember(dataItem)
    //   }
    // }, [profileStore.teamMember, profileStore.isLoading])
    //
    // useEffect(() => {
    //     if(coachingStore.message == "Success"){
    //       coachingStore.resetCoachingStore()
    //       navigation.navigate("coachingJournalMain")
    //     }
    // },[coachingStore.message])

    const goBack = () => {
      // coachingStore.resetLoading()
      navigation.goBack()
    }

    const goToFeedback = () => navigation.navigate("fillFeedback")

    const goToFeedbackDetail = () => navigation.navigate("fillFeedbackDetail")

    const verifyData = () => {
      if(title === ""){
        setError("title")
      }else if(learner == []){
        setError("learner")
      }else if(content == ""){
        setError("content")
      }else if(strength == ""){
        setError("strength")
      }else if(improvement == ""){
        setError("improvement")
      }else if(commitment == ""){
        setError("commitment")
      }else if(selectedActivities == ""){
        setError("selectedActivities")
      }else if(selectedDate == ""){
        setError("selectedDate")
      }else{
        // console.log('learner', learner.customKey)
        // coachingStore.saveFormJournal(
        //   authStore.authUser.id,
        //   moment(selectedDate).format('YYYY-MM-DDTHH:mm:ss.SSS\\Z'),
        //   title,
        //   content,
        //   strength,
        //   improvement,
        //   commitment,
        //   [`${learner.customKey}`],
        //   selectedActivities
        // )
      }

    }
    // useEffect(()=>{
    //   if(coachingStore.coach_id){
    //     goToFeedback()
    //   }
    // }, [coachingStore.coach_id])

    const holdActivitiesId = useCallback((selectedId)=>{
      setSelectedActivities(selectedId)
    }, [selectedActivities])

    const goToNote = useCallback((id)=>{
      console.log(id)
    }, [])

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


    return (
      <VStack testID="CoachingJournalMain" style={{backgroundColor: Colors.WHITE, flex: 1, justifyContent: 'center'}}>
        <SafeAreaView style={Layout.flex}>
          <ScrollView>
            <VStack top={Spacing[32]} horizontal={Spacing[24]}>
              <HStack>
                <Text type={'left-header'} style={{}} text="Tambah journal entry" />
                <Spacer/>
                <HStack>
                  <Button
                    type={"negative"}
                    text={"Cancel"}
                    onPress={goBack}
                  />
                </HStack>
              </HStack>

              <VStack>
                <TextField
                  value={title}
                  onChangeText={setTitle}
                  isRequired={false}
                  // disabled={coachingStore.isDetailCoach}
                  isError={isError == "title"}
                  secureTextEntry={false}
                  placeholder={'Tulis nama judul sesi coaching di sini.'}
                />
                <HStack style={{zIndex: 100}}>
                  <VStack style={{width:Spacing[64]}}>
                    <Text type={'body-bold'} style={[{textAlign: 'center', top: Spacing[4]}, isError == "learner" ? styles.textError : null ]} text="dengan" />
                  </VStack>
                  <Spacer/>
                  <VStack style={{maxWidth: dimensions.screenWidth - Spacing[128]}}>
                    <DropDownPicker
                      items={dataTeamMember}
                      isRequired={false}
                      value={learner}
                      onValueChange={(value)=>setLearner(value)}
                      placeholder={'Pilih salah satu'}
                      containerStyle={{marginTop: Spacing[4]}}
                      zIndex={2000}
                      isError={isError == "learner"}
                      zIndexInverse={2000}
                      dropDownDirection={"BOTTOM"}
                    />
                  </VStack>
                </HStack>
                <HStack>
                  <TouchableOpacity
                    style={{height: '100%', width: '20%'}}
                    onPress={toggleModal}
                    // disabled={coachingStore.isDetailCoach}
                  >
                    <VStack horizontal={Spacing[8]} vertical={Spacing[2]} style={{flex:1, width: '100%', borderRadius: Spacing[12], alignItems: 'flex-end', justifyContent: 'flex-end', backgroundColor: Colors.MAIN_BLUE}}>
                      <Text type={'button'} style={{color:Colors.WHITE, bottom: -Spacing[8]}} text={`${moment(selectedDate).format('DD MMM')}`.split(' ')[0]} />
                      <Text type={'button'} style={{color:Colors.WHITE}}>{`${moment(selectedDate).format('DD MMM')}`.split(' ')[1]}</Text>
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
                      value={content}
                      // disabled={coachingStore.isDetailCoach}
                      isError={isError == "content"}
                      onChangeText={setContent}
                      inputStyle={{minHeight: Spacing[72]}}
                      isRequired={false}
                      secureTextEntry={false}
                      isTextArea={true}
                    />
                  </VStack>
                </HStack>
                <VStack top={Spacing[12]}>
                  <Text type={'body-bold'} style={[{textAlign: 'center', top: Spacing[4]}, isError == "strength" ? styles.textError : null ]}>
                    {`Sebagai coach, apa yang sudah saya lakukan dengan `}
                    <Text type={'body-bold'} style={{color: Colors.BRIGHT_BLUE}}>
                      {'efektif?'}
                    </Text>
                  </Text>
                  <TextField
                    style={{ paddingTop: 0}}
                    inputStyle={{minHeight: Spacing[48]}}
                    isRequired={false}
                    value={strength}
                    // disabled={coachingStore.isDetailCoach}
                    isError={isError == "strength"}
                    onChangeText={setStrength}
                    secureTextEntry={false}
                    isTextArea={true}
                  />
                </VStack>
                <VStack top={Spacing[12]}>
                  <Text type={'body-bold'} style={[{textAlign: 'center', top: Spacing[4]}, isError == "improvement" ? styles.textError : null ]}>
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
                    // disabled={coachingStore.isDetailCoach}
                    isError={isError == "improvement"}
                    value={improvement}
                    onChangeText={setImprovement}
                  />
                </VStack>
                <VStack top={Spacing[12]}>
                  <Text type={'body-bold'} style={[{textAlign: 'center', top: Spacing[4]}, isError == "commitment" ? styles.textError : null ]}>
                    <Text type={'body-bold'} style={{color: Colors.BRIGHT_BLUE}}>
                      {'Komitment '}
                    </Text>
                    {`apa saja yang sudah disepakati bersama?`}
                  </Text>
                  <TextField
                    style={{ paddingTop: 0}}
                    inputStyle={{minHeight: Spacing[128]}}
                    isRequired={false}
                    secureTextEntry={false}
                    isTextArea={true}
                    // disabled={coachingStore.isDetailCoach}
                    value={commitment}
                    onChangeText={setCommitment}
                  />
                </VStack>
              </VStack>
            </VStack>
            <VStack vertical={Spacing[16]}>
              <VStack bottom={Spacing[8]} horizontal={Spacing[128]}>
                <ActivityTypeSelector onActivityPress={holdActivitiesId} selectedActivity={selectedActivities} isError={fieldError} />
              </VStack>
              <Text type={'body-bold'} style={[{color: Colors.BRIGHT_BLUE, textAlign: 'center'}, fieldError ? styles.textError : null]}>
                {'Pilihlah kategori sesi coaching-mu.'}
              </Text>
            </VStack>
            <VStack horizontal={Spacing[72]} vertical={Spacing[24]}>
              <ActivitiesTypeLegends showedItems={[1,2]} />
              <Spacer height={Spacing[24]} />
              {/* {coachingStore.isDetailCoach ? */}
              {/* <Button */}
              {/*  type={"primary"} */}
              {/*  text={"Hasil Feedback"} */}
              {/*  onPress={goToFeedbackDetail} */}
              {/* />: <Button */}
              {/*  type={"primary"} */}
              {/*  text={"Lakukan Feedback"} */}
              {/*  onPress={verifyData} */}
              {/* />} */}

            </VStack>
          </ScrollView>
        </SafeAreaView>

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
          // visible={coachingStore.isLoading}
          textContent={'Memuat...'}
          // textStyle={styles.spinnerTextStyle}
        />
      </VStack>
    )
  },
)

export default NewJournalEntry;
