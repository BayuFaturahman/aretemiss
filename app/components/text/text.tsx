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
  const { preset = "default", tx, txOptions, text, children, style: styleOverride, underlineWidth, ...rest } = props

  // figure out which content to use
  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || text || children

  const style = presets[preset] || presets.default
  const styles = [style, styleOverride]

  if(props.type === 'header'){
    return(
      <VStack style={Layout.widthFull}>
        <ReactNativeText {...rest} style={[style, presets.bold, {fontSize: Spacing[24], textAlign: 'center'} ,styleOverride ]}>
          {content}
        </ReactNativeText>
        <View style={{height: Spacing[6], backgroundColor: Colors.ABM_YELLOW, maxWidth: underlineWidth || 144, width: '100%', marginLeft: 'auto', marginRight: 'auto'}}></View>
      </VStack>
    )
  }

  if(props.type === 'left-header'){
    return(
      <VStack style={{alignItems: 'flex-start'}}>
        <ReactNativeText {...rest} style={[style, presets.bold, { fontSize: Spacing[18], textAlign: 'center', lineHeight: Spacing[20]} ,styleOverride ]}>
          {content}
        </ReactNativeText>
        <View style={{height: Spacing[6], backgroundColor: Colors.ABM_YELLOW, width: underlineWidth || Spacing[128]}}></View>
      </VStack>
    )
  }

  if(props.type === 'right-header'){
    return(
      <VStack style={{alignItems: 'flex-end'}}>
        <ReactNativeText {...rest} style={[style, presets.bold, { fontSize: Spacing[18], textAlign: 'center', lineHeight: Spacing[20]} ,styleOverride ]}>
          {content}
        </ReactNativeText>
        <View style={{
          height: Spacing[6],
          backgroundColor: Colors.ABM_YELLOW,
          width: underlineWidth || Spacing[128]
        }}/>
      </VStack>
    )
  }

  if(props.type === 'header2'){
    return(
      <ReactNativeText {...rest} style={[style, {fontSize: Spacing[18]} ,styleOverride ]}>
        {content}
      </ReactNativeText>
    )
  }

  if(props.type === 'warning'){
    return(
      <ReactNativeText {...rest} style={[style, presets.bold, {color: Colors.MAIN_RED} ,styleOverride ]}>
        {content}
      </ReactNativeText>
    )
  }

  if(props.type === 'body'){
    return(
      <ReactNativeText {...rest} style={[style, {fontSize: Spacing[14]} ,styleOverride ]}>
        {content}
      </ReactNativeText>
    )
  }

  if(props.type === 'body-bold'){
    return(
      <ReactNativeText {...rest} style={[style, presets.bold, {fontSize: Spacing[14]} ,styleOverride ]}>
        {content}
      </ReactNativeText>
    )
  }

  if(props.type === 'label'){
    return(
      <ReactNativeText {...rest} style={[style, presets.bold, {fontSize: Spacing[12]} ,styleOverride ]}>
        {content}
      </ReactNativeText>
    )
  }

  if(props.type === 'left-label'){
    return(
      <VStack>
        <ReactNativeText {...rest} style={[style, presets.bold, { fontSize: Spacing[12], textAlign: 'center', lineHeight: Spacing[20], zIndex: 100, top: Spacing[10]} ,styleOverride ]}>
          {content}
        </ReactNativeText>
        <View style={{height: Spacing[6], backgroundColor: Colors.ABM_YELLOW, width: underlineWidth || Spacing[42], marginLeft: 'auto', marginRight: 'auto'}}></View>
        
      </VStack>
    )
  }

  if(props.type === 'button'){
    return(
      <ReactNativeText {...rest} style={[style, presets.bold, {fontSize: Spacing[18]} ,styleOverride ]}>
        {content}
      </ReactNativeText>
    )
  }

  if(props.type === 'button-small'){
    return(
      <ReactNativeText {...rest} style={[style, presets.bold, {fontSize: Spacing[16]} ,styleOverride ]}>
        {content}
      </ReactNativeText>
    )
  }

  if (props.type === 'button-extrasmall') {
    return(
      <>
        <ReactNativeText {...rest} style={[style, presets.bold, {fontSize: Spacing[14], textAlign: 'center', lineHeight: Spacing[20], zIndex: 100, top: Spacing[8]} ,styleOverride ]}>
          {content}
        </ReactNativeText>
        <View style={{top: Spacing[4], height: Spacing[2], backgroundColor: Colors.ABM_YELLOW, width: underlineWidth || Spacing[42], marginLeft: 'auto', marginRight: 'auto'}}></View>
      </>
    )
  }

  return (
    <ReactNativeText {...rest} style={styles}>
      {content}
    </ReactNativeText>
  )
}
