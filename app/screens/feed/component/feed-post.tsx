import React, { useEffect, Fragment } from "react"
import { HStack, VStack } from "@components/view-stack"
import { Colors, Layout, Spacing } from "@styles"
import { View } from "react-native"
import FastImage from "react-native-fast-image"
import { Text } from "@components"
import Spacer from "@components/spacer"
import nullProfileIcon from "@assets/icons/settings/null-profile-picture.png"
import { FeedTimelineItem } from "../feed.type"

export const FeedPost = ({ data }: { data: FeedTimelineItem }) => {
  if (data === null) {
    return {}
  }

  const getImage = (height, width, marginRight, marginBottom, image) => {
    return (
      <FastImage
        style={{
          height: height,
          width: width,
          marginRight: marginRight,
          borderRadius: Spacing[12],
          marginBottom: marginBottom,
        }}
        source={{
          uri: image,
        }}
      />
    )
  }

  const verticalImages = (containerWidth, image1, image2) => {
    return (
      <VStack
        top={0}
        style={{
          width: containerWidth,
        }}
      >
        {getImage(Spacing[67], "100%", 0, 10, image1)}
        {getImage(Spacing[67], "100%", 0, 0, image2)}
      </VStack>
    )
  }

  const coverImage = () => {
    const listImage = data.imageUrl.split(";")
    // console.log('list image: ', listImage, ' total: ', listImage.length)
    if (listImage.length === 2) {
      return (
        <HStack
          style={{
            marginTop: 20,
            justifyContent: "space-between",
          }}
        >
          {listImage.map((data) => {
            return getImage(Spacing[144], "48%", 0, 0, data)
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
          {getImage(Spacing[144], "60%", 10, 0, listImage[0])}
          {verticalImages("40%", listImage[1], listImage[2])}
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
          {verticalImages("47%", listImage[0], listImage[1])}
          {verticalImages("47%", listImage[2], listImage[3])}
        </HStack>
      )
    } else {
      return (
        <FastImage
          style={{
            height: Spacing[128],
            borderRadius: Spacing[12],
          }}
          source={{ uri: data.imageUrl }}
          resizeMode={"cover"}
        />
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
      <HStack left={Spacing[24]} top={Spacing[8]}>
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
        <Spacer />
        <VStack>
          <Text
            type={"right-header"}
            style={{ fontSize: Spacing[12] }}
            underlineWidth={Spacing[64]}
            text={`${data.commentCount} comments`}
          />
          <Spacer />
        </VStack>
      </HStack>
      <Spacer height={Spacing[8]} />
    </Fragment>
  )
}
