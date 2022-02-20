import React, { FC } from "react"
import { SafeAreaView, ScrollView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { NavigatorParamList } from "@navigators/main-navigator"
import { VStack } from "@components/view-stack"
import { Colors, Layout, Spacing } from "@styles"

import { BackNavigation, Button, DropDownPicker, K_OPTIONS, Text } from "@components"
import Spacer from "@components/spacer"

import { IOption } from "react-native-modal-selector"

export type AssessmentQuizItem = {
  id: string
  question: string
  answers: string[]
}

const JuaraAssesment: FC<StackScreenProps<NavigatorParamList, "guidePoints">> = observer(
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
        <SafeAreaView style={Layout.flex}>
          <ScrollView>
            <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
            <VStack horizontal={Spacing[48]} style={{ alignItems: "center" }}>
              <Text type={"left-header"}>JUARA Assessment</Text>
              <Spacer height={Spacing[24]} />
              <Text type={"body"} style={{ textAlign: "center" }}>
                Apakah kamu JUARA-nya? Yuk, ajak rekan kerjamu untuk mengisi assessment untukmu!
                Jangan lupa isi assessment untuk rekan kerjamu yang lain juga ya! Setiap bulan nilai
                assessment-mu akan di-reset.
              </Text>
              <Spacer height={Spacing[24]} />
              <FinishedComponent score={"4.5"} total={6} />
            </VStack>
            <VStack horizontal={Spacing[24]}>
              <DropDownPicker
                items={K_OPTIONS}
                // isRequired={true}
                // label="Pilih team:"
                onValueChange={(value: IOption) => console.log("team1Id", value.id)}
                placeholder={"Pilih rekan kerja yang akan kamu nilai"}
                containerStyle={{ marginTop: Spacing[4] }}
                zIndex={3000}
                zIndexInverse={1000}
                dropDownDirection={"BOTTOM"}
                isRemovable={false}
                // initialValue={team1Data}
              />
              <Spacer height={Spacing[24]} />
              <VStack bottom={Spacing[128]} horizontal={Spacing[48]}>
                <Button
                  type={"primary"}
                  text={"Mulai Assesment"}
                  style={{ paddingHorizontal: Spacing[12] }}
                  onPress={startQuiz}
                />
              </VStack>
            </VStack>
          </ScrollView>
        </SafeAreaView>
      </VStack>
    )
  },
)

export default JuaraAssesment
