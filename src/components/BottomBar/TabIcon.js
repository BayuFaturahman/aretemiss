import React from 'react';
import { View, Image } from 'react-native';

import styles from './styles';

const TabIcon = props => (
  <View style={[styles.Icons.container, props.style && props.style]}>
    <Image
      source={require(`../../assets/icons/mizuho-logo.png`)}
      style={styles.Icons.logo}
    />
  </View>
);

export default TabIcon;