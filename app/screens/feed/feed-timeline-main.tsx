import React, { FC, useCallback, useReducer, useState, useEffect } from "react"
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, BackNavigation } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"
import moment from "moment"

import { ActivitiesTypeLegends } from "@screens/coaching-journal/components/activities-type-legends"
import { NewButton } from "@screens/coaching-journal/components/new-button"
import FastImage from "react-native-fast-image"
import { useStores } from "../../bootstrap/context.boostrap"

import nullProfileIcon from "@assets/icons/settings/null-profile-picture.png"
import arrowYellow from "@assets/icons/coachingJournal/empty/arrow-yellow.png"
import smileYellow from "@assets/icons/coachingJournal/empty/smile-yellow.png"
import surprissedPurple from "@assets/icons/coachingJournal/empty/surprised-purple.png"
import { dimensions } from "@config/platform.config"
import { EmptyList } from "@screens/coaching-journal/components/empty-list"
import { FeedPost } from "./component/feed-post"
import { FeedTimelineItem, FeedTimelineItems } from "./feed.type"
import { FeedButton } from "./component/feed-button"

const FeedTimelineMain: FC<StackScreenProps<NavigatorParamList, "feedTimelineMain">> = observer(
  ({ navigation }) => {
    // empty list state
    // const [coachingData, setCoachingData] = useState<Array<CoachingJournalItem>>([]);
    // const [coachingData, setCoachingData] = useState<Array<CoachingJournalItem>>([]);
    // const [selectedActivities, setSelectedActivities] = useState<string>('');
    // const [, forceUpdate] = useReducer(x => x + 1, 0);
    const { feedStore } = useStores()

    // const onRefresh = React.useCallback(async() => {
    //   setCoachingData([])
    //   await coachingStore.getJournal()
    // }, []);

    const goBack = () => {
      navigation.reset({
        routes: [{ name: "homepage" }],
      })
    }

    const feedData: FeedTimelineItem[] = [
      {
        id: "0",
        imageUrl:
          "https://www.gstatic.com/webp/gallery/4.jpg;https://www.gstatic.com/webp/gallery/4.jpg",
        description:
          "Today, I’m starting a new monthly task! I designed a new strategy to nudge my team members to be more active in our monthly meetings. ",
        author: {
          fullname: "Mrs. Geneva Herrings",
          nickname: "Geneva",
          title: "Head of Accounting Dept.",
        },
        commentCount: 4,
        isNew: true,
        createdAt: "2021-09-24T10:39:39.000Z",
        updatedAt: "2021-09-24T10:39:39.000Z",
        comments: [],
      },
      {
        id: "1",
        imageUrl: "https://www.gstatic.com/webp/gallery/4.jpg",
        description:
          "Tmr, I’m starting a new monthly task! I designed a new strategy to nudge my team members to be more active in our monthly meetings. ",
        author: {
          fullname: "Mr. Herrings",
          nickname: "Herri",
          title: "Manager of Accounting Dept.",
        },
        commentCount: 4,
        isNew: true,
        createdAt: "2021-09-24T10:39:39.000Z",
        updatedAt: "2021-09-24T10:39:39.000Z",
        comments: [],
      },
    ]

    const getListFeed = useCallback(async () => {
      await feedStore.getListFeeds()
    }, [])

    

    return (
      <VStack
        testID="feedTimelineMain"
        style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
      >
        <SafeAreaView style={Layout.flex}>
          <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
          <ScrollView
            refreshControl={
              <RefreshControl
                //   refreshing={coachingStore.isLoading}
                //   onRefresh={onRefresh}
                tintColor={Colors.MAIN_RED}
              />
            }
          >
            <VStack top={Spacing[8]} horizontal={Spacing[24]} bottom={Spacing[12]}>
              <Text
                type={"left-header"}
                style={{ fontSize: Spacing[16] }}
                underlineWidth={Spacing[72]}
                text="Feed."
              />
              {feedData.map((data) => {
                return <FeedPost data={data} key={data.id}></FeedPost>
              })}
              <Spacer height={Spacing[8]} />
              <HStack>
                <Spacer />
                {/* <TouchableOpacity onPress={goToFeed}> */}
                {/* <FastImage style={{
                    height: Spacing[24],
                    width: Spacing[24],
                    borderRadius: Spacing[8]
                }} source={downArrow} resizeMode={"contain"}/>
                </TouchableOpacity> */}
                <Spacer />
              </HStack>
            </VStack>
          </ScrollView>
        </SafeAreaView>
        <FeedButton goToNewPost={() => console.log('goToNewPost')} goToMyFeed={() => console.log('goToMyFeed')} />
      </VStack>
    )
  },
)

export default FeedTimelineMain
