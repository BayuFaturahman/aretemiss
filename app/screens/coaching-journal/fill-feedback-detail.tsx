import React, {FC, useCallback, useEffect, useReducer, useState} from "react"
import {FlatList, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  Text,
  BackNavigation, Button, TextField, DropDownPicker
} from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import {HStack, VStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {Colors, Layout, Spacing} from "@styles";

import {EmptyList} from "@screens/coaching-journal/components/empty-list";
import { useStores } from "../../bootstrap/context.boostrap"

import Spinner from 'react-native-loading-spinner-overlay';

type ChoiceItemType = {
  id: string
  title: string
  sameChoice: 0 | 1 | 2 | 3 | 4 | 5
  yourChoice: 0 | 1 | 2 | 3 | 4 | 5
  coacheChoice: 0 | 1 | 2 | 3 | 4 | 5
}

const EXAMPLE_DATA:Array<ChoiceItemType> = [
  {
    id: '0',
    title: 'Dalam skala 1 - 5, seberapa baik saya sudah membangun rapport atau kedekatan di awal sesi?',
    sameChoice: 0,
    yourChoice: 0,
    coacheChoice: 0,
  },
  {
    id: '1',
    title: 'Dalam skala 1 - 5, seberapa baik saya sudah membantu coachee menentukan outcome?',
    sameChoice: 0,
    yourChoice: 0,
    coacheChoice: 0,
  },
  {
    id: '2',
    title: 'Dalam skala 1 - 5, seberapa baik saya sudah mempraktekan active listening atau mendengar aktif saat sesi berlangsung?',
    sameChoice: 0,
    yourChoice: 0,
    coacheChoice: 0,
  },
  {
    id: '3',
    title: 'Dalam skala 1 - 5, seberapa baik saya sudah mengajukan powerful questions atau pertanyaan yang menggugah pada saat sesi berlangsung?',
    sameChoice: 0,
    yourChoice: 0,
    coacheChoice: 0,
  },
  {
    id: '4',
    title: 'Dalam skala 1 - 5, seberapa baik saya sudah menggali insights atau pembelajaran yang coachee dapatkan selama sesi berlangsung?',
    sameChoice: 0,
    yourChoice: 0,
    coacheChoice: 0,
  },
  {
    id: '5',
    title: 'Dalam skala 1 - 5, seberapa baik saya sudah membantu coachee untuk menyampaikan komitmen di akhir sesi?',
    sameChoice: 0,
    yourChoice: 0,
    coacheChoice: 0,
  }
]

export type FeedbackDetailType = 'same_answer' | 'my_answer' | 'coachee_answer'

export type FeedbackResultItemType = {
  type: FeedbackDetailType
  value: string
}

export const FEEDBACK_DETAIL_TYPE_CHOICE:Array<FeedbackResultItemType> = [
  {
    type: 'same_answer',
    value: 'Jawaban yang sama'
  },
  // {
  //   type: 'my_answer',
  //   value: 'Jawaban Anda'
  // },
  {
    type: 'coachee_answer',
    value: 'Jawaban Anda dan Coache'
  }
]

const FillFeedbackDetail: FC<StackScreenProps<NavigatorParamList, "fillFeedbackDetail">> = observer(
  ({ navigation }) => {

    const [feedbackType, setFeedbackType] = useState<FeedbackDetailType>('same_answer');

    // empty list state
    const [feedbackData, setFeedbackData] = useState<Array<ChoiceItemType>>(EXAMPLE_DATA);
    const [selectedActivities, setSelectedActivities] = useState<string>('');
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const { coachingStore, mainStore } = useStores()

    const goBack = () => navigation.goBack()

    const getFeedbackDetail = useCallback(async ()=>{
        await coachingStore.getFeedbackDetail()

        if(coachingStore.coachee_feedback && coachingStore.my_feedback){
          const coachee_feedback = coachingStore.coachee_feedback
          const my_feedback = coachingStore.my_feedback

          const updated = await feedbackData.map((item, index)=>{
            return {
              title: item.title,
              id: item.id,
              coacheChoice: coachee_feedback[`q${index+1}`],
              yourChoice: my_feedback[`q${index+1}`],
              sameChoice: coachee_feedback[`q${index+1}`] == my_feedback[`q${index+1}`] ? my_feedback[`q${index+1}`] : 0
            }
          })
          console.log(`updated`, updated)
          setFeedbackData(updated)
        }
    },[coachingStore.coachee_feedback, coachingStore.my_feedback, coachingStore.feedbackDetailSucced])

    useEffect(() => {
      coachingStore.resetLoading()
      mainStore.resetLoading()
      setTimeout(()=>{
        getFeedbackDetail()
      }, 20)
    },[])

    const FeedbackResultType = ({}) => {
      return(
        <HStack style={{justifyContent: 'space-around'}}>
          {FEEDBACK_DETAIL_TYPE_CHOICE.map((item, index)=>{
            return(
              <TouchableOpacity key={item.type} onPress={()=> setFeedbackType(item.type)} style={{backgroundColor: feedbackType === item.type ? Colors.WHITE : Colors.UNDERTONE_BLUE, borderRadius: Spacing[20], height: Spacing[42], justifyContent: 'center'}}>
                <HStack horizontal={Spacing[6]} style={{justifyContent: 'center'}}>
                  { item.type === 'same_answer' ? <View style={{
                    height: Spacing[16],
                    width: Spacing[16],
                    backgroundColor: Colors.BRIGHT_BLUE,
                    borderRadius: Spacing[128], borderWidth: Spacing[2],
                    borderColor: Colors.BRIGHT_BLUE
                  }} /> : null }

                  { item.type === 'my_answer' ? <View style={{
                    height: Spacing[16],
                    width: Spacing[16],
                    backgroundColor: Colors.WHITE,
                    borderRadius: Spacing[128], borderWidth: Spacing[4],
                    borderColor: Colors.BRIGHT_BLUE,
                  }} /> : null }

                  { item.type === 'coachee_answer' ? <View style={{
                    height: Spacing[16],
                    width: Spacing[16],
                    backgroundColor: Colors.MAIN_RED,
                    borderRadius: Spacing[128], borderWidth: Spacing[2],
                    borderColor: Colors.MAIN_RED
                  }} /> : null }

                  <Spacer width={Spacing[6]} />
                  <HStack>
                    <Text type={'body'} numberOfLines={2} style={{textAlign: 'left', color: feedbackType === item.type ? Colors.UNDERTONE_BLUE : Colors.WHITE, fontSize: Spacing[12], lineHeight: Spacing[12]}}>
                      {item.value}
                    </Text>
                  </HStack>
                </HStack>
              </TouchableOpacity>
            )
          })}
        </HStack>
      )
    }

    const ChoiceItem = ({item, index}:{item: ChoiceItemType; index: number}) => {
      return(
        <VStack vertical={Spacing[8]}>
          <Text type={'body'} style={{textAlign: 'center'}}>
            {item.title}
          </Text>
          <HStack top={Spacing[12]} style={{justifyContent: 'space-around'}}>
            {Array(5).fill(0).map((value, i, array)=>{
              return(
                <HStack>
                  <VStack>

                    <View style={{
                      position: 'absolute',
                      height: Spacing[24],
                      width: Spacing[24],
                      backgroundColor: item.choice === i + 1 ? Colors.BRIGHT_BLUE : Colors.CLOUD_GRAY,
                      borderRadius: Spacing[128], borderWidth: Spacing[2],
                      borderColor: item.choice === i + 1 ? Colors.BRIGHT_BLUE : Colors.MAIN_RED
                    }} />

                    { feedbackType === 'same_answer' && item.sameChoice === (i + 1) ? <View style={{
                      position: 'absolute',
                      height: Spacing[24],
                      width: Spacing[24],
                      backgroundColor: Colors.BRIGHT_BLUE,
                      borderRadius: Spacing[128], borderWidth: Spacing[2],
                      borderColor: Colors.BRIGHT_BLUE
                    }} /> : null }

                    { (feedbackType === 'my_answer' || feedbackType === 'coachee_answer') && item.yourChoice === (i + 1) ? <View style={{
                      position: 'absolute',
                      height: Spacing[24],
                      width: Spacing[24],
                      backgroundColor: Colors.WHITE,
                      borderRadius: Spacing[128], borderWidth: Spacing[4],
                      borderColor: Colors.MAIN_BLUE,
                    }} /> : null }

                    { feedbackType === 'coachee_answer' && item.coacheChoice === (i + 1) ? <View style={{
                      position: 'absolute',
                      height: Spacing[24],
                      width: Spacing[24],
                      backgroundColor: Colors.MAIN_RED,
                      borderRadius: Spacing[128], borderWidth: Spacing[2],
                      borderColor: Colors.MAIN_RED
                    }} /> : null }

                    <VStack style={{width: Spacing[24]}} top={Spacing[28]}>
                      <Text type={'body'} style={{textAlign: 'center'}}>
                        {i + 1}
                      </Text>
                    </VStack>
                  </VStack>
                </HStack>
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
              <Text type={'left-header'} style={{color: Colors.WHITE}} text="Feedback result" />
              <Spacer height={Spacing[24]} />
              <Text type={"header"} style={{color: Colors.WHITE, textAlign:'center', fontSize: Spacing[12]}}>
                Berikut adalah hasil feedback {'\n'}
                sudah dinilai oleh anggota tim-mu.
              </Text>
              <Spacer height={Spacing[32]} />

              <FeedbackResultType />

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
              />
            </VStack>
          </ScrollView>
        </SafeAreaView>
        <Spinner
          visible={coachingStore.isLoading || mainStore.isLoading}
          textContent={'Memuat...'}
        />
      </VStack>
    )
  },
)

export default FillFeedbackDetail;
