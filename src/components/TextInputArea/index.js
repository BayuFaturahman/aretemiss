import React, {Component} from 'react';
import {Text, TextInput, View, Image} from 'react-native';
import {Colors, Fonts, ApplicationStyles} from '../../themes';
import {isTableted} from '../../common/utils';
import Utils from '../../common/utils';
import constants from '../../common/constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextInputMask } from 'react-native-masked-text'

class TextAreaCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
      secureTextEntry: true
    };
  }

  componentDidMount = () => {
    if (this.props.value) {
      this.setState({isFocused: true});
    }
  };

  changeFocus = () => {
    if (!this.props.value) {
      this.setState({isFocused: false});
    }
  };

  secure = () => {
    const secureTextEntry = this.state.secureTextEntry
    this.setState({
      secureTextEntry: !secureTextEntry
    })
  }

  textInputOnBlur = (e) => {
    if (!this.props.value) {
      this.setState({isFocused: false});
    }
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  };

  unFormatValue = (val) => {
    if (val.replace(/-/g, '').length < 20) {
      this.props.onChangeText(val.replace(/-/g, ''));
    }
  };

  unReferalValue = (val) => {
    if (val.length == 0 || val.match(constants.numberAndLetterCriteria)) {
      if (
        val.replace(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, '').length < 21
      ) {
        this.props.onChangeText(
          val.replace(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, ''),
        );
      }
    }
  };

  render() {
  return (
      <View style={{width: '100%', marginBottom: 4 }}>
          <View style={styles.flexHorizontal}>
            <Text
              style={[
                styles.leftFlex,
                [styles.normalLabelStyles, styles.robotoRegular],
                {
                  color:
                    this.props.error && this.props.error != ''
                      ? Colors.dangerRed
                      : Colors.mediumGray,
                 
                },
              ]}>
              {this.props.label}
            </Text>
        </View>
        <View
          style={[
            styles.container,
            styles.justifyAlignCenter,
            {
              borderColor:
                this.props.error && this.props.error != ''
                  ? Colors.dangerRed
                  : Colors.mediumGray,
             
            },
          ]}>
          <View style={[styles.flexVertical, {flex: 1}]}>
              <TextInput
                {...this.props}
                allowFontScaling={true}
                placeholder={
                  !(this.props.value)
                    ? ''
                    : this.props.placeholder
                    ? this.props.placeholder
                    : ''
                }
                multiline={true}
                onBlur={this.textInputOnBlur}
                autoFocus={this.state.isFocused}
                keyboardType={this.props.keyboardType}
                value={this.props.value}
                onKeyPress={() => {
                  this.props.onKeyPress ? this.props.onChangeValue() : null;
                }}
                onChangeText={(e) => this.props.onChangeText(e)}
                autoCapitalize = 'none'
                textContentType="telephoneNumber"
                maxLength={this.props.maxLength}
                style={
                  Utils.isIOS() ? styles.iosTextInput : styles.androidTextInput
                }
              />
            </View>
            {this.props.date && <Image resizeMode={'contain'} style={styles.iconCalendar} source={require('../../assets/icons/calendar.png')}/>}
        </View>
        {/* {this.props.error && this.props.error != '' ? (
          <Text style={styles.errorFont}>{this.props.error}</Text>
        ) : null} */}
      </View>
    );
  }
}

// Styles
const {...applicationStyles} = ApplicationStyles;
const styles = {
  ...Fonts,
  ...applicationStyles,
  container: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    paddingLeft: 16,
    flexDirection: 'row',
    borderRadius: 30,
    marginBottom: 16
  },
  normalLabelStyles: {
    ...Fonts.description,
    color: Colors.darkGray,
  },
  floatLabelStyles: {
    ...Fonts.subTag,
    position: 'relative',
    left: 0,
    top: isTableted ? 10 : 10.41,
    color: Colors.mediumGray,
    letterSpacing: 1.5,
  },
  iosTextInput: {
    fontSize: Fonts.subContent.fontSize,
    minHeight: 70,
  },
  androidTextInput: {
    fontSize: Fonts.subContent.fontSize,
    minHeight: 70,
  },
  leftFlex: {
    flex: 0.8,
  },
  rightFlex: {
    flex: 0.2,
    ...Fonts.gothamBold,
    ...Fonts.subTag,
    color: Colors.mediumGray,
    letterSpacing: 0.25,
    lineHeight: 15,
    textAlign: 'right',
    position: 'relative',
    left: 0,
    top: isTableted ? 10 : 10.41,
  },
  iconEyes: {
    height: isTableted ? 32 : 15, 
    width: isTableted ? 20 : 23, 
    marginHorizontal: 8,
  },
  iconCalendar: {
    height: 25, 
    width: 25, 
    marginHorizontal: 8,
    marginTop: isTableted ? 17 : 12.5
  }
};

// Make the Component available to other parts of the application
export {TextAreaCustom};
