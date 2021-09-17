// Import libraries to create a Component
import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';

// Themes
import { Colors, ApplicationStyles, Fonts } from '../../themes';
import { isTableted } from '../../common/utils';

// Create a Component
class ButtonPlain extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity activeOpacity={1} disabled={this.props.disabled} onPress={this.props.onPress} 
        style={[{backgroundColor: this.props.disabled ? Colors.mediumGray : Colors.redSoft, width: isNaN(this.props.width) ? this.props.width : isTableted ? (this.props.width)*2 : this.props.width}, styles.buttonContainer]}>
        <Text style={[styles.subDescription, styles.buttonText, styles.gothamBold]}>{this.props.text.toUpperCase()}</Text>
      </TouchableOpacity>
    )
  }
}

// Styles
const { ...applicationStyles } = ApplicationStyles;
const styles = {
  ...applicationStyles,
  ...Fonts,
  buttonContainer: {
    height: isTableted ? 56 : 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4
  },
  buttonText: {
    color: Colors.white,
    letterSpacing: 1.25
  }
};

// Make the Component available to other parts of the application
export { ButtonPlain };