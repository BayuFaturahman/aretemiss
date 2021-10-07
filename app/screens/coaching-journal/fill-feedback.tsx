import React, {FC, useCallback, useReducer, useState} from "react"
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

import {NewButton} from "@screens/coaching-journal/components/new-button";
import {EmptyList} from "@screens/coaching-journal/components/empty-list";
import {CoachingJournalItemRender} from "@screens/coaching-journal/components/coaching-journal-item-render";
import {ActivitiesTypeLegends} from "@screens/coaching-journal/components/activities-type-legends";

type ChoiceItemType = {
  id: string
  title: string
  choice: 0 | 1 | 2 | 3 | 4 | 5
}

const EXAMPLE_DATA:Array<ChoiceItemType> = [
  {
    id: '0',
    title: '“Dalam skala 1 - 5, seberapa baik saya sudah membangun rapport atau kedekatan di awal sesi?”',
    choice: 0
  },
  {
    id: '1',
    title: '“Dalam skala 1 - 5, seberapa baik saya sudah membantu coachee menentukan outcome?”',
    choice: 0
  },
  {
    id: '2',
    title: '“Dalam skala 1 - 5, seberapa baik saya sudah membantu coachee menentukan outcome?”',
    choice: 0
  },
  {
    id: '3',
    title: '“Dalam skala 1 - 5, seberapa baik saya sudah membantu coachee menentukan outcome?”',
    choice: 0
  },
  {
    id: '4',
    title: '“Dalam skala 1 - 5, seberapa baik saya sudah membantu coachee menentukan outcome?”',
    choice: 0
  }
]

const FillFeedback: FC<StackScreenProps<NavigatorParamList, "fillFeedback">> = observer(
  ({ navigation }) => {

    // empty list state
    const [feedbackData, setFeedbackData] = useState<Array<ChoiceItemType>>(EXAMPLE_DATA);
    const [selectedActivities, setSelectedActivities] = useState<string>('');
    const [, forceUpdate] = useReducer(x => x + 1, 0);


    const goBack = () => navigation.goBack()

    const newEntry = () => navigation.navigate("newJournalEntry")

    const holdActivitiesId = useCallback((selectedId)=>{
      setSelectedActivities(selectedId)
      // forceUpdate()
    }, [selectedActivities])

    const goToNote = useCallback((id)=>{
      console.log(id)
    }, [])

    const goToFeedback = useCallback((id)=>{
      console.log(id)
    }, [])

    const goToNoteFeedback = useCallback((id)=>{
      console.log(id)
    }, [])

    const selectFeedbackItem = useCallback((id, choice)=>{

      const updated = feedbackData.map((item)=>{
        if(item.id === id){
          return { ...item, choice: choice}
        }
        return item;
      })

      setFeedbackData(updated)
    }, [feedbackData])

    const ChoiceItem = ({item, index}) => {
      return(
        <VStack vertical={Spacing[8]}>
          <Text type={'body'} style={{textAlign: 'center'}}>
            {item.title}
          </Text>
          <HStack top={Spacing[12]} style={{justifyContent: 'space-around'}}>
            {Array(5).fill(0).map((value, i, array)=>{
              return(
                <TouchableOpacity onPress={()=> selectFeedbackItem(item.id, i + 1)}>
                  <VStack>
                    <View style={{
                      height: Spacing[24],
                      width: Spacing[24],
                      backgroundColor: item.choice === i + 1 ? Colors.BRIGHT_BLUE : Colors.CLOUD_GRAY,
                      borderRadius: Spacing[128], borderWidth: Spacing[2],
                      borderColor: item.choice === i + 1 ? Colors.BRIGHT_BLUE : Colors.MAIN_RED
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
              <Text type={'left-header'} style={{color: Colors.WHITE}} text="Self-reflection feedback" />
              <Spacer height={Spacing[24]} />
              <Text type={"header"} style={{color: Colors.WHITE, textAlign:'center', fontSize: Spacing[12]}}>Berilah rating pada pernyataan berikut ini
                sesuai dengan sesi coaching yang sudah kamu lakukan.</Text>
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
                  feedbackData.length === 0 ?
                    null :
                    <VStack horizontal={Spacing[72]} vertical={Spacing[24]}>
                      <Button
                        type={"primary"}
                        text={"Submit"}
                        // onPress={toggleModal}
                        style={{minWidth: Spacing[72]}}
                      />
                    </VStack>
                }
              />
            </VStack>
          </ScrollView>
        </SafeAreaView>
      </VStack>
    )
  },
)

export default FillFeedback;
