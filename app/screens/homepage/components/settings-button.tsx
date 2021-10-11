import React from "react";
import {HStack, VStack} from "@components/view-stack";
import {Colors, Spacing} from "@styles";
import {TouchableOpacity, View} from "react-native";
import FastImage from "react-native-fast-image";
import settings from "@assets/icons/settings.png";


export const SettingsButton = ({goToSettings = () => null}) => {
  return(
    <HStack left={Spacing[12]} bottom={Spacing[16]} style={{width: Spacing[64], height: Spacing[48], position: 'absolute', bottom: 0, left: 0}}>
      <TouchableOpacity onPress={goToSettings} style={[]}>
        <VStack style={{backgroundColor: Colors.UNDERTONE_BLUE, height: Spacing[48], width: Spacing[48], borderRadius: 999, alignItems: 'center', justifyContent: 'center'}}>
          <FastImage style={{
            height: Spacing[32],
            width: Spacing[32],
          }} source={settings} resizeMode={"contain"}/>
        </VStack>
      </TouchableOpacity>
    </HStack>
  )
}
