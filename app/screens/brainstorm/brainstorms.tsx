import React, { FC, useCallback, useEffect, useState } from "react"
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, BackNavigation } from "@components"
import { NavigatorParamList } from "@navigators/idea-pools-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"

import { dimensions } from "@config/platform.config"
import { AddTask } from "@assets/svgs"

import { useStores } from "../../bootstrap/context.boostrap"
import { debounce } from "lodash"
import { IdeaType } from "./brainstorms.type"

// type StickyNoteItemProps = { id: string; color: string; colorShade: string; description: string }

const STICKY_LIST_EXAMPLE: IdeaType[] = [
  {
    id: "1",
    color: "#F2C94C",
    colorShade: "#F2994A",
    title: "Senam SKJ setiap Jumat",
  },
  {
    id: "2",
    color: "#F2C94C",
    colorShade: "#F2994A",
    title: "Senam SKJ setiap Jumat",
  },
  {
    id: "3",
    color: "#F2C94C",
    colorShade: "#F2994A",
    title: "Senam SKJ setiap Jumat",
  },
  {
    id: "4",
    color: "#F2C94C",
    colorShade: "#F2994A",
    title: "Senam SKJ setiap Jumat",
  },
  {
    id: "5",
    color: "#F2C94C",
    colorShade: "#F2994A",
    title: "Senam SKJ setiap Jumat",
  },
  {
    id: "6",
    color: "#F2C94C",
    colorShade: "#F2994A",
    title: "Senam SKJ setiap Jumat",
  },
  {
    id: "7",
    color: "#F2C94C",
    colorShade: "#F2994A",
    title: "Senam SKJ setiap Jumat",
  },
  {
    id: "8",
    color: "#F2C94C",
    colorShade: "#F2994A",
    title: "Senam SKJ setiap Jumat",
  },
  {
    id: "9",
    color: "#F2C94C",
    colorShade: "#F2994A",
    title: "Senam SKJ setiap Jumat",
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

const Brainstorms: FC<StackScreenProps<NavigatorParamList, "brainstorms">> = observer(
  ({ navigation, route }) => {
    const { groupId, isMember } = route.params
    const { mainStore, brainstormStore } = useStores()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [brainstorms, setBrainstorms] = useState<IdeaType[]>([])
    const [shortlisted, setShortlisted] = useState<IdeaType[]>([])
    const [selected, setSelected] = useState<IdeaType[]>([])

    const goBack = () => navigation.goBack()

    const createIdea = () =>
      navigation.navigate("addIdea", {
        isView: false,
        groupId: groupId,
        hasSelectedIdea: selected.length > 0
      })

    const editIdea = (id: string) =>
      navigation.navigate("addIdea", {
        isView: true,
        ideaId: id,
        hasSelectedIdea: selected.length > 0
      })

    const voteIdea = () =>
      navigation.navigate("addIdea", {
        isView: false,
        groupId: groupId,
        hasSelectedIdea: selected.length > 0
      })

    const selectIdea = () =>
      navigation.navigate("addIdea", {
        isView: false,
        groupId: groupId,
        hasSelectedIdea: selected.length > 0
      })

    const firstLoadIdea = debounce(async () => {
      await loadIdea()
      console.log("brainstormStore.ideaPoolsByGroup: ", brainstormStore.ideaPoolsByGroup)
    }, 500)

    const loadIdea = useCallback(async () => {
      setIsLoading(true)
      // console.log("groupId ", groupId)
      await brainstormStore.getIdeaPoolsByBrainstormGroup(route.params.groupId)
      setIsLoading(false)
      setBrainstorms(brainstormStore.ideaPoolsByGroup.brainstormed)
      setShortlisted(brainstormStore.ideaPoolsByGroup.shortlisted)
      setSelected(brainstormStore.ideaPoolsByGroup.selected)
    }, [])

    useEffect(() => {
      console.log("route.params ", route.params)
      firstLoadIdea()
    }, [])

    const onRefresh = React.useCallback(async () => {
      loadIdea()
    }, [])

    useEffect(() => {
      navigation.addListener("focus", () => {
        console.log("brainstormStore.refreshData ", brainstormStore.refreshData)
        firstLoadIdea()
      })
      console.log("brainstormStore.ideaPoolsByGroup abwah: ", brainstormStore.ideaPoolsByGroup)
    }, [])

    return (
      <VStack
        testID="CoachingJournalMain"
        style={{ backgroundColor: Colors.UNDERTONE_BLUE, flex: 1, justifyContent: "center" }}
      >
        <VStack top={Spacing[48]} style={Layout.flex}>
          <BackNavigation goBack={goBack} />
          <ScrollView
            style={{ backgroundColor: Colors.UNDERTONE_BLUE }}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
          >
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
                  {selected.length <= 0 && isMember &&(
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
                  )}
                </VStack>

                <Spacer height={Spacing[42]} />
                <HStack horizontal={Spacing[12]}>
                  <Text type={"left-header"} text="Brainstorm-ed" />
                </HStack>
                {isLoading ? (
                  <VStack
                    vertical={Spacing[12]}
                    style={{ position: "absolute", bottom: 0, width: dimensions.screenWidth }}
                  >
                    <ActivityIndicator animating={isLoading} />
                  </VStack>
                ) : (
                  <VStack style={styles.container} top={Spacing[24]} horizontal={Spacing[24]}>
                    {/* HERE */}

                    {brainstorms.length === 0 ? (
                      <Text
                        type={"label"}
                        text={`It’s time to show off your creativity! Tambah idemu sekarang.`}
                      />
                    ) : (
                      brainstorms.map((item) => {
                        return (
                          <TouchableOpacity
                            style={styles.item}
                            onPress={editIdea.bind(this, item.id)}
                            disabled={!isMember}
                            key={"sticky-main-" + item.id}
                          >
                            <VStack bottom={Spacing[12]}>
                              <StickyNoteItem
                                key={"sticky-main-" + item.id}
                                id={item.id}
                                text={item.title}
                                color={item.color}
                                colorShade={item.colorShade}
                              />
                            </VStack>
                          </TouchableOpacity>
                        )
                      })
                    )}
                  </VStack>
                )}
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

                {isLoading ? (
                  <VStack
                    vertical={Spacing[12]}
                    style={{ position: "absolute", bottom: 0, width: dimensions.screenWidth }}
                  >
                    <ActivityIndicator animating={isLoading} />
                  </VStack>
                ) : (
                  <VStack style={styles.container} top={Spacing[24]} horizontal={Spacing[24]}>
                    {/* HERE */}

                    {shortlisted.length === 0 ? (
                      <Text
                        type={"label"}
                        text={`It’s time to show off your creativity! Tambah idemu sekarang.`}
                      />
                    ) : (
                      shortlisted.slice(0, 5).map((item) => {
                        return (
                          <TouchableOpacity
                            style={styles.item}
                            key={"sticky-main-" + item.id}
                            onPress={editIdea.bind(this, item.id)}
                            disabled={!isMember}
                          >
                            <VStack bottom={Spacing[12]}>
                              <StickyNoteItem
                                key={"sticky-main-" + item.id}
                                id={item.id}
                                text={item.title}
                                color={item.color}
                                colorShade={item.colorShade}
                              />
                            </VStack>
                          </TouchableOpacity>
                        )
                      })
                    )}
                  </VStack>
                )}
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
                {isLoading ? (
                  <VStack
                    vertical={Spacing[12]}
                    style={{ position: "absolute", bottom: 0, width: dimensions.screenWidth }}
                  >
                    <ActivityIndicator animating={isLoading} />
                  </VStack>
                ) : (
                  <VStack style={styles.container} top={Spacing[24]} horizontal={Spacing[24]}>
                    {/* HERE */}

                    {selected.length === 0 ? (
                      <Text
                        type={"label"}
                        text={`Belum ada ide yang dipilih, nih. Masih bisa tambah ide & voting. Yuk tambah lagi!`}
                      />
                    ) : (
                      selected.slice(0, 3).map((item) => {
                        return (
                          <TouchableOpacity
                            style={styles.item}
                            key={"sticky-main-" + item.id}
                            onPress={editIdea.bind(this, item.id)}
                            disabled={!isMember}
                          >
                            <VStack bottom={Spacing[12]}>
                              <StickyNoteItem
                                key={"sticky-main-" + item.id}
                                id={item.id}
                                text={item.title}
                                color={item.color}
                                colorShade={item.colorShade}
                              />
                            </VStack>
                          </TouchableOpacity>
                        )
                      })
                    )}
                  </VStack>
                )}
                <Spacer height={Spacing[24]} />
              </VStack>
            </VStack>
          </ScrollView>
        </VStack>
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
    width: "33%", // is 50% of container width
  },
})
