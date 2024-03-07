import * as React from "react"
import {TouchableOpacity} from "react-native"
import { Text } from "../text/text"
import {VStack} from "@components/view-stack";
import {Colors, Layout, Spacing} from "@styles";

export interface BackNavigationProps {
  goBack(): void
  color?: string
}

export function BackNavigation(props: BackNavigationProps) {

  return (
    <VStack style={Layout.widthFull} horizontal={Spacing[20]} vertical={Spacing[8]}>
      <TouchableOpacity onPress={props.goBack}>
        <Text type={'button-small'} style={{color: props.color ? props.color : Colors.WHITE }}>◂ Back</Text>
      </TouchableOpacity>
    </VStack>
  )
}
