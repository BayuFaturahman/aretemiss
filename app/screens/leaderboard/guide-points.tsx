import React, { FC } from "react"
import { SafeAreaView, ScrollView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import { Colors, Layout, Spacing } from "@styles"

import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native"
import { Button, Text } from "@components"
import Spacer from "@components/spacer"

const GuidePoints: FC<StackScreenProps<NavigatorParamList, "guidePoints">> = observer(
  ({ navigation }) => {
    // const [point, setPoint] = useState<number>(65)

    const goBack = () => navigation.goBack()

    return (
      <VStack
        testID="CoachingJournalMain"
        style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
      >
        <SafeAreaView style={Layout.flex}>
          <HStack horizontal={Spacing[24]} style={{ justifyContent: "space-between" }}>
            <Text type={"left-header"}>Cara mendapatkan poin.</Text>
            {/* <Text type={"left-header"}>Cara mendapatkan poin.</Text> */}
            <Button type={"negative"} text={"Back"} onPress={goBack}></Button>
          </HStack>
          <ScrollView>
            <Spacer height={Spacing[24]} />
            <VStack horizontal={Spacing[24]}>
              <Collapse>
                <CollapseHeader>
                  <HStack
                    horizontal={Spacing[12]}
                    vertical={Spacing[4]}
                    style={{ backgroundColor: Colors.MAIN_BLUE, borderRadius: Spacing[20] }}
                  >
                    <Text type={"body"} style={{ color: Colors.WHITE }}>
                      Coaching activities.
                    </Text>
                    <Spacer />
                    <Text type={"body"} style={{ color: Colors.WHITE }}>
                      ▼
                    </Text>
                  </HStack>
                </CollapseHeader>
                <CollapseBody>
                  <HStack horizontal={Spacing[12]} vertical={Spacing[4]}>
                    <Text>Tambah coaching journal.</Text>
                    <Spacer />
                    <VStack
                      style={{ backgroundColor: Colors.BRIGHT_BLUE, borderRadius: Spacing[24] }}
                      horizontal={Spacing[12]}
                      vertical={Spacing[4]}
                    >
                      <Text style={{ color: Colors.WHITE }}>+ 2</Text>
                    </VStack>
                  </HStack>
                </CollapseBody>
              </Collapse>
              <Spacer height={Spacing[16]} />

              {/* #2 */}
              <Collapse>
                <CollapseHeader>
                  <HStack
                    horizontal={Spacing[12]}
                    vertical={Spacing[4]}
                    style={{ backgroundColor: Colors.MAIN_BLUE, borderRadius: Spacing[20] }}
                  >
                    <Text type={"body"} style={{ color: Colors.WHITE }}>
                      Coaching activities.
                    </Text>
                    <Spacer />
                    <Text type={"body"} style={{ color: Colors.WHITE }}>
                      ▼
                    </Text>
                  </HStack>
                </CollapseHeader>
                <CollapseBody>
                  <HStack horizontal={Spacing[12]} vertical={Spacing[4]}>
                    <Text>Tambah coaching journal.</Text>
                    <Spacer />
                    <VStack
                      style={{ backgroundColor: Colors.BRIGHT_BLUE, borderRadius: Spacing[24] }}
                      horizontal={Spacing[12]}
                      vertical={Spacing[4]}
                    >
                      <Text style={{ color: Colors.WHITE }}>+ 2</Text>
                    </VStack>
                  </HStack>
                  <HStack horizontal={Spacing[12]} vertical={Spacing[4]}>
                    <Text>Tambah coaching journal.</Text>
                    <Spacer />
                    <VStack
                      style={{ backgroundColor: Colors.BRIGHT_BLUE, borderRadius: Spacing[24] }}
                      horizontal={Spacing[12]}
                      vertical={Spacing[4]}
                    >
                      <Text style={{ color: Colors.WHITE }}>+ 2</Text>
                    </VStack>
                  </HStack>
                  <HStack horizontal={Spacing[12]} vertical={Spacing[4]}>
                    <Text>Tambah coaching journal.</Text>
                    <Spacer />
                    <VStack
                      style={{ backgroundColor: Colors.BRIGHT_BLUE, borderRadius: Spacing[24] }}
                      horizontal={Spacing[12]}
                      vertical={Spacing[4]}
                    >
                      <Text style={{ color: Colors.WHITE }}>+ 2</Text>
                    </VStack>
                  </HStack>
                </CollapseBody>
              </Collapse>
            </VStack>
          </ScrollView>
        </SafeAreaView>
      </VStack>
    )
  },
)

export default GuidePoints
