import React, {FC, useCallback, useReducer, useState} from "react"
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
import {dimensions} from "@config/platform.config";
import FastImage from "react-native-fast-image";
import logoBottom from "@assets/icons/ilead-bottom-logo.png";

type QuizChoiceType = {
  id: string
  answer: Array<string>
  choice: 0 | 1 | 2
}

const EXAMPLE_ASNWER:Array<QuizChoiceType> = [
  {
    id: '0',
    answer: [
      '“Menurut gue, mengambil risiko itu keharusan yang mudah.”',
      '“Segala sesuatu harus dilakukan secara tepat.”'
    ],
    choice: 0
  },
  {
    id: '1',
    answer: [
      '“Gue tuh orangnya gerak cepat. Semuanya harus gercep!”',
      '“Sebisa mungkin, gue akan menghindari konflik.”'
    ],
    choice: 0
  },
  {
    id: '2',
    answer: [
      '“Gue tuh orangnya gerak cepat. Semuanya harus gercep!”',
      '“Sebisa mungkin, gue akan menghindari konflik.”'
    ],
    choice: 0
  },
]

type QuisDataType = {
  question: string
  answer: Array<QuizChoiceType>
}

const EXAMPLE_DATA:QuisDataType = {
  question: 'Ketahui gaya kepemimpinanmu untuk mengatahui caranya menghadapi anggota team dengan lebih baik. Di dalam tes ini, tidak ada jawaban yang salah ataupun benar.',
  answer: EXAMPLE_ASNWER
}

const QuizForm: FC<StackScreenProps<NavigatorParamList, "quizForm">> = observer(
  ({ navigation }) => {

    // empty list state
    const [quizData, setQuizData] = useState<QuisDataType>(EXAMPLE_DATA);
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const [question, setQuestion] = useState<string>('Ketahui gaya kepemimpinanmu untuk mengatahui caranya menghadapi anggota team dengan lebih baik. Di dalam tes ini, tidak ada jawaban yang salah ataupun benar.');

    const goBack = () => navigation.goBack()

    const selectQuizItem = useCallback((id, choice)=>{

      const updated = quizData.answer.map((item)=>{
        if(item.id === id){
          return { ...item, choice: choice}
        }
        return item;
      })

      setQuizData((prevState)=>{
        prevState.answer = updated
        return {...prevState, ...updated}
      })
    }, [quizData])

    const renderQuizItem = () => {
      return(quizData.answer.map((item, index)=>{
          return(
            <VStack bottom={Spacing[48]} style={{width: dimensions.screenWidth}}>
              <HStack style={{justifyContent: 'space-around'}}>
                {item.answer.map((answerVal, answerIndex)=>{
                  return(
                    <TouchableOpacity
                      onPress={()=> selectQuizItem(item.id, answerIndex + 1)}
                      style={{backgroundColor: item.choice === answerIndex + 1 ? Colors.UNDERTONE_BLUE : Colors.BRIGHT_BLUE, height: Spacing[128], width: Spacing[128], justifyContent: 'center', borderRadius: Spacing[24]}}>
                      <Text type={'body-bold'} style={{textAlign: 'center', color: Colors.WHITE}}>
                        {answerVal}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </HStack>
            </VStack>
          )
        }))
    }

    return (
      <VStack testID="CoachingJournalMain" style={{backgroundColor: Colors.UNDERTONE_BLUE, flex: 1, justifyContent: 'center'}}>
        <SafeAreaView style={Layout.flex}>
          <BackNavigation goBack={goBack} />
          <VStack style={{flex:1}}>
            <VStack top={Spacing[8]} horizontal={Spacing[24]} bottom={Spacing[12]}>
              <Text type={'header'} style={{color: Colors.WHITE}} text="Apa leadership style kamu?" />
              <Spacer height={Spacing[24]} />
              <Text type={"header"} style={{color: Colors.WHITE, textAlign:'center', fontSize: Spacing[12]}}>{question}</Text>
              <Spacer height={Spacing[32]} />
            </VStack>
            <VStack horizontal={Spacing[48]} top={Spacing[48]} style={{backgroundColor: Colors.WHITE, borderTopStartRadius: Spacing[48], borderTopEndRadius: Spacing[48]}}>
              <Text type={'body'} style={{textAlign: 'center'}}>
                Pilihlah salah satu dari dua pilihan berikut yang menurutmu “Gue banget!”.
              </Text>
            </VStack>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              style={{backgroundColor: Colors.WHITE}}
              contentContainerStyle={{alignItems: 'center'}}
              decelerationRate={'fast'}
              snapToInterval={dimensions.screenWidth}
              horizontal={true}>
              {renderQuizItem()}
            </ScrollView>
          </VStack>
          <VStack style={{backgroundColor: Colors.WHITE}}>
            <FastImage style={{
              height: Spacing[96],
              marginLeft: Spacing[48],
              bottom: 0
            }} source={logoBottom} resizeMode={"contain"}/>
          </VStack>
        </SafeAreaView>
      </VStack>
    )
  },
)

export default QuizForm;
