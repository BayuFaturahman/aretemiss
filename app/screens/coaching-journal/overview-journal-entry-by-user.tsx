import React, { FC, useReducer, useState, useEffect, useCallback } from "react"
import { SafeAreaView, ScrollView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, Button, TextField, BackNavigation } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"

import { Formik } from "formik"

type CoacheeListItem = {
  index: number
  name: string
}

const OverviewJournalEntryByUser: FC<StackScreenProps<NavigatorParamList, "overviewJournalEntryByUser">> =
  observer(({ navigation, route }) => {
    const { title, learnerJournals, coachJournal } = route.params

    console.log("overview journal by user", route.params)

    // empty list state

    const [listCoachee, setListCoachee] = useState<CoacheeListItem[]>([])
    const [activeCoacheeIndex, setActiveCoacheeIndex] = useState<number>(0)
    const [content, setContent] = useState<string>("")
    const [recommendation, setRecommendation] = useState<string>("")
    const [coachFullName, setCoachFullName] = useState<string>("")
    const [commitment, setCommitment] = useState<string>("")
    const [lessonLearned, setLessonLearned] = useState<string>("")
    const [learnerFullname, setLearnerFullname] = useState<string>("")

    const formInitialValue = coachJournal ? {
      content: '',
      recommendationForCoachee: '',
      title: title,
      coachFullName: ''
    } : {
      content: '',
      commitment: '',
      lessonLearned: '',
      title: title,
      learnerFullname: ''
    }

    const goBack = () => {
      navigation.goBack()
    }

    useEffect(() => {
      loadData()
    }, [])

    const loadData = () => {

      if (coachJournal) {
        formInitialValue.content = coachJournal.content
        formInitialValue.recommendationForCoachee = coachJournal.recommendation_for_coachee
        formInitialValue.coachFullName = coachJournal.coach_fullname

        setContent(coachJournal.content)
        setRecommendation(coachJournal.recommendation_for_coachee)
        setCoachFullName(coachJournal.coach_fullname)
      }

      if (learnerJournals) {
        const coacheeTemp: CoacheeListItem[] = learnerJournals.map((el, index) => {
          return {index: index, name: el.learner_fullname}
        }) 
        setListCoachee(coacheeTemp)
        setActiveCoachee(0)
      }
    }

    useEffect(()=> {
      setActiveCoachee(0)
    }, [learnerJournals])

    useEffect (() => {
      if (learnerJournals) {
        formInitialValue.lessonLearned = learnerJournals[activeCoacheeIndex].jl_lesson_learned ? learnerJournals[activeCoacheeIndex].jl_lesson_learned : ''
        formInitialValue.commitment = learnerJournals[activeCoacheeIndex].jl_commitment ? learnerJournals[activeCoacheeIndex].jl_commitment : ''
        formInitialValue.content = learnerJournals[activeCoacheeIndex].journal_content ? learnerJournals[activeCoacheeIndex].journal_content : ''
        formInitialValue.learnerFullname = learnerJournals[activeCoacheeIndex].learner_fullname ? learnerJournals[activeCoacheeIndex].learner_fullname : ''

        setLessonLearned(learnerJournals[activeCoacheeIndex].jl_lesson_learned ? learnerJournals[activeCoacheeIndex].jl_lesson_learned : '')
        setCommitment(learnerJournals[activeCoacheeIndex].jl_commitment ? learnerJournals[activeCoacheeIndex].jl_commitment : '')
        setContent(learnerJournals[activeCoacheeIndex].journal_content ? learnerJournals[activeCoacheeIndex].journal_content : '')
        setLearnerFullname(learnerJournals[activeCoacheeIndex].learner_fullname ? learnerJournals[activeCoacheeIndex].learner_fullname : '')
      }
    }, [activeCoacheeIndex])

    const setActiveCoachee = (index) => {
      setActiveCoacheeIndex(index)
    }

    return (
      <VStack
        testID="CoachingJournalMain"
        style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
      >
        <SafeAreaView style={Layout.flex}>
          <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
          {
            learnerJournals &&
            <ScrollView horizontal={true}>
            <HStack>
              <VStack left={Spacing[24]} />
              {listCoachee.map((item) => {
                return (
                  <VStack key={item.index} right={Spacing[12]}>
                    <Button
                      type={activeCoacheeIndex === item.index ? "primary-dark" : "negative"}
                      text={item.name}
                      onPress={() => {
                        setActiveCoachee(item.index)
                      }}
                      style={{ paddingHorizontal: Spacing[20] }}
                    />
                  </VStack>
                )
              })}
            </HStack>
          </ScrollView>
          }
          <ScrollView>
            <Formik
              initialValues={formInitialValue}
              onSubmit={(values) => {
                console.log(values)
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
                <>
                  <VStack top={Spacing[12]} horizontal={Spacing[24]}>
                    <HStack>
                      <Text type={"left-header"} style={{}} text="Coaching journal overview" />
                      <Spacer />
                    </HStack>
                    <VStack>
                      <TextField
                        value={title}
                        // onChangeText={setTitle}
                        isRequired={false}
                        editable={false}
                        inputStyle={{
                          backgroundColor: Colors.ABM_DARK_BLUE,
                          color: Colors.WHITE,
                          textAlign: "left",
                          paddingHorizontal: 10,
                          fontWeight: "bold",
                          borderColor: Colors.ABM_DARK_BLUE,
                          borderRadius: 10
                        }}
                        secureTextEntry={false}
                      />
                      <TextField
                        value={coachJournal ? ("Yang dicatat oleh " + coachFullName + ":") : ("Yang dicatat oleh " + learnerFullname + ":")}
                        isRequired={false}
                        editable={false}
                        inputStyle={{
                          backgroundColor: Colors.ABM_DARK_BLUE,
                          color: Colors.WHITE,
                          fontSize: Spacing[14],
                          fontWeight: "bold",
                          minHeight: Spacing[12],
                          paddingHorizontal: Spacing[12],
                          paddingVertical: Spacing[12],
                          borderColor: Colors.ABM_DARK_BLUE,
                          borderRadius: 10
                        }}
                        style={{ width: "auto", justifyContent: "center", alignItems: "center" }}
                        secureTextEntry={false}
                      />
                      <VStack top={Spacing[12]}>
                        <Text type={"body-bold"} style={{ textAlign: "center", top: Spacing[4] }}>
                          {`Apa yang `}
                            <Text type={"body-bold"} style={{ color: Colors.ABM_LIGHT_BLUE }}>
                              {"dibicarakan"}
                            </Text>
                          {` saat coaching?`}
                        </Text>
                        <TextField
                          style={{ paddingTop: 0 }}
                          inputStyle={{ minHeight: Spacing[48] }}
                          editable={false}
                          isRequired={false}
                          value={content}
                          secureTextEntry={false}
                          isTextArea={true}
                        />
                      </VStack>

                      {
                        coachJournal && 
                        <VStack top={Spacing[12]}>
                        <Text type={"body-bold"} style={{ textAlign: "center", top: Spacing[4] }}>
                          {`Dari sesi coaching, apa `}
                            <Text type={"body-bold"} style={{ color: Colors.ABM_LIGHT_BLUE }}>
                              {"rekomendasi coach untuk untuk coachee"}
                            </Text>
                          {``}
                        </Text>
                        <TextField
                          style={{ paddingTop: 0 }}
                          inputStyle={{ minHeight: Spacing[48] }}
                          editable={false}
                          isRequired={false}
                          value={recommendation}
                          secureTextEntry={false}
                          isTextArea={true}
                        />
                      </VStack>
                      }

                      {
                        learnerJournals &&
                        <>
                          <VStack top={Spacing[12]}>
                          <Text type={"body-bold"} style={{ textAlign: "center", top: Spacing[4] }}>
                            {`Tulislah`}
                            <Text type={"body-bold"} style={{ color: Colors.ABM_LIGHT_BLUE }}>
                              {'"lessons learned"'}
                            </Text>
                            {`-mu di coaching session ini. `}
                          </Text>
                          <TextField
                            style={{ paddingTop: 0 }}
                            inputStyle={{ minHeight: Spacing[48] }}
                            editable={false}
                            isRequired={false}
                            secureTextEntry={false}
                            isTextArea={true}
                            value={lessonLearned}
                          />
                        </VStack>

                        <VStack top={Spacing[12]}>
                          <Text type={"body-bold"} style={{ textAlign: "center", top: Spacing[4] }}>
                            <Text type={"body-bold"} style={{ color: Colors.ABM_LIGHT_BLUE }}>
                              {"Komitmen"}
                            </Text>
                            {` apa saja yang sudah disepakati bersama?`}
                          </Text>
                          <TextField
                            style={{ paddingTop: 0 }}
                            inputStyle={{ minHeight: Spacing[128] }}
                            isRequired={false}
                            secureTextEntry={false}
                            isTextArea={true}
                            editable={false}
                            value={commitment}
                          />
                        </VStack>
                        </>
                      }
                    </VStack>
                  </VStack>
                </>
              )}
            </Formik>
          </ScrollView>
        </SafeAreaView>
      </VStack>
    )
  })

export default OverviewJournalEntryByUser
