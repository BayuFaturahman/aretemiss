import React from "react";
import {HStack, VStack} from "@components/view-stack";
import {Colors, Layout, Spacing} from "@styles";
import {TouchableOpacity, View} from "react-native";
import FastImage from "react-native-fast-image";
import {Button, Text} from "@components";
import Spacer from "@components/spacer";
import downArrow from "@assets/icons/down-arrow.png";
import surprised from "@assets/icons/homepage/surprised.png";
import nullProfileIcon from "@assets/icons/settings/null-profile-picture.png";
import sick from "@assets/icons/notifications/sick.png";
import {presets} from "@components/text/text.presets";
import { FeedPost } from "@screens/feed/component/feed-post";

export type FeedItemType = {
  id: string
  imageUrl: string
  author: {
    fullname: string
    nickname: string
    title: string
  }
  description: string
  commentCount: number
  isNew: boolean
  createdAt: string
  updatedAt: string
}


export const EmptyList = ({
                            navigateTo = () => null,
                            imageSource = sick,
                            buttonLabel = 'Kembali'
                          }) => {
  return(
    <VStack horizontal={Spacing[24]} top={Spacing[24]} style={Layout.widthFull}>
      <VStack>
        <HStack bottom={Spacing[12]}>
          <Spacer/>
          <FastImage style={{
            height: Spacing[48],
            width: Spacing[48],
          }} source={imageSource} resizeMode={"contain"}/>
          <Spacer/>
        </HStack>
        <Text type={'body'} style={{textAlign: 'center'}} >
          Belum ada yang 
          <Text type={'body'} style={[{textAlign: 'center', fontStyle: 'italic'}, presets.italic]} > update</Text>
          {`, di Feed nih.\nJadi orang pertama yang`}
          <Text type={'body'} style={[{textAlign: 'center', fontStyle: 'italic'}, presets.italic]} > update</Text>
          {` yuk? `}
        </Text>
        <Spacer height={Spacing[12]} />
        <HStack top={Spacing[12]}>
         <Spacer />
         <VStack style={{maxWidth: Spacing[256], minWidth: Spacing[128]}}>
           <Button
              type={"primary"}
              text={buttonLabel}
              style={{height:Spacing[32], paddingHorizontal: Spacing[8]}}
              textStyle={{fontSize: Spacing[14], lineHeight: Spacing[18]}}
              onPress={navigateTo}
            />
          </VStack>
          <Spacer />
        </HStack>
      </VStack>
    </VStack>
  )
}


export const FeedItemComponent = ({data, goToFeed = ()=> null, goToNewPost = ()=> null}:{data: FeedItemType; goToFeed(): void; goToNewPost(): void}) => {

  if(data === null){
    return(
      <VStack>
        <Text type={'left-header'} style={{fontSize: Spacing[16]}} underlineWidth={Spacing[72]} text="Feed." />
        <Spacer height={Spacing[12]} />
        <Spacer width={Spacing[24]} />
        <EmptyList buttonLabel={'Mau berbagi kisah apa hari ini?'}
                   imageSource={surprised}
                   navigateTo={goToNewPost}/>
        <Spacer height={Spacing[32]} />
      </VStack>
    )
  }

  return(
    <VStack>
      <TouchableOpacity onPress={goToFeed}>
        <Text type={'left-header'} style={{fontSize: Spacing[16]}} underlineWidth={Spacing[72]} text="Feed." />
        <FeedPost data={data} key={data.id}/>
        <HStack>
          <Spacer/>
          {/* <TouchableOpacity onPress={goToFeed}> */}
            <FastImage style={{
              height: Spacing[24],
              width: Spacing[24],
              borderRadius: Spacing[8]
            }} source={downArrow} resizeMode={"contain"}/>
          {/* </TouchableOpacity> */}
          <Spacer/>
        </HStack>
      </TouchableOpacity>
    </VStack>
  )

}
