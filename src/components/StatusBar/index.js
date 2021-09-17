// Import libraries to create a Component
import React from 'react';
import { View, StatusBar } from 'react-native'
import Utils from '../../common/utils';
import { Colors } from '../../themes';

// Create a Component
const MyStatusBar = () => (
  <View style={styles.statusBar}>
    <StatusBar barStyle="dark-content" backgroundColor={Colors.statusBar} />
  </View>
);

// Styles
const styles = {
  statusBar: {
    height: Utils.isIOS() ? 0 : null,
    backgroundColor: Colors.yellow
  }
};

// Make the Component available to other parts of the application
export { MyStatusBar };
