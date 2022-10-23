import React, { Fragment, useEffect, useState } from "react"
import { HStack, VStack } from "@components/view-stack"
import { Colors, Spacing } from "@styles"
import {TouchableOpacity, View} from "react-native"
import FastImage, { Source } from "react-native-fast-image"
import {Text, TextYellowLine} from "@components"
import Spacer from "@components/spacer"
import nullProfileIcon from "@assets/icons/settings/null-profile-picture.png"
import { FeedItemType } from "../feed.type"

import trash from "@assets/icons/trash.png";
import moment from "moment"
import {Hyperlink} from "react-native-hyperlink";
import {AngryColor, HappyColor, HeartColor, HeartGrey, IconLike, IconSadColor} from "@assets/svgs";

type FeedPostProps = {
  data: FeedItemType;
  onImageTap(index, imageList): void;
  goToDetail(data: FeedItemType): void;
  ownPost: boolean;
  deletePost?(id): void;
  isFromHomePage?: boolean;
}

const LIKE_ICON_LIST = [
  HeartColor,
  IconLike,
  HappyColor,
  IconSadColor,
  AngryColor
]

export const FeedPost = ({ data, onImageTap, ownPost = false, deletePost, goToDetail = () => null, isFromHomePage }:FeedPostProps) => {

  const [isLikeModal, setIsLikeModal] = useState(false)

  const listImage = data.imageUrl ? data.imageUrl.split(";") : []

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

    // return dayDiff
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
      <Spacer height={Spacing[8]} />
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
            linkText={ url => `${url.substring(0,25)}...` }>
            <Text type={"body"} text={data.description} />
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
          <HStack
            vertical={Spacing[8]}
            horizontal={Spacing[8]}
            style={{
              display: isLikeModal ? 'flex' : 'none',
              position: 'absolute', backgroundColor: Colors.WHITE,
              zIndex: 100, top: -Spacing[32], left: -Spacing[128],
            borderRadius: Spacing[12], shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.20,
              shadowRadius: 1.41,

              elevation: 2}}>
            {LIKE_ICON_LIST.map((iconItem)=>
              <TouchableOpacity
                onPress={()=>{setIsLikeModal(false)}}
              >
                <HStack horizontal={Spacing[2]}>
                  {
                    React.createElement(iconItem, {
                      height: Spacing[24],
                      width: Spacing[24]
                    })
                  }
                </HStack>
              </TouchableOpacity>
            )}
          </HStack>
          <TouchableOpacity onPress={()=>{setIsLikeModal(!isLikeModal)}} disabled={isFromHomePage}>
            <HeartGrey width={Spacing[24]} height={Spacing[24]} />
          </TouchableOpacity>
        </VStack>
      </HStack>
      <Spacer height={Spacing[8]} />
    </Fragment>
  )
}
