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
        <SafeAreaView style={Layout.flex}>
          <ScrollView>
            <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
            <VStack horizontal={Spacing[48]} style={{ alignItems: "center" }}>
              <Text type={"left-header"}>Add Idea</Text>
              <Spacer height={Spacing[24]} />
              <Spacer height={Spacing[24]} />
            </VStack>
          </ScrollView>
        </SafeAreaView>
      </VStack>
    )
  },
)

export default AddIdea
