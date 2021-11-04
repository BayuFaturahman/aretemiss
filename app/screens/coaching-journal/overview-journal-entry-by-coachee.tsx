import React, { FC, useCallback, useReducer, useState, useEffect } from "react"
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, Button, TextField, DropDownPicker, BackNavigation } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"

import Spinner from "react-native-loading-spinner-overlay"
import { Formik } from "formik"

const NewJournalEntry: FC<
  StackScreenProps<NavigatorParamList, "overviewJournalEntryByCoachee">
> = observer(({ navigation, route }) => {
  const { title, lessonLearned, commitment, content } = route.params

  console.log("overview journal by coache ")
  console.log('ROUTES PARAM ', route.params)

  // empty list state
  const [selectedActivities, setSelectedActivities] = useState<string>("")
  const [, forceUpdate] = useReducer((x) => x + 1, 0)

  const goBack = () => {
    navigation.goBack()
  }

  const holdActivitiesId = useCallback(
    (selectedId) => {
      setSelectedActivities(selectedId)
    },
    [selectedActivities],
  )

  return (
    <VStack
      testID="CoachingJournalMain"
      style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
    >
      <SafeAreaView style={Layout.flex}>
        <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
        <ScrollView>
          <Formik
            initialValues={{
              content: content,
              commitment: commitment,
              lessonLearned: lessonLearned,
              title: title,
            }}
            // validationSchema={JournalEntryTypeSchema}
            onSubmit={(values) => {
              console.log(values)
            }}
            // validate={validate}
          >
            {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
              <>
                <VStack top={Spacing[32]} horizontal={Spacing[24]}>
                  <HStack>
                    <Text type={"left-header"} style={{}} text="Overview journal entry" />
                    <Spacer />
                  </HStack>

                  <VStack>
                    <TextField
                      value={values.title}
                      // onChangeText={setTitle}
                      isRequired={false}
                      editable={false}
                      inputStyle={{
                        backgroundColor: Colors.MAIN_BLUE,
                        color: Colors.WHITE,
                        textAlign: "left",
                        paddingHorizontal: 10,
                        fontWeight: "bold",
                      }}
                      secureTextEntry={false}

                    />
                    <TextField
                      value={'Yang dicatat oleh coachee-mu:'}
                      isRequired={false}
                      editable={false}
                      inputStyle={{
                        backgroundColor: Colors.MAIN_BLUE,
                        color: Colors.WHITE,
                        fontSize: Spacing[14],
                        fontWeight:"400",
                        minHeight: Spacing[12],
                        paddingHorizontal: Spacing[12],
                        paddingVertical: Spacing[2]
                      }}
                      style={{width:'auto',  justifyContent: "center", alignItems: "center",}}
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
                        value={values.content}
                        secureTextEntry={false}
                        isTextArea={true}
                      />
                    </VStack>

                    <VStack top={Spacing[12]}>
                      <Text type={"body-bold"} style={{ textAlign: "center", top: Spacing[4] }}>
                        {`Tulislah`}
                        <Text type={"body-bold"} style={{ color: Colors.BRIGHT_BLUE }}>
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
                        value={values.lessonLearned}
                      />
                    </VStack>

                    <VStack top={Spacing[12]}>
                      <Text type={"body-bold"} style={{ textAlign: "center", top: Spacing[4] }}>
                        <Text type={"body-bold"} style={{ color: Colors.BRIGHT_BLUE }}>
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
                        value={values.commitment}
                      />
                    </VStack>
                  </VStack>
                </VStack>

                <VStack horizontal={Spacing[72]} vertical={Spacing[24]}>
                  {/* <Spacer height={Spacing[24]} /> */}

                  <Button
                    type={"primary"}
                    text={"Kembali"}
                    onPress={goBack}
                  />
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
