import React from "react";
import {HStack, VStack} from "@components/view-stack";
import {Colors, Layout, Spacing} from "@styles";
import {View} from "react-native";
import FastImage from "react-native-fast-image";
import {Button, Text} from "@components";
import Spacer from "@components/spacer";
import isError from "@assets/icons/homepage/isError.png";
import surprissedPurple from "@assets/icons/coachingJournal/empty/surprised-purple.png";
import {dimensions} from "@config/platform.config";


export const HomepageErrorCard = ({
                            navigateTo = () => null,
                            imageSource = isError,
                            title = 'Yaahh, kok error?',
                            description = 'Sepertinya ada gangguan jaringan nih. \n' +
                            'Swipe ke bawah untuk refresh page-nya, ya!',
                            buttonLabel = 'Coba lagi'
}) => {
  return(
    <VStack horizontal={Spacing[24]} top={Spacing[24]} style={Layout.widthFull}>
      <VStack>
        <HStack bottom={Spacing[12]}>
          <Spacer/>
          <FastImage style={{
            height: Spacing[64],
            width: Spacing[64],
          }} source={imageSource} resizeMode={"contain"}/>
          <Spacer/>
        </HStack>
        <Text type={'header'} style={{fontSize: Spacing[18], textAlign: 'center'}} text={title} />
        <Spacer height={Spacing[24]} />
        <Text type={'body'} style={{ textAlign: 'center'}} text={description} />
        <Spacer height={Spacing[32]} />
        <HStack>
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
