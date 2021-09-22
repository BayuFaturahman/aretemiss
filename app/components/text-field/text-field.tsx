import React, {useState} from "react"
import {StyleProp, TextInput, TextInputProps, TextStyle, TouchableOpacity, View, ViewStyle} from "react-native"
import { color, spacing, typography } from "@theme/"
import { translate, TxKeyPath } from "../../i18n"
import { Text } from "../text/text"
import {Colors, Spacing} from "@styles";
import Spacer from "@components/spacer";
import FastImage from "react-native-fast-image";

import eyeIcon from '@assets/icons/eyes.png'
import eyeIconFalse from '@assets/icons/eyesFalse.png'
import {HStack} from "@components/view-stack";

// the base styling for the container
const CONTAINER: ViewStyle = {
  paddingVertical: spacing[3],
}

// currently we have no presets, but that changes quickly when you build your app.
const PRESETS: { [name: string]: ViewStyle } = {
  default: {},
}

export interface TextFieldProps extends TextInputProps {
  /**
   * The placeholder i18n key.
   */
  placeholderTx?: TxKeyPath

  /**
   * The Placeholder text if no placeholderTx is provided.
   */
  placeholder?: string

  /**
   * The label i18n key.
   */
  labelTx?: TxKeyPath

  /**
   * The label text if no labelTx is provided.
   */
  label?: string

  /**
   * Optional container style overrides useful for margins & padding.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Optional style overrides for the input.
   */
  inputStyle?: StyleProp<TextStyle>

  /**
   * Various look & feels.
   */
  preset?: keyof typeof PRESETS

  forwardedRef?: any

  isError?: boolean

  isRequired?: boolean
}

const EYES_ICON =  {
  height: Spacing[24],
  width: Spacing[24],
  marginHorizontal: 8,
}

/**
 * A component which has a label and an input together.
 */
export function TextField(props: TextFieldProps) {
  const {
    placeholderTx,
    placeholder,
    labelTx,
    label,
    preset = "default",
    style: styleOverride,
    inputStyle: inputStyleOverride,
    forwardedRef,
    isError,
    isRequired = true,
    ...rest
  } = props

  // the base styling for the TextInput
  const INPUT: TextStyle = {
    fontFamily: typography.primary,
    color: Colors.UNDERTONE_BLUE,
    minHeight: 44,
    fontSize: Spacing[16],
    backgroundColor: color.palette.white,
    textAlign: 'center',
    borderRadius: Spacing[20],
    borderColor: isError ? Colors.MAIN_RED : Colors.MAIN_BLUE,
    borderWidth: Spacing[2]
  }

  const LABEL_STYLE = {
    color: isError ? Colors.MAIN_RED : Colors.UNDERTONE_BLUE,
  }

  const containerStyles = [CONTAINER, PRESETS[preset], styleOverride]
  const inputStyles = [INPUT, inputStyleOverride]
  const actualPlaceholder = placeholderTx ? translate(placeholderTx) : placeholder

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const renderRequired = () => {
    return isRequired === true ? <Text type={'label'} style={[{fontSize: Spacing[14]}, LABEL_STYLE]} text={`*`} /> : null
  }

  if(props.secureTextEntry){
    return(
      <View style={[containerStyles, {position: 'relative'}]}>
        <HStack>
          {renderRequired()}
          <Text type={'label'} style={[{fontSize: Spacing[14]}, LABEL_STYLE]} tx={labelTx} text={label} />
        </HStack>
        <Spacer height={Spacing[4]} />
        <TextInput
          placeholder={actualPlaceholder}
          placeholderTextColor={color.palette.lighterGrey}
          underlineColorAndroid={color.transparent}
          {...rest}
          style={inputStyles}
          ref={forwardedRef}
          secureTextEntry={showPassword}
        >
        </TextInput>
        <TouchableOpacity style={{position: 'absolute', right: 0, bottom: Spacing[20]}} onPress={()=>setShowPassword(!showPassword)}>
          <FastImage style={EYES_ICON} source={showPassword ? eyeIcon : eyeIconFalse} resizeMode={"contain"}/>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={containerStyles}>
      <HStack>
        {renderRequired()}
        <Text type={'label'} style={[{fontSize: Spacing[14]}, LABEL_STYLE]} tx={labelTx} text={label} />
      </HStack>
      <Spacer height={Spacing[4]} />
      <TextInput
        placeholder={actualPlaceholder}
        placeholderTextColor={color.palette.lighterGrey}
        underlineColorAndroid={color.transparent}
        {...rest}
        style={inputStyles}
        ref={forwardedRef}
      />
    </View>
  )
}
