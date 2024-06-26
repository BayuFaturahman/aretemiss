import React, {FC, useCallback, useEffect, useState,} from "react"
import {
  FlatList,
  Modal as ModalReact,
  RefreshControl,
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  Text,
  BackNavigation,
  Button
} from "@components"
import Modal from "react-native-modalbox"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {Colors, Layout, Spacing} from "@styles";
import {debounce} from "lodash";

import {useStores} from "../../bootstrap/context.boostrap";
import {EmptyList} from "@screens/notification/components/empty-list";

import {FeedPost} from "@screens/feed/component/feed-post";
import {FeedButton} from "@screens/feed/component/feed-button";
import ImageViewer from "react-native-image-zoom-viewer";
// import {FeedItemType} from "@screens/homepage/components/feed-homepage-component";
import { dimensions } from "@config/platform.config"
import FastImage from "react-native-fast-image"
import sad from "@assets/icons/homepage/sad.png";
import { FeedItemType } from "./feed.type"
import {Close} from "@assets/svgs"

const FEED_EXAMPLE_DATA_ITEM: FeedItemType[] = [
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

const MyFeedList: FC<StackScreenProps<NavigatorParamList, "myFeedList">> = observer(
  ({ navigation, route }) => {
    const { feedStore, mainStore } = useStores()

    const [modal, setModal] = useState<boolean>(false);
    const [isModalDeletePostVisible, setModalDeletePostVisible] = useState<boolean>(false);
    const [selectedPost, setSelectePost] = useState<string>('')

    const [listFeeds, setListFeeds] = useState<Array<FeedItemType>>(feedStore.listMyFeed);
    const [newNotif, setNewNotif] = useState<number>(0);

    const [listImageViewer, setListImageViewer] = useState(images);
    const [activeViewerIndex, setActiveViewerIndex] = useState<number>(0);

    const [currentPage, setCurrentPage] = useState<number>(2);

    const goBack = () => {
      navigation.navigate('feedTimelineMain', {
        newPost: true
      })
    }

    const goToNewPost = () => navigation.navigate("newPost")

    const goToMyfeed = () => navigation.navigate("myFeedList")

    const goToCommentList = () => navigation.navigate("commentList")

    const goToDetails = useCallback(async (data: FeedItemType) => {
      navigation.navigate("postDetails", {
        data,
        isFromMainFeed: false
      })
    }, [])

    const toggleModal = (value: boolean) =>{
      setModal(value)
    }

    const toggleModalDeletePost = () =>{
      setTimeout(() => {
        setModalDeletePostVisible(!isModalDeletePostVisible)
        // setIsClickEditProfile(false)
      }, 100)
    }

    const getListFeeds = useCallback(async () => {
      await feedStore.getListMyFeeds(mainStore.userProfile.user_id)
      
    }, [])

    const firstLoadFeed = debounce( async () => {
      await feedStore.clearListMyFeed()
      await loadFeed(1)
    }, 500)

    const loadFeed = useCallback(async (page: number) => {
      await feedStore.getListMyFeeds(mainStore.userProfile.user_id, page)
      setListFeeds(feedStore.listMyFeed)
    }, [])
    
    const onLoadMore = React.useCallback(async () => {
      console.log('load more feed ')
      await loadFeed(currentPage)
      setCurrentPage(currentPage + 1)
    }, [currentPage]);


    const loadData = debounce( async () => {
      await getListFeeds()
      setListFeeds(feedStore.listMyFeed)
    }, 500)

    useEffect(() => {
      // loadData()
      firstLoadFeed()
    },[])

    const onRefresh = React.useCallback(async() => {
      await firstLoadFeed()
      // await loadData()
    }, []);

    useEffect(() => {
      setNewNotif(feedStore.newNotif)
      setListFeeds(feedStore.listMyFeed)
    }, [setListFeeds, listFeeds, feedStore.getListMyFeedsSuccess, feedStore.listMyFeed, feedStore.newNotif, newNotif])

    const deletePost = React.useCallback(async(id) => {
      setSelectePost(id)
      toggleModalDeletePost()
    }, []);

    const onDeletePost = React.useCallback(async() => {
      feedStore.formReset()
      await feedStore.deletePost(selectedPost)
      if (feedStore.errorCode === null) {
        firstLoadFeed()
      }
      
      toggleModalDeletePost()
    }, [selectedPost, isModalDeletePostVisible]);

    const onImageFeedTap = useCallback( (index, imageList) => {
      setActiveViewerIndex(index)
      setListImageViewer(imageList)
      toggleModal(true);
    }, [])

    return (
      <VStack
        testID="myFeedList"
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
                  text="My Feed."
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
                  ownPost={true}
                  deletePost={deletePost.bind(this, item.id)} 
                  goToDetail={goToDetails}                
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
        <ModalReact
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
        </ModalReact>
        <Modal
          isOpen={isModalDeletePostVisible}
          style={{
            height: "50%",
            width: dimensions.screenWidth - Spacing[28],
            backgroundColor: "rgba(52, 52, 52, 0)",
          }}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <VStack
              style={{
                backgroundColor: Colors.WHITE,
                borderRadius: Spacing[48],
                minHeight: Spacing[256],
                alignItems: "center",
                justifyContent: "center",
              }}
              horizontal={Spacing[24]}
              vertical={Spacing[24]}
            >
              <VStack horizontal={Spacing[24]} top={Spacing[54]} style={Layout.widthFull}>
                <VStack>
                  <HStack bottom={Spacing[20]}>
                    <Spacer />
                    <FastImage
                      style={{
                        height: Spacing[64],
                        width: Spacing[64],
                      }}
                      source={sad}
                      resizeMode={"contain"}
                    />
                    <Spacer />
                  </HStack>
                  <Text
                    type={"body-bold"}
                    style={{ fontSize: Spacing[18], textAlign: "center" }}
                    text={"Hapus update-an kamu?"}
                  />
                  {/* <Spacer height={Spacing[24]} /> */}
                  <Text
                    type={"body"}
                    style={{ textAlign: "center" }}
                    text={`Update-an kamu akan terhapus apabila kamu tekan tombol hapus.`}
                  />
                  <Spacer height={Spacing[20]} />
                  <HStack bottom={Spacing[24]}>
                    <Spacer />
                    <VStack style={{ width: '100%' }}>
                      <Button
                        type={"warning"}
                        text={"Hapus"}
                        style={{ height: Spacing[32], paddingHorizontal: Spacing[8], width: '100%' }}
                        textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                        onPress={onDeletePost}
                      />
                      <Spacer height={Spacing[12]} />
                      <Button
                        type={"transparent"}
                        text={"Kembali"}
                        style={{ height: Spacing[32], paddingHorizontal: Spacing[8] }}
                        textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                        onPress={toggleModalDeletePost}
                      />
                    </VStack>
                    <Spacer />
                  </HStack>
                </VStack>
              </VStack>
            </VStack>
          </View>
        </Modal>
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

export default MyFeedList;
