import React, {FC, useCallback, useEffect, useReducer, useRef, useState} from "react"
import {Alert, Animated, FlatList, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import { Colors, Layout, Spacing } from "@styles"

import { BackNavigation, Button, Text } from "@components"
import Spacer from "@components/spacer"

import { EmptyList } from "@screens/coaching-journal/components/empty-list"
import {dimensions} from "@config/platform.config";
import moment from "moment";
import {JuaraQuizListItem} from "@screens/leaderboard/juara-quiz-main";
import {useStores} from "../../bootstrap/context.boostrap";
import {QuizQuestionOptionsPair} from "@services/api/quiz/quiz-api.types";

export type QuizQuestionItem = {
  id: string
  question: string
  answers: QuizQuestionOptionsPair[]
}

const EXAMPLE_DATA: Array<QuizQuestionItem> = [
  {
    id: "0",
    question: "Sebagai seorang leader, jika ada anggota tim yang mengalami kesulitan untuk menyelesaikan tugasnya, apa yang sebaiknya dilakukan?",
    answers: [{id: '1', name: "Iya"}, {id: '1', name: "Iya"}]
  },
  {
    id: "1",
    question: "Sebagai seorang leader, jika ada anggota tim yang mengalami kesulitan untuk menyelesaikan tugasnya, apa yang sebaiknya dilakukan?",
    answers: [{id: '1', name: "Iya"}, {id: '1', name: "Iya"}]
  },
  {
    id: "2",
    question: "Sebagai seorang leader, jika ada anggota tim yang mengalami kesulitan untuk menyelesaikan tugasnya, apa yang sebaiknya dilakukan?",
    answers: [{id: '1', name: "Iya"}, {id: '1', name: "Iya"}]
  },
  {
    id: "3",
    question: "Sebagai seorang leader, jika ada anggota tim yang mengalami kesulitan untuk menyelesaikan tugasnya, apa yang sebaiknya dilakukan?",
    answers: [{id: '1', name: "Iya"}, {id: '1', name: "Iya"}]
  },
]

const JuaraAssesmentQuiz: FC<StackScreenProps<NavigatorParamList, "juaraAssesmentQuiz">> = observer(
  ({ navigation, route }) => {
    const goBack = () => navigation.goBack()

    const { id } = route.params

    const [questions, setQuestions] = useState<Array<QuizQuestionItem>>(EXAMPLE_DATA)
    const [activeQuestion, setActiveQuestion] = useState<string>("1")
    const [currentScroll, setCurrentScroll] = useState<number>(0)

    const [activeQs, setActiveQs] = useState<number>(0)

    const { quizApi } = useStores()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [answerList, setAnswerList] = useState<string[]>([])

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const goNext = () => {
      if(activeQs < questions.length - 1){
        setActiveQs(activeQs + 1)
      }
    }

    const goPrev = () => {
      if(activeQs > 0){
        setActiveQs(activeQs - 1)
      }
    }

    const loadQuizDetail = async () => {
      setIsLoading(true)
      await quizApi.getQuizDetail(id).then((r)=>{
        if(r.kind==="ok"){
          console.log(r.response)

          const questionsList:QuizQuestionItem[] = []

          r.response.questions.map((value)=>
            questionsList.push({
              id: value.id,
              answers: value.options,
              question: value.name
            })
          )

          const answerTemp = new Array(questionsList.length)

          setAnswerList(answerTemp)

          setQuestions(questionsList)
        }
      })
      setIsLoading(false)
    }

    useEffect(()=> {
      console.log("answerlist", answerList)
    },[answerList])

    const answerQs = (answer: string, index: number) => {
      setAnswerList(prevState => {
        const temp = prevState
        temp[index] = answer
        
        return(
          temp
        )
      })
      goNext()
      forceUpdate()
    }

    const quizDone = (score = 9, totalQuestions = 10) => navigation.navigate("juaraQuizResult",{
      score,
      totalQuestions
    })

    const createTwoButtonAlert = () =>
      Alert.alert(
        "Perhatian",
        "Anda belum mengisi semua jawaban quiz!",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );

    const postAnswer = async () => {
      setIsLoading(true)

      const isValid = answerList.findIndex((i)=> {
        return i === undefined
      })

      if(isValid === -1){
        await quizApi.postQuizAnswer(id, answerList).then(r => {
          if(r.kind === "ok"){
            quizDone(r.response.point, questions.length)
          }
        })
      }else{
        createTwoButtonAlert()
      }
      setIsLoading(false)
    }

    useEffect(()=>{
      loadQuizDetail()
    },[])
    
    const AnswerItemComponent = ({ answer, index, selectedIndex, answerQs, qIndex}: { answer: QuizQuestionOptionsPair, index: number, selectedIndex: number, answerQs(answer: string, index: number): void, qIndex: number}) => {
      const isSelected:boolean = selectedIndex === index

      const styles = StyleSheet.create({
        bullet: {backgroundColor: isSelected ? Colors.ABM_YELLOW : Colors.WHITE, borderColor: isSelected ? Colors.ABM_YELLOW : Colors.ABM_MAIN_BLUE, borderRadius: Spacing[32], borderWidth: Spacing[2], height: Spacing[16], width: Spacing[16]},
        container: {backgroundColor: isSelected ? Colors.ABM_LIGHT_BLUE : Colors.WHITE, borderColor: Colors.ABM_LIGHT_BLUE, borderRadius: Spacing[32], borderWidth: Spacing[2]},
        text: { color: isSelected ? Colors.WHITE : Colors.ABM_MAIN_BLUE, fontSize: Spacing[14], textAlign: "center" }
      });
      
      return(
        <TouchableOpacity onPress={()=> answerQs(answer.id, qIndex)}>
          <HStack vertical={Spacing[4]} horizontal={Spacing[12]} style={styles.container}>
            <View style={styles.bullet} />
            <Spacer width={Spacing[4]} />
            <Text
              type={"body-bold"}
              style={styles.text}
            >
              {answer.name}
            </Text>
          </HStack>
          <Spacer height={Spacing[8]} />
        </TouchableOpacity>
      )
    }

    const QuestionComponent = ({q}:{q: QuizQuestionItem}) => {
      return(
        <VStack key={`q-${q.id}`} style={{ width: dimensions.screenWidth}}>
          <VStack top={Spacing[8]} horizontal={Spacing[32]} bottom={Spacing[12]}>
            <Text
              type={"body-bold"}
              style={{ color: Colors.ABM_MAIN_BLUE, textAlign: "center", fontSize: Spacing[12] }}
            >
              {q.question}
            </Text>
            <Spacer height={Spacing[32]} />
          </VStack>
          <VStack
            top={Spacing[32]}
            horizontal={Spacing[24]}
          >
            {q.answers.map((answer, answerIndex)=> {
              return(
                <AnswerItemComponent key={`${q.id}-${answer}`} qIndex={activeQs} answer={answer} index={answerIndex} selectedIndex={q.answers.findIndex(value => value.id === answerList[activeQs])}  answerQs={answerQs}/>
              )
            })}
            <Spacer height={Spacing[32]} />
          </VStack>
        </VStack>
      )
    }

    return (
      <VStack
        testID="Assesment"
        style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
      >
        <SafeAreaView style={Layout.flex}>
          <BackNavigation color={Colors.ABM_MAIN_BLUE} goBack={goBack} />
          <HStack top={Spacing[12]} horizontal={Spacing[32]}>
            <Text type={"left-header"} style={{ color: Colors.ABM_MAIN_BLUE }} text="JUARA Assessment" />
            <Spacer />
            <Button
              type={'primary-dark'}
              text={'Back'}
              onPress={goBack}
              style={{paddingHorizontal: Spacing[24]}}
            />
          </HStack>
          <Spacer height={Spacing[24]} />
          <QuestionComponent q={questions[activeQs]} />
          <HStack top={Spacing[12]} horizontal={Spacing[32]}>
            { !(activeQs === 0) &&
              <Button
                type={'primary'}
                text={'Previous'}
                onPress={goPrev}
                style={{paddingHorizontal: Spacing[24]}}
            />}
            <Spacer />
            { !(activeQs === questions.length - 1) ?
              <Button
                type={'primary'}
                text={'Next'}
                onPress={goNext}
                style={{paddingHorizontal: Spacing[24]}}
              /> :
                <Button
                  type={'primary-dark'}
                  text={'Submit'}
                  onPress={postAnswer}
                  style={{paddingHorizontal: Spacing[24]}}
                />
            }
          </HStack>
        </SafeAreaView>
      </VStack>
    )
  },
)

export default JuaraAssesmentQuiz
