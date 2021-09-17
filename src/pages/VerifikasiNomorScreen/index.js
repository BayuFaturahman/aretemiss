import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';



import styles from './styles';
import { TextInputOTP, Spinner } from '../../components';
import { Colors } from '../../themes';
import OtpInputs from 'react-native-otp-inputs';

//Redux Library
import {connect} from 'react-redux';

import * as Animatable from 'react-native-animatable';
import { loginVerifyActions, signupVerifyActions } from '../../actions';

// Create a component
class VerifikasiHP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      hpVerifikasi: '',
      errorHpVerifikasi: '',
    }
  }

  componentDidUpdate = (prevProps,prevState) => {
    if(this.props.loginResponseVerify != prevProps.loginResponseVerify){
      if (this.props.loginResponseVerify && this.props.loginResponseVerify.message == "Login successful"){
        this.props.navigation.navigate('Home');
      }else if(this.props.loginResponseVerify && this.props.loginResponseVerify.errorCode == 7){
        this.setState({errorEmail: 'Waduh. Nomor hp atau password yang kamu masukan salah. Coba cek kembali nomor hapemu dan password mu!'})
      }
    }else if(this.props.signupResponseVerify != prevProps.signupResponseVerify){
      if (this.props.signupResponseVerify && this.props.signupResponseVerify.message == "Registration successful"){
        this.props.navigation.navigate('Register');
      }
    }
  }
  changeValue = async (type, value) => {
    if (type === 'hpVerifikasi') {
      if(value.length == 4){
        this.submit()
      }
      await this.setState({
        hpVerifikasi: value,
        errorHpVerifikasi: '',
      });
    } 
  };

  submit = async () => {
    if(this.state.hpVerifikasi == '') {
      await this.setState({
        errorEmail: 'Waduh. Kamu harus masukan nomor hp!',
      });
    } else {
      await this.setState({
        errorHpVerifikasi: '',
      });

      if(this.props.loginrequest != null ){
        const params = await {
          "phoneNumber": this.props.phoneNumber,
          "otpCode": this.state.hpVerifikasi,
          "userId": this.props.userId,
          "otpHash": this.props.otpHash
        }
        this.props.loginVerifyActions(params)
      }else{
        const params = await {
          "phoneNumber": this.props.phoneNumber,
          "otpCode": this.state.hpVerifikasi,
          "otpHash": this.props.otpHash
        }
        this.props.signupVerifyActions(params)
      }

    }
  }
  render() {
    return (
      <React.Fragment>
        <View style={styles.parentContainer}>
          <StatusBar backgroundColor="#FFFFFF" barStyle="light-content" />
          <SafeAreaView>
            <View
              style={styles.scrollView}>
              <Animatable.View
                style={styles.bottomContent}
                animation="fadeInUpBig">
                <View>
                  <Text
                    style={styles.normalLabelStyles}>
                    Selamat datang di iLEAD.
                  </Text>
                </View>
                <View style={styles.line}/>
                <View style={styles.descContent}>
                <View>
                  <Text
                    style={styles.normalLabelStyles}>
                      Berhasil! Kami sudah mengirimkan 4 digit nomor
                  </Text>
                  <Text
                    style={styles.normalLabelStyles}>
                      verifikasi melalui SMS ke nomor hapemu.
                  </Text>
                </View>
                </View>
                {/* <TextInputOTP
                  keyboardType="default"
                  label="No HP:"
                  value={this.state.hpVerifikasi}
                  onChangeText={(e) => this.changeValue('hpVerifikasi', e)}
                  onKeyPress={false}
                  format={false}
                  keyboardType="Numeric"
                  error={this.state.errorHpVerifikasi}
                /> */}
                 <OtpInputs
                    handleChange={(code) => this.changeValue('hpVerifikasi', code)}
                    numberOfInputs={4}
                    inputStyles={{
                      fontSize: 22, 
                      textAlign: 'center'
                    }}
                    inputContainerStyles={{
                      borderColor: "grey", 
                      borderWidth: 1, 
                      justifyContent:'center',
                      margin: 15, 
                      height: 62, 
                      width: 62,
                      borderRadius: 10
                    }}
                    keyboardType="Numeric"
                  />
                <View style={styles.buttonSignin}>
                  <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => { this.submit() }}>
                    <Text
                      style={styles.textSign}>
                      Verifikasi nomor ini
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => { this.props.navigation.navigate('Landing');}}>
                    <Text
                      style={[styles.textSign, {color: Colors.blueLightiLeads}]}>
                      Kirim ulang SMS verifikasi 
                    </Text>
                </TouchableOpacity>
                <Animatable.Image
                  animation="bounceIn"
                  duraton="1500"
                  source={require('../../assets/icons/ilead-bottom-logo.png')}
                  style={styles.logo}
                />
              </Animatable.View>
            </View>
          </SafeAreaView>
          {this.props.spinner && (
            <View style={styles.spinnerContainer}>
              <Spinner />
            </View>
          )}
        </View>
      </React.Fragment>
    );
  }
}

// Method to get the Global State Object
const mapStateToProps = (state) => {
  return {
    userId: state.authentication.userId,
    otpHash: state.authentication.otpHash,
    loginrequest: state.authentication.loginrequest,
    signuprequest: state.authentication.signuprequest,
    loginResponseVerify: state.authentication.loginResponseVerify,
    signupResponseVerify: state.authentication.signupResponseVerify,
    spinner: state.authentication.spinner,
    phoneNumber: state.authentication.phoneNumber
  };
};

// Method to dispatch Actions
const mapDispatchToProps = (dispatch) => ({
  loginVerifyActions: (value) => dispatch(loginVerifyActions(value)),
  signupVerifyActions: (value) => dispatch(signupVerifyActions(value)),
});

// Make the Component available to other parts of the application
export default connect(mapStateToProps, mapDispatchToProps)(VerifikasiHP);
