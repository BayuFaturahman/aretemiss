import * as React from "react"
import {Text as ReactNativeText, View} from "react-native"
import { presets } from "./text.presets"
import { TextProps } from "./text.props"
import { translate } from "../../i18n"
import {Colors, Layout, Spacing} from "@styles";
import {VStack} from "@components/view-stack";

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Text(props: TextProps) {
  // grab the props
  const { preset = "default", tx, txOptions, text, children, style: styleOverride, ...rest } = props

  // figure out which content to use
  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || text || children

  const style = presets[preset] || presets.default
  const styles = [style, styleOverride]

  if(props.type === 'header'){
    return(
      <VStack style={Layout.widthFull}>
        <ReactNativeText {...rest} style={[style, {fontSize: Spacing[20], textAlign: 'center'} ,styleOverride ]}>
          {content}
        </ReactNativeText>
        <View style={{height: Spacing[6], backgroundColor: Colors.MAIN_RED, maxWidth: 144, width: '100%', marginLeft: 'auto', marginRight: 'auto'}}></View>
      </VStack>
    )
  }

  if(props.type === 'warning'){
    return(
      <ReactNativeText {...rest} style={[style, {color: Colors.MAIN_RED, textAlign: 'center'} ,styleOverride ]}>
        {content}
      </ReactNativeText>
    )
  }

  return (
    <ReactNativeText {...rest} style={styles}>
      {content}
    </ReactNativeText>
  )
}
