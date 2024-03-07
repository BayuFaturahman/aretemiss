import * as React from "react"
import {Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback} from 'react-native';
import {Layout} from "@styles";

export interface DismissKeyboardProps {
  children: React.ReactElement<any>
}

export function DismissKeyboard(props: DismissKeyboardProps) {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={Layout.flex}
      >{props.children}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}
