import React, {FC, useCallback, useReducer, useState} from "react"
import {FlatList, SafeAreaView, ScrollView, StyleSheet, View} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  Text,
  BackNavigation
} from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import {HStack, VStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {Colors, Layout, Spacing} from "@styles";

import {CoachingJournalItemRender} from "@screens/coaching-journal/components/coaching-journal-item-render";
import {CoachingJournalItem} from "@screens/coaching-journal/coaching-journal.type";
import {ActivitiesTypeLegends} from "@screens/coaching-journal/components/activities-type-legends";
import {NewButton} from "@screens/coaching-journal/components/new-button";
import FastImage from "react-native-fast-image";

import arrowYellow from "@assets/icons/coachingJournal/empty/arrow-yellow.png";
import smileYellow from "@assets/icons/coachingJournal/empty/smile-yellow.png";
import surprissedPurple from "@assets/icons/coachingJournal/empty/surprised-purple.png";
import {dimensions} from "@config/platform.config";
import {EmptyList} from "@screens/coaching-journal/components/empty-list";

const EXAMPLE_COACHING_DATA:Array<CoachingJournalItem> = [
  {
    date: '02 AUG',
    activities: [
      {
        title: 'Weekly coaching with Agus Surya Pradana.',
        type: 'weekly_coaching',
        id: '1',
        isTagged: false
      },
      {
        title: 'Coffee time dengan semua anggota tim.',
        type: 'gathering',
        id: '2',
        isTagged: false
      },
    ]
  },
  {
    date: '03 AUG',
    activities: [
      {
        title: 'Weekly coaching with Dewi Permata Kurnia.',
        type: 'weekly_coaching',
        id: '3',
        isTagged: false
      },
      {
        title: 'Weekly coaching with Arjuna Haryono.',
        type: 'weekly_coaching',
        id: '4',
        isTagged: false
      },
      {
        title: 'Weekly coaching #2',
        type: 'coached',
        coachedBy: 'Indrawan Kresna',
        id: '5',
        isTagged: true
      },
    ]
  },
  {
    date: '04 AUG',
    activities: [
      {
        title: 'Weekly coaching with Dewi Permata Kurnia.',
        type: 'weekly_coaching',
        id: '6',
        isTagged: false
      },
      {
        title: 'Weekly coaching with Arjuna Haryono.',
        type: 'weekly_coaching',
        id: '7',
        isTagged: false
      },
      {
        title: 'Weekly coaching #2',
        type: 'coached',
        coachedBy: 'Indrawan Kresna',
        id: '8',
        isTagged: false
      },
    ]
  }
]

const CoachingJournalMain: FC<StackScreenProps<NavigatorParamList, "coachingJournalMain">> = observer(
  ({ navigation }) => {

    // empty list state
    // const [coachingData, setCoachingData] = useState<Array<CoachingJournalItem>>([]);
    const [coachingData, setCoachingData] = useState<Array<CoachingJournalItem>>(EXAMPLE_COACHING_DATA);
    const [selectedActivities, setSelectedActivities] = useState<string>('');
    const [, forceUpdate] = useReducer(x => x + 1, 0);


    const goBack = () => navigation.navigate("settingsPage")

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

    return (
      <VStack testID="CoachingJournalMain" style={{backgroundColor: Colors.UNDERTONE_BLUE, flex: 1, justifyContent: 'center'}}>
        <SafeAreaView style={Layout.flex}>
          <BackNavigation goBack={goBack} />
          <ScrollView>
            <VStack top={Spacing[8]} horizontal={Spacing[24]} bottom={Spacing[12]}>
              <Text type={'header'} style={{color: Colors.WHITE}} text="Coaching Journal" />
              <Spacer height={Spacing[24]} />
              <Text type={'body'} style={{textAlign: 'center', color: Colors.WHITE}}>
                Setiap journal entry yang kamu catat di iLEAD akan memberikan kesempatan bagi anggota tim kamu untuk memberikan <Text type={"label"} style={{color: Colors.WHITE}}>feedback</Text> kepadamu juga lho! Anggota tim bisa memberikan feedback untuk setiap journal entry yang kamu catat.
              </Text>
              <Spacer height={Spacing[32]} />
            </VStack>
            <VStack top={Spacing[32]} horizontal={Spacing[24]} style={[Layout.heightFull, {backgroundColor: Colors.WHITE, borderTopStartRadius: Spacing[48], borderTopEndRadius: Spacing[48]}]}>
              <NewButton onPress={newEntry} />
              {coachingData.length === 0 ? <FastImage style={{
                height: Spacing[96],
                width: Spacing[96],
                left: (dimensions.screenWidth / 2) + Spacing[32],
                top: Spacing[24],
                zIndex: 20,
                position: 'absolute'
              }} source={arrowYellow} resizeMode={"contain"}/> : null}
              <Spacer height={Spacing[12]} />
              <Text type={'left-header'} style={{}} text="Catatan jurnal coaching" />
              <Spacer height={Spacing[12]} />
              <FlatList
                ItemSeparatorComponent={()=><Spacer height={Spacing[24]} />}
                data={coachingData}
                ListEmptyComponent={()=>
                  <EmptyList />
                }
                renderItem={({item, index})=><CoachingJournalItemRender
                  {...{item, index}}
                  onPressActivity={holdActivitiesId}
                  selectedActivities={selectedActivities}
                  onPressNote={goToNote}
                  onPressFeedback={goToFeedback}
                  onPressNoteFeedback={goToNoteFeedback}
                />}
                keyExtractor={item => item.date}
                ListFooterComponent={
                  coachingData.length === 0 ?
                  null :
                    <VStack vertical={Spacing[24]}>
                      <ActivitiesTypeLegends />
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

export default CoachingJournalMain;
