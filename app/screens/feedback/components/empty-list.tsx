import React from "react";
import {HStack, VStack} from "@components/view-stack";
import {Colors, Layout, Spacing} from "@styles";
import {Button, Text} from "@components";
import Spacer from "@components/spacer";
import sick from "@assets/icons/notifications/sick.png";
import {IconSurprisedColor} from "@assets/svgs";
import { backgroundColor } from "react-native-calendars/src/style";


export const EmptyList = ({
                            navigateTo = () => null,
                            imageSource = () => <IconSurprisedColor height={Spacing[60]} width={Spacing[60]} />,
                            description = 'Belum ada Coachees sebelumnya!\nKembali lagi saat sudah ada Existing Coachees ya!',
                            buttonLabel = 'Kembali'
}) => {
  return(
    <VStack horizontal={Spacing[8]} top={Spacing[24]} style={Layout.widthFull}>
      {/* <VStack horizontal={Spacing[42]} style={{backgroundColor: Colors.RED100}}> */}
      <Spacer/>
        <HStack bottom={Spacing[12]}>
          <Spacer/>
          {imageSource()}
          <Spacer/>
        </HStack>
        <Text type={'body'} style={{textAlign: 'center', fontSize: Spacing[12]}} text={description} />
        {/* <Spacer height={Spacing[12]} /> */}
      {/* </VStack> */}
    </VStack>
  )
}
