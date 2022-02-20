import React, { useEffect, useState } from "react";
import {HStack, VStack} from "@components/view-stack";
import {Colors, Spacing} from "@styles"
import FastImage, { Source } from "react-native-fast-image";
import {Text} from "@components";
import Spacer from "@components/spacer";

import { BintangAssesment, IleadLogo } from "@assets/svgs"

import nullProfileIcon from "@assets/icons/settings/null-profile-picture.png";
import { TouchableOpacity } from "react-native";

export type ProfileItemType = {
  avatarUrl: string
  user: {
    name: string
    title: string
  }
}

type ProfileProps = {
  data: ProfileItemType
  goToAssessment(): void
}

export const AssessmentComponent = ({data, goToAssessment = () => null}: ProfileProps) => {
    
  return(
    <>
    <TouchableOpacity onPress={goToAssessment}>
      <HStack horizontal={Spacing[2]}>
        <HStack>
        <BintangAssesment height={Spacing[72]} width={Spacing[112]} />
          <VStack left={Spacing[8]} style={{width: Spacing[160]+Spacing[48]}}>
            <Text type={'body-bold'} style={{fontSize: Spacing[20]}} text={'JUARA Assessment'} />
            <Text type={'left-header'} style={{fontSize: Spacing[14], maxWidth: Spacing[256]}}  underlineWidth={Spacing[128]+Spacing[16]} text={'Isi assessment untuk rekan kerjamu.'} />
          </VStack>
        </HStack>
        <Spacer />
      </HStack>
    </TouchableOpacity>
    </>
  )

}
