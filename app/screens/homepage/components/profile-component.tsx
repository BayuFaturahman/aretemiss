import React, { useEffect, useState } from "react";
import {HStack, VStack} from "@components/view-stack";
import {Colors, Spacing} from "@styles"
import FastImage, { Source } from "react-native-fast-image";
import {Text} from "@components";
import Spacer from "@components/spacer";

import { IleadLogo } from "@assets/svgs"

import nullProfileIcon from "@assets/icons/settings/null-profile-picture.png";

export type ProfileItemType = {
  avatarUrl: string
  user: {
    name: string
    title: string
  }
}

type ProfileProps = {
  data: ProfileItemType
}

export const ProfileComponent = ({data}: ProfileProps) => {
    
  return(
    <>
    <HStack horizontal={Spacing[2]}>
       <HStack>
        <FastImage style={{
          height: Spacing[64],
          width: Spacing[64],
          borderRadius: Spacing[8]
        }} source={data.avatarUrl === '' ? nullProfileIcon : {uri: data.avatarUrl}} resizeMode={"cover"}/>
        <VStack left={Spacing[8]}>
          <Text type={'body-bold'} text={data.user.name} />
          <Text type={'body'} style={{fontSize: Spacing[12], maxWidth: Spacing[256]}} text={data.user.title} />
        </VStack>
       </HStack>
       <Spacer />
    </HStack>
    </>
  )

}
