import React, { FC, useEffect, useState } from "react"
import { SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import { Colors, Layout, Spacing } from "@styles"

import {
  BackNavigation,
  Button,
  DropDownItem,
  DropDownPicker,
  K_OPTIONS,
  Text,
  TextField,
} from "@components"
import Spacer from "@components/spacer"

import { IOption } from "react-native-modal-selector"
import { dimensions } from "@config/platform.config"
import moment from "moment"
import { typography } from "@theme"
import { Formik } from "formik"
import { SOFT_PURPLE } from "@styles/Color"

export type ideaForm = {
  title: string
  description: string
}

const ideaInitialForm: ideaForm = {
  title: "",
  description: "",
}

const AddIdea: FC<StackScreenProps<NavigatorParamList, "addIdea">> = observer(
  ({ navigation, route }) => {
    const goBack = () => navigation.goBack()

    const { isView, byLeaders, isVote } = route.params
    const [titleBgColour, setTitleBgColour] = useState<string>(Colors.WHITE)
    const [isViewMode, setIsViewMode] = useState<boolean>(true)
    const [errorField, setErrorField] = useState<string>("")

    useEffect(() => {
      if (isView) {
        setIsViewMode(true)
        console.log("View Mode")
      } else {
        setIsViewMode(false)
        console.log("Start to Create new idea ")
      }
    }, [route.params, isViewMode])

    const onSubmit = (data: ideaForm) => {
      let isError = false
      if (data.title === "") {
        setErrorField("title")
        isError = true
      } else if (data.description === "") {
        setErrorField("title")
        isError = true
      }

      if (isError === true) {
        return
      }

      if (isView) {
        console.log("on submit is view")
      } else {
        console.log("on submit NOT IS view")
        handleSubmitNewIdea(data)
      }
    }

    const handleSubmitNewIdea = (data) => {
      console.log("handleSubmitNewIdea", data)
    }

    return (
      <VStack
        testID="Assesment"
        style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
      >
        <Formik initialValues={ideaInitialForm} onSubmit={onSubmit}>
          {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
            <>
              <SafeAreaView style={Layout.flex}>
                <ScrollView>
                  <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
                  <VStack horizontal={Spacing[24]}>
                    <HStack>
                      <Text type={"left-header"}>Tentang ide projek!</Text>
                      <Spacer />
                      <Button
                        type={"negative"}
                        text={"Edit"}
                        // onPress={onClickEditEntry}
                      />
                    </HStack>

                    <VStack>
                      <VStack top={Spacing[20]}>
                        <Text type={"body-bold"} style={{ color: Colors.BRIGHT_BLUE }}>
                          Judul
                          <Text type={"body-bold"} style={[]}>
                            {" idenya apa nih?"}
                          </Text>
                        </Text>
                        <TextField
                          value={values.title}
                          onChangeText={handleChange("title")}
                          isRequired={false}
                          editable={true}
                          isError={false}
                          secureTextEntry={false}
                          placeholder={"Tulis judul disini"}
                          charCounter={true}
                          maxChar={30}
                          inputStyle={{
                            backgroundColor: titleBgColour,
                          }}
                        />

                        <Text type={"body-bold"} style={[]}>
                          Tulislah
                          <Text type={"body-bold"} style={{ color: Colors.BRIGHT_BLUE }}>
                            {" deskripsi "}
                          </Text>
                          idemu.
                        </Text>
                        <TextField
                          isRequired={false}
                          editable={true}
                          isError={false}
                          secureTextEntry={false}
                          placeholder={"Tulis deskripsi disini"}
                          isTextArea={true}
                          inputStyle={{ minHeight: Spacing[64] }}
                          charCounter={true}
                          value={values.description}
                          onChangeText={handleChange("description")}
                        />

                        {isViewMode && (
                          <VStack>
                            <VStack
                            // style={{bottom: -Spacing[24]}}
                            >
                              <Text type={"body-bold"} style={{ color: Colors.BRIGHT_BLUE }}>
                                Ide
                                <Text type={"body-bold"} style={[]}>
                                  {" dicetuskan oleh"}
                                </Text>
                              </Text>
                            </VStack>
                            <TextField
                              // value={values.title}
                              // onChangeText={handleChange("title")}
                              isRequired={false}
                              // editable={!coachingStore.isDetail}
                              // isError={isError === "title"}
                              secureTextEntry={false}
                            />
                          </VStack>
                        )}
                        <VStack horizontal={Spacing[72]} top={Spacing[24]}>
                          <Button type={"primary"} text={"Submit"} onPress={handleSubmit} />
                        </VStack>
                        <HStack>
                          <Button
                            type={"primary"}
                            text={"Vote"}
                            onPress={handleSubmit}
                            style={{ width: Spacing[64] }}
                          />
                          <Spacer />
                          <Text type={"body-bold"} style={[]}>
                            Ide sudah di-vote 7 kali.
                          </Text>
                        </HStack>
                      </VStack>
                    </VStack>

                    <Spacer height={Spacing[24]} />
                    <Spacer height={Spacing[24]} />
                  </VStack>
                </ScrollView>
              </SafeAreaView>
            </>
          )}
        </Formik>
      </VStack>
    )
  },
)

export default AddIdea
