import React from "react";
import {HStack, VStack} from "@components/view-stack";
import {Colors, Layout, Spacing} from "@styles";
import {View} from "react-native";
import {Text} from "@components";
import Spacer from "@components/spacer";
import {Man3} from "@assets/svgs";
import {dimensions} from "@config/platform.config";


export const EmptyList = ({}) => {
  return(
    <VStack horizontal={Spacing[64]} top={Spacing[24]} style={[Layout.widthFull, {backgroundColor: Colors.WHITE}]}>
      <HStack style={{left: -Spacing[42]}}>

        <Man3 height={Spacing[160]} width={Spacing[160]} />
        <Spacer width={Spacing[8]} />
        <VStack>
          <Text type={'body'} style={{textAlign: 'left', left: -Spacing[12]}} text={`Yuk mulai isi catatan jurnal \ncoaching-mu!`} />
          <HStack top={Spacing[24]} style={{maxWidth: dimensions.screenWidth / 3 , left: Spacing[12]}}>
            <Text type={'body'} style={{textAlign: 'left'}} >
              {`Kamu gak perlu nunggu sampe ada jadwal coaching yang `}
              <Text type={'body'} style={{ color: Colors.ABM_GREEN}} >
                “profesional”
              </Text>
              {` buat mulai nyatet.`}
            </Text>
          </HStack>
        </VStack>


      </HStack>
      <Spacer height={Spacing[16]} />
      <Spacer height={Spacing[16]} />
      <HStack style={{left: -Spacing[32]}}>
        <View style={{height: Spacing[32], width: Spacing[32], backgroundColor: Colors.ABM_LIGHT_BLUE, borderRadius: 999, position: 'absolute', right: -Spacing[48], top: -Spacing[12]}} />
        <Spacer width={Spacing[12]} />
        <Text type={'body'} style={{textAlign: 'left'}} >
          {`Kalau kamu sering `}
          <Text type={'body'} style={{ color: Colors.ABM_YELLOW}} >
            “kumpul santai”
          </Text>
          {` bareng anggota team, itu juga bisa dijadiin catatan lho!.`}
        </Text>
      </HStack>
      <Spacer height={Spacing[16]} />
      <HStack >
        <View style={{}}>
          <View style={{height: Spacing[32], width: Spacing[32], backgroundColor: Colors.SOFT_GREEN, borderRadius: 999, zIndex: 10}} />
          <View style={{height: Spacing[24], width: Spacing[24], backgroundColor: Colors.HONEY_YELLOW, borderRadius: 999, position:'absolute', right: -Spacing[8], bottom: -Spacing[8]}} />
        </View>
        <Spacer width={Spacing[32]}/>
        <Text type={'body'} style={{textAlign: 'left'}} >
          {`Kalau kamu baru aja `}
          <Text type={'body'} style={{ color: Colors.ABM_LIGHT_BLUE}} >
            “di-coach”
          </Text>
          {` sama atasanmu, nanti coaching journal-nya langsung muncul di sini juga.`}
        </Text>
        <Spacer width={Spacing[12]} />
      </HStack>
      <Spacer height={Spacing[48]} />
    </VStack>
  )
}
