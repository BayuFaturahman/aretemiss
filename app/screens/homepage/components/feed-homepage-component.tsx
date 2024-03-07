import React, { useCallback } from "react"
import { HStack, VStack } from "@components/view-stack"
import { Colors, Layout, Spacing } from "@styles"
import { TouchableOpacity, View } from "react-native"
import FastImage from "react-native-fast-image"
import { Button, Text } from "@components"
import Spacer from "@components/spacer"
import downArrow from "@assets/icons/down-arrow.png"
import surprised from "@assets/icons/homepage/surprised.png"
import sick from "@assets/icons/notifications/sick.png"
import { presets } from "@components/text/text.presets"
import { FeedPost } from "@screens/feed/component/feed-post"
import { FeedItemType } from "@screens/feed/feed.type"
import {Man1} from "@assets/svgs";

export const EmptyList = ({
  navigateTo = () => null,
  imageSource = sick,
  buttonLabel = "Kembali",
}) => {
  return (
    <VStack horizontal={Spacing[24]} top={Spacing[24]} style={Layout.widthFull}>
      <VStack>
        <HStack bottom={Spacing[12]}>
          <Spacer />
          {/* <FastImage */}
          {/*  style={{ */}
          {/*    height: Spacing[48], */}
          {/*    width: Spacing[48], */}
          {/*  }} */}
          {/*  source={imageSource} */}
          {/*  resizeMode={"contain"} */}
          {/* /> */}
          <Man1 height={Spacing[256]} width={Spacing[256]} />
          <Spacer />
        </HStack>
        <Text type={"body"} style={{ textAlign: "center" }}>
          Belum ada yang
          <Text
            type={"body"}
            style={[{ textAlign: "center", fontStyle: "italic" }, presets.italic]}
          >
            {" "}
            update
          </Text>
          {`, di Feed nih.\nJadi orang pertama yang`}
          <Text
            type={"body"}
            style={[{ textAlign: "center", fontStyle: "italic" }, presets.italic]}
          >
            {" "}
            update
          </Text>
          {` yuk? `}
        </Text>
        <Spacer height={Spacing[12]} />
        <HStack top={Spacing[12]}>
          <Spacer />
          <VStack style={{ maxWidth: Spacing[256], minWidth: Spacing[128] }}>
            <Button
              type={"primary"}
              text={buttonLabel}
              style={{ height: Spacing[32], paddingHorizontal: Spacing[8] }}
              textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
              onPress={navigateTo}
            />
          </VStack>
          <Spacer />
        </HStack>
      </VStack>
    </VStack>
  )
}

export const FeedItemComponent = ({
  data,
  goToFeed = () => null,
  goToNewPost = () => null,
}: {
  data: FeedItemType
  goToFeed(): void
  goToNewPost(): void
}) => {
  const onImageFeedTap = useCallback((index, imageList) => {
    console.log(index)
    console.log(imageList)
  }, [])

  // return(
  //   <VStack horizontal={Spacing[24]} top={Spacing[24]} style={Layout.widthFull}>
  //     <VStack>
  //       <HStack bottom={Spacing[12]}>
  //         <Spacer/>
  //         <FastImage style={{
  //           height: Spacing[48],
  //           width: Spacing[48],
  //         }} source={surprised} resizeMode={"contain"}/>
  //         <Spacer/>
  //       </HStack>
  //       <Text type={'body'} style={{textAlign: 'center'}} >
  //         Fitur ini masih
  //         <Text type={'body'} style={[{textAlign: 'center', fontStyle: 'italic'}, presets.italic]} > under construction</Text>
  //         , nih. Tunggu tanggal mainnya, ya!
  //       </Text>
  //       <Spacer height={Spacing[12]} />
  //     </VStack>
  //   </VStack>
  // )

  if (data === null || data === undefined) {
    return (
      <VStack>
        <Text
          type={"left-header"}
          style={{ fontSize: Spacing[16] }}
          underlineWidth={Spacing[72]}
          text="Feed."
        />
        <Spacer height={Spacing[12]} />
        <Spacer width={Spacing[24]} />
        <EmptyList
          buttonLabel={"Mau berbagi kisah apa hari ini?"}
          imageSource={surprised}
          navigateTo={goToNewPost}
        />
        <Spacer height={Spacing[32]} />
      </VStack>
    )
  }

  return (
    <TouchableOpacity onPress={goToFeed}>
      <VStack>
        <View>
          <Text
            type={"left-header"}
            style={{ fontSize: Spacing[16] }}
            underlineWidth={Spacing[72]}
            text="Feed."
          />
        </View>
        <TouchableOpacity onPress={goToFeed}>
          <View>
            <FeedPost isFromHomePage={true} data={data} key={data.id} onImageTap={onImageFeedTap} />
          </View>
        </TouchableOpacity>
        <HStack>
          <Spacer />
          <View>
            <FastImage
              style={{
                height: Spacing[24],
                width: Spacing[24],
                borderRadius: Spacing[8],
              }}
              source={downArrow}
              resizeMode={"contain"}
            />
          </View>
          <Spacer />
        </HStack>
      </VStack>
    </TouchableOpacity>
  )
}