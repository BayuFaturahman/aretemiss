import React, {Fragment, ReactElement, useEffect, useState} from "react"
import { HStack, VStack } from "@components/view-stack"
import { Colors, Spacing } from "@styles"
import {ActivityIndicator, RefreshControl, TouchableOpacity, View} from "react-native"
import FastImage, { Source } from "react-native-fast-image"
import {Text, TextYellowLine} from "@components"
import Spacer from "@components/spacer"
import nullProfileIcon from "@assets/icons/settings/null-profile-picture.png"
import {FeedItemType, ReactionType} from "../feed.type"
import VideoPlayer from "react-native-video-player"

import trash from "@assets/icons/trash.png";
import moment from "moment"
import {Hyperlink} from "react-native-hyperlink";
import {AngryColor, HappyColor, HeartColor, HeartGrey, IconLike, IconSadColor} from "@assets/svgs";
import {useStores} from "../../../bootstrap/context.boostrap";
import RNAnimated from "react-native-animated-component"

type FeedPostProps = {
  data: FeedItemType;
  onImageTap(index, imageList): void;
  goToDetail(data: FeedItemType): void;
  ownPost: boolean;
  deletePost?(id): void;
  isFromHomePage?: boolean;
}

type LikeIconListItemType = {element: React.FC<any>, reaction: ReactionType}

const LIKE_ICON_LIST:LikeIconListItemType[] = [
  {
    element: HeartColor,
    reaction: "love"
  },
  {
    element: IconLike,
    reaction: "thumbsUp"
  },
  {
    element: HappyColor,
    reaction: "happy"
  },
  {
    element: IconSadColor,
    reaction: "sad"
  },
  {
    element: AngryColor,
    reaction: "angry"
  }
]

type FeedReactionIcon = ReactionType | "heartGrey"

const LikeIconComponent:React.FC<{type: FeedReactionIcon, size: number}> = ({type = "heartGrey", size = 24}) => {
  if(type === "heartGrey") {
    return <HeartGrey width={Spacing[size]} height={Spacing[size]} />
  }
  else if(type === "love") {
    return <HeartColor width={Spacing[size]} height={Spacing[size]} />
  }
  else if(type === "thumbsUp") {
    return <IconLike width={Spacing[size]} height={Spacing[size]} />
  }
  else if(type === "happy") {
    return <HappyColor width={Spacing[size]} height={Spacing[size]} />
  }
  else if(type === "sad") {
    return <IconSadColor width={Spacing[size]} height={Spacing[size]} />
  }
  else if(type === "angry") {
    return <AngryColor width={Spacing[size]} height={Spacing[size]} />
  }
  return <></>
}

export const FeedPost = ({ data, onImageTap, ownPost = false, deletePost, goToDetail = () => null, isFromHomePage }:FeedPostProps) => {

  const { feedApi, mainStore } = useStores();

  const [isLikeModal, setIsLikeModal] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentLike, setCurrentLike] = useState<FeedReactionIcon>("heartGrey")

  const listImage = data.imageUrl ? data.imageUrl.split(";") : []

  useEffect(()=>{
    if(mainStore.userProfile.user_id !== null && mainStore.userProfile.user_id !== "" && data.feedReactions.length > 0){
      const ownCurrentLike:FeedReactionIcon =
        data.feedReactions.find((value) => value.feed_react_author_id === mainStore.userProfile.user_id).feed_react_reaction ?? "heartGrey"
      setCurrentLike(ownCurrentLike)
    }
  }, [data.feedReactions, mainStore.userProfile.user_id])

  const imageListViewer = listImage.map((item)=>{
    return(
      {
        url : item
      }
    )
  })

  const imageBeingTap = React.useCallback((index) => {
    onImageTap(index, imageListViewer)
    console.log(index)
    console.log(imageListViewer)
  }, []);

  if (data === null) {
    return null
  }

  const getImage = (height, width, marginRight, marginBottom, image, imageIndex) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={isFromHomePage}
        style={{
          marginBottom: marginBottom,
          height: height,
          width: width,
        }}
        onPress={()=>{
          imageBeingTap(imageIndex)
      }}>
        <FastImage
          style={{
            flex: 1,
            borderRadius: Spacing[12]
          }}
          source={image !== '' ? {
            uri: image
          }: nullProfileIcon }
        />
      </TouchableOpacity>
    )
  }

  const verticalImages = (containerWidth, image1, image2, imageIndex) => {
    return (
      <VStack
        top={0}
        style={{
          width: containerWidth,
        }}
      >
        {getImage(Spacing[67], "100%", 0, 10, image1, imageIndex[0])}
        {getImage(Spacing[67], "100%", 0, 0, image2, imageIndex[1])}
      </VStack>
    )
  }

  const coverImage = () => {

    if(data.thumbnail !== null && data.thumbnail !== ""){
      return(
        <VideoPlayer
          video={{ uri: data.imageUrl }}
          videoWidth={1600}
          videoHeight={900}
          thumbnail={{ uri: data.thumbnail }}
        />
      )
    }

    // console.log('list image: ', listImage, ' total: ', listImage.length)
    if (listImage.length === 0) {
      return null
    }

    if (listImage.length === 2) {
      return (
        <HStack
          style={{
            marginTop: 20,
            justifyContent: "space-between",
          }}
        >
          {listImage.map((data, index) => {
            return getImage(Spacing[144], "49%", 0, 0, data, index)
          })}
        </HStack>
      )
    } else if (listImage.length === 3) {
      return (
        <HStack
          style={{
            marginTop: 20,
            justifyContent: "space-between",
          }}
        >
          {getImage(Spacing[144], "57%", 10, 0, listImage[0], 0)}
          {verticalImages("40%", listImage[1], listImage[2], [1,2])}
        </HStack>
      )
    } else if (listImage.length === 4) {
      return (
        <HStack
          style={{
            marginTop: 20,
            justifyContent: "space-around",
          }}
        >
          {verticalImages("48%", listImage[0], listImage[1], [0,1])}
          {verticalImages("48%", listImage[2], listImage[3], [2,3])}
        </HStack>
      )
    } else {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isFromHomePage}
          style={{
            height: Spacing[128],
            borderRadius: Spacing[12],
          }}
          onPress={()=>{
            imageBeingTap(0)
          }}>
          <FastImage
            style={{
              height: Spacing[128],
              borderRadius: Spacing[12],
            }}
            source={data.imageUrl !== '' ? {
              uri: data.imageUrl
            }: null }
            resizeMode={"cover"}
          />
        </TouchableOpacity>
      )
    }
  }

  const getCreatedTime = () => {
    const currDate = new Date()
    const createdDate = new Date(data.createdAt)

    const timeDiff = currDate.getTime() - createdDate.getTime()

    const dayDiff = timeDiff/ (1000 * 3600 * 24);
    const hrsDiff = Math.floor((timeDiff % 86400000) / 3600000); // hours
    const minDiff = Math.floor(((timeDiff % 86400000) % 3600000) / 60000) // min

    if (dayDiff === 1 ) {
      return Math.floor(dayDiff) + ' day ago'
    } 

    if (dayDiff > 30 ) {
      return moment(createdDate).format("DD MMM yyyy")
    }
    if (dayDiff > 1 ) {
      return Math.floor(dayDiff) + ' days ago'
    } 

    if (hrsDiff === 1) {
      return hrsDiff + ' hour ago'
    } 
    
    if (hrsDiff > 1) {
      return hrsDiff + ' hours ago'
    } 

    if (minDiff === 1) {
      return minDiff + ' min  ago'
    }

    if (minDiff > 1) {
      return minDiff + ' mins  ago'
    }

    if (minDiff === 0) {
      return 'baru saja'
    }

    return ""
  }


  return (
    <Fragment>
      <HStack>
        <Text
          type={"body-bold"}
          style={{ fontSize: Spacing[12], color: Colors.ABM_LIGHT_BLUE }}
          underlineWidth={Spacing[72]}
          text={`${data.type !== null ? data.type: ''}`}
        /> 
        <Spacer width={Spacing[8]} />

        <View
          style={{
            flex: 1,
            width: "100%",
            height: Spacing[1],
            backgroundColor: Colors.ABM_YELLOW,
          }}
        />
        <Spacer width={Spacing[8]} />
        <Text
          type={"body-bold"}
          style={{ fontSize: Spacing[12] }}
          underlineWidth={Spacing[72]}
          text={`${getCreatedTime()}`}
        />
      </HStack>

      <Spacer height={Spacing[2]} />
      {coverImage()}
      <Spacer height={Spacing[14]} />

      {data.feedReactions.length > 0 &&
        <VStack style={{zIndex: 100}}>
          <HStack style={{position: 'absolute', width: '100%'}}>
            <Spacer />
            <HStack
                vertical={Spacing[4]}
                horizontal={Spacing[4]}
                style={{
                  backgroundColor: Colors.WHITE,
                  top: -Spacing[12],
                  borderRadius: Spacing[12], shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.20,
                  shadowRadius: 1.41,

                  elevation: 2}}
            >
              {data.feedReactions.slice(0,5).map((value) =>
                <HStack horizontal={Spacing[2]}>
                  <LikeIconComponent type={value.feed_react_reaction} size={12} />
                </HStack>
              )}
            </HStack>
          </HStack>
        </VStack>
      }

      <TouchableOpacity onPress={()=>{goToDetail(data)}} disabled={isFromHomePage}>
        <HStack
          style={{ backgroundColor: Colors.ABM_BG_BLUE, borderRadius: Spacing[8] }}
          horizontal={Spacing[12]}
          vertical={Spacing[12]}
        >
          {data.isNew === true ? (
            <View
              style={{
                backgroundColor: Colors.MAIN_RED,
                height: Spacing[12],
                width: Spacing[12],
                borderRadius: 999,
                position: "absolute",
                zIndex: 100,
                top: -Spacing[4],
                left: 0,
              }}
            />
          ) : null}
          <Hyperlink
            linkDefault={ true }
            linkText={ url => `${url.substring(0,25)}...` }
            linkStyle={{color: Colors.ABM_LIGHT_BLUE}}
          >
            <Text type={"body"} >
              {data.description}
            </Text>
          </Hyperlink>
        </HStack>
      </TouchableOpacity>

      <HStack left={Spacing[20]} top={Spacing[8]}>
        { !ownPost ?
          <TouchableOpacity onPress={()=>{goToDetail(data)}} disabled={isFromHomePage}>
            <HStack>
              <FastImage
                style={{
                  left: -Spacing[10],
                  height: Spacing[42],
                  width: Spacing[42],
                  borderRadius: Spacing[8],
                }}
                source={data.author.photo !== '' ? {
                  uri: data.author.photo
                }: nullProfileIcon}
                resizeMode={"cover"}
              />
              <VStack left={Spacing[2]} style={{width: '50%'}}>
                <Text
                  type={"body-bold"}
                  style={{ fontSize: Spacing[14] }}
                  text={data.author.nickname}
                />
                <Text type={"body"} style={{ fontSize: Spacing[10], top: -Spacing[4] }} text={data.author.title} />
              </VStack>
            </HStack>
          </TouchableOpacity>
          :
          <TouchableOpacity
            style={{
              height: Spacing[24],
            }}
            disabled={isFromHomePage}
            onPress={()=>{deletePost(data.id)}}>
            <Spacer height={Spacing[4]} />
            <FastImage
              style={{
                height: Spacing[16],
                width: Spacing[12]
              }}
              source={trash}
              resizeMode={"contain"}
            />
          </TouchableOpacity>
        }
        <Spacer />
        <TouchableOpacity onPress={()=>{goToDetail(data)}} disabled={isFromHomePage}>
          <VStack>
            <VStack style={{ backgroundColor: Colors.ABM_GREEN, paddingHorizontal: Spacing[4], borderRadius: 99}}>
              <Text
                type={"body-bold"}
                style={{ fontSize: Spacing[12], color: Colors.WHITE }}
                underlineWidth={Spacing[64]}
                text={`${data.commentCount} comments`}
              />
            </VStack>
            <Spacer height={Spacing[4]} />
            <TextYellowLine underlineWidth={Spacing[42]} />
          </VStack>
        </TouchableOpacity>
        <VStack left={Spacing[8]}>
          {
            isLikeModal &&
                  <HStack
                      vertical={Spacing[8]}
                      horizontal={Spacing[8]}
                      style={{
                        position: 'absolute', backgroundColor: Colors.WHITE,
                        zIndex: 2, top: -Spacing[32], left: -Spacing[128],
                        borderRadius: Spacing[12], shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.20,
                        shadowRadius: 1.41,

                        elevation: 2}}
                  >
                    {isLoading ?
                      <>
                        <ActivityIndicator size="large" color={Colors.ABM_LIGHT_BLUE} />
                      </> :
                      <>
                        {LIKE_ICON_LIST.map((iconItem, index) =>
                          // <RNAnimated appearFrom={"bottom"} animationDuration={(index + 1) * 100} style={{zIndex: 3}}>
                            <TouchableOpacity
                              style={{zIndex: 4}}
                              onPress={async () => {
                                setIsLoading(true)
                                feedApi.reactToFeed(data.id, iconItem.reaction).then(r => {
                                  setTimeout(resolve => resolve, 1500)
                                  setIsLikeModal(false)
                                  setCurrentLike(iconItem.reaction)
                                  setIsLoading(false)
                                }).finally(()=>{
                                  setIsLoading(false)
                                })
                              }}
                            >
                              <HStack horizontal={Spacing[2]}>
                                {
                                  React.createElement(iconItem.element, {
                                    height: Spacing[24],
                                    width: Spacing[24]
                                  })
                                }
                              </HStack>
                            </TouchableOpacity>
                          // </RNAnimated>
                        )}
                      </>
                    }
                  </HStack>
          }
          <TouchableOpacity onPress={()=>{setIsLikeModal(!isLikeModal)}} disabled={isFromHomePage}>
            <LikeIconComponent type={currentLike} size={24} />
          </TouchableOpacity>
        </VStack>
      </HStack>
      <Spacer height={Spacing[8]} />
    </Fragment>
  )
}
