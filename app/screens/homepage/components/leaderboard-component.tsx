import React, { useEffect, useState } from "react";
import {HStack, VStack} from "@components/view-stack";
import {Colors, Spacing} from "@styles"
import FastImage, { Source } from "react-native-fast-image";
import {Text} from "@components";
import Spacer from "@components/spacer";

import { Throphy } from "@assets/svgs"

type LeaderboardProps = {
  leaderboardPosition: string
}

export const LeaderboardComponent = ({leaderboardPosition}: LeaderboardProps) => {
  
  return(
    <>
    <HStack style={{maxWidth:Spacing[160]+Spacing[22], height: Spacing[48]+Spacing[2]}}>
       <Throphy height={Spacing[42]} width={Spacing[42]} />
        <VStack left={Spacing[8]}>
            <Text type={'body'} text={`Posisi Leaderboard: #${leaderboardPosition}`} />
            <Text type={'header'} style={{fontSize: Spacing[16], maxWidth: Spacing[128] + Spacing[48], textAlign: 'left'}} text={'Cek Leaderboard.'} />
        </VStack>
    </HStack>
    </>
  )

}
