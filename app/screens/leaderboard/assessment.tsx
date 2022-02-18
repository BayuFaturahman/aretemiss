import React, { FC, useReducer, useState } from "react"
import { SafeAreaView, ScrollView, TouchableOpacity } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import { Colors, Layout, Spacing } from "@styles"

import { Button, Text } from "@components"
import Spacer from "@components/spacer"

import { ProgressBar } from "react-native-paper"
import layout from "@styles/Layout"
import { dimensions } from "@config/platform.config"

export type AssessmentQuizItem = {
  id: string
  question: string
  answers: string[]
}

export const EXAMPLE_QS_LIST: AssessmentQuizItem[] = [
  {
    id: "1",
    question:
      "Sebagai seorang leader, jika ada anggota tim yang mengalami kesulitan untuk menyelesaikan tugasnya, apa yang sebaiknya dilakukan?",
    answers: [
      "Menasihatinya.",
      "Memberikan semangat dan menraktir kopi.",
      "Melakukan kegiatan coaching.",
      "Mengganti anggota dengan karyawan baru.",
    ],
  },
  {
    id: "2",
    question:
      "Sebagai seorang leader, jika merasakan demotivasi terhadap kewajiban yang sudah diberikan, apa yang sebaiknya dilakukan?",
    answers: [
      "Healing ke Bali.",
      "Berdoa dan berserah diri.",
      "Melakukan konsultasi dengan sesama karyawan.",
      "Melakukan kegiatan lain sampai demotivasi hilang.",
    ],
  },
  {
    id: "3",
    question:
      "Sebagai seorang leader, jika ada anggota tim yang mengalami kesulitan untuk menyelesaikan tugasnya, apa yang sebaiknya dilakukan?",
    answers: [
      "Menasihatinya.",
      "Memberikan semangat dan menraktir kopi.",
      "Melakukan kegiatan coaching.",
      "Mengganti anggota dengan karyawan baru.",
    ],
  },
  {
    id: "4",
    question: "Sebagai seorang leader, last question!",
    answers: [
      "Ngehe.",
      "Memberikan semangat dan menraktir kopi.",
      "Melakukan kegiatan coaching.",
      "Mengganti anggota dengan karyawan baru.",
    ],
  },
]

const Assesment: FC<StackScreenProps<NavigatorParamList, "guidePoints">> = observer(
  ({ navigation }) => {
    const [questions, setQuestions] = useState<AssessmentQuizItem[]>(EXAMPLE_QS_LIST)
    const [activeQs, setActiveQs] = useState<number>(0)

    const [answerList, setAnswerList] = useState<number[]>([])
    const [isDone, setIsDone] = useState<boolean>(false)
    const [key, forceUpdate] = useReducer((x) => x + 1, 0)

    const goBack = () => navigation.goBack()

    const quizDone = () => setIsDone(true)

    const nextQs = () => {
      if (activeQs < questions.length - 1) setActiveQs(activeQs + 1)
      else quizDone()
      forceUpdate()
    }
    const prevQs = () => {
      if (activeQs > 0) setActiveQs(activeQs - 1)
      forceUpdate()
    }

    const answerQuestion = (index: number, answer: number) => {
      const updatedValue = [...answerList]
      updatedValue[index] = answer
      setAnswerList(updatedValue)
      console.log(answerList)
    }

    const FinishedComponent = ({ score = 9, total = 10 }: { score: number; total: number }) => {
      return (
        <VStack horizontal={dimensions.screenWidth / 4} style={layout.heightFull}>
          <Spacer />
          <Button
            type={"warning"}
            text={"Selamat!"}
            disabled={true}
            style={{ paddingHorizontal: Spacing[8] }}
          />
          <Spacer height={Spacing[24]} />
          <Text style={{ textAlign: "center" }} type={"body"}>
            Inilah perolehan nilai assessment JUARA-mu bulan ini!
          </Text>
          <Text
            style={{ textAlign: "center", fontSize: Spacing[72], color: Colors.BRIGHT_BLUE }}
            type={"body-bold"}
          >
            {score}
          </Text>
          <Text style={{ textAlign: "center" }} type={"body"}>
            {`dari ${total} pertanyaan`}
          </Text>
          <Spacer height={Spacing[24]} />
          <VStack bottom={Spacing[128]} horizontal={Spacing[48]}>
            <Button type={"primary"} text={"Oke!"} style={{ paddingHorizontal: Spacing[12] }} />
          </VStack>
          <Spacer />
        </VStack>
      )
    }

    return (
      <VStack
        testID="Assesment"
        style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
      >
        <SafeAreaView style={Layout.flex}>
          <HStack horizontal={Spacing[24]} style={{ justifyContent: "space-between" }}>
            <Text type={"left-header"}>JUARA Assessment</Text>
            <Button type={"negative"} text={"Back"} onPress={goBack} />
          </HStack>
          {isDone ? (
            <FinishedComponent score={9} total={10} />
          ) : (
            <ScrollView key={key}>
              <Spacer height={Spacing[24]} />
              <VStack horizontal={Spacing[24]}>
                <Text style={{ textAlign: "center" }} type={"body-bold"}>
                  {questions[activeQs].question}
                </Text>
              </VStack>
              <Spacer height={Spacing[24]} />

              {questions[activeQs].answers.map((value, index) => {
                const styles = {
                  marginContainer: {
                    marginHorizontal: Spacing[24],
                    marginBottom: Spacing[12],
                  },
                  activeContainer: {
                    borderRadius: Spacing[24],
                    borderColor: Colors.UNDERTONE_BLUE,
                    borderWidth: Spacing[2],
                  },
                  activeContainerSelected: {
                    borderRadius: Spacing[24],
                    backgroundColor: Colors.UNDERTONE_BLUE,
                    borderColor: Colors.UNDERTONE_BLUE,
                    borderWidth: Spacing[2],
                  },
                  textSelected: {
                    color: Colors.WHITE,
                  },
                }

                return (
                  <TouchableOpacity
                    key={`answer-${value}-${index}`}
                    style={[
                      styles.marginContainer,
                      answerList[activeQs] === index
                        ? styles.activeContainerSelected
                        : styles.activeContainer,
                    ]}
                    onPress={() => answerQuestion(activeQs, index)}
                  >
                    <VStack vertical={Spacing[4]} horizontal={Spacing[12]}>
                      <Text
                        style={answerList[activeQs] === index ? styles.textSelected : null}
                        type={"body-bold"}
                      >
                        {value}
                      </Text>
                    </VStack>
                  </TouchableOpacity>
                )
              })}

              <HStack
                top={Spacing[24]}
                horizontal={Spacing[24]}
                style={{ justifyContent: "space-between" }}
              >
                <Button
                  type={activeQs === 0 ? "transparent" : "primary"}
                  text={"Previous"}
                  style={{ paddingHorizontal: Spacing[8] }}
                  onPress={prevQs}
                  disabled={activeQs === 0}
                />
                <Button
                  type={"primary"}
                  text={activeQs === questions.length - 1 ? "Submit" : "Next"}
                  style={{ paddingHorizontal: Spacing[8] }}
                  onPress={nextQs}
                />
              </HStack>
            </ScrollView>
          )}
          {/* <FinishedComponent score={9} total={10} /> */}
          <VStack vertical={Spacing[20]} horizontal={Spacing[24]}>
            <ProgressBar
              progress={(activeQs + 1) / questions.length}
              color={Colors.UNDERTONE_BLUE}
            />
          </VStack>
        </SafeAreaView>
      </VStack>
    )
  },
)

export default Assesment
