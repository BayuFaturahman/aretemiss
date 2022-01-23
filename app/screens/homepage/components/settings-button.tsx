import React from "react";
import {HStack, VStack} from "@components/view-stack";
import {Colors, Spacing} from "@styles";
import {TouchableOpacity} from "react-native-gesture-handler";

import RNAnimated from "react-native-animated-component";
import { Settings} from "@assets/svgs";


export const SettingsButton = ({goToSettings = () => null}) => {
  return(
    <RNAnimated
      appearFrom={'left'}
      animationDuration={500}
    >
      <HStack left={Spacing[12]} bottom={Spacing[16]} style={{width: Spacing[64], height: Spacing[48], position: 'absolute', bottom: 0, left: 0}}>
        <TouchableOpacity onPress={goToSettings} style={{zIndex: 1}}>
        <VStack style={{backgroundColor: Colors.UNDERTONE_BLUE, height: Spacing[48], width: Spacing[48], borderRadius: 999, alignItems: 'center', justifyContent: 'center'}}>
          <Settings height={Spacing[32]} width={Spacing[32]} />
        </VStack>
        </TouchableOpacity>
      </HStack>
    </RNAnimated>
  )
}
