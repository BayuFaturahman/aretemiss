import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import {loginActions, loginFailed} from '../../actions/index';


import styles from './styles';

//Redux Library
import {connect} from 'react-redux';

import * as Animatable from 'react-native-animatable';
import { TextInputCustom, Spinner } from '../../components';
import { Colors } from '../../themes';

// Create a component
class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      email: '',
      errorPassword: '',
      errorEmail: '',
      registerButton: false
    }
  }
  componentDidUpdate = (prevProps, prevState) => {
    if(this.props.loginResponse != prevProps.loginResponse){
      if (this.props.loginResponse && this.props.loginResponse.message == "Pre-Login Success"){
        this.props.navigation.navigate('VerifikasiNomor'); 
      }else if(this.props.loginResponse != null && this.props.loginResponse.errorCode == '15'){
        this.setState({errorEmail: 'Waduh. Nomor hp atau password yang kamu masukan salah. Coba cek kembali nomor hapemu dan password mu!'})
      }else if(this.props.loginResponse != null && this.props.loginResponse.errorCode == 10){
        this.setState({registerButton: true})
      } 
    }
  }

  componentWillUnmount = () => {
    this.setState({registerButton: false})
  }
  
  changeValue = async (type, value) => {
    if (type === 'email') {
      await this.setState({
        email: value,
        errorEmail: '',
      });
    } else if (type === 'password') {
      await this.setState({
        password: value,
        errorPassword: '',
      });
    }
  };
  submit = async () => {
    if(this.state.email == ''){
      await this.setState({
        errorEmail: 'Waduh. Kamu harus masukan nomor hp!',
      });
    }else if (this.state.password == '') {
      await this.setState({
        errorPassword: 'Waduh. Kamu harus masukan password!',
      });
    }else{
      await this.setState({
        errorEmail: '',
        errorPassword: '',
      });
      const params = await {
        "phoneNumber": this.state.email,
        "password": this.state.password
      }
      this.props.loginApi(params)
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
                  <Text style={styles.errorLabelStyles}>
                      {this.state.errorEmail || this.state.errorPassword}
                  </Text>
                </View>
                <TextInputCustom
                  keyboardType="Numeric"
                  label="Masukan no. HP yang sudah digunakan"
                  value={this.state.email}
                  onChangeText={(e) => this.changeValue('email', e)}
                  onKeyPress={false}
                  format={false}
                  error={this.state.errorEmail}
                />
                <TextInputCustom
                  keyboardType="default"
                  label="Password"
                  value={this.state.password}
                  onChangeText={(e) => this.changeValue('password', e)}
                  onKeyPress={false}
                  format={false}
                  error={this.state.errorPassword}
                />

                <View style={styles.buttonSignin}>
                  <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => { this.submit() }}>
                    <Text
                      style={styles.textSign}>
                      Login
                    </Text>
                  </TouchableOpacity>
                </View>
                {this.state.registerButton == false ? <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => { this.props.navigation.navigate('ForgotPassword'); }}>
                    <Text
                      style={[styles.textSign, {color: Colors.blueLightiLeads}]}>
                      Lupa password
                    </Text>
                </TouchableOpacity>:
                <TouchableOpacity
                style={styles.signIn}
                onPress={() => { this.props.navigation.navigate('VerifikasiHP'); }}>
                <Text
                  style={[styles.textSign, {color: Colors.blueLightiLeads}]}>
                  Register
                </Text>
            </TouchableOpacity>}
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
    loginResponse: state.authentication.loginResponse,
    spinner: state.authentication.spinner
  };
};

// Method to dispatch Actions
const mapDispatchToProps = (dispatch) => ({
  loginApi: (value) => dispatch(loginActions(value)),
  resetAuth: (value) => dispatch(resetAuth(value)),
});

// Make the Component available to other parts of the application
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
