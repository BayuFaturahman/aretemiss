import React from "react"
import { HStack, VStack } from "@components/view-stack"
import { Colors, Spacing } from "@styles"
import { TouchableOpacity } from "react-native-gesture-handler"
import FastImage from "react-native-fast-image"
import addFeed from "@assets/icons/feed/addFeed.png"
import timeline from "@assets/icons/feed/timeline.png"

import RNAnimated from "react-native-animated-component"

export const FeedButton = ({ goToNewPost = () => null, goToMyFeed = () => null }) => {
  return (
    <RNAnimated appearFrom={"left"} animationDuration={500}>
      <HStack
        bottom={Spacing[16]}
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
        <TouchableOpacity onPress={goToMyFeed} style={{ zIndex: 1 }}>
          <VStack
            style={{
              height: Spacing[48],
              width: Spacing[48],
              borderRadius: 999,
              alignItems: "center",
              justifyContent: "center",
              marginRight: Spacing[12],
            }}
          >
            <FastImage
              style={{
                height: "100%",
                width: "100%",
              }}
              source={timeline}
              resizeMode={"contain"}
            />
          </VStack>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNewPost} style={{ zIndex: 1 }}>
          <VStack
            style={{
              height: Spacing[64],
              width: Spacing[64],
              borderRadius: 999,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FastImage
              style={{
                height: "100%",
                width: "100%",
              }}
              source={addFeed}
              resizeMode={"contain"}
            />
          </VStack>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNewPost} style={{ zIndex: 1 }}>
          <VStack
            style={{
              height: Spacing[48],
              width: Spacing[48],
              borderRadius: 999,
              alignItems: "center",
              justifyContent: "center",
              marginRight: Spacing[12],
            }}
          >
            <FastImage
              style={{
                height: "100%",
                width: "100%",
              }}
              source={timeline}
              resizeMode={"contain"}
            />
          </VStack>
        </TouchableOpacity>
      </HStack>
    </RNAnimated>
  )
}
