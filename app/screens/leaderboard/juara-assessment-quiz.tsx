import React, {FC, useCallback, useEffect, useRef, useState} from "react"
import {Animated, FlatList, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import { Colors, Layout, Spacing } from "@styles"

import { BackNavigation, Button, Text } from "@components"
import Spacer from "@components/spacer"

import { EmptyList } from "@screens/coaching-journal/components/empty-list"
import {dimensions} from "@config/platform.config";

export type QuizQuestionItem = {
  id: string
  question: string
  answers: string[]
  choice: 0 | 1 | 2 | 3 | 4
}

const EXAMPLE_DATA: Array<QuizQuestionItem> = [
  {
    id: "0",
    question: "Sebagai seorang leader, jika ada anggota tim yang mengalami kesulitan untuk menyelesaikan tugasnya, apa yang sebaiknya dilakukan?",
    choice: 0,
    answers: ['a', 'b', 'c', 'd']
  },
  {
    id: "1",
    question: "Sebagai seorang leader, jika ada anggota tim yang mengalami kesulitan untuk menyelesaikan tugasnya, apa yang sebaiknya dilakukan?",
    choice: 0,
    answers: ['a', 'b', 'c', 'd']
  },
  {
    id: "2",
    question: "Sebagai seorang leader, jika ada anggota tim yang mengalami kesulitan untuk menyelesaikan tugasnya, apa yang sebaiknya dilakukan?",
    choice: 0,
    answers: ['a', 'b', 'c', 'd']
  },
  {
    id: "3",
    question: "Sebagai seorang leader, jika ada anggota tim yang mengalami kesulitan untuk menyelesaikan tugasnya, apa yang sebaiknya dilakukan?",
    choice: 0,
    answers: ['a', 'b', 'c', 'd']
  },
]

const JuaraAssesmentQuiz: FC<StackScreenProps<NavigatorParamList, "juaraAssesmentQuiz">> = observer(
  ({ navigation }) => {
    const goBack = () => navigation.goBack()

    // const scrollRef:React.MutableRefObject<ScrollView> = useRef(null)
    const [scrollRef, setScrollRef] = useState(null)
    const currentScrollPos:number = useRef(0)

    const [questions, setQuestions] = useState<Array<QuizQuestionItem>>(EXAMPLE_DATA)
    const [activeQuestion, setActiveQuestion] = useState<string>("1")
    const [currentScroll, setCurrentScroll] = useState<number>(0)

    const scrollNext = useCallback(()=>{
      scrollRef.current.scrollTo({
        y: currentScroll + 1,
        animated: true
      })
      console.log(currentScroll)
    },[currentScroll, scrollRef])

    // const selectFeedbackItem = useCallback(
    //   (id, choice) => {
    //     const updated = feedbackData.map((item) => {
    //       if (item.id === id) {
    //         return { ...item, choice: choice }
    //       }
    //       return item
    //     })
    //
    //     setFeedbackData(updated)
    //   },
    //   [feedbackData],
    // )

    useEffect(()=>{
      console.log(currentScroll)
    },[currentScroll])
    
    const AnswerItemComponent = ({answer, index, selectedIndex}: {answer: string, index: number, selectedIndex: number}) => {
      const isSelected:boolean = selectedIndex === index

      const styles = StyleSheet.create({
        bullet: {backgroundColor: isSelected ? Colors.ABM_YELLOW : Colors.WHITE, borderColor: isSelected ? Colors.ABM_YELLOW : Colors.ABM_MAIN_BLUE, borderRadius: Spacing[32], borderWidth: Spacing[2], height: Spacing[16], width: Spacing[16]},
        container: {backgroundColor: isSelected ? Colors.ABM_LIGHT_BLUE : Colors.WHITE, borderColor: Colors.ABM_LIGHT_BLUE, borderRadius: Spacing[32], borderWidth: Spacing[2]},
        text: { color: isSelected ? Colors.WHITE : Colors.ABM_MAIN_BLUE, fontSize: Spacing[14], textAlign: "center" }
      });
      
      return(
        <TouchableOpacity>
          <HStack vertical={Spacing[4]} horizontal={Spacing[12]} style={styles.container}>
            <View style={styles.bullet} />
            <Spacer width={Spacing[4]} />
            <Text
              type={"body-bold"}
              style={styles.text}
            >
              {answer}
            </Text>
          </HStack>
          <Spacer height={Spacing[8]} />
        </TouchableOpacity>
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
          <ScrollView
            onScroll={Animated.event(
              [],
              {useNativeDriver: false, listener: (event) => setCurrentScroll(event.nativeEvent.contentOffset.x)})}
            ref={setScrollRef}
                      horizontal
                      snapToInterval={dimensions.screenWidth}
                      decelerationRate={"fast"}
                      showsHorizontalScrollIndicator={false}
                      // onScrollEndDrag={(event)=>{
                      //   currentScrollPos = event.nativeEvent.contentOffset.y
                      //   setCurrentScroll(event.nativeEvent.contentOffset.y)
                      // }}
          >
            {questions.map((value)=>
              <VStack key={`q-${value.id}`} style={{ width: dimensions.screenWidth}}>
              <VStack top={Spacing[8]} horizontal={Spacing[32]} bottom={Spacing[12]}>
                <Text
                  type={"body-bold"}
                  style={{ color: Colors.ABM_MAIN_BLUE, textAlign: "center", fontSize: Spacing[12] }}
                >
                  {value.question}
                </Text>
                <Spacer height={Spacing[32]} />
              </VStack>
              <VStack
                top={Spacing[32]}
                horizontal={Spacing[24]}
              >
                {value.answers.map((answer, answerIndex)=> {
                  return(
                    <AnswerItemComponent key={`${value.id}-${answer}`} answer={answer} index={answerIndex} selectedIndex={1} />
                  )
                })}
                <Spacer height={Spacing[32]} />
              </VStack>
            </VStack>)}
          </ScrollView>
          {/* <Button */}
          {/*  key={`n-${currentScroll}`} */}
          {/*  type={'primary'} */}
          {/*  text={'Next'} */}
          {/*  onPress={()=>{ */}
          {/*    scrollRef.scrollTo({ */}
          {/*      y: currentScroll + 1, */}
          {/*      animated: true */}
          {/*    }) */}
          {/*    console.log(currentScroll) */}
          {/*  }} */}
          {/*  style={{paddingHorizontal: Spacing[24]}} */}
          {/* /> */}
        </SafeAreaView>
      </VStack>
    )
  },
)

export default JuaraAssesmentQuiz
