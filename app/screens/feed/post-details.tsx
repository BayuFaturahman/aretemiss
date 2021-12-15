import React, {FC, useCallback, useEffect, useRef, useState,} from "react"
import {
  FlatList,
  Modal,
  Platform,
  RefreshControl,
  SafeAreaView,
  Text as ReactNativeText,
  TouchableOpacity,
  View
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  Text,
  BackNavigation, TextField, Button
} from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { VStack, HStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {Colors, Layout, Spacing} from "@styles";

import {useStores} from "../../bootstrap/context.boostrap";

import {FeedPost} from "@screens/feed/component/feed-post";
import ImageViewer from "react-native-image-zoom-viewer";
import {FeedPostCommentType, FeedTimelineItem} from "@screens/feed/feed.type";
import KeyboardStickyView from "@components/keyboard-sticky-view";
import FastImage from "react-native-fast-image";
import {phoneType} from "@config/platform.config";
import nullProfileIcon from "@assets/icons/settings/null-profile-picture.png";
import {clear} from "@utils/storage";
import {presets} from "@components/text/text.presets";

import {debounce} from "lodash";

const FEED_EXAMPLE_DATA_ITEM: FeedTimelineItem = {
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
  comments: [
    {
      id: '0',
      author: {
        id: '0',
        fullname: 'Mr. Tomo Kaneki',
        nickname: 'Tomo',
        title: 'Operational Manager',
        imageUrl:
          "https://www.gstatic.com/webp/gallery/4.jpg",
      },
      comment: 'That’s a clever idea, Eva. Well done.',
      isOwnComment: false,
      feedId: '0',
      createdAt: "2021-09-24T10:39:39.000Z",
      updatedAt: "2021-09-24T10:39:39.000Z",
      isDeleted: 0,
      mentionTo: ""
    },
    {
      id: '1',
      author: {
        id: '0',
        fullname: 'Mr. Joni Hoki',
        nickname: 'Tomo',
        title: 'Operational Manager',
        imageUrl:
          "https://www.gstatic.com/webp/gallery/4.jpg",
      },
      comment: 'Nice! I’ve tried this strategy before, but it did not really made a difference on my team. Would you recommend me how to do it differently?',
      isOwnComment: true,
      feedId: '0',
      createdAt: "2021-09-24T10:39:39.000Z",
      updatedAt: "2021-09-24T10:39:39.000Z",
      isDeleted: 0,
      mentionTo: ""
    },
    {
      id: '2',
      author: {
        id: '0',
        fullname: 'Mr. Tomo Kaneki',
        nickname: 'Tomo',
        title: 'Operational Manager',
        imageUrl:
          "https://www.gstatic.com/webp/gallery/4.jpg",
      },
      comment: 'That’s a clever idea, Eva. Well done.',
      isOwnComment: false,
      feedId: '0',
      createdAt: "2021-09-24T10:39:39.000Z",
      updatedAt: "2021-09-24T10:39:39.000Z",
      isDeleted: 0,
      mentionTo: "Layla Fathimah"
    },
  ],
}

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

const PostDetails: FC<StackScreenProps<NavigatorParamList, "postDetails">> = observer(
  ({ navigation, route }) => {

    const replyInputRef = useRef(null);

    const { data } = route.params;
    const { feedStore, mainStore } = useStores()

    const [modal, setModal] = useState<boolean>(false);
    const [listComment, setListComment] = useState<Array<FeedPostCommentType>>(feedStore.listComment);
    const [currentPage, setCurrentPage] = useState<number>(2);

    const [postDetails, setPostDetails] = useState<FeedTimelineItem>(FEED_EXAMPLE_DATA_ITEM);

    const [listImageViewer, setListImageViewer] = useState(images);
    const [activeViewerIndex, setActiveViewerIndex] = useState<number>(0);

    const [replyInput, setReplyInput] = React.useState<string>('');
    const [isReplyFocus, setIsReplyFocus] = React.useState<boolean>(false);
    const [isReplyingComment, setIsReplyingComment] = React.useState<boolean>(
      false,
    );

    const [replyId, setReplyId] = React.useState<string>(null);
    const [replyToName, setReplyToName] = React.useState<string>(null);

    const [holdPost, setHoldedPost] = useState<string>();

    const toggleModal = (value: boolean) =>{
      setModal(value)
    }

    const firstLoadComment = debounce( async () => {
      await feedStore.clearListComment()
      await loadComment(1)
    }, 500)

    const loadComment = useCallback(async (page: number) => {
      await feedStore.getListComment(mainStore.userProfile.user_id, data.id)
      setListComment(feedStore.listComment)
    }, [])

    const onLoadMore = React.useCallback(async () => {
      console.log('load more feed ')
      await loadComment(currentPage)
      setCurrentPage(currentPage + 1)
    }, [currentPage]);

    const onRefresh = React.useCallback(async() => {
      console.log('On refresh post detail ')
      firstLoadComment()
    }, []);

    useEffect(() => {
      console.log('Use effect list feed tanpa []')
      firstLoadComment()      
    }, [])

    useEffect(()=>{
      console.log('feedStore.refreshData ', feedStore.refreshData)
      if(feedStore.refreshData ){        
        setTimeout(()=>{
          firstLoadComment()
        }, 100)
      }
    },[feedStore.refreshData])

    useEffect(() => {
      setListComment([])
      setListComment(feedStore.listComment)
    }, [listComment, feedStore.getListCommentSuccess])

    const deletePost = React.useCallback(async(id) => {
      console.log('delete post')
      console.log(id)
    }, []);

    const goBack = () => navigation.goBack()

    const goToNewPost = () => navigation.navigate("newPost")

    const goToMyfeed = () => navigation.navigate("myFeedList")

    const goToCommentList = () => navigation.navigate("commentList")

    const getListFeed = useCallback(async () => {
      await feedStore.getListFeeds()
    }, [])

    const onImageFeedTap = useCallback( (index, imageList) => {
      setActiveViewerIndex(index)
      setListImageViewer(imageList)
      toggleModal(true);
    }, [])

    const replyInputFocus = () => {
      // @ts-ignore
      replyInputRef.current?.focus();
    };

    const replyInputBlur = () => {
      // @ts-ignore
      replyInputRef.current?.blur();
    };

    const clearMention = () => {
      setIsReplyingComment(false)
      setReplyId(null)
      setReplyToName(null)
    };

    const replyingTo = (replyId: string, replyName: string) => {
      setIsReplyingComment(true)
      setReplyId(replyId)
      setReplyToName(replyName)
    };

    const replyInputComponent = () => {
      return (
        <KeyboardStickyView
          style={{
              backgroundColor: Colors.WHITE,
              borderTopWidth: Spacing[1],
              borderColor: Colors.GRAY300,
            }}>
          <VStack
            horizontal={Spacing[16]}
            style={[Layout.widthFull, Layout.flex]}>
            {/* clear reply to comment */}
            {(isReplyingComment && replyId !== "") && (
              <HStack
                top={Spacing[12]}
                style={{backgroundColor: Colors.WHITE}}>
                <Text style={[Layout.flex,{
                  fontSize: Spacing[16],
                  lineHeight: Spacing[24]}]}
                      type="body">
                  {`${'Replying to '}`}
                  {/* Replied User */}
                  {`@${replyToName}`}
                </Text>
                 <TouchableOpacity
                  onPress={() => clearMention()}
                 >
                  <Text style={[Layout.flex,{
                    fontSize: Spacing[16],
                    lineHeight: Spacing[24]}]}
                        type="body-bold">
                    X
                  </Text>
                 </TouchableOpacity>
              </HStack>
            )}
            <TextField
              isRequired={false}
              autoCapitalize={'none'}
              multiline
              autoFocus={false}
              value={replyInput}
              maxLength={1000}
              onChangeText={(text) => setReplyInput(text)}
              ref={replyInputRef}
              autoCorrect={false}
              style={Layout.widthFull}
              placeholder={'Write a reply...'}
              // placeholderTextColor={Colors.BLACK_30}
              underlineColorAndroid="transparent"
              onFocus={() => setIsReplyFocus(true)}
              onBlur={() => setIsReplyFocus(false)}
            />
          </VStack>
          {
            isReplyFocus ?
              <HStack horizontal={Spacing[24]}>
                <TouchableOpacity onPress={() => {
                  setReplyInput(null)
                  clearMention()
                }}>
                  <Text
                    type={"body"}
                    style={{ fontSize: Spacing[16] }}
                    underlineWidth={Spacing[72]}
                    text="Cancel"
                  />
                </TouchableOpacity>
                <Spacer/>
                <Button
                  type={"primary"}
                  text={"Send"}
                  style={{height:Spacing[32], paddingHorizontal: Spacing[12]}}
                  textStyle={{fontSize: Spacing[14], lineHeight: Spacing[18]}}
                  // onPress={navigateTo}
                />
              </HStack> : <></>
          }
           {Platform.OS === 'ios' ? (
            <Spacer
              height={Spacing[12]}
            />
           ) : (
            <Spacer height={Spacing[20]} />
           )}
        </KeyboardStickyView>
      );
    };

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
                  text="My Feed."
                />
                <FeedPost
                  data={data}
                  onImageTap={onImageFeedTap}
                  ownPost={false}
                  deletePost={deletePost}
                  goToDetail={()=>null}
                />
              </VStack>
            }
            ListFooterComponent={
              <Spacer height={Spacing[256] + (isReplyFocus === true ? Spacing[256] : 0)} />
            }
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={()=> <Spacer height={Spacing[8]} />}
            data={listComment}
            ListEmptyComponent={()=>
              <Text
                type={"body"}
                style={{ fontSize: Spacing[16] }}
                underlineWidth={Spacing[72]}
                text="no comment yet"
              />
            }
            renderItem={({item, index})=> {

              const profileComponent = () => {
                return(
                  <>
                    <VStack right={Spacing[8]}>
                      <Text
                        type={"body-bold"}
                        style={{ fontSize: Spacing[14] }}
                        text={item.author.nickname}
                      />
                      <Text
                        type={"body"}
                        style={{ fontSize: Spacing[14] }}
                        text={item.author.title}
                      />
                    </VStack>
                    <FastImage
                      style={{
                        height: Spacing[32],
                        width: Spacing[32],
                        borderRadius: Spacing[8],
                      }}
                      source={item.author.photo !== '' ? {
                        uri: item.author.photo
                      }: nullProfileIcon}
                      resizeMode={"cover"}
                    />
                    {/* TODO Mood Icon */}
                  </>
                )
              }

              const ownProfileComponent = () => {
                return(
                  <>
                   <FastImage
                      style={{
                        height: Spacing[32],
                        width: Spacing[32],
                        borderRadius: Spacing[8],
                      }}
                      source={item.author.photo !== '' ? {
                        uri: item.author.photo
                      }: nullProfileIcon}
                      resizeMode={"cover"}
                    />
                    <VStack left={Spacing[8]}>
                      <Text
                        type={"body-bold"}
                        style={{ fontSize: Spacing[14] }}
                        text={item.author.nickname}
                      />
                      <Text
                        type={"body"}
                        style={{ fontSize: Spacing[14] }}
                        text={item.author.title}
                      />
                    </VStack>
                   
                    {/* TODO Mood Icon */}
                  </>
                )
              }

              const replyButton = () => {
                return(
                  <TouchableOpacity onPress={() => {
                    replyingTo(item.author.id, item.author.nickname)
                  }}>
                    <Text
                      type={"body"}
                      style={{ fontSize: Spacing[12] }}
                      underlineWidth={Spacing[72]}
                      text="Reply"
                    />
                    <Spacer/>
                  </TouchableOpacity>
                )
              }

              return (
                <VStack left={Spacing[24]}>
                  <HStack
                    style={{ backgroundColor: Colors.LIGHT_GRAY, borderRadius: Spacing[8] }}
                    horizontal={Spacing[12]}
                    vertical={Spacing[12]}
                  >
                    <Text
                      type={"body"}
                    >
                      {item.replyToNickname !== "" ?
                        <VStack right={Spacing[4]}>
                          <Text
                            style={{fontSize: Spacing[14]}}
                            type={"body-bold"}
                            text={`@${item.replyToNickname}`}
                          />
                        <View style={{height: Spacing[2], backgroundColor: Colors.MAIN_RED, width: '100%', position: 'absolute', bottom: 0}}></View>
                      </VStack> : <></>}
                      {item.comment}
                    </Text>
                  </HStack>
                  <Spacer height={Spacing[8]} />
                  <HStack>
                    {item.isOwnComment ?
                      <>
                        {ownProfileComponent()}
                        <Spacer/>
                        {replyButton()}
                      </> :
                      <>
                        {replyButton()}
                        <Spacer/>
                        {profileComponent()}
                      </>
                    }
                  </HStack>
                </VStack>
                )
            }}
            style={{paddingHorizontal: Spacing[24]}}
            keyExtractor={item => item.id}
          />
        </SafeAreaView>

        {replyInputComponent()}

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

export default PostDetails;