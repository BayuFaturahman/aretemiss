import React, {Component} from 'react';
import {Text, TextInput, View, Image} from 'react-native';
import {Colors, Fonts, ApplicationStyles} from '../../themes';
import {isTableted} from '../../common/utils';
import Utils from '../../common/utils';

class TextInputOTP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
      char1: null,
      char2: null,
      char3: null,
      char4: null,
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
  onChangeValue = (value, type) => {
    // if(this.state[type].length == 1 ){
    //   this.setState({[type]: value});
    // }else{
      this.setState({[type]: value});
    // }
    if(type == 'char4'){
      this.props.onChangeText(`${this.state.char1}${this.state.char2}${this.state.char3}${value}`)
      console.log(`${this.state.char1}${this.state.char2}${this.state.char3}${value}`)
    }else{
      this.props.onChangeText(`${this.state.char1}${this.state.char2}${this.state.char3}`)
      console.log(`${this.state.char1}${this.state.char2}${this.state.char3}`)
    }
  }

  render() {
  return (
      <View style={{width: '100%' }}>
        <View style={[styles.flexHorizontal, styles.justifyAlignCenter]}>
            <Text
              style={[
                styles.leftFlex,
                [styles.normalLabelStyles],
                {
                  color:
                    this.props.error && this.props.error != ''
                      ? Colors.dangerRed
                      : Colors.mediumGray,
                 
                },
              ]}>
              Masukan 4 digit nomor dari sms verifikasi:
            </Text>
        </View>
        <View style={[styles.flexHorizontal, styles.justifyAlignCenter]}>
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
            <View style={{width: 32}}>
                <TextInput
                  {...this.props}
                  allowFontScaling={false}
                  placeholder={''}
                  autoFocus={this.state.isFocused}
                  keyboardType={this.props.keyboardType}
                  value={this.state.char1}
                  onChangeText={(e) => this.onChangeValue(e, 'char1')}
                  autoCapitalize = 'none'
                  textContentType="telephoneNumber"
                  maxLength={1}
                  style={
                    Utils.isIOS() ? styles.iosTextInput : styles.androidTextInput
                  }
                />
              </View>
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
            <View style={{width: 32}}>
              <TextInput
                {...this.props}
                allowFontScaling={false}
                placeholder={''}
                autoFocus={this.state.isFocused}
                keyboardType={this.props.keyboardType}
                value={this.state.char2}
                onChangeText={(e) => this.onChangeValue(e, 'char2')}
                autoCapitalize = 'none'
                textContentType="telephoneNumber"
                maxLength={1}
                style={
                  Utils.isIOS() ? styles.iosTextInput : styles.androidTextInput
                }
              />
            </View>
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
            <View style={{width: 32}}>
                <TextInput
                  {...this.props}
                  allowFontScaling={false}
                  placeholder={''}
                  onBlur={this.textInputOnBlur}
                  autoFocus={this.state.isFocused}
                  keyboardType={this.props.keyboardType}
                  value={this.state.char3}
                  onChangeText={(e) => this.onChangeValue(e, 'char3')}
                  autoCapitalize = 'none'
                  textContentType="telephoneNumber"
                  maxLength={1}
                  style={
                    Utils.isIOS() ? styles.iosTextInput : styles.androidTextInput
                  }
                />
            </View>
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
            <View style={{width: 32}}>
                <TextInput
                  {...this.props}
                  allowFontScaling={false}
                  placeholder={''}
                  onBlur={this.textInputOnBlur}
                  autoFocus={this.state.isFocused}
                  keyboardType={this.props.keyboardType}
                  value={this.state.char4}
                  onChangeText={(e) => this.onChangeValue(e, 'char4')}
                  autoCapitalize = 'none'
                  textContentType="telephoneNumber"
                  maxLength={1}
                  style={
                    Utils.isIOS() ? styles.iosTextInput : styles.androidTextInput
                  }
                />
            </View>
          </View>
        </View>
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
    height: isTableted ? 74 : 62,
    paddingLeft: 16,
    flexDirection: 'row',
    borderRadius: 10,
    marginBottom: 16,
    width: isTableted ? 74 : 62,
    marginRight: 16,
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
    fontSize: Fonts.subTitle.fontSize,
    height: isTableted ? 64 : 52,
    lineHeight: isTableted ? 43 : 33,
    width: isTableted ? 64 : 52,
  },
  androidTextInput: {
    fontSize: Fonts.subTitle.fontSize,
    height: isTableted ? 64 : 52,
    lineHeight: isTableted ? 43 : 33,
    width: isTableted ? 64 : 52,
  },
  normalLabelStyles: {
    ...Fonts.description,
    color: Colors.blueLightiLeads,
  },
  leftFlex: {
    flex: 1,
    marginBottom: 8
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
export {TextInputOTP};
