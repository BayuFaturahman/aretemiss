import React, {  } from "react"
import { HStack, VStack } from "@components/view-stack"
import { Colors, Spacing } from "@styles"
import { Text } from "@components"
import Spacer from "@components/spacer"

import { IconFeedback } from "@assets/svgs"

import { TouchableOpacity } from "react-native"

export type ProfileItemType = {
  avatarUrl: string
  user: {
    name: string
    title: string
  }
}

type ProfileProps = {
  goToFeedback(): void
}

export const FeeedbackComponent = ({ goToFeedback = () => null }: ProfileProps) => {
  return (
    <>
      <TouchableOpacity onPress={goToFeedback}>
        <HStack horizontal={Spacing[2]}>
          <HStack>
            <IconFeedback height={Spacing[72]} width={Spacing[112]} />
            <VStack left={Spacing[8]} style={{ width: Spacing[160] + Spacing[48] }}>
              <Text
                type={"body-bold"}
                style={{ fontSize: Spacing[20] }}
                text={"Feedback."}
              />
              <Text
                type={"left-header"}
                style={{ fontSize: Spacing[14], maxWidth: Spacing[256], color: Colors.ABM_MAIN_BLUE }}
                underlineWidth={Spacing[160]}
                text={"Saatnya memberi masukan!"}
              />
            </VStack>
          </HStack>
          <Spacer />
        </HStack>
      </TouchableOpacity>
    </>
  )
}
