import React, {FC, useCallback, useEffect, useRef, useState,} from "react"
import {FlatList, Modal, Platform, RefreshControl, SafeAreaView, TouchableOpacity} from "react-native"
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
import {FeedItemType} from "@screens/homepage/components/feed-homepage-component";
import {FeedTimelineItem} from "@screens/feed/feed.type";
import KeyboardStickyView from "@components/keyboard-sticky-view";
import FastImage from "react-native-fast-image";
import {phoneType} from "@config/platform.config";
import nullProfileIcon from "@assets/icons/settings/null-profile-picture.png";
import {clear} from "@utils/storage";

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
        fullname: 'Mr. Tomo Kaneki',
        nickname: 'Tomo',
        title: 'Operational Manager'
      },
      comment: 'That’s a clever idea, Eva. Well done.',
      isOwnComment: false,
      feedId: '0',
      createdAt: "2021-09-24T10:39:39.000Z",
      updatedAt: "2021-09-24T10:39:39.000Z",
      isDeleted: 0
    },
    {
      id: '1',
      author: {
        fullname: 'Mr. Tomo Kaneki',
        nickname: 'Tomo',
        title: 'Operational Manager'
      },
      comment: 'Nice! I’ve tried this strategy before, but it did not really made a difference on my team. Would you recommend me how to do it differently?',
      isOwnComment: true,
      feedId: '0',
      createdAt: "2021-09-24T10:39:39.000Z",
      updatedAt: "2021-09-24T10:39:39.000Z",
      isDeleted: 0
    }
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
    const { feedStore } = useStores()

    const [modal, setModal] = useState<boolean>(false);

    const [postDetails, setPostDetails] = useState<FeedTimelineItem>(FEED_EXAMPLE_DATA_ITEM);

    const [listImageViewer, setListImageViewer] = useState(images);
    const [activeViewerIndex, setActiveViewerIndex] = useState<number>(0);

    const [replyInput, setReplyInput] = React.useState<string>('');
    const [isReplyFocus, setIsReplyFocus] = React.useState<boolean>(false);
    const [replyTo, setReplyTo] = React.useState<string>(null);
    const [isReplyingComment, setIsReplyingComment] = React.useState<boolean>(
      true,
    );
    const [holdPost, setHoldedPost] = useState<string>();

    const toggleModal = (value: boolean) =>{
      setModal(value)
    }

    const onRefresh = React.useCallback(async() => {
      // setCoachingData([])
      // await coachingStore.getJournal()
    }, []);

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
            {isReplyingComment && (
              <HStack
                top={Spacing[12]}
                style={{backgroundColor: Colors.WHITE}}>
                <Text style={[Layout.flex,{
                  fontSize: Spacing[16],
                  lineHeight: Spacing[24]}]}
                      type="body">
                  {`${'Replying to '}`}
                  {/* Replied User */}
                  {`@${'Geneva Herrings'}`}
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
              <Spacer height={Spacing[72]} />
            }
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={()=> <Spacer height={Spacing[8]} />}
            data={postDetails.comments}
            ListEmptyComponent={()=>
              <Text
                type={"left-header"}
                style={{ fontSize: Spacing[16] }}
                underlineWidth={Spacing[72]}
                text="My Feed."
              />
            }
            renderItem={({item, index})=> {
              return (
                <VStack>
                  <Text
                    type={"body"}
                    style={{ fontSize: Spacing[16] }}
                    underlineWidth={Spacing[72]}
                    text={item.comment}
                  />
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
