import React, { useEffect, useState } from "react"
import { HStack, VStack } from "@components/view-stack"
import { Colors, Layout, Spacing } from "@styles"
import FastImage, { Source } from "react-native-fast-image"
import { Text } from "@components"
import Spacer from "@components/spacer"

import { TrophyLeaderboards } from "@assets/svgs"
import { TouchableOpacity } from "react-native"

type LeaderboardProps = {
  leaderboardPosition: string
  goToLeaderboard(): void
}

export const LeaderboardComponent = ({ leaderboardPosition, goToLeaderboard = () => null}: LeaderboardProps) => {
  return (
    <>
    <TouchableOpacity style={{ width: '100%'}} onPress={goToLeaderboard}>
      <HStack style={{ width: Spacing[160] + Spacing[10], height: Spacing[48] + Spacing[2] }}>
          <TrophyLeaderboards height={Spacing[42]} width={Spacing[42]} />
          <VStack left={Spacing[8]}>
            <Text type={"body"} text={`Posisi Leaderboard: #${leaderboardPosition}`} />
            <Text type={"header"} style={{fontSize: Spacing[16], maxWidth: Spacing[128] + Spacing[48], textAlign: "left"}} text={"Cek Leaderboard."}/>
          </VStack>
      </HStack>
    </TouchableOpacity>
    </>
  )
}
