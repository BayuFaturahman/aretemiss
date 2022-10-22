import React, {FC, useState} from "react"
import {SafeAreaView, ScrollView, StyleSheet} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { NavigatorParamList } from "@navigators/main-navigator"
import {HStack, VStack} from "@components/view-stack"
import { Colors, Layout, Spacing } from "@styles"

import { BackNavigation, Button, Text } from "@components"
import Spacer from "@components/spacer"

import {Woman1} from "@assets/svgs";
import RNAnimated from "react-native-animated-component";

const JuaraQuizResult: FC<StackScreenProps<NavigatorParamList, "juaraQuizResult">> = observer(
  ({ navigation, route }) => {

    const { score, totalQuestions } = route.params


    const goBack = () => navigation.goBack()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    const startQuiz = () => navigation.navigate("juaraAssesmentQuiz")

    return (
      <VStack
        testID="Assesment"
        style={styles.bg}
      >
        <SafeAreaView style={Layout.flex}>
          <ScrollView>
            <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
            <Spacer height={Spacing[12]} />
            <VStack horizontal={Spacing[24]}>
              <HStack style={Layout.widthFull}>
                <Text type={"left-header"}>JUARA Quiz</Text>
              </HStack>
              <Spacer height={Spacing[12]} />
            </VStack>

            <RNAnimated
              appearFrom={'bottom'}
              animationDuration={1250}
            >
              <VStack horizontal={Spacing[24]} style={Layout.flexCenterMid}>
                <Woman1 height={Spacing[256]} width={Spacing[256]}/>
              </VStack>
            </RNAnimated>
            <RNAnimated
              appearFrom={'bottom'}
              animationDuration={500}
              style={{zIndex: -1}}
            >
              <VStack top={Spacing[32]} horizontal={Spacing[24]} style={styles.bgBottom}>
                <Button type={'primary'} text={'Selamat!'} style={{backgroundColor: Colors.ABM_YELLOW}} textStyle={{color: Colors.ABM_MAIN_BLUE}} disabled />
                <VStack vertical={Spacing[16]} horizontal={Spacing["64"]}>
                  <Text style={{textAlign: 'center'}} type={"body-bold"}>Inilah perolehan nilai quiz JUARA ini!</Text>
                  <Text style={{textAlign: 'center',fontSize: Spacing[72], color: Colors.ABM_GREEN}} type={"body-bold"}>9</Text>
                  <Text style={{textAlign: 'center'}} type={"body-bold"}>dari 10 pertanyaan.</Text>
                </VStack>
                <Button type={'light-blue'} text={'Oke'} onPress={navigation.goBack}/>
              </VStack>
            </RNAnimated>
          </ScrollView>
        </SafeAreaView>
      </VStack>
    )
  },
)

export default JuaraQuizResult

const styles = StyleSheet.create({
  bg: {
    backgroundColor: Colors.ABM_BG_BLUE, flex: 1, justifyContent: "center"
  },
  bgBottom: {backgroundColor: Colors.WHITE, borderRadius: Spacing[48], marginHorizontal: Spacing[24], minHeight: Spacing[320], top: -Spacing[32]}
});