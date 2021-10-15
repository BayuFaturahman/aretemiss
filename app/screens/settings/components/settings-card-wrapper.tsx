import React from "react";
import {VStack} from "@components/view-stack";
import {Colors, Spacing} from "@styles";


export const SettingsCardWrapper = ({children}) => {
  return(
    <VStack horizontal={Spacing[16]} vertical={Spacing[12]} style={{backgroundColor: Colors.WHITE, width: '100%', borderRadius: Spacing[20]}}>
      {children}
    </VStack>
  )
}
