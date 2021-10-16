import React from "react";
import {HStack, VStack} from "@components/view-stack";
import {Spacing} from "@styles";
import FastImage from "react-native-fast-image";
import {Text} from "@components";
import Spacer from "@components/spacer";
import nullProfileIcon from "@assets/icons/settings/null-profile-picture.png";
import smileMood from "@assets/icons/mood/smile.png";

export type MoodItemType = {
  avatarUrl: string
  user: {
    name: string
    title: string
  }
  moodType: string
}

export const MoodComponent = ({data}:{data: MoodItemType}) => {

  return(
    <HStack horizontal={Spacing[2]}>
      <HStack>
        <FastImage style={{
          height: Spacing[64],
          width: Spacing[64],
          borderRadius: Spacing[8]
        }} source={nullProfileIcon} resizeMode={"contain"}/>
        <VStack left={Spacing[8]} right={Spacing[128]}>
          <Text type={'body-bold'} text={data.user.name} />
          <Text type={'body'} text={data.user.title} />
        </VStack>
      </HStack>
      <Spacer />
      {/* Mood Icon */}
      {/* <VStack> */}
      {/*  <FastImage style={{ */}
      {/*    height: Spacing[48], */}
      {/*    width: Spacing[48], */}
      {/*  }} source={smileMood} resizeMode={"contain"}/> */}
      {/*  <HStack > */}
      {/*    <Spacer /> */}
      {/*    <Text type={'right-header'} style={{fontSize: Spacing[12]}} underlineWidth={Spacing[28]} text={'Mood'} /> */}
      {/*    <Spacer /> */}
      {/*  </HStack> */}
      {/* </VStack> */}
    </HStack>
  )

}
