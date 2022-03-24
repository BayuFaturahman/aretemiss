import React, {FC, useCallback, useEffect, useRef, useState,} from "react"
import {
  FlatList,
  Modal as ModalReact,
  Platform,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  View,
  StyleSheet,
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
import {dimensions} from "@config/platform.config";

import nullProfileIcon from "@assets/icons/settings/null-profile-picture.png";
import trash from "@assets/icons/trash.png";
import terkejut from "@assets/icons/mood/kaget.png";
import {Close} from "@assets/svgs"

import Spinner from "react-native-loading-spinner-overlay"

import {debounce} from "lodash";
import Modal from "react-native-modalbox"

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

    const { data, isFromMainFeed } = route.params;
    const { feedStore, mainStore } = useStores()

    const [modal, setModal] = useState<boolean>(false);
    const [isModalDeleteCommentVisible, setModalDeleteCommentVisible] = useState<boolean>(false);
    const [selectedComment, setSelecteComment] = useState<string>('')
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
    let listViewRef;

    const toggleModal = (value: boolean) =>{
      setModal(value)
    }

    const toggleModalDeleteComment = () =>{
      setTimeout(() => {
        setModalDeleteCommentVisible(!isModalDeleteCommentVisible)
      }, 100)
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

    const goBack = () => {
      if (isFromMainFeed) {
        navigation.navigate('feedTimelineMain', {
          newPost: true
        })
      } else {
        navigation.goBack()
      }
    }

    // const goToNewPost = () => navigation.navigate("newPost")

    // const goToMyfeed = () => navigation.navigate("myFeedList")

    // const goToCommentList = () => navigation.navigate("commentList")

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
              inputStyle={{textAlign: 'left', paddingLeft: Spacing[10]}}
              placeholder={'Write a reply...'}
              // placeholderTextColor={Colors.BLACK_30}
              underlineColorAndroid="transparent"
              onFocus={() => {
                setIsReplyFocus(true)
                console.log('skroll to end ', listViewRef.hei)
                listViewRef.scrollToEnd({ animated: true });
              }}
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
                  onPress={submitComment}
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

    const submitComment = useCallback(async () => {
      feedStore.formReset()
      feedStore.isLoading = true
      if (replyId === "" || replyId === null) {
        await feedStore.createComment({
          feedId: data.id,
          comment: replyInput
        })
        
      } else {
        await feedStore.createCommentTo({
          feedId: data.id,
          comment: replyInput,
          replyToId: replyId
        })
        clearMention()
      }
     

      if (feedStore.errorCode === null) {
        setReplyInput('')
        firstLoadComment()
        
      } else {
        console.log('feedStore.errorCode: ', feedStore.errorCode, ' : ', feedStore.errorMessage )
      }

    }, [replyInput, setReplyInput, feedStore.errorCode, clearMention])


    const deleteComment = React.useCallback(async(id) => {
      console.log('delete post')
      console.log(id)
      setSelecteComment(id)
      toggleModalDeleteComment()
    }, []);


    const onDeleteComment = React.useCallback(async() => {
      console.log('ON delete post')
      feedStore.formReset()
      await feedStore.deleteComment(selectedComment)
      if (feedStore.errorCode === null) {
        firstLoadComment()
      }
      
      toggleModalDeleteComment()
    }, [selectedComment, isModalDeleteCommentVisible]);

    return (
      <VStack
        testID="feedTimelineMain"
        style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
      >
        <SafeAreaView style={Layout.flex }>
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
                <FeedPost
                  data={data}
                  onImageTap={onImageFeedTap}
                  ownPost={false}
                  deletePost={null}
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

              const profileComponent = (isAuthor = false) => {
                if (isAuthor) {
                  return(
                    <>
                     <HStack>
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
                      </HStack>
                      <VStack right={Spacing[8]} left={Spacing[8]}>
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
                    <HStack>
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
                    </HStack>
                   
                    {/* TODO Mood Icon */}
                  </>
                )
              }

              const replyButton = () => {
                return(
                  <TouchableOpacity onPress={() => {
                    replyingTo(item.id, item.author.nickname)
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
                  <HStack style={{width: '100%'}}>
                    <HStack
                      style={{ backgroundColor: item.isOwnComment ? Colors.UNDERTONE_BLUE: Colors.LIGHT_GRAY,
                        borderRadius: Spacing[8],
                        width:  item.isOwnComment ? '93%': '100%' }}
                      horizontal={Spacing[12]}
                      vertical={Spacing[12]}
                    >
                      <Text
                        type={"body"}
                        style={{color: item.isOwnComment ? Colors.WHITE : Colors.UNDERTONE_BLUE}}
                      >
                        {item.replyToNickname !== "" ?
                          // <VStack right={Spacing[4]}>
                            <Text
                              style={{fontSize: Spacing[14], color: item.isOwnComment ? Colors.WHITE : Colors.MAIN_BLUE}}
                              type={"body-bold"}
                              text={`@${item.replyToNickname} `}
                            />
                          // <View style={{height: Spacing[2], backgroundColor: Colors.MAIN_RED, width: '100%', position: 'absolute', bottom: 0}}></View>
                        // </VStack> 
                        : <></>}
                        {item.comment}
                      </Text>
                    </HStack>
                    {item.isOwnComment ? 
                    <>
                    <Spacer/>
                      <TouchableOpacity
                        style={{
                          height: Spacing[24],
                        }}
                      onPress={deleteComment.bind(this, item.id)}>
                      <Spacer height={Spacing[4]}/>
                      <FastImage
                        style={{
                          // marginLeft: Spacing[14],
                          height: Spacing[18],
                          width: Spacing[14]
                        }}
                        source={trash}
                        resizeMode={"contain"}
                      />
                      </TouchableOpacity>
                      </>
                      : null
                    }
                    
                  </HStack>
                  <Spacer height={Spacing[8]} />
                  <HStack>
                    {item.author.id === data.author.id ?
                      <>
                        {profileComponent(true)}
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
            ref={(ref) => {
              listViewRef = ref;
            }}
          />
        </SafeAreaView>
        <Spinner visible={feedStore.isLoading} textContent={"Memuat..."} />
        {replyInputComponent()}

        <ModalReact
          visible={modal}
          transparent={true}
          onRequestClose={() => toggleModal(false)}
        >
          <VStack style={styles.imageViewerOuter}>
            <TouchableOpacity style={styles.closeImgViewerContainer} onPress={() => toggleModal(false)}>
              <Close width={Spacing[24]} height={Spacing[24]} />
            </TouchableOpacity>
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
          isOpen={isModalDeleteCommentVisible}
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
                      source={terkejut}
                      resizeMode={"contain"}
                    />
                    <Spacer />
                  </HStack>
                  <Text
                    type={"body-bold"}
                    style={{ fontSize: Spacing[18], textAlign: "center" }}
                    text={"Hapus komentar?"}
                  />
                  {/* <Spacer height={Spacing[24]} /> */}
                  <Text
                    type={"body"}
                    style={{ textAlign: "center" }}
                    text={`Yakin komentar kamu mau dihapus?`}
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
                        onPress={onDeleteComment}
                      />
                      <Spacer height={Spacing[12]} />
                      <Button
                        type={"transparent"}
                        text={"Kembali"}
                        style={{ height: Spacing[32], paddingHorizontal: Spacing[8] }}
                        textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                        onPress={toggleModalDeleteComment}
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

export default PostDetails;