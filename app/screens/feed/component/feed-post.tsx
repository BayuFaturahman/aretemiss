import React, { Fragment } from "react"
import { HStack, VStack } from "@components/view-stack"
import { Colors, Spacing } from "@styles"
import {TouchableOpacity, View} from "react-native"
import FastImage from "react-native-fast-image"
import { Text } from "@components"
import Spacer from "@components/spacer"
import nullProfileIcon from "@assets/icons/settings/null-profile-picture.png"
import { FeedTimelineItem } from "../feed.type"
import trash from "@assets/icons/trash.png";

type FeedPostProps = {
  data: FeedTimelineItem;
  onImageTap(index, imageList): void;
  goToDetail(data: FeedTimelineItem): void;
  ownPost: boolean;
  deletePost?(id): void;
}

export const FeedPost = ({ data, onImageTap, ownPost = false, deletePost, goToDetail = () => null }:FeedPostProps) => {

  const listImage = data.imageUrl.split(";")

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
          source={{
            uri: image,
          }}
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
            source={{ uri: data.imageUrl }}
            resizeMode={"cover"}
          />
        </TouchableOpacity>
      )
    }
  }

  return (
    <Fragment>
      <HStack>
        <View
          style={{
            flex: 1,
            width: "100%",
            height: Spacing[1],
            backgroundColor: Colors.UNDERTONE_BLUE,
          }}
        />
        <Spacer width={Spacing[8]} />
        <Text
          type={"body"}
          style={{ fontSize: Spacing[12] }}
          underlineWidth={Spacing[72]}
          text="40min ago"
        />
      </HStack>

      <Spacer height={Spacing[2]} />
      {coverImage()}
      <Spacer height={Spacing[8]} />

      <TouchableOpacity onPress={()=>{goToDetail(data)}}>
        <HStack
          style={{ backgroundColor: Colors.LIGHT_GRAY, borderRadius: Spacing[8] }}
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
                left: -Spacing[4],
              }}
            />
          ) : null}
          <Text type={"body"} text={data.description} />
        </HStack>
      </TouchableOpacity>

      <HStack left={Spacing[24]} top={Spacing[8]}>
        { !ownPost ?
          <TouchableOpacity onPress={()=>{goToDetail(data)}}>
            <HStack>
              <FastImage
                style={{
                  height: Spacing[42],
                  width: Spacing[42],
                  borderRadius: Spacing[8],
                }}
                source={nullProfileIcon}
                resizeMode={"contain"}
              />
              <VStack left={Spacing[8]}>
                <Text
                  type={"body-bold"}
                  style={{ fontSize: Spacing[12] }}
                  text={data.author.fullname}
                />
                <Text type={"body"} style={{ fontSize: Spacing[12] }} text={data.author.title} />
              </VStack>
            </HStack>
          </TouchableOpacity>
          :
          <TouchableOpacity
            style={{
              height: Spacing[24],
            }}
            onPress={()=>{deletePost(data.id)}}>
            <Spacer height={Spacing[4]} />
            <FastImage
              style={{
                height: Spacing[16],
                width: Spacing[12]
              }}
              source={trash}
              resizeMode={"cover"}
            />
          </TouchableOpacity>
        }
        <Spacer />
        <TouchableOpacity onPress={()=>{goToDetail(data)}}>
          <VStack>
            <Text
              type={"right-header"}
              style={{ fontSize: Spacing[12] }}
              underlineWidth={Spacing[64]}
              text={`${data.commentCount} comments`}
            />
            <Spacer />
          </VStack>
        </TouchableOpacity>
      </HStack>
      <Spacer height={Spacing[8]} />
    </Fragment>
  )
}
