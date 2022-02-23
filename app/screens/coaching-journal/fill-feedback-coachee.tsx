import React, {FC, useCallback, useEffect, useReducer, useState} from "react"
import {FlatList, SafeAreaView, ScrollView, TouchableOpacity, View} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  Text,
  BackNavigation, Button,
} from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import {HStack, VStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {Colors, Layout, Spacing} from "@styles";

import {EmptyList} from "@screens/coaching-journal/components/empty-list";
import { useStores } from "../../bootstrap/context.boostrap"

import Spinner from 'react-native-loading-spinner-overlay';

export type ChoiceItemType = {
  id: string
  title: string
  choice: 0 | 1 | 2 | 3 | 4 | 5
}

const EXAMPLE_DATA:Array<ChoiceItemType> = [
  {
    id: '0',
    title: 'Dalam skala 1 - 5, seberapa baik coach-mu sudah membangun rapport atau kedekatan di awal sesi?',
    choice: 0
  },
  {
    id: '1',
    title: 'Dalam skala 1 - 5, seberapa baik coach-mu sudah membantu saya sebagai coachee menentukan outcome?',
    choice: 0
  },
  {
    id: '2',
    title: 'Dalam skala 1 - 5, seberapa baik coach-mu sudah mempraktekan active listening atau mendengar aktif saat sesi berlangsung?',
    choice: 0
  },
  {
    id: '3',
    title: 'Dalam skala 1 - 5, seberapa baik coach-mu sudah mengajukan powerful questions atau pertanyaan yang menggugah pada saat sesi berlangsung?',
    choice: 0
  },
  {
    id: '4',
    title: 'Dalam skala 1 - 5, seberapa baik coach-mu sudah menggali insights atau pembelajaran yang saya dapatkan selama sesi berlangsung?”',
    choice: 0
  },
  {
    id: '5',
    title: 'Dalam skala 1 - 5, seberapa baik coach-mu sudah membantu saya sebagai coachee untuk menyampaikan komitmen di akhir sesi?”',
    choice: 0
  }
]

const FillFeedbackCoachee: FC<StackScreenProps<NavigatorParamList, "fillFeedbackCoachee">> = observer(
  ({ navigation, route }) => {

    const { isFilled, journalId } = route.params;

    // empty list state
    const [feedbackData, setFeedbackData] = useState<Array<ChoiceItemType>>(EXAMPLE_DATA);
    const [selectedActivities, setSelectedActivities] = useState<string>('');
    const [isAlreadyFilled, setIsAlreadyFilled] = useState<boolean>(false);
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const { coachingStore, mainStore } = useStores()

    const goBack = () => navigation.goBack()

    const selectFeedbackItem = useCallback((id, choice)=>{

      const updated = feedbackData.map((item)=>{
        if(item.id === id){
          return { ...item, choice: choice}
        }
        return item;
      })

      setFeedbackData(updated)
    }, [feedbackData])

    const submit = async () => {
      console.log('coachingStore.isDetail', coachingStore.isDetail)
      console.log(feedbackData)

      let isError = false

      for (const item of feedbackData) {
        if(item.choice === "" || item.choice === 0) {
          isError = true
          break;
        }
        console.log(item.choice);
      }

      if(isError === false){
        await coachingStore.createFeedback(
          feedbackData[0].choice,
          feedbackData[1].choice,
          feedbackData[2].choice,
          feedbackData[3].choice,
          feedbackData[4].choice,
          feedbackData[5].choice,
          journalId
        )
      }

      // if(coachingStore.isDetail){
      //   coachingStore.createFeedback(
      //     feedbackData[0].choice,
      //     feedbackData[1].choice,
      //     feedbackData[2].choice,
      //     feedbackData[3].choice,
      //     feedbackData[4].choice,
      //     feedbackData[5].choice,
      //     journalId
      //   )
      // }else{
      //   coachingStore.createJournal(
      //     feedbackData[0].choice,
      //     feedbackData[1].choice,
      //     feedbackData[2].choice,
      //     feedbackData[3].choice,
      //     feedbackData[4].choice,
      //     feedbackData[5].choice
      //   )
      // }
    }

    useEffect(() => {
      // coachingStore.resetLoading()
      // mainStore.resetLoading()
    },[])

  useEffect(() => {
      if(coachingStore.messageCreateJournal == "Success" && !coachingStore.isDetail){
        coachingStore.resetCoachingStore()
        coachingStore.setRefreshData(true)
        coachingStore.clearJournal().then(()=>{
          navigation.reset({
            routes: [{ name: 'coachingJournalMain' }]
          })
        })
      }
  },[coachingStore.messageCreateJournal, coachingStore.createJournalSucceed])

  useEffect(() => {
      if(coachingStore.messageCreateFeedback == "Success" && coachingStore.isDetail){
        coachingStore.resetCoachingStore()
        coachingStore.setRefreshData(true)
        coachingStore.clearJournal().then(()=>{
          navigation.reset({
            routes: [{ name: 'coachingJournalMain' }]
          })
        })
      }
  },[coachingStore.messageCreateFeedback, coachingStore.createFeedbackSucced])

    const getFeedbackDetail = useCallback(async ()=>{
      await coachingStore.getFeedbackDetailById(journalId, true)

      if(coachingStore.my_feedback){
        const myFeedback = coachingStore.my_feedback

        const updated = feedbackData.map((item, index) => {
          if(myFeedback[`q${index + 1}`]){
            setIsAlreadyFilled(true)
          }
          return {
            title: item.title,
            id: item.id,
            choice: myFeedback[`q${index + 1}`],
          }
        })
        console.log(`updated`, updated)
        setFeedbackData(updated)
      }
    },[])

    useEffect(() => {
      getFeedbackDetail()
    },[])

    const ChoiceItem = ({item, index}) => {
      return(
        <VStack vertical={Spacing[8]}>
          <Text type={'body'} style={{textAlign: 'center'}}>
            {item.title}
          </Text>
          <HStack top={Spacing[12]} style={{justifyContent: 'space-around'}}>
            {Array(5).fill(0).map((value, i, array)=>{
              return(
                <TouchableOpacity onPress={()=> selectFeedbackItem(item.id, i + 1)} disabled={isAlreadyFilled}>
                  <VStack>
                    <View style={{
                      height: Spacing[24],
                      width: Spacing[24],
                      backgroundColor: item.choice === i + 1 ? Colors.MAIN_RED : Colors.CLOUD_GRAY,
                      borderRadius: Spacing[128], borderWidth: Spacing[2],
                      borderColor: item.choice === i + 1 ? Colors.MAIN_RED : Colors.MAIN_RED
                    }} />
                    <Text type={'body'} style={{textAlign: 'center'}}>
                      {i + 1}
                    </Text>
                  </VStack>
                </TouchableOpacity>
              )
            })}
          </HStack>
        </VStack>
      )
    }

    return (
      <VStack testID="CoachingJournalMain" style={{backgroundColor: Colors.UNDERTONE_BLUE, flex: 1, justifyContent: 'center'}}>
        <SafeAreaView style={Layout.flex}>
          <BackNavigation goBack={goBack} />
          <ScrollView>
            <VStack top={Spacing[8]} horizontal={Spacing[24]} bottom={Spacing[12]}>
              <Text type={'left-header'} style={{color: Colors.WHITE}} text="Feedback untuk coach" />
              <Spacer height={Spacing[24]} />
              <Text type={"header"} style={{color: Colors.WHITE, textAlign:'center', fontSize: Spacing[12]}}>Terima kasih sudah memberikan feedback untuk coach-mu! Inilah penilaian yang sudah kamu berikan untuk sesi coaching kali ini.</Text>
              <Spacer height={Spacing[32]} />
            </VStack>
            <VStack top={Spacing[32]} horizontal={Spacing[24]} style={[Layout.heightFull, {backgroundColor: Colors.WHITE, borderTopStartRadius: Spacing[48], borderTopEndRadius: Spacing[48]}]}>
              <FlatList
                ItemSeparatorComponent={()=><Spacer height={Spacing[24]} />}
                data={feedbackData}
                ListEmptyComponent={()=>
                  <EmptyList />
                }
                renderItem={({item, index})=> <ChoiceItem item={item} index={index} />}
                keyExtractor={item => item.id}
                ListFooterComponent={
                  isAlreadyFilled ?
                    null :
                    <VStack horizontal={Spacing[72]} vertical={Spacing[24]}>
                      <Button
                        type={"primary"}
                        text={"Submit"}
                        onPress={submit}
                        style={{minWidth: Spacing[72]}}
                      />
                    </VStack>
                }
              />
              <Spacer height={Spacing[32]} />
            </VStack>
          </ScrollView>
        </SafeAreaView>
        <Spinner
          visqible={coachingStore.isLoading || mainStore.isLoading}
          textContent={'Memuat...'}
          // textStyle={styles.spinnerTextStyle}
        />
      </VStack>
    )
  },
)

export default FillFeedbackCoachee;
