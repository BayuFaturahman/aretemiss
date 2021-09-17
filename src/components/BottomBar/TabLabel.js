import React from 'react';
import { Text } from 'react-native';

import styles from './styles';

const TabLabel = props => (
  <Text
    numberOfLines={1}
    ellipsizeMode="tail"
    style={
      [styles.bottomBar.tabBarOptions.labelStyle,
        props.focused
          ? styles.bottomBar.tabBarOptions.activeStyle : styles.bottomBar.tabBarOptions.inactiveStyle]}
  >
    {props.text}
  </Text>
);

export default TabLabel;