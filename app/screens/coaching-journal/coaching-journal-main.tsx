import React, {FC, useCallback, useReducer, useState, useEffect} from "react"
import {FlatList, RefreshControl, SafeAreaView, ScrollView, StyleSheet, View} from "react-native"
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
import moment from 'moment'

import {CoachingJournalItemRender} from "@screens/coaching-journal/components/coaching-journal-item-render";
import {CoachingJournalItem} from "@screens/coaching-journal/coaching-journal.type";
import {ActivitiesTypeLegends} from "@screens/coaching-journal/components/activities-type-legends";
import {NewButton} from "@screens/coaching-journal/components/new-button";
import FastImage from "react-native-fast-image";
import { useStores } from "../../bootstrap/context.boostrap"

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
    const [coachingData, setCoachingData] = useState<Array<CoachingJournalItem>>([]);
    const [selectedActivities, setSelectedActivities] = useState<string>('');
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const {mainStore, coachingStore} = useStores()

    const onRefresh = React.useCallback(async() => {
      setCoachingData([])
      await coachingStore.clearJournal()
      await coachingStore.getJournal()
    }, []);

    const goBack = () => {
      navigation.reset({
        routes: [{ name: 'homepage' }]
      })
    }

    const newEntry = () => {
      coachingStore.isDetailJournal(false)
      coachingStore.setFormCoach(true)
      navigation.navigate("newJournalEntry", {
        isDetail: false
      })
    }
    const quizForm = () => navigation.navigate("quizForm")

    const holdActivitiesId = useCallback((selectedId)=>{
      setSelectedActivities(selectedId)
      // forceUpdate()
    }, [selectedActivities])

    const goToNote = useCallback((id, coach_id)=>{
      console.log(id)
      coachingStore.isDetailJournal(true)
      const detailCoaching = coach_id == mainStore.userProfile.user_id
      coachingStore.setDetailCoaching(detailCoaching)
      coachingStore.setDetailID(id)
      coachingStore.setFormCoach(true)
      console.log('goToNote coach_id', coach_id)
      console.log('goToNote user_id', mainStore.userProfile.user_id)
      navigation.navigate("overviewJournalEntry", {
        journalId: id,
        isCoachee: false
      })
    }, [])

    const goToFeedback = useCallback((id)=>{
      coachingStore.isDetailJournal(true)
      coachingStore.setDetailID(id)
      navigation.navigate("fillFeedbackDetail")
      console.log(id)
    }, [])

    const goToNoteFeedback = useCallback((id, coach_id)=>{

      coachingStore.isDetailJournal(true)
      const detailCoaching = coach_id == mainStore.userProfile.user_id
      coachingStore.setDetailCoaching(detailCoaching)
      coachingStore.setDetailID(id)
      coachingStore.setFormCoach(false)
      console.log('goToNoteFeedback coach_id', coach_id)
      console.log('goToNoteFeedback user_id', mainStore.userProfile.user_id)

      navigation.navigate("overviewJournalEntry", {
        journalId: id,
        isCoachee: true
      })
    }, [])

    useEffect(()=>{
      if(coachingStore.listJournal){
        createList()
      }
    },[coachingStore.listJournal, coachingStore.journalSucceed])

    useEffect(()=>{
      console.log('coachingStore.refreshData', coachingStore.refreshData)

      if(coachingStore.refreshData){
        setTimeout(()=>{
          coachingStore.getJournal()
        }, 20)
      }
    },[coachingStore.refreshData, coachingStore.createJournalSucceed, coachingStore.createFeedbackSucced])

    const createList = () => {
      const id = mainStore.userProfile.user_id
      let groupArrays = []
      if(coachingStore.listJournal){
        console.log('create list')
        console.log(coachingStore.listJournal)
        const groups = coachingStore.listJournal.reduce((groups, journalData) => {
          const date = journalData.journal_date.split('T')[0];
             if (!groups[date]) {
              groups[date] = [];
             }
             groups[date].push(
               {
                 ...journalData,
                  title: journalData.journal_title,
                  type: journalData.journal_type,
                  id: journalData.journal_id,
                  isTagged: id !== journalData.coach_id,
                  coach_id: journalData.coach_id
               }
             );
             return groups;
          }, {});
          groupArrays = Object.keys(groups).map((date) => {
             return {
             date: moment(date).format('DD MMM'),
             activities: groups[date]
             };
          });
      }
      if(groupArrays){
        setCoachingData(groupArrays)
        coachingStore.setRefreshData(false)
        forceUpdate()
      }
    }

    return (
      <VStack testID="CoachingJournalMain" style={{backgroundColor: Colors.UNDERTONE_BLUE, flex: 1, justifyContent: 'center'}}>
        <SafeAreaView style={Layout.flex}>
          <BackNavigation goBack={goBack} />
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={coachingStore.isLoading}
                onRefresh={onRefresh}
                tintColor={Colors.MAIN_RED}
              />
            }
          >
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
