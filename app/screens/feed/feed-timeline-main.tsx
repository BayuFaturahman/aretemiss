import React, { FC, useCallback, useReducer, useState, useEffect } from "react"
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {Text, BackNavigation, Button} from "@components"
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
import ImageViewer from "react-native-image-zoom-viewer";


const images = [
  {
    url: "https://avatars2.githubusercontent.com/u/7970947?v=3&s=460",
    freeHeight: true
  },
  {
    url: "https://avatars2.githubusercontent.com/u/7970947?v=3&s=460",
    freeHeight: true
  }
];


const FeedTimelineMain: FC<StackScreenProps<NavigatorParamList, "feedTimelineMain">> = observer(
  ({ navigation, route }) => {
   const { feedStore } = useStores()
    const { listFeeds } = route.params

    const [modal, setModal] = useState<boolean>(false);

    const [listImageViewer, setListImageViewer] = useState(images);
    const [activeViewerIndex, setActiveViewerIndex] = useState<number>(0);

   const toggleModal = (value: boolean) =>{
     setModal(value)
   }

    const onRefresh = React.useCallback(async() => {
      // setCoachingData([])
      // await coachingStore.getJournal()
    }, []);

    const goBack = () => navigation.goBack()

    const goToNewPost = () => navigation.navigate("newPost")

    const getListFeed = useCallback(async () => {
      await feedStore.getListFeeds()
    }, [])

    const onImageFeedTap = useCallback( (index, imageList) => {
      setActiveViewerIndex(index)
      setListImageViewer(imageList)
      toggleModal(true);
    }, [])

    return (
      <VStack
        testID="feedTimelineMain"
        style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
      >
        <SafeAreaView style={Layout.flex}>
          <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={onRefresh}
                tintColor={Colors.MAIN_RED}
              />
            }
            ListHeaderComponent={
              <VStack top={Spacing[8]} bottom={Spacing[12]}>
                <Text
                  type={"left-header"}
                  style={{ fontSize: Spacing[16] }}
                  underlineWidth={Spacing[72]}
                  text="Feed."
                />
              </VStack>
            }
            ListFooterComponent={
              <Spacer height={Spacing[72]} />
            }
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={()=> <Spacer height={Spacing[8]} />}
            data={listFeeds}
            ListEmptyComponent={()=>
              <EmptyList navigateTo={goBack} />
            }
            renderItem={({item, index})=> {
              return (
                <FeedPost
                  data={item}
                  onImageTap={onImageFeedTap}
                />)
            }}
            style={{paddingHorizontal: Spacing[24]}}
            keyExtractor={item => item.id}
          />
        </SafeAreaView>
        <FeedButton
          goToNewPost={goToNewPost}
          goToMyFeed={() => console.log("goToMyFeed")}
        />
        <Modal
          visible={modal}
          transparent={true}
          onRequestClose={() => toggleModal(false)}
        >
          <ImageViewer
            imageUrls={listImageViewer}
            index={activeViewerIndex}
            onSwipeDown={() => {
              console.log('onSwipeDown');
              toggleModal(false);
            }}
            onMove={data => console.log(data)}
            enableSwipeDown={true}
          />
        </Modal>
      </VStack>
    )
  },
)

export default FeedTimelineMain

{/* <TouchableOpacity onPress={goToFeed}> */}
{/* <FastImage style={{
                    height: Spacing[24],
                    width: Spacing[24],
                    borderRadius: Spacing[8]
                }} source={downArrow} resizeMode={"contain"}/>
                </TouchableOpacity> */}
