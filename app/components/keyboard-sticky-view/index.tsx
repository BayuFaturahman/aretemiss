import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  NativeModules
} from 'react-native';
// import {Spacer} from "@components";
// import {Spacing} from "@styles";

const { StatusBarManager } = NativeModules;

if (Platform.OS === 'ios') {
  StatusBarManager.getHeight((statusBarFrameData: { height: number; }) => {
  });
}

// Could be nav bar height?
// Magic number but is necessary to work properly
// const IOS_OFFSET = 44;
const IOS_OFFSET = 0;

const getVerticalOffset = () => Platform.select({
  ios: 0,
  android: 0
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    bottom: 0,
    position: 'absolute',
    width: '100%'
  }
});

const KeyboardStickyView = ({ style, children, ...other }) => (
  <KeyboardAvoidingView
    style={[styles.container, style]}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={getVerticalOffset()}
    {...other} // can receive other view props
  >
    {children}
  </KeyboardAvoidingView>
);

export default KeyboardStickyView;
