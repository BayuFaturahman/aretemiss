import React, { FC, useCallback, useEffect, useState, useRef } from "react"
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
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

import { dimensions } from "@config/platform.config"
import { NotificationItem } from "../../store/store.notification"
import layout from "@styles/Layout"
import {IconLeaderboard, InfoPoint, TrophyLeaderboards} from "@assets/svgs"

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

const rankIteration = 1

const PodiumComponent = ({ data = PODIUM_EXAMPLE }: { data: LeaderBoardItem[] }) => {
  const BASE_HEIGHT = CustomSpacing(140)

  return (
    <HStack style={{ alignItems: "flex-end" }}>
      <VStack
        style={{
          flex: 1 / 3,
          backgroundColor: Colors.ABM_YELLOW,
          // height: data.length > 1 ? (data[1].score / data[0].score) * BASE_HEIGHT : BASE_HEIGHT * 0.5,
          height: BASE_HEIGHT * 0.7,
          borderTopStartRadius: Spacing[12],
          borderTopEndRadius: Spacing[12],
          borderBottomStartRadius: Spacing[12],
          borderColor: Colors.ABM_YELLOW,
          right: -1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          type={"body-bold"}
          style={{ color: Colors.WHITE, top: -Spacing[20], position: "absolute" }}
          text={`${data.length > 1 ? data[1].user_fullname : '-'}`}
        />
        <Text type={"body-bold"} style={{ color: Colors.UNDERTONE_BLUE }} text="#2" />
        <Text
          type={"body-bold"}
          style={{ color: Colors.UNDERTONE_BLUE }}
          text={`${data.length > 1 ? data[1].score : ''} poin`}
        />
      </VStack>
      <VStack
        style={{
          flex: 1 / 3,
          backgroundColor: Colors.ABM_YELLOW,
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
            text={`${data.length > 0 ? data[0].user_fullname : '-'}`}
          />
        </VStack>
        <Text type={"body-bold"} style={{ color: Colors.UNDERTONE_BLUE }} text="#1" />
        <IconLeaderboard height={Spacing[64]} />
        <Text
          type={"body-bold"}
          style={{ color: Colors.UNDERTONE_BLUE }}
          text={`${data.length > 0 ? data[0].score : ''} poin`}
        />
      </VStack>
      <VStack
        style={{
          flex: 1 / 3,
          backgroundColor: Colors.ABM_YELLOW,
          // height: data.length > 2 ? (data[2].score / data[1].score) * BASE_HEIGHT : BASE_HEIGHT * 0.5,
          height: BASE_HEIGHT * 0.5,
          borderTopEndRadius: Spacing[12],
          borderTopLeftRadius: Spacing[12],
          borderBottomEndRadius: Spacing[12],
          left: -1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          type={"body-bold"}
          style={{ color: Colors.WHITE, top: -Spacing[20], position: "absolute" }}
          text={`${data.length > 2 ? data[2].user_fullname : '-'}`}
        />
        <Text type={"body-bold"} style={{ color: Colors.UNDERTONE_BLUE }} text="#3" />
        <Text
          type={"body-bold"}
          style={{ color: Colors.UNDERTONE_BLUE }}
          text={`${data.length > 2 ? data[2].score : ''} poin`}
        />
      </VStack>
    </HStack>
  )
}

const Leaderboards: FC<StackScreenProps<NavigatorParamList, "notificationList">> = observer(
  ({ navigation }) => {
    const mounted = useRef(false);
    const [point, setPoint] = useState<number>(65)
    const [podiumData, setPodiumData] = useState<LeaderBoardItem[]>(PODIUM_EXAMPLE)
    const [rankData, setRankData] = useState<LeaderBoardItem[]>(PODIUM_EXAMPLE)
    const [loading, setLoading] = useState<boolean>(false);

    const [leaderboardsData, setLeaderboardsData] = useState<Array<NotificationItem>>([])

    const { leaderboardStore } = useStores()

    const goBack = () => navigation.goBack()

    const goToGuidePoints = () => navigation.navigate("guidePoints")

    const [currentPage, setCurrentPage] = useState<number>(2);

    let rankIteration = 1;

    useEffect(() => {
      mounted.current = true;

      return () => {
          mounted.current = false;
      };
  }, []);

    const onLoadMore = React.useCallback(async () => {
      setLoading(true);
      await leaderboardStore.getListLeaderboards(currentPage);
      setLoading(false);
      setCurrentPage(currentPage + 1)
    }, [currentPage])

    const onRefresh = React.useCallback(async () => {
      setLoading(true);
      setLeaderboardsData([])
      setCurrentPage(2)
      leaderboardStore.clearListLeaderboards()
      await leaderboardStore.getListLeaderboards();
      setLoading(false);
    }, [])

    useEffect(() => {
      onRefresh()
    }, [])

    useEffect(() => {
      if (leaderboardStore?.listLeaderboards) {
        setLeaderboardsData(leaderboardStore?.listLeaderboards)
      }
    }, [leaderboardStore?.listLeaderboards, leaderboardStore.getListLeaderboardsSuccess])

    const HeaderComponent = ({}) => {
      return (
        <VStack style={{ backgroundColor: Colors.ABM_MAIN_BLUE }}>
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
                  text={`${leaderboardStore?.selfLeaderboardPoints} poin!`}
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
            <PodiumComponent data={leaderboardStore?.listLeaderboards} />
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
        style={{ backgroundColor: Colors.ABM_MAIN_BLUE, flex: 1, justifyContent: "center" }}
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
                refreshing={loading}
                onRefresh={onRefresh}
                tintColor={Colors.MAIN_RED}
              />
            }
            showsVerticalScrollIndicator={false}
            data={leaderboardStore?.listLeaderboards}
            ListEmptyComponent={() => <EmptyList description={"Oops. Sepertinya belum ada yang jadi JUARA-nya nih. Yuk, mulai dapetin poinnya!"} navigateTo={goBack} />}
            renderItem={({ item, index }) => {
              if (index !== 0) {
                if (item.score !== leaderboardStore?.listLeaderboards[index - 1].score) {
                  rankIteration++;
                }
              } else {
                rankIteration = 1
              }
              return (
                <HStack horizontal={Spacing[32]} style={{ backgroundColor: Colors.WHITE }}>
                  <Text
                    type={"body-bold"}
                    style={{
                      color: Colors.UNDERTONE_BLUE,
                      flex: 1,
                      textAlign: "center",
                    }}
                    text={`#${rankIteration}`}
                  />
                  <Text
                    type={"body-bold"}
                    style={{
                      color: Colors.UNDERTONE_BLUE,
                      flex: 1,
                      textAlign: "center",
                    }}
                    text={`${item.score} poin`}
                  />
                  <Text
                    type={"body"}
                    style={{
                      color: Colors.UNDERTONE_BLUE,
                      flex: 1,
                      textAlign: "center",
                    }}
                    text={`${item.user_fullname}`}
                  />
                </HStack>
              )
            }}
            keyExtractor={(item) => item.id}
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.1}
          />
        </SafeAreaView>
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

export default Leaderboards
