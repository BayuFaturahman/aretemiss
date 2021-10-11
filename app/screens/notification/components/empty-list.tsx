import React from "react";
import {HStack, VStack} from "@components/view-stack";
import {Layout, Spacing} from "@styles";
import FastImage from "react-native-fast-image";
import {Button, Text} from "@components";
import Spacer from "@components/spacer";
import sick from "@assets/icons/notifications/sick.png";


export const EmptyList = ({
                            navigateTo = () => null,
                            imageSource = sick,
                            description = 'Kamu belum mendapatkan notifikasi apapun. Apabila ada update terbaru seputar aktivitasmu di aplikasi ini, kami akan memberitahu lewat halaman ini ya!',
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
        <Text type={'body'} style={{textAlign: 'center'}} text={description} />
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
