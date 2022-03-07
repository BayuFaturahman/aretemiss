import React, { FC } from "react"
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

export type AssessmentQuizItem = {
  id: string
  question: string
  answers: string[]
}

const AddIdea: FC<StackScreenProps<NavigatorParamList, "guidePoints">> = observer(
  ({ navigation }) => {
    const goBack = () => navigation.goBack()

    const startQuiz = () => navigation.navigate("juaraAssesmentQuiz")

    const FinishedComponent = ({ score = 9, total = 10 }: { score: number; total: number }) => {
      return (
        <VStack>
          <Button
            type={"primary-dark"}
            text={"Nilai assessment-mu bulan ini:"}
            disabled={true}
            style={{ paddingHorizontal: Spacing[8] }}
          />
          <Spacer height={Spacing[24]} />
          <Text
            style={{ textAlign: "center", fontSize: Spacing[72], color: Colors.BRIGHT_BLUE }}
            type={"body-bold"}
          >
            {score}
          </Text>
          <Text style={{ textAlign: "center" }} type={"body"}>
            {`dari ${total}`}
          </Text>
          <Spacer height={Spacing[24]} />
          <Text style={{ textAlign: "center" }} type={"body"}>
            {`Ada ${total} rekan kerjamu  yang sudah menilai apakah kamu memang JUARA-nya.`}
          </Text>
          <Spacer height={Spacing[24]} />
          <Button type={"primary-dark"} text={"Beri assessment ke:"} disabled={true} />
          <Spacer height={Spacing[24]} />
        </VStack>
      )
    }

    return (
      <VStack
        testID="Assesment"
        style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
      >
        <Formik
        // initialValues={journalEntryForm}
        // validationSchema={JournalEntryTypeSchema}
        // onSubmit={onSubmit}
        // validate={validate}
        >
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
                          // value={values.title}
                          // onChangeText={handleChange("title")}
                          isRequired={false}
                          // editable={!coachingStore.isDetail}
                          // isError={isError === "title"}
                          secureTextEntry={false}
                          placeholder={"Tulis judul disini"}
                          charCounter={true}
                          maxChar={30}
                          inputStyle={{
                            backgroundColor: Colors.SOFT_PURPLE,
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
                          // editable={!coachingStore.isDetail}
                          // isError={isError === "title"}
                          secureTextEntry={false}
                          placeholder={"Tulis deskripsi disini"}
                          isTextArea
                          inputStyle={{ minHeight: Spacing[64] }}
                          charCounter={true}
                        />

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
                          {/* <DropDownPicker */}
                          {/*  items={K_OPTIONS} */}
                          {/*  // isRequired={true} */}
                          {/*  // label="Pilih team:" */}
                          {/*  onValueChange={(value: IOption) => null} */}
                          {/*  placeholder={"Pilih salah satu"} */}
                          {/*  containerStyle={{ marginTop: Spacing[4] }} */}
                          {/*  zIndex={3000} */}
                          {/*  zIndexInverse={1000} */}
                          {/*  dropDownDirection={"BOTTOM"} */}
                          {/* /> */}
                        </VStack>

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
