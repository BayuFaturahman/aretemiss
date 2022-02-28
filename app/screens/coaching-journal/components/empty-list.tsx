import React from "react";
import {HStack, VStack} from "@components/view-stack";
import {Colors, Layout, Spacing} from "@styles";
import {View} from "react-native";
import FastImage from "react-native-fast-image";
import {Text} from "@components";
import Spacer from "@components/spacer";
import smileYellow from "@assets/icons/coachingJournal/empty/smile-yellow.png";
import surprissedPurple from "@assets/icons/coachingJournal/empty/surprised-purple.png";


export const EmptyList = ({}) => {
  return(
    <VStack horizontal={Spacing[64]} top={Spacing[24]} style={[Layout.widthFull, {backgroundColor: Colors.WHITE}]}>
      <HStack style={{left: -Spacing[24]}}>
        <Text type={'body'} style={{textAlign: 'left'}} text={`Yuk mulai isi catatan jurnal \ncoaching-mu!`} />
        <Spacer width={Spacing[8]} />
        <FastImage style={{
          height: Spacing[48],
          width: Spacing[48],
        }} source={smileYellow} resizeMode={"contain"}/>
      </HStack>
      <Spacer height={Spacing[16]} />
      <HStack>
        <Text type={'body'} style={{textAlign: 'left'}} >
          {`Kamu gak perlu nunggu sampe ada jadwal coaching buat mulai nyatet.`}
        </Text>
      </HStack>
      <Spacer height={Spacing[16]} />
      <HStack style={{left: -Spacing[24]}}>
        <View style={{height: Spacing[32], width: Spacing[32], backgroundColor: Colors.SOFT_PURPLE, borderRadius: 999, position: 'absolute', right: -Spacing[48], top: -Spacing[32]}} />
        <FastImage style={{
          height: Spacing[48],
          width: Spacing[48],
        }} source={surprissedPurple} resizeMode={"contain"}/>
        <Spacer width={Spacing[12]} />
        <Text type={'body'} style={{textAlign: 'left'}} >
          {`Kalau kamu sering `}
          <Text type={'body'} style={{ color: Colors.SOFT_PURPLE}} >
            “kumpul santai”
          </Text>
          {` bareng anggota team, itu juga bisa dijadiin catatan lho!.`}
        </Text>
      </HStack>
      <Spacer height={Spacing[16]} />
      <HStack style={{left: -Spacing[24]}}>
        <Text type={'body'} style={{textAlign: 'left'}} >
          {`Kalau kamu baru aja `}
          <Text type={'body'} style={{ color: Colors.SOFT_GREEN}} >
            “di-coach”
          </Text>
          {` sama atasanmu, nanti coaching journal-nya langsung muncul di sini juga.`}
        </Text>
        <Spacer width={Spacing[12]} />
        <View style={{bottom: -Spacing[36], left: -Spacing[24]}}>
          <View style={{height: Spacing[32], width: Spacing[32], backgroundColor: Colors.SOFT_GREEN, borderRadius: 999, zIndex: 10}} />
          <View style={{height: Spacing[24], width: Spacing[24], backgroundColor: Colors.HONEY_YELLOW, borderRadius: 999, position:'absolute', right: -Spacing[8], bottom: -Spacing[8]}} />
        </View>
      </HStack>
      <Spacer height={Spacing[48]} />
    </VStack>
  )
}
