import React from "react";
import {VStack} from "@components/view-stack";
import {Colors, Spacing} from "@styles";

import RNAnimated from "react-native-animated-component";
import {AppearFrom} from "react-native-animated-component/lib/RNAnimated";
import LayoutStyles from "@styles/Layout";

type HomepageCardWrappperProps = {
  animationDuration?: number
  appearFrom?: AppearFrom
  children: React.ReactElement
  horizontal?: number
  width?: string
}

export const HomepageCardWrapper = ({children, appearFrom = 'bottom', animationDuration = 500, horizontal = Spacing[16], width = "100%"}:HomepageCardWrappperProps) => {
  return(
    <RNAnimated
      appearFrom={appearFrom}
      animationDuration={animationDuration}
      style={{
        width: width
      }}
    >
      <VStack
        horizontal={horizontal}
        vertical={Spacing[12]}
        style={{backgroundColor: Colors.WHITE, width: "100%", borderRadius: Spacing[20], ...LayoutStyles.shadow}}
      >
        {children}
      </VStack>
    </RNAnimated>
  )
}
