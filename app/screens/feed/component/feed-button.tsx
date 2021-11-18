import React from "react"
import { HStack, VStack } from "@components/view-stack"
import { Colors, Spacing } from "@styles"
import { TouchableOpacity } from "react-native-gesture-handler"
import FastImage from "react-native-fast-image"
import addFeed from "@assets/icons/feed/addFeed.png"
import timeline from "@assets/icons/feed/timeline.png"

import conversation from "@assets/icons/feed/conversation.png"
import newPost from "@assets/icons/feed/newPost.png"
import user from "@assets/icons/feed/user.png"

import RNAnimated from "react-native-animated-component"
import {StyleProp} from "react-native";
import {Text} from "@components";

const SIDE_CONTAINER:StyleProp<any> = {
  height: Spacing[48],
  width: Spacing[48],
  borderRadius: 999,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: Colors.MAIN_BLUE,
  padding: Spacing[8],
}

const MID_CONTAINER:StyleProp<any> = {
  height: Spacing[64],
  width: Spacing[64],
  borderRadius: 999,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: Colors.BRIGHT_BLUE,
  marginHorizontal: Spacing[16]
}

const SHADOW_CONTAINER:StyleProp<any> = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
}

const NEW_ITEM_CONTAINER:StyleProp<any> = {
  zIndex: 10,
  height: Spacing[18],
  width: Spacing[18],
  borderRadius: 999,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: Colors.MAIN_RED,
  overflow:'hidden',
  position: 'absolute',
  top: 0,
  right: 0
}

type FeedButtonProps = {
  goToNewPost(): void
  goToMyFeed(): void
  goToMyProfile(): void
  leftCounter: number
  rightCounter: number
}

export const FeedButton = ({ goToNewPost = () => null, goToMyFeed = () => null, goToMyProfile = () => null, leftCounter = 0, rightCounter = 10 }: FeedButtonProps) => {

  const NotificationCounter = ({text}:{text: number}) => {

    if (text < 1) {
      return <></>
    }

    return(
      <VStack
        style={NEW_ITEM_CONTAINER}
      >
        <Text
          type={"body-bold"}
          style={{ fontSize: Spacing[12], color: 'white' }}
          /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          text={text}
        />
      </VStack>
    )
  }

  return (
    <RNAnimated appearFrom={"bottom"} animationDuration={500}>
      <HStack
        bottom={Spacing[24]}
        alignment={"center"}
        style={{
          width: "100%",
          height: Spacing[48],
          position: "absolute",
          bottom: Spacing[12],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity onPress={goToMyFeed} style={[{ zIndex: 1 }, SHADOW_CONTAINER]}>
          <NotificationCounter text={leftCounter} />
          <VStack
            style={[SIDE_CONTAINER, {overflow: 'hidden'}]}
          >
            <FastImage
              style={{
                height: Spacing[42],
                width: Spacing[42],
                bottom: -Spacing[12],
                zIndex: -1
              }}
              source={user}
              resizeMode={"contain"}
            />
          </VStack>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNewPost} style={[{ zIndex: 1 }, SHADOW_CONTAINER]}>
          <VStack
            style={MID_CONTAINER}
          >
            <FastImage
              style={{
                height: Spacing[36],
                width: Spacing[36],
              }}
              source={newPost}
              resizeMode={"contain"}
            />
          </VStack>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNewPost} style={[{ zIndex: 1 }, SHADOW_CONTAINER]}>
          <VStack
            style={SIDE_CONTAINER}
          >
            <FastImage
              style={{
                height: "100%",
                width: "100%",
              }}
              source={conversation}
              resizeMode={"contain"}
            />
            <NotificationCounter text={rightCounter} />
          </VStack>
        </TouchableOpacity>
      </HStack>
    </RNAnimated>
  )
}
