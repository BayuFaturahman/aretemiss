import * as React from "react"
import { Keyboard,  TouchableWithoutFeedback } from 'react-native';

export interface DismissKeyboardProps {
  children: React.ReactElement<any>
}

export function DismissKeyboard(props: DismissKeyboardProps) {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{props.children}</TouchableWithoutFeedback>
  )
}
