import {Spacing} from '@styles';
import RNAnimated from 'react-native-animated-component';
import FastImage from 'react-native-fast-image';
import {images} from '@assets/images';
import {VStack} from './view-stack';
import React from 'react';

type AuthBottomLogoProps = {
  top?: number;
};

export const AuthBottomLogo: React.FC<AuthBottomLogoProps> = ({
  top = Spacing[12],
}) => (
  <VStack top={top}>
    <RNAnimated appearFrom="bottom" animationDuration={500}>
      <FastImage
        style={{
          height: Spacing[96],
          bottom: -Spacing[24]
        }}
        source={images.landingPageBottom}
        resizeMode={'contain'}
      />
    </RNAnimated>
  </VStack>
);
