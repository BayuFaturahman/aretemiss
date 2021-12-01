import React from "react";
import {VStack} from "@components/view-stack";
import {Colors, Spacing} from "@styles";
import {TouchableOpacity} from "react-native";
import {dimensions} from "@config/platform.config";
import FastImage from "react-native-fast-image";
import addTaskButton from "@assets/icons/add-task.png";

type NewButtonProps = {
  onPress(): void
}

export const NewButton = ({onPress = ()=> null}:NewButtonProps) => {
  return(
    <VStack style={{width: dimensions.screenWidth, alignItems: 'center', top: -Spacing[32], position: 'absolute', zIndex: 10}}>
      <TouchableOpacity onPress={onPress} style={{height: Spacing[64], width: Spacing[64], backgroundColor: Colors.BRIGHT_BLUE, borderRadius: Spacing[64], flex:1, justifyContent: 'center'}}>
        <FastImage style={{
          height: Spacing[36],
          top: -Spacing[2]
        }} source={addTaskButton} resizeMode={"contain"}/>
      </TouchableOpacity>
    </VStack>
  )
}
