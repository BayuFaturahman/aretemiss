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

import {CoachingJournalItemRender} from "@screens/coaching-journal/components/coaching-journal-item-render";
import {CoachingJournalItem} from "@screens/coaching-journal/coaching-journal.type";
import {ACTIVITIES_TYPE, ActivitiesTypeLegends} from "@screens/coaching-journal/components/activities-type-legends";
import {NewButton} from "@screens/coaching-journal/components/new-button";
import FastImage from "react-native-fast-image";

import arrowYellow from "@assets/icons/coachingJournal/empty/arrow-yellow.png";
import {dimensions} from "@config/platform.config";
import {EmptyList} from "@screens/coaching-journal/components/empty-list";

const NewJournalEntry: FC<StackScreenProps<NavigatorParamList, "coachingJournalMain">> = observer(
  ({ navigation }) => {

    // empty list state
    const [coachingData, setCoachingData] = useState<Array<CoachingJournalItem>>([]);
    const [selectedActivities, setSelectedActivities] = useState<string>('');
    const [, forceUpdate] = useReducer(x => x + 1, 0);


    const goBack = () => navigation.goBack()

    const newEntry = () => navigation.navigate("settingsPage")

    const holdActivitiesId = useCallback((selectedId)=>{
      setSelectedActivities(selectedId)
      // forceUpdate()
    }, [selectedActivities])

    const goToNote = useCallback((id)=>{
      console.log(id)
    }, [])


    const dateArr = "02 AUG".split(' ')

    const ActivityTypeSelector = ({onActivityPress = (item) => null, selectedActivity = 'weekly_coaching'}) => {
      return(
      <HStack style={{justifyContent: 'space-around'}}>
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
                  // label="No. HP baru:"
                  isRequired={false}
                  secureTextEntry={false}
                  placeholder={'Tulis nama judul sesi coaching di sini.'}
                />
                <HStack style={{zIndex: 100}}>
                  <VStack style={{width:Spacing[64]}}>
                    <Text type={'body-bold'} style={{textAlign: 'right', top: Spacing[4]}} text="dengan" />
                  </VStack>
                  <Spacer/>
                  <VStack style={{maxWidth: dimensions.screenWidth - Spacing[128]}}>
                    <DropDownPicker
                      isRequired={false}
                      // label="Pilih team kedua (jika ada):"
                      onValueChange={(value)=>console.log('testt '+ value)}
                      placeholder={'Pilih salah satu'}
                      containerStyle={{marginTop: Spacing[4]}}
                      zIndex={2000}
                      zIndexInverse={2000}
                      dropDownDirection={"BOTTOM"}
                    />
                  </VStack>
                </HStack>
                <HStack>
                  <TouchableOpacity style={{height: '100%', width: '20%'}}>
                    <VStack horizontal={Spacing[8]} vertical={Spacing[2]} style={{flex:1, width: '100%', borderRadius: Spacing[12], alignItems: 'flex-end', justifyContent: 'flex-end', backgroundColor: Colors.MAIN_BLUE}}>
                      <Text type={'button'} style={{color:Colors.WHITE, bottom: -Spacing[8]}} text={dateArr[0]} />
                      <Text type={'button'} style={{color:Colors.WHITE}} text={dateArr[1]} />
                    </VStack>
                  </TouchableOpacity>
                   <Spacer />
                  <VStack top={Spacing[8]} style={{width: '75%'}}>
                    <Text type={'body-bold'} style={{textAlign: 'center', top: Spacing[4]}}>
                      {`Apa yang `}
                      <Text type={'body-bold'} style={{color: Colors.BRIGHT_BLUE}}>
                        {'dibicarakan'}
                      </Text>
                      {` saat coaching?`}
                    </Text>
                    <TextField
                      // label="Masukan kembali no. HP baru:"
                      style={{ paddingTop: 0}}
                      inputStyle={{minHeight: Spacing[72]}}
                      isRequired={false}
                      secureTextEntry={false}
                      isTextArea={true}
                    />
                  </VStack>
                </HStack>
                <VStack top={Spacing[12]}>
                  <Text type={'body-bold'} style={{textAlign: 'center', top: Spacing[4]}}>
                    {`Sebagai coach, apa yang sudah saya lakukan dengan `}
                    <Text type={'body-bold'} style={{color: Colors.BRIGHT_BLUE}}>
                      {'efektif?'}
                    </Text>
                  </Text>
                  <TextField
                    // label="Masukan kembali no. HP baru:"
                    style={{ paddingTop: 0}}
                    inputStyle={{minHeight: Spacing[48]}}
                    isRequired={false}
                    secureTextEntry={false}
                    isTextArea={true}
                  />
                </VStack>
                <VStack top={Spacing[12]}>
                  <Text type={'body-bold'} style={{textAlign: 'center', top: Spacing[4]}}>
                    {`Sebagai coach, kualitas apa yang dapat saya `}
                    <Text type={'body-bold'} style={{color: Colors.BRIGHT_BLUE}}>
                      {'tingkatkan?'}
                    </Text>
                  </Text>
                  <TextField
                    style={{ paddingTop: 0}}
                    inputStyle={{minHeight: Spacing[48]}}
                    isRequired={false}
                    secureTextEntry={false}
                    isTextArea={true}
                  />
                </VStack>
                <VStack top={Spacing[12]}>
                  <Text type={'body-bold'} style={{textAlign: 'center', top: Spacing[4]}}>
                    <Text type={'body-bold'} style={{color: Colors.BRIGHT_BLUE}}>
                      {'Komitment?'}
                    </Text>
                    {` apa saja yang sudah disepakati bersama?`}
                  </Text>
                  <TextField
                    style={{ paddingTop: 0}}
                    inputStyle={{minHeight: Spacing[128]}}
                    isRequired={false}
                    secureTextEntry={false}
                    isTextArea={true}
                  />
                </VStack>
              </VStack>
            </VStack>
            <VStack vertical={Spacing[24]} horizontal={Spacing[128]}>
              <ActivityTypeSelector onActivityPress={holdActivitiesId} selectedActivity={selectedActivities} />
            </VStack>
            <VStack vertical={Spacing[24]}>
              <ActivitiesTypeLegends showedItems={[1,2]} />
            </VStack>
          </ScrollView>
        </SafeAreaView>
      </VStack>
    )
  },
)

export default NewJournalEntry;
