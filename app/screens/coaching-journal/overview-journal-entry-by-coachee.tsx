import React, { FC, useReducer, useState, useEffect, useCallback } from "react"
import { SafeAreaView, ScrollView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, Button, TextField, BackNavigation } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"

import Spinner from "react-native-loading-spinner-overlay"
import { Formik } from "formik"

type CoacheeListItem = {
  id: string
  name: string
}

const LIST_COACHEE: CoacheeListItem[] = [
  {
    id: "0",
    name: "Agus Surya Pradana",
  },
  {
    id: "1",
    name: "Indrawan Kresna",
  },
  {
    id: "2",
    name: "Indrawan Kresna",
  },
  {
    id: "3",
    name: "Indrawan Kresna",
  },
]

const NewJournalEntry: FC<StackScreenProps<NavigatorParamList, "overviewJournalEntryByCoachee">> =
  observer(({ navigation, route }) => {
    const { title, lessonsLearned, commitments, contents, learnersFullname } = route.params

    console.log("overview journal by coache ", route.params)
    // console.log(' lessonLearned', lessonsLearned)
    // // console.log(' lessonLearned', lessonsLearned)

    // empty list state
    const [selectedActivities, setSelectedActivities] = useState<string>("")
    const [, forceUpdate] = useReducer((x) => x + 1, 0)

    const [listCoachee, setListCoachee] = useState<CoacheeListItem[]>([])
    const [activeCoacheeId, setActiveCoacheeId] = useState<string>("")

    const [lessonLearned, setLessonLearned] = useState<string>()
    const [content, setContent] = useState<string>()
    const [commitment, setCommitment] = useState<string>()
    const [learnerFullname, setLearnerFullName] = useState<string>()


    const formInitialValue = {
      content: '',
      commitment: '',
      lessonLearned: '',
      title: title,
    }

    const goBack = () => {
      navigation.goBack()
    }

    useEffect(() => {
      loadData()
      // setListCoachee(LIST_COACHEE)
    }, [])

    const loadData = () => {
      const coacheeTemp: CoacheeListItem[] = learnersFullname.map((value, index) => {
        return {id: index.toString(), name: value}
      }) 
      setListCoachee(coacheeTemp)
    }

    useEffect(()=> {
      setActiveCoachee('0')    
    }, [lessonsLearned,commitments, contents])

    useEffect (() => {
      formInitialValue.lessonLearned= lessonsLearned[activeCoacheeId]? lessonsLearned[activeCoacheeId].desc : ''
      formInitialValue.commitment = commitments[activeCoacheeId]? commitments[activeCoacheeId].desc : ''
      formInitialValue.content = contents[activeCoacheeId]? contents[activeCoacheeId].desc : ''

      setLessonLearned(lessonsLearned[activeCoacheeId]? lessonsLearned[activeCoacheeId].desc : '')
      setCommitment(commitments[activeCoacheeId]? commitments[activeCoacheeId].desc : '')
      setContent(contents[activeCoacheeId]? contents[activeCoacheeId].desc : '')
      console.log('formInitialValue ', formInitialValue)
    }, [activeCoacheeId])

    const setActiveCoachee = (id) => {
      setActiveCoacheeId(id)
    }

    return (
      <VStack
        testID="CoachingJournalMain"
        style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
      >
        <SafeAreaView style={Layout.flex}>
          <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
          <ScrollView horizontal={true}>
            <HStack>
              <VStack left={Spacing[24]} />
              {listCoachee.map((item) => {
                return (
                  <VStack key={item.id} right={Spacing[12]}>
                    <Button
                      type={activeCoacheeId === item.id ? "primary-dark" : "negative"}
                      text={item.name}
                      onPress={() => {
                        setActiveCoachee(item.id)
                      }}
                      style={{ paddingHorizontal: Spacing[20] }}
                    />
                  </VStack>
                )
              })}
            </HStack>
          </ScrollView>
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
                        value={values.title}
                        // onChangeText={setTitle}
                        isRequired={false}
                        editable={false}
                        inputStyle={{
                          backgroundColor: Colors.ABM_MAIN_BLUE,
                          color: Colors.WHITE,
                          textAlign: "left",
                          paddingHorizontal: 10,
                          fontWeight: "bold",
                          borderColor: Colors.ABM_MAIN_BLUE,
                        }}
                        secureTextEntry={false}
                      />
                      <TextField
                        value={"Yang dicatat oleh coachee-mu:"}
                        isRequired={false}
                        editable={false}
                        inputStyle={{
                          backgroundColor: Colors.ABM_MAIN_BLUE,
                          color: Colors.WHITE,
                          fontSize: Spacing[14],
                          fontWeight: "400",
                          minHeight: Spacing[12],
                          paddingHorizontal: Spacing[12],
                          paddingVertical: Spacing[2],
                          borderColor: Colors.ABM_MAIN_BLUE,
                        }}
                        style={{ width: "auto", justifyContent: "center", alignItems: "center" }}
                        secureTextEntry={false}
                      />
                      <VStack top={Spacing[12]}>
                        <Text type={"body-bold"} style={{ textAlign: "center", top: Spacing[4] }}>
                          {`Apa yang dibicarakan saat coaching?`}
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
                    </VStack>
                  </VStack>

                  <VStack horizontal={Spacing[72]} vertical={Spacing[24]}>
                    {/* <Spacer height={Spacing[24]} /> */}

                    <Button type={"primary"} text={"Kembali"} onPress={goBack} />
                  </VStack>
                </>
              )}
            </Formik>
          </ScrollView>
        </SafeAreaView>
      </VStack>
    )
  })

export default NewJournalEntry
