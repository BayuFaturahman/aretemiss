import React from 'react';
import {View} from 'react-native';
import {safeAreaHeight, phoneType} from '@config/platform.config';
import {Spacing, Layout} from '@styles';

interface Props {
  width?: number;
  height?: number;
  topSafeAreaHeight?: boolean;
  bottomSafeAreaHeight?: boolean;
}

const Spacer = ({
  width,
  height,
  topSafeAreaHeight,
  bottomSafeAreaHeight,
}: Props) => {
  if (width) {
    return <View style={{width}} />;
  }

  if (height) {
    return <View style={{height}} />;
  }

  if (topSafeAreaHeight) {
    return <View style={{height: safeAreaHeight[phoneType()].top}} />;
  }

  if (bottomSafeAreaHeight) {
    return (
      <View
        style={{height: safeAreaHeight[phoneType()].bottom || Spacing[24]}}
      />
    );
  }

  return <View style={Layout.flex} />;
};

Spacer.defaultProps = {
  width: undefined,
  height: undefined,
  topSafeAreaHeight: undefined,
  bottomSafeAreaHeight: undefined,
};

export default Spacer;
