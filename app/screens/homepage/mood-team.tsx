import React, { FC, useCallback, useEffect, useState } from "react"
import { FlatList, SafeAreaView, RefreshControl } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, BackNavigation, Button } from "@components"
import { debounce } from "lodash"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"
import { useStores } from "../../bootstrap/context.boostrap"
import RNAnimated from "react-native-animated-component"
import FastImage, { Source } from "react-native-fast-image"

import senang from "@assets/icons/mood/senyum.png"
import marah from "@assets/icons/mood/marah.png"
import sedih from "@assets/icons/mood/sedih.png"
import sakit from "@assets/icons/mood/sakit.png"
import kaget from "@assets/icons/mood/kaget.png"
import { MOOD_TYPE } from "./components/mood-component"

export type TeamMoodItemType = {
  userId: string
  userFullName: string
  moodType: string
  source: Source
}

// const TEAM_MOOD_EXAMPLE_DATA:TeamMoodItemType = []

const MoodTeam: FC<StackScreenProps<NavigatorParamList, "moodTeam">> = observer(
  ({ navigation }) => {
    const { mainStore } = useStores()
    const [listTeamMood, setListTeamMood] = useState<TeamMoodItemType[]>([])

    const goBack = () => {
      navigation.reset({
        routes: [{ name: "homepage" }],
      })
    }

    const loadData = debounce(async () => {
      await getListUser(mainStore.userProfile.team1_id)
      // setListFeeds(feedStore.listFeeds)
    }, 500)

    const onRefresh = React.useCallback(async () => {
      console.log("ON REFRESH")
      await loadData()
    }, [])

    useEffect(() => {
      // console.log('Use effect tanpa []')
      loadData()
    }, [])

    const getListUser = useCallback(async (id: string) => {
      await mainStore.getListUser(id)
      console.log("useEffect mainStore.listUserProfile", mainStore.listUserProfile)

      const teamMood: TeamMoodItemType[] = []
      mainStore.listUserProfile.forEach((user) => {
        if (user.mood !== "") {
          // const userMoodSource =
          const tempUserMood: TeamMoodItemType = {
            userId: user.id,
            userFullName: user.fullname,
            moodType: user.mood,
            source: getMoodSource(user.mood),
          }
          teamMood.push(tempUserMood)
        }
      })

      // teamMood.push({
      //   userId: 'user.id',
      //   userFullName: 'user.fullnameuser.fullnameuser.fullname',
      //   moodType: 'senang',
      //   source: getMoodSource('senang'),
      // })

      if (teamMood.length > 0) {
        setListTeamMood(teamMood)
      }
    }, [])

    const getMoodSource = (moodType: string) => {
      console.log("MasuK effect mood team ", MOOD_TYPE.length)
      let toReturn = null
      for (let x = 0; x < MOOD_TYPE.length; x++) {
        const type = MOOD_TYPE[x]
        console.log("type.lable ", type.label)
        if (type.label === moodType) {
          console.log("masuk nih ", type.source)
          x = MOOD_TYPE.length
          toReturn = type.source
        }
      }
      return toReturn
    }

    return (
      <VStack
        testID="CoachingJournalMain"
        style={{ backgroundColor: Colors.UNDERTONE_BLUE, flex: 1, justifyContent: "center" }}
      >
        <SafeAreaView style={Layout.flex}>
          <BackNavigation goBack={goBack} />
          <VStack top={Spacing[8]} horizontal={Spacing[24]} bottom={Spacing[12]}>
            <Spacer height={Spacing[24]} />
            <Text
              type={"header"}
              style={{ color: Colors.WHITE }}
              text="How are my team doing today?"
            />
            <Spacer height={Spacing[24]} />
            <Text type={"body"} style={{ textAlign: "center", color: Colors.WHITE }}>
              {`Lihat mood yang sudah di-update \n anggota tim Anda hari ini!`}
            </Text>
            <Spacer height={Spacing[32]} />
          </VStack>
          <SafeAreaView style={Layout.flex}>
            <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
          </SafeAreaView>
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
            <VStack top={Spacing[32]} horizontal={Spacing[10]}>
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={false}
                    onRefresh={onRefresh}
                    tintColor={Colors.MAIN_RED}
                  />
                }
                ListFooterComponent={<Spacer height={Spacing[72]} />}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <Spacer height={Spacing[8]} />}
                data={listTeamMood}
                // ListEmptyComponent={()=>
                // <EmptyList navigateTo={goBack} />
                // }
                renderItem={({ item, index }) => {
                  return (
                    <HStack style={{ justifyContent: "space-around", width: "100%"}}>
                      <Text type={"body"} style={{fontSize: Spacing[16], width: '80%'}}>
                        <Text type={"body-bold"}>{item.userFullName} </Text>
                        merasa  <Text type={"body-bold"}>{item.moodType}</Text>.
                      </Text>
                      <Spacer />
                      <FastImage
                        style={{
                          height: Spacing[32],
                          width: Spacing[32],
                        }}
                        source={item.source}
                        resizeMode={"contain"}
                      />
                    </HStack>
                  )
                }}
                style={{ paddingHorizontal: Spacing[24] }}
                keyExtractor={(item) => item.userId}
              />

              <Spacer height={Spacing[16]} />
            </VStack>
            <Spacer height={Spacing[12]} />
          </VStack>
        </SafeAreaView>
      </VStack>
    )
  },
)

export default MoodTeam
