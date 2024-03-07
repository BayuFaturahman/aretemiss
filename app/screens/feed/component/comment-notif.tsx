import React, { Fragment, useEffect, useState } from "react"
import { HStack, VStack } from "@components/view-stack"
import { Colors, Spacing } from "@styles"
import {TouchableOpacity, View} from "react-native"
import FastImage, { Source } from "react-native-fast-image"
import { Text } from "@components"
import Spacer from "@components/spacer"
import nullProfileIcon from "@assets/icons/settings/null-profile-picture.png"
import { CommentNotificationType } from "../feed.type"

import { dimensions } from "@config/platform.config"

type CommentNotifProps = {
  data: CommentNotificationType;
  goToPostDetail(): void;
}

export const CommentNotif = ({ data, goToPostDetail = () => null }:CommentNotifProps) => {

  return (
    <TouchableOpacity onPress={goToPostDetail}>
    <HStack vertical={Spacing[2]} horizontal={Spacing[8]}>
      <VStack>
        <Spacer height={Spacing[4]}/>
        <FastImage style={{
          height: Spacing[24],
          width: Spacing[24]
        }} source={nullProfileIcon} resizeMode={"cover"}/>
        <Spacer/>
      </VStack>
      <HStack left={Spacing[12]} style={{maxWidth: dimensions.screenWidth - Spacing["72"]}}>
        {data.type === 'comment' ?
          <VStack>
            <Text type={'body'}>
              <Text type={'body-bold'} text={`${data.author.fullName} `} />
              meninggalkan komentar di post Feed-mu:
            </Text>
            <Spacer height={Spacing[4]} />
          </VStack> : null }
        {data.type === 'replied' ?
          <VStack>
            <Text type={'body'}>
              <Text type={'body-bold'} text={`${data.author.fullName} `} />
              replied to you on a comment:
            </Text>
            <Spacer height={Spacing[4]} />
          </VStack> : null }
      </HStack>
    </HStack>
    <HStack horizontal={Spacing[16]} vertical={Spacing[8]} style={{backgroundColor: Colors.GRAY200, borderRadius: Spacing[12], marginLeft: Spacing[32], marginRight: Spacing[8]}}>
      {data.isNew === true ? <View style={{backgroundColor: Colors.MAIN_RED, height: Spacing[12], width: Spacing[12], borderRadius: 999, position: 'absolute', zIndex: 100, right: -Spacing[4], top: -Spacing[4]}} /> : null}
      <VStack>
        <Text type={'body'}>
          {data.replyToNickname !== null? <Text type={'body-bold'} text={`${data.replyToNickname} `} /> : null}
          {data.feedComment}
        </Text>
        <Spacer height={Spacing[4]} />
      </VStack>
    </HStack>
  </TouchableOpacity>
  )
}
