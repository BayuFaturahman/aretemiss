import React, { useState } from "react";
import {HStack} from "@components/view-stack";
import {Spacing} from "@styles"
import { Source } from "react-native-fast-image";
import {Text} from "@components";
import Spacer from "@components/spacer";


// import nullProfileIcon from "@assets/icons/settings/null-profile-picture.png";
import senang from "@assets/icons/mood/senyum.png";
import senangBw from "@assets/icons/mood/senyum-bw.png";
import marah from "@assets/icons/mood/marah.png";
import marahBw from "@assets/icons/mood/marah-bw.png";
import sedih from "@assets/icons/mood/sedih.png";
import sedihBw from "@assets/icons/mood/sedih-bw.png";
import sakit from "@assets/icons/mood/sakit.png";
import sakitBw from "@assets/icons/mood/sakit-bw.png";
import terkejut from "@assets/icons/mood/kaget.png";
import terkejutBw from "@assets/icons/mood/kaget-bw.png";
import { TouchableOpacity } from "react-native-gesture-handler";

import { MarahActive, SedihActive, SenyumActive, SenyumInactive, SickActive, SurprisedActive } from "@assets/svgs"

type MoodProps = {
  data: string
  goToMood(): void
}

export const MoodComponent = ({data, goToMood = () => null}: MoodProps) => {

  const renderUserMood = () => {
    if (data === 'senang') {
      return <SenyumActive height={Spacing[42]} width={Spacing[42]}/>
    } else if (data === 'senangBw') {
      return <SenyumInactive height={Spacing[42]} width={Spacing[42]}/>
    } else if (data === 'marah') {
      return <MarahActive height={Spacing[42]} width={Spacing[42]}/>
    } else if (data === 'sedih') {
      return <SedihActive height={Spacing[42]} width={Spacing[42]}/>
    } else if (data === 'sakit') {
      return <SickActive height={Spacing[42]} width={Spacing[42]}/>
    } else if (data === 'terkejut') {
      return <SurprisedActive height={Spacing[42]} width={Spacing[42]}/>
    } else {
      return <SenyumInactive height={Spacing[42]} width={Spacing[42]}/>
    }
  }


  return(
    <>
    <HStack horizontal={Spacing[2]} style={{width: Spacing[100], height: Spacing[48]+Spacing[2]}}>
      {/* Mood Icon */}
      <TouchableOpacity style={{flex: 1, alignItems: 'center', alignItems: "center", justifyContent: "center"}} onPress={goToMood}>
        <HStack>
          {renderUserMood()}
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
