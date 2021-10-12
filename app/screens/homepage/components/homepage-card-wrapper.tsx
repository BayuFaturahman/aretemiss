import React from "react";
import {VStack} from "@components/view-stack";
import {Colors, Spacing} from "@styles";

import RNAnimated from "react-native-animated-component";
import {AppearFrom} from "react-native-animated-component/lib/RNAnimated";

type HomepageCardWrappperProps = {
  animationDuration?: number
  appearFrom?: AppearFrom
  children: React.ReactElement
}

export const HomepageCardWrapper = ({children, appearFrom = 'bottom', animationDuration = 500}:HomepageCardWrappperProps) => {
  return(
    <RNAnimated
      appearFrom={appearFrom}
      animationDuration={animationDuration}
    >
      <VStack horizontal={Spacing[16]} vertical={Spacing[12]} style={{backgroundColor: Colors.WHITE, width: '100%', borderRadius: Spacing[20]}}>
        {children}
      </VStack>
    </RNAnimated>
  )
}
