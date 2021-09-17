// Import libraries to create a Component
import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';

// Themes
import { Colors } from '../../themes';

// Create a Component
class Spinner extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.spinnerStyle}>
        <ActivityIndicator size="large" color={Colors.black} />
      </View >
    );
  };
}


// Styles
const styles = {
  spinnerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGray, 
    opacity: 0.6,
  }
};

export { Spinner };
