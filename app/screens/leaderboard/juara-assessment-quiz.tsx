import React, { FC, useCallback, useState } from "react"
import { FlatList, SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import { Colors, Layout, Spacing } from "@styles"

import { BackNavigation, Button, Text } from "@components"
import Spacer from "@components/spacer"

import { EmptyList } from "@screens/coaching-journal/components/empty-list"

export type ChoiceItemTypeAssesment = {
  id: string
  title: string
  choice: 0 | 1 | 2 | 3 | 4 | 5 | 6
  section?: string
}

const EXAMPLE_DATA: Array<ChoiceItemTypeAssesment> = [
  {
    id: "0",
    title: "berhasil memotivasi diri dan orang lain untuk mencapai hasil terbaik.",
    choice: 0,
    section: "Performance Focused",
  },
  {
    id: "1",
    title: "senantiasa mengembangkan kemampuan diri.",
    choice: 0,
  },
  {
    id: "2",
    title: "proaktif memberikan penghargaan atas pencapaian kinerja.",
    choice: 0,
  },
  {
    id: "3",
    title: "banyak mengapresiasi pendapat dan hasil kerja orang lain.",
    choice: 0,
    section: "Synergy",
  },
  {
    id: "4",
    title: "menghargai keberagaman.",
    choice: 0,
  },
  {
    id: "5",
    title: "mendukung antar semua pihak.",
    choice: 0,
  },
  {
    id: "6",
    title: "berhasil menyampaikan pendapat secara jelas dan terbuka.",
    choice: 0,
  },
  {
    id: "7",
    title: "secara proaktif mengidentifikasi peluang perbaikan di area kerjanya.",
    choice: 0,
    section: "Innovation",
  },
  {
    id: "8",
    title:
      "dapat menciptakan solusi terbaik untuk peningkatan produktivitas dan kepuasan pelanggan.",
    choice: 0,
  },
  {
    id: "9",
    title: "melibatkan berbagai pihak untuk menghasilkan ide atau solusi terbaik.",
    choice: 0,
  },
  {
    id: "10",
    title:
      "mempunyai rasa memiliki yang kuat, berpikir dan bertindak sebagaimana layaknya pemilik perubahan.",
    choice: 0,
    section: "Accountable",
  },
  {
    id: "11",
    title: "menunjukan gairah dan harapan untuk hasil terbaik.",
    choice: 0,
  },
  {
    id: "12",
    title: "mencurahkan segenap potensi kepemimpinan untuk hasil terbaik.",
    choice: 0,
  },
  {
    id: "12",
    title: "melaksanakan sepenuhnya tugas dan tanggung jawab untuk mencapai hasil terbaik.",
    choice: 0,
  },
]

const JuaraAssesmentQuiz: FC<StackScreenProps<NavigatorParamList, "juaraAssesmentQuiz">> = observer(
  ({ navigation }) => {
    const goBack = () => navigation.goBack()

    const [feedbackData, setFeedbackData] = useState<Array<ChoiceItemTypeAssesment>>(EXAMPLE_DATA)
    const [userName, setUserName] = useState<string>("Jack Subagyo")

    const selectFeedbackItem = useCallback(
      (id, choice) => {
        const updated = feedbackData.map((item) => {
          if (item.id === id) {
            return { ...item, choice: choice }
          }
          return item
        })

        setFeedbackData(updated)
      },
      [feedbackData],
    )

    const ChoiceItem = ({ item, index }) => {
      return (
        <VStack vertical={Spacing[8]}>
          <VStack horizontal={Spacing[48]} bottom={Spacing[8]}>
            {item.section ? (
              <Button
                style={{ paddingVertical: Spacing[4] }}
                type={"primary"}
                text={item.section}
                disabled={true}
              />
            ) : null}
          </VStack>
          <Text type={"body"} style={{ textAlign: "center" }}>
            {`"${userName} ${item.title}"`}
          </Text>
          <HStack top={Spacing[12]} style={{ justifyContent: "space-around" }}>
            {Array(6)
              .fill(0)
              .map((value, i, array) => {
                return (
                  <TouchableOpacity
                    onPress={() => selectFeedbackItem(item.id, i + 1)}
                    // disabled={isAlreadyFilled}
                  >
                    <VStack>
                      <View
                        style={{
                          height: Spacing[24],
                          width: Spacing[24],
                          backgroundColor:
                            item.choice === i + 1 ? Colors.MAIN_RED : Colors.CLOUD_GRAY,
                          borderRadius: Spacing[128],
                          borderWidth: Spacing[2],
                          borderColor: item.choice === i + 1 ? Colors.MAIN_RED : Colors.MAIN_RED,
                        }}
                      />
                      <Text type={"body"} style={{ textAlign: "center" }}>
                        {i + 1}
                      </Text>
                    </VStack>
                  </TouchableOpacity>
                )
              })}
          </HStack>
        </VStack>
      )
    }

    return (
      <VStack
        testID="Assesment"
        style={{ backgroundColor: Colors.UNDERTONE_BLUE, flex: 1, justifyContent: "center" }}
      >
        <SafeAreaView style={Layout.flex}>
          <ScrollView>
            <BackNavigation goBack={goBack} />
            <VStack top={Spacing[8]} horizontal={Spacing[32]} bottom={Spacing[12]}>
              <Text type={"left-header"} style={{ color: Colors.WHITE }} text="JUARA Assessment" />
              <Spacer height={Spacing[24]} />
              <Text
                type={"header"}
                style={{ color: Colors.WHITE, textAlign: "center", fontSize: Spacing[12] }}
              >
                {`Rekan kerjamu butuh bantuan. Berikan penilaian bagi ${userName} sesuai dengan kinerjanya selama satu bulan ke belakang.`}
              </Text>
              <Spacer height={Spacing[32]} />
            </VStack>
            <VStack
              top={Spacing[32]}
              horizontal={Spacing[24]}
              style={[
                Layout.heightFull,
                {
                  backgroundColor: Colors.WHITE,
                  borderTopStartRadius: Spacing[48],
                  borderTopEndRadius: Spacing[48],
                },
              ]}
            >
              <FlatList
                ItemSeparatorComponent={() => <Spacer height={Spacing[24]} />}
                data={feedbackData}
                ListEmptyComponent={() => <EmptyList />}
                renderItem={({ item, index }) => <ChoiceItem item={item} index={index} />}
                keyExtractor={(item) => item.id}
                ListFooterComponent={
                  <VStack horizontal={Spacing[72]} vertical={Spacing[24]}>
                    <Button
                      type={"primary"}
                      text={"Submit"}
                      // onPress={submit}
                      style={{ minWidth: Spacing[72] }}
                    />
                  </VStack>
                }
              />
              <Spacer height={Spacing[32]} />
            </VStack>
          </ScrollView>
        </SafeAreaView>
      </VStack>
    )
  },
)

export default JuaraAssesmentQuiz
