import React, { FC, useCallback, useEffect, useReducer, useState } from "react"
import { FlatList, ImageBackground, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  Text,
  BackNavigation, Button, TextField, DropDownPicker
} from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack";
import Spacer from "@components/spacer";
import { Colors, Layout, Spacing } from "@styles";

import { EmptyList } from "@screens/coaching-journal/components/empty-list";
import { useStores } from "../../bootstrap/context.boostrap"

import Spinner from 'react-native-loading-spinner-overlay';
import { FeedbackJLSixth } from "../../store/store.coaching";
import { images } from "@assets/images";

type ChoiceItemType = {
  id: string
  title: string
  choice: 0 | 1 | 2 | 3 | 4 | 5
}

const EXAMPLE_DATA: Array<ChoiceItemType> = [
  {
    id: '0',
    title: 'Dalam skala 1 - 5, seberapa baik saya sudah membangun rapport atau kedekatan di awal sesi?',
    choice: 0
  },
  {
    id: '1',
    title: 'Dalam skala 1 - 5, seberapa baik saya sudah membantu coachee menentukan outcome?',
    choice: 0
  },
  {
    id: '2',
    title: 'Dalam skala 1 - 5, seberapa baik saya sudah mempraktekan active listening atau mendengar aktif saat sesi berlangsung?',
    choice: 0
  },
  {
    id: '3',
    title: 'Dalam skala 1 - 5, seberapa baik saya sudah mengajukan powerful questions atau pertanyaan yang menggugah pada saat sesi berlangsung?',
    choice: 0
  },
  {
    id: '4',
    title: 'Dalam skala 1 - 5, seberapa baik saya sudah menggali insights atau pembelajaran yang coachee dapatkan selama sesi berlangsung?',
    choice: 0
  },
  {
    id: '5',
    title: 'Dalam skala 1 - 5, seberapa baik saya sudah membantu coachee untuk menyampaikan komitmen di akhir sesi?',
    choice: 0
  }
]

const FillFeedback: FC<StackScreenProps<NavigatorParamList, "fillFeedback">> = observer(
  ({ navigation, route }) => {

    const { data, isDetail } = route.params

    // empty list state
    const [isSubmitClicked, setIsSubmitClicked] = useState(false)
    const [feedbackData, setFeedbackData] = useState<Array<ChoiceItemType>>(EXAMPLE_DATA);
    const [isError, setError] = useState<string>(null)
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const { coachingStore, mainStore } = useStores()

    const goBack = () => navigation.goBack()

    const selectFeedbackItem = useCallback((id, choice) => {
      const updated = feedbackData.map((item) => {
        if (item.id === id) {
          return { ...item, choice: choice }
        }
        return item;
      })
      updated.map((item, index) => {
        console.log(data.questions[`q${index + 1}`])
        return (
          data.questions[`q${index + 1}`] = item.choice
        )
      })
      setFeedbackData(updated)
      forceUpdate()
    }, [feedbackData])

    const submit = useCallback(async () => {
      let counter = 0
      let isFeedbackError = false
      setIsSubmitClicked(true)

      console.log('submit self-feedback ', feedbackData)
      feedbackData.map((item, index) => {
        if (item.choice === 0) {
          counter += 1
        }
      })
      // console.log("counter ", counter)
      if (counter > 0) {
        isFeedbackError = true
        setError('choice')
      } else {
        setError(null)
      }
      // console.log('is error ', isError)
      if (!isFeedbackError) {
        await coachingStore.createJournal(data)
      }
    }, [feedbackData, isError, isSubmitClicked])

    useEffect(() => {
      coachingStore.resetLoading()
      mainStore.resetLoading()
    }, [])

    useEffect(() => {
      if (coachingStore.messageCreateJournal === "Success" && !coachingStore.isDetail) {
        coachingStore.resetCoachingStore()
        coachingStore.setRefreshData(true)
        coachingStore.clearJournal().then(() => {
          navigation.reset({
            routes: [{ name: 'coachingJournalMain' }]
          })
        })
      }
    }, [coachingStore.messageCreateJournal, coachingStore.createJournalSucceed])

    useEffect(() => {
      if (coachingStore.messageCreateFeedback === "Success" && coachingStore.isDetail) {
        coachingStore.resetCoachingStore()
        coachingStore.setRefreshData(true)
        coachingStore.clearJournal().then(() => {
          navigation.reset({
            routes: [{ name: 'coachingJournalMain' }]
          })
        })
      }
    }, [coachingStore.messageCreateFeedback, coachingStore.createFeedbackSucced])

    const ChoiceItem = ({ item, index, onPressItem }) => {
      let isEmpty = false

      if (isSubmitClicked && item.choice === 0) {
        isEmpty = true
        // console.log('SUUBMIT CLIECK = TRUE item ', item)
      }

      return (
        <VStack vertical={Spacing[8]}>
          <Text type={isEmpty ? 'warning' : 'body'} style={{ textAlign: 'center' }}>
            {item.title}
          </Text>
          <HStack top={Spacing[12]} style={{ justifyContent: 'space-around' }}>
            {Array(5).fill(0).map((value, i, array) => {
              return (
                <TouchableOpacity onPress={() => onPressItem(item.id, i + 1)}>
                  <VStack>
                    <View style={{
                      height: Spacing[24],
                      width: Spacing[24],
                      backgroundColor: item.choice === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_BG_BLUE,
                      borderRadius: Spacing[128], borderWidth: Spacing[2],
                      borderColor: item.choice === i + 1 ? Colors.ABM_LIGHT_BLUE : Colors.ABM_LIGHT_BLUE
                    }} />
                    <Text type={'body'} style={{ textAlign: 'center' }}>
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
      <VStack testID="CoachingJournalMain" style={{ backgroundColor: Colors.ABM_MAIN_BLUE, flex: 1, justifyContent: 'center' }}>
        <SafeAreaView style={Layout.flex}>
          <BackNavigation goBack={goBack} />
          <ScrollView>
            <VStack top={Spacing[8]} horizontal={Spacing[24]} bottom={Spacing[12]}>
              <ImageBackground source={images.bgPattern} style={{ width: '100%' }} resizeMode={"cover"}>
                <Text type={'left-header'} style={{ color: Colors.WHITE }} text="Self-reflection feedback" />
                <Spacer height={Spacing[24]} />
                <Text type={"header"} style={{ color: Colors.WHITE, textAlign: 'center', fontSize: Spacing[12] }}>Berilah rating pada pernyataan berikut ini
                  sesuai dengan sesi coaching yang sudah kamu lakukan.</Text>
                <Spacer height={Spacing[12]} />

                <Text type={"label"} style={{ color: Colors.WHITE, fontSize: Spacing[12], textAlign: 'center' }}>
                  <Text type={"left-label"} style={{ color: Colors.WHITE, fontSize: Spacing[12], textAlign: 'center' }}>
                    {`Penting! `}</Text>
                  {`Catatan coaching-mu belum tersimpan sampai kamu \n klik `}
                  <VStack style={{ backgroundColor: Colors.ABM_GREEN, paddingHorizontal: Spacing[8], borderRadius: Spacing[48], maxWidth: Spacing[64], padding: Spacing[0] }}>
                    <Text type={'body-bold'} text={`Submit`} numberOfLines={1} style={{ color: Colors.ABM_MAIN_BLUE, fontSize: Spacing[12], textAlign: 'center' }} />
                  </VStack>
                  {` di bawah halaman ini.`}
                </Text>

                <Spacer height={Spacing[12]} />
              </ImageBackground>
              {/* {isError !== null ? <Text type={"warning"} style={{textAlign:'center', fontSize: Spacing[12]}}>Ada yang belum diisi nih!</Text> : null} */}
              <Spacer height={Spacing[12]} />
            </VStack>
            <VStack top={Spacing[32]} horizontal={Spacing[24]} style={[Layout.heightFull, { backgroundColor: Colors.WHITE, borderTopStartRadius: Spacing[48], borderTopEndRadius: Spacing[48] }]}>
              <FlatList
                ItemSeparatorComponent={() => <Spacer height={Spacing[24]} />}
                data={feedbackData}
                ListEmptyComponent={() =>
                  <EmptyList />
                }
                renderItem={({ item, index }) => <ChoiceItem item={item} index={index} onPressItem={selectFeedbackItem} />}
                keyExtractor={item => item.id}
                ListFooterComponent={
                  feedbackData.length === 0 ?
                    null :
                    <VStack horizontal={Spacing[72]} vertical={Spacing[24]}>
                      <Button
                        type={"primary"}
                        text={"Submit"}
                        onPress={submit}
                        style={{ minWidth: Spacing[72] }}
                      />
                    </VStack>
                }
              />
            </VStack>
          </ScrollView>
        </SafeAreaView>
        <Spinner
          visible={coachingStore.isLoading || mainStore.isLoading}
          textContent={'Memuat...'}
        // textStyle={styles.spinnerTextStyle}
        />
      </VStack>
    )
  },
)

export default FillFeedback;
