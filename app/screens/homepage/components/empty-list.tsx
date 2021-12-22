import React from "react";
import {HStack, VStack} from "@components/view-stack";
import {Layout, Spacing} from "@styles";
import FastImage from "react-native-fast-image";
import {Button, Text} from "@components";
import Spacer from "@components/spacer";
import sick from "@assets/icons/notifications/sick.png";


export const EmptyList = ({
                            description = 'Sepertinya anggota team-mu belum ada yang update, nih. Tunggu sampe mereka update mood yah, nanti mood mereka muncul di sini.',
}) => {
  return(
    <VStack horizontal={Spacing[24]} top={Spacing[24]} style={Layout.widthFull}>
      <VStack>
        <Text type={'body'} style={{textAlign: 'center'}} text={description} />
        <Spacer height={Spacing[12]} />
        <HStack top={Spacing[12]}>
          <Spacer />
          <VStack style={{maxWidth: Spacing[256], minWidth: Spacing[128]}}>
          </VStack>
          <Spacer />
        </HStack>
      </VStack>
    </VStack>
  )
}
