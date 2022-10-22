import React, {FC, useState} from "react"
import {SafeAreaView, ScrollView, StyleSheet} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { NavigatorParamList } from "@navigators/main-navigator"
import {HStack, VStack} from "@components/view-stack"
import { Colors, Layout, Spacing } from "@styles"

import { BackNavigation, Button, Text } from "@components"
import Spacer from "@components/spacer"

import RNAnimated from "react-native-animated-component";
import {dimensions} from "@config/platform.config";
import {IconQuiz1, IconQuiz2, IconQuiz3} from "@assets/svgs";

export type JuaraQuizIconComponentType = {
  iconType: string
}

export const JuaraQuizIconComponent:React.FC<JuaraQuizIconComponentType> = ({iconType = '1'}) => {
  if(iconType === '1'){
    return <IconQuiz1 height={Spacing["48"]} width={Spacing["48"]} />
  } else if (iconType === '2'){
    return <IconQuiz2 height={Spacing["48"]} width={Spacing["48"]} />
  } else {
    return <IconQuiz3 height={Spacing["48"]} width={Spacing["48"]} />
  }
}

export type JuaraQuizListItem = {
  id: string
  title: string
  date: string
  icon: string
  isDone: boolean
  score: number
}

const MOCK_QUIZ_ITEMS:JuaraQuizListItem[] = [
  {
    id: '1',
    title: 'How well do you know JUARA?',
    date: '20 September 2022',
    icon: '1',
    isDone: false,
    score: 0
  },
  {
    id: '2',
    title: 'How well do you know JUARA?',
    date: '20 September 2022',
    icon: '2',
    isDone: true,
    score: 9
  },
  {
    id: '3',
    title: 'How well do you know JUARA?',
    date: '20 September 2022',
    icon: '3',
    isDone: true,
    score: 9
  }
]

export type JuaraQuizItemType = {
  item: JuaraQuizListItem
}

const JuaraQuizMain: FC<StackScreenProps<NavigatorParamList, "juaraQuizMain">> = observer(
  ({ navigation }) => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [quizList, setQuizList] = useState<JuaraQuizListItem[]>(MOCK_QUIZ_ITEMS)

    const goBack = () => navigation.goBack()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    const startQuiz = () => navigation.navigate("juaraAssesmentQuiz")

    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    const quizDone = (score = 9, totalQuestions = 10) => navigation.navigate("juaraQuizResult",{
      score,
      totalQuestions
    })

    const JuaraQuizItem:React.FC<JuaraQuizItemType> = ({item}) => {

      const componentStyles = StyleSheet.create({
        bg: {
          backgroundColor: item.isDone ? Colors.ABM_BG_BLUE : Colors.WHITE,
          borderColor: Colors.ABM_LIGHT_BLUE,
          borderRadius:Spacing[24], 
          borderWidth: Spacing[2],
          flex: 1,
          flexDirection: 'row',
          padding: Spacing[8]
        },
      });

      return (
        <VStack style={componentStyles.bg}>
          <VStack horizontal={Spacing[8]} style={Layout.flexRowCenter}>
            <JuaraQuizIconComponent iconType={item.icon} />
          </VStack>
          <VStack>
            <Text type={"body-bold"} style={{ color: Colors.ABM_LIGHT_BLUE }}>
              {`${item.title}`}
            </Text>
            <Text type={"body-bold"}>
              {`${item.date}`}
            </Text>
             <Button
              type={"primary"}
              text={item.isDone ? `Skor: ${item.score}/10!`: 'Isi quiz'}
              style={{backgroundColor: item.isDone ? Colors.ABM_YELLOW : Colors.ABM_GREEN, width: Spacing[96], paddingVertical: Spacing[2] }}
              textStyle={{color: item.isDone ? Colors.ABM_DARK_BLUE : Colors.WHITE}}
              onPress={ ()=> {
                item.isDone ? quizDone(item.score, 10) : startQuiz()
              } }
              // onPress={goToMyAccount}
             />
          </VStack>
        </VStack>
      )
    }

    return (
      <VStack
        testID="Assesment"
        style={styles.bg}
      >
        <SafeAreaView style={Layout.flex}>
          <ScrollView>
            <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
            <VStack horizontal={Spacing[24]}>
              <HStack style={Layout.widthFull}>
                <Text type={"left-header"}>JUARA Quiz</Text>
              </HStack>
              <Spacer height={Spacing[24]} />
              <Text type={"body-bold"}
                // eslint-disable-next-line react-native/no-inline-styles
                    style={{ textAlign: "center" }}>
                Yuk ikuti quiz-quiz JUARA! Buktikan seberapa JUARA-nya kamu! Skor dari quiz akan diakumulasikan ke poin
                <Text type={"body-bold"} style={{ color: Colors.ABM_GREEN }}>
                  {` Leaderboard `}
                </Text>
                kamu.
              </Text>
              <Spacer height={Spacing[24]} />
            </VStack>

            <VStack top={Spacing[32]} horizontal={Spacing[24]} style={[Layout.heightFull, styles.bgBottom, Layout.widthFull]}>
              <VStack top={Spacing[32]}>
                {quizList.map((item, index)=>
                  <RNAnimated
                    appearFrom={'top'}
                    animationDuration={index * 1000}
                    key={`quiz-item-${item.id}`}
                  >
                    <VStack bottom={Spacing[12]}>
                      <JuaraQuizItem item={item}/>
                    </VStack>
                  </RNAnimated>
                   )}
              </VStack>
            </VStack>
          </ScrollView>
        </SafeAreaView>
      </VStack>
    )
  },
)

export default JuaraQuizMain

const styles = StyleSheet.create({
  bg: {
    backgroundColor: Colors.ABM_BG_BLUE, flex: 1, justifyContent: "center"
  },
  bgBottom: {backgroundColor: Colors.WHITE, borderTopEndRadius: Spacing[48], borderTopStartRadius: Spacing[48], minHeight: dimensions.screenHeight}
});