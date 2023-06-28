import * as React from "react"
import { TouchableOpacity } from "react-native"
import { Text } from "../text/text"
import { viewPresets, textPresets } from "./button.presets"
import { ButtonProps } from "./button.props"
import { Colors, Spacing } from "@styles";

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
        backgroundColor: Colors.ABM_GREEN,
        paddingVertical: Spacing[8],
        borderRadius: Spacing[20]
      }, styleOverride]} {...rest}>
        <Text type={'button'} tx={tx} text={text} style={[{
          textAlign: 'center',
          color: Colors.WHITE,
          fontSize: Spacing[14]
        }, textStyleOverride]} />
      </TouchableOpacity>
    )
  }

  if (type === 'primary-dark') {
    return (
      <TouchableOpacity style={[{
        backgroundColor: Colors.ABM_LIGHT_BLUE,
        paddingVertical: Spacing[8],
        borderRadius: Spacing[20]
      }, styleOverride]} {...rest}>
        <Text type={'button'} tx={tx} text={text} style={[{
          textAlign: 'center',
          color: Colors.WHITE,
          fontSize: Spacing[14]
        }, textStyleOverride]} />
      </TouchableOpacity>
    )
  }

  if (type === 'secondary') {
    return (
      <TouchableOpacity style={[{
        paddingVertical: Spacing[8],
      }, styleOverride]} {...rest}>
        <Text type={'button'} tx={tx} text={text} style={[{
          textAlign: 'center',
          color: Colors.ABM_LIGHT_BLUE,
          fontSize: Spacing[14]
        }, textStyleOverride]} />
      </TouchableOpacity>
    )
  }

  if (type === 'negative') {
    return (
      <TouchableOpacity style={[{
        backgroundColor: Colors.CLOUD_GRAY,
        paddingVertical: Spacing[8],
        paddingHorizontal: Spacing[16],
        borderRadius: Spacing[20]
      }, styleOverride]} {...rest}>
        <Text type={'button'} tx={tx} text={text} style={[{
          textAlign: 'center',
          color: Colors.UNDERTONE_BLUE,
          fontSize: Spacing[14]
        }, textStyleOverride]} />
      </TouchableOpacity>
    )
  }

  if (type === 'negative-white') {
    return (
      <TouchableOpacity style={[{
        backgroundColor: Colors.CLOUD_GRAY,
        paddingVertical: Spacing[8],
        paddingHorizontal: Spacing[16],
        borderRadius: Spacing[20]
      }, styleOverride]} {...rest}>
        <Text type={'button'} tx={tx} text={text} style={[{
          textAlign: 'center',
          color: Colors.WHITE,
          fontSize: Spacing[14]
        }, textStyleOverride]} />
      </TouchableOpacity>
    )
  }

  if (type === 'warning') {
    return (
      <TouchableOpacity style={[{
        backgroundColor: Colors.MAIN_RED,
        paddingVertical: Spacing[8],
        borderRadius: Spacing[20]
      }, styleOverride]} {...rest}>
        <Text type={'button'} tx={tx} text={text} style={[{
          textAlign: 'center',
          color: Colors.WHITE,
          fontSize: Spacing[14]
        }, textStyleOverride]} />
      </TouchableOpacity>
    )
  }

  if (type === 'transparent') {
    return (
      <TouchableOpacity style={[{
        // backgroundColor: Colors.WH,
        paddingVertical: Spacing[8],
        borderRadius: Spacing[20]
      }, styleOverride]} {...rest}>
        <Text type={'button'} tx={tx} text={text} style={[{
          textAlign: 'center',
          color: Colors.MAIN_BLUE,
          fontSize: Spacing[14]
        }, textStyleOverride]} />
      </TouchableOpacity>
    )
  }

  if (type === 'light-blue') {
    return (
      <TouchableOpacity style={[{
        backgroundColor: Colors.ABM_LIGHT_BLUE,
        paddingVertical: Spacing[8],
        borderRadius: Spacing[20]
      }, styleOverride]} {...rest}>
        <Text type={'button'} tx={tx} text={text} style={[{
          textAlign: 'center',
          color: Colors.WHITE,
          fontSize: Spacing[14]
        }, textStyleOverride]} />
      </TouchableOpacity>
    )
  }

  if (type === 'light-bg') {
    return (
      <TouchableOpacity style={[{
        backgroundColor: Colors.ABM_BG_BLUE,
        paddingVertical: Spacing[8],
        borderRadius: Spacing[20],
        paddingHorizontal: Spacing[12]
      }, styleOverride]} {...rest}>
        <Text type={'button'} tx={tx} text={text} style={[{
          textAlign: 'center',
          color: Colors.ABM_MAIN_BLUE,
          fontSize: Spacing[14]
        }, textStyleOverride]} />
      </TouchableOpacity>
    )
  }

  if (type === 'dark-yellow') {
    return (
      <TouchableOpacity style={[{
        backgroundColor: Colors.ABM_YELLOW,
        paddingVertical: Spacing[8],
        borderRadius: Spacing[20]
      }, styleOverride]} {...rest}>
        <Text type={'button'} tx={tx} text={text} style={[{
          textAlign: 'center',
          color: Colors.ABM_DARK_BLUE,
          fontSize: Spacing[14]
        }, textStyleOverride]} />
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity style={viewStyles} {...rest}>
      {content}
    </TouchableOpacity>
  )
}
