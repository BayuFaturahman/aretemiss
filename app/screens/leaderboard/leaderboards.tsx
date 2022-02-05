import React, { FC, useCallback, useEffect, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, BackNavigation, Button } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, CustomSpacing, Layout, Spacing } from "@styles"

import { useStores } from "../../bootstrap/context.boostrap"
import { EmptyList } from "@screens/notification/components/empty-list"
import FastImage from "react-native-fast-image"

import nullProfileIcon from "@assets/icons/settings/null-profile-picture.png"
import { dimensions } from "@config/platform.config"
import { NotificationItem } from "../../store/store.notification"
import { FeedItemType } from "@screens/feed/feed.type"
import layout from "@styles/Layout"
import { InfoPoint, TrophyLeaderboards } from "@assets/svgs"

type NotificationItemType = {
  id: string
  type: "tagged" | "liked" | "comment" | "feedback"
  isNew: boolean
  user: {
    name: string
    avatar: string
  }
  session: string
}

type LeaderBoardItem = { name: string; point: number; rank: number }

const PODIUM_EXAMPLE: LeaderBoardItem[] = [
  {
    name: "Jehova Witness",
    point: 90,
    rank: 1,
  },
  {
    name: "Mas Ken",
    point: 80,
    rank: 2,
  },
  {
    name: "Jane",
    point: 62,
    rank: 3,
  },
  {
    name: "Jehova Witness",
    point: 90,
    rank: 1,
  },
  {
    name: "Mas Ken",
    point: 80,
    rank: 2,
  },
  {
    name: "Jane",
    point: 62,
    rank: 3,
  },
  {
    name: "Jehova Witness",
    point: 90,
    rank: 1,
  },
  {
    name: "Mas Ken",
    point: 80,
    rank: 2,
  },
  {
    name: "Jane",
    point: 62,
    rank: 3,
  },
]

const PodiumComponent = ({ data = PODIUM_EXAMPLE }: { data: LeaderBoardItem[] }) => {
  const BASE_HEIGHT = CustomSpacing(140)

  return (
    <HStack style={{ alignItems: "flex-end" }}>
      <VStack
        style={{
          flex: 1 / 3,
          backgroundColor: Colors.HONEY_YELLOW,
          height: BASE_HEIGHT / 2,
          borderTopStartRadius: Spacing[12],
          borderBottomStartRadius: Spacing[12],
          borderColor: Colors.HONEY_YELLOW,
          right: -1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          type={"body-bold"}
          style={{ color: Colors.WHITE, top: -Spacing[20], position: "absolute" }}
          text={`${data[1].name}`}
        />
        <Text type={"body-bold"} style={{ color: Colors.UNDERTONE_BLUE }} text="#2" />
        <Text
          type={"body-bold"}
          style={{ color: Colors.UNDERTONE_BLUE }}
          text={`${data[1].point} poin`}
        />
      </VStack>
      <VStack
        style={{
          flex: 1 / 3,
          backgroundColor: Colors.HONEY_YELLOW,
          height: BASE_HEIGHT,
          borderTopStartRadius: Spacing[12],
          borderTopEndRadius: Spacing[12],
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <VStack
          horizontal={Spacing[8]}
          style={{
            top: -Spacing[24],
            position: "absolute",
            backgroundColor: Colors.WHITE,
            borderRadius: Spacing[24],
          }}
        >
          <Text
            type={"body-bold"}
            style={{ color: Colors.UNDERTONE_BLUE }}
            text={`${data[0].name}`}
          />
        </VStack>
        <Text type={"body-bold"} style={{ color: Colors.UNDERTONE_BLUE }} text="#1" />
        <TrophyLeaderboards height={Spacing[64]} />
        <Text
          type={"body-bold"}
          style={{ color: Colors.UNDERTONE_BLUE }}
          text={`${data[0].point} poin`}
        />
      </VStack>
      <VStack
        style={{
          flex: 1 / 3,
          backgroundColor: Colors.HONEY_YELLOW,
          height: BASE_HEIGHT / 3,
          borderTopEndRadius: Spacing[12],
          borderBottomEndRadius: Spacing[12],
          left: -1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          type={"body-bold"}
          style={{ color: Colors.WHITE, top: -Spacing[20], position: "absolute" }}
          text={`${data[2].name}`}
        />
        <Text type={"body-bold"} style={{ color: Colors.UNDERTONE_BLUE }} text="#3" />
        <Text
          type={"body-bold"}
          style={{ color: Colors.UNDERTONE_BLUE }}
          text={`${data[2].point} poin`}
        />
      </VStack>
    </HStack>
  )
}

const Leaderboards: FC<StackScreenProps<NavigatorParamList, "notificationList">> = observer(
  ({ navigation }) => {
    const [point, setPoint] = useState<number>(65)
    const [podiumData, setPodiumData] = useState<LeaderBoardItem[]>(PODIUM_EXAMPLE)
    const [rankData, setRankData] = useState<LeaderBoardItem[]>(PODIUM_EXAMPLE)

    const [notificationsData, setNotificationsData] = useState<Array<NotificationItem>>([])

    const { notificationStore, coachingStore, mainStore, feedStore } = useStores()

    const goBack = () => navigation.goBack()

    const goToGuidePoints = () => navigation.navigate("guidePoints")

    const [currentPage, setCurrentPage] = useState<number>(2)

    const onLoadMore = React.useCallback(async () => {
      await notificationStore.getListNotifications(currentPage)
      setCurrentPage(currentPage + 1)
    }, [currentPage])

    const onRefresh = React.useCallback(async () => {
      setNotificationsData([])
      setCurrentPage(2)
      notificationStore.clearListNotifications()
      await notificationStore.getListNotifications()
    }, [])

    useEffect(() => {
      onRefresh()
    }, [])

    useEffect(() => {
      if (notificationStore.notificationsList) {
        setNotificationsData(notificationStore.notificationsList)
      }
    }, [notificationStore.notificationsList, notificationStore.getNotificationsSuccess])

    const HeaderComponent = ({}) => {
      return (
        <VStack style={{ backgroundColor: Colors.UNDERTONE_BLUE }}>
          <BackNavigation goBack={goBack} />
          <VStack top={Spacing[8]} horizontal={Spacing[24]} bottom={Spacing[12]}>
            <Text
              type={"header"}
              style={{ color: Colors.WHITE, fontSize: Spacing[16] }}
              text="Leaderboards"
            />
            <Spacer height={Spacing[20]} />
            <Text
              type={"body"}
              style={{ color: Colors.WHITE, textAlign: "center" }}
              text="Tunjukan semangatmu dan nikmati berbagai macam hadiah! Tiga orang yang mendudukin peringkat #1, #2, dan #3 akan mendapatkan hadiah menarik setiap bulannya."
            />
            <Spacer height={Spacing[20]} />
            <Text
              type={"body"}
              style={{ color: Colors.WHITE, textAlign: "center" }}
              text="Perolehan poin akan di-update setiap hari."
            />
            <Spacer height={Spacing[20]} />

            <VStack
              vertical={Spacing[4]}
              style={{ backgroundColor: Colors.WHITE, borderRadius: Spacing[24] }}
            >
              <Text type={"body"} style={{ textAlign: "center" }}>
                <Text
                  type={"body"}
                  style={{ color: Colors.BRIGHT_BLUE }}
                  text={`Poin kamu saat ini: `}
                />
                <Text
                  type={"body-bold"}
                  style={{ color: Colors.BRIGHT_BLUE }}
                  text={`${point} poin!`}
                />
              </Text>
            </VStack>

            <Spacer height={Spacing[24]} />
            <TouchableOpacity style={layout.widthFull} onPress={goToGuidePoints}>
              <HStack style={layout.flexCenterMid}>
                <Text
                  type={"header2"}
                  style={{ color: Colors.WHITE, fontWeight: "bold", textAlign: "center" }}
                  text={`Cara mendapatkan poin.`}
                />
                <Spacer width={Spacing[4]} />
                <InfoPoint height={Spacing[20]} />
              </HStack>
            </TouchableOpacity>

            <Spacer height={Spacing[42]} />
            <PodiumComponent data={podiumData} />
          </VStack>
          <VStack
            style={{
              backgroundColor: Colors.WHITE,
              borderTopStartRadius: Spacing[32],
              borderTopEndRadius: Spacing[32],
              height: Spacing[48],
              width: dimensions.screenWidth,
              bottom: -1,
            }}
          />
        </VStack>
      )
    }

    return (
      <VStack
        testID="CoachingJournalMain"
        style={{ backgroundColor: Colors.UNDERTONE_BLUE, flex: 1, justifyContent: "center" }}
      >
        <SafeAreaView style={Layout.flex}>
          <FlatList
            style={{ backgroundColor: Colors.WHITE }}
            ItemSeparatorComponent={() => (
              <VStack style={{ backgroundColor: Colors.WHITE }}>
                <Spacer height={Spacing[20]} />
              </VStack>
            )}
            ListHeaderComponent={HeaderComponent}
            ListFooterComponent={() => (
              <VStack style={{ backgroundColor: Colors.WHITE }}>
                <Spacer height={Spacing[42]} />
              </VStack>
            )}
            refreshControl={
              <RefreshControl
                refreshing={notificationStore.isLoading}
                onRefresh={onRefresh}
                tintColor={Colors.MAIN_RED}
              />
            }
            showsVerticalScrollIndicator={false}
            data={rankData}
            ListEmptyComponent={() => <EmptyList navigateTo={goBack} />}
            renderItem={({ item, index }) => {
              return (
                <HStack horizontal={Spacing[32]} style={{ backgroundColor: Colors.WHITE }}>
                  <Text
                    type={"body-bold"}
                    style={{
                      color: Colors.UNDERTONE_BLUE,
                      flex: 1,
                      textAlign: "center",
                    }}
                    text={`#${item.rank}`}
                  />
                  <Text
                    type={"body-bold"}
                    style={{
                      color: Colors.UNDERTONE_BLUE,
                      flex: 1,
                      textAlign: "center",
                    }}
                    text={`${item.point} poin`}
                  />
                  <Text
                    type={"body"}
                    style={{
                      color: Colors.UNDERTONE_BLUE,
                      flex: 1,
                      textAlign: "center",
                    }}
                    text={`${item.name}`}
                  />
                </HStack>
              )
            }}
            keyExtractor={(item) => item.id}
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.1}
          />
        </SafeAreaView>
        {notificationStore.isLoading ? (
          <VStack
            vertical={Spacing[12]}
            style={{ position: "absolute", bottom: 0, width: dimensions.screenWidth }}
          >
            <ActivityIndicator animating={notificationStore.isLoading} />
          </VStack>
        ) : null}
      </VStack>
    )
  },
)

export default Leaderboards
