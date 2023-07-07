import React, { useState } from "react";
import {HStack} from "@components/view-stack";
import {Spacing} from "@styles"
import { Source } from "react-native-fast-image";
import {Text} from "@components";
import Spacer from "@components/spacer";

import { TouchableOpacity, View } from "react-native";

// import { MarahActive, SedihActive, SenyumActive, SenyumInactive, SickActive, SurprisedActive } from "@assets/svgs"
import { MoodComponent } from "./mood-component";

type MoodProps = {
  data: string
  goToMood(): void
}

export const MoodHomepageComponent = ({data, goToMood = () => null}: MoodProps) => {

  return(
    <>
    <HStack horizontal={Spacing[2]} style={{width: Spacing[100], height: Spacing[48]+Spacing[2]}}>
      {/* Mood Icon */}
      <TouchableOpacity style={{flex: 1, alignItems: 'center', alignItems: "center", justifyContent: "center"}} onPress={goToMood}>
        <HStack>
          <MoodComponent data={data}/>
          <HStack >
          <Spacer width={Spacing[12]}/>
          <Text type={'left-header'} style={{fontSize: Spacing[16]}} underlineWidth={Spacing[42]} text={'Mood.'} />
          </HStack>
        </HStack>
      </TouchableOpacity>
    </HStack>
    </>
  )

}
