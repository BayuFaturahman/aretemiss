import * as React from "react"
import { TouchableOpacity } from "react-native"
import { Text } from "../text/text"
import { viewPresets, textPresets } from "./button.presets"
import { ButtonProps } from "./button.props"
import {Colors, Spacing} from "@styles";

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Button(props: ButtonProps) {
  // grab the props
  const {
    preset = "primary",
    tx,
    text,
    style: styleOverride,
    textStyle: textStyleOverride,
    children,
    type,
    ...rest
  } = props

  const viewStyle = viewPresets[preset] || viewPresets.primary
  const viewStyles = [viewStyle, styleOverride]
  const textStyle = textPresets[preset] || textPresets.primary
  const textStyles = [textStyle, textStyleOverride]

  const content = children || <Text tx={tx} text={text} style={textStyles} />

  if (type === 'primary') {
    return (
      <TouchableOpacity style={[{
        backgroundColor: Colors.BRIGHT_BLUE,
        paddingVertical: Spacing[8],
        borderRadius: Spacing[20]
      }, styleOverride]} {...rest}>
        <Text type={'button'} tx={tx} text={text} style={{
          textAlign: 'center',
          color: Colors.WHITE,
          fontSize: Spacing[14]
        }} />
      </TouchableOpacity>
    )
  }

  if (type === 'primary-dark') {
    return (
      <TouchableOpacity style={[{
        backgroundColor: Colors.UNDERTONE_BLUE,
        paddingVertical: Spacing[8],
        borderRadius: Spacing[20]
      }, styleOverride]} {...rest}>
        <Text type={'button'} tx={tx} text={text} style={{
          textAlign: 'center',
          color: Colors.WHITE,
          fontSize: Spacing[14]
        }} />
      </TouchableOpacity>
    )
  }

  if (type === 'secondary') {
    return (
      <TouchableOpacity style={[{
        paddingVertical: Spacing[8],
      }, styleOverride]} {...rest}>
        <Text type={'button'} tx={tx} text={text} style={{
          textAlign: 'center',
          color: Colors.UNDERTONE_BLUE,
          fontSize: Spacing[14]
        }} />
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity style={viewStyles} {...rest}>
      {content}
    </TouchableOpacity>
  )
}
