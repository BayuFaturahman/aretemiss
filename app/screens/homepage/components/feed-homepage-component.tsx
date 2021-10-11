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
          Fitur ini masih
          <Text type={'body'} style={[{textAlign: 'center', fontStyle: 'italic'}, presets.italic]} > under construction</Text>
          , nih. Tunggu tanggal mainnya, ya!
        </Text>
        <Spacer height={Spacing[12]} />
        {/*<HStack top={Spacing[12]}>*/}
        {/*  <Spacer />*/}
        {/*  <VStack style={{maxWidth: Spacing[256], minWidth: Spacing[128]}}>*/}
        {/*    <Button*/}
        {/*      type={"primary"}*/}
        {/*      text={buttonLabel}*/}
        {/*      style={{height:Spacing[32], paddingHorizontal: Spacing[8]}}*/}
        {/*      textStyle={{fontSize: Spacing[14], lineHeight: Spacing[18]}}*/}
        {/*      onPress={navigateTo}*/}
        {/*    />*/}
        {/*  </VStack>*/}
        {/*  <Spacer />*/}
        {/*</HStack>*/}
      </VStack>
    </VStack>
  )
}


export const FeedItemComponent = ({data, goToFeed = ()=> null}:{data: FeedItemType; goToFeed(): void}) => {

  if(data === null){
    return(
      <VStack>
        <Text type={'left-header'} style={{fontSize: Spacing[16]}} underlineWidth={Spacing[72]} text="Feed." />
        <Spacer height={Spacing[12]} />
        <Spacer width={Spacing[24]} />
        <EmptyList buttonLabel={'Mau berbagi kisah apa hari ini?'}
                   imageSource={surprised}/>
        <Spacer height={Spacing[32]} />
      </VStack>
    )
  }

  return(
    <VStack>
      <Text type={'left-header'} style={{fontSize: Spacing[16]}} underlineWidth={Spacing[72]} text="Feed." />
      <HStack>
        <View style={{flex:1, width: '100%', height: Spacing[1], backgroundColor: Colors.UNDERTONE_BLUE}} />
        <Spacer width={Spacing[8]} />
        <Text type={'body'} style={{fontSize: Spacing[12]}} underlineWidth={Spacing[72]} text="40min ago" />
      </HStack>
      <Spacer height={Spacing[2]} />
      <FastImage style={{
        height: Spacing[128],
        borderRadius: Spacing[12]
      }} source={{uri: data.imageUrl}} resizeMode={"cover"}/>
      <Spacer height={Spacing[8]} />
      <HStack style={{backgroundColor: Colors.LIGHT_GRAY, borderRadius: Spacing[8]}} horizontal={Spacing[12]} vertical={Spacing[12]}>
        {data.isNew === true ? <View style={{backgroundColor: Colors.MAIN_RED, height: Spacing[12], width: Spacing[12], borderRadius: 999, position: 'absolute', zIndex: 100, top: -Spacing[4], left: -Spacing[4]}} /> : null}
        <Text type={'body'} text={data.description} />
      </HStack>
      <HStack left={Spacing[24]} top={Spacing[8]}>
        <HStack>
          <FastImage style={{
            height: Spacing[42],
            width: Spacing[42],
            borderRadius: Spacing[8]
          }} source={nullProfileIcon} resizeMode={"contain"}/>
          <VStack left={Spacing[8]}>
            <Text type={'body-bold'} style={{fontSize: Spacing[12]}} text={data.author.fullname} />
            <Text type={'body'} style={{fontSize: Spacing[12]}} text={data.author.title} />
          </VStack>
        </HStack>
        <Spacer />
        <VStack>
          <Text type={'right-header'} style={{fontSize: Spacing[12]}} underlineWidth={Spacing[64]} text={`${data.commentCount} comments`} />
          <Spacer/>
        </VStack>
      </HStack>
      <Spacer height={Spacing[8]} />
      <HStack>
        <Spacer/>
        <TouchableOpacity onPress={goToFeed}>
          <FastImage style={{
            height: Spacing[24],
            width: Spacing[24],
            borderRadius: Spacing[8]
          }} source={downArrow} resizeMode={"contain"}/>
        </TouchableOpacity>
        <Spacer/>
      </HStack>
    </VStack>
  )

}
