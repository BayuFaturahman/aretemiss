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
import { TextInputCustom, Spinner } from '../../components';
import { Colors } from '../../themes';

//Redux Library
import {connect} from 'react-redux';

import * as Animatable from 'react-native-animatable';
import { signupactions } from '../../actions';

// Create a component
class VerifikasiHP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      hpVerifikasi: '',
      hp: '',
      errorPassword: '',
      errorHpVerifikasi: '',
      errorHp: ''
    }
  }
  componentDidUpdate = (prevProps, prevState) => {
    if(this.props.signupResponse != prevProps.signupResponse){
      if (this.props.signupResponse && this.props.signupResponse.message == "Pre-Registration Successful"){
        this.props.navigation.navigate('VerifikasiNomor'); 
      }
    }
  }

changeValue = async (type, value) => {
    if (type === 'password') {
      await this.setState({
        password: value,
        errorPassword: '',
      });
    } else if (type === 'hpVerifikasi') {
      await this.setState({
        hpVerifikasi: value,
        errorHpVerifikasi: '',
      });
    }else if (type === 'hp') {
      await this.setState({
        hp: value,
        errorHp: '',
      });
    }
  };

  submit = async () => {
    if(this.state.hp == ''){
      await this.setState({
        errorHp: 'Waduh. Kamu harus masukan nomor hp!',
      });
    }else if (this.state.hpVerifikasi != this.state.hp || this.state.hpVerifikasi == '') {
      await this.setState({
        errorHpVerifikasi: 'Waduh. Nomor telepon ini tidak benar. Pastikan semua yang dimasukan ke dalam kolom berupa angka (0-9), tanpa ada tambahan karakter lainnya.',
      });
    }else if (this.state.password == '') {
      await this.setState({
        errorPassword: 'Waduh. Kamu harus masukan password!',
      });
    }else{
      await this.setState({
        errorHp: '',
        errorHpVerifikasi: '',
        errorPassword: '',
      });
      const params = await {
        "phoneNumber": this.state.hpVerifikasi,
        "password": this.state.password
      }
      this.props.signupactions(params)
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
                <Text
                      style={styles.errorLabelStyles}>
                      {this.state.errorHp || this.state.errorHpVerifikasi || this.state.errorPassword}
                  </Text>
                </View>
                <TextInputCustom
                  keyboardType="Numeric"
                  label="No HP:"
                  value={this.state.hp}
                  onChangeText={(e) => this.changeValue('hp', e)}
                  onKeyPress={false}
                  format={false}
                  error={this.state.errorHp}
                />
                <TextInputCustom
                  keyboardType="Numeric"
                  label="Masukan no. HP yang sudah digunakan"
                  value={this.state.hpVerifikasi}
                  onChangeText={(e) => this.changeValue('hpVerifikasi', e)}
                  onKeyPress={false}
                  format={false}
                  error={this.state.errorHpVerifikasi}
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
                    onPress={() => {this.submit()}}>
                    <Text
                      style={styles.textSign}>
                      Kirim SMS Verifikasi
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => { this.props.navigation.navigate('Landing');}}>
                    <Text
                      style={[styles.textSign, {color: Colors.blueLightiLeads}]}>
                      Kembali ke Halaman Awal
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
    signupResponse: state.authentication.signupResponse,
    spinner: state.authentication.spinner
  };
};

// Method to dispatch Actions
const mapDispatchToProps = (dispatch) => ({
  signupactions: (value) => dispatch(signupactions(value)),
  resetAuth: (value) => dispatch(resetAuth(value)),
});

// Make the Component available to other parts of the application
export default connect(mapStateToProps, mapDispatchToProps)(VerifikasiHP);
