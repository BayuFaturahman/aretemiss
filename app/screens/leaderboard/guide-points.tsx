import React, { FC, useState } from "react"
import { FlatList, RefreshControl, SafeAreaView, ScrollView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import { Colors, Layout, Spacing } from "@styles"

import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native"
import { Button, Text } from "@components"
import Spacer from "@components/spacer"

export type guidePointDataType = {
  desc: string
  score: string
}

export type guidePointType = {
  title: string
  data: guidePointDataType[]
}

const guidePointsData: guidePointType[] = [
  {
    title: "Coaching activities.",
    data: [
      {
        desc: "Tambah coaching journal",
        score: "+2",
      },
      { desc: "Penilaian feedback dari coachee", score: "(average score)" },
      {
        desc: "Rata-rata dari self-reflection feedback dan feedback dari coachee",
        score: "(average score)",
      },
    ],
  },
  {
    title: "Feed posts",
    data: [
      { desc: "Membuat post di Feed", score: "+2" },
      { desc: "Jumlah komen dari rekan kerja lain di post Feed", score: "(+1 /komen)" },
      {
        desc: "Jumlah komen yang dikirimkan di post Feed yang dibuat oleh rekan kerja lain",
        score: "(+1 /komen)",
      },
    ],
  },
]

const GuidePoints: FC<StackScreenProps<NavigatorParamList, "guidePoints">> = observer(
  ({ navigation }) => {
    // const [point, setPoint] = useState<number>(65)
    const [guidePointData, setGuidePointData] = useState<guidePointType[]>(guidePointsData)

    const goBack = () => navigation.goBack()

    const renderGuidePointData = (data: guidePointDataType) => {
      return (
        <HStack horizontal={Spacing[12]} vertical={Spacing[4]}>
          <Text style={{width: '60%'}}>{data.desc}</Text>
          <Spacer />
          <VStack
            style={{ backgroundColor: Colors.BRIGHT_BLUE, borderRadius: Spacing[24] }}
            horizontal={Spacing[12]}
            vertical={Spacing[4]}
          >
            <Text style={{ color: Colors.WHITE }}>{data.score}</Text>
          </VStack>
        </HStack>
      )
    }

    return (
      <VStack
        testID="GuidePoint"
        style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
      >
        <SafeAreaView style={Layout.flex}>
          <HStack top={Spacing[52]} horizontal={Spacing[24]} style={{ justifyContent: "space-between" }}>
            <Text type={"left-header"}>Cara mendapatkan poin.</Text>
            {/* <Text type={"left-header"}>Cara mendapatkan poin.</Text> */}
            <Button type={"negative"} text={"Back"} onPress={goBack}></Button>
          </HStack>
          <ScrollView>
            <Spacer height={Spacing[32]} />
            {/* <VStack horizontal={Spacing[24]}> */}
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  tintColor={Colors.MAIN_RED}
                />
              }
              ListFooterComponent={<Spacer height={Spacing[72]} />}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <Spacer height={Spacing[8]} />}
              data={guidePointData}
              // ListEmptyComponent={()=>
              // <EmptyList />
              // }
              renderItem={({ item, index }) => {
                return (
                  <Collapse>
                    <CollapseHeader>
                      <HStack
                        horizontal={Spacing[12]}
                        vertical={Spacing[4]}
                        style={{ backgroundColor: Colors.MAIN_BLUE, borderRadius: Spacing[20] }}
                      >
                        <Text type={"body"} style={{ color: Colors.WHITE }}>
                          {item.title}
                        </Text>
                        <Spacer />
                        <Text type={"body"} style={{ color: Colors.WHITE }}>
                          ▼
                        </Text>
                      </HStack>
                    </CollapseHeader>
                    <CollapseBody>
                      {item.data.map((data) => {
                        return(renderGuidePointData(data))
                      })}
                    </CollapseBody>
                  </Collapse>
                )
              }}
              style={{ paddingHorizontal: Spacing[24] }}
              keyExtractor={(item) => item.title}
            />
            <Spacer height={Spacing[16]} />

          </ScrollView>
        </SafeAreaView>
      </VStack>
    )
  },
)

export default GuidePoints
