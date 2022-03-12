import React, { FC, useEffect, useState } from "react"
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, BackNavigation } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"

import { dimensions } from "@config/platform.config"
import { AddTask } from "@assets/svgs"

import { useStores } from "../../bootstrap/context.boostrap"
import { debounce } from "lodash"

type StickyNoteItemProps = { id: string; color: string; colorShade: string; text: string }

const STICKY_LIST_EXAMPLE: StickyNoteItemProps[] = [
  {
    id: "1",
    color: "#F2C94C",
    colorShade: "#F2994A",
    text: "Senam SKJ setiap Jumat",
  },
  {
    id: "2",
    color: "#F2C94C",
    colorShade: "#F2994A",
    text: "Senam SKJ setiap Jumat",
  },
  {
    id: "3",
    color: "#F2C94C",
    colorShade: "#F2994A",
    text: "Senam SKJ setiap Jumat",
  },
  {
    id: "4",
    color: "#F2C94C",
    colorShade: "#F2994A",
    text: "Senam SKJ setiap Jumat",
  },
  {
    id: "5",
    color: "#F2C94C",
    colorShade: "#F2994A",
    text: "Senam SKJ setiap Jumat",
  },
  {
    id: "6",
    color: "#F2C94C",
    colorShade: "#F2994A",
    text: "Senam SKJ setiap Jumat",
  },
  {
    id: "7",
    color: "#F2C94C",
    colorShade: "#F2994A",
    text: "Senam SKJ setiap Jumat",
  },
  {
    id: "8",
    color: "#F2C94C",
    colorShade: "#F2994A",
    text: "Senam SKJ setiap Jumat",
  },
  {
    id: "9",
    color: "#F2C94C",
    colorShade: "#F2994A",
    text: "Senam SKJ setiap Jumat",
  },
]

const TriangleCorner = ({ style }: { style: ViewStyle }) => {
  return <View style={[shape.triangleCorner, style]} />
}

const TriangleCornerTopRight = ({ styles }: { styles: ViewStyle }) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <TriangleCorner style={[shape.triangleCornerTopRight, styles]} />
}

const TriangleCornerBottomLeft = ({ styles }: { styles: ViewStyle }) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <TriangleCorner style={[shape.triangleCornerBottomLeft, styles]} />
}

const shape = StyleSheet.create({
  triangleCorner: {
    backgroundColor: "transparent",
    borderRightColor: "transparent",
    borderRightWidth: Spacing[12],
    borderStyle: "solid",
    borderTopColor: "red",
    borderTopWidth: Spacing[12],
    height: 0,
    width: 0,
  },
  triangleCornerBottomLeft: {
    transform: [{ rotate: "270deg" }],
  },
  triangleCornerTopRight: {
    transform: [{ rotate: "90deg" }],
  },
})

const StickyNoteItem = ({
  id = "1",
  color = "#F2C94C",
  text = "Senam SKJ setiap Jumat",
  colorShade = "#F2994A",
}) => {
  const SIZE = dimensions.screenWidth / 3 - Spacing[36]

  return (
    <VStack
      style={{
        height: SIZE,
        width: SIZE,
        backgroundColor: color,
        alignItems: "center",
        justifyContent: "center",
      }}
      horizontal={Spacing[8]}
      vertical={Spacing[8]}
    >
      <TriangleCornerTopRight
        styles={{ position: "absolute", top: 0, right: 0, borderTopColor: Colors.WHITE }}
      />
      <TriangleCornerBottomLeft
        styles={{ position: "absolute", top: 0, right: 0, borderTopColor: colorShade }}
      />
      <Text type={"body"} style={{ textAlign: "center", fontSize: Spacing[16] }} text={text} />
    </VStack>
  )
}

const Brainstorms: FC<StackScreenProps<NavigatorParamList, "notificationList">> = observer(
  ({ navigation, route }) => {
    // const { groupId } = route.params.groupId
    const { mainStore, brainstormStore } = useStores()
    const [loading, setLoading] = useState<boolean>(false)

    const [brainstorms, setBrainstorms] = useState<StickyNoteItemProps[]>(STICKY_LIST_EXAMPLE)

    const goBack = () => navigation.goBack()

    const createIdea = () =>
      navigation.navigate("addIdea", {
        isEdit: false,
        byLeaders: false,
        isVote: false,
      })

    const editIdea = () =>
      navigation.navigate("addIdea", {
        isEdit: true,
        byLeaders: false,
        isVote: false,
      })

    const voteIdea = () =>
      navigation.navigate("addIdea", {
        isEdit: false,
        byLeaders: false,
        isVote: true,
      })

    const selectIdea = () =>
      navigation.navigate("addIdea", {
        isEdit: false,
        byLeaders: true,
        isVote: false,
      })

    const loadIdeas = debounce(async (groupId: string) => {
      await brainstormStore.getIdeaPoolsByBrainstormsGroup(groupId)
    }, 500)

    useEffect(() => {
      loadIdeas('id')
    }, [])

    return (
      <VStack
        testID="CoachingJournalMain"
        style={{ backgroundColor: Colors.UNDERTONE_BLUE, flex: 1, justifyContent: "center" }}
      >
        <VStack top={Spacing[48]} style={Layout.flex}>
          <BackNavigation goBack={goBack} />
          <ScrollView style={{ backgroundColor: Colors.UNDERTONE_BLUE }}>
            <VStack top={Spacing[8]} horizontal={Spacing[12]} bottom={Spacing[12]}>
              <Text
                type={"header"}
                style={{ color: Colors.WHITE, fontSize: Spacing[16] }}
                text="Brainstorm Your Ideas!"
              />
              <Spacer height={Spacing[20]} />
              <Text
                type={"body"}
                style={{ color: Colors.WHITE, textAlign: "center" }}
                text="Tunjukan semangatmu dan nikmati berbagai macam hadiah! Tiga orang yang mendudukin peringkat #1, #2, dan #3 akan mendapatkan hadiah menarik setiap bulannya."
              />
              <Spacer height={Spacing[48]} />
              <VStack
                style={{
                  backgroundColor: Colors.WHITE,
                  borderRadius: Spacing[24],
                  justifyContent: "center",
                }}
              >
                <VStack
                  style={{
                    width: dimensions.screenWidth - Spacing[24],
                    alignItems: "center",
                    top: -Spacing[32],
                    position: "absolute",
                    zIndex: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={createIdea}
                    style={{
                      height: Spacing[64],
                      width: Spacing[64],
                      backgroundColor: Colors.BRIGHT_BLUE,
                      borderRadius: Spacing[64],
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <AddTask height={Spacing[36]} width={Spacing[36]} />
                  </TouchableOpacity>
                </VStack>

                <Spacer height={Spacing[42]} />
                <HStack horizontal={Spacing[12]}>
                  <Text type={"left-header"} text="Brainstorm-ed" />
                </HStack>

                <VStack style={styles.container} top={Spacing[24]} horizontal={Spacing[24]}>
                  {/* HERE */}

                  {brainstorms.map((item) => {
                    return (
                      <TouchableOpacity style={styles.item} onPress={editIdea}>
                        <VStack bottom={Spacing[12]}>
                          <StickyNoteItem
                            key={"sticky-main-" + item.id}
                            id={item.id}
                            text={item.text}
                            color={item.color}
                          />
                        </VStack>
                      </TouchableOpacity>
                    )
                  })}
                </VStack>

                <Spacer height={Spacing[24]} />
              </VStack>

              <Spacer height={Spacing[24]} />
              <VStack
                style={{
                  backgroundColor: Colors.WHITE,
                  borderRadius: Spacing[24],
                  bottom: -1,
                }}
              >
                <Spacer height={Spacing[24]} />
                <HStack horizontal={Spacing[12]}>
                  <Text type={"left-header"} text="Shortlisted" />
                </HStack>

                <VStack style={styles.container} top={Spacing[24]} horizontal={Spacing[24]}>
                  {/* HERE */}

                  {brainstorms.slice(0, 5).map((item) => {
                    return (
                      <TouchableOpacity style={styles.item}>
                        <VStack bottom={Spacing[12]}>
                          <StickyNoteItem
                            key={"sticky-main-" + item.id}
                            id={item.id}
                            text={item.text}
                            color={item.color}
                          />
                        </VStack>
                      </TouchableOpacity>
                    )
                  })}
                </VStack>
                <Spacer height={Spacing[24]} />
              </VStack>

              <Spacer height={Spacing[24]} />
              <VStack
                style={{
                  backgroundColor: Colors.WHITE,
                  borderRadius: Spacing[24],
                  bottom: -1,
                }}
              >
                <Spacer height={Spacing[24]} />
                <HStack horizontal={Spacing[12]}>
                  <Text type={"left-header"} text="Selected" />
                </HStack>

                <VStack style={styles.container} top={Spacing[24]} horizontal={Spacing[24]}>
                  {/* HERE */}

                  {brainstorms.slice(0, 3).map((item) => {
                    return (
                      <TouchableOpacity style={styles.item}>
                        <VStack bottom={Spacing[12]}>
                          <StickyNoteItem
                            key={"sticky-main-" + item.id}
                            id={item.id}
                            text={item.text}
                            color={item.color}
                          />
                        </VStack>
                      </TouchableOpacity>
                    )
                  })}
                </VStack>
                <Spacer height={Spacing[24]} />
              </VStack>
            </VStack>
          </ScrollView>
        </VStack>
        {loading ? (
          <VStack
            vertical={Spacing[12]}
            style={{ position: "absolute", bottom: 0, width: dimensions.screenWidth }}
          >
            <ActivityIndicator animating={loading} />
          </VStack>
        ) : null}
      </VStack>
    )
  },
)

export default Brainstorms

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap", // if you want to fill rows left to right
    justifyContent: "flex-start",
  },
  item: {
    alignItems: "center",
    width: "33,3%", // is 50% of container width
  },
})
