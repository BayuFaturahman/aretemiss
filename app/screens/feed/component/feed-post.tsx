import React, { useEffect, Fragment } from "react"
import { HStack, VStack } from "@components/view-stack"
import { Colors, Layout, Spacing } from "@styles"
import { View } from "react-native"
import FastImage from "react-native-fast-image"
import { Text } from "@components"
import Spacer from "@components/spacer"
import nullProfileIcon from "@assets/icons/settings/null-profile-picture.png"
import { FeedTimelineItem } from "../feed.type"

export const FeedPost = ({data}:{data: FeedTimelineItem}) => {

  if (data === null) {
    return {}
  }

  const listImage = data.imageUrl.split(';')
  // console.log('list image: ', listImage, ' total: ', listImage.length)

  const coverImage = () => {
    const listImage = data.imageUrl.split(';')
    // console.log('list image: ', listImage, ' total: ', listImage.length)
    if (listImage.length === 2 ) {
      return (
        <HStack>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              {listImage.map((data) => {
                return (
                  <FastImage
                  style={{ 
                    height: Spacing[144],
                    width: '50%',
                    marginRight: 10,
                    borderRadius: Spacing[12],
                  }}
                  source={{
                    uri: data,
                   }}
                />
                )
              })}
          </View>
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
