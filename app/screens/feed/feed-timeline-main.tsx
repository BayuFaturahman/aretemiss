import React, {createRef, FC, useCallback, useEffect, useState} from "react"
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import {useFocusEffect, useIsFocused} from '@react-navigation/native'
import { observer } from "mobx-react-lite"
import {Text, BackNavigation, TextYellowLine, Button} from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Layout, Spacing, Roundness } from "@styles"
import {Close} from "@assets/svgs"

import { useStores } from "../../bootstrap/context.boostrap"

import { EmptyList } from "@screens/coaching-journal/components/empty-list"
import { FeedPost } from "./component/feed-post"
import { FeedButton } from "./component/feed-button"
import ImageViewer from "react-native-image-zoom-viewer";
import {debounce} from "lodash";
import {FeedItemType} from "@screens/feed/feed.type";
import ActionSheet from "react-native-actions-sheet";
import {launchCamera} from "react-native-image-picker";


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

const FEED_EXAMPLE_DATA_ITEM: FeedTimelineItem[] = [
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
    imageUrl:
      "https://www.gstatic.com/webp/gallery/4.jpg;https://www.gstatic.com/webp/gallery/4.jpg;https://www.gstatic.com/webp/gallery/4.jpg",
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
    id: "2",
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
  {
    id: "3",
    imageUrl:
      "https://www.gstatic.com/webp/gallery/4.jpg;https://www.gstatic.com/webp/gallery/4.jpg;https://www.gstatic.com/webp/gallery/4.jpg;https://www.gstatic.com/webp/gallery/4.jpg",
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
]

const FeedTimelineMain: FC<StackScreenProps<NavigatorParamList, "feedTimelineMain">> = observer(
  ({ navigation, route }) => {
    const { feedStore, feedApi } = useStores()

    const actionSheetRef = createRef();

    const [modal, setModal] = useState<boolean>(false);
    const [listFeeds, setListFeeds] = useState<Array<FeedItemType>>(feedStore.listFeeds);
    const [newNotif, setNewNotif] = useState<number>(0);

    const [listImageViewer, setListImageViewer] = useState(images);
    const [activeViewerIndex, setActiveViewerIndex] = useState<number>(0);

    const [currentPage, setCurrentPage] = useState<number>(1);

    const [selectedPostId, setSelectedPostId] = useState<string>("");

    const currentDateTime = new Date().toString();

    const isFocused = useIsFocused();

    const openBottomSheet = (postId: string) => {
      actionSheetRef.current?.setModalVisible(true)
      setSelectedPostId(postId)
    }

    const goBack = () => {
      setLastSeenFeed()
      navigation.goBack()
    }

    const goToNewPost = () => {
      setLastSeenFeed()
      resetNavigationParam()
      navigation.navigate("newPost")
    }

    const goToGuideline = async () => {
      const savedAgreeTnc = await AsyncStorage.getItem('Agree Feed Guidelines');
      setLastSeenFeed()
      resetNavigationParam()
      navigation.navigate("feedGuideline", {savedAgreeTnc})
    }

    const goToMyfeed = () => {
      setLastSeenFeed()
      resetNavigationParam()
      navigation.navigate("myFeedList")
    }

    const goToCommentList = () => {
      setLastSeenFeed()
      resetNavigationParam()
      navigation.navigate("commentList")
    }

    const goToDetails = useCallback(async (data: FeedItemType) => {
      setLastSeenFeed()
      resetNavigationParam()
      await feedStore.getPostDetail(data.id)
      navigation.navigate("postDetails", {
        data: feedStore.postDetail,
        isFromMainFeed: true
      })
    }, [feedStore.postDetail, feedStore.getPostDetailSuccess])

    const resetNavigationParam = () => {
      feedStore.refreshData = false
      navigation.setParams({ newPost: undefined })
    }

    const toggleModal = (value: boolean) =>{
      setModal(value)
    }

    const setLastSeenFeed = () => {
      feedStore.serviceStore.setLastSeenFeed(currentDateTime)
    }

    const firstLoadFeed = debounce( async () => {
      await feedStore.clearListFeed()
      await loadFeed(1)
      setCurrentPage(currentPage + 1)
    }, 500)

    const loadFeed = useCallback(async (page: number) => {
      await feedStore.getListFeeds(page)
      setListFeeds(feedStore.listFeeds)
    }, [])

    const onLoadMore = React.useCallback(async () => {
      if(currentPage > 1){
        await loadFeed(currentPage)
        setCurrentPage(currentPage + 1)
      }
    }, [currentPage]);

    const onRefresh = React.useCallback(async() => {
      firstLoadFeed()
    }, []);

    useEffect(() => {
      if(currentPage === 1){
        firstLoadFeed()
      }
    }, [])
    //
    // useFocusEffect(
    //   React.useCallback(() => {
    //     onRefresh()
    //   }, [])
    // );

    // useEffect(() => {
    //   if(isFocused === false){
    //     setCurrentPage(1)
    //     feedStore.clearListFeed()
    //     setListFeeds([])
    //   }
    // }, [isFocused])

    // useEffect(()=>{
    //   if(feedStore.refreshData || route.params?.newPost){
    //     setTimeout(()=>{
    //       firstLoadFeed()
    //     }, 100)
    //   }
    // },[route.params?.newPost,feedStore.refreshData])

    useEffect(() => {
      // setListFeeds([])
      // setListFeeds(feedStore.listFeeds)
      setNewNotif(feedStore.newNotif)
      console.log('feedStore.newNotif ', feedStore.newNotif)
      console.log('newNotif ', newNotif)

    }, [listFeeds, feedStore.getListFeedsSuccess, feedStore.newNotif, newNotif])

    const onImageFeedTap = useCallback( (index, imageList) => {
      setActiveViewerIndex(index)
      setListImageViewer(imageList)
      toggleModal(true);
    }, [])

    const reportPost = async () => {
      await feedApi.reportPost(selectedPostId)
      firstLoadFeed()
      actionSheetRef.current?.setModalVisible(false)
    }

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
                <VStack top={Spacing[14]}>
                  <HStack 
                    horizontal={Spacing[12]}
                    vertical={Spacing[14]}
                    style={{
                      backgroundColor: Colors.ABM_BG_BLUE,
                      borderRadius: Roundness.lm,
                      borderColor: Colors.ABM_LIGHT_BLUE,
                      borderWidth: Spacing[2]
                    }}>
                    <Text 
                      type={"body"}
                      style={{color: Colors.ABM_MAIN_BLUE}}
                    >
                       Sebelum posting, lihat dulu yuk konten apa yang bisa di-post di Feed!{' '}
                    <TouchableOpacity onPress={goToGuideline}>
                      <VStack style={{top: Spacing[4]}}>
                        <Text
                          type={"body-bold"}
                          style={{color: Colors.ABM_MAIN_BLUE}}
                          underlineWidth={Spacing[112]}>
                          Baca guideline Feed.
                        </Text>
                        <TextYellowLine underlineWidth={120} color={Colors.ABM_GREEN}/>
                      </VStack>
                    </TouchableOpacity>
                    </Text>
                  </HStack>
                </VStack>
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
                  goToDetail={goToDetails}
                  ownPost={false}
                  showMoreIcon={true}
                  triggerMore={(id) => openBottomSheet(id)}
                />)
            }}
            style={{paddingHorizontal: Spacing[24]}}
            keyExtractor={item => item.id}
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.1}
          />
        </SafeAreaView>
        <FeedButton
          goToNewPost={goToNewPost}
          goToMyFeed={goToMyfeed}
          goToCommentList={goToCommentList}
          leftCounter={null}
          rightCounter={newNotif}
        />
        <Modal
          visible={modal}
          transparent={true}
          onRequestClose={() => toggleModal(false)}
        >
          <VStack style={styles.imageViewerOuter}>
            <SafeAreaView>
              <TouchableOpacity style={styles.closeImgViewerContainer} onPress={() => toggleModal(false)}>
                <Close width={Spacing[24]} height={Spacing[24]} />
              </TouchableOpacity>
            </SafeAreaView>
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
          </VStack>
        </Modal>
        <ActionSheet ref={actionSheetRef}>
          <VStack
            style={{ justifyContent: "center" }}
            vertical={Spacing[24]}
            horizontal={Spacing[24]}
          >
            <VStack style={[Layout.widthFull, Layout.flexCenter]} bottom={Spacing[12]}>
              <Text
                type={"body-bold"}
                style={{}}
                text={`Menu lainnya`}
              />
            </VStack>
            <Button
              onPress={() => {
                reportPost()
              }}
              type={"warning"}
              text={"Laporkan post ini"}
            />
            <Spacer height={Spacing[12]} />
          </VStack>
        </ActionSheet>
      </VStack>
    )
  },
)

const styles = StyleSheet.create({
  closeImgViewerContainer: {
    alignSelf: 'flex-end',
    marginRight: Spacing[16],
    marginTop: Spacing[16],
  },
  imageViewerOuter: {
    backgroundColor: Colors.BLACK,
    flex: 1,
  },
});

export default FeedTimelineMain
